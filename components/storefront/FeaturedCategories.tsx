import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 8,
  });
  return categories;
}

const fallbackCategories = [
  { slug: "men", nameAr: "رجال" },
  { slug: "women", nameAr: "نساء" },
  { slug: "rings", nameAr: "خواتم" },
  { slug: "necklaces", nameAr: "سلاسل" },
  { slug: "bracelets", nameAr: "أساور" },
  { slug: "stones", nameAr: "مجوهرات بحجارة" },
];

export async function FeaturedCategories() {
  const categories = await getCategories().catch(() => []);
  const list = categories.length > 0 ? categories : fallbackCategories.map((c) => ({ ...c, id: c.slug, isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() }));

  return (
    <section className="border-b border-silver-200 dark:border-silver-800 bg-silver-50 dark:bg-[#1a1a1d] py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-6 text-center">
          التصنيفات
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {list.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group rounded-lg border border-silver-200 dark:border-silver-700 bg-white dark:bg-[#252528] p-4 text-center transition-all hover:border-accent dark:hover:border-accent-light hover:shadow-md"
            >
              <span className="font-medium text-silver-900 dark:text-silver-100 group-hover:text-accent dark:group-hover:text-accent-light">
                {cat.nameAr}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
