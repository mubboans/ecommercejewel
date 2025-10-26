import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import RefundRequest from "@/models/RefundRequest";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Await the params promise
        const { id } = await params;
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

// Also add other HTTP methods if needed
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await connectDB();

        const refund = await RefundRequest.findById(id);

        if (!refund)
            return NextResponse.json(
                { error: "Refund not found" },
                { status: 404 }
            );

        return NextResponse.json(refund, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching refund:", error);
        return NextResponse.json(
            { error: "Failed to fetch refund" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await connectDB();

        const deletedRefund = await RefundRequest.findByIdAndDelete(id);

        if (!deletedRefund)
            return NextResponse.json(
                { error: "Refund not found" },
                { status: 404 }
            );

        return NextResponse.json(
            { message: "Refund request deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error deleting refund:", error);
        return NextResponse.json(
            { error: "Failed to delete refund" },
            { status: 500 }
        );
    }
}