import "server-only";
import { sql } from "@/lib/db";
import type { BookingFormValues, BookingRecord } from "@/types/order";

// Bookings are persisted in Postgres (Neon) instead of a local JSON file so
// that they survive redeploys and cold starts on serverless hosting.

let schemaReady: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export async function getBookings(): Promise<BookingRecord[]> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM bookings ORDER BY created_at DESC`;
  return rows.map((row) => row.data as BookingRecord);
}

export async function addBooking(input: BookingFormValues): Promise<BookingRecord> {
  await ensureSchema();
  const record: BookingRecord = {
    ...input,
    id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  await sql`
    INSERT INTO bookings (id, data, created_at)
    VALUES (${record.id}, ${JSON.stringify(record)}, ${record.createdAt})
  `;
  return record;
}
