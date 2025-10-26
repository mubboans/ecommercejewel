import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import RefundRequest from "@/models/RefundRequest";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { status } = body;

        if (!status || !["Pending", "Approved", "Rejected"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid or missing status" },
                { status: 400 }
            );
        }

        await connectDB();

        const updatedRefund = await RefundRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRefund)
            return NextResponse.json(
                { error: "Refund not found" },
                { status: 404 }
            );

        return NextResponse.json(updatedRefund, { status: 200 });
    } catch (error) {
        console.error("❌ Error updating refund:", error);
        return NextResponse.json(
            { error: "Failed to update refund" },
            { status: 500 }
        );
    }
}
