import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ProductDetailClient } from "./product-detail-client";
import { getProducts } from "@/app/admin/products/actions";
import { IProduct } from "@/models/Product";

interface ProductSpecifications {
  [key: string]: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  productImages: string[];
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  description: string;
  features: string[];
  specifications: ProductSpecifications;
  inStock: boolean;
  stockCount: number;
}

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = await getProducts(params.id) as IProduct | null;

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return <ProductDetailClient product={product} />;
}
