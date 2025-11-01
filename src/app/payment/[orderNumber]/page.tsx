"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  CreditCard,
  Shield,
} from "lucide-react";
import Link from "next/link";

interface OrderDetails {
  orderNumber: string;
  total: number;
  status: string;
  paymentInfo: {
    status: string;
    method: string;
  };
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const orderNumber = params.orderNumber as string;

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (method: "razorpay" | "stripe") => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      // In real implementation, integrate with Razorpay/Stripe SDK
      const response = await fetch(`/api/orders/${orderNumber}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: `pay_${Date.now()}`,
          status: "completed",
          method,
        }),
      });

      if (response.ok) {
        // Payment successful
        router.push(`/order-confirmation/${orderNumber}`);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      // Handle payment failure
      await fetch(`/api/orders/${orderNumber}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "failed",
          method,
        }),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The order you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
            <p className="text-muted-foreground">Order #{order.orderNumber}</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Choose your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold">
                    ₹{(order.total / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Order Status:</span>
                  <Badge
                    variant={
                      order.status === "pending"
                        ? "secondary"
                        : order.status === "confirmed"
                          ? "default"
                          : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <Button
                  onClick={() => handlePayment("razorpay")}
                  disabled={isProcessing}
                  className="w-full h-16 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  Pay with Razorpay
                </Button>

                <Button
                  onClick={() => handlePayment("stripe")}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full h-16 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  Pay with Stripe
                </Button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure SSL Encrypted Payment</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
