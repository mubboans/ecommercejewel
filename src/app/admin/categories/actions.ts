"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

// Get all categories (admin)
export async function getCategories() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
        return { categories: JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.error("Get categories error:", error);
        return { error: "Failed to fetch categories" };
    }
}

// Get active categories (public)
export async function getActiveCategories() {
    try {
        await connectDB();

        const categories = await Category.find({ isActive: true })
            .sort({ order: 1, name: 1 })
            .lean();

        return { categories: JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.error("Get active categories error:", error);
        return { categories: [] };
    }
}

// Get category by ID
export async function getCategoryById(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const category = await Category.findById(id).lean();
        if (!category) {
            return { error: "Category not found" };
        }

        return { category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Get category error:", error);
        return { error: "Failed to fetch category" };
    }
}

// Create category
export async function createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    order?: number;
}) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const category = await Category.create(data);
        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath("/admin/categories");

        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Create category error:", error);
        return { error: "Failed to create category" };
    }
}

// Update category
export async function updateCategory(
    id: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        image?: string;
        isActive?: boolean;
        order?: number;
    }
) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const category = await Category.findByIdAndUpdate(id, data, { new: true });
        if (!category) {
            return { error: "Category not found" };
        }

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath("/admin/categories");

        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Update category error:", error);
        return { error: "Failed to update category" };
    }
}

// Delete category
export async function deleteCategory(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return { error: "Category not found" };
        }

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath("/admin/categories");

        return { success: true };
    } catch (error) {
        console.error("Delete category error:", error);
        return { error: "Failed to delete category" };
    }
}

// Toggle category status
export async function toggleCategoryStatus(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const category = await Category.findById(id);
        if (!category) {
            return { error: "Category not found" };
        }

        category.isActive = !category.isActive;
        await category.save();

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath("/admin/categories");

        return { success: true, isActive: category.isActive };
    } catch (error) {
        console.error("Toggle category status error:", error);
        return { error: "Failed to toggle category status" };
    }
}
