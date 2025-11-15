import { authOptions } from "@/lib/auth/auth.config";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

        const products = await Product.find({}).sort({ createdAt: -1 });

        if (!products?.length) {
            return NextResponse.json(
                { error: "No Products Found" },
                { status: 404 }
            );
        }

        return NextResponse.json(products);

    } catch (error) {
        console.error("❌ Products fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}