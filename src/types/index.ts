/* eslint-disable @typescript-eslint/no-explicit-any */

import { Document } from 'mongoose';
export interface IAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Omit<Document, '_id'> {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatar?: string;
  addresses?: IAddress[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  preferences?: {
    newsletter?: boolean;
    smsNotifications?: boolean;
    emailNotifications?: boolean;
    favoriteCategories?: string[];
  };
  loyaltyPoints?: number;
  totalSpent?: number;
  orderCount?: number;
  lastLoginAt?: Date;
  lastLoginIP?: string;
  loginCount?: number;
  googleId?: string;
  facebookId?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  image?: string,
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Omit<Document, '_id'> {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  slug: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrderLog {
  status: OrderStatus;
  message: string;
  timestamp: Date;
  updatedBy?: string;
}

export type OrderStatus =
  | 'created'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'refunded'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface IOrder extends Document {
  //   _id: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'stripe' | 'razorpay';
  paymentIntentId?: string;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logs: IOrderLog[];
  trackingNumber?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  orderNumber: string;
  shippedAt?: Date;
  paidAt?: Date;
  refundedAt?: Date;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  discount: number;
  discountCode?: string;
  taxRate: number;
  shippingMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;

}

export interface IAnalytics {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: IOrder[];
  topProducts: Array<{
    product: IProduct;
    soldQuantity: number;
    revenue: number;
  }>;
}

// Form types
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  featured: boolean;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Cart Context types
export interface CartState {
  items: ICartItem[];
  total: number;
  itemCount: number;
}

export interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  payload?: any;
}

// Auth types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}