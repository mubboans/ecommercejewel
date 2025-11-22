"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  ShoppingCart,
  Menu,
  LogOut,
  Package,
  Truck,
  FileText,
  Settings,
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
import { usePathname } from "next/navigation";

const initials = (name?: string | null) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

/* --------------  ADMIN DROPDOWN MENU -------------- */
const AdminDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="min-touch-target">
          Admin
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/admin/"
            className="flex items-center gap-2 w-full"
          >
            <Package className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 w-full"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 w-full"
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/refund" className="flex items-center gap-2 w-full">
            <FileText className="h-4 w-4" />
            Refund
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/admin/shipping"
            className="flex items-center gap-2 w-full"
          >
            <Truck className="h-4 w-4" />
            Shipping
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* --------------  DESKTOP USER  -------------- */
const DesktopUser = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return session ? (
    <div className="flex items-center gap-2">
      {session.user?.role === "admin" && <AdminDropdown />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0 min-touch-target"
          >
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
          {session.user?.role === "admin" && !isAdminRoute && (
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Dashboard</Link>
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
    </div>
  ) : (
    <Button asChild size="sm" className="min-touch-target">
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
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 min-touch-target"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{SEO.SITE_NAME}</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col gap-3">
            {/* Navigation Links */}
            <Button
              asChild
              variant="ghost"
              className="justify-start min-touch-target"
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start min-touch-target"
            >
              <Link href="/products">Products</Link>
            </Button>

            {session ? (
              <>
                <Separator />
                <div className="flex items-center gap-3 rounded-md p-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>
                      {initials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {session.user?.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  className="justify-start min-touch-target"
                >
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start min-touch-target"
                >
                  <Link href="/orders">Orders</Link>
                </Button>

                {session.user?.role === "admin" && (
                  <>
                    <Separator />
                    <div className="px-2 py-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Admin
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start min-touch-target"
                    >
                      <Link href="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start min-touch-target"
                    >
                      <Link
                        href="/admin/products"
                        className="flex items-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Products
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start min-touch-target"
                    >
                      <Link
                        href="/admin/refund"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Refund
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start min-touch-target"
                    >
                      <Link
                        href="/admin/shipping"
                        className="flex items-center gap-2"
                      >
                        <Truck className="h-4 w-4" />
                        Shipping
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start min-touch-target"
                    >
                      {/* <Link
                        href="/admin/content"
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Website Content
                      </Link> */}
                    </Button>
                  </>
                )}

                <Separator />
                <Button
                  variant="ghost"
                  className="justify-start text-red-600 dark:text-red-400 min-touch-target"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild className="min-touch-target mt-4">
                <Link href="/auth/signin">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* --------------  MAIN HEADER  -------------- */
export function Header() {
  const { state } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-4 md:px-6 lg:px-8">
        {/* LEFT: Mobile menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <div className="sm:hidden">
            <MobileSheet />
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 min-w-0"
          >
            <ShoppingBag className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
            <span className="font-bold text-lg sm:text-xl text-foreground truncate hidden xs:inline">
              {SEO.SITE_NAME}
            </span>
          </Link>
        </div>

        {/* CENTER: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/products" className="transition-colors hover:text-primary">
            Products
          </Link>
          <Link href="/orders" className="transition-colors hover:text-primary">
            Orders
          </Link>
        </nav>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <ThemeToggle />

          {/* Cart icon - Always visible on all screens */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative shrink-0 min-touch-target"
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

          {/* Desktop user - hidden on mobile */}
          <div className="hidden sm:block">
            <DesktopUser />
          </div>
        </div>
      </div>
    </header >
  );
}
