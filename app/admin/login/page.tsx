"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes("invalid login credentials")) {
        setError("البريد أو كلمة المرور غير صحيحة");
      } else if (msg.includes("invalid api key") || msg.includes("api key")) {
        setError("مفتاح API غير صحيح. في ملف .env استخدم مفتاح anon (public) من Supabase: Settings → API → anon public");
      } else {
        setError(err.message);
      }
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="absolute inset-0 bg-slate-800/5" aria-hidden />
      <Card className="w-full max-w-md relative border-slate-200 bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="h-2 w-full bg-accent" />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center text-lg font-bold">
              ف
            </span>
            <CardTitle className="text-slate-800 text-xl">لوحة التحكم</CardTitle>
          </div>
          <p className="text-slate-500 text-sm">سجّل دخولك لإدارة المتجر</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-1.5 border-slate-200 focus:border-accent focus:ring-accent/20"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-700">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 border-slate-200 focus:border-accent focus:ring-accent/20"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent-dark text-white font-medium"
              disabled={loading}
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
