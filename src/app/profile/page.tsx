import { MainLayout } from "@/components/layout/main-layout";
import { ProfileForm } from "@/components/profile/profile-form";
import { AddressList } from "@/components/profile/address-list";
import { getUserProfile } from "./actions";
import { redirect } from "next/navigation";

// Force dynamic rendering since this page uses getServerSession() which calls headers()
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const { user, error } = await getUserProfile();

    if (error || !user) {
        redirect("/auth/signin");
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="bg-card rounded-lg border p-6 shadow-sm mb-8">
                        <ProfileForm user={user} />
                    </div>

                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <AddressList addresses={user.addresses || []} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
