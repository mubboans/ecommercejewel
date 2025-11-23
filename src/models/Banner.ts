import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
    title: string;
    message: string;
    bgColor: string;
    textColor: string;
    link?: string;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema(
    {
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        title: { type: String, required: true },
        message: { type: String, required: true },
        bgColor: { type: String, default: "#ec4899" }, // pink-500
        textColor: { type: String, default: "#ffffff" },
        link: { type: String },
        isActive: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
        priority: { type: Number, default: 0 }, // Higher number = higher priority
    },
    { timestamps: true }
);

// Index for efficient querying
BannerSchema.index({ isActive: 1, priority: -1 });

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
