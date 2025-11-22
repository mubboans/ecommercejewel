"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingBag, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CURRENCY } from "@/constants";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    total: number;
    items: OrderItem[];
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/orders");
            return;
        }

        if (status === "authenticated") {
            const fetchOrders = async () => {
                try {
                    const response = await fetch("/api/orders");
                    if (!response.ok) {
                        throw new Error("Failed to fetch orders");
                    }
                    const data = await response.json();
                    setOrders(data.orders);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    toast.error("Failed to load your orders");
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    }, [status, router]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
            case "completed":
            case "delivered":
                return "bg-green-100 text-green-800 hover:bg-green-100/80";
            case "processing":
            case "shipped":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
            case "cancelled":
            case "failed":
                return "bg-red-100 text-red-800 hover:bg-red-100/80";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
        }
    };

    if (status === "loading" || loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-muted-foreground mt-1">
                                View and track your past purchases
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/products">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Shop Now
                            </Link>
                        </Button>
                    </div>

                    {orders.length === 0 ? (
                        <Card className="text-center py-16">
                            <CardContent>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                                <p className="text-muted-foreground mb-8">
                                    You haven't placed any orders yet. Start shopping to see your orders here.
                                </p>
                                <Button asChild size="lg">
                                    <Link href="/products">Start Shopping</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Card key={order._id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-gray-50/50 border-b py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Order Placed</p>
                                                    <p className="font-medium">
                                                        {format(new Date(order.createdAt), "MMMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Total</p>
                                                    <p className="font-medium">
                                                        {CURRENCY.SYMBOL}{order.total.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Order #</p>
                                                    <p className="font-medium">{order.orderNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={getStatusColor(order.status)} variant="secondary">
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/payment/success?orderNumber=${order.orderNumber}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            {order.items.map((item) => (
                                                <div key={item.productId} className="flex items-center gap-4">
                                                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border">
                                                        <img
                                                            src={item.image || "/placeholder.png"}
                                                            alt={item.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-900 truncate">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p className="font-medium mt-1">
                                                            {CURRENCY.SYMBOL}{item.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
