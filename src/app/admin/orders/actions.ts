"use server";

import connectDB from "@/lib/db/mongodb";
import Order, { IOrder, IOrderItem } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function getAllOrders() {
    try {
        await connectDB();
        const orders = await Order.find().sort({ createdAt: -1 }).lean();

        // Serialize the data to plain objects
        return orders.map((order: unknown) => {
            const typedOrder = order as IOrder;
            return {
                ...typedOrder,
                _id: typedOrder._id.toString(),
                orderNumber: typedOrder.orderNumber,
                userId: typedOrder.userId.toString(),
                items: typedOrder.items.map((item: IOrderItem) => ({
                    ...item,
                    productId: item.productId.toString()
                })),
                total: typedOrder.total,
                status: typedOrder.status,
                shippingAddress: typedOrder.shippingAddress,
                customerInfo: typedOrder.customerInfo,
                createdAt: typedOrder.createdAt.toISOString(),
                updatedAt: typedOrder.updatedAt.toISOString(),
                estimatedDelivery: typedOrder.estimatedDelivery?.toISOString()
            };
        });

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
