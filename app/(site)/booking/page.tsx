import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Бронирование столика",
  description:
    "Забронируйте столик в пиццерии ITMINOT: выберите зону, дату, время и количество гостей. Подтверждение брони — в WhatsApp.",
};

export default function BookingPage() {
  return (
    <>
      <PageHero
        kicker="Бронирование"
        title="Забронируйте столик"
        subtitle="Основной зал, место у самой печи, тихая зона или летняя веранда — выбирайте атмосферу для своего вечера."
        image="/images/interior/atmosphere-2.webp"
      />
      <Container className="py-16">
        <BookingForm />
      </Container>
    </>
  );
}
