import mongoose, { Schema } from "mongoose";

const SpecificationSchema = new mongoose.Schema(
    {},
    { _id: false, strict: false }
);

export interface ProductModel extends Document {
    name: string;
    price: number;
    originalPrice?: number;
    productImages: Array<string>;
    rating?: number;
    reviews?: number;
    badge?: string;
    category: string;
    description: string;
    features: string[];
    specifications: Record<string, string>; // This should be object, not array
    inStock: boolean;
    stockCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema(
    {
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: { type: String, required: true },
        price: { type: Number, required: true }, // cents
        originalPrice: { type: Number },
        productImages: [String],
        rating: { type: Number, default: 4.5, min: 0, max: 5 },
        reviews: { type: Number, default: 0 },
        badge: { type: String, default: "" },
        category: { type: String, required: true },
        description: { type: String, required: true },
        features: [String],
        specifications: {
            type: SpecificationSchema,
            default: {} // Add default empty object
        },
        inStock: { type: Boolean, default: true },
        stockCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
export type IProduct = mongoose.InferSchemaType<typeof ProductSchema>;