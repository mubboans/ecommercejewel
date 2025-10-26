/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminRefundsPage() {
  const router = useRouter();
  const { data: refunds, error, mutate } = useSWR("/api/refund", fetcher);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/refund/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      toast.success(`Refund marked as ${status}`);
      mutate(); // refresh data
    } catch {
      toast.error("Failed to update refund status");
    }
  };

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load refunds
      </div>
    );
  if (!refunds) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-6 relative">
      {/* 🧭 Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        ← Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
              Refund Requests
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            {refunds.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No refund requests yet.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {refunds.map((refund: any) => (
                  <div
                    key={refund._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-2 sm:px-4 hover:bg-gray-50 rounded-md transition-all"
                  >
                    {/* Left side info */}
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">
                        {refund.email}
                      </p>
                      <p className="text-sm text-gray-600">{refund.reason}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                        <span>Order ID: {refund.orderId}</span>
                        <span className="text-gray-400">
                          {new Date(refund.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(refund._id, "Approved")}
                        className="hover:bg-green-50 hover:text-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus(refund._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
