"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Truck, Building } from "lucide-react";
import { CURRENCY } from "@/constants";
import { useCart } from "@/components/providers/cart-provider";

interface OrderSummaryProps {
  shippingCost?: number;
  shippingMethod?: string;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  taxRate: number;
  shippingMethods: Array<{
    name: string;
    description: string;
    price: number;
    deliveryTime: string;
    enabled: boolean;
  }>;
}

export function OrderSummary({
  shippingCost,
  shippingMethod = "standard",
}: OrderSummaryProps) {
  const { state: cartState } = useCart();
  const [shippingSettings, setShippingSettings] =
    useState<ShippingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    try {
      const response = await fetch("/api/shipping/settings");
      if (response.ok) {
        const data = await response.json();
        setShippingSettings(data);
      }
    } catch (error) {
      console.error("Error fetching shipping settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use dynamic settings or fallback to defaults
  const freeShippingThreshold = shippingSettings?.freeShippingThreshold || 500;
  const taxRate = shippingSettings?.taxRate || 18;
  const availableShippingMethods = shippingSettings?.shippingMethods || [];

  // Calculate order totals with dynamic settings
  const tax = cartState.total * (taxRate / 100);

  // Determine shipping cost based on dynamic settings
  const getShippingCost = () => {
    // If shippingCost is provided via props, use that
    if (shippingCost !== undefined) {
      return shippingCost;
    }

    // Free shipping for orders above threshold
    if (cartState.total > freeShippingThreshold) {
      return 0;
    }

    // Find the selected shipping method price
    const selectedMethod = availableShippingMethods.find(
      (method) => method.name === shippingMethod
    );
    return selectedMethod?.price || 50; // Fallback to 50 if not found
  };

  const shipping = getShippingCost();
  const finalTotal = cartState.total + tax + shipping;

  // Get shipping method display name
  const getShippingMethodName = () => {
    const selectedMethod = availableShippingMethods.find(
      (method) => method.name === shippingMethod
    );
    return selectedMethod?.description || "Standard Shipping";
  };

  if (isLoading) {
    return (
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cartState.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                  >
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    {CURRENCY.SYMBOL}
                    {item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {CURRENCY.SYMBOL}
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>
                Subtotal ({cartState.itemCount}{" "}
                {cartState.itemCount === 1 ? "item" : "items"})
              </span>
              <span>
                {CURRENCY.SYMBOL}
                {cartState.total.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping ({getShippingMethodName()})</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  `${CURRENCY.SYMBOL}${shipping}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax (GST {taxRate}%)</span>
              <span>
                {CURRENCY.SYMBOL}
                {tax.toLocaleString()}
              </span>
            </div>

            {/* Free Shipping Progress */}
            {cartState.total <= freeShippingThreshold && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex justify-between text-xs text-blue-800 mb-1">
                  <span>Free shipping progress</span>
                  <span>
                    {CURRENCY.SYMBOL}
                    {cartState.total} / {CURRENCY.SYMBOL}
                    {freeShippingThreshold}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((cartState.total / freeShippingThreshold) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Add {CURRENCY.SYMBOL}
                  {(
                    freeShippingThreshold - cartState.total
                  ).toLocaleString()}{" "}
                  more for free shipping!
                </p>
              </div>
            )}

            {shipping === 0 && (
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-xs text-green-700 font-medium">
                  🎉 Congratulations! You qualify for free shipping!
                </p>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                {CURRENCY.SYMBOL}
                {finalTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Security Badges */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
            <div>
              <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Free Shipping</p>
              <p>
                Over {CURRENCY.SYMBOL}
                {freeShippingThreshold}
              </p>
            </div>
            <div>
              <Building className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-medium">30-Day</p>
              <p>Returns</p>
            </div>
            <div>
              <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Secure</p>
              <p>Payment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
