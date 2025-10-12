/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { CURRENCY } from '@/constants';
import { useCart, cartHelpers } from '@/components/providers/cart-provider';
import { cn } from '@/lib/utils';

// // Mock jewelry products data
const products = [
  {
    id: '1',
    name: 'Bohemian Rose Gold Earrings',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&crop=center',
    rating: 4.9,
    reviews: 156,
    badge: 'Best Seller',
    category: 'Earrings'
  },
  {
    id: '2',
    name: 'Vintage Pearl Necklace',
    price: 2499,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 203,
    badge: 'Popular',
    category: 'Necklaces'
  },
  {
    id: '3',
    name: 'Handcrafted Silver Ring',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 89,
    badge: 'New',
    category: 'Rings'
  },
  {
    id: '4',
    name: 'Gemstone Charm Bracelet',
    price: 1599,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 134,
    badge: 'Sale',
    category: 'Bracelets'
  },
  {
    id: '5',
    name: 'Elegant Diamond Pendant',
    price: 3999,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&crop=center',
    rating: 4.9,
    reviews: 78,
    badge: 'Premium',
    category: 'Pendants'
  },
  {
    id: '6',
    name: 'Boho Style Anklet',
    price: 699,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&crop=center',
    rating: 4.5,
    reviews: 92,
    category: 'Anklets'
  },
];

// export default function ProductsPage() {
//   const { dispatch } = useCart();

//   const handleAddToCart = (product: any) => {
//     const cartItem = {
//       productId: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       quantity: 1,
//     };
    
//     cartHelpers.addItem(dispatch, cartItem);
    
//     // Show success message (you could use a toast here)
//     // alert(`Added ${product.name} to cart!`);

//   };

//   return (
//     <MainLayout>
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold mb-4">Our Collection</h1>
//           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//             Discover our handcrafted jewelry collection - each piece unique, beautiful, and made with love
//           </p>
//         </div>

//         {/* Filter Bar - Coming Soon */}
//         <div className="mb-8 p-4 bg-muted/30 rounded-lg text-center">
//           <p className="text-muted-foreground">
//             🔧 Filter and search functionality coming soon! 
//             Currently showing all products.
//           </p>
//         </div>

//         {/* Products Grid */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <Card key={product.id} className="group product-card border-0 shadow-md overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="relative">
//                   <Image
//                     src={product.image}
//                     alt={product.name}
//                     width={400}
//                     height={400}
//                     className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   {product.badge && (
//                     <Badge className="absolute top-3 left-3">
//                       {product.badge}
//                     </Badge>
//                   )}
//                   <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <Button size="sm" variant="secondary">
//                       Quick View
//                     </Button>
//                   </div>
//                 </div>
                
//                 <div className="p-2 space-y-3">
//                   <div className="space-y-1">
//                     <p className="text-sm text-muted-foreground">{product.category}</p>
//                     <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
//                   </div>
                  
//                   <div className="flex items-center space-x-1 text-sm">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star 
//                           key={i} 
//                           className={`h-4 w-4 ${
//                             i < Math.floor(product.rating) 
//                               ? 'fill-yellow-400 text-yellow-400' 
//                               : 'text-gray-300'
//                           }`} 
//                         />
//                       ))}
//                     </div>
//                     <span className="text-muted-foreground">({product.reviews})</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-1">
//                         <span className="text-xl font-bold">
//                           {CURRENCY.SYMBOL}{product.price.toLocaleString()}
//                         </span>
//                         {product.originalPrice > product.price && (
//                           <span className="text-muted-foreground line-through text-sm">
//                             {CURRENCY.SYMBOL}{product.originalPrice.toLocaleString()}
//                           </span>
//                         )}
//                       </div>
//                       {product.originalPrice > product.price && (
//                         <p className="text-green-600 text-xs font-medium">
//                           Save {CURRENCY.SYMBOL}{product.originalPrice - product.price}
//                         </p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="flex space-x-2">
//                     <Button 
//                       className="flex-1" 
//                       onClick={() => handleAddToCart(product)}
//                     >
//                       <ShoppingCart className="w-4 h-4 mr-2" />
//                       Add to Cart
//                     </Button>
//                     <Button variant="outline" className="flex-1" asChild>
//                       <Link href={`/products/${product.id}`}>
//                         <Eye className="w-4 h-4 mr-2" />
//                         View Details
//                       </Link>
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Load More Button */}
//         <div className="text-center mt-12">
//           <Button variant="outline" size="lg">
//             Load More Products
//           </Button>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

export default function ProductsPage() {
  const { dispatch } = useCart();

  const handleAddToCart = (product: any) => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    cartHelpers.addItem(dispatch, cartItem);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Our Collection
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            Discover our handcrafted jewelry collection - each piece unique,
            beautiful, and made with love
          </p>
        </div>

        {/* Filter Bar - Coming Soon */}
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            🔧 Filter and search functionality coming soon! Currently showing
            all products.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className={cn(
                "group relative border-0 shadow-md overflow-hidden rounded-xl",
                "hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              )}
            >
              <CardContent className="p-0">
                {/* image wrapper → keeps aspect-square on every screen */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 text-[10px] sm:text-xs">
                      {product.badge}
                    </Badge>
                  )}
                  {/* shimmer overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    asChild
                  >
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* details → min-h-0 prevents overflow */}
                <div className="p-2 sm:p-4 space-y-2">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                    {product.name}
                  </h3>

                  {/* stars */}
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3 sm:h-4 sm:w-4",
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* price */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-base sm:text-xl font-bold">
                          {CURRENCY.SYMBOL}
                          {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-muted-foreground line-through text-[10px] sm:text-sm">
                            {CURRENCY.SYMBOL}
                            {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.originalPrice > product.price && (
                        <p className="text-green-600 text-[10px] sm:text-xs font-medium">
                          Save {CURRENCY.SYMBOL}
                          {product.originalPrice - product.price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* actions → never wrap */}
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Add</span>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/products/${product.id}`}>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">View</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More → stays centred */}
        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="default">
            Load More Products
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}