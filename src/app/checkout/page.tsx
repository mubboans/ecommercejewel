import { Metadata } from "next";
import { CheckoutContent } from "./checkout-content";


export const metadata: Metadata = {
  title: "Checkout | Your Jewellery Store",
  description:
    "Complete your jewellery purchase securely with multiple payment options.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
