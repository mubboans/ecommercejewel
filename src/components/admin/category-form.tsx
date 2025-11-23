/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FolderOpen, Link, ListOrdered, Eye } from "lucide-react";
import { toast } from "sonner";
import {
    createCategory,
    updateCategory,
} from "@/app/admin/categories/actions";

// Fix: Use z.number() instead of z.coerce.number() and add transform for string to number conversion
const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
    description: z.string().optional(),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
    isActive: z.boolean(),
    order: z.number().int().min(0), // Fix: Use z.number() directly
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryForm({ category }: { category: any }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || "",
            slug: category?.slug || "",
            description: category?.description || "",
            image: category?.image || "",
            isActive: category?.isActive ?? true,
            order: category?.order ?? 0,
        },
    });

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        if (!category) {
            // Only auto-generate for new categories
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            form.setValue("slug", slug);
        }
    };

    const onSubmit = async (data: CategoryFormValues) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                description: data.description || undefined,
                image: data.image || undefined,
            };

            const result = category
                ? await updateCategory(category._id, payload)
                : await createCategory(payload);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    category
                        ? "Category updated successfully"
                        : "Category created successfully"
                );
                router.push("/admin/categories");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const name = form.watch("name");
    const slug = form.watch("slug");
    const image = form.watch("image");
    const isActive = form.watch("isActive");
    const order = form.watch("order");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                                Category Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Category Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Rings, Necklaces, Earrings..."
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handleNameChange(e.target.value);
                                                        }}
                                                        className="focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    The display name of the category as shown to customers
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">URL Slug</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="rings"
                                                        {...field}
                                                        className="font-mono focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    URL-friendly identifier (auto-generated from name)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Beautiful handcrafted rings for every occasion..."
                                                        {...field}
                                                        className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Optional description for the category
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                    <Link className="h-4 w-4" />
                                                    Image URL
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://example.com/category-image.jpg"
                                                        {...field}
                                                        className="focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Category image for display on homepage and category pages
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                    <ListOrdered className="h-4 w-4" />
                                                    Display Order
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                                                        />
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>First (0)</span>
                                                            <span className="font-medium">{field.value}</span>
                                                            <span>Last (100)</span>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Lower numbers appear first in category listings
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-gray-50/50">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base font-medium">Active Status</FormLabel>
                                                    <FormDescription className="text-sm">
                                                        Show this category on the website
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-green-600"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/admin/categories")}
                                            disabled={isLoading}
                                            className="flex-1 border-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {category ? "Update Category" : "Create Category"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-sm sticky top-6">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Eye className="h-5 w-5 text-green-600" />
                                Category Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image Preview */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-gray-700">Image Preview:</div>
                                {image ? (
                                    <div className="relative aspect-square rounded-lg border overflow-hidden bg-gray-100">
                                        <img
                                            src={image}
                                            alt="Category preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgODVIMTIwVjkwSDEyNVY4NVpNODAgMTE1SDg1VjExMEg4MFYxMTVaTTEwMCA2MEM4OS41NDUgNjAgODAgNjkuNTQ1IDgwIDgwQzgwIDkwLjQ1NSA4OS41NDUgMTAwIDEwMCAxMDBDMTEwLjQ1NSAxMDAgMTIwIDkwLjQ1NSAxMjAgODBDMTIwIDY5LjU0NSAxMTAuNDU1IDYwIDEwMCA2MFpNMTAwIDk1QzkzLjk1NSA5NSA4NSA5MS40NTUgODUgODBDODUgNjguNTQ1IDkzLjk1NSA2NSAxMDAgNjVDMTA2LjA0NSA2NSAxMTUgNjguNTQ1IDExNSA4MEMxMTUgOTEuNDU1IDEwNi4wNDUgOTUgMTAwIDk1WiIgZmlsbD0iIzlDQUFBRiIvPgo8L3N2Zz4K';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square rounded-lg border-2 border-dashed bg-gray-50 flex items-center justify-center">
                                        <div className="text-center">
                                            <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No image</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Details Preview */}
                            <div className="space-y-3 pt-4 border-t">
                                <div className="text-sm font-medium text-gray-700">Category Details:</div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium text-gray-900 truncate max-w-[120px]">
                                            {name || "Untitled Category"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Slug:</span>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border font-mono">
                                            {slug || "category-slug"}
                                        </code>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge
                                            variant={isActive ? "default" : "secondary"}
                                            className={isActive
                                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
                                            }
                                        >
                                            {isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Order:</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-600 rounded-full"
                                                    style={{ width: `${Math.min(order * 2, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-medium text-gray-700">{order}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Preview */}
                            {form.watch("description") && (
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="text-sm font-medium text-gray-700">Description:</div>
                                    <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-lg border">
                                        {form.watch("description")}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}