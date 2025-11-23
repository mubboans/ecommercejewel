"use client";
// Force recompile

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { updateOrderStatus } from "@/app/admin/orders/actions";
import { toast } from "sonner";
import { CURRENCY } from "@/constants";
import Link from "next/link";

interface Order {
    _id: string;
    orderNumber: string;
    customerInfo?: {
        name: string;
        email: string;
    };
    shippingAddress: {
        firstName: string;
        lastName: string;
    };
    total: number;
    status: string;
    createdAt: string;

    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];
}

interface OrdersTableProps {
    initialOrders: Order[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [loading, setLoading] = useState<string | null>(null);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setLoading(orderId);
        try {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                toast.success(`Order status updated to ${newStatus}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
                return "bg-green-100 text-green-800";
            case "processing":
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "cancelled":
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No orders found
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {order.customerInfo?.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    {CURRENCY.SYMBOL}{order.total.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(order.status)} variant="secondary">
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/payment/success?orderNumber=${order.orderNumber}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "processing")}>
                                                <Clock className="mr-2 h-4 w-4" />
                                                Mark Processing
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "shipped")}>
                                                <Truck className="mr-2 h-4 w-4" />
                                                Mark Shipped
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "delivered")}>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Mark Delivered
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "cancelled")} className="text-red-600">
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Cancel Order
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
