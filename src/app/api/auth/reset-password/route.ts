/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import OTP from '@/models/OTP';
import connectDB from '@/lib/db/mongodb';
import { ERROR_MESSAGES } from '@/constants';

/**
 * POST /api/auth/reset-password
 * Verify OTP and reset user's password
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp, newPassword } = body;

    // Validate required fields
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify OTP
    try {
      await OTP.verifyOTP(email, otp, 'password-reset');
    } catch (otpError: any) {
      return NextResponse.json(
        { message: otpError.message },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user registered with OAuth only
    if (!user.passwordHash && user.googleId) {
      return NextResponse.json(
        { message: 'This account uses Google sign-in. Password reset is not available.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    user.passwordHash = hashedPassword;

    // Clear any old reset tokens (if they exist)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: 'Password reset successful. You can now sign in with your new password.',
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}