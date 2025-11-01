/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, AlertTriangle, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CheckoutContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { state: cartState, createOrder, validateStock } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stockValidated, setStockValidated] = useState(false);

  // Validate stock on component mount
  useEffect(() => {
    const validateInitialStock = async () => {
      if (cartState.items.length > 0 && status === "authenticated") {
        try {
          await validateStock();
          setStockValidated(true);
        } catch (error) {
          console.error("Stock validation failed:", error);
        }
      }
    };

    validateInitialStock();
  }, [cartState.items.length, status, validateStock]);

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/checkout");
    return null;
  }

  if (cartState.items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Add some beautiful jewellery pieces to your cart before
                proceeding to checkout.
              </p>
              <Button asChild size="lg" className="min-h-12 px-8">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleOrderSubmit = async (formData: any) => {
    if (!stockValidated) {
      toast.error("Please wait while we validate your cart items");
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate totals
      const tax = cartState.total * 0.18; // 18% GST
      const shippingCosts = {
        standard: 50,
        express: 100,
        overnight: 200,
      };
      const shipping =
        shippingCosts[formData.shippingMethod as keyof typeof shippingCosts] ||
        50;

      // Create order with pending status
      const orderNumber = await createOrder({
        ...formData,
        tax,
        shipping,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billingAddress: formData.billingAddress || {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: formData.notes,
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      if (orderNumber) {
        // Redirect to payment page
        router.push(`/payment/${orderNumber}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild className="flex-shrink-0">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Checkout
              </h1>
              <p className="text-muted-foreground">
                Complete your jewellery purchase securely
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Signed in as {session?.user?.email}
            </div>
          </div>

          {/* Stock Validation Alert */}
          {!stockValidated && cartState.items.length > 0 && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Validating your cart items...
              </AlertDescription>
            </Alert>
          )}

          {/* Out of Stock Alert */}
          {cartState.items.some((item) => item.quantity > item.maxStock) && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Some items in your cart are out of stock. Please update your
                cart before proceeding.
              </AlertDescription>
            </Alert>
          )}

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <CheckoutForm
                  onSubmit={handleOrderSubmit}
                  isProcessing={isProcessing}
                  isStockValidated={stockValidated}
                />
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Add toast import at the top
import { toast } from "sonner";
