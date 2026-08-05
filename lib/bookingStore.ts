import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { BookingFormValues, BookingRecord } from "@/types/order";

const CONTENT_DIR = path.join(process.cwd(), "content");
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
