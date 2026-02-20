import { Suspense } from "react";
import { ShopContent } from "@/components/storefront/ShopContent";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-6">المتجر</h1>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-silver-200 dark:border-silver-700 overflow-hidden">
          <Skeleton className="aspect-square w-full dark:bg-silver-700" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
