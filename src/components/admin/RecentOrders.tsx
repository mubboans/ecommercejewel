// src/app/admin/components/RecentOrders.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders: RecentOrder[] = [
      {
        _id: "1",
        orderNumber: "ORD-123456",
        customerName: "John Doe",
        total: 2999,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        orderNumber: "ORD-123457",
        customerName: "Jane Smith",
        total: 1599,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        orderNumber: "ORD-123458",
        customerName: "Bob Johnson",
        total: 4599,
        status: "shipped",
        createdAt: new Date().toISOString(),
      },
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusVariant = (status: string) => {
    const variants = {
      pending: "secondary" as const,
      confirmed: "default" as const,
      processing: "default" as const,
      shipped: "default" as const,
      delivered: "default" as const,
      cancelled: "destructive" as const,
    } as const;

    return variants[status as keyof typeof variants] || "secondary";
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="flex items-center justify-between p-4 border rounded-lg animate-fade-in"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{order.orderNumber}</p>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.customerName} • ₹{(order.total / 100).toLocaleString()}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
