import { NextResponse } from "next/server";
import { addBooking } from "@/lib/bookingStore";
import { bookingSchema } from "@/utils/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const record = await addBooking({
    name: parsed.data.name,
    phone: parsed.data.phone,
    date: parsed.data.date,
    time: parsed.data.time,
    guests: Number(parsed.data.guests),
    zone: parsed.data.zone,
    wishes: parsed.data.wishes,
  });
  return NextResponse.json({ booking: record }, { status: 201 });
}
