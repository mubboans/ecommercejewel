"use client";

import { useState, useRef } from "react";

import { Label } from "@/components/ui/label";
import {  X, Loader2, Image as ImageIcon } from "lucide-react";

interface CloudinaryUploadProps {
  onUpload: (urls: string[]) => void; // Now returns Cloudinary URLs
  onRemove?: (index: number) => void;
  existingImages?: string[];
  multiple?: boolean;
  maxFiles?: number;
}

export function CloudinaryUpload({
  onUpload,
  onRemove,
  existingImages = [],
  multiple = true,
  maxFiles = 10,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [localImages, setLocalImages] = useState<string[]>(existingImages);
  const [localFiles, setLocalFiles] = useState<File[]>([]); // Store files for upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload single image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    // Check file limit
    const totalFiles = localImages.length + files.length;
    if (totalFiles > maxFiles) {
      alert(
        `Maximum ${maxFiles} images allowed. You have ${localImages.length} images and trying to add ${files.length} more.`
      );
      return;
    }

    const fileArray = Array.from(files);
    setUploading(true);

    try {
      // Upload each file to Cloudinary
      const uploadedUrls: string[] = [];
      const newFiles: File[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        setUploadingIndex(i);
        const cloudinaryUrl = await uploadToCloudinary(fileArray[i]);
        uploadedUrls.push(cloudinaryUrl);
        newFiles.push(fileArray[i]);
      }

      // Update local state with Cloudinary URLs
      const updatedImages = [...localImages, ...uploadedUrls];
      setLocalImages(updatedImages);
      setLocalFiles((prev) => [...prev, ...newFiles]);

      // Call onUpload with Cloudinary URLs
      onUpload(updatedImages);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload one or more images");
    } finally {
      setUploading(false);
      setUploadingIndex(null);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const removedImage = localImages[index];
    const isCloudinaryImage = removedImage.includes("cloudinary.com");

    // If it's a Cloudinary image, try to delete it from Cloudinary
    if (isCloudinaryImage) {
      try {
        // Extract public_id from Cloudinary URL
        const parts = removedImage.split("/");
        const fileNameWithExtension = parts[parts.length - 1];
        const publicId = fileNameWithExtension.split(".")[0];

        const formData = new FormData();
        formData.append("public_id", publicId);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
          {
            method: "POST",
            body: formData,
          }
        );
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        // Continue with removal even if Cloudinary deletion fails
      }
    }

    // Remove from local state
    const newImages = localImages.filter((_, i) => i !== index);
    const newFiles = localFiles.filter((_, i) => i !== index);

    setLocalImages(newImages);
    setLocalFiles(newFiles);

    // Call onUpload with updated URLs
    onUpload(newImages);

    // Call onRemove callback if provided
    if (onRemove) {
      onRemove(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files) return;

    // Check file limit
    const totalFiles = localImages.length + files.length;
    if (totalFiles > maxFiles) {
      alert(
        `Maximum ${maxFiles} images allowed. You have ${localImages.length} images and trying to add ${files.length} more.`
      );
      return;
    }

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (fileArray.length > 0) {
      setUploading(true);

      try {
        const uploadedUrls: string[] = [];
        const newFiles: File[] = [];

        for (let i = 0; i < fileArray.length; i++) {
          setUploadingIndex(i);
          const cloudinaryUrl = await uploadToCloudinary(fileArray[i]);
          uploadedUrls.push(cloudinaryUrl);
          newFiles.push(fileArray[i]);
        }

        const updatedImages = [...localImages, ...uploadedUrls];
        setLocalImages(updatedImages);
        setLocalFiles((prev) => [...prev, ...newFiles]);
        onUpload(updatedImages);
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload one or more images");
      } finally {
        setUploading(false);
        setUploadingIndex(null);
      }
    }
  };

  const optimizeImageUrl = (url: string) => {
    // Only optimize Cloudinary URLs
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      return url.replace(
        "/upload/",
        "/upload/w_500,h_500,c_fill,q_auto,f_auto/"
      );
    }
    return url;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || localImages.length >= maxFiles}
        />

        <div className="space-y-3">
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Uploading{" "}
                {uploadingIndex !== null
                  ? `image ${uploadingIndex + 1}`
                  : "images"}
                ...
              </p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {localImages.length >= maxFiles
                    ? "Maximum files reached"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to 5MB each
                </p>
                <p className="text-xs text-muted-foreground">
                  {localImages.length} of {maxFiles} images selected
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {localImages.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Product Images ({localImages.length}/{maxFiles})
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {localImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={optimizeImageUrl(url)}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {uploading && uploadingIndex === index && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                  {url.includes("cloudinary.com") ? "Uploaded" : "Processing"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Information */}
      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Images uploaded:</span>
          <span>
            {localImages.length} / {maxFiles}
          </span>
        </div>
        {localImages.length > 0 && (
          <div className="flex justify-between">
            <span>Cloudinary images:</span>
            <span>
              {
                localImages.filter((url) => url.includes("cloudinary.com"))
                  .length
              }
            </span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>• Images are uploaded to Cloudinary immediately when selected</p>
        <p>• Deleted images are automatically removed from Cloudinary</p>
        <p>• All images are optimized for web display</p>
      </div>
    </div>
  );
}
