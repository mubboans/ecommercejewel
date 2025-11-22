"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2, ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";

function FailedContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Payment Failed</h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
                We couldn't process your payment for order <span className="font-semibold text-gray-900">#{orderNumber}</span>.
                Please try again or use a different payment method.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                </Button>
                <Button asChild>
                    <Link href="/checkout">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <MainLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            }>
                <FailedContent />
            </Suspense>
        </MainLayout>
    );
}
