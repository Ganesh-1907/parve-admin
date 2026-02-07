export interface Product {
  _id: string;
  id?: string; // For backwards compatibility
  productName: string;
  name?: string; // For backwards compatibility
  description: string;
  price: number;
  finalPrice?: number; // Calculated from backend
  category: 'facewash' | 'serums' | 'creams';
  stock: number;
  unit: string;
  images: string[];
  discount?: {
    percentage: number;
    startDate?: string;
    endDate?: string;
    isYearly?: boolean;
  };
  concerns?: string[];
  isActive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  products: { product: Product; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
