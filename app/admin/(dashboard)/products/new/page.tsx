import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, types] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.type.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">إضافة منتج</h1>
      <ProductForm categories={categories} types={types} />
    </div>
  );
}
