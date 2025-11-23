import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/main-layout';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <FileQuestion className="h-8 w-8 text-blue-600" />
                    </div>

                    <h1 className="text-6xl font-bold text-gray-900">404</h1>

                    <h2 className="text-2xl font-semibold text-gray-900">
                        Page Not Found
                    </h2>

                    <p className="text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button size="lg" asChild>
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
