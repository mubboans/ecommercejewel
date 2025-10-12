/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrder, OrderStatus } from "@/types";

// 🔹 Define sub-schemas with correct typing
const OrderItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
    },
    { _id: false }
);

const ShippingAddressSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true, default: "India" },
    },
    { _id: false }
);

const OrderLogSchema = new Schema(
    {
        status: {
            type: String,
            enum: [
                "created",
                "paid",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
                "refunded",
            ],
            required: true,
        },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: String, default: "system" },
    },
    { _id: false }
);

// 🔹 Extend the IOrder interface to include Document
export interface IOrderDocument extends Exclude<IOrder, "_id">, Document { }

const OrderSchema = new Schema<IOrderDocument | any>(
    {
        orderNumber: { type: String, unique: true, required: true },

       userId: { type: mongoose.Schema.Types.ObjectId as unknown as typeof String, ref: 'User', required: true },


        customerInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },

        items: [OrderItemSchema],
        subtotal: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0 },
        discountCode: String,
        tax: { type: Number, required: true, default: 0 },
        taxRate: { type: Number, default: 0.18 },
        shipping: { type: Number, required: true, default: 0 },
        shippingMethod: {
            type: String,
            enum: ["standard", "express", "overnight"],
            default: "standard",
        },
        total: { type: Number, required: true, min: 0 },

        status: {
            type: String,
            enum: [
                "created",
                "paid",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
                "refunded",
            ],
            default: "created",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded", "partially_refunded"],
            default: "pending",
        },

        paymentMethod: {
            type: String,
            enum: ["razorpay", "stripe", "cod"],
            required: true,
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        stripePaymentIntentId: String,

        paidAt: Date,
        paymentFailureReason: String,
        refundAmount: { type: Number, default: 0 },
        refundReason: String,
        refundedAt: Date,

        shippingAddress: ShippingAddressSchema,
        billingAddress: ShippingAddressSchema,

        shippingCarrier: String,
        trackingNumber: String,
        trackingUrl: String,
        estimatedDeliveryDate: Date,
        shippedAt: Date,
        deliveredAt: Date,
        deliveryAttempts: { type: Number, default: 0 },

        notes: String,
        internalNotes: String,
        customerNotes: String,
        giftWrap: { type: Boolean, default: false },
        giftMessage: String,
        isUrgent: { type: Boolean, default: false },

        source: { type: String, enum: ["web", "mobile", "admin"], default: "web" },
        deviceInfo: {
            userAgent: String,
            ip: String,
            country: String,
            city: String,
        },

        returnEligible: { type: Boolean, default: true },
        returnWindow: { type: Number, default: 30 },
        returnRequestedAt: Date,
        returnReason: String,

        inventoryReserved: { type: Boolean, default: false },
        inventoryReleaseDate: Date,

        logs: [OrderLogSchema],
    },
    {
        timestamps: true,
        toJSON: {
            transform(_: unknown, ret: Record<string, any>) {
                delete ret.__v; // ✅ no more TypeScript error
                return ret;
            },
          },
    }
);

OrderSchema.pre<IOrderDocument>("save", function (next) {
    if (this.isNew && !this.orderNumber) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }

    if (this.isModified("status")) {
        const statusMessages: Record<OrderStatus, string> = {
            created: "Order created successfully",
            paid: "Payment completed",
            confirmed: "Order confirmed",
            processing: "Order is being processed",
            shipped: "Order has been shipped",
            delivered: "Order delivered successfully",
            cancelled: "Order has been cancelled",
            returned: "Order has been returned",
            refunded: "Order has been refunded",
        };

        this.logs.push({
            status: this.status,
            message: statusMessages[this.status] || "Status updated",
            timestamp: new Date(),
            updatedBy: "system",
        });

        if (this.status === "delivered" && !this.deliveredAt)
            this.deliveredAt = new Date();
        if (this.status === "shipped" && !this.shippedAt)
            this.shippedAt = new Date();
        if (this.status === "paid" && !this.paidAt) {
            this.paidAt = new Date();
            this.paymentStatus = "completed";
        }
        if (this.status === "refunded" && !this.refundedAt) {
            this.refundedAt = new Date();
            this.paymentStatus = "refunded";
        }
    }

    if (this.isModified("paymentStatus") && this.paymentStatus === "completed" && !this.paidAt) {
        this.paidAt = new Date();
    }

    next();
});

export const Order: Model<IOrderDocument> =
    mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);
