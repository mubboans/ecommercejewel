/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createProduct } from "../actions";
import type { IProduct } from "@/models/Product";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";

interface Specification {
  key: string;
  value: string;
}

// Match the IProduct interface structure - NO DEFAULT ZEROS
const empty: Omit<IProduct, "_id" | "createdAt" | "updatedAt"> & {
  _id?: string;
} = {
  name: "",
  price: undefined as any,
  productImages: [],
  badge: "",
  category: "",
  description: "",
  features: [],
  specifications: {},
  inStock: true,
  stockCount: 1,
  rating: 0, // Default value for rating
  reviews: 0, // Default value for reviews
};

export default function NewProductPage() {
  const router = useRouter();
  const [data, setData] = useState<typeof empty>(empty);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [specifications, setSpecifications] = useState<Specification[]>([]);

  // Convert specifications array to object for form data
  const updateSpecificationsInData = (specs: Specification[]) => {
    const specObject: Record<string, string> = {};
    specs.forEach((spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        specObject[spec.key] = spec.value;
      }
    });
    setData((prev) => ({ ...prev, specifications: specObject }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!data.category?.trim()) {
      newErrors.category = "Category is required";
    }

    if (data.price === undefined || data.price === null) {
      newErrors.price = "Price is required";
    } else if (data.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    if (
      data.originalPrice !== undefined &&
      data.originalPrice !== null &&
      data.originalPrice < 0
    ) {
      newErrors.originalPrice = "Original price cannot be negative";
    }

    if (data.stockCount === undefined || data.stockCount === null) {
      newErrors.stockCount = "Stock count is required";
    } else if (data.stockCount < 0) {
      newErrors.stockCount = "Stock count cannot be negative";
    }

    if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    if (data.reviews !== undefined && data.reviews < 0) {
      newErrors.reviews = "Reviews cannot be negative";
    }

    if (!data.description?.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate that we have at least one image
    if (data.productImages.length === 0) {
      newErrors.productImages = "At least one product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* helpers */
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      // Filter out empty features
      const cleanFeatures = data.features.filter((feature) => feature.trim());

      const submitData = {
        ...data,
        features: cleanFeatures,
        // Use actual values or undefined (not 0)
        price: data.price || 0, // Only required field that needs a fallback
        stockCount: data.stockCount !== undefined ? data.stockCount : 0,
        rating: data.rating !== undefined ? data.rating : 4.5,
        reviews: data.reviews !== undefined ? data.reviews : 0,
        // Optional fields remain undefined if empty
        originalPrice:
          data.originalPrice !== undefined ? data.originalPrice : undefined,
        badge: data.badge || undefined,
      };

      await createProduct(submitData);
      toast.success("✅ Product created successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      console.error("Error creating product:", e);
      toast.error(e.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes with validation clearing
  const handleInputChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle features
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = value;
    setData({ ...data, features: newFeatures });
  };

  const addFeature = () => {
    setData({ ...data, features: [...data.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    setData({ ...data, features: newFeatures });
  };

  // Handle specifications
  const handleSpecificationChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
    updateSpecificationsInData(newSpecs);
  };

  const addSpecification = () => {
    const newSpecs = [...specifications, { key: "", value: "" }];
    setSpecifications(newSpecs);
    updateSpecificationsInData(newSpecs);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    updateSpecificationsInData(newSpecs);
  };

  // Handle Cloudinary image upload - images are uploaded immediately
  const handleImageUpload = (urls: string[]) => {
    setData((prev) => ({
      ...prev,
      productImages: urls,
    }));
    // Clear image error if any
    if (errors.productImages) {
      setErrors((prev) => ({ ...prev, productImages: "" }));
    }
  };

  // Handle image removal
  const handleImageRemove = (index: number) => {
    const newImages = data.productImages.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, productImages: newImages }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header Layout */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Product
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => {
                  setData(empty);
                  setSpecifications([]);
                  setErrors({});
                }}
                disabled={loading}
                className="shrink-0"
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Bohemian Rose Gold Earrings"
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <Input
                      id="category"
                      value={data.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      placeholder="Earrings"
                      className="w-full"
                    />
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price (₹) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="1"
                      min="0"
                      value={data.price ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      placeholder="Enter price in cents"
                      className="w-full"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="originalPrice"
                      className="text-sm font-medium"
                    >
                      Original Price (¢)
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="1"
                      min="0"
                      value={data.originalPrice ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "originalPrice",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      placeholder="Original price in cents"
                      className="w-full"
                    />
                    {errors.originalPrice && (
                      <p className="text-sm text-red-500">
                        {errors.originalPrice}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockCount" className="text-sm font-medium">
                      Stock Count *
                    </Label>
                    <Input
                      id="stockCount"
                      type="number"
                      min="0"
                      value={data.stockCount ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "stockCount",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    {errors.stockCount && (
                      <p className="text-sm text-red-500">
                        {errors.stockCount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="badge" className="text-sm font-medium">
                      Badge
                    </Label>
                    <Input
                      id="badge"
                      value={data.badge}
                      onChange={(e) =>
                        handleInputChange("badge", e.target.value)
                      }
                      placeholder="Best Seller, New, Sale"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating" className="text-sm font-medium">
                      Rating (0-5)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={data.rating ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "rating",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    {errors.rating && (
                      <p className="text-sm text-red-500">{errors.rating}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviews" className="text-sm font-medium">
                      Reviews Count
                    </Label>
                    <Input
                      id="reviews"
                      type="number"
                      min="0"
                      value={data.reviews ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          "reviews",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    {errors.reviews && (
                      <p className="text-sm text-red-500">{errors.reviews}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    placeholder="Hand-crafted rose gold earrings with premium materials and elegant design..."
                    className="w-full"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={data.inStock}
                    onCheckedChange={(checked) =>
                      handleInputChange("inStock", checked)
                    }
                  />
                  <Label htmlFor="inStock" className="text-sm font-medium">
                    In Stock
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card>
              <CardHeader>
                <CardTitle>Product Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {data.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-9 w-9 p-0 flex-shrink-0"
                        disabled={data.features.length === 1 && index === 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
                <p className="text-xs text-muted-foreground">
                  Add product features. Empty fields will be automatically
                  removed when saving.
                </p>
              </CardContent>
            </Card>

            {/* Specifications Card */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-2 items-start group"
                    >
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-3" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full">
                          <Input
                            placeholder="Specification name (e.g., Material)"
                            value={spec.key}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                            className="text-sm"
                          />
                          <Input
                            placeholder="Specification value (e.g., Gold)"
                            value={spec.value}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        className="h-9 w-9 p-0 flex-shrink-0 mt-1 sm:mt-0"
                        disabled={specifications.length === 1 && index === 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecification}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
                <p className="text-xs text-muted-foreground">
                  Add product specifications as key-value pairs. Empty rows will
                  be automatically filtered out.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            {/* Images Card */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <CloudinaryUpload
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                  existingImages={data.productImages}
                  multiple={true}
                  maxFiles={10}
                />
                {errors.productImages && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.productImages}
                  </p>
                )}
                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <p>• Upload high-quality product images</p>
                  <p>• Supported formats: JPEG, PNG, WebP</p>
                  <p>• Maximum file size: 5MB per image</p>
                  <p>• Recommended size: 1200x1200 pixels</p>
                  <p>• Images are uploaded to Cloudinary immediately</p>
                  <p>• At least one image is required</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Product Info</h4>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>
                      <strong>Name:</strong> {data.name || "Not set"}
                    </p>
                    <p>
                      <strong>Category:</strong> {data.category || "Not set"}
                    </p>
                    <p>
                      <strong>Price:</strong>{" "}
                      {data.price ? `¢${data.price}` : "Not set"}
                    </p>
                    {data.originalPrice && (
                      <p>
                        <strong>Original Price:</strong> ¢{data.originalPrice}
                      </p>
                    )}
                    <p>
                      <strong>Stock:</strong>{" "}
                      {data.stockCount !== undefined
                        ? `${data.stockCount} units`
                        : "Not set"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {data.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Content Summary</h4>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>
                      <strong>Features:</strong>{" "}
                      {data.features.filter((f) => f.trim()).length}
                    </p>
                    <p>
                      <strong>Specifications:</strong>{" "}
                      {
                        specifications.filter(
                          (s) => s.key.trim() && s.value.trim()
                        ).length
                      }
                    </p>
                    <p>
                      <strong>Images:</strong> {data.productImages.length}
                      {data.productImages.length === 0 && (
                        <span className="text-red-500">
                          {" "}
                          (At least one image required)
                        </span>
                      )}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {data.description
                        ? `${data.description.length} chars`
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
