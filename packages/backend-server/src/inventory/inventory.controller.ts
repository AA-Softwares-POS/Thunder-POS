import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Request, UsePipes, ValidationPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, StockAdjustmentDto } from './dto/inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // --- Categories ---
  @Post('categories')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Request() req, @Body() data: CreateCategoryDto) {
    return this.inventoryService.createCategory(req.user.companyId, data);
  }

  @Get('categories')
  async findAllCategories(@Request() req) {
    return this.inventoryService.findAllCategories(req.user.companyId);
  }

  // --- Products ---
  @Post('products')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Request() req, @Body() data: CreateProductDto) {
    return this.inventoryService.createProduct(req.user.companyId, data, req.user.sub);
  }

  @Get('products')
  async findAllProducts(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.inventoryService.findAllProducts(req.user.companyId, parseInt(page), parseInt(limit), search);
  }

  @Patch('products/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProduct(@Param('id') id: string, @Request() req, @Body() data: UpdateProductDto) {
    return this.inventoryService.updateProduct(id, req.user.companyId, data);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string, @Request() req) {
    return this.inventoryService.deleteProduct(id, req.user.companyId);
  }

  // --- Stock ---
  @Post('products/:id/adjust-stock')
  @UsePipes(new ValidationPipe({ transform: true }))
  async adjustStock(@Param('id') id: string, @Request() req, @Body() data: StockAdjustmentDto) {
    return this.inventoryService.adjustStock(id, req.user.companyId, data, req.user.sub);
  }
}
