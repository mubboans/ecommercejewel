"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { CURRENCY } from "@/constants";
import { useCart, cartHelpers } from "@/components/providers/cart-provider";
import { IProduct } from "@/models/Product";

interface ProductSpecifications {
  [key: string]: string;
}

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
  description: string;
  features: string[];
  specifications: ProductSpecifications;
  inStock: boolean;
  stockCount: number;
}

interface ProductDetailClientProps {
  product: IProduct;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { dispatch } = useCart();

  // Memoized calculations
  const totalPrice = useMemo(() => {
    return product.price * quantity;
  }, [product.price, quantity]);

  const discount = useMemo(() => {
    return product.originalPrice ? product.originalPrice - product.price : 0;
  }, [product.originalPrice, product.price]);

  const hasDiscount = useMemo(() => {
    return !!product.originalPrice && product.originalPrice > product.price;
  }, [product.originalPrice, product.price]);

  // Callbacks
  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.productImages[0],
      quantity: quantity,
      maxStock: product.stockCount,
    };

    cartHelpers.addItem(dispatch, cartItem);

    setTimeout(() => {
      setIsAddingToCart(false);
      alert(`Added ${quantity} ${product.name} to cart!`);
    }, 300);
  }, [product, quantity, dispatch]);

  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => (prev < product.stockCount ? prev + 1 : prev));
  }, [product.stockCount]);

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const isAddToCartDisabled = !product.inStock || isAddingToCart;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span
            className="text-foreground truncate max-w-[200px]"
            title={product.name}
          >
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={
                  product.productImages[selectedImageIndex] ||
                  "/placeholder-image.jpg"
                }
                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 shadow-md">
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.productImages.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => handleImageSelect(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image || "/placeholder-image.jpg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-primary/10" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {product.category}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <div
                  className="flex"
                  aria-label={`Rating: ${product.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={`star-${i}`}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center flex-wrap gap-3 mb-6">
                <span className="text-2xl sm:text-3xl font-bold">
                  {CURRENCY.SYMBOL}
                  {product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {CURRENCY.SYMBOL}
                      {product.originalPrice!.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="font-semibold">
                      Save {CURRENCY.SYMBOL}
                      {discount.toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stockCount}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.stockCount} in stock)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart - {CURRENCY.SYMBOL}
                    {totalPrice.toLocaleString()}
                  </>
                )}
              </Button>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                <p className="text-green-800 dark:text-green-400 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  In stock and ready to ship
                </p>
              </div>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <p className="text-red-800 dark:text-red-400 text-sm">
                  ⚠️ Out of stock
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li
                      key={`feature-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications || [])?.map(
                    ([key, value]) => (
                      <div
                        key={`spec-${key}`}
                        className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-border last:border-b-0"
                      >
                        <span className="font-medium text-sm">{key}</span>
                        <span className="text-sm text-muted-foreground sm:text-right">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
