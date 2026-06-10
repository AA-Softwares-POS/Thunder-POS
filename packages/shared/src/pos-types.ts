// Shared interfaces for modules
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Sale {
  id: string;
  customerId: string;
  items: { productId: string; quantity: number }[];
  total: number;
}
