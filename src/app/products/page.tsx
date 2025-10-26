/* eslint-disable @typescript-eslint/no-explicit-any */
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ProductClientGrid } from "./product-client-grid";
import { getProducts } from "../admin/products/actions";

export default async function ProductsPage() {
  const products = (await getProducts())?.map((product: any) => ({
    ...product,
    // Ensure the product matches the Product type structure
    id: product._id,
  }));

  const Addproducts = [
    {
      name: "Bohemian Rose Gold Earrings",
      price: 1299,
      originalPrice: 1599,
      productImages: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop&crop=center",
      ],
      rating: 4.9,
      reviews: 156,
      badge: "Best Seller",
      category: "Earrings",
      description:
        "Beautiful handcrafted rose gold plated earrings with bohemian design. Perfect for both casual and formal occasions.",
      features: [
        "Rose gold plated finish",
        "Hypoallergenic materials",
        "Lightweight and comfortable",
        "Handcrafted by skilled artisans",
        "Comes with elegant gift box",
      ],
      specifications: {
        Material: "Rose Gold Plated Brass",
        Size: "2.5cm x 1.5cm",
        Weight: "3.2g per earring",
        Style: "Bohemian",
        Closure: "Hook back",
      },
      inStock: true,
      stockCount: 15,
    },
    {
      name: "Vintage Pearl Necklace",
      price: 2499,
      originalPrice: 2999,
      productImages: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center",
      ],
      rating: 4.8,
      reviews: 203,
      badge: "Popular",
      category: "Necklaces",
      description:
        "Elegant vintage-inspired pearl necklace that adds sophistication to any outfit. Made with genuine freshwater pearls and premium chain.",
      features: [
        "Genuine freshwater pearls",
        "Sterling silver chain",
        "Adjustable length",
        "Vintage-inspired design",
        "Perfect for special occasions",
      ],
      specifications: {
        Material: "Sterling Silver, Freshwater Pearls",
        Length: "18-20 inches (adjustable)",
        "Pearl Size": "6-8mm",
        Style: "Vintage",
        Closure: "Lobster clasp",
      },
      inStock: true,
      stockCount: 8,
    },
    {
      name: "Handcrafted Silver Ring",
      price: 899,
      originalPrice: 1199,
      productImages: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&crop=center",
      ],
      rating: 4.7,
      reviews: 89,
      badge: "New",
      category: "Rings",
      description:
        "Beautifully handcrafted sterling silver ring with intricate patterns. This unique piece showcases traditional craftsmanship with a modern twist.",
      features: [
        "Sterling silver construction",
        "Unique handcrafted pattern",
        "Available in multiple sizes",
        "Tarnish resistant",
        "Lifetime craftsmanship guarantee",
      ],
      specifications: {
        Material: "Sterling Silver (925)",
        Width: "8mm",
        "Available Sizes": "5, 6, 7, 8, 9",
        Style: "Contemporary",
        Finish: "Polished",
      },
      inStock: true,
      stockCount: 12,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Our Collection
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            Discover our handcrafted jewelry collection - each piece unique,
            beautiful, and made with love
          </p>
        </div>

        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            🔧 Filter and search functionality coming soon! Currently showing
            all products.
          </p>
        </div>

        <ProductClientGrid products={products || []} />

        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="default">
            Load More Products
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
