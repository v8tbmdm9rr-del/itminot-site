import { NextResponse } from "next/server";
import { updateMenuItem, deleteMenuItem } from "@/lib/menuStore";
import { mapAdminFormToMenuItem } from "@/lib/adminMenuMapping";
import { adminMenuItemSchema } from "@/utils/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = adminMenuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await updateMenuItem(id, mapAdminFormToMenuItem(parsed.data));
  if (!updated) {
    return NextResponse.json({ error: "Блюдо не найдено" }, { status: 404 });
  }
  return NextResponse.json({ item: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteMenuItem(id);
  if (!deleted) {
    return NextResponse.json({ error: "Блюдо не найдено" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
