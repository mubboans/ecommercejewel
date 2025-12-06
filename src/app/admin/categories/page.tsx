import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { getCategories } from "./actions";
import { ICategory } from "@/models/Category";
import { getActiveBanners } from "../banners/actions";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoriesTable } from "@/components/admin/categories-table";
import { MainLayout } from "@/components/layout/main-layout";

export default async function CategoriesPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    const result = await getCategories();
    const categories = result.categories || [];

    const bannersForLayout = await getActiveBanners();
    const activeBanners = bannersForLayout.banners || [];

    return (
        <MainLayout banners={activeBanners}>
            <div className="min-h-screen bg-gray-50/30 py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                    Categories
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                                    Organize your products with categories for better customer experience
                                </p>
                            </div>
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/admin/categories/new" className="flex items-center justify-center">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Category
                                </Link>
                            </Button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg border p-4 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Categories</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Plus className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border p-4 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Categories</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {categories.filter((c: ICategory) => c.isActive).length}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border p-4 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Inactive</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {categories.filter((c: ICategory) => !c.isActive).length}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Table */}
                        <div className="bg-white rounded-lg border shadow-xs overflow-hidden">
                            <CategoriesTable categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}