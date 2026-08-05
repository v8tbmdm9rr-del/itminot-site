import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { getMenuItems } from "@/lib/menuStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Меню",
  description:
    "Меню пиццерии ITMINOT: неаполитанская пицца, римская пицца и напитки. Соберите заказ на доставку или самовывоз.",
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <>
      <PageHero
        kicker="Меню ITMINOT"
        title="Выберите свою пиццу"
        subtitle="Неаполитанская пицца из дровяной печи, римская пицца на тонком тесте и фирменные напитки."
        image="/images/menu/mega-hot.webp"
      />
      <Container>
        <MenuBrowser items={items} />
      </Container>
    </>
  );
}
