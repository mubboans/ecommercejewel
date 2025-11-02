// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';

import Order from '@/models/Order';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
    try {
        await connectDB();

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        return NextResponse.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingOrders,
            lowStockProducts: 5 // Replace with actual query
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}