import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { DbErrorBanner } from "@/components/storefront/DbErrorBanner";
import type { Prisma } from "@prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { images: true; category: true; type: true };
}>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
    });
    if (!product) return {};
    return {
      title: `${product.nameAr} | فضة بغداد`,
      description: product.shortDescAr ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: ProductWithRelations | null = null;
  let related: ProductWithRelations[] = [];
  let dbError = false;

  try {
    product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        type: true,
      },
    });
    if (product) {
      related = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { not: product.id },
          OR: [{ categoryId: product.categoryId }, { typeId: product.typeId }],
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
          type: true,
        },
        take: 4,
      });
    }
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DbErrorBanner />
        <Link href="/shop" className="text-accent hover:underline">العودة للمتجر</Link>
      </div>
    );
  }

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} related={related} />
    </div>
  );
}
