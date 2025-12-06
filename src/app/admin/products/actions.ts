/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import connectDB from "@/lib/db/mongodb";
import Product, { type IProduct } from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function getProducts(id?: string) {
    try {
        await connectDB();
        if (id) {
            // Validate ID format to prevent CastError
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return null;
            }
            return Product.findById(id).lean();
        }
        // Optimize query: select only needed fields and use lean() for better performance
        return Product.find()
            .select('-__v') // Exclude version key
            .sort({ createdAt: -1 }) // Most recent first
            .lean() // Return plain JavaScript objects instead of Mongoose documents
            .exec();
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return null;
    }
}


// In your actions.js - make sure it handles the productImages array properly
export async function createProduct(data: Omit<IProduct | any, "_id" | "createdAt" | "updatedAt">) {
    try {
        await connectDB();

        // Convert array specifications to object format
        const specificationsArray = data.specifications as any[];
        const specificationsObject: Record<string, string> = {};

        if (Array.isArray(specificationsArray)) {
            specificationsArray.forEach(spec => {
                if (spec.key && spec.value) {
                    specificationsObject[spec.key] = spec.value;
                }
            });
        }

        const productData = {
            ...data,
            specifications: specificationsObject, // Convert to object
            // Ensure numbers are properly set
            price: data.price || 0,
            originalPrice: data.originalPrice || undefined,
            stockCount: data.stockCount || 0,
            rating: data.rating || 4.5,
            reviews: data.reviews || 0,
            // productImages should already contain Cloudinary URLs
        };

        await Product.create(productData);
        revalidatePath("/admin/products");
        revalidatePath("/products");

        return { success: true };
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create product');
    }
}

export async function updateProduct(
    id: string,
    data: Partial<Omit<IProduct, "_id" | "createdAt" | "updatedAt">>
) {
    await connectDB();
    await Product.findByIdAndUpdate(id, data);
    revalidatePath("/admin/products");
    revalidatePath("/products");
}

export async function deleteProduct(id: string) {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    revalidatePath("/products");
}