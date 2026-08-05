import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформите заказ в пиццерии ITMINOT: доставка или самовывоз, оплата и подтверждение через WhatsApp.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero kicker="Оформление заказа" title="Почти готово" />
      <Container className="py-16">
        <CheckoutForm />
      </Container>
    </>
  );
}
