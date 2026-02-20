import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories;
  try {
    categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-amber-800 font-medium">لا يمكن الاتصال بقاعدة البيانات.</p>
        <Link href="/admin/categories" className="inline-block mt-3 text-sm text-amber-700 hover:underline">إعادة المحاولة</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">التصنيفات</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent-dark text-white">إضافة تصنيف</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تصنيف جديد</DialogTitle>
            </DialogHeader>
            <CategoryForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-3 font-semibold text-slate-800">الاسم</th>
              <th className="p-3 font-semibold text-slate-800">المعرّف</th>
              <th className="p-3 font-semibold text-slate-800">المنتجات</th>
              <th className="p-3 font-semibold text-slate-800">الحالة</th>
              <th className="p-3 font-semibold text-slate-800">إجراءات</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-900">{c.nameAr}</td>
                <td className="p-3 text-slate-800">{c.slug}</td>
                <td className="p-3 text-slate-900">{c._count.products}</td>
                <td className="p-3">{c.isActive ? <span className="text-accent font-medium">نشط</span> : <span className="text-slate-400">معطّل</span>}</td>
                <td className="p-3">
                  <CategoryForm category={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="p-8 text-center text-slate-500">لا توجد تصنيفات. أضف تصنيفاً أولاً.</p>
        )}
      </div>
    </div>
  );
}
