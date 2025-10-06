import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/lib/validations';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input data
    const validatedData = signUpSchema.parse(body);
    const { name, email, password } = validatedData;

    // Connect to database
    await connectDB();

    // Check if user already exists
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
      role: 'user', // Default role
    });

    // Return success response (don't include password)
    return NextResponse.json(
      {
        message: SUCCESS_MESSAGES.USER_CREATED,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

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