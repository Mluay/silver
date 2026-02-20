"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Type } from "@prisma/client";

type Params = Record<string, string | string[] | undefined>;

export function ShopFilters({
  categories,
  types,
  currentParams,
}: {
  categories: Category[];
  types: Type[];
  currentParams: Params;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Params) => {
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === "") next.delete(k);
        else next.set(k, String(v));
      });
      router.push(`/shop?${next.toString()}`);
    },
    [router, searchParams]
  );

  const initialQ = typeof currentParams.q === "string" ? currentParams.q : "";
  const [q, setQ] = useState(initialQ);
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== initialQ) updateParams({ ...currentParams, q: q || undefined });
    }, 400);
    return () => clearTimeout(t);
  }, [q]);
  const gender = typeof currentParams.gender === "string" ? currentParams.gender : "";
  const category = typeof currentParams.category === "string" ? currentParams.category : "";
  const type = typeof currentParams.type === "string" ? currentParams.type : "";
  const sort = typeof currentParams.sort === "string" ? currentParams.sort : "newest";
  const minPrice = typeof currentParams.minPrice === "string" ? currentParams.minPrice : "";
  const maxPrice = typeof currentParams.maxPrice === "string" ? currentParams.maxPrice : "";
  const minWeight = typeof currentParams.minWeight === "string" ? currentParams.minWeight : "";
  const maxWeight = typeof currentParams.maxWeight === "string" ? currentParams.maxWeight : "";
  const stone = typeof currentParams.stone === "string" ? currentParams.stone : "";

  return (
    <div className="space-y-6 rounded-lg border border-silver-200 dark:border-silver-700 bg-white dark:bg-[#252528] p-4">
      <div>
        <Label htmlFor="search">بحث فوري</Label>
        <Input
          id="search"
          placeholder="اسم المنتج أو الوصف..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div>
        <Label>الجنس</Label>
        <Select
          value={gender || "all"}
          onValueChange={(v) => updateParams({ ...currentParams, gender: v === "all" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="men">رجال</SelectItem>
            <SelectItem value="women">نساء</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>التصنيف</Label>
        <Select
          value={category || "all"}
          onValueChange={(v) => updateParams({ ...currentParams, category: v === "all" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>النوع</Label>
        <Select
          value={type || "all"}
          onValueChange={(v) => updateParams({ ...currentParams, type: v === "all" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.slug}>
                {t.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>أقل سعر (د.ع)</Label>
          <Input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => updateParams({ ...currentParams, minPrice: e.target.value || undefined })}
          />
        </div>
        <div>
          <Label>أعلى سعر (د.ع)</Label>
          <Input
            type="number"
            placeholder="—"
            value={maxPrice}
            onChange={(e) => updateParams({ ...currentParams, maxPrice: e.target.value || undefined })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>الوزن من (غ)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="0"
            value={minWeight}
            onChange={(e) => updateParams({ ...currentParams, minWeight: e.target.value || undefined })}
          />
        </div>
        <div>
          <Label>الوزن إلى (غ)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="—"
            value={maxWeight}
            onChange={(e) => updateParams({ ...currentParams, maxWeight: e.target.value || undefined })}
          />
        </div>
      </div>
      <div>
        <Label>نوع الحجر</Label>
        <Input
          placeholder="مثال: فيروزي"
          value={stone}
          onChange={(e) => updateParams({ ...currentParams, stone: e.target.value || undefined })}
        />
      </div>
      <div>
        <Label>ترتيب</Label>
        <Select
          value={sort}
          onValueChange={(v) => updateParams({ ...currentParams, sort: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="price_asc">السعر: من الأقل</SelectItem>
            <SelectItem value="price_desc">السعر: من الأعلى</SelectItem>
            <SelectItem value="weight">الوزن</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/shop")}
      >
        مسح الفلاتر
      </Button>
    </div>
  );
}
