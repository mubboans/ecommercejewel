/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email/email-service';
import connectDB from '@/lib/db/mongodb';
import { ERROR_MESSAGES } from '@/constants';

/**
 * POST /api/auth/resend-otp
 * Resend OTP to user's email
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, name, purpose = 'registration' } = body;

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Generate and save new OTP
        try {
            const otpDoc = await OTP.createOTP(email, purpose);

            // Send OTP email
            const emailSent = await sendOTPEmail(email, otpDoc.otp, purpose, name);

            if (!emailSent) {
                console.error('Failed to send OTP email');
            }

            return NextResponse.json(
                {
                    message: 'Verification code resent to your email',
                    data: {
                        email,
                        otpSent: emailSent,
                        expiresIn: 600, // 10 minutes
                    },
                },
                { status: 200 }
            );
        } catch (otpError: any) {
            // Handle rate limiting
            if (otpError.message.includes('Too many OTP requests')) {
                return NextResponse.json(
                    { message: otpError.message },
                    { status: 429 }
                );
            }
            throw otpError;
        }

    } catch (error: any) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            { message: ERROR_MESSAGES.SERVER_ERROR },
            { status: 500 }
        );
    }
}
