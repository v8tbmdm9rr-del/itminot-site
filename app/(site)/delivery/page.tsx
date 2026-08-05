import type { Metadata } from "next";
import { Clock, MapPinned, PackageCheck, ShoppingBag, Truck, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { DELIVERY_CONFIG } from "@/config/delivery";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Доставка и самовывоз",
  description:
    "Условия доставки пиццерии ITMINOT: зоны, стоимость, минимальная сумма заказа, бесплатная доставка и самовывоз.",
};

const FACTS = [
  { icon: Clock, label: "Время доставки", value: DELIVERY_CONFIG.estimatedTime },
  { icon: Truck, label: "Стоимость доставки", value: formatPrice(DELIVERY_CONFIG.deliveryPrice) },
  { icon: Wallet, label: "Мин. сумма заказа", value: formatPrice(DELIVERY_CONFIG.minimumOrder) },
  { icon: PackageCheck, label: "Бесплатно от", value: formatPrice(DELIVERY_CONFIG.freeDeliveryFrom) },
];

export default function DeliveryPage() {
  return (
    <>
      <PageHero
        kicker="Доставка"
        title="Доставка и самовывоз"
        subtitle="Развозим горячую пиццу по городу в термосумках. Также можно забрать заказ самостоятельно."
        image="/images/menu/dubai.webp"
      />
      <Container className="py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact, index) => (
            <Reveal key={fact.label} delay={index * 0.08}>
              <div className="rounded-2xl border border-cream/10 bg-charcoal-soft p-6">
                <fact.icon className="text-gold" size={24} aria-hidden />
                <p className="mt-4 font-display text-2xl text-cream">{fact.value}</p>
                <p className="mt-1 text-sm text-cream/55">{fact.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Зоны доставки" title="Куда мы доставляем" />
            <ul className="mt-8 space-y-3">
              {DELIVERY_CONFIG.zones.map((zone) => (
                <Reveal key={zone.id}>
                  <li className="flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-charcoal-soft px-5 py-4">
                    <span className="flex items-center gap-3 text-cream">
                      <MapPinned size={18} className="text-gold" aria-hidden />
                      {zone.name}
                    </span>
                    <span className="text-sm text-cream/55">{zone.time}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading kicker="Самовывоз" title="Заберите заказ сами" />
            <Reveal delay={0.1} className="mt-8 rounded-2xl border border-cream/10 bg-charcoal-soft p-6">
              <div className="flex items-start gap-4">
                <ShoppingBag className="mt-1 shrink-0 text-gold" size={22} aria-hidden />
                <div>
                  <p className="text-cream">
                    Самовывоз доступен всегда — среднее время приготовления {DELIVERY_CONFIG.pickup.estimatedTime}.
                  </p>
                  <p className="mt-2 text-sm text-cream/60">
                    Мы пришлём уведомление в WhatsApp, когда заказ будет готов к выдаче.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-8">
              <LinkButton href="/menu" size="lg">
                Собрать заказ
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
