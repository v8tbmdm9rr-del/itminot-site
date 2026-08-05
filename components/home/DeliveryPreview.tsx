import { Clock, PackageCheck, Truck, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Reveal";
import { DELIVERY_CONFIG } from "@/config/delivery";
import { formatPrice } from "@/utils/format";

const FACTS = [
  { icon: Clock, label: "Время доставки", value: DELIVERY_CONFIG.estimatedTime },
  { icon: Truck, label: "Стоимость доставки", value: formatPrice(DELIVERY_CONFIG.deliveryPrice) },
  { icon: Wallet, label: "Мин. сумма заказа", value: formatPrice(DELIVERY_CONFIG.minimumOrder) },
  { icon: PackageCheck, label: "Бесплатно от", value: formatPrice(DELIVERY_CONFIG.freeDeliveryFrom) },
];

export function DeliveryPreview() {
  return (
    <section className="bg-charcoal-soft py-24 sm:py-32">
      <Container>
        <SectionHeading
          kicker="Доставка и самовывоз"
          title="Привезём горячей, или заберите сами"
          subtitle="Развозим по городу в термосумках, сохраняющих тепло и хрустящую корочку до самой двери."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact, index) => (
            <Reveal key={fact.label} delay={index * 0.08}>
              <div className="rounded-2xl border border-cream/10 bg-charcoal p-6">
                <fact.icon className="text-gold" size={24} aria-hidden />
                <p className="mt-4 font-display text-2xl text-cream">{fact.value}</p>
                <p className="mt-1 text-sm text-cream/55">{fact.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-4">
          <LinkButton href="/delivery">Условия доставки</LinkButton>
          <LinkButton href="/menu" variant="outline">
            Собрать заказ
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
