/**
 * Простая беспарольная сессия администратора на основе фиксированного токена.
 * Подходит для внутреннего инструмента одного администратора.
 * Пароль задаётся переменной окружения ADMIN_PASSWORD (см. .env.local.example).
 */
export const ADMIN_COOKIE_NAME = "itminot_admin_session";
const SALT = "itminot-admin-salt-v1";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "itminot-admin-2026";
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(password: string): Promise<string> {
  return sha256Hex(`${SALT}:${password}`);
}

export async function isValidPassword(password: string): Promise<boolean> {
  return password === getAdminPassword();
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken(getAdminPassword());
  return token === expected;
}
