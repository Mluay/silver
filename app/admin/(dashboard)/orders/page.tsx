import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIqd } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders;
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
    });
  } catch {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-amber-800 font-medium">لا يمكن الاتصال بقاعدة البيانات.</p>
        <Link href="/admin/orders" className="inline-block mt-3 text-sm text-amber-700 hover:underline">إعادة المحاولة</Link>
      </div>
    );
  }

  const statusMap = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s.labelAr]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">الطلبات</h1>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-3 font-semibold text-slate-800">التاريخ</th>
              <th className="p-3 font-semibold text-slate-800">العميل</th>
              <th className="p-3 font-semibold text-slate-800">الهاتف</th>
              <th className="p-3 font-semibold text-slate-800">المبلغ</th>
              <th className="p-3 font-semibold text-slate-800">الحالة</th>
              <th className="p-3 font-semibold text-slate-800">إجراءات</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-slate-700">
                  {new Date(o.createdAt).toLocaleDateString("ar-IQ")}
                </td>
                <td className="p-3 font-medium text-slate-900">{o.customerName}</td>
                <td className="p-3 text-slate-900">{o.customerPhone}</td>
                <td className="p-3 font-medium text-slate-900">{formatIqd(o.totalIqd)}</td>
                <td className="p-3 font-medium text-slate-800">{statusMap[o.status as keyof typeof statusMap] ?? o.status}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-accent font-medium hover:underline"
                  >
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-slate-500">لا توجد طلبات بعد.</p>
        )}
      </div>
    </div>
  );
}
