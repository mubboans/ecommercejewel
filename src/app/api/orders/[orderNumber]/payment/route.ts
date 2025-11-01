import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params;
        const { paymentId, status, method } = await req.json();

        await connectDB();

        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Update payment info
        order.paymentInfo = {
            ...order.paymentInfo,
            paymentId,
            status,
            method: method || order.paymentInfo.method
        };

        // If payment is completed, update order status and reduce stock
        if (status === 'completed') {
            order.status = 'confirmed';

            // Reduce stock for each item
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    {
                        $inc: { stockCount: -item.quantity },
                        $set: { inStock: { $gt: ['$stockCount', item.quantity] } }
                    }
                );
            }
        } else if (status === 'failed') {
            order.status = 'pending';
        }

        await order.save();

        return NextResponse.json({
            message: 'Payment status updated successfully',
            order: {
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentInfo.status
            }
        });

    } catch (error) {
        console.error("❌ Payment update error:", error);
        return NextResponse.json(
            { error: "Failed to update payment" },
            { status: 500 }
        );
    }
}