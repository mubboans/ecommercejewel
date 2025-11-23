"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DynamicBannerProps {
    banners: Array<{
        _id: string;
        message: string;
        bgColor: string;
        textColor: string;
        link?: string;
    }>;
}

export function DynamicBanner({ banners }: DynamicBannerProps) {
    const [open, setOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 5000); // Rotate every 5 seconds

            return () => clearInterval(interval);
        }
    }, [banners.length]);

    if (!open || banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    const content = (
        <p className="font-medium text-xs sm:text-sm">{currentBanner.message}</p>
    );

    return (
        <div
            className={cn(
                "relative w-full flex items-center justify-center px-4 py-2"
            )}
            style={{
                backgroundColor: currentBanner.bgColor,
                color: currentBanner.textColor,
            }}
        >
            {currentBanner.link ? (
                <Link href={currentBanner.link} className="hover:underline">
                    {content}
                </Link>
            ) : (
                content
            )}

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 h-6 w-6 hover:bg-white/20"
                style={{ color: currentBanner.textColor }}
                onClick={() => setOpen(false)}
            >
                <X className="h-4 w-4" />
            </Button>

            {banners.length > 1 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                    {banners.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-1 w-1 rounded-full transition-all",
                                index === currentIndex ? "w-3" : "opacity-50"
                            )}
                            style={{ backgroundColor: currentBanner.textColor }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
