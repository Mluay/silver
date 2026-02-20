"use client";

import Image from "next/image";
import Link from "next/link";
import { formatIqd, formatWeight } from "@/lib/utils";
import { useCart } from "@/lib/store/cart-store";
import { ShoppingBag, Scale } from "lucide-react";
import type { Product, ProductImage, Category, Type } from "@prisma/client";

type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category;
  type: Type;
};

export function ProductCard({ product, priority }: { product: ProductWithRelations; priority?: boolean }) {
  const addItem = useCart((s) => s.addItem);
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const imageUrl = primaryImage?.url ?? "/placeholder-product.svg";

  return (
    <article className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-[#1e1e21] border border-silver-200/80 dark:border-silver-700/80 shadow-sm hover:shadow-xl dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-accent-light/40 transition-all duration-300 hover:-translate-y-0.5">
      <Link href={`/product/${product.slug}`} className="block flex-1 flex flex-col min-h-0">
        {/* صورة المنتج */}
        <div className="relative aspect-square overflow-hidden bg-silver-100 dark:bg-silver-800/50">
          <Image
            src={imageUrl}
            alt={product.nameAr}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
          {/* تدرج خفيف عند الـ hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {/* شارة منتج مميز */}
          {product.isFeatured && (
            <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/95 dark:bg-accent-light/95 text-white shadow-md">
              مميز
            </span>
          )}
        </div>

        {/* المحتوى */}
        <div className="flex-1 flex flex-col p-4 pb-3">
          <h3 className="font-bold text-silver-900 dark:text-silver-50 text-base leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.nameAr}
          </h3>
          {product.shortDescAr && (
            <p className="text-sm text-silver-500 dark:text-silver-400 mt-1.5 line-clamp-2">
              {product.shortDescAr}
            </p>
          )}
        </div>
      </Link>

      {/* السعر والوزن وزر السلة — ثابت في أسفل الكارت */}
      <div className="p-4 pt-0 flex flex-col gap-3 border-t border-silver-100 dark:border-silver-700/80">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-accent dark:text-accent-light tabular-nums">
            {formatIqd(product.priceIqd)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-silver-500 dark:text-silver-400 bg-silver-100 dark:bg-silver-800/80 px-2 py-1 rounded-full">
            <Scale className="w-3 h-3" />
            {formatWeight(product.weightGrams)}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.nameAr,
              priceIqd: product.priceIqd,
              weightGrams: product.weightGrams,
              imageUrl: primaryImage?.url ?? null,
            })
          }
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold bg-accent hover:bg-accent-light dark:bg-accent-light dark:hover:bg-accent text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
        >
          <ShoppingBag className="w-4 h-4" />
          أضف إلى السلة
        </button>
      </div>
    </article>
  );
}
