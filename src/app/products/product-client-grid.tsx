/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { CURRENCY } from "@/constants";
import { useCart, cartHelpers } from "@/components/providers/cart-provider";
import { cn } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  productImages: string[];
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  inStock: boolean;
  stockCount: number;
}

interface ProductClientGridProps {
  products: Product[] | any[]; // Adjusted to any[] to handle possible undefined fields
}

export function ProductClientGrid({ products }: ProductClientGridProps) {
  const { dispatch } = useCart();

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.productImages[0],
      quantity: 1,
    };
    cartHelpers.addItem(dispatch, cartItem);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className={cn(
            "group relative border-0 shadow-md overflow-hidden rounded-xl",
            "hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          )}
        >
          <CardContent className="p-0">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={product.productImages[0] || "/placeholder-image.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.badge && (
                <Badge className="absolute top-2 left-2 text-[10px] sm:text-xs">
                  {product.badge}
                </Badge>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                asChild
              >
                <Link href={`/products/${product._id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="p-2 sm:p-4 space-y-2">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {product.category}
              </p>
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3 sm:h-4 sm:w-4",
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-xl font-bold">
                      {CURRENCY.SYMBOL}
                      {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-muted-foreground line-through text-[10px] sm:text-sm">
                          {CURRENCY.SYMBOL}
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                  </div>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <p className="text-green-600 text-[10px] sm:text-xs font-medium">
                        Save {CURRENCY.SYMBOL}
                        {product.originalPrice - product.price}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">
                    {product.inStock ? "Add" : "Out of Stock"}
                  </span>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/products/${product._id}`}>
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">View</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
