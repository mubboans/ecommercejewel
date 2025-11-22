import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number; // in cents
    quantity: number;
    image: string;
}

export interface IShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface IPaymentInfo {
    method: 'razorpay' | 'stripe' | 'cod';
    paymentId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    amount: number;
    currency: string;
}

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface ICustomerInfo {
    name: string;
    email: string;
    phone: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    userId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    status: OrderStatus;
    customerInfo?: ICustomerInfo;
    shippingAddress: IShippingAddress;
    billingAddress?: IShippingAddress;
    paymentInfo: IPaymentInfo;
    shippingMethod: string;
    notes?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }
});

const CustomerInfoSchema = new Schema<ICustomerInfo>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
});

const PaymentInfoSchema = new Schema<IPaymentInfo>({
    method: {
        type: String,
        enum: ['razorpay', 'stripe', 'cod'],
        required: true
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
});

const OrderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    customerInfo: { type: CustomerInfoSchema },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    billingAddress: { type: ShippingAddressSchema },
    paymentInfo: { type: PaymentInfoSchema, required: true },
    shippingMethod: { type: String, required: true },
    notes: { type: String },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date }
}, {
    timestamps: true
});

// Generate order number before saving
// OrderSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         const date = new Date();
//         const timestamp = date.getTime().toString().slice(-6);
//         const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//         this.orderNumber = `ORD-${timestamp}${random}`;
//     }
//     next();
// });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);