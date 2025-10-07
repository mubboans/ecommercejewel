"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

const banners = [
  {
    text: "🔥 Biggest Discount – Up to 40 % off on Earrings",
    query: "discount",
  },
  { text: "✨ New Arrivals – Fresh styles just landed", query: "new" },
  { text: "⚡ Flash Sale – Flat ₹395 on selected pieces", query: "flash" },
];

export function MarqueeBanner() {
  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2">
      <div className="animate-marquee hover:[animation-play-state:paused]">
        {banners.map((b, i) => (
          <Link
            key={i}
            href={`/products?highlight=${b.query}`}
            className={cn(
              "inline-block mx-8 sm:mx-12 text-xs sm:text-sm font-medium",
              "hover:underline focus:outline-none"
            )}
          >
            {b.text}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
