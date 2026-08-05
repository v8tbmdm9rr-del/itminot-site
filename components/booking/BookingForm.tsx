"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { bookingSchema, type BookingSchema } from "@/utils/validation";
import { BOOKING_HOURS } from "@/config/restaurant";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/config/whatsapp";
import { buildBookingMessage } from "@/utils/whatsappMessage";
import { Button } from "@/components/ui/Button";
import type { BookingFormValues } from "@/types/order";

const inputClasses =
  "w-full rounded-xl border border-cream/15 bg-charcoal-soft px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold";
const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/60";
const errorClasses = "mt-1.5 text-xs text-ember";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function BookingForm() {
  const [submitted, setSubmitted] = useState<{ message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: "2",
      zone: "main-hall",
    },
  });

  async function onSubmit(data: BookingSchema) {
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Бронь всё равно уйдёт в WhatsApp, даже если запись в систему не удалась.
    }

    const [year, month, day] = data.date.split("-");
    const values: BookingFormValues = {
      ...data,
      guests: Number(data.guests),
      date: `${day}.${month}.${year}`,
    };
    const message = buildBookingMessage(values);
    window.open(buildWhatsAppLink(message, WHATSAPP_NUMBER), "_blank", "noopener,noreferrer");
    setSubmitted({ message });
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl border border-gold/30 bg-charcoal-soft p-8 text-center sm:p-12"
      >
        <CheckCircle2 size={44} className="text-gold" aria-hidden />
        <h2 className="font-display text-3xl text-cream">Заявка на бронирование готова</h2>
        <p className="text-cream/70">
          Мы открыли WhatsApp с готовой заявкой. Нажмите «Отправить», чтобы администратор её увидел.
        </p>
        <p className="rounded-lg bg-gold/10 px-4 py-2 text-sm text-gold">
          Бронирование считается подтверждённым после ответа администратора.
        </p>
        <a
          href={buildWhatsAppLink(submitted.message, WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-olive px-6 py-3 text-sm font-semibold text-cream hover:bg-olive-soft"
        >
          <MessageCircle size={18} aria-hidden /> Открыть WhatsApp ещё раз
        </a>
        <Button variant="outline" onClick={() => setSubmitted(null)}>
          Забронировать ещё один столик
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="b-name">Имя</label>
          <input id="b-name" className={inputClasses} placeholder="Ваше имя" {...register("name")} />
          {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClasses} htmlFor="b-phone">Телефон</label>
          <input id="b-phone" className={inputClasses} placeholder="+7 999 999-99-99" {...register("phone")} />
          {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClasses} htmlFor="b-date">Дата</label>
          <input id="b-date" type="date" min={today()} className={inputClasses} {...register("date")} />
          {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
        </div>
        <div>
          <label className={labelClasses} htmlFor="b-time">Время</label>
          <input
            id="b-time"
            type="time"
            min={`${String(BOOKING_HOURS.openHour).padStart(2, "0")}:00`}
            max={`${String(BOOKING_HOURS.closeHour).padStart(2, "0")}:00`}
            className={inputClasses}
            {...register("time")}
          />
          {errors.time && <p className={errorClasses}>{errors.time.message}</p>}
        </div>
        <div>
          <label className={labelClasses} htmlFor="b-guests">Количество гостей</label>
          <input
            id="b-guests"
            type="number"
            min={1}
            max={30}
            className={inputClasses}
            {...register("guests")}
          />
          {errors.guests && <p className={errorClasses}>{errors.guests.message}</p>}
        </div>
      </div>

      <input type="hidden" value="main-hall" {...register("zone")} />

      <div>
        <label className={labelClasses} htmlFor="b-wishes">Пожелания</label>
        <textarea
          id="b-wishes"
          rows={3}
          className={inputClasses}
          placeholder="Например: столик подальше от входа"
          {...register("wishes")}
        />
        {errors.wishes && <p className={errorClasses}>{errors.wishes.message}</p>}
      </div>

      <p className="text-xs text-cream/50">
        Бронирование считается подтверждённым после ответа администратора.
      </p>

      <Button type="submit" size="lg" className="w-full">
        Забронировать столик
      </Button>
    </form>
  );
}
