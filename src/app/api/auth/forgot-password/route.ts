/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email/email-service';
import connectDB from '@/lib/db/mongodb';
import { ERROR_MESSAGES } from '@/constants';

/**
 * POST /api/auth/forgot-password
 * Send OTP to user's email for password reset
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      const otpDoc = await OTP.createOTP(email, 'password-reset');
      await sendOTPEmail(email, otpDoc.otp, 'password-reset', 'Dilaara Jewelry');
      return NextResponse.json(
        {
          message: 'If an account exists with this email, you will receive a password reset code.',
          data: { email }
        },
        { status: 200 }
      );
    }

    // Check if user registered with OAuth only (no password)
    if (!user.passwordHash && user.googleId) {
      return NextResponse.json(
        { message: 'This account uses Google sign-in. Please sign in with Google instead.' },
        { status: 400 }
      );
    }

    // Generate and save OTP
    try {
      const otpDoc = await OTP.createOTP(email, 'password-reset');

      // Send OTP email
      const emailSent = await sendOTPEmail(email, otpDoc.otp, 'password-reset', user.name);

      if (!emailSent) {
        console.error('Failed to send password reset OTP email');
      }

      return NextResponse.json(
        {
          message: 'Password reset code sent to your email',
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
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}