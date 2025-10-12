/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ---------- empty product skeleton ---------- */
const emptyProduct: Product = {
  name: "",
//   originalPrice: 0,
  images: [] as string[],
  rating: 4.5,
  badge: "",
  category: "",
  description: "",
  features: [] as string[],
  specifications: {} as Record<string, string>,
  inStock: true,
};

interface Product {
  name?: string;
  price?: number | null;
  originalPrice?: number;
  images?: string[];
  rating?: number | null;
  reviews?: number | null;
  badge?: string;
  category?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  inStock?: boolean;
  stockCount?: number | null;
}

export default function AdminProductsPage({product}: any) {
  const router = useRouter();
  const [data, setData] = useState<typeof emptyProduct>(emptyProduct);
  const [loading, setLoading] = useState(false);

  /* ---------- helpers ---------- */
  const setImages = (urls: string[]) =>
    setData((d) => ({ ...d, images: urls }));
  const addFeature = () =>
    setData((d) => ({ ...d, features: [...d.features || [], ""] }));
  const updateFeature = (idx: number, val: string) =>
    setData((d) => ({
      ...d,
      features: d.features?.map((f, i) => (i === idx ? val : f)) || [],
    }));
  const removeFeature = (idx: number) =>
    setData((d) => ({
      ...d,
      features: d.features?.filter((_, i) => i !== idx) || [],
    }));

  const addSpec = () => {
    const key = prompt("Specification name (e.g. Material)");
    if (!key) return;
    const val = prompt("Value");
    if (!val) return;
    setData((d) => ({
      ...d,
      specifications: { ...d.specifications, [key]: val },
    }));
  };
  const removeSpec = (key: string) =>
    setData((d) => {
      const copy = { ...d.specifications };
      delete copy[key];
      return { ...d, specifications: copy };
    });

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("✅ Product created!");
      router.refresh(); // optional: revalidate any server pages
      setData(emptyProduct);
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
          <h1 className="text-2xl font-bold">Admin – Add Product</h1>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Shop
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
                <Label className="mb-2">Name *</Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Bohemian Rose Gold Earrings"
                />
              </div>
              <div>
                <Label className="mb-2">Category *</Label>
                <Input
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
                  placeholder="Earrings"
                />
              </div>
              <div>
                <Label className="mb-2">Price (¢) *</Label>
                <Input
                  type="number"
                  value={data.price || ""}
                  placeholder="Enter price"
                  onChange={(e) =>
                    setData({ ...data, price: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Original Price (¢)</Label>
                <Input
                  type="number"
                  value={data.originalPrice}
                  onChange={(e) =>
                    setData({ ...data, originalPrice: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Stock Count</Label>
                <Input
                  type="number"
                  value={data.stockCount || ""}
                  onChange={(e) =>
                    setData({ ...data, stockCount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Badge</Label>
                <Input
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="Best Seller"
                />
              </div>
              <div>
                <Label className="mb-2">Rating (0-5)</Label>
                <Input
                  type="number"
                  step={0.1}
                  min={0}
                  max={5}
                  value={data.rating || ""}
                  onChange={(e) =>
                    setData({ ...data, rating: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Reviews Count</Label>
                <Input
                  type="number"
                  value={data.reviews || ""}
                  onChange={(e) =>
                    setData({ ...data, reviews: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* description */}
            <div>
              <Label className="mb-2">Description *</Label>
              <Textarea
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                rows={4}
                placeholder="Hand-crafted rose gold earrings..."
              />
            </div>

            {/* images */}
            {/* images → same UX as features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Images (URLs)</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData({ ...data, images: [...(data.images || []), ""] })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Add URL
                </Button>
              </div>

              <div className="space-y-3">
                {data?.images?.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => {
                        const copy = [...(data.images || [])];
                        copy[idx] = e.target.value;
                        setData({ ...data, images: copy });
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const copy = [...data.images || []].filter((_, i) => i !== idx);
                        setData({ ...data, images: copy });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="mb-2">Features</Label>
                <Button size="sm" variant="outline" onClick={addFeature}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {data.features?.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Feature"
                      value={f || ""}
                      onChange={(e) => updateFeature(i, e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFeature(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="mb-2">Specifications</Label>
                <Button size="sm" variant="outline" onClick={addSpec}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(data.specifications || {}).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <Badge variant="secondary">{k}</Badge>
                    <span className="text-sm">{v}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSpec(k)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* stock switch */}
            <div className="flex items-center gap-2">
              <Switch
                checked={data.inStock}
                onCheckedChange={(c) => setData({ ...data, inStock: c })}
              />
              <Label>In Stock</Label>
            </div>

            <Separator />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setData(emptyProduct)}>
                Reset
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
