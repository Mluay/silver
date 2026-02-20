"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@prisma/client";

export function ProductImageManager({
  productId,
  images: initialImages,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("productId", productId);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setImages((prev) => [...prev, data.image]);
    } catch (err) {
      alert("فشل رفع الصورة");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function setPrimary(imageId: string) {
    const res = await fetch(`/api/admin/products/${productId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, isPrimary: true }),
    });
    if (!res.ok) return;
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === imageId }))
    );
  }

  async function removeImage(imageId: string) {
    if (!confirm("حذف هذه الصورة؟")) return;
    const res = await fetch(`/api/admin/products/${productId}/images?id=${imageId}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function reorder(imageId: string, direction: "up" | "down") {
    const idx = images.findIndex((i) => i.id === imageId);
    if (idx < 0) return;
    const newOrder = [...images];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[idx], newOrder[swap]] = [newOrder[swap], newOrder[idx]];
    setImages(newOrder);
    await fetch(`/api/admin/products/${productId}/images/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder.map((i) => i.id) }),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 group"
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover"
              sizes="128px"
            />
            {img.isPrimary && (
              <span className="absolute top-1 right-1 bg-accent text-white text-xs px-1 rounded">
                رئيسية
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPrimary(img.id)}
                disabled={img.isPrimary}
              >
                ★
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-7 w-7"
                onClick={() => reorder(img.id, "up")}
                disabled={i === 0}
              >
                ↑
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-7 w-7"
                onClick={() => reorder(img.id, "down")}
                disabled={i === images.length - 1}
              >
                ↓
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-7 w-7 text-red-400"
                onClick={() => removeImage(img.id)}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 cursor-pointer disabled:opacity-50">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
          {uploading ? "جاري الرفع..." : "رفع صورة"}
        </label>
      </div>
    </div>
  );
}
