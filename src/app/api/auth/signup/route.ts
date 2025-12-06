/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { signUpSchema } from '@/lib/validations';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email/email-service';
import connectDB from '@/lib/db/mongodb';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants';

/**
 * POST /api/auth/signup
 * Step 1: Send OTP to user's email for verification
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate input data (only name and email for OTP step)
    const { name, email, password } = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate and save OTP
    try {
      const otpDoc = await OTP.createOTP(email, 'registration');

      // Send OTP email
      const emailSent = await sendOTPEmail(email, otpDoc.otp, 'registration', name);

      if (!emailSent) {
        console.error('Failed to send OTP email');
        // Continue anyway - user can request resend
      }

      // Store registration data temporarily in session/response
      // Note: Password will be sent again during verification
      return NextResponse.json(
        {
          message: 'Verification code sent to your email',
          data: {
            email,
            otpSent: emailSent,
            expiresIn: 600, // 10 minutes in seconds
          },
        },
        { status: 200 }
      );
    } catch (otpError: any) {
      // Handle rate limiting error
      if (otpError.message.includes('Too many OTP requests')) {
        return NextResponse.json(
          { message: otpError.message },
          { status: 429 } // Too Many Requests
        );
      }
      throw otpError;
    }

  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

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