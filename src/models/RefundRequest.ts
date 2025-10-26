import mongoose, { Schema, Document } from "mongoose";

export interface IRefundRequest extends Document {
    orderId: string;
    email: string;
    reason: string;
    refundType: "Full" | "Partial";
    comments?: string;
    status: "Pending" | "Approved" | "Rejected";
    createdAt: Date;
    updatedAt: Date;
}

const RefundRequestSchema = new Schema<IRefundRequest>(
    {
        orderId: { type: String, required: true },
        email: { type: String, required: true },
        reason: { type: String, required: true },
        refundType: { type: String, enum: ["Full", "Partial"], required: true },
        comments: { type: String },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.RefundRequest ||
    mongoose.model<IRefundRequest>("RefundRequest", RefundRequestSchema);
