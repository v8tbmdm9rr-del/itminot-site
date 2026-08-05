"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { DishImage } from "./DishImage";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/utils/format";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";

export function MenuCard({
  item,
  onOpen,
  delay = 0,
}: {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
  delay?: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const defaultSize = item.sizes?.[item.sizes.length - 1];
  const displayPrice = defaultSize ? defaultSize.price : item.price;

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      size: defaultSize,
      basePrice: item.price,
      quantity: 1,
      modifiers: [],
      removedIngredients: [],
    });
    showToast(`${item.name} добавлена в корзину`, defaultSize ? `Размер: ${defaultSize.label}` : undefined);
  }

  return (
    <Reveal delay={delay} className="h-full">
      <div
        onClick={() => onOpen(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(item)}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-cream/8 bg-charcoal-soft/60 transition-colors hover:border-gold/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
            <DishImage image={item.image} name={item.name} category={item.category} />
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl leading-tight text-cream">{item.name}</h3>
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream/60">
            {item.shortDescription}
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-cream/40">{item.weight}</p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="font-display text-lg text-gold">
              {item.sizes ? `от ${formatPrice(displayPrice)}` : formatPrice(displayPrice)}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleQuickAdd}
              aria-label={`Добавить ${item.name} в корзину`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ember text-cream transition-transform hover:scale-105"
            >
              <Plus size={18} aria-hidden />
            </motion.button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
