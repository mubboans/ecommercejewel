import { Metadata } from "next";
import { CancelRefundContent } from "./cancel-refund-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

// Force dynamic rendering since this page uses getServerSession() which calls headers()
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cancel & Refund Request | Your Jewellery Store",
  description:
    "Request cancellation or refund for your jewellery order. Easy process with quick resolution.",
  keywords: "jewellery refund, cancel order, return jewellery, refund request",
};

export default async function CancelRefundPage() {
  const session = await getServerSession(authOptions);

  return <CancelRefundContent session={session} />;
}
