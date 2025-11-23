/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/components/AnalyticsDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsData {
  revenueData: Array<{ month: string; revenue: number }>;
  orderStatusData: Array<{ status: string; count: number }>;
  paymentMethodData: Array<{ method: string; count: number }>;
  salesData: Array<{ date: string; sales: number }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsDashboard({ detailed = false }) {
  const [data, setData] = useState<AnalyticsData>({
    revenueData: [],
    orderStatusData: [],
    paymentMethodData: [],
    salesData: [],
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: AnalyticsData = {
      revenueData: [
        { month: "Jan", revenue: 40000 },
        { month: "Feb", revenue: 30000 },
        { month: "Mar", revenue: 20000 },
        { month: "Apr", revenue: 27800 },
        { month: "May", revenue: 18900 },
        { month: "Jun", revenue: 23900 },
        { month: "Jul", revenue: 34900 },
      ],
      orderStatusData: [
        { status: "Delivered", count: 400 },
        { status: "Processing", count: 300 },
        { status: "Shipped", count: 200 },
        { status: "Pending", count: 100 },
        { status: "Cancelled", count: 50 },
      ],
      paymentMethodData: [
        { method: "Razorpay", count: 600 },
        { method: "Stripe", count: 300 },
        { method: "COD", count: 100 },
      ],
      salesData: [
        { date: "2024-01", sales: 4000 },
        { date: "2024-02", sales: 3000 },
        { date: "2024-03", sales: 2000 },
        { date: "2024-04", sales: 2780 },
        { date: "2024-05", sales: 1890 },
        { date: "2024-06", sales: 2390 },
        { date: "2024-07", sales: 3490 },
      ],
    };
    setData(mockData);
  }, []);

  if (detailed) {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number | string) => [
                      `₹${value}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => {
                        const { status, count } = props.payload;
                        return `${status}: ${count}`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.orderStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { method, count } = props.payload;
                      return `${method}: ${count}`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.paymentMethodData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: any) => [`₹${value}`, "Sales"]} />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
