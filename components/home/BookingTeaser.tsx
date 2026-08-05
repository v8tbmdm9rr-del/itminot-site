import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Reveal";

export function BookingTeaser() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      <div className="absolute inset-0">
        <Image
          src="/images/interior/atmosphere-2.webp"
          alt="Столики пиццерии ITMINOT в тёплом свете"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      </div>

      <Container className="relative">
        <Reveal className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Бронирование
          </p>
          <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
            Столик у самой печи или тихий уголок для двоих
          </h2>
          <p className="mt-5 text-base leading-relaxed text-cream/70">
            Забронируйте столик заранее — выберите зону, время и количество гостей.
            Мы подтвердим бронь в WhatsApp в течение нескольких минут.
          </p>
          <div className="mt-8">
            <LinkButton href="/booking" size="lg">
              Забронировать столик
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
