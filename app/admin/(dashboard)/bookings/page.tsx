import { CalendarCheck2, Phone, Users } from "lucide-react";
import { getBookings } from "@/lib/bookingStore";
import { BOOKING_ZONES } from "@/config/restaurant";

export const dynamic = "force-dynamic";

function zoneLabel(zoneId: string): string {
  return BOOKING_ZONES.find((z) => z.id === zoneId)?.label ?? zoneId;
}

function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <CalendarCheck2 className="text-gold" size={22} aria-hidden />
        <h1 className="font-display text-2xl text-cream">Бронирования столиков</h1>
        <span className="rounded-full bg-cream/10 px-3 py-1 text-xs text-cream/60">{bookings.length}</span>
      </div>

      {bookings.length === 0 ? (
        <p className="py-16 text-center text-cream/50">Пока нет ни одной заявки на бронирование.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid gap-4 rounded-2xl border border-cream/10 bg-charcoal-soft p-5 sm:grid-cols-[1.3fr_1fr_1fr_1.2fr]"
            >
              <div>
                <p className="font-display text-lg text-cream">{booking.name}</p>
                <a href={`tel:${booking.phone}`} className="mt-1 flex items-center gap-1.5 text-sm text-cream/60 hover:text-gold">
                  <Phone size={13} aria-hidden /> {booking.phone}
                </a>
              </div>
              <div className="text-sm text-cream/75">
                <p>{booking.date}</p>
                <p className="text-cream/50">{booking.time}</p>
              </div>
              <div className="flex items-start gap-1.5 text-sm text-cream/75">
                <Users size={14} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  {booking.guests} гостей
                  <br />
                  <span className="text-cream/50">{zoneLabel(booking.zone)}</span>
                </span>
              </div>
              <div className="text-sm text-cream/60">
                {booking.wishes && <p className="italic">«{booking.wishes}»</p>}
                <p className="mt-1 text-xs text-cream/35">Заявка от {formatCreatedAt(booking.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
