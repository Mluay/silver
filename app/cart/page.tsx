"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatIqd, formatWeight } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const totalPrice = items.reduce((s, i) => s + i.priceIqd * i.quantity, 0);
  const totalWeight = items.reduce((s, i) => s + i.weightGrams * i.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-6">السلة</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-silver-600 dark:text-silver-400 mb-4">السلة فارغة</p>
          <Link href="/shop">
            <Button>تصفح المتجر</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-lg border border-silver-200 dark:border-silver-700 bg-white dark:bg-[#252528] p-4"
              >
                <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden bg-silver-100 dark:bg-silver-800">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-silver-400 text-xs">
                      لا صورة
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-silver-900 dark:text-silver-100">{item.name}</p>
                  <p className="text-sm text-accent dark:text-accent-light">{formatIqd(item.priceIqd)}</p>
                  <p className="text-sm text-silver-600 dark:text-silver-400">{formatWeight(item.weightGrams)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeItem(item.productId)}
                  >
                    إزالة
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-silver-200 dark:border-silver-700 bg-silver-50 dark:bg-[#1a1a1d] p-6 sticky top-24">
              <h2 className="font-semibold text-silver-900 dark:text-silver-100 mb-4">ملخص الطلب</h2>
              <p className="flex justify-between text-sm text-silver-700 dark:text-silver-300">
                <span>إجمالي الوزن</span>
                <span>{formatWeight(totalWeight)}</span>
              </p>
              <p className="flex justify-between font-semibold mt-2 text-accent dark:text-accent-light text-lg">
                <span>المجموع</span>
                <span>{formatIqd(totalPrice)}</span>
              </p>
              <Link href="/checkout" className="block mt-6">
                <Button className="w-full" size="lg">
                  إتمام الطلب
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
