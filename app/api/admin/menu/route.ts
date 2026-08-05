import { NextResponse } from "next/server";
import { getMenuItems, createMenuItem } from "@/lib/menuStore";
import { mapAdminFormToMenuItem } from "@/lib/adminMenuMapping";
import { adminMenuItemSchema } from "@/utils/validation";

export async function GET() {
  const items = await getMenuItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = adminMenuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const item = await createMenuItem(mapAdminFormToMenuItem(parsed.data));
  return NextResponse.json({ item }, { status: 201 });
}
