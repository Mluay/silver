import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    redirect("/admin/login");
  }
  if (!user) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8 text-slate-900">{children}</main>
    </div>
  );
}
