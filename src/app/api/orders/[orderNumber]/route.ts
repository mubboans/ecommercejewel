import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { authOptions } from "@/lib/auth/auth.config";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { orderNumber } = await params;

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const order = await Order.findOne({
            orderNumber,
            userId: session.user.id
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error("❌ Order fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}