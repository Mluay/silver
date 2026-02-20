import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      type: true,
    },
    orderBy: { sortOrder: "asc" },
    take: 8,
  });
  return products;
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts().catch(() => []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100">
            منتجات مميزة
          </h2>
          <Link href="/shop">
            <Button variant="outline" className="dark:border-silver-600 dark:text-silver-200 dark:hover:bg-silver-800">
              عرض الكل
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-silver-500 dark:text-silver-400 py-8">
            لا توجد منتجات مميزة حالياً. تصفح المتجر لرؤية المجموعة.
          </p>
        )}
      </div>
    </section>
  );
}
