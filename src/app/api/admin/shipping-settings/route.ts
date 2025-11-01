import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import ShippingSettings from "@/models/ShippingSettings";
import { authOptions } from "@/lib/auth/auth.config";
import mongoose from "mongoose";


// GET - Get shipping settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log("Session in shipping settings GET:", session);
        
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const settings = await ShippingSettings.getSettings();

        return NextResponse.json(settings);
    } catch (error) {
        console.error("❌ Error fetching shipping settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch shipping settings" },
            { status: 500 }
        );
    }
}

// PUT - Update shipping settings
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            freeShippingThreshold,
            defaultShippingMethod,
            shippingMethods,
            taxRate
        } = body;

        await connectDB();

        // Get current settings
        let settings = await ShippingSettings.findOne();

        if (!settings) {
            // Create new settings if they don't exist
            settings = new ShippingSettings({
                freeShippingThreshold,
                defaultShippingMethod,
                shippingMethods,
                taxRate,
                updatedBy: session.user.id
            });
        } else {
            // Update existing settings
            settings.freeShippingThreshold = freeShippingThreshold;
            settings.defaultShippingMethod = defaultShippingMethod;
            settings.shippingMethods = shippingMethods;
            settings.taxRate = taxRate;
            settings.updatedBy = new mongoose.Types.ObjectId(session.user.id);
        }

        await settings.save();

        return NextResponse.json({
            message: "Shipping settings updated successfully",
            settings
        });
    } catch (error) {
        console.error("❌ Error updating shipping settings:", error);
        return NextResponse.json(
            { error: "Failed to update shipping settings" },
            { status: 500 }
        );
    }
}