"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CURRENCY } from "@/constants";
import { toast } from "sonner";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderNumber = searchParams.get("orderNumber");
    const [order, setOrder] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderNumber) {
            router.push("/");
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderNumber}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order");
                }
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("Could not load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderNumber, router]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    We couldn't find the order details. Please check your email for confirmation.
                </p>
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Order Confirmed!</h1>
                <p className="text-lg text-muted-foreground">
                    Thank you for your purchase. Your order <span className="font-semibold text-gray-900">#{order.orderNumber}</span> has been placed successfully.
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900">Shipping Address</h3>
                            <div className="text-muted-foreground space-y-1">
                                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p>{order.shippingAddress.address}</p>
                                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p>{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{CURRENCY.SYMBOL}{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{CURRENCY.SYMBOL}{order.shipping.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{CURRENCY.SYMBOL}{order.tax.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{CURRENCY.SYMBOL}{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4 text-gray-900">Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                <div key={item.productId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                                            {/* Ideally use Next.js Image here if you have the image URL */}
                                            <img
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        {CURRENCY.SYMBOL}{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                    <Link href="/orders">View My Orders</Link>
                </Button>
                <Button asChild>
                    <Link href="/products">
                        Continue Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <MainLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </MainLayout>
    );
}
