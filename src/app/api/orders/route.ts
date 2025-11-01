import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth/auth.config";

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
            userId: session.user.id,
            items,
            subtotal,
            tax,
            shipping,
            total,
            status: 'pending',
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

        await order.save();

        return NextResponse.json({
            orderNumber: order.orderNumber,
            message: 'Order created successfully',
            orderId: order._id
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Order creation error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
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