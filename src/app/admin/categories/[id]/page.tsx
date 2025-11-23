import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { getCategoryById } from "../actions";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/admin/category-form";

export default async function CategoryEditPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    const isNew = params.id === "new";
    let category = null;

    if (!isNew) {
        const result = await getCategoryById(params.id);
        if (result.error) {
            redirect("/admin/categories");
        }
        category = result.category;
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/categories">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isNew ? "Create Category" : "Edit Category"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isNew
                            ? "Create a new product category"
                            : "Update category details"}
                    </p>
                </div>
            </div>

            <CategoryForm category={category} />
        </div>
    );
}
