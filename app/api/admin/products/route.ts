import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  nameAr: z.string().min(1),
  shortDescAr: z.string().optional(),
  descriptionAr: z.string().optional(),
  weightGrams: z.number(),
  priceIqd: z.number(),
  categoryId: z.string(),
  typeId: z.string(),
  gender: z.enum(["men", "women"]),
  stoneType: z.string().optional(),
  silverPurity: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

function slugify(ar: string): string {
  return ar
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .toLowerCase() || "product";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    let slug = slugify(data.nameAr);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;
    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        shortDescAr: data.shortDescAr ?? null,
        descriptionAr: data.descriptionAr ?? null,
        stoneType: data.stoneType || null,
        silverPurity: data.silverPurity || null,
      },
    });
    return NextResponse.json({ id: product.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.flatten(), { status: 400 });
    }
    return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
  }
}
