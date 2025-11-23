"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/models/Banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

// Get all banners (admin)
export async function getBanners() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const banners = await Banner.find({}).sort({ priority: -1, createdAt: -1 }).lean();
        return { banners: JSON.parse(JSON.stringify(banners)) };
    } catch (error) {
        console.error("Get banners error:", error);
        return { error: "Failed to fetch banners" };
    }
}

// Get active banners (public)
export async function getActiveBanners() {
    try {
        await connectDB();
        const now = new Date();

        const banners = await Banner.find({
            isActive: true,
            $and: [
                {
                    $or: [
                        { startDate: { $exists: false } },
                        { startDate: { $lte: now } },
                    ],
                },
                {
                    $or: [
                        { endDate: { $exists: false } },
                        { endDate: { $gte: now } },
                    ],
                },
            ],
        })
            .sort({ priority: -1 })
            .limit(1)
            .lean();

        return { banners: JSON.parse(JSON.stringify(banners)) };
    } catch (error) {
        console.error("Get active banners error:", error);
        return { banners: [] };
    }
}

// Get banner by ID
export async function getBannerById(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const banner = await Banner.findById(id).lean();
        if (!banner) {
            return { error: "Banner not found" };
        }

        return { banner: JSON.parse(JSON.stringify(banner)) };
    } catch (error) {
        console.error("Get banner error:", error);
        return { error: "Failed to fetch banner" };
    }
}

// Create banner
export async function createBanner(data: {
    title: string;
    message: string;
    bgColor?: string;
    textColor?: string;
    link?: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    priority?: number;
}) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const banner = await Banner.create(data);
        revalidatePath("/");
        revalidatePath("/admin/banners");

        return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
    } catch (error) {
        console.error("Create banner error:", error);
        return { error: "Failed to create banner" };
    }
}

// Update banner
export async function updateBanner(
    id: string,
    data: {
        title?: string;
        message?: string;
        bgColor?: string;
        textColor?: string;
        link?: string;
        isActive?: boolean;
        startDate?: Date;
        endDate?: Date;
        priority?: number;
    }
) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
        if (!banner) {
            return { error: "Banner not found" };
        }

        revalidatePath("/");
        revalidatePath("/admin/banners");

        return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
    } catch (error) {
        console.error("Update banner error:", error);
        return { error: "Failed to update banner" };
    }
}

// Delete banner
export async function deleteBanner(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) {
            return { error: "Banner not found" };
        }

        revalidatePath("/");
        revalidatePath("/admin/banners");

        return { success: true };
    } catch (error) {
        console.error("Delete banner error:", error);
        return { error: "Failed to delete banner" };
    }
}

// Toggle banner status
export async function toggleBannerStatus(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        const banner = await Banner.findById(id);
        if (!banner) {
            return { error: "Banner not found" };
        }

        banner.isActive = !banner.isActive;
        await banner.save();

        revalidatePath("/");
        revalidatePath("/admin/banners");

        return { success: true, isActive: banner.isActive };
    } catch (error) {
        console.error("Toggle banner status error:", error);
        return { error: "Failed to toggle banner status" };
    }
}
