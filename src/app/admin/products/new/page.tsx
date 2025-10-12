/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createProduct } from "../actions";
import type { IProduct } from "@/models/Product";

// Match the IProduct interface structure
const empty: Omit<IProduct, "_id" | "createdAt" | "updatedAt"> = {
  name: "",
  price: 0,
  originalPrice: 0,
  productImages: [],
  rating: 4.5,
  reviews: 0,
  badge: "",
  category: "",
  description: "",
  features: [],
  specifications: {},
  inStock: true,
  stockCount: 0,
};

export default function NewProductPage() {
  const router = useRouter();
  const [data, setData] = useState<typeof empty>(empty);
  const [loading, setLoading] = useState(false);

  /* helpers */
  const addFeature = () => setData({ ...data, features: [...data.features, ""] });
  const removeFeature = (idx: number) =>
    setData({ ...data, features: data.features.filter((_, i) => i !== idx) });
  const updateFeature = (idx: number, val: string) => {
    const copy = [...data.features];
    copy[idx] = val;
    setData({ ...data, features: copy });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createProduct(data);
      toast.success("✅ Product created");
      router.push("/admin/products");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">New Product</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* basic fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Name *</Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Bohemian Rose Gold Earrings"
                />
              </div>
              <div>
                <Label className="mb-1 block">Category *</Label>
                <Input
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
                  placeholder="Earrings"
                />
              </div>
              <div>
                <Label className="mb-1 block">Price (¢) *</Label>
                <Input
                  type="number"
                  value={data.price}
                  onChange={(e) =>
                    setData({ ...data, price: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Original Price (¢)</Label>
                <Input
                  type="number"
                  value={data.originalPrice}
                  onChange={(e) =>
                    setData({ ...data, originalPrice: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Stock Count</Label>
                <Input
                  type="number"
                  value={data.stockCount}
                  onChange={(e) =>
                    setData({ ...data, stockCount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Badge</Label>
                <Input
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="Best Seller"
                />
              </div>
              <div>
                <Label className="mb-1 block">Rating (0-5)</Label>
                <Input
                  type="number"
                  step={0.1}
                  min={0}
                  max={5}
                  value={data.rating}
                  onChange={(e) =>
                    setData({ ...data, rating: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-1 block">Reviews Count</Label>
                <Input
                  type="number"
                  value={data.reviews}
                  onChange={(e) =>
                    setData({ ...data, reviews: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* description */}
            <div className="mb-4">
              <Label className="mb-1 block">Description *</Label>
              <Textarea
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                rows={4}
                placeholder="Hand-crafted rose gold earrings..."
              />
            </div>

            {/* images → same pattern as features */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Images (URLs)</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData({ ...data, productImages: [...data.productImages, ""] })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Add URL
                </Button>
              </div>
              <div className="space-y-3">
                {data.productImages.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => {
                        const copy = [...data.productImages];
                        copy[idx] = e.target.value;
                        setData({ ...data, productImages: copy });
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const copy = data.productImages.filter((_, i) => i !== idx);
                        setData({ ...data, productImages: copy });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* features */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Features</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData({ ...data, features: [...data.features, ""] })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {data.features.map((f, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Feature"
                      value={f}
                      onChange={(e) => {
                        const copy = [...data.features];
                        copy[idx] = e.target.value;
                        setData({ ...data, features: copy });
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const copy = data.features.filter((_, i) => i !== idx);
                        setData({ ...data, features: copy });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* specifications */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Specifications</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const key = prompt("Specification name (e.g. Material)");
                    if (!key) return;
                    const val = prompt("Value");
                    if (!val) return;
                    setData({
                      ...data,
                      specifications: { ...data.specifications, [key]: val },
                    });
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {Object.entries(data?.specifications || {}).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <Badge variant="secondary">{k}</Badge>
                    <span className="text-sm">{v}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const copy = { ...data.specifications };
                        delete copy[k];
                        setData({ ...data, specifications: copy });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* stock */}
            <div className="mb-4 flex items-center gap-2">
              <Switch
                checked={data.inStock}
                onCheckedChange={(c) => setData({ ...data, inStock: c })}
              />
              <Label>In Stock</Label>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setData(empty)}>
                Reset
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
