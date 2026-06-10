import { SyncableModel } from './base';

export interface Product extends SyncableModel {
  name: string;
  sku: string;
  barcode?: string | null;
  description?: string | null;
  price: number;
  cost: number;
  categoryId?: string | null;
  unit: string;
  stockCount: number;
  lowStockAlert: number;
  isService: boolean;
  isActive: boolean;
}

export interface Category extends SyncableModel {
  name: string;
  description?: string | null;
}

export interface Customer extends SyncableModel {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  creditLimit: number;
  balance: number;
  loyaltyPoints: number;
}

export interface Sale extends SyncableModel {
  customerId?: string | null;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  payableAmount: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'SPLIT';
  status: 'COMPLETED' | 'HOLD' | 'REFUNDED' | 'CANCELLED';
  notes?: string | null;
}

export interface SaleItem extends SyncableModel {
  saleId: string;
  productId: string;
  quantity: number;
  price: number;
  cost: number;
  discount: number;
  tax: number;
  subtotal: number;
}
