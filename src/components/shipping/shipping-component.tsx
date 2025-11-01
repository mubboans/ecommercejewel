"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  Clock,
  CheckCircle2,
  MapPin,
  Package,
  Shield,
} from "lucide-react";
import { CURRENCY } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface ShippingMethod {
  name: string;
  description: string;
  price: number;
  deliveryTime: string;
  enabled: boolean;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  taxRate: number;
  shippingMethods: ShippingMethod[];
}

interface ShippingComponentProps {
  selectedMethod?: string;
  onMethodSelect?: (method: ShippingMethod) => void;
  showFreeShippingProgress?: boolean;
  currentCartTotal?: number;
  className?: string;
}

export function ShippingComponent({
  selectedMethod,
  onMethodSelect,
  showFreeShippingProgress = true,
  currentCartTotal = 0,
  className = "",
}: ShippingComponentProps) {
  const [shippingSettings, setShippingSettings] =
    useState<ShippingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/shipping/settings");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch shipping settings: ${response.status}`
        );
      }

      const data = await response.json();
      setShippingSettings(data);
    } catch (err) {
      console.error("Error fetching shipping settings:", err);
      setError("Unable to load shipping options. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Use dynamic settings or fallback to defaults
  const freeShippingThreshold = shippingSettings?.freeShippingThreshold || 500;
  const taxRate = shippingSettings?.taxRate || 18;
  const availableShippingMethods = (
    shippingSettings?.shippingMethods || []
  ).filter((method) => method.enabled);

  const qualifiesForFreeShipping = currentCartTotal >= freeShippingThreshold;
  const freeShippingProgress = Math.min(
    (currentCartTotal / freeShippingThreshold) * 100,
    100
  );

  const handleMethodSelect = (method: ShippingMethod) => {
    onMethodSelect?.(method);
  };

  if (isLoading) {
    return <ShippingSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="mb-4">{error}</p>
            <Button onClick={fetchShippingSettings} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Free Shipping Progress */}
      {showFreeShippingProgress && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start sm:items-center gap-3">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-1 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
                      {qualifiesForFreeShipping ? (
                        <>
                          🎉 You qualify for <strong>FREE shipping</strong>!
                        </>
                      ) : (
                        <>
                          Free shipping on orders over {CURRENCY.SYMBOL}
                          {freeShippingThreshold}
                        </>
                      )}
                    </h3>
                    {!qualifiesForFreeShipping && (
                      <p className="text-blue-700 text-xs sm:text-sm mt-1">
                        Add {CURRENCY.SYMBOL}
                        {(
                          freeShippingThreshold - currentCartTotal
                        ).toLocaleString()}{" "}
                        more to get free shipping
                      </p>
                    )}
                  </div>

                  {!qualifiesForFreeShipping && (
                    <Badge
                      variant="outline"
                      className="bg-white text-blue-700 border-blue-300"
                    >
                      {CURRENCY.SYMBOL}
                      {currentCartTotal} / {CURRENCY.SYMBOL}
                      {freeShippingThreshold}
                    </Badge>
                  )}
                </div>

                {!qualifiesForFreeShipping && (
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipping Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Package className="h-5 w-5 text-primary" />
            Shipping Options
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Choose your preferred delivery method
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {availableShippingMethods.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No shipping methods available at the moment.</p>
                <p className="text-sm">Please check back later.</p>
              </div>
            ) : (
              availableShippingMethods.map((method, index) => {
                const isSelected = selectedMethod === method.name;
                const isFree = qualifiesForFreeShipping;
                const displayPrice = isFree ? 0 : method.price;

                return (
                  <div
                    key={method.name}
                    className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleMethodSelect(method)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection Indicator */}
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Method Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {method.description}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {method.deliveryTime}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {isFree && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 text-xs"
                                >
                                  FREE
                                </Badge>
                              )}
                              <span
                                className={`font-bold text-sm sm:text-base ${
                                  isFree ? "text-green-600" : "text-gray-900"
                                }`}
                              >
                                {isFree
                                  ? "Free"
                                  : `${CURRENCY.SYMBOL}${method.price}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Free Shipping Note */}
                        {isFree && method.price > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-2 mt-2">
                            <p className="text-green-700 text-xs">
                              🎉 Free shipping applied! You save{" "}
                              {CURRENCY.SYMBOL}
                              {method.price}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Free Shipping</h4>
              <p className="text-xs text-muted-foreground">
                Over {CURRENCY.SYMBOL}
                {freeShippingThreshold}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-sm mb-1">
                Nationwide Delivery
              </h4>
              <p className="text-xs text-muted-foreground">Across India</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Secure Packaging</h4>
              <p className="text-xs text-muted-foreground">
                Premium jewellery boxes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton Loading Component
function ShippingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Free Shipping Skeleton */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Methods Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-5 h-5 rounded-full mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
