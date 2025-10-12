/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import { updateProduct } from "../../actions";
import type { IProduct } from "@/models/Product";
import { useRouter } from "next/navigation";

const EditForm = ({ product }: { product: any }) => {
  const router = useRouter();
  /* strip server fields that must not be sent */
  const [data, setData] = useState<
    Omit<IProduct, "_id" | "createdAt" | "updatedAt">
  >({
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    productImages: product.productImages,
    rating: product.rating,
    reviews: product.reviews,
    badge: product.badge,
    category: product.category,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    inStock: product.inStock,
    stockCount: product.stockCount,
  });

  const [loading, setLoading] = useState(false);

  /* helpers (same as NewForm) */
  const removeFeature = (idx: number) =>
    setData((d) => ({
      ...d,
      features: d.features.filter((_, i) => i !== idx),
    }));
  const updateFeature = (idx: number, val: string) =>
    setData((d) => ({
      ...d,
      features: d.features.map((f, i) => (i === idx ? val : f)),
    }));

  const addImage = () =>
    setData((d) => ({ ...d, productImages: [...d.productImages, ""] }));
  const removeImage = (idx: number) =>
    setData((d) => ({
      ...d,
      productImages: d.productImages.filter((_, i) => i !== idx),
    }));
  const updateImage = (idx: number, val: string) => {
    const copy = [...data.productImages];
    copy[idx] = val;
    return { ...data, productImages: copy };
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProduct(product._id.toString(), data);
      toast.success("✅ Product updated");
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
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Button variant="outline" onClick={()=>{console.log("Back");
          }}>
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
            {/* same fields as NewForm – values pre-filled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Name *</Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1 block">Category *</Label>
                <Input
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
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
              />
            </div>

            {/* images */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Images (URLs)</Label>
                <Button size="sm" variant="outline" onClick={addImage}>
                  <Plus className="mr-1 h-4 w-4" /> Add URL
                </Button>
              </div>
              <div className="space-y-3">
                {data?.productImages?.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => updateImage(idx, e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeImage(idx)}
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
                      onChange={(e) => updateFeature(idx, e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFeature(idx)}
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
                {Object.entries(data.specifications || {}).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <Badge variant="secondary">{k}</Badge>
                    <span className="text-sm">{String(v)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const copy = { ...(data.specifications || {}) };
                        if (k && (copy as Record<string, any>)[k]) {
                          delete (copy as Record<string, any>)[k];
                        }
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
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditForm;
