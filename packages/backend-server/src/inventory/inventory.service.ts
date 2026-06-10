import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, StockAdjustmentDto, StockAdjustmentType } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // --- Category Management ---
  async createCategory(companyId: string, data: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: { ...data, companyId },
      });
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('Category name already exists in this company');
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAllCategories(companyId: string) {
    return this.prisma.category.findMany({ where: { companyId } });
  }

  // --- Product Management ---
  async createProduct(companyId: string, data: CreateProductDto, actorId: string) {
    const { stock, ...productData } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // Check SKU uniqueness
      const existing = await tx.product.findUnique({
        where: { sku_companyId: { sku: data.sku, companyId } }
      });
      if (existing) throw new ConflictException('SKU already exists');

      const product = await tx.product.create({
        data: { ...productData, companyId, stock: stock || 0 },
      });

      if (stock && stock > 0) {
        await tx.stockHistory.create({
          data: {
            productId: product.id,
            type: StockAdjustmentType.IN,
            quantity: stock,
            prevStock: 0,
            newStock: stock,
            reason: 'Initial stock',
            actorId,
          },
        });
      }

      return product;
    });
  }

  async findAllProducts(companyId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { companyId, deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, page, limit, items };
  }

  async updateProduct(id: string, companyId: string, data: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: { id, companyId },
        data,
      });
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async deleteProduct(id: string, companyId: string) {
    try {
      return await this.prisma.product.update({
        where: { id, companyId },
        data: { deletedAt: new Date(), isActive: false },
      });
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  // --- Stock Management ---
  async adjustStock(productId: string, companyId: string, data: StockAdjustmentDto, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId, companyId }
      });

      if (!product || product.deletedAt) throw new NotFoundException('Product not found');

      let newStock = product.stock;
      if (data.type === StockAdjustmentType.IN) {
        newStock += data.quantity;
      } else if (data.type === StockAdjustmentType.OUT || data.type === StockAdjustmentType.ADJUSTMENT) {
        newStock = data.type === StockAdjustmentType.OUT ? product.stock - data.quantity : data.quantity;
      }

      if (newStock < 0) throw new BadRequestException('Stock cannot go below zero');

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      await tx.stockHistory.create({
        data: {
          productId,
          type: data.type,
          quantity: data.quantity,
          prevStock: product.stock,
          newStock: newStock,
          reason: data.reason,
          actorId,
        },
      });

      return updatedProduct;
    });
  }

  // Reusable function for Billing Engine
  async reduceStockForSale(tx: any, productId: string, quantity: number, actorId: string) {
    const product = await tx.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.deletedAt) throw new NotFoundException(`Product ${productId} not found`);
    if (product.stock < quantity) throw new BadRequestException(`Insufficient stock for ${product.name}`);

    const newStock = product.stock - quantity;

    await tx.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });

    await tx.stockHistory.create({
      data: {
        productId,
        type: StockAdjustmentType.OUT,
        quantity,
        prevStock: product.stock,
        newStock: newStock,
        reason: 'Sale deduction',
        actorId,
      },
    });
  }
}
