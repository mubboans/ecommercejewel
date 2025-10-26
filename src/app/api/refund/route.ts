import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import RefundRequest from "@/models/RefundRequest";

// 🟢 POST /api/refund - create a new refund request
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId, email, reason, refundType, comments } = body;

        // Basic validation
        if (!orderId || !email || !reason || !refundType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        const refund = await RefundRequest.create({
            orderId,
            email,
            reason,
            refundType,
            comments,
        });

        return NextResponse.json(
            { success: true, refund },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Error creating refund:", error);
        return NextResponse.json(
            { error: "Failed to create refund" },
            { status: 500 }
        );
    }
}

// 🔵 GET /api/refund - list all refund requests (admin)
export async function GET() {
    try {
        await connectDB();
        const refunds = await RefundRequest.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(refunds, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching refunds:", error);
        return NextResponse.json(
            { error: "Failed to fetch refunds" },
            { status: 500 }
        );
    }
}
