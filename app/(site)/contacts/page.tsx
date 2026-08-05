import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactsBlock } from "@/components/contacts/ContactsBlock";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты пиццерии ITMINOT: адрес, телефон, WhatsApp, Instagram, часы работы и карта проезда.",
};

export default function ContactsPage() {
  return (
    <>
      <PageHero
        kicker="Контакты"
        title="Мы всегда рады вам"
        subtitle="Заезжайте в гости, звоните или пишите — расскажем об акциях и поможем с выбором пиццы."
        image="/images/interior/exterior-night.webp"
      />
      <ContactsBlock showHeading={false} />
    </>
  );
}
