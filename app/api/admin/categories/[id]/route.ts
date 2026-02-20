import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nameAr: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const update: { nameAr?: string; slug?: string; isActive?: boolean } = {};
    if (data.nameAr !== undefined) {
      update.nameAr = data.nameAr.trim();
      update.slug = data.nameAr.trim().replace(/\s+/g, "-").toLowerCase() || id;
    }
    if (data.isActive !== undefined) update.isActive = data.isActive;
    await prisma.category.update({ where: { id }, data: update });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.flatten(), { status: 400 });
    }
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
