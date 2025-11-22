/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { CURRENCY } from "@/constants";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  isProcessing: boolean;
  isStockValidated?: boolean;
}

interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: "standard" | "express" | "overnight";
  paymentMethod: "razorpay";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  notes?: string;
  subscribeNewsletter: boolean;
  agreeToTerms: boolean;
}

export function CheckoutForm({
  onSubmit,
  isProcessing,
  isStockValidated = true,
}: CheckoutFormProps) {

  const isFormDisabled = isProcessing || !isStockValidated;
  const [activeStep, setActiveStep] = useState<"contact" | "shipping">("contact");
  const [formData, setFormData] = useState<FormData>({
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
    paymentMethod: "razorpay", // Default to Razorpay
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    notes: "",
    subscribeNewsletter: true,
    agreeToTerms: true, // Auto-agree since we are skipping review
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: "contact" | "shipping") => {
    if (step === "contact") {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
      if (!formData.phone || formData.phone.length < 10) {
        toast.error("Please enter a valid phone number");
        return false;
      }
      return true;
    }

    if (step === "shipping") {
      const requiredFields: (keyof FormData)[] = [
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zipCode",
        "country",
      ];

      for (const field of requiredFields) {
        if (!formData[field]) {
          toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (activeStep === "contact") {
      if (validateStep("contact")) {
        setActiveStep("shipping");
      }
    }
  };

  const handlePreviousStep = () => {
    if (activeStep === "shipping") setActiveStep("contact");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep("contact") && validateStep("shipping")) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isFormDisabled}
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
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
                onChange={(e) => handleInputChange("address", e.target.value)}
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
                onChange={(e) => handleInputChange("apartment", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
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
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <Label className="text-base font-medium">Shipping Method</Label>
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(value: "standard" | "express" | "overnight") =>
                  handleInputChange("shippingMethod", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-muted-foreground">
                          3-5 business days
                        </p>
                      </div>
                      <span className="font-semibold">{CURRENCY.SYMBOL}50</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Express Shipping</p>
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
                  <Label htmlFor="overnight" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Overnight Shipping</p>
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

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        {activeStep !== "contact" && (
          <button
            type="button"
            onClick={handlePreviousStep}
            className="flex-1 sm:flex-none sm:w-32 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        {activeStep !== "shipping" ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            Continue to Shipping
          </button>
        ) : (
          <button
            type="submit"
            disabled={isProcessing || !formData.agreeToTerms}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isStockValidated
              ? "Validating Items..."
              : isProcessing
                ? "Processing Payment..."
                : "Proceed to Pay"}
          </button>
        )}
      </div>
    </form>
  );
}
