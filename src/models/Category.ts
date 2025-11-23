import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema(
    {
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 }, // For ordering categories
    },
    { timestamps: true }
);

// Index for efficient querying
CategorySchema.index({ isActive: 1, order: 1 });
CategorySchema.index({ slug: 1 });

// Auto-generate slug from name if not provided
CategorySchema.pre("save", function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
