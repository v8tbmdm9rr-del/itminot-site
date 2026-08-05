import "server-only";
import { sql } from "@/lib/db";
import type { MenuItem } from "@/types/menu";
import { MENU as SEED_MENU } from "@/data/menu";
import { slugify } from "@/utils/slugify";

// Data is persisted in Postgres (Neon) so that changes made in the admin
// panel survive redeploys and cold starts. Each row stores the full
// MenuItem as JSONB, keyed by id, which keeps this close to the previous
// file-based storage shape while giving us real persistence.

let schemaReady: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS menu_items (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL
        )
      `;

      const rows = await sql`SELECT COUNT(*)::int AS count FROM menu_items`;
      const count = (rows[0] as { count: number }).count;

      if (count === 0) {
        for (const item of SEED_MENU) {
          await sql`
            INSERT INTO menu_items (id, data)
            VALUES (${item.id}, ${JSON.stringify(item)})
            ON CONFLICT (id) DO NOTHING
          `;
        }
      }
    })().catch((err) => {
      // Allow retrying on the next call instead of caching a rejected promise.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

async function readAll(): Promise<MenuItem[]> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM menu_items ORDER BY id`;
  return rows.map((row) => row.data as MenuItem);
}

export async function getMenuItems(): Promise<MenuItem[]> {
  return readAll();
}

export async function getMenuItemById(id: string): Promise<MenuItem | undefined> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM menu_items WHERE id = ${id}`;
  return (rows[0]?.data as MenuItem | undefined) ?? undefined;
}

export type NewMenuItemInput = Omit<MenuItem, "id" | "slug">;

export async function createMenuItem(input: NewMenuItemInput): Promise<MenuItem> {
  await ensureSchema();
  const slug = slugify(input.name);
  const newItem: MenuItem = { ...input, id: slug, slug };
  await sql`
    INSERT INTO menu_items (id, data)
    VALUES (${newItem.id}, ${JSON.stringify(newItem)})
  `;
  return newItem;
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Omit<MenuItem, "id">>,
): Promise<MenuItem | null> {
  await ensureSchema();
  const existing = await getMenuItemById(id);
  if (!existing) return null;
  const updated: MenuItem = { ...existing, ...patch };
  await sql`
    UPDATE menu_items SET data = ${JSON.stringify(updated)} WHERE id = ${id}
  `;
  return updated;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await ensureSchema();
  const existing = await getMenuItemById(id);
  if (!existing) return false;
  await sql`DELETE FROM menu_items WHERE id = ${id}`;
  return true;
}
