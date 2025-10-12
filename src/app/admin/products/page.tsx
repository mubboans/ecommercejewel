
import { revalidatePath } from "next/cache";
import { deleteProduct, getProducts, updateProduct } from "./actions";
import { ProductTable } from "./product-table";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PromoBanner } from "@/components/headers/promo-banner";
import { MarqueeBanner } from "@/components/headers/marquee-banner";
import { Footer } from "@/components/layout/footer";

export default async function ProductsServerPage() {
  // Fetch products on server
  const products = await getProducts() as unknown as IProduct[];
  
  // Server action for delete
  async function handleDelete(productId: string) {
    "use server";
    await deleteProduct(productId);
    revalidatePath("/admin/products");
  }
  async function handleEdit(product: IProduct) {
    "use server";
    revalidatePath("/admin/products");
    try {
        await updateProduct(product?._id,product);
    } catch (error) {
        console.log(error, 'error');
        
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PromoBanner />
      <MarqueeBanner />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
        <ProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <Footer />
    </div>
  );
}
