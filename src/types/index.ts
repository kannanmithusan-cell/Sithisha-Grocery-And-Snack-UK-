export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName?: string;
  images: string[]; // Strict limit <= 4
  cloudinaryPublicIds?: string[]; // Strict limit <= 4
  stock: number;
  sku?: string;
  tags?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  weight?: string;
  unit?: string;
  active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  shapeType?: 'arch' | 'organic' | 'ticket' | 'editorial' | 'rounded';
  active: boolean;
  displayOrder: number;
  productCount?: number;
  createdAt?: string | Date;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface IOrder {
  _id?: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  deliveryInstructions?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  whatsappSent: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ISettings {
  _id?: string;
  storeName: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  currency: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'admin' | 'user';
  createdAt?: string | Date;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string; // 'under-5' | '5-10' | '10-20' | '20-plus'
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'best-selling';
  page?: number;
  limit?: number;
}
