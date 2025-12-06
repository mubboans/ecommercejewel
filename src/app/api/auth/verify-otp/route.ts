/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { sendWelcomeEmail } from '@/lib/email/email-service';
import connectDB from '@/lib/db/mongodb';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants';

/**
 * POST /api/auth/verify-otp
 * Step 2: Verify OTP and create user account
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, otp, name, password } = body;

        // Validate required fields
        if (!email || !otp || !name || !password) {
            return NextResponse.json(
                { message: 'Email, OTP, name, and password are required' },
                { status: 400 }
            );
        }

        // Verify OTP
        try {
            await OTP.verifyOTP(email, otp, 'registration');
        } catch (otpError: any) {
            return NextResponse.json(
                { message: otpError.message },
                { status: 400 }
            );
        }

        // Check if user already exists (double-check)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            passwordHash: hashedPassword,
            role: 'user',
            isEmailVerified: true, // Email is verified via OTP
            registerBy: 'email',
        });

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, name).catch(err =>
            console.error('Failed to send welcome email:', err)
        );

        // Return success response
        return NextResponse.json(
            {
                message: SUCCESS_MESSAGES.USER_CREATED,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('OTP verification error:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: ERROR_MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}
