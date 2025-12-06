import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOTP extends Document {
    email: string;
    otp: string;
    purpose: 'registration' | 'password-reset' | 'email-verification';
    expiresAt: Date;
    attempts: number;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for static methods
export interface IOTPModel extends Model<IOTP> {
    generateOTP(): string;
    createOTP(
        email: string,
        purpose?: 'registration' | 'password-reset' | 'email-verification'
    ): Promise<IOTP>;
    verifyOTP(
        email: string,
        otp: string,
        purpose?: 'registration' | 'password-reset' | 'email-verification'
    ): Promise<boolean>;
    cleanupExpired(): Promise<number>;
}

const OTPSchema = new Schema<IOTP, IOTPModel>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            index: true,
        },
        otp: {
            type: String,
            required: [true, 'OTP is required'],
            minlength: [6, 'OTP must be 6 digits'],
            maxlength: [6, 'OTP must be 6 digits'],
        },
        purpose: {
            type: String,
            enum: ['registration', 'password-reset', 'email-verification'],
            required: true,
            default: 'registration',
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true, // Index for efficient cleanup
        },
        attempts: {
            type: Number,
            default: 0,
            max: [5, 'Maximum verification attempts exceeded'],
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
OTPSchema.index({ email: 1, purpose: 1, verified: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup

// Static method to generate OTP
OTPSchema.statics.generateOTP = function (): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create new OTP
OTPSchema.statics.createOTP = async function (
    this: IOTPModel,
    email: string,
    purpose: 'registration' | 'password-reset' | 'email-verification' = 'registration'
): Promise<IOTP> {
    // Check rate limiting: max 3 OTPs per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await this.countDocuments({
        email,
        purpose,
        createdAt: { $gte: oneHourAgo },
    });

    if (recentOTPs >= 3) {
        throw new Error('Too many OTP requests. Please try again after an hour.');
    }

    // Invalidate any existing unverified OTPs for this email and purpose
    await this.updateMany(
        { email, purpose, verified: false },
        { $set: { verified: true } } // Mark as verified to prevent reuse
    );

    // Generate new OTP
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create and save OTP
    const otpDoc = await this.create({
        email,
        otp,
        purpose,
        expiresAt,
        attempts: 0,
        verified: false,
    });

    return otpDoc;
};

// Static method to verify OTP
OTPSchema.statics.verifyOTP = async function (
    this: IOTPModel,
    email: string,
    otp: string,
    purpose: 'registration' | 'password-reset' | 'email-verification' = 'registration'
): Promise<boolean> {
    const otpDoc = await this.findOne({
        email,
        purpose,
        verified: false,
        expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 }); // Get the most recent OTP

    if (!otpDoc) {
        throw new Error('Invalid or expired OTP');
    }

    // Increment attempts
    otpDoc.attempts += 1;
    await otpDoc.save();

    // Check if max attempts exceeded
    if (otpDoc.attempts > 5) {
        throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
        throw new Error(`Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`);
    }

    // Mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    return true;
};

// Static method to cleanup expired OTPs (can be called periodically)
OTPSchema.statics.cleanupExpired = async function (this: IOTPModel): Promise<number> {
    const result = await this.deleteMany({
        expiresAt: { $lt: new Date() },
    });
    return result.deletedCount || 0;
};

export default (mongoose.models.OTP as IOTPModel) ||
    mongoose.model<IOTP, IOTPModel>('OTP', OTPSchema);
