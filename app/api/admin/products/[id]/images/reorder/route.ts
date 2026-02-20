import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const body = await req.json();
  const { order } = body as { order: string[] };
  if (!Array.isArray(order) || order.length === 0) {
    return NextResponse.json({ error: "ترتيب غير صالح" }, { status: 400 });
  }
  await Promise.all(
    order.map((imageId, index) =>
      prisma.productImage.updateMany({
        where: { id: imageId, productId },
        data: { sortOrder: index },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
