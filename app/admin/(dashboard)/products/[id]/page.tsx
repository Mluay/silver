import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, types] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.type.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">تعديل المنتج</h1>
      <ProductForm
        product={product}
        categories={categories}
        types={types}
      />
    </div>
  );
}
