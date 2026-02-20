import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const body = await req.json();
  const { imageId, isPrimary } = body;
  if (!imageId || !isPrimary) {
    return NextResponse.json({ error: "معطيات ناقصة" }, { status: 400 });
  }
  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    }),
    prisma.productImage.updateMany({
      where: { id: imageId, productId },
      data: { isPrimary: true },
    }),
  ]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("id");
  if (!imageId) {
    return NextResponse.json({ error: "معرف الصورة مطلوب" }, { status: 400 });
  }
  await prisma.productImage.deleteMany({
    where: { id: imageId, productId },
  });
  return NextResponse.json({ ok: true });
}
