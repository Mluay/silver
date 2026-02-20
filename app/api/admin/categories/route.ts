import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ nameAr: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nameAr } = schema.parse(body);
    const slug = nameAr.trim().replace(/\s+/g, "-").toLowerCase() || "cat";
    const existing = await prisma.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    await prisma.category.create({
      data: { nameAr: nameAr.trim(), slug: finalSlug },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(err.flatten(), { status: 400 });
    }
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
