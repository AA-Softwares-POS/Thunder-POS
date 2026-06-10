import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, Min, IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

export enum StockAdjustmentType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export class StockAdjustmentDto {
  @IsEnum(StockAdjustmentType)
  type: StockAdjustmentType;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
