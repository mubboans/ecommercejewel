'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CURRENCY } from '@/constants';
import { useCart, cartHelpers } from '@/components/providers/cart-provider';

// Mock product data (in real app, this would come from API)
const products = {
  '1': {
    id: '1',
    name: 'Bohemian Rose Gold Earrings',
    price: 1299,
    originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop&crop=center',
    ],
    rating: 4.9,
    reviews: 156,
    badge: 'Best Seller',
    category: 'Earrings',
    description: 'Beautiful handcrafted rose gold plated earrings with bohemian design. These elegant earrings feature intricate detailing and are perfect for both casual and formal occasions.',
    features: [
      'Rose gold plated finish',
      'Hypoallergenic materials',
      'Lightweight and comfortable',
      'Handcrafted by skilled artisans',
      'Comes with elegant gift box'
    ],
    specifications: {
      'Material': 'Rose Gold Plated Brass',
      'Size': '2.5cm x 1.5cm',
      'Weight': '3.2g per earring',
      'Style': 'Bohemian',
      'Closure': 'Hook back',
    },
    inStock: true,
    stockCount: 15
  },
  '2': {
    id: '2',
    name: 'Vintage Pearl Necklace',
    price: 2499,
    originalPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center',
    ],
    rating: 4.8,
    reviews: 203,
    badge: 'Popular',
    category: 'Necklaces',
    description: 'Elegant vintage-inspired pearl necklace that adds sophistication to any outfit. Made with genuine freshwater pearls and premium chain.',
    features: [
      'Genuine freshwater pearls',
      'Sterling silver chain',
      'Adjustable length',
      'Vintage-inspired design',
      'Perfect for special occasions'
    ],
    specifications: {
      'Material': 'Sterling Silver, Freshwater Pearls',
      'Length': '18-20 inches (adjustable)',
      'Pearl Size': '6-8mm',
      'Style': 'Vintage',
      'Closure': 'Lobster clasp',
    },
    inStock: true,
    stockCount: 8
  },
  '3': {
    id: '3',
    name: 'Handcrafted Silver Ring',
    price: 899,
    originalPrice: 1199,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&crop=center',
    ],
    rating: 4.7,
    reviews: 89,
    badge: 'New',
    category: 'Rings',
    description: 'Beautifully handcrafted sterling silver ring with intricate patterns. This unique piece showcases traditional craftsmanship with a modern twist.',
    features: [
      'Sterling silver construction',
      'Unique handcrafted pattern',
      'Available in multiple sizes',
      'Tarnish resistant',
      'Lifetime craftsmanship guarantee'
    ],
    specifications: {
      'Material': 'Sterling Silver (925)',
      'Width': '8mm',
      'Available Sizes': '5, 6, 7, 8, 9',
      'Style': 'Contemporary',
      'Finish': 'Polished',
    },
    inStock: true,
    stockCount: 12
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = products[productId as keyof typeof products];
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  
  const { dispatch } = useCart();

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
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

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    };
    
    cartHelpers.addItem(dispatch, cartItem);
    
    // Show success message (you could use a toast here)
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-foreground">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4">
                  {product.badge}
                </Badge>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold">
                  {CURRENCY.SYMBOL}{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {CURRENCY.SYMBOL}{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive">
                      Save {CURRENCY.SYMBOL}{product.originalPrice - product.price}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Size Selection (for rings) */}
            {/* {product.category === 'Rings' && product?.specifications['Available Sizes'] && (
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex space-x-2">
                  {product?.specifications?['Available Sizes']?.split(', ')?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedSize === size 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stockCount}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  ({product.stockCount} in stock)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock || (product.category === 'Rings' && !selectedSize)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - {CURRENCY.SYMBOL}{(product.price * quantity).toLocaleString()}
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ In stock and ready to ship
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                      <span className="font-medium text-sm">{key}</span>
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}