import { Metadata } from "next";
import { ShippingPageContent } from "./shipping-content";

export const metadata: Metadata = {
  title: "Shipping Information | Your Jewellery Store",
  description:
    "Learn about our shipping options, delivery times, and policies for jewellery orders. Free shipping available on orders over ₹500.",
  keywords:
    "jewellery shipping, delivery, free shipping, jewellery delivery India",
};

export default function ShippingPage() {
  return <ShippingPageContent />;
}
