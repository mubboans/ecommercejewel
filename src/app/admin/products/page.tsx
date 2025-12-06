'use client';

export const dynamic = 'force-dynamic';

// import { revalidatePath } from "next/cache";
import { deleteProduct, updateProduct } from "./actions";
import { ProductTable } from "./product-table";
import { IProduct } from "@/models/Product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PromoBanner } from "@/components/headers/promo-banner";
import { MarqueeBanner } from "@/components/headers/marquee-banner";
import { Footer } from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import { DynamicBanner } from "@/components/headers/dynamic-banner";
import { MainLayout } from "@/components/layout/main-layout";

// const products = (await getProducts()) as unknown as IProduct[];
export default function ProductsServerPage() {
  // Fetch products on server

  const router = useRouter();
  const handleAddProduct = () => {
    router.push("/admin/products/new");
  };
  // Server action for delete
  async function handleDelete(productId: string) {
    await deleteProduct(productId);
    // revalidatePath("/admin/products");
  }
  async function handleEdit(product: IProduct) {
    // revalidatePath("/admin/products");
    try {
      await updateProduct(product?._id, product);
    } catch (error) {
      console.log(error, "error");
    }
  }
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
            <Button asChild className="min-touch-target w-full sm:w-auto">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Link>
            </Button>
          </div>
          <div className="w-full overflow-hidden">
            {/* <ProductTable
            products={products}
            // onDelete={handleDelete}
            // onEdit={handleEdit}
          /> */}
            <ProductTable onAddProduct={handleAddProduct} />
          </div>
        </div>
      </MainLayout>
    </div>
  );
}


export const products_data = [
  {
    name: "Bohemian Rose Gold Earrings",
    price: 1299,
    originalPrice: 1599,
    productImages: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&crop=center",
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
      "Lightweight comfort",
      "Handcrafted detailing",
      "Comes with gift box",
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
      "Elegant vintage-inspired pearl necklace with genuine freshwater pearls and a sterling silver chain.",
    features: [
      "Genuine freshwater pearls",
      "Sterling silver chain",
      "Adjustable length",
      "Timeless design",
      "Perfect gift idea",
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
      "Beautifully handcrafted sterling silver ring with intricate traditional pattern and polished finish.",
    features: [
      "Sterling silver build",
      "Polished texture",
      "Durable and elegant",
      "Comfortable fit",
      "Comes with ring box",
    ],
    specifications: {
      Material: "Sterling Silver (925)",
      Width: "8mm",
      Sizes: "5-9",
      Style: "Contemporary",
      Finish: "Polished",
    },
    inStock: true,
    stockCount: 12,
  },
  {
    name: "Gemstone Charm Bracelet",
    price: 1599,
    originalPrice: 1999,
    productImages: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&crop=center",
    ],
    rating: 4.6,
    reviews: 134,
    badge: "Sale",
    category: "Bracelets",
    description:
      "Charm bracelet featuring multiple gemstones, each representing unique energies and meanings.",
    features: [
      "Colorful gemstone charms",
      "Adjustable length",
      "Hypoallergenic metal",
      "Symbolic design",
      "Perfect gift option",
    ],
    specifications: {
      Material: "Sterling Silver, Gemstones",
      Length: "7-8 inches (adjustable)",
      Gemstones: "Amethyst, Rose Quartz, Lapis Lazuli",
      Style: "Charm Bracelet",
      Closure: "Toggle clasp",
    },
    inStock: true,
    stockCount: 10,
  },
  {
    name: "Elegant Diamond Pendant",
    price: 3999,
    originalPrice: 4999,
    productImages: [
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761474921/ecd3458d-0500-42ce-a002-0592d8f8a44a.png",
    ],
    rating: 4.9,
    reviews: 78,
    badge: "Premium",
    category: "Pendants",
    description:
      "Exquisite diamond pendant crafted in white gold, perfect for elegant evenings and celebrations.",
    features: [
      "Brilliant cut diamonds",
      "White gold chain",
      "Adjustable chain length",
      "Certified diamonds",
      "Luxury box included",
    ],
    specifications: {
      Material: "White Gold, Diamonds",
      "Chain Length": "18 inches (extendable)",
      Carat: "0.5ct total",
      Style: "Elegant",
      Closure: "Spring clasp",
    },
    inStock: true,
    stockCount: 5,
  },
  {
    name: "Boho Style Anklet",
    price: 699,
    originalPrice: 899,
    productImages: [
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761474523/14ff743b-8406-4a1c-b87f-b38a16e6c596.png",
    ],
    rating: 4.5,
    reviews: 92,
    category: "Anklets",
    description:
      "Bohemian-style anklet with delicate beads and charms. Perfect accessory for summer outfits.",
    features: [
      "Adjustable fit",
      "Lightweight design",
      "Beachwear essential",
      "Comfortable daily wear",
      "Elegant detailing",
    ],
    specifications: {
      Material: "Sterling Silver, Beads",
      Length: "9-10 inches (adjustable)",
      Style: "Boho",
      Closure: "Lobster clasp",
    },
    inStock: true,
    stockCount: 20,
  },
  {
    name: "Minimal Gold Chain",
    price: 1899,
    originalPrice: 2299,
    productImages: [
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761474573/df002c75-3a75-45e8-b28c-48207e410ef7.png",
    ],
    rating: 4.8,
    reviews: 65,
    badge: "Featured",
    category: "Chains",
    description:
      "Simple yet stunning 18K gold-plated chain that complements any outfit, perfect for daily wear.",
    features: [
      "18K gold plating",
      "Minimalist design",
      "Unisex style",
      "Tarnish-resistant",
      "Everyday elegance",
    ],
    specifications: {
      Material: "18K Gold Plated Brass",
      Length: "20 inches",
      Weight: "10g",
      Finish: "Polished",
      Style: "Minimal",
    },
    inStock: true,
    stockCount: 25,
  },
  {
    name: "Crystal Drop Earrings",
    price: 1499,
    originalPrice: 1799,
    productImages: [
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761474590/51184bbc-376a-45a5-ae5a-8d1cd241d524.png",
    ],
    rating: 4.7,
    reviews: 101,
    badge: "Trending",
    category: "Earrings",
    description:
      "Elegant drop earrings with crystal embellishments, perfect for weddings and parties.",
    features: [
      "Sparkling crystals",
      "Nickel-free alloy",
      "Comfortable wear",
      "Shimmering finish",
      "Perfect for events",
    ],
    specifications: {
      Material: "Silver Alloy, Crystals",
      Length: "2 inches",
      Weight: "4g per pair",
      Style: "Drop",
      Closure: "Push back",
    },
    inStock: true,
    stockCount: 14,
  },
  {
    name: "Turquoise Beaded Bracelet",
    price: 999,
    originalPrice: 1299,
    productImages: [
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761474612/8da29e11-ca4b-47f2-944e-fc2227e00082.png",
    ],
    rating: 4.6,
    reviews: 112,
    category: "Bracelets",
    description:
      "Natural turquoise beaded bracelet symbolizing calmness and balance. Stretch fit for comfort.",
    features: [
      "Natural turquoise stones",
      "Elastic band",
      "One size fits all",
      "Handmade design",
      "Spiritual meaning",
    ],
    specifications: {
      Material: "Turquoise, Elastic Cord",
      Diameter: "7 inches",
      Style: "Beaded",
      Origin: "Handcrafted",
    },
    inStock: true,
    stockCount: 18,
  },
  {
    name: "Emerald Statement Ring",
    price: 2999,
    originalPrice: 3599,
    productImages: [
      "https://res.cloudinary.com/dzn6szt5l/image/upload/v1761474441/alex-azabache-y2ErhoE92KA-unsplash_nxgieh.jpg",
    ],
    rating: 4.9,
    reviews: 72,
    badge: "Luxury",
    category: "Rings",
    description:
      "Luxurious emerald ring set in sterling silver with an elegant statement design.",
    features: [
      "Genuine emerald gemstone",
      "Sterling silver band",
      "Eye-catching centerpiece",
      "Elegant and durable",
      "Gift-ready packaging",
    ],
    specifications: {
      Material: "Sterling Silver, Emerald",
      Size: "Adjustable",
      Stone: "Emerald (Natural)",
      Finish: "High polish",
      Style: "Statement",
    },
    inStock: true,
    stockCount: 9,
  },
];
