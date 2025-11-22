import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await connectDB();

            const order = await Order.findOne({
                "paymentInfo.razorpayOrderId": razorpay_order_id
            });

            if (!order) {
                return NextResponse.json(
                    { error: "Order not found" },
                    { status: 404 }
                );
            }

            // Update payment info
            order.paymentInfo = {
                ...order.paymentInfo,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: 'completed',
                paymentId: razorpay_payment_id // Standardize payment ID
            };

            order.status = 'confirmed';

            // Reduce stock for each item
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stockCount = Math.max(0, product.stockCount - item.quantity);
                    product.inStock = product.stockCount > 0;
                    await product.save();
                }
            }

            await order.save();

            return NextResponse.json({
                message: "Payment verified successfully",
                orderId: order._id
            });
        } else {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("❌ Payment verification error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
