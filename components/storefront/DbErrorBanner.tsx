import Link from "next/link";

export function DbErrorBanner({ message = "لا يمكن الاتصال بقاعدة البيانات. تحقق من إعدادات الاتصال أو أن مشروع Supabase يعمل." }: { message?: string }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4 mb-6">
      <p className="text-amber-800 dark:text-amber-200 text-sm">{message}</p>
      <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
        في ملف .env استخدم الاتصال المباشر (منفذ 5432). من Supabase: Settings → Database → Connection string → URI.
      </p>
      <Link href="/" className="inline-block mt-2 text-sm font-medium text-amber-700 dark:text-amber-200 hover:underline">
        ← العودة للرئيسية
      </Link>
    </div>
  );
}
