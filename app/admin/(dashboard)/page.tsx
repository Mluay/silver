import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [productsTotal, productsActive, categoriesCount, typesCount, ordersNew, ordersTotal] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.type.count(),
      prisma.order.count({ where: { status: "new" } }),
      prisma.order.count(),
    ]);
  return {
    productsTotal,
    productsActive,
    productsInactive: productsTotal - productsActive,
    categoriesCount,
    typesCount,
    ordersNew,
    ordersTotal,
  };
}

export default async function AdminDashboardPage() {
  let stats;
  try {
    stats = await getStats();
  } catch (e) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-amber-800 font-medium">لا يمكن الاتصال بقاعدة البيانات.</p>
        <p className="text-sm text-amber-700 mt-1">تحقق من ملف .env ورابط DATABASE_URL.</p>
        <Link href="/admin" className="inline-block mt-3 text-sm text-amber-700 hover:underline">إعادة المحاولة</Link>
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي المنتجات",
      value: stats.productsTotal,
      icon: Package,
      borderClass: "border-r-accent",
      iconBg: "bg-accent/10 text-accent",
    },
    {
      title: "منتجات نشطة / غير نشطة",
      value: `${stats.productsActive} / ${stats.productsInactive}`,
      icon: Package,
      borderClass: "border-r-slate-300",
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      title: "التصنيفات والأنواع",
      value: `${stats.categoriesCount} تصنيف • ${stats.typesCount} نوع`,
      icon: FolderTree,
      borderClass: "border-r-slate-300",
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      title: "الطلبات (جديد / إجمالي)",
      value: `${stats.ordersNew} / ${stats.ordersTotal}`,
      icon: ShoppingBag,
      borderClass: "border-r-amber-400",
      iconBg: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">لوحة التحكم</h1>
      <p className="text-slate-600 text-sm mb-6">نظرة عامة على المتجر والإحصائيات</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ title, value, icon: Icon, borderClass, iconBg }) => (
          <Card
            key={title}
            className={`border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow border-r-4 ${borderClass}`}
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-800">{title}</CardTitle>
              <span className={`p-2 rounded-lg ${iconBg}`}>
                <Icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
