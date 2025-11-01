import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShippingMethod {
    name: string;
    description: string;
    price: number;
    deliveryTime: string;
    enabled: boolean;
}

export interface IShippingSettings extends Document {
    freeShippingThreshold: number;
    defaultShippingMethod: string;
    shippingMethods: IShippingMethod[];
    taxRate: number;
    updatedBy: mongoose.Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}

// Define the static methods interface
interface ShippingSettingsModel extends Model<IShippingSettings> {
    getSettings(): Promise<IShippingSettings>;
}

const ShippingMethodSchema = new Schema<IShippingMethod>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    deliveryTime: { type: String, required: true },
    enabled: { type: Boolean, default: true }
});

const ShippingSettingsSchema = new Schema<IShippingSettings>({
    freeShippingThreshold: {
        type: Number,
        required: true,
        default: 500
    },
    defaultShippingMethod: {
        type: String,
        required: true,
        default: 'standard'
    },
    shippingMethods: [ShippingMethodSchema],
    taxRate: {
        type: Number,
        required: true,
        default: 18
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create a singleton document - Define the static method
ShippingSettingsSchema.statics.getSettings = async function (): Promise<IShippingSettings> {
    let settings = await this.findOne();
    if (!settings) {
        // Create default settings if none exist
        settings = await this.create({
            freeShippingThreshold: 500,
            defaultShippingMethod: 'standard',
            taxRate: 18,
            updatedBy: new mongoose.Types.ObjectId('000000000000000000000000'), // Default admin ID
            shippingMethods: [
                {
                    name: 'standard',
                    description: 'Standard Shipping',
                    price: 50,
                    deliveryTime: '3-5 business days',
                    enabled: true
                },
                {
                    name: 'express',
                    description: 'Express Shipping',
                    price: 100,
                    deliveryTime: '1-2 business days',
                    enabled: true
                },
                {
                    name: 'overnight',
                    description: 'Overnight Shipping',
                    price: 200,
                    deliveryTime: 'Next business day',
                    enabled: true
                }
            ]
        });
    }
    return settings;
};

// Create and export the model with proper typing
const ShippingSettings = mongoose.models.ShippingSettings as ShippingSettingsModel ||
    mongoose.model<IShippingSettings, ShippingSettingsModel>('ShippingSettings', ShippingSettingsSchema);

export default ShippingSettings;