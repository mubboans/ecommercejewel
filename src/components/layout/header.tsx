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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
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
            href="/admin/categories"
            className="flex items-center gap-2 w-full"
          >
            <Package className="h-4 w-4" />
            Categories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 w-full"
          >
            <FileText className="h-4 w-4" />
            Banners
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
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 min-touch-target"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-sm flex flex-col p-0">
        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">{SEO.SITE_NAME}</span>
          </div>

          {session ? (
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>{initials(session.user?.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {session.user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </div>
          ) : (
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link href="/auth/signin">Login / Sign Up</Link>
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Menu
            </p>
            <Button
              asChild
              variant="ghost"
              className="justify-start h-11 text-base font-medium"
              onClick={() => setOpen(false)}
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start h-11 text-base font-medium"
              onClick={() => setOpen(false)}
            >
              <Link href="/products">Products</Link>
            </Button>

            {session && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start h-11 text-base font-medium"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/orders">My Orders</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start h-11 text-base font-medium"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/profile">Profile Settings</Link>
                </Button>

                {session.user?.role === "admin" && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-between h-11 text-base font-medium hover:bg-transparent"
                      onClick={() => setAdminOpen(!adminOpen)}
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </span>
                      {adminOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>

                    {adminOpen && (
                      <div className="ml-4 flex flex-col gap-1 mt-1 border-l-2 pl-2">
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin">Dashboard</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin/products">Products</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin/categories">Categories</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin/banners">Banners</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin/orders">Orders</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin/refund">Refunds</Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start h-10 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin/shipping">Shipping</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        {session && (
          <div className="p-4 border-t bg-muted/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        )}
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
