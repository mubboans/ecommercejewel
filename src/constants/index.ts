// Jewelry categories
export const PRODUCT_CATEGORIES = [
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Pendants',
  'Anklets',
  'Hair Accessories',
  'Brooches',
  'Sets',
  'Customized',
] as const;

// Jewelry materials
export const JEWELRY_MATERIALS = [
  'Gold Plated',
  'Silver',
  'Rose Gold',
  'Copper',
  'Brass',
  'Beads',
  'Gemstones',
  'Crystals',
  'Pearls',
  'Wire Work',
] as const;

// Jewelry styles
export const JEWELRY_STYLES = [
  'Bohemian',
  'Vintage',
  'Contemporary',
  'Traditional',
  'Minimalist',
  'Statement',
  'Ethnic',
  'Art Deco',
  'Nature Inspired',
  'Geometric',
] as const;

// Order statuses
export const ORDER_STATUSES = {
  CREATED: 'created',
  PAID: 'paid',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.CREATED]: 'Order Created',
  [ORDER_STATUSES.PAID]: 'Payment Completed',
  [ORDER_STATUSES.CONFIRMED]: 'Order Confirmed',
  [ORDER_STATUSES.PROCESSING]: 'Processing',
  [ORDER_STATUSES.SHIPPED]: 'Shipped',
  [ORDER_STATUSES.DELIVERED]: 'Delivered',
  [ORDER_STATUSES.CANCELLED]: 'Cancelled',
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  AUTH: '/api/auth',
  PAYMENTS: '/api/payments',
  ADMIN: '/api/admin',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

// Price formatting
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  LOCALE: 'en-IN',
} as const;

// Shipping costs
export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 500,
  STANDARD_SHIPPING_COST: 50,
  EXPRESS_SHIPPING_COST: 100,
} as const;

// Tax rates
export const TAX = {
  GST_RATE: 0.18, // 18% GST
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Session configuration
export const SESSION = {
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days
} as const;

// Rate limiting
export const RATE_LIMITS = {
  AUTH_WINDOW: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_ATTEMPTS: 5,
  API_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_MAX_REQUESTS: 100,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'An internal server error occurred',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  PAYMENT_FAILED: 'Payment processing failed',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_CREATED: 'Order placed successfully',
  ORDER_UPDATED: 'Order updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;

// Default product images (placeholder)
export const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: '#',
  TWITTER: '#',
  INSTAGRAM: '#',
  LINKEDIN: '#',
} as const;

// Contact information
export const CONTACT_INFO = {
  EMAIL: 'support@ecommerce.com',
  PHONE: '+91-9833259443 / 9004811338',
  ADDRESS: '123 Main Street, City, State, 12345',
} as const;

// SEO defaults
export const SEO = {
  SITE_NAME: 'DILARAA',
  SITE_DESCRIPTION: 'Handcrafted jewelry made with love - Unique, beautiful, and personalized pieces for every occasion',
  SITE_KEYWORDS: 'handmade jewelry, artisan jewelry, custom jewelry, rings, necklaces, earrings, bracelets, handcrafted accessories',
  DEFAULT_IMAGE: '/images/og-image.jpg',
} as const;
