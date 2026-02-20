"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatIqd, formatWeight } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    notes: "",
  });

  const totalPrice = items.reduce((s, i) => s + i.priceIqd * i.quantity, 0);
  const totalWeight = items.reduce((s, i) => s + i.weightGrams * i.quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          address: form.address,
          notes: form.notes || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            priceIqd: i.priceIqd,
            quantity: i.quantity,
            weightGrams: i.weightGrams,
          })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      clearCart();
      setDone(true);
      router.push("/");
    } catch (err) {
      alert("حدث خطأ. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !done) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-silver-600 dark:text-silver-400 mb-4">السلة فارغة. أضف منتجات من المتجر.</p>
        <Link href="/shop">
          <Button>المتجر</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-accent dark:text-accent-light mb-2">تم استلام طلبك</h1>
        <p className="text-silver-600 dark:text-silver-400 mb-6">سنتواصل معك لتأكيد الطلب والتوصيل (دفع عند الاستلام).</p>
        <Link href="/shop">
          <Button>العودة للمتجر</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-6">إتمام الطلب</h1>
      <p className="text-silver-600 dark:text-silver-400 mb-6">الدفع عند الاستلام — عنوان التوصيل داخل بغداد.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              required
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              placeholder="الاسم الكامل"
            />
          </div>
          <div>
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              required
              type="tel"
              value={form.customerPhone}
              onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
              placeholder="07XXXXXXXX"
            />
          </div>
          <div>
            <Label htmlFor="address">العنوان (بغداد)</Label>
            <Input
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="المنطقة، الشارع، تفاصيل أخرى"
            />
          </div>
          <div>
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="ملاحظات للطلب أو التوصيل"
            />
          </div>
        </div>
        <div>
          <div className="rounded-lg border border-silver-200 dark:border-silver-700 bg-silver-50 dark:bg-[#1a1a1d] p-6 sticky top-24">
            <h2 className="font-semibold text-silver-900 dark:text-silver-100 mb-4">ملخص الطلب</h2>
            <p className="text-sm text-silver-600 dark:text-silver-400">
              {items.length} صنف • {formatWeight(totalWeight)}
            </p>
            <p className="font-semibold text-accent dark:text-accent-light text-lg mt-2">{formatIqd(totalPrice)}</p>
            <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
              {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
