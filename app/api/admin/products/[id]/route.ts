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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        shortDescAr: data.shortDescAr ?? null,
        descriptionAr: data.descriptionAr ?? null,
        stoneType: data.stoneType || null,
        silverPurity: data.silverPurity || null,
      },
    });
    return NextResponse.json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.flatten(), { status: 400 });
    }
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
