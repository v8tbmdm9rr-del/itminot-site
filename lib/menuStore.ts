import "server-only";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { MenuItem } from "@/types/menu";
import { MENU as SEED_MENU } from "@/data/menu";
import { slugify } from "@/utils/slugify";

// On Vercel (and other serverless/read-only deployments) the project
// directory is not writable, so we fall back to the OS temp directory.
// Note: this means edits made via the admin panel will not persist
// across deployments/cold starts in that environment.
const CONTENT_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "itminot-content")
  : path.join(process.cwd(), "content");
const MENU_FILE = path.join(CONTENT_DIR, "menu.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  try {
    await fs.access(MENU_FILE);
  } catch {
    await fs.writeFile(MENU_FILE, JSON.stringify(SEED_MENU, null, 2), "utf-8");
  }
}

async function readAll(): Promise<MenuItem[]> {
  await ensureFile();
  const raw = await fs.readFile(MENU_FILE, "utf-8");
  return JSON.parse(raw) as MenuItem[];
}

async function writeAll(items: MenuItem[]): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(MENU_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function getMenuItems(): Promise<MenuItem[]> {
  return readAll();
}

export async function getMenuItemById(id: string): Promise<MenuItem | undefined> {
  const items = await readAll();
  return items.find((item) => item.id === id);
}

export type NewMenuItemInput = Omit<MenuItem, "id" | "slug">;

export async function createMenuItem(input: NewMenuItemInput): Promise<MenuItem> {
  const items = await readAll();
  const slug = slugify(input.name);
  const newItem: MenuItem = { ...input, id: slug, slug };
  items.push(newItem);
  await writeAll(items);
  return newItem;
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Omit<MenuItem, "id">>,
): Promise<MenuItem | null> {
  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated: MenuItem = { ...items[index], ...patch };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
