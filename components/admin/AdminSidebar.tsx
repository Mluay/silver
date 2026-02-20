"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingBag,
  LogOut,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
  { href: "/admin/types", label: "الأنواع", icon: Tags },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-slate-800 border-l border-slate-700/50 shadow-xl">
      <div className="p-5 border-b border-slate-700/50">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-lg text-white tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-extrabold">
            ف
          </span>
          لوحة التحكم
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent text-white shadow-md"
                  : "text-slate-200 hover:bg-slate-700/70 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-700/50 space-y-1">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-slate-200 hover:bg-slate-700/70 hover:text-white font-medium"
          onClick={() => supabase.auth.signOut().then(() => window.location.assign("/admin/login"))}
        >
          <LogOut className="h-4 w-4 ml-2 shrink-0" />
          تسجيل الخروج
        </Button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors font-medium"
        >
          <Store className="h-4 w-4" />
          العودة للمتجر
        </Link>
      </div>
    </aside>
  );
}
