import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import ShippingSettings from "@/models/ShippingSettings";

// GET - Get shipping settings for frontend
export async function GET() {
    try {
        await connectDB();
        const settings = await ShippingSettings.getSettings();

        // Return only the necessary fields for frontend
        return NextResponse.json({
            freeShippingThreshold: settings.freeShippingThreshold,
            taxRate: settings.taxRate,
            shippingMethods: settings.shippingMethods.filter(method => method.enabled)
        });
    } catch (error) {
        console.error("❌ Error fetching shipping settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch shipping settings" },
            { status: 500 }
        );
    }
}