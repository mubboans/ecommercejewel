"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Truck, Clock, MapPin, Loader2 } from "lucide-react";
import { CURRENCY } from "@/constants";

interface ShippingRate {
  method: string;
  description: string;
  price: number;
  deliveryTime: string;
  estimatedDate: string;
}

export function ShippingCalculator() {
  const [zipCode, setZipCode] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState("");

  const calculateShipping = async () => {
    if (!zipCode.trim()) {
      setError("Please enter a valid ZIP code");
      return;
    }

    // Basic ZIP code validation for India (6 digits)
    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(zipCode)) {
      setError("Please enter a valid 6-digit Indian ZIP code");
      return;
    }

    setIsCalculating(true);
    setError("");
    setCalculated(false);

    try {
      // Simulate API call to calculate shipping
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock shipping rates based on ZIP code
      const mockRates: ShippingRate[] = [
        {
          method: "standard",
          description: "Standard Shipping",
          price: 50,
          deliveryTime: "3-5 business days",
          estimatedDate: getEstimatedDate(5),
        },
        {
          method: "express",
          description: "Express Shipping",
          price: 100,
          deliveryTime: "1-2 business days",
          estimatedDate: getEstimatedDate(2),
        },
        {
          method: "overnight",
          description: "Overnight Shipping",
          price: 200,
          deliveryTime: "Next business day",
          estimatedDate: getEstimatedDate(1),
        },
      ];

      setRates(mockRates);
      setCalculated(true);
    } catch (err) {
      setError("Failed to calculate shipping rates. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getEstimatedDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);

    // Skip weekends
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleZipCodeChange = (value: string) => {
    setZipCode(value);
    if (error) setError("");
    if (calculated) setCalculated(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Calculate Shipping
        </CardTitle>
        <CardDescription className="text-sm">
          Check delivery times and costs for your location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ZIP Code Input */}
        <div className="space-y-3">
          <Label htmlFor="zipCode" className="text-sm font-medium">
            Delivery ZIP Code
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="zipCode"
                placeholder="Enter 6-digit ZIP code"
                value={zipCode}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                className="flex-1"
                maxLength={6}
              />
            </div>
            <Button
              onClick={calculateShipping}
              disabled={!zipCode.trim() || isCalculating}
              className="flex-shrink-0"
            >
              {isCalculating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Calculate"
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Calculated Rates */}
        {calculated && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
              <MapPin className="h-4 w-4" />
              <span>Shipping rates for {zipCode}</span>
            </div>

            <div className="space-y-2">
              {rates.map((rate, index) => (
                <div
                  key={rate.method}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                          {rate.description}
                        </p>
                        {rate.method === "express" && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800 text-xs"
                          >
                            Fast
                          </Badge>
                        )}
                        {rate.method === "overnight" && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 text-xs"
                          >
                            Quickest
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {rate.deliveryTime} • Est. {rate.estimatedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {rate.price === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `${CURRENCY.SYMBOL}${rate.price}`
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 text-sm mb-1">
                Free Shipping Available
              </h4>
              <p className="text-blue-700 text-xs">
                Enjoy free standard shipping on orders over {CURRENCY.SYMBOL}
                500. All jewellery items are shipped in premium gift-ready
                packaging with insurance coverage.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
