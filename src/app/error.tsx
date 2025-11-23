'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Something went wrong!
                    </h1>

                    <p className="text-muted-foreground">
                        We apologize for the inconvenience. An error occurred while processing your request.
                    </p>

                    {error.message && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                            {error.message}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={reset} size="lg">
                            Try again
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
