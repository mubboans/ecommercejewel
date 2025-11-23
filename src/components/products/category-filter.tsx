"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryFilterProps {
    categories: Array<{
        _id: string;
        name: string;
        slug: string;
    }>;
    activeSlug?: string;
}

export function CategoryFilter({
    categories,
    activeSlug,
}: CategoryFilterProps) {
    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
                <Link href="/products">
                    <Badge
                        variant={!activeSlug ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 text-sm",
                            !activeSlug && "shadow-sm"
                        )}
                    >
                        All Products
                    </Badge>
                </Link>
                {categories.map((category) => (
                    <Link key={category._id} href={`/products?category=${category.slug}`}>
                        <Badge
                            variant={activeSlug === category.slug ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 text-sm whitespace-nowrap",
                                activeSlug === category.slug && "shadow-sm"
                            )}
                        >
                            {category.name}
                        </Badge>
                    </Link>
                ))}
            </div>
        </div>
    );
}
