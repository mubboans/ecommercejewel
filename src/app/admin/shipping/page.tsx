import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { ShippingSettings } from "@/components/admin/shipping-settings";
import { MainLayout } from "@/components/layout/main-layout";
import { authOptions } from "@/lib/auth/auth.config";

export const dynamic = "force-dynamic";

export default async function ShippingSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Shipping Settings</h1>
          <p className="text-muted-foreground">
            Configure shipping methods, free shipping threshold, and tax rates
          </p>
        </div>
        <ShippingSettings />
      </div>
    </MainLayout>
  );
}
