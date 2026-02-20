"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import type { Product, ProductImage, Category, Type } from "@prisma/client";
import { GENDERS } from "@/lib/constants";

type ProductWithImages = Product & { images: ProductImage[] };

export function ProductForm({
  product,
  categories,
  types,
}: {
  product?: ProductWithImages;
  categories: Category[];
  types: Type[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nameAr: product?.nameAr ?? "",
    shortDescAr: product?.shortDescAr ?? "",
    descriptionAr: product?.descriptionAr ?? "",
    weightGrams: product?.weightGrams ?? 0,
    priceIqd: product?.priceIqd ?? 0,
    categoryId: product?.categoryId ?? "",
    typeId: product?.typeId ?? "",
    gender: product?.gender ?? "women",
    stoneType: product?.stoneType ?? "",
    silverPurity: product?.silverPurity ?? "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.text();
      alert(err || "حدث خطأ");
      return;
    }
    const json = await res.json();
    const id = json.id ?? product?.id;
    router.push(id ? `/admin/products/${id}` : "/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl text-slate-900">
      <div>
        <Label className="text-slate-800 font-medium">الاسم (عربي)</Label>
        <Input
          required
          value={form.nameAr}
          onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
        />
      </div>
      <div>
        <Label className="text-slate-800 font-medium">وصف مختصر (عربي)</Label>
        <Input
          value={form.shortDescAr}
          onChange={(e) => setForm((f) => ({ ...f, shortDescAr: e.target.value }))}
        />
      </div>
      <div>
        <Label className="text-slate-800 font-medium">وصف تفصيلي (عربي)</Label>
        <Textarea
          value={form.descriptionAr}
          onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-800 font-medium">الوزن (غرام)</Label>
          <Input
            type="number"
            step="0.01"
            required
            value={form.weightGrams || ""}
            onChange={(e) => setForm((f) => ({ ...f, weightGrams: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label className="text-slate-800 font-medium">السعر (د.ع)</Label>
          <Input
            type="number"
            required
            value={form.priceIqd || ""}
            onChange={(e) => setForm((f) => ({ ...f, priceIqd: parseInt(e.target.value, 10) || 0 }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-800 font-medium">التصنيف</Label>
          <Select
            required
            value={form.categoryId}
            onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nameAr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-slate-800 font-medium">النوع</Label>
          <Select
            required
            value={form.typeId}
            onValueChange={(v) => setForm((f) => ({ ...f, typeId: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.nameAr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-slate-800 font-medium">الجنس</Label>
        <Select
          value={form.gender}
          onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GENDERS.map((g) => (
              <SelectItem key={g.value} value={g.value}>{g.labelAr}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-slate-800 font-medium">نوع الحجر (اختياري)</Label>
        <Input
          value={form.stoneType}
          onChange={(e) => setForm((f) => ({ ...f, stoneType: e.target.value }))}
        />
      </div>
      <div>
        <Label className="text-slate-800 font-medium">نقاء الفضة (اختياري)</Label>
        <Input
          value={form.silverPurity}
          onChange={(e) => setForm((f) => ({ ...f, silverPurity: e.target.value }))}
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          <span className="text-slate-900 font-medium">نشط</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
          />
          <span className="text-slate-900 font-medium">منتج مميز</span>
        </label>
      </div>
      {product && (
        <div>
          <Label className="text-slate-800 font-medium">الصور</Label>
          <ProductImageManager productId={product.id} images={product.images} />
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent-dark text-white font-medium">
          {loading ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-slate-300 text-slate-800 font-medium">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
