import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { slugify } from "@/utils/slugify";

const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл слишком большой (максимум 8 МБ)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let resized: Buffer;
  try {
    resized = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Не удалось обработать изображение. Используйте JPG, PNG или WEBP." },
      { status: 400 },
    );
  }

  const baseName = file.name.replace(/\.[^./]+$/, "") || "photo";
  const filename = `${slugify(baseName)}-${Date.now()}.webp`;

  // Uploaded images are stored in Vercel Blob (public access) instead of the
  // local filesystem, since the project directory is read-only on Vercel's
  // serverless runtime and would not persist across deployments/cold starts.
  const blob = await put(`uploads/${filename}`, resized, {
    access: "public",
    contentType: "image/webp",
  });

  return NextResponse.json({ path: blob.url }, { status: 201 });
}
