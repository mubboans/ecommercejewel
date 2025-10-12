import { NextRequest, NextResponse } from "next/server";
import Product, { IProduct } from "@/models/Product";
import { authOptions } from "@/lib/auth/auth.config";
import { getServerSession } from "next-auth";


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // await connectDB();
    const body: IProduct = await req.json();

    const created = await Product.create(body);
    return NextResponse.json(created, { status: 201 });
}