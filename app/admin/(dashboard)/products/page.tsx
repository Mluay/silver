import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatIqd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products;
  try {
    products = await prisma.product.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
      type: true,
    },
    orderBy: { createdAt: "desc" },
  });
  } catch {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-amber-800 font-medium">لا يمكن الاتصال بقاعدة البيانات.</p>
        <Link href="/admin/products" className="inline-block mt-3 text-sm text-amber-700 hover:underline">إعادة المحاولة</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">المنتجات</h1>
        <Link href="/admin/products/new">
          <Button className="bg-accent hover:bg-accent-dark text-white">إضافة منتج</Button>
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-3 font-semibold text-slate-800">صورة</th>
              <th className="p-3 font-semibold text-slate-800">الاسم</th>
              <th className="p-3 font-semibold text-slate-800">التصنيف / النوع</th>
              <th className="p-3 font-semibold text-slate-800">السعر</th>
              <th className="p-3 font-semibold text-slate-800">الحالة</th>
              <th className="p-3 font-semibold text-slate-800">إجراءات</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3">
                  {p.images[0] ? (
                    <img
                      src={p.images[0].url}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="p-3 font-medium text-slate-900">{p.nameAr}</td>
                <td className="p-3 text-slate-800">{p.category.nameAr} / {p.type.nameAr}</td>
                <td className="p-3 font-medium text-slate-900">{formatIqd(p.priceIqd)}</td>
                <td className="p-3">
                  <span className={p.isActive ? "text-accent font-medium" : "text-slate-400"}>
                    {p.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`}>
                    <Button variant="outline" size="sm" className="border-slate-300 text-slate-800 font-medium">تعديل</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-slate-500">لا توجد منتجات بعد.</p>
        )}
      </div>
    </div>
  );
}
