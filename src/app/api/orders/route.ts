import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth/auth.config";

import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create new order
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            items,
            subtotal,
            tax = 0,
            shipping = 0,
            shippingAddress,
            billingAddress,
            paymentMethod,
            shippingMethod,
            notes,
            customerInfo,
            orderNumber,
        } = body;

        await connectDB();

        // Validate and reserve stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || product.stockCount < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${item.name}` },
                    { status: 400 }
                );
            }
        }

        // Calculate totals
        const total = subtotal + tax + shipping;

        // Create order with pending status
        const order = new Order({
            orderNumber,
            userId: session.user.id,
            items,
            subtotal,
            tax,
            shipping,
            total,
            status: 'pending',
            customerInfo,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentInfo: {
                method: paymentMethod,
                status: 'pending',
                amount: total,
                currency: 'INR'
            },
            shippingMethod,
            notes,
        });

        // Handle Razorpay Order Creation
        let razorpayOrder = null;
        if (paymentMethod === 'razorpay') {
            try {
                const options = {
                    amount: Math.round(total * 100), // amount in smallest currency unit
                    currency: "INR",
                    receipt: order._id.toString(),
                };
                razorpayOrder = await razorpay.orders.create(options);

                // Save Razorpay Order ID
                order.paymentInfo.razorpayOrderId = razorpayOrder.id;
            } catch (razorpayError) {
                console.error("Razorpay order creation failed:", razorpayError);
                return NextResponse.json(
                    { error: "Failed to initiate payment gateway" },
                    { status: 500 }
                );
            }
        }

        await order.save();

        return NextResponse.json({
            orderNumber: order.orderNumber,
            message: 'Order created successfully',
            orderId: order._id,
            // Return Razorpay details if applicable
            razorpayOrderId: razorpayOrder?.id,
            amount: razorpayOrder?.amount,
            currency: razorpayOrder?.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Order creation error:", error);
        return NextResponse.json(
            {
                error: "Failed to create order",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Get user's orders
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const orders = await Order.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments({ userId: session.user.id });

        return NextResponse.json({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error("❌ Orders fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}