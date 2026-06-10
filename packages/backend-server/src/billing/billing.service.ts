import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  async createSale(companyId: string, cashierId: string, data: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const saleItemsData = [];

      // 1. Process items, validate stock, and calculate prices
      for (const item of data.items) {
        // We call reduceStockForSale which includes locking and stock check
        await this.inventoryService.reduceStockForSale(tx, item.productId, item.quantity, cashierId);

        const product = await tx.product.findUnique({
          where: { id: item.productId, companyId },
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }

        const itemSubtotal = Number(product.price) * item.quantity;
        subtotal += itemSubtotal;

        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          subtotal: itemSubtotal,
        });
      }

      // 2. Financial Calculations
      const taxAmount = subtotal * data.taxRate;
      const totalAmount = subtotal + taxAmount - data.discountAmount;

      if (totalAmount < 0) {
        throw new BadRequestException('Total amount cannot be negative');
      }

      // 3. Create Sale Record
      const sale = await tx.sale.create({
        data: {
          companyId,
          cashierId,
          subtotal,
          taxAmount,
          discountAmount: data.discountAmount,
          totalAmount,
          paymentMethod: data.paymentMethod,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, sku: true }
              }
            }
          }
        }
      });

      return sale;
    });
  }

  async getSaleById(id: string, companyId: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id, companyId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true }
            }
          }
        }
      }
    });

    if (!sale) throw new BadRequestException('Sale not found');
    return sale;
  }
}
