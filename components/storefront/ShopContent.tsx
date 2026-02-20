import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFilters } from "@/components/storefront/ShopFilters";
import { DbErrorBanner } from "@/components/storefront/DbErrorBanner";

type SearchParams = Record<string, string | string[] | undefined>;

async function getProducts(params: SearchParams) {
  const category = typeof params.category === "string" ? params.category : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;
  const gender = typeof params.gender === "string" ? params.gender : undefined;
  const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice, 10) : undefined;
  const minWeight = typeof params.minWeight === "string" ? parseFloat(params.minWeight) : undefined;
  const maxWeight = typeof params.maxWeight === "string" ? parseFloat(params.maxWeight) : undefined;
  const stone = typeof params.stone === "string" ? params.stone : undefined;
  const q = typeof params.q === "string" ? params.q.trim() : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  const where: Record<string, unknown> = { isActive: true };

  if (category) {
    const cat = await prisma.category.findFirst({ where: { slug: category, isActive: true } });
    if (cat) where.categoryId = cat.id;
  }
  if (type) {
    const t = await prisma.type.findFirst({ where: { slug: type, isActive: true } });
    if (t) where.typeId = t.id;
  }
  if (gender) where.gender = gender;
  if (minPrice != null && !isNaN(minPrice) || maxPrice != null && !isNaN(maxPrice)) {
    where.priceIqd = {};
    if (minPrice != null && !isNaN(minPrice)) (where.priceIqd as Record<string, number>).gte = minPrice;
    if (maxPrice != null && !isNaN(maxPrice)) (where.priceIqd as Record<string, number>).lte = maxPrice;
  }
  if (minWeight != null && !isNaN(minWeight) || maxWeight != null && !isNaN(maxWeight)) {
    where.weightGrams = {};
    if (minWeight != null && !isNaN(minWeight)) (where.weightGrams as Record<string, number>).gte = minWeight;
    if (maxWeight != null && !isNaN(maxWeight)) (where.weightGrams as Record<string, number>).lte = maxWeight;
  }
  if (stone) where.stoneType = { contains: stone, mode: "insensitive" };
  if (q) {
    where.OR = [
      { nameAr: { contains: q, mode: "insensitive" } },
      { shortDescAr: { contains: q, mode: "insensitive" } },
      { descriptionAr: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> =
    sort === "price_asc"
      ? { priceIqd: "asc" }
      : sort === "price_desc"
      ? { priceIqd: "desc" }
      : sort === "weight"
      ? { weightGrams: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      type: true,
    },
    orderBy,
  });

  return products;
}

async function getCategoriesAndTypes() {
  const [categories, types] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.type.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return { categories, types };
}

const fallbackCategories = [
  { id: "men", nameAr: "رجال", slug: "men", isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: "women", nameAr: "نساء", slug: "women", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: "rings", nameAr: "خواتم", slug: "rings", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: "necklaces", nameAr: "سلاسل", slug: "necklaces", isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: "bracelets", nameAr: "أساور", slug: "bracelets", isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
];
const fallbackTypes = [
  { id: "ring", nameAr: "خاتم", slug: "ring", isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: "necklace", nameAr: "عقد", slug: "necklace", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: "bracelet", nameAr: "سوار", slug: "bracelet", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
];

export async function ShopContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categories = fallbackCategories;
  let types = fallbackTypes;
  let dbError = false;

  try {
    const [productsResult, catTypesResult] = await Promise.all([
      getProducts(params).catch(() => null),
      getCategoriesAndTypes().catch(() => null),
    ]);
    if (productsResult !== null) products = productsResult;
    else dbError = true;
    if (catTypesResult !== null) {
      categories = catTypesResult.categories;
      types = catTypesResult.types;
    } else dbError = true;
  } catch {
    dbError = true;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {dbError && <DbErrorBanner />}
      <aside className="lg:w-64 shrink-0">
        <ShopFilters categories={categories} types={types} currentParams={params} />
      </aside>
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 8} />
          ))}
        </div>
        {products.length === 0 && !dbError && (
          <p className="text-center text-silver-500 dark:text-silver-400 py-12">لا توجد منتجات تطابق البحث.</p>
        )}
      </div>
    </div>
  );
}
