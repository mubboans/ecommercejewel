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

import { toast } from "sonner";

export function CheckoutContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { state: cartState, createOrder, validateStock, clearCart } = useCart();
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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

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
      const date = new Date();
      const timestamp = date.getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderData = {
        ...formData,
        tax,
        orderNumber: `ORD-${timestamp}${random}`,
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
      };

      // 1. Create Order (Pending) using Cart Provider
      // Pass false to NOT clear cart immediately (wait for payment)
      const data = await createOrder(orderData, false);

      if (!data) {
        // createOrder handles error toasts
        toast.error("Failed to create order");
        return;
      }

      const { orderNumber, razorpayOrderId, amount, currency, keyId } = data;

      // 2. Handle Payment
      if (formData.paymentMethod === "razorpay" && razorpayOrderId) {
        const res = await loadRazorpay();

        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        const options = {
          key: keyId,
          amount: amount.toString(),
          currency: currency,
          name: "Dilaraa",
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok) {
                // Clear cart and redirect
                clearCart();
                router.push(`/payment/success?orderNumber=${orderNumber}`);
              } else {
                toast.error(verifyData.error || "Payment verification failed");
                router.push(`/payment/failed?orderNumber=${orderNumber}`);
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled");
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        // COD or other methods
        if (orderNumber) {
          // For COD, we clear cart now since order is placed
          clearCart();
          router.push(`/payment/${orderNumber}`);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30 py-8 overflow-x-hidden">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild className="flex-shrink-0">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
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
            <div className="grid lg:grid-cols-3 gap-8 relative">
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
                <div className="sticky top-24">
                  <OrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
