import "server-only";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { BookingFormValues, BookingRecord } from "@/types/order";

// On Vercel (and other serverless/read-only deployments) the project
// directory is not writable, so we fall back to the OS temp directory.
// Note: this means bookings will not persist across deployments/cold
// starts in that environment.
const CONTENT_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "itminot-content")
  : path.join(process.cwd(), "content");
const BOOKINGS_FILE = path.join(CONTENT_DIR, "bookings.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<BookingRecord[]> {
  await ensureFile();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf-8");
  return JSON.parse(raw) as BookingRecord[];
}

async function writeAll(bookings: BookingRecord[]): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

export async function getBookings(): Promise<BookingRecord[]> {
  const bookings = await readAll();
  return bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addBooking(input: BookingFormValues): Promise<BookingRecord> {
  const bookings = await readAll();
  const record: BookingRecord = {
    ...input,
    id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  bookings.push(record);
  await writeAll(bookings);
  return record;
}
