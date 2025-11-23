/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { Mail, MapPin, CreditCard, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { CURRENCY } from "@/constants";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  isProcessing: boolean;
  isStockValidated?: boolean;
  savedAddresses?: any[];
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
  savedAddresses = [],
}: CheckoutFormProps) {

  const isFormDisabled = isProcessing || !isStockValidated;
  const [activeStep, setActiveStep] = useState<"contact" | "shipping">("contact");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
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
    paymentMethod: "razorpay",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    notes: "",
    subscribeNewsletter: true,
    agreeToTerms: true,
  });

  // Auto-select default address on mount
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setFormData(prev => ({
          ...prev,
          address: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
        }));
      }
    }
  }, [savedAddresses]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === "new") {
      setFormData(prev => ({
        ...prev,
        address: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      }));
    } else {
      const address = savedAddresses.find(a => a._id === addressId);
      if (address) {
        setFormData(prev => ({
          ...prev,
          address: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        }));
      }
    }
  };

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
            <CardDescription>
              {savedAddresses.length > 0
                ? "Select a saved address or add a new one"
                : "Enter your shipping details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {savedAddresses.length > 0 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Saved Addresses</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === addr._id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      onClick={() => handleAddressSelect(addr._id)}
                    >
                      {selectedAddressId === addr._id && (
                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{addr.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{addr.country}</p>
                        {addr.isDefault && (
                          <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${selectedAddressId === "new"
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-gray-400"
                      }`}
                    onClick={() => handleAddressSelect("new")}
                  >
                    <Plus className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="font-medium text-sm">Add New Address</p>
                  </div>
                </div>
                {selectedAddressId !== "new" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      Order will be delivered to the selected address
                    </p>
                  </div>
                )}
                <Separator />
              </div>
            )}

            {/* Show form fields only when "new" is selected or no saved addresses */}
            {(selectedAddressId === "new" || savedAddresses.length === 0) && (
              <>
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

                <Separator />
              </>
            )}

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
