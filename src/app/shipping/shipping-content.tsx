"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ShippingComponent } from "@/components/shipping/shipping-component";
import { ShippingCalculator } from "@/components/shipping/shipping-calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  Shield,
  Package,
  Clock,
  MapPin,
  Gift,
  RotateCcw,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";
import { CONTACT_INFO, CURRENCY, SEO } from "@/constants";
import Link from "next/link";

interface ShippingSettings {
  freeShippingThreshold: number;
  taxRate: number;
  shippingMethods: Array<{
    name: string;
    description: string;
    price: number;
    deliveryTime: string;
    enabled: boolean;
  }>;
}

export function ShippingPageContent() {
  const [shippingSettings, setShippingSettings] =
    useState<ShippingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("options");

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    try {
      const response = await fetch("/api/shipping/settings");
      if (response.ok) {
        const data = await response.json();
        setShippingSettings(data);
      }
    } catch (error) {
      console.error("Error fetching shipping settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const freeShippingThreshold = shippingSettings?.freeShippingThreshold || 500;
  const availableMethods =
    shippingSettings?.shippingMethods?.filter((method) => method.enabled) || [];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Shipping & Delivery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium shipping for your precious jewellery. Fast, secure, and
              fully insured delivery across India.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-8"
            >
              {/* Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 h-auto gap-2 p-2 bg-muted/50">
                <TabsTrigger
                  value="options"
                  className="flex items-center gap-2 py-3"
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Shipping Options</span>
                  <span className="sm:hidden">Options</span>
                </TabsTrigger>
                <TabsTrigger
                  value="calculator"
                  className="flex items-center gap-2 py-3"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Cost Calculator</span>
                  <span className="sm:hidden">Calculator</span>
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="flex items-center gap-2 py-3"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Policies</span>
                  <span className="sm:hidden">Policies</span>
                </TabsTrigger>
                <TabsTrigger
                  value="support"
                  className="flex items-center gap-2 py-3"
                >
                  <HelpCircle className="h-4 w-4" />
                  Support
                </TabsTrigger>
              </TabsList>

              {/* Shipping Options Tab */}
              <TabsContent value="options" className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Shipping Component */}
                  <div className="lg:col-span-2">
                    <ShippingComponent
                      showFreeShippingProgress={true}
                      currentCartTotal={0}
                    />
                  </div>

                  {/* Quick Info Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Gift className="h-5 w-5 text-primary" />
                          Premium Packaging
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">
                              Luxury Gift Box
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Every jewellery piece comes in an elegant gift box
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">
                              Fully Insured
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              All shipments are insured for your peace of mind
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">
                              Order Tracking
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Real-time tracking for all orders
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          Free Shipping
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          On all orders over {CURRENCY.SYMBOL}
                          {freeShippingThreshold}
                        </p>
                        <Button asChild className="w-full">
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Delivery Coverage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Coverage
                    </CardTitle>
                    <CardDescription>
                      We deliver to all major cities and towns across India
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      {[
                        "Metro Cities",
                        "Tier 2 Cities",
                        "Tier 3 Cities",
                        "Remote Areas",
                      ].map((area, index) => (
                        <div
                          key={area}
                          className="p-4 border rounded-lg bg-white"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Badge
                              variant="secondary"
                              className="bg-green-500 text-white text-xs"
                            >
                              ✓
                            </Badge>
                          </div>
                          <p className="font-medium text-sm">{area}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shipping Calculator Tab */}
              <TabsContent value="calculator">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <ShippingCalculator />
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          How Shipping Costs Are Calculated
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Order Value</span>
                            <span className="text-sm font-medium">
                              Shipping Cost
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Below {CURRENCY.SYMBOL}
                              {freeShippingThreshold}
                            </span>
                            <span className="text-sm font-medium">
                              {CURRENCY.SYMBOL}50 - {CURRENCY.SYMBOL}200
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              {CURRENCY.SYMBOL}
                              {freeShippingThreshold}+
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              FREE
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Delivery Timeframes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {availableMethods.map((method) => (
                          <div
                            key={method.name}
                            className="flex justify-between items-center py-2"
                          >
                            <span className="text-sm font-medium">
                              {method.description}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {method.deliveryTime}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Shipping Policies Tab */}
              <TabsContent value="policies">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Shipping Policies
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              Processing Time
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              All jewellery orders are processed within 24-48
                              hours. Custom pieces may take 3-5 business days
                              for quality checks.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Insurance & Security
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Every shipment is fully insured. We use discreet
                              packaging to ensure the security of your precious
                              jewellery.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              Signature Required
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              All deliveries require signature confirmation for
                              security purposes.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>International Shipping</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Currently, we only ship within India. International
                          shipping coming soon!
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700"
                        >
                          India Only
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <RotateCcw className="h-5 w-5 text-primary" />
                          Returns & Exchanges
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              30-Day Return Policy
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Easy returns within 30 days of delivery
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              Free Return Shipping
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Free return shipping on all eligible items
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              Quality Guarantee
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Full refund if not satisfied with quality
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-orange-800 mb-2">
                              Holiday Shipping Notice
                            </h4>
                            <p className="text-sm text-orange-700">
                              During festive seasons, delivery times may be
                              extended by 1-2 business days. We recommend
                              ordering early to ensure timely delivery.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Support Tab */}
              <TabsContent value="support">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Need Help with Shipping?</CardTitle>
                      <CardDescription>
                        Our customer support team is here to help you
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-sm">Call Us</h4>
                            <p className="text-sm text-muted-foreground">
                              {CONTACT_INFO.PHONE}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-sm">Email Us</h4>
                            <p className="text-sm text-muted-foreground">
                              {CONTACT_INFO.EMAIL}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-sm">
                              Support Hours
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Mon-Sun: 9 AM - 5 PM IST
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            How long does shipping take?
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Standard shipping takes 3-5 business days, express
                            takes 1-2 days, and overnight shipping delivers the
                            next business day.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            Do you offer free shipping?
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Yes! Free standard shipping on all orders over{" "}
                            {CURRENCY.SYMBOL}
                            {freeShippingThreshold}.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            Can I track my order?
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Yes, you'll receive a tracking number via email and
                            SMS once your order ships.
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/contact">View All FAQs</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
