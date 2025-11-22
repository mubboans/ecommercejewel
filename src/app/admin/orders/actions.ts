"use server";

import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function getAllOrders() {
    try {
        await connectDB();
        const orders = await Order.find().sort({ createdAt: -1 }).lean();

        // Serialize the data to plain objects
        return orders.map((order: any) => ({
            _id: order._id.toString(),
            orderNumber: order.orderNumber,
            userId: order.userId.toString(),
            items: order.items.map((item: any) => ({
                ...item,
                productId: item.productId.toString()
            })),
            total: order.total,
            status: order.status,
            shippingAddress: order.shippingAddress,
            customerInfo: order.customerInfo,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            estimatedDelivery: order.estimatedDelivery?.toISOString()
        }));
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await connectDB();
        await Order.findByIdAndUpdate(orderId, { status });
        revalidatePath("/admin/orders");
        revalidatePath("/orders"); // Update user's order list as well
        return { success: true };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "Failed to update order status" };
    }
}
