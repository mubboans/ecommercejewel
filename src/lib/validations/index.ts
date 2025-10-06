import { z } from 'zod';

// Auth validation schemas
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Password is required'),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim(),
  description: z.string()
    .min(1, 'Product description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .max(999999, 'Price cannot exceed 999,999'),
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  category: z.string()
    .min(1, 'Category is required')
    .trim(),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  featured: z.boolean().optional().default(false),
});

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().min(1, 'Product ID is required'),
});

// Order validation schemas
export const checkoutSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^\+?[\d\s-()]+$/, 'Please provide a valid phone number')
    .trim(),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters')
    .trim(),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City cannot exceed 50 characters')
    .trim(),
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State cannot exceed 50 characters')
    .trim(),
  zipCode: z.string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code cannot exceed 10 characters')
    .trim(),
  country: z.string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country cannot exceed 50 characters')
    .trim()
    .default('India'),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  image: z.string().url('Invalid image URL'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  subtotal: z.number().min(0, 'Subtotal cannot be negative'),
  tax: z.number().min(0, 'Tax cannot be negative').default(0),
  shipping: z.number().min(0, 'Shipping cost cannot be negative').default(0),
  total: z.number().min(0, 'Total cannot be negative'),
  paymentMethod: z.enum(['stripe', 'razorpay']),
  shippingAddress: checkoutSchema,
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.enum(['created', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  message: z.string().optional(),
});

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Maximum quantity is 99'),
});

export const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(99, 'Maximum quantity is 99'),
});

// User validation schemas
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim()
    .optional(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim()
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password cannot exceed 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 10, 50)),
});

export const productQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().transform(val => parseFloat(val) || 0).optional(),
  maxPrice: z.string().transform(val => parseFloat(val) || Infinity).optional(),
  sort: z.enum(['name', 'price', 'createdAt', '-name', '-price', '-createdAt']).optional().default('-createdAt'),
  featured: z.string().transform(val => val === 'true').optional(),
});

export const orderQuerySchema = paginationSchema.extend({
  status: z.enum(['created', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  userId: z.string().optional(),
  sort: z.enum(['createdAt', '-createdAt', 'total', '-total']).optional().default('-createdAt'),
});

// Admin validation schemas
export const adminCreateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Export type definitions
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;