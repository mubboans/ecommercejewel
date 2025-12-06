import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { getBannerById } from "../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BannerForm } from "@/components/admin/banner-form";

// Force dynamic rendering since this page uses getServerSession() which calls headers()
export const dynamic = "force-dynamic";

export default async function BannerEditPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    const isNew = params.id === "new";
    let banner = null;

    if (!isNew) {
        const result = await getBannerById(params.id);
        if (result.error) {
            redirect("/admin/banners");
        }
        banner = result.banner;
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/banners">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isNew ? "Create Banner" : "Edit Banner"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isNew
                            ? "Create a new promotional banner"
                            : "Update banner details"}
                    </p>
                </div>
            </div>

            <BannerForm banner={banner} />
        </div>
    );
}
