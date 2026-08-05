import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { RESTAURANT } from "@/config/restaurant";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/config/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-charcoal-soft pb-28 pt-16 lg:pb-16">
      <Container className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="neon-text font-display text-3xl">ITMINOT</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/60">
            Неаполитанская пиццерия: тесто длительной ферментации, настоящая дровяная печь
            и итальянские ингредиенты.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Навигация
          </p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/menu" className="hover:text-cream">Меню</Link></li>
            <li><Link href="/#about" className="hover:text-cream">О нас</Link></li>
            <li><Link href="/booking" className="hover:text-cream">Бронирование</Link></li>
            <li><Link href="/delivery" className="hover:text-cream">Доставка</Link></li>
            <li><Link href="/contacts" className="hover:text-cream">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Контакты
          </p>
          <ul className="space-y-3 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />
              {RESTAURANT.address}
            </li>
            <li>
              <a href={RESTAURANT.phoneLink} className="flex items-center gap-2 hover:text-cream">
                <Phone size={16} aria-hidden /> {RESTAURANT.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={buildWhatsAppLink("Здравствуйте! Хочу задать вопрос по пиццерии ITMINOT.", WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cream"
              >
                <MessageCircle size={16} aria-hidden /> Написать в WhatsApp
              </a>
            </li>
            <li>
              <a
                href={RESTAURANT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cream"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Часы работы
          </p>
          <ul className="space-y-2 text-sm text-cream/70">
            {RESTAURANT.workingHours.map((row) => (
              <li key={row.days} className="flex justify-between gap-4">
                <span>{row.days}</span>
                <span className="text-cream/90">{row.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-12 border-t border-cream/10 pt-6">
        <p className="text-center text-xs text-cream/40">
          © {new Date().getFullYear()} ITMINOT. Все права защищены.
        </p>
      </Container>
    </footer>
  );
}
