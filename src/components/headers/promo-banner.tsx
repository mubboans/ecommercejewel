"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PromoBanner() {
  /* if you want to show it only once per session, swap with localStorage */
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className={cn(
        "relative w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white",
        "flex items-center justify-center px-4 py-2 text-xs sm:text-sm"
      )}
    >
      <p className="font-medium">
        ⚡ ALL PRODUCTS FLAT ₹395 · ENDS IN 00:00:23 · HDFC Cards up to ₹5K off
      </p>

      {/* optional close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 h-6 w-6 text-white/80 hover:text-white"
        onClick={() => setOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
