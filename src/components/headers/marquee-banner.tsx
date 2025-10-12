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
  { text: "🎁 Free Shipping on orders above ₹1 499", query: "freeship" },
];

export function MarqueeBanner() {
  /* Duplicate array for seamless loop */
  const extended = [...banners, ...banners];

  return (
    <div className="relative w-full overflow-hidden isolate select-none bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-[0_2px_6px_-1px_rgba(0,0,0,.1)]">
      {/* decorative fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-rose-500 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-rose-500 to-transparent" />

      <div
        className={cn(
          "flex animate-marquee hover:[animation-play-state:paused]",
          "py-2.5 text-sm font-medium tracking-wide",
          "sm:py-3 sm:text-base"
        )}
        aria-live="polite"
      >
        {extended.map((b, i) => (
          <Link
            key={`${b.query}-${i}`}
            href={`/products?highlight=${b.query}`}
            className={cn(
              "mx-8 flex-shrink-0 whitespace-nowrap rounded-md px-3 py-1",
              "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50",
              "transition"
            )}
          >
            {b.text}
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-marquee {
            animation: marquee 28s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        }
      `}</style>
    </div>
  );
}
