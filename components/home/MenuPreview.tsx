"use client";

import { useState } from "react";
import type { MenuItem } from "@/types/menu";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { MenuCard } from "@/components/menu/MenuCard";
import { ItemModal } from "@/components/menu/ItemModal";

export function MenuPreview({ items }: { items: MenuItem[] }) {
  const [active, setActive] = useState<MenuItem | null>(null);

  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Меню"
            title="Хиты нашей печи"
            subtitle="Несколько позиций, с которых стоит начать знакомство с ITMINOT."
          />
          <LinkButton href="/menu" variant="outline">
            Всё меню
          </LinkButton>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <MenuCard key={item.id} item={item} onOpen={setActive} delay={index * 0.08} />
          ))}
        </div>
      </Container>

      <ItemModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}
