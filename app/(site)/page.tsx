import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { MenuPreview } from "@/components/home/MenuPreview";
import { DeliveryPreview } from "@/components/home/DeliveryPreview";
import { BookingTeaser } from "@/components/home/BookingTeaser";
import { ContactsBlock } from "@/components/contacts/ContactsBlock";
import { getMenuItems } from "@/lib/menuStore";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getMenuItems();
  const highlights = items.filter((item) => item.tags?.includes("hit")).slice(0, 4);

  return (
    <>
      <Hero />
      <About />
      <MenuPreview items={highlights} />
      <DeliveryPreview />
      <BookingTeaser />
      <ContactsBlock id="contacts" />
    </>
  );
}
