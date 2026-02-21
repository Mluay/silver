import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(ar: string): string {
  return ar
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .toLowerCase() || "item";
}

// صور احترافية من Unsplash للمجوهرات الفضية والدايموند (استخدام w=800 للجودة)
const IMAGES = {
  ringSilver: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=85",
  ringDiamond: "https://images.unsplash.com/photo-1603561586110-d6b64d0f3a2d?w=800&q=85",
  ringWomen: "https://images.unsplash.com/photo-1600428853194-7a26d3c57334?w=800&q=85",
  necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85",
  necklaceSilver: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85",
  bracelet: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=85",
  braceletSilver: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=85",
  chain: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=85",
  earrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85",
  set: "https://images.unsplash.com/photo-1569588539081-7384510e64b3?w=800&q=85",
  pendant: "https://images.unsplash.com/photo-1573408301185-6d9970e9a6e2?w=800&q=85",
  menRing: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=85",
  diamondSet: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85",
};

async function main() {
  // ترتيب الحذف حسب الاعتماديات (تفادي أخطاء المفتاح الخارجي)
  await prisma.orderItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});

  // التصنيفات
  const categoriesData = [
    { nameAr: "رجال", slug: "men", sortOrder: 0 },
    { nameAr: "نساء", slug: "women", sortOrder: 1 },
    { nameAr: "خواتم", slug: "rings", sortOrder: 2 },
    { nameAr: "سلاسل وقلائد", slug: "necklaces", sortOrder: 3 },
    { nameAr: "أساور", slug: "bracelets", sortOrder: 4 },
    { nameAr: "مجوهرات بحجارة", slug: "stones", sortOrder: 5 },
    { nameAr: "دايموند وماس", slug: "diamond", sortOrder: 6 },
    { nameAr: "إكسسوارات فضية", slug: "chains", sortOrder: 7 },
  ];

  const categoryIds: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      create: { nameAr: c.nameAr, slug: c.slug, sortOrder: c.sortOrder },
      update: { sortOrder: c.sortOrder },
    });
    categoryIds[c.slug] = cat.id;
  }

  // الأنواع
  const typesData = [
    { nameAr: "خاتم", slug: "ring", sortOrder: 0 },
    { nameAr: "عقد", slug: "necklace", sortOrder: 1 },
    { nameAr: "سوار", slug: "bracelet", sortOrder: 2 },
    { nameAr: "سلسلة", slug: "chain", sortOrder: 3 },
    { nameAr: "إكسسوار", slug: "accessory", sortOrder: 4 },
    { nameAr: "حلق", slug: "earrings", sortOrder: 5 },
    { nameAr: "دبوس", slug: "pendant", sortOrder: 6 },
  ];

  const typeIds: Record<string, string> = {};
  for (const t of typesData) {
    const typ = await prisma.type.upsert({
      where: { slug: t.slug },
      create: { nameAr: t.nameAr, slug: t.slug, sortOrder: t.sortOrder },
      update: { sortOrder: t.sortOrder },
    });
    typeIds[t.slug] = typ.id;
  }

  // المنتجات: فضة + داياموند، أسماء ووصف عربي احترافي
  const productsData: Array<{
    nameAr: string;
    shortDescAr: string;
    descriptionAr: string;
    weightGrams: number;
    priceIqd: number;
    categorySlug: string;
    typeSlug: string;
    gender: "men" | "women";
    stoneType?: string;
    silverPurity?: string;
    isFeatured: boolean;
    imageUrl: string;
  }> = [
    {
      nameAr: "خاتم فضة رجالي كلاسيك",
      shortDescAr: "خاتم فضة عيار 925 للرجال بتصميم أنيق.",
      descriptionAr: "خاتم من الفضة الإسترلينية عيار 925، صناعة يدوية في بغداد. مناسب للاستخدام اليومي والمناسبات. الوزن مضبوط والجودة مضمونة.",
      weightGrams: 8.5,
      priceIqd: 185000,
      categorySlug: "men",
      typeSlug: "ring",
      gender: "men",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.menRing,
    },
    {
      nameAr: "خاتم خطوبة داياموند",
      shortDescAr: "خاتم خطوبة بفص داياموند طبيعي وإطار فضة.",
      descriptionAr: "خاتم خطوبة أنيق بفص داياموند طبيعي وإطار من الفضة عيار 925. قطعة فاخرة تناسب يوم الخطوبة والحياة.",
      weightGrams: 3.2,
      priceIqd: 450000,
      categorySlug: "diamond",
      typeSlug: "ring",
      gender: "women",
      stoneType: "دايموند",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.ringDiamond,
    },
    {
      nameAr: "عقد فضة نسائي مع pendant",
      shortDescAr: "عقد فضة مع قلادة أنيقة للنساء.",
      descriptionAr: "عقد من الفضة الإسترلينية مع قلادة متحركة. تصميم عصري يناسب السهرات والمناسبات. نقاء الفضة 925.",
      weightGrams: 12,
      priceIqd: 220000,
      categorySlug: "women",
      typeSlug: "necklace",
      gender: "women",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.necklace,
    },
    {
      nameAr: "سوار فضة نسائي راقي",
      shortDescAr: "سوار فضة عيار 925 بتصميم بسيط وأنثوي.",
      descriptionAr: "سوار من الفضة عيار 925، خفيف ومريح. مثالي للارتداء اليومي أو مع الإكسسوارات الأخرى.",
      weightGrams: 15.5,
      priceIqd: 165000,
      categorySlug: "women",
      typeSlug: "bracelet",
      gender: "women",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.bracelet,
    },
    {
      nameAr: "سلسلة فضة رجالية",
      shortDescAr: "سلسلة فضة قوية للرجال بتصميم عصري.",
      descriptionAr: "سلسلة من الفضة الإسترلينية عيار 925، سمك مناسب للرجال. متانة عالية ومظهر أنيق.",
      weightGrams: 22,
      priceIqd: 280000,
      categorySlug: "men",
      typeSlug: "chain",
      gender: "men",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.chain,
    },
    {
      nameAr: "خاتم فضة نسائي بحجر فيروزي",
      shortDescAr: "خاتم فضة مع حجر فيروزي طبيعي.",
      descriptionAr: "خاتم فضة عيار 925 مرصع بحجر فيروزي طبيعي. ألوان مميزة وجودة عالية في الصناعة.",
      weightGrams: 6.8,
      priceIqd: 195000,
      categorySlug: "stones",
      typeSlug: "ring",
      gender: "women",
      stoneType: "فيروزي",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.ringWomen,
    },
    {
      nameAr: "عقد داياموند وفضة",
      shortDescAr: "عقد أنيق بقطع داياموند وفضة عيار 925.",
      descriptionAr: "عقد فاخر يجمع بين الفضة الإسترلينية وقطع الداياموند. مثالي للمناسبات والسهرات.",
      weightGrams: 8.5,
      priceIqd: 520000,
      categorySlug: "diamond",
      typeSlug: "necklace",
      gender: "women",
      stoneType: "دايموند",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.necklaceSilver,
    },
    {
      nameAr: "سوار فضة رجالي",
      shortDescAr: "سوار فضة عيار 925 للرجال بتصميم قوي.",
      descriptionAr: "سوار فضة إسترلينية للرجال، سميك ومتين. يناسب الاستخدام اليومي والرياضي.",
      weightGrams: 28,
      priceIqd: 310000,
      categorySlug: "men",
      typeSlug: "bracelet",
      gender: "men",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.braceletSilver,
    },
    {
      nameAr: "حلق فضة نسائي كلاسيك",
      shortDescAr: "حلقان فضة عيار 925 بتصميم دائري أنيق.",
      descriptionAr: "حلقان من الفضة الإسترلينية، خفيفان ومريحان. يناسبان كل الإطلالات.",
      weightGrams: 4.2,
      priceIqd: 95000,
      categorySlug: "women",
      typeSlug: "earrings",
      gender: "women",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.earrings,
    },
    {
      nameAr: "دبوس صدر فضة ودايموند",
      shortDescAr: "دبوس صدر بلمسة داياموند وفضة.",
      descriptionAr: "دبوس صدر أنيق من الفضة مع لمسات داياموند. مثالي للبدلات والمناسبات الرسمية.",
      weightGrams: 5.5,
      priceIqd: 380000,
      categorySlug: "diamond",
      typeSlug: "pendant",
      gender: "men",
      stoneType: "دايموند",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.pendant,
    },
    {
      nameAr: "خاتم فضة نسائي بسيط",
      shortDescAr: "خاتم فضة عيار 925 بتصميم minimal.",
      descriptionAr: "خاتم فضة إسترلينية بسيط وأنيق. يناسب الارتداء اليومي أو مع خواتم أخرى.",
      weightGrams: 4.5,
      priceIqd: 125000,
      categorySlug: "women",
      typeSlug: "ring",
      gender: "women",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.ringSilver,
    },
    {
      nameAr: "طقم فضة (عقد + سوار + خاتم)",
      shortDescAr: "طقم كامل من الفضة للنساء.",
      descriptionAr: "طقم أنيق يتضمن عقد وسوار وخاتم من الفضة عيار 925. تصميم متناسق للعروس أو المناسبات.",
      weightGrams: 35,
      priceIqd: 580000,
      categorySlug: "women",
      typeSlug: "accessory",
      gender: "women",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.set,
    },
    {
      nameAr: "سلسلة فضة نسائية رفيعة",
      shortDescAr: "سلسلة فضة رفيعة مع قلادة صغيرة.",
      descriptionAr: "سلسلة فضة عيار 925 رفيعة وأنيقة مع قلادة صغيرة. مريحة للارتداء اليومي.",
      weightGrams: 6,
      priceIqd: 145000,
      categorySlug: "women",
      typeSlug: "chain",
      gender: "women",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.chain,
    },
    {
      nameAr: "خاتم داياموند رجالي",
      shortDescAr: "خاتم فضة رجالي بلمسة داياموند.",
      descriptionAr: "خاتم فضة عيار 925 للرجال مع لمسة داياموند. أنيق ومناسب للعمل والمناسبات.",
      weightGrams: 10,
      priceIqd: 420000,
      categorySlug: "diamond",
      typeSlug: "ring",
      gender: "men",
      stoneType: "دايموند",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.ringDiamond,
    },
    {
      nameAr: "عقد فضة بحجر العقيق",
      shortDescAr: "عقد فضة مع حجر عقيق طبيعي.",
      descriptionAr: "عقد فضة عيار 925 مع حجر عقيق طبيعي. ألوان دافئة وجودة عالية.",
      weightGrams: 14,
      priceIqd: 265000,
      categorySlug: "stones",
      typeSlug: "necklace",
      gender: "women",
      stoneType: "عقيق",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.pendant,
    },
    {
      nameAr: "سوار فضة بحجر اللازورد",
      shortDescAr: "سوار فضة مع حجر لازورد أزرق.",
      descriptionAr: "سوار فضة إسترلينية مرصع بحجر لازورد طبيعي. لون أزرق مميز وأناقة فريدة.",
      weightGrams: 18,
      priceIqd: 245000,
      categorySlug: "stones",
      typeSlug: "bracelet",
      gender: "women",
      stoneType: "لازورد",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.bracelet,
    },
    {
      nameAr: "خاتم خطوبة داياموند كلاسيك",
      shortDescAr: "خاتم خطوبة داياموند بتصميم كلاسيكي أزرق.",
      descriptionAr: "خاتم خطوبة بتصميم كلاسيكي، فص داياموند وإطار فضة عيار 925. قطعة تبقى مدى الحياة.",
      weightGrams: 3.8,
      priceIqd: 495000,
      categorySlug: "diamond",
      typeSlug: "ring",
      gender: "women",
      stoneType: "دايموند",
      silverPurity: "925",
      isFeatured: true,
      imageUrl: IMAGES.ringDiamond,
    },
    {
      nameAr: "عقد فضة رجالي",
      shortDescAr: "عقد فضة عيار 925 للرجال.",
      descriptionAr: "عقد فضة إسترلينية للرجال، طول مناسب وربط متين. مظهر أنيق وعصري.",
      weightGrams: 16,
      priceIqd: 198000,
      categorySlug: "men",
      typeSlug: "necklace",
      gender: "men",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.chain,
    },
    {
      nameAr: "حلق داياموند وفضة",
      shortDescAr: "حلقان بلمسة داياموند وفضة 925.",
      descriptionAr: "حلقان من الفضة عيار 925 مع لمسات داياموند. خفيفان وفاخران للمناسبات.",
      weightGrams: 3.5,
      priceIqd: 355000,
      categorySlug: "diamond",
      typeSlug: "earrings",
      gender: "women",
      stoneType: "دايموند",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.earrings,
    },
    {
      nameAr: "سلسلة فضة مع صليب",
      shortDescAr: "سلسلة فضة مع قلادة صليب أنيقة.",
      descriptionAr: "سلسلة فضة عيار 925 مع قلادة صليب. تصميم راقٍ ومناسب للهدايا والاستخدام الشخصي.",
      weightGrams: 9,
      priceIqd: 175000,
      categorySlug: "chains",
      typeSlug: "chain",
      gender: "women",
      silverPurity: "925",
      isFeatured: false,
      imageUrl: IMAGES.pendant,
    },
  ];

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const baseSlug = slugify(p.nameAr);
    const slug = `${baseSlug}-${Date.now()}-${i}`;
    const product = await prisma.product.create({
      data: {
        nameAr: p.nameAr,
        slug,
        shortDescAr: p.shortDescAr,
        descriptionAr: p.descriptionAr,
        weightGrams: p.weightGrams,
        priceIqd: p.priceIqd,
        categoryId: categoryIds[p.categorySlug],
        typeId: typeIds[p.typeSlug],
        gender: p.gender,
        stoneType: p.stoneType ?? null,
        silverPurity: p.silverPurity ?? null,
        isActive: true,
        isFeatured: p.isFeatured,
        sortOrder: i,
      },
    });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: p.imageUrl,
        sortOrder: 0,
        isPrimary: true,
      },
    });
  }

  console.log("Seed completed: categories, types, and", productsData.length, "products with images.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
