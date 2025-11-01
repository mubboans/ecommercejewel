/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  Clock,
  Shield,
  RotateCcw,
  LogIn,
  User,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const refundSchema = z.object({
  orderId: z.string().min(3, "Order ID is required"),
  requestType: z.enum(["refund", "cancellation", "exchange"]),
  reason: z
    .string()
    .min(10, "Please provide a detailed reason (minimum 10 characters)"),
  refundType: z.enum(["full", "partial"]).optional(),
  amount: z.number().min(0).optional(),
  email: z.string().email("Valid email is required").optional(),
  phone: z.string().min(10, "Valid phone number is required").optional(),
  comments: z
    .string()
    .max(500, "Comments cannot exceed 500 characters")
    .optional(),
});

type RefundFormData = z.infer<typeof refundSchema>;

interface Order {
  orderNumber: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

interface CancelRefundContentProps {
  session?: any;
}

export function CancelRefundContent({ session }: CancelRefundContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const isAuthenticated = !!session;

  const form = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      requestType: "refund",
      refundType: "full",
    },
  });

  const watchRequestType = form.watch("requestType");
  const watchRefundType = form.watch("refundType");

  // Fetch user's orders only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserOrders = async () => {
        try {
          const response = await fetch("/api/orders");
          if (response.ok) {
            const data = await response.json();
            setUserOrders(data.orders || []);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoadingOrders(false);
        }
      };

      fetchUserOrders();
    } else {
      setIsLoadingOrders(false);
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: RefundFormData) => {
    try {
      setLoading(true);

      // For non-authenticated users, require email and phone
      if (!isAuthenticated && (!data.email || !data.phone)) {
        toast.error("Please provide email and phone number", {
          description: "These fields are required for guest requests.",
        });
        return;
      }

      const response = await fetch("/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          isGuest: !isAuthenticated,
          userId: isAuthenticated ? session.user.id : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      toast.success("Request Submitted Successfully! 💎", {
        description: isAuthenticated
          ? "We'll contact you within 1-2 business days."
          : "We've sent a confirmation to your email. We'll contact you within 1-2 business days.",
        duration: 5000,
      });

      form.reset();

      if (isAuthenticated) {
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Refund request error:", error);
      toast.error("Something went wrong 😢", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      confirmed: { label: "Confirmed", variant: "default" as const },
      processing: { label: "Processing", variant: "default" as const },
      shipped: { label: "Shipped", variant: "outline" as const },
      delivered: { label: "Delivered", variant: "success" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
    };

    return (
      <Badge variant={'outline'} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <RotateCcw className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Cancel & Refund Request
            </h1>
            <p className="text-lg text-muted-foreground">
              Request cancellation, refund, or exchange for your jewellery
              order.
              {!isAuthenticated && " Sign in for faster processing."}
            </p>
          </div>

          {/* Authentication Alert */}
          {!isAuthenticated && (
            <Alert className="mb-6 bg-blue-50 border-blue-200 max-w-4xl mx-auto">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div>
                  <span className="font-semibold text-blue-800">
                    Guest User
                  </span>
                  <span className="text-blue-700 ml-2">
                    Sign in to access your order history and faster processing.
                  </span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href={`/auth/signin?callbackUrl=/cancel-refund`}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* User Info Badge */}
          {isAuthenticated && (
            <div className="flex justify-center mb-6">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <User className="h-3 w-3 mr-1" />
                Signed in as {session.user.email}
              </Badge>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => router.back()}
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                          Request Form
                        </CardTitle>
                        <CardDescription>
                          {isAuthenticated
                            ? "Fill in your details to submit a request"
                            : "Provide your order details and contact information"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Contact Information for Guest Users */}
                      {!isAuthenticated && (
                        <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Contact Information (Required)
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="email"
                                className="text-sm font-semibold"
                              >
                                Email Address *
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                {...form.register("email")}
                                className="h-12"
                              />
                              {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                  {form.formState.errors.email.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="phone"
                                className="text-sm font-semibold"
                              >
                                Phone Number *
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                {...form.register("phone")}
                                className="h-12"
                              />
                              {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                  {form.formState.errors.phone.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Request Type */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="requestType"
                          className="text-base font-semibold"
                        >
                          Request Type *
                        </Label>
                        <Select
                          onValueChange={(
                            value: RefundFormData["requestType"]
                          ) => form.setValue("requestType", value)}
                          defaultValue={form.watch("requestType")}
                        >
                          <SelectTrigger id="requestType" className="h-12">
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="refund"
                              className="flex items-center gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Refund Request
                            </SelectItem>
                            <SelectItem value="cancellation">
                              Order Cancellation
                            </SelectItem>
                            <SelectItem value="exchange">
                              Product Exchange
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Order ID with Recent Orders (only for authenticated users) */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="orderId"
                          className="text-base font-semibold"
                        >
                          Order ID *
                        </Label>
                        <Input
                          id="orderId"
                          placeholder="e.g., ORD-123456"
                          {...form.register("orderId")}
                          className="h-12"
                        />
                        {form.formState.errors.orderId && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.orderId.message}
                          </p>
                        )}

                        {/* Recent Orders (only for authenticated users) */}
                        {isAuthenticated && userOrders.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground font-medium">
                              Your Recent Orders:
                            </p>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {userOrders.slice(0, 3).map((order) => (
                                <div
                                  key={order.orderNumber}
                                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                  onClick={() =>
                                    form.setValue("orderId", order.orderNumber)
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-sm">
                                      {order.orderNumber}
                                    </span>
                                    {getOrderStatusBadge(order.status)}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold">
                                      ₹{(order.total / 100).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(
                                        order.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Rest of the form remains the same */}
                      {/* Refund Type (only show for refund requests) */}
                      {watchRequestType === "refund" && (
                        <div className="space-y-3">
                          <Label
                            htmlFor="refundType"
                            className="text-base font-semibold"
                          >
                            Refund Type *
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              form.setValue("refundType", value as RefundFormData["refundType"])
                            }
                            defaultValue={form.watch("refundType")}
                          >
                            <SelectTrigger id="refundType" className="h-12">
                              <SelectValue placeholder="Select refund type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full">Full Refund</SelectItem>
                              <SelectItem value="partial">
                                Partial Refund
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Partial Refund Amount */}
                      {watchRequestType === "refund" &&
                        watchRefundType === "partial" && (
                          <div className="space-y-3">
                            <Label
                              htmlFor="amount"
                              className="text-base font-semibold"
                            >
                              Refund Amount (₹) *
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter refund amount"
                              {...form.register("amount", {
                                valueAsNumber: true,
                              })}
                              className="h-12"
                            />
                            {form.formState.errors.amount && (
                              <p className="text-sm text-red-500">
                                {form.formState.errors.amount.message}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Reason */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="reason"
                          className="text-base font-semibold"
                        >
                          Reason for{" "}
                          {watchRequestType === "refund"
                            ? "Refund"
                            : watchRequestType === "cancellation"
                              ? "Cancellation"
                              : "Exchange"}{" "}
                          *
                        </Label>
                        <Textarea
                          id="reason"
                          placeholder={`Please provide detailed reason for ${watchRequestType}...`}
                          {...form.register("reason")}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Minimum 10 characters required</span>
                          <span>{form.watch("reason")?.length || 0}/500</span>
                        </div>
                        {form.formState.errors.reason && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.reason.message}
                          </p>
                        )}
                      </div>

                      {/* Additional Comments */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="comments"
                          className="text-base font-semibold"
                        >
                          Additional Comments
                        </Label>
                        <Textarea
                          id="comments"
                          placeholder="Any extra details, photos, or information that might help us process your request faster..."
                          {...form.register("comments")}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Optional</span>
                          <span>{form.watch("comments")?.length || 0}/500</span>
                        </div>
                        {form.formState.errors.comments && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.comments.message}
                          </p>
                        )}
                      </div>

                      <CardFooter className="px-0 pb-0 pt-6">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg shadow-lg"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting Request...
                            </>
                          ) : (
                            `Submit ${
                              watchRequestType === "refund"
                                ? "Refund"
                                : watchRequestType === "cancellation"
                                  ? "Cancellation"
                                  : "Exchange"
                            } Request`
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Information Sidebar */}
              <div className="space-y-6">
                {/* Authentication Benefits */}
                {!isAuthenticated && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-blue-800 mb-2">
                            Benefits of Signing In
                          </h3>
                          <ul className="text-sm text-blue-700 space-y-2">
                            <li>• Access your order history</li>
                            <li>• Faster request processing</li>
                            <li>• Automatic order verification</li>
                            <li>• Track request status</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-2">
                          Processing Time
                        </h3>
                        <p className="text-sm text-amber-700">
                          {isAuthenticated
                            ? "Refund requests are typically processed within 3-5 business days."
                            : "Guest requests may take 1-2 additional days for verification."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rest of the sidebar cards remain the same */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      Our Promise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          30-Day Return Policy
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Easy returns within 30 days of delivery
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          Quality Guarantee
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Full refund if not satisfied with quality
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
