/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Sparkles,
  Heart,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/main-layout";
import { CURRENCY } from "@/constants";
import logo from "../../public/images/logo.png";
import { getProducts } from "./admin/products/actions";
import { getActiveBanners } from "./admin/banners/actions";
// Featured handmade jewelry products
// const featuredProducts = [
//   {
//     id: "1",
//     name: "Bohemian Rose Gold Earrings",
//     price: 1299,
//     originalPrice: 1599,
//     image:
//       "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop&crop=center",
//     rating: 4.9,
//     reviews: 156,
//     badge: "Best Seller",
//   },
//   {
//     id: "2",
//     name: "Vintage Pearl Necklace",
//     price: 2499,
//     originalPrice: 2999,
//     image:
//       "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop&crop=center",
//     rating: 4.8,
//     reviews: 203,
//     badge: "Popular",
//   },
//   {
//     id: "3",
//     name: "Handcrafted Silver Ring",
//     price: 899,
//     originalPrice: 1199,
//     image:
//       "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop&crop=center",
//     rating: 4.7,
//     reviews: 89,
//     badge: "New",
//   },
//   {
//     id: "4",
//     name: "Gemstone Charm Bracelet",
//     price: 1599,
//     originalPrice: 1999,
//     image:
//       "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop&crop=center",
//     rating: 4.6,
//     reviews: 134,
//     badge: "Sale",
//   },
// ];

const features = [
  {
    icon: Heart,
    title: "Handcrafted with Love",
    description: "Every piece is uniquely made by skilled artisans",
  },
  {
    icon: Sparkles,
    title: "Custom Designs",
    description: "Personalized jewelry made just for you",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Premium materials with lifetime craftsmanship guarantee",
  },
];

export default async function Home() {
  const featuredProducts = (await getProducts())?.map((product: any) => ({
    ...product,
    // Ensure the product matches the Product type structure
    id: product._id,
  }));
  // console.log(featuredProducts, "featuredProducts");

  const bannersResult = await getActiveBanners();
  const activeBanners = bannersResult.banners || [];

  return (
    <MainLayout banners={activeBanners}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
            <div className="space-y-6 order-2 lg:order-1 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Handcrafted <span className="text-primary">Jewelry</span> Made
                  with Love
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                  Discover unique, artisan-made jewelry pieces that tell your
                  story. Each piece is carefully handcrafted with premium
                  materials.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 min-touch-target"
                >
                  <Link href="/products">
                    Shop Collection
                    <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                {/* <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 min-touch-target"
                >
                  <Link href="/custom">Custom Orders</Link>
                </Button> */}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-foreground">2k+</span>
                  <span>Happy Customers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-foreground">150+</span>
                  <span>Unique Designs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span>4.9 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative z-10 max-w-md mx-auto lg:max-w-none">
                <Image
                  src={logo}
                  alt="Handcrafted Jewelry Collection"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-xl w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start sm:items-center space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-lg bg-background border"
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Featured Collection
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
              Discover our most loved handcrafted jewelry pieces, each one
              unique and made with exceptional attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts?.map((product: any) => (
              <Card
                key={product.id}
                className="group product-card border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="relative mb-3 sm:mb-4">
                    <Image
                      src={product?.productImages[0].trim()}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 text-xs">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-1 text-xs sm:text-sm">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg sm:text-xl font-bold">
                        {CURRENCY.SYMBOL}
                        {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-muted-foreground line-through text-sm">
                          {CURRENCY.SYMBOL}
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full mt-2 sm:mt-4 text-sm sm:text-base min-touch-target"
                      asChild
                      size="sm"
                    >
                      <Link href={`/products/${product.id}`}>
                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-touch-target"
            >
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 lg:py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Stay Updated
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Subscribe to our newsletter and be the first to know about new
              products, exclusive offers, and special discounts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
              />
              <Button size="lg" className="min-touch-target">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
