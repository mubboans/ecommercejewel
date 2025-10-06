import mongoose, { Schema } from 'mongoose';
import { IOrder, OrderStatus, PaymentStatus } from '@/types';

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
}, { _id: false });

const ShippingAddressSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'India',
  },
}, { _id: false });

const OrderLogSchema = new Schema({
  status: {
    type: String,
    enum: ['created', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    default: 'system',
  },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    // Order ID for customer reference
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Customer information at time of order
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    
    items: [OrderItemSchema],
    
    // Pricing breakdown
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountCode: {
      type: String,
      trim: true,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0.18, // 18% GST
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard',
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Order status tracking
    status: {
      type: String,
      enum: ['created', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
      default: 'created',
    },
    
    // Payment information
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'cod'],
      required: true,
    },
    
    // Razorpay specific fields
    razorpayOrderId: {
      type: String,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
      sparse: true,
    },
    
    // Stripe specific fields (keeping for flexibility)
    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },
    
    // Payment details
    paidAt: {
      type: Date,
    },
    paymentFailureReason: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
    
    // Addresses
    shippingAddress: ShippingAddressSchema,
    billingAddress: ShippingAddressSchema,
    
    // Shipping and delivery
    shippingCarrier: {
      type: String,
    },
    trackingNumber: {
      type: String,
      sparse: true,
    },
    trackingUrl: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    deliveryAttempts: {
      type: Number,
      default: 0,
    },
    
    // Customer service
    notes: {
      type: String,
      maxlength: 1000,
    },
    internalNotes: {
      type: String,
      maxlength: 1000,
    },
    customerNotes: {
      type: String,
      maxlength: 500,
    },
    
    // Special requirements
    giftWrap: {
      type: Boolean,
      default: false,
    },
    giftMessage: {
      type: String,
      maxlength: 200,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    
    // Analytics and tracking
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin'],
      default: 'web',
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
      country: String,
      city: String,
    },
    
    // Return and exchange
    returnEligible: {
      type: Boolean,
      default: true,
    },
    returnWindow: {
      type: Number,
      default: 30, // days
    },
    returnRequestedAt: {
      type: Date,
    },
    returnReason: {
      type: String,
    },
    
    // Inventory management
    inventoryReserved: {
      type: Boolean,
      default: false,
    },
    inventoryReleaseDate: {
      type: Date,
    },
    
    logs: [OrderLogSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ razorpayOrderId: 1 });
OrderSchema.index({ razorpayPaymentId: 1 });
OrderSchema.index({ stripePaymentIntentId: 1 });
OrderSchema.index({ trackingNumber: 1 });
OrderSchema.index({ 'customerInfo.email': 1 });
OrderSchema.index({ 'customerInfo.phone': 1 });

// Generate order number before saving
OrderSchema.pre('save', function (next) {
  // Generate order number for new orders
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  
  // Handle status changes
  if (this.isModified('status')) {
    const statusMessages = {
      created: 'Order created successfully',
      paid: 'Payment completed',
      confirmed: 'Order confirmed',
      processing: 'Order is being processed',
      shipped: 'Order has been shipped',
      delivered: 'Order delivered successfully',
      cancelled: 'Order has been cancelled',
      returned: 'Order has been returned',
      refunded: 'Order has been refunded',
    };

    this.logs.push({
      status: this.status as OrderStatus,
      message: statusMessages[this.status as OrderStatus] || 'Status updated',
      timestamp: new Date(),
      updatedBy: 'system',
    });

    // Auto-set timestamps based on status
    if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
    
    if (this.status === 'shipped' && !this.shippedAt) {
      this.shippedAt = new Date();
    }
    
    if (this.status === 'paid' && !this.paidAt) {
      this.paidAt = new Date();
      this.paymentStatus = 'completed';
    }
    
    if (this.status === 'refunded' && !this.refundedAt) {
      this.refundedAt = new Date();
      this.paymentStatus = 'refunded';
    }
  }
  
  // Handle payment status changes
  if (this.isModified('paymentStatus') && this.paymentStatus === 'completed' && !this.paidAt) {
    this.paidAt = new Date();
  }
  
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);