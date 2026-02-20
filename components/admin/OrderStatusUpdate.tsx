"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";

export function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  async function handleChange(status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    router.refresh();
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-40 text-slate-900 font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.labelAr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
