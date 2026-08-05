import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { RESTAURANT } from "@/config/restaurant";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/config/whatsapp";

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${RESTAURANT.coordinates.lat},${RESTAURANT.coordinates.lng}`;

export function ContactsBlock({ id, showHeading = true }: { id?: string; showHeading?: boolean }) {
  return (
    <section id={id} className="bg-charcoal-soft py-24 sm:py-32">
      <Container>
        {showHeading && (
          <SectionHeading kicker="Контакты" title="Найти и связаться с нами" className="mb-12" />
        )}

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 shrink-0 text-gold" size={22} aria-hidden />
              <div>
                <p className="text-sm uppercase tracking-wide text-cream/45">Адрес</p>
                <p className="mt-1 text-lg text-cream">{RESTAURANT.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="mt-1 shrink-0 text-gold" size={22} aria-hidden />
              <div>
                <p className="text-sm uppercase tracking-wide text-cream/45">Часы работы</p>
                {RESTAURANT.workingHours.map((row) => (
                  <p key={row.days} className="mt-1 text-lg text-cream">
                    {row.days}: {row.hours}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 shrink-0 text-gold" size={22} aria-hidden />
              <div>
                <p className="text-sm uppercase tracking-wide text-cream/45">Телефон</p>
                <a href={RESTAURANT.phoneLink} className="mt-1 block text-lg text-cream hover:text-gold">
                  {RESTAURANT.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={RESTAURANT.phoneLink}
                className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm text-cream hover:bg-cream/20"
              >
                <Phone size={16} aria-hidden /> Позвонить
              </a>
              <a
                href={buildWhatsAppLink("Здравствуйте! Хочу задать вопрос по пиццерии ITMINOT.", WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-olive/60 px-5 py-3 text-sm text-cream hover:bg-olive"
              >
                <MessageCircle size={16} aria-hidden /> WhatsApp
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm text-cream hover:bg-[#c94a24]"
              >
                <Navigation size={16} aria-hidden /> Построить маршрут
              </a>
              <a
                href={RESTAURANT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm text-cream hover:bg-cream/20"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-cream/10 shadow-2xl sm:aspect-video">
              <iframe
                src={RESTAURANT.mapEmbedUrl}
                title="Карта расположения ITMINOT"
                loading="lazy"
                className="h-full w-full grayscale-[15%]"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
