import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionToken, isValidPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = await createSessionToken(password);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
