import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { STORAGE_BUCKET } from "@/lib/constants";

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const productId = formData.get("productId") as string | null;
  if (!file || !productId) {
    return NextResponse.json({ error: "ملف ومعرف المنتج مطلوبان" }, { status: 400 });
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buf, { contentType: file.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  const maxOrder = await prisma.productImage
    .aggregate({ where: { productId }, _max: { sortOrder: true } })
    .then((r) => (r._max.sortOrder ?? -1) + 1);
  const image = await prisma.productImage.create({
    data: {
      productId,
      url: urlData.publicUrl,
      storagePath: path,
      sortOrder: maxOrder,
      isPrimary: maxOrder === 0,
    },
  });
  return NextResponse.json({ image });
}
