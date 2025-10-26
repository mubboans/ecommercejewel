"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Lock,
  Shield,
  Truck,
  CreditCard,
  Building,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";
import { CURRENCY } from "@/constants";
import { useCart, cartHelpers } from "@/components/providers/cart-provider";
import { toast } from "sonner";

interface CheckoutFormData {
  // Contact Information
  email: string;
  phone: string;

  // Shipping Address
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Shipping Method
  shippingMethod: "standard" | "express" | "overnight";

  // Payment
  paymentMethod: "card" | "paypal" | "applepay";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;

  // Additional
  notes?: string;
  subscribeNewsletter: boolean;
  agreeToTerms: boolean;
}

const initialFormData: CheckoutFormData = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  shippingMethod: "standard",
  paymentMethod: "card",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  nameOnCard: "",
  notes: "",
  subscribeNewsletter: true,
  agreeToTerms: false,
};

export function Checkout() {
  const router = useRouter();
  const { state: cartState, dispatch } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<
    "contact" | "shipping" | "payment" | "review"
  >("contact");

  // Calculate order totals
  const tax = cartState.total * 0.18;
  const shippingCosts = {
    standard: 50,
    express: 100,
    overnight: 200,
  };
  const shipping = shippingCosts[formData.shippingMethod];
  const finalTotal = cartState.total + tax + shipping;

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (activeStep === "contact") setActiveStep("shipping");
    else if (activeStep === "shipping") setActiveStep("payment");
    else if (activeStep === "payment") setActiveStep("review");
  };

  const handlePreviousStep = () => {
    if (activeStep === "shipping") setActiveStep("contact");
    else if (activeStep === "payment") setActiveStep("shipping");
    else if (activeStep === "review") setActiveStep("payment");
  };

  const handleSubmitOrder = async () => {
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data
      const orderData = {
        userId: "current-user-id", // You'll need to get this from your auth system
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        items: cartState.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: cartState.total,
        tax: tax,
        shipping: shipping,
        shippingMethod: formData.shippingMethod,
        total: finalTotal,
        paymentMethod:
          formData.paymentMethod === "card"
            ? "razorpay"
            : formData.paymentMethod === "paypal"
              ? "stripe"
              : "razorpay",
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        notes: formData.notes,
        deviceInfo: {
          userAgent: navigator.userAgent,
          // You might want to get IP from your backend
        },
      };

      // Call API to create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      // Clear cart
      cartHelpers.clearCart(dispatch);

      toast.success("Order placed successfully!");

      // Redirect to order confirmation
      router.push(`/order-confirmation?orderId=${order.orderNumber}`);
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const steps = ["contact", "shipping", "payment", "review"] as const;
  const currentStepIndex = steps.indexOf(activeStep);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your purchase securely
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form - Takes 2/3 on desktop */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Steps */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {steps.map((step, index) => (
                        <div key={step} className="flex items-center flex-1">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 z-10 relative ${
                              activeStep === step
                                ? "border-primary bg-primary text-primary-foreground"
                                : index < currentStepIndex
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-gray-300 bg-white text-gray-500"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {index < currentStepIndex ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </span>
                          </div>
                          {index < 3 && (
                            <div
                              className={`flex-1 h-1 mx-2 -ml-1 ${
                                index < currentStepIndex
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                      <span className="text-center flex-1">Contact</span>
                      <span className="text-center flex-1">Shipping</span>
                      <span className="text-center flex-1">Payment</span>
                      <span className="text-center flex-1">Review</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                {activeStep === "contact" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 12345 67890"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Shipping Address */}
                {activeStep === "shipping" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          placeholder="Street address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="apartment">
                          Apartment, Suite, etc. (Optional)
                        </Label>
                        <Input
                          id="apartment"
                          placeholder="Apartment, suite, unit, etc."
                          value={formData.apartment}
                          onChange={(e) =>
                            handleInputChange("apartment", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) =>
                              handleInputChange("state", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) =>
                              handleInputChange("zipCode", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) =>
                              handleInputChange("country", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <Label className="text-base font-medium">
                          Shipping Method
                        </Label>
                        <RadioGroup
                          value={formData.shippingMethod}
                          onValueChange={(
                            value: "standard" | "express" | "overnight"
                          ) => handleInputChange("shippingMethod", value)}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label
                              htmlFor="standard"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
                                    Standard Shipping
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    3-5 business days
                                  </p>
                                </div>
                                <span className="font-semibold">
                                  {CURRENCY.SYMBOL}50
                                </span>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                            <RadioGroupItem value="express" id="express" />
                            <Label
                              htmlFor="express"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
                                    Express Shipping
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    1-2 business days
                                  </p>
                                </div>
                                <span className="font-semibold">
                                  {CURRENCY.SYMBOL}100
                                </span>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                            <RadioGroupItem value="overnight" id="overnight" />
                            <Label
                              htmlFor="overnight"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
                                    Overnight Shipping
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Next business day
                                  </p>
                                </div>
                                <span className="font-semibold">
                                  {CURRENCY.SYMBOL}200
                                </span>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Information */}
                {activeStep === "payment" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(
                          value: "card" | "paypal" | "applepay"
                        ) => handleInputChange("paymentMethod", value)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                          <RadioGroupItem value="card" id="card" />
                          <Label
                            htmlFor="card"
                            className="flex-1 cursor-pointer font-medium"
                          >
                            Credit/Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label
                            htmlFor="paypal"
                            className="flex-1 cursor-pointer font-medium"
                          >
                            PayPal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                          <RadioGroupItem value="applepay" id="applepay" />
                          <Label
                            htmlFor="applepay"
                            className="flex-1 cursor-pointer font-medium"
                          >
                            Apple Pay
                          </Label>
                        </div>
                      </RadioGroup>

                      {formData.paymentMethod === "card" && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="grid gap-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={(e) =>
                                handleInputChange("cardNumber", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) =>
                                  handleInputChange(
                                    "expiryDate",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) =>
                                  handleInputChange("cvv", e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="nameOnCard">Name on Card *</Label>
                            <Input
                              id="nameOnCard"
                              placeholder="John Doe"
                              value={formData.nameOnCard}
                              onChange={(e) =>
                                handleInputChange("nameOnCard", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="subscribeNewsletter"
                            checked={formData.subscribeNewsletter}
                            onChange={(e) =>
                              handleInputChange(
                                "subscribeNewsletter",
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="subscribeNewsletter"
                            className="text-sm cursor-pointer"
                          >
                            Subscribe to our newsletter for updates and
                            exclusive offers
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Review */}
                {activeStep === "review" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Review</CardTitle>
                      <CardDescription>
                        Please review your order before placing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">
                          Contact Information
                        </h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-medium">{formData.email}</p>
                          <p className="text-muted-foreground">
                            {formData.phone}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">
                          Shipping Address
                        </h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </p>
                          <p className="text-muted-foreground">
                            {formData.address}
                            <br />
                            {formData.apartment &&
                              `${formData.apartment}<br />`}
                            {formData.city}, {formData.state} {formData.zipCode}
                            <br />
                            {formData.country}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">
                          Shipping Method
                        </h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="capitalize font-medium">
                            {formData.shippingMethod} Shipping
                          </p>
                          <p className="text-muted-foreground">
                            {formData.shippingMethod === "standard" &&
                              "3-5 business days"}
                            {formData.shippingMethod === "express" &&
                              "1-2 business days"}
                            {formData.shippingMethod === "overnight" &&
                              "Next business day"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">
                          Payment Method
                        </h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="capitalize font-medium">
                            {formData.paymentMethod === "card"
                              ? "Credit/Debit Card"
                              : formData.paymentMethod === "paypal"
                                ? "PayPal"
                                : "Apple Pay"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={(e) =>
                              handleInputChange(
                                "agreeToTerms",
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                            required
                          />
                          <Label
                            htmlFor="agreeToTerms"
                            className="text-sm cursor-pointer"
                          >
                            I agree to the{" "}
                            <a
                              href="/terms"
                              className="text-primary hover:underline"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              className="text-primary hover:underline"
                            >
                              Privacy Policy
                            </a>
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {activeStep !== "contact" && (
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1 sm:flex-none sm:w-32"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  {activeStep !== "review" ? (
                    <Button onClick={handleNextStep} className="flex-1">
                      Continue to{" "}
                      {activeStep === "contact"
                        ? "Shipping"
                        : activeStep === "shipping"
                          ? "Payment"
                          : "Review"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isProcessing || !formData.agreeToTerms}
                      className="flex-1"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Place Order - {CURRENCY.SYMBOL}
                          {finalTotal.toLocaleString()}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary - Takes 1/3 on desktop */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <Card className="sticky top-24">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Cart Items */}
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {cartState.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center gap-3"
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                              <Badge
                                variant="secondary"
                                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                              >
                                {item.quantity}
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-muted-foreground text-xs mt-1">
                                {CURRENCY.SYMBOL}
                                {item.price.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {CURRENCY.SYMBOL}
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Order Totals */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>
                            Subtotal ({cartState.itemCount}{" "}
                            {cartState.itemCount === 1 ? "item" : "items"})
                          </span>
                          <span>
                            {CURRENCY.SYMBOL}
                            {cartState.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>
                            {shipping === 0 ? (
                              <span className="text-green-600 font-medium">
                                Free
                              </span>
                            ) : (
                              `${CURRENCY.SYMBOL}${shipping}`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax (GST 18%)</span>
                          <span>
                            {CURRENCY.SYMBOL}
                            {tax.toLocaleString()}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>
                            {CURRENCY.SYMBOL}
                            {finalTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Security Badges */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>Secure Checkout</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-green-600" />
                            <span>SSL Encrypted</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Indicators */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                        <div>
                          <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <p className="font-medium">Free Shipping</p>
                          <p>Over {CURRENCY.SYMBOL}500</p>
                        </div>
                        <div>
                          <Building className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="font-medium">30-Day</p>
                          <p>Returns</p>
                        </div>
                        <div>
                          <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <p className="font-medium">Secure</p>
                          <p>Payment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
