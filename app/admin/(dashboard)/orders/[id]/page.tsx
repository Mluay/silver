import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIqd, formatWeight } from "@/lib/utils";
import { OrderStatusUpdate } from "@/components/admin/OrderStatusUpdate";
import { ORDER_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const statusLabel = ORDER_STATUSES.find((s) => s.value === order.status)?.labelAr ?? order.status;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">تفاصيل الطلب #{id.slice(-8)}</h1>
        <Link href="/admin/orders" className="text-accent font-medium hover:underline">
          ← العودة للطلبات
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3 text-base">معلومات العميل</h2>
            <p className="text-slate-900 mb-1.5"><strong className="text-slate-700">الاسم:</strong> <span className="text-slate-900">{order.customerName}</span></p>
            <p className="text-slate-900 mb-1.5"><strong className="text-slate-700">الهاتف:</strong> <span className="text-slate-900">{order.customerPhone}</span></p>
            <p className="text-slate-900 mb-1.5"><strong className="text-slate-700">العنوان:</strong> <span className="text-slate-900">{order.address}</span></p>
            {order.notes && <p className="text-slate-900"><strong className="text-slate-700">ملاحظات:</strong> <span className="text-slate-900">{order.notes}</span></p>}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3 text-base">الحالة</h2>
            <p className="mb-2 text-slate-900 font-medium">{statusLabel}</p>
            <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-3 text-base">عناصر الطلب</h2>
          <ul className="space-y-2 text-slate-900">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-900">{item.productName} × {item.quantity}</span>
                <span className="font-medium text-slate-900">{formatIqd(item.priceIqd * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-slate-800">
            الوزن الإجمالي: {order.totalWeightGrams != null ? formatWeight(order.totalWeightGrams) : "—"}
          </p>
          <p className="font-bold text-slate-900 text-lg mt-2">
            المجموع: <span className="text-accent">{formatIqd(order.totalIqd)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
