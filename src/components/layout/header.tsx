"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  ShoppingCart,
  Menu,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { SEO } from "@/constants";
import { cn } from "@/lib/utils";

const initials = (name?: string | null) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

/* --------------  DESKTOP USER  -------------- */
const DesktopUser = () => {
  const { data: session } = useSession();
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full shrink-0">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback>{initials(session.user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        {session.user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin</Link>
          </DropdownMenuItem>
        )}
        {session?.user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin/products">Products</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-red-600 dark:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button asChild size="sm">
      <Link href="/auth/signin">Login</Link>
    </Button>
  );
};

/* --------------  MOBILE SHEET  -------------- */
const MobileSheet = () => {
  const { data: session } = useSession();
  const { state } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72">
        <div className="mt-6 flex flex-col gap-3">
          {/* Cart */}
          <Button asChild variant="ghost" className="justify-between">
            <Link href="/cart">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </span>
              {state.itemCount > 0 && (
                <Badge
                  className={cn(
                    "ml-auto shrink-0",
                    "h-5 min-w-[1.25rem] px-1 text-xs"
                  )}
                >
                  {state.itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {session ? (
            <>
              <div className="flex items-center gap-3 rounded-md p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback>
                    {initials(session.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {session.user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <Separator />
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start">
                <Link href="/orders">Orders</Link>
              </Button>
              {session.user?.role === "admin" && (
                <Button asChild variant="ghost" className="justify-start">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Separator />
              <Button
                variant="ghost"
                className="justify-start text-red-600 dark:text-red-400"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Login</Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* --------------  MAIN HEADER  -------------- */
export function Header() {
  const { state } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT: logo  (never shrinks) */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground truncate">
            {SEO.SITE_NAME}
          </span>
        </Link>

        {/* RIGHT: actions  (flex + min-w-0 lets middle space collapse) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {/* Desktop cart */}
          <div className="hidden md:block">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative shrink-0"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {state.itemCount > 0 && (
                  <Badge
                    className={cn(
                      "absolute -top-2 -right-2",
                      "h-5 min-w-[1.25rem] px-1 text-xs"
                    )}
                  >
                    {state.itemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
          <DesktopUser />
          <div className="md:hidden">
            <MobileSheet />
          </div>
        </div>
      </div>
    </header>
  );
}
