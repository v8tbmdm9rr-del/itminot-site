"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { DishImage } from "@/components/menu/DishImage";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/utils/format";

export function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 border-b border-cream/10 py-5 first:pt-0"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <DishImage image={item.image} name={item.name} category={item.category} sizes="80px" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-lg leading-tight text-cream">{item.name}</p>
          <button
            onClick={() => removeItem(item.lineId)}
            aria-label={`Удалить ${item.name} из корзины`}
            className="shrink-0 text-cream/40 transition-colors hover:text-ember"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        </div>

        {item.size && <p className="text-xs text-cream/55">Размер: {item.size.label}</p>}
        {item.modifiers.length > 0 && (
          <p className="text-xs text-cream/55">
            Доп.: {item.modifiers.map((m) => m.name).join(", ")}
          </p>
        )}
        {item.removedIngredients.length > 0 && (
          <p className="text-xs text-cream/55">Без: {item.removedIngredients.join(", ")}</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-cream/15 px-2 py-1">
            <button
              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
              aria-label="Уменьшить количество"
              className="flex h-6 w-6 items-center justify-center rounded-full text-cream/80 hover:bg-cream/10"
            >
              <Minus size={13} aria-hidden />
            </button>
            <span className="w-4 text-center text-sm text-cream">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
              aria-label="Увеличить количество"
              className="flex h-6 w-6 items-center justify-center rounded-full text-cream/80 hover:bg-cream/10"
            >
              <Plus size={13} aria-hidden />
            </button>
          </div>
          <p className="font-semibold text-cream">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
      </div>
    </motion.div>
  );
}
