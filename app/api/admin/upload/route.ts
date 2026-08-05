import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { slugify } from "@/utils/slugify";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");
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

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const baseName = file.name.replace(/\.[^./]+$/, "") || "photo";
  const filename = `${slugify(baseName)}.webp`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), resized);

  return NextResponse.json({ path: `/images/uploads/${filename}` }, { status: 201 });
}
