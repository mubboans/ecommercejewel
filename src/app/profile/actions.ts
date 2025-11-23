"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { IAddress, IUser } from "@/types";

export async function getUserProfile() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: "Not authenticated" };
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email }).lean();

        if (!user) {
            return { error: "User not found" };
        }

        return {
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
                gender: user.gender || "",
                image: user.image || user.avatar || "",
                addresses: user.addresses || [],
            },
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { error: "Failed to fetch profile" };
    }
}

export async function updateUserProfile(data: {
    name: string;
    phone?: string;
    dateOfBirth?: Date | null;
    gender?: string;
}) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: "Not authenticated" };
        }

        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    name: data.name,
                    phone: data.phone,
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender,
                },
            },
            { new: true }
        ).lean();

        if (!updatedUser) {
            return { error: "User not found" };
        }

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { error: "Failed to update profile" };
    }
}

export async function addAddress(data: IAddress) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: "Not authenticated" };
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return { error: "User not found" };
        }

        if (!user.addresses) {
            user.addresses = [];
        }

        // If this is the first address or set as default, handle default logic
        if (data.isDefault) {
            user.addresses.forEach((addr: IAddress) => addr.isDefault = false);
        } else if (user.addresses.length === 0) {
            data.isDefault = true;
        }

        user.addresses.push(data);
        await user.save();

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Add address error:", error);
        return { error: "Failed to add address" };
    }
}

export async function updateAddress(addressId: string, data: Partial<IAddress>) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: "Not authenticated" };
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return { error: "User not found" };
        }

        if (!user.addresses) {
            return { error: "Address not found" };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const address = user.addresses.find((addr: any) => addr._id.toString() === addressId);

        if (!address) {
            return { error: "Address not found" };
        }

        if (data.isDefault) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.addresses.forEach((addr: any) => addr.isDefault = false);
        }

        // Update fields
        Object.assign(address, data);

        await user.save();

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Update address error:", error);
        return { error: "Failed to update address" };
    }
}

export async function deleteAddress(addressId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: "Not authenticated" };
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return { error: "User not found" };
        }

        if (user.addresses) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
            await user.save();
        }

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Delete address error:", error);
        return { error: "Failed to delete address" };
    }
}
