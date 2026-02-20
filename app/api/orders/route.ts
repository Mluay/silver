import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const orderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  address: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      priceIqd: z.number(),
      quantity: z.number().min(1),
      weightGrams: z.number(),
    })
  ).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = orderSchema.parse(body);
    const totalIqd = data.items.reduce(
      (s, i) => s + i.priceIqd * i.quantity,
      0
    );
    const totalWeightGrams = data.items.reduce(
      (s, i) => s + i.weightGrams * i.quantity,
      0
    );
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        notes: data.notes,
        totalIqd,
        totalWeightGrams,
        status: "new",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            priceIqd: item.priceIqd,
            quantity: item.quantity,
            weightGrams: item.weightGrams,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "فشل إنشاء الطلب" },
      { status: 500 }
    );
  }
}
