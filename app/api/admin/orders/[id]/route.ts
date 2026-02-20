import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["new", "confirmed", "completed", "cancelled"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status } = schema.parse(body);
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.flatten(), { status: 400 });
    }
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}
