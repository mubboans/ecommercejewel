"use server";

import Product, { type IProduct } from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function getProducts(id?: string) {
    if (id) return Product.findById(id).lean(); // lean() keeps _id :)
    return Product.find().lean(); // lean() keeps _id :)
}

export async function createProduct(data: Omit<IProduct, "_id" | "createdAt" | "updatedAt">) {
    await Product.create(data);
    revalidatePath("/admin/products");
}

export async function updateProduct(
    id: string,
    data: Partial<Omit<IProduct, "_id" | "createdAt" | "updatedAt">>
) {
    await Product.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
}