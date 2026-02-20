"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@prisma/client";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameAr, setNameAr] = useState(category?.nameAr ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
    const res = await fetch(url, {
      method: category ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameAr, isActive }),
    });
    setLoading(false);
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    setOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!category || !confirm("حذف هذا التصنيف؟")) return;
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    router.refresh();
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
      <div>
        <Label className="text-slate-800 font-medium">الاسم (عربي)</Label>
        <Input
          required
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          placeholder="مثال: خواتم"
          className="text-slate-900 border-slate-300"
        />
      </div>
      {category && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="text-slate-900 font-medium">نشط</span>
        </label>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent-dark text-white font-medium">
          {loading ? "جاري الحفظ..." : category ? "حفظ" : "إضافة"}
        </Button>
        {category && (
          <Button type="button" variant="outline" onClick={handleDelete} className="border-red-300 text-red-700 hover:bg-red-50 font-medium">
            حذف
          </Button>
        )}
      </div>
    </form>
  );

  if (category) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-slate-300 text-slate-800 font-medium">تعديل</Button>
        </DialogTrigger>
        <DialogContent className="text-slate-900">
          <DialogHeader>
            <DialogTitle>تعديل التصنيف</DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    );
  }
  return form;
}
