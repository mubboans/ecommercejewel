// app/return/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReturnPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button */}
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          &larr; Back
        </Button>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center">
        Return & Exchange Policy
      </h1>

      {/* Easy Returns Card */}
      <Card>
        <CardHeader>
          <CardTitle>Easy Returns</CardTitle>
          <CardDescription>
            We want you to love your jewelry. If you’re not completely
            satisfied, you can return it within 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 space-y-2">
            <li>Items must be in original condition and packaging.</li>
            <li>Proof of purchase is required for all returns.</li>
            <li>Custom or personalized items are non-returnable.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Refunds Card */}
      <Card>
        <CardHeader>
          <CardTitle>Refunds</CardTitle>
          <CardDescription>
            Once we receive your item, we will inspect it and notify you of the
            status of your refund.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Refunds are processed to your original method of payment within 7–10
            business days.
          </p>
        </CardContent>
      </Card>

      {/* Start a Return Card */}
      <Card>
        <CardHeader>
          <CardTitle>Start a Return</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p>Click below to initiate your return process online.</p>
          <Button className="bg-primary text-white hover:bg-primary/90">
            Initiate Return
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-gray-500">
        For more details, please contact our support team.
      </p>
    </div>
  );
}
