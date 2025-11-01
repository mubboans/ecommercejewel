import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

        await connectDB();

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || product.stockCount < item.quantity) {
                return NextResponse.json({
                    valid: false,
                    error: `Insufficient stock for ${item.name}`
                }, { status: 200 });
            }
        }

        return NextResponse.json({
            valid: true,
            message: 'All items are in stock'
        });

    } catch (error) {
        console.error("❌ Stock validation error:", error);
        return NextResponse.json(
            { error: "Failed to validate stock" },
            { status: 500 }
        );
    }
}