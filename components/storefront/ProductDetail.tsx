"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIqd, formatWeight } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { Product, ProductImage, Category, Type } from "@prisma/client";

type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category;
  type: Type;
};

export function ProductDetail({
  product,
  related,
}: {
  product: ProductWithRelations;
  related: ProductWithRelations[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCart((s) => s.addItem);
  const images = product.images.length ? product.images : [{ url: "/placeholder-product.svg", isPrimary: true, id: "0", productId: "", storagePath: null, sortOrder: 0 }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-silver-100 dark:bg-silver-800">
          <Image
            src={images[selectedImage]?.url ?? "/placeholder-product.svg"}
            alt={product.nameAr}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedImage(i)}
              className={`relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === i ? "border-accent dark:border-accent-light" : "border-silver-200 dark:border-silver-700"
              }`}
            >
              <Image
                src={img.url}
                alt={`${product.nameAr} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-silver-900 dark:text-silver-100">{product.nameAr}</h1>
        <div className="mt-2 flex items-center gap-4 text-silver-600 dark:text-silver-400">
          <span className="text-lg font-bold text-accent dark:text-accent-light">{formatIqd(product.priceIqd)}</span>
          <span>{formatWeight(product.weightGrams)}</span>
        </div>
        {product.shortDescAr && (
          <p className="mt-4 text-silver-600 dark:text-silver-400">{product.shortDescAr}</p>
        )}
        {product.descriptionAr && (
          <div className="mt-4 prose prose-sm max-w-none text-silver-600 dark:text-silver-400">
            {product.descriptionAr.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        {product.silverPurity && (
          <p className="mt-2 text-sm text-silver-700 dark:text-silver-300"><strong>نقاء الفضة:</strong> {product.silverPurity}</p>
        )}
        {product.stoneType && (
          <p className="text-sm text-silver-700 dark:text-silver-300"><strong>نوع الحجر:</strong> {product.stoneType}</p>
        )}
        <p className="text-sm text-silver-600 dark:text-silver-400">
          {product.gender === "men" ? "للرجال" : "للنساء"}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <label className="text-sm font-medium">الكمية</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-20 h-10 rounded-md border border-silver-300 dark:border-silver-600 bg-white dark:bg-[#252528] text-silver-900 dark:text-silver-100 px-2 text-center"
          />
          <Button
            className="flex-1"
            onClick={() => {
              const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
              addItem(
                {
                  productId: product.id,
                  name: product.nameAr,
                  priceIqd: product.priceIqd,
                  weightGrams: product.weightGrams,
                  imageUrl: primary?.url ?? null,
                },
                quantity
              );
            }}
          >
            أضف إلى السلة
          </Button>
        </div>
      </div>
      {related.length > 0 && (
        <div className="lg:col-span-2 mt-12">
          <h2 className="text-xl font-bold text-silver-900 dark:text-silver-100 mb-4">منتجات ذات صلة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
