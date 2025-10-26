import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/models/Order';
import connectDB from '@/lib/db/mongodb';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get user session (you'll need to set up NextAuth)
        // const session = await getServerSession();
        // if (!session) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const body = await request.json();

        // Validate required fields
        const requiredFields = [
            'userId', 'customerInfo', 'items', 'subtotal', 'tax',
            'shipping', 'total', 'paymentMethod', 'shippingAddress'
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create order
        const order = new Order({
            userId: body.userId,
            customerInfo: body.customerInfo,
            items: body.items,
            subtotal: body.subtotal,
            tax: body.tax,
            taxRate: 0.18,
            shipping: body.shipping,
            shippingMethod: body.shippingMethod || 'standard',
            total: body.total,
            paymentMethod: body.paymentMethod,
            paymentStatus: 'pending',
            shippingAddress: body.shippingAddress,
            billingAddress: body.billingAddress || body.shippingAddress,
            notes: body.notes,
            deviceInfo: body.deviceInfo || {},
            source: 'web',
            status: 'created',
            inventoryReserved: true,
            inventoryReleaseDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        });

        const savedOrder = await order.save();

        return NextResponse.json(
            {
                message: 'Order created successfully',
                order: savedOrder
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}