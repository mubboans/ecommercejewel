"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowBigLeft } from "lucide-react";

const refundSchema = z.object({
  orderId: z.string().min(3, "Order ID is required"),
  email: z.string().email("Enter a valid email"),
  reason: z.string().min(5, "Please provide a reason"),
  refundType: z.enum(["Full", "Partial"]),
  comments: z.string().optional(),
});

type RefundFormData = z.infer<typeof refundSchema>;

export default function RefundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: { refundType: "Full" },
  });

  const onSubmit = async (data: RefundFormData) => {
    try {
      setLoading(true);

      const res = await fetch("/api/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Request failed");

      toast.success("Refund Request Submitted 💎", {
        description: "We’ll contact you within 2–3 business days.",
      });

      form.reset();
    } catch (err) {
      toast.error("Something went wrong 😢", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12 px-4 relative">
      {/* Back Button */}
      {/* <Button
        variant="outline"
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        ← Back
      </Button> */}

      {/* <div className="w-full max-w-lg">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6"
        >
          ← Back
        </Button>
      </div> */}

      <Card className="w-full max-w-lg shadow-lg border border-gray-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()} size="sm">
              <ArrowBigLeft/>
            </Button>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Refund Request
            </CardTitle>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Fill in your details to request a refund. Our support team will
            reach out within 2–3 business days.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Order ID */}
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Enter your order ID"
                {...form.register("orderId")}
              />
              {form.formState.errors.orderId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.orderId.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Refund Type */}
            <div className="space-y-2">
              <Label htmlFor="refundType">Refund Type</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    "refundType",
                    value as RefundFormData["refundType"]
                  )
                }
                defaultValue={form.watch("refundType")}
              >
                <SelectTrigger id="refundType">
                  <SelectValue placeholder="Select refund type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full">Full Refund</SelectItem>
                  <SelectItem value="Partial">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Refund</Label>
              <Input
                id="reason"
                placeholder="e.g. Damaged item, wrong product, etc."
                {...form.register("reason")}
              />
              {form.formState.errors.reason && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.reason.message}
                </p>
              )}
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                placeholder="Any extra details you’d like to share..."
                {...form.register("comments")}
              />
            </div>

            <CardFooter className="pt-4 flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
              >
                {loading ? "Submitting..." : "Submit Refund Request"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
