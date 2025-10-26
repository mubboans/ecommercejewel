"use client";

import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { CURRENCY } from "@/constants";
import { useCart, cartHelpers } from "@/components/providers/cart-provider";

export default function CartPage() {
  const { state: cartState, dispatch } = useCart();

  const updateQuantity = (productId: string, newQuantity: number) => {
    cartHelpers.updateQuantity(dispatch, productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    cartHelpers.removeItem(dispatch, productId);
  };

  const clearCart = () => {
    cartHelpers.clearCart(dispatch);
  };

  if (cartState.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to fill it up!
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const tax = cartState.total * 0.18; // 18% GST
  const shipping = cartState.total > 500 ? 0 : 50; // Free shipping above ₹500
  const finalTotal = cartState.total + tax + shipping;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full sm:w-auto"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartState.items.map((item) => (
              <Card key={item.productId} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {CURRENCY.SYMBOL}
                        {item.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right sm:text-left flex flex-col items-end sm:items-start gap-1">
                        <p className="font-semibold text-base sm:text-lg whitespace-nowrap">
                          {CURRENCY.SYMBOL}
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 p-0 px-2"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>
                    Subtotal ({cartState.itemCount}{" "}
                    {cartState.itemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium">
                    {CURRENCY.SYMBOL}
                    {cartState.total.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span>GST (18%)</span>
                  <span className="font-medium">
                    {CURRENCY.SYMBOL}
                    {tax.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `${CURRENCY.SYMBOL}${shipping}`
                    )}
                  </span>
                </div>

                {shipping === 0 ? (
                  <p className="text-xs sm:text-sm text-green-600 bg-green-50 p-2 rounded-md">
                    🎉 You qualify for free shipping!
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground bg-blue-50 p-2 rounded-md">
                    Add {CURRENCY.SYMBOL}
                    {(500 - cartState.total).toLocaleString()} more for free
                    shipping
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    {CURRENCY.SYMBOL}
                    {finalTotal.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href="/products"
                      className="flex items-center justify-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
