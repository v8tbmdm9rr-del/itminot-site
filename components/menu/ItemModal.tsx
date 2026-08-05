"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import type { MenuItem } from "@/types/menu";
import { DishImage } from "./DishImage";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { getModifierById } from "@/data/modifiers";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

function ItemModalContent({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  const [sizeId, setSizeId] = useState<string | undefined>(item.sizes?.[item.sizes.length - 1]?.id);
  const [quantity, setQuantity] = useState(1);
  const [modifierIds, setModifierIds] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);

  const selectedSize = useMemo(() => item.sizes?.find((s) => s.id === sizeId), [item, sizeId]);
  const selectedModifiers = useMemo(
    () => modifierIds.map((id) => getModifierById(id)).filter((m): m is NonNullable<typeof m> => Boolean(m)),
    [modifierIds],
  );

  const unitPrice = useMemo(() => {
    const base = selectedSize ? selectedSize.price : item.price;
    return base + selectedModifiers.reduce((sum, m) => sum + m.price, 0);
  }, [item, selectedSize, selectedModifiers]);

  function toggleModifier(id: string) {
    setModifierIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  function toggleRemoved(name: string) {
    setRemoved((prev) => (prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]));
  }

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      size: selectedSize,
      basePrice: item.price,
      quantity,
      modifiers: selectedModifiers,
      removedIngredients: removed,
    });
    showToast(`${item.name} добавлена в корзину`, `${quantity} шт. · ${formatPrice(unitPrice * quantity)}`);
    onClose();
  }

  const availableModifiers =
    item.modifierIds?.map((id) => getModifierById(id)).filter((m): m is NonNullable<typeof m> => Boolean(m)) ?? [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="fixed inset-x-0 bottom-0 z-[95] mx-auto flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-charcoal-soft shadow-2xl sm:inset-y-8 sm:bottom-8 sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Закрыть окно блюда"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/70 text-cream backdrop-blur-sm hover:bg-charcoal"
        >
          <X size={18} aria-hidden />
        </button>

        <div className="thin-scrollbar overflow-y-auto">
          <div className="relative aspect-[16/9] w-full shrink-0 sm:aspect-[21/9]">
            <DishImage image={item.image} name={item.name} category={item.category} priority sizes="(max-width: 768px) 100vw, 768px" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-soft via-transparent to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            {item.tags && item.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>
            )}
            <h2 className="font-display text-3xl text-cream sm:text-4xl">{item.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">{item.shortDescription}</p>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Состав</p>
              <p className="text-sm leading-relaxed text-cream/75">{item.composition.join(", ")}</p>
              <p className="mt-1 text-xs text-cream/45">{item.weight}</p>
            </div>

            {item.sizes && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Размер</p>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSizeId(size.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        sizeId === size.id
                          ? "border-gold bg-gold text-charcoal"
                          : "border-cream/20 text-cream/80 hover:border-cream/50",
                      )}
                    >
                      {size.label} · {formatPrice(size.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.removableIngredients && item.removableIngredients.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Убрать ингредиенты
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.removableIngredients.map((name) => (
                    <button
                      key={name}
                      onClick={() => toggleRemoved(name)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        removed.includes(name)
                          ? "border-wine bg-wine/30 text-cream line-through"
                          : "border-cream/20 text-cream/80 hover:border-cream/50",
                      )}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableModifiers.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Дополнительные ингредиенты
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableModifiers.map((modifier) => (
                    <button
                      key={modifier.id}
                      onClick={() => toggleModifier(modifier.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        modifierIds.includes(modifier.id)
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-cream/20 text-cream/80 hover:border-cream/50",
                      )}
                    >
                      + {modifier.name} · {formatPrice(modifier.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-cream/10 bg-charcoal-soft px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3 rounded-full border border-cream/20 px-2 py-1.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Уменьшить количество"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream hover:bg-cream/10"
            >
              <Minus size={15} aria-hidden />
            </button>
            <span className="w-5 text-center text-cream">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Увеличить количество"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream hover:bg-cream/10"
            >
              <Plus size={15} aria-hidden />
            </button>
          </div>
          <Button onClick={handleAdd} size="lg" className="flex-1">
            В корзину · {formatPrice(unitPrice * quantity)}
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export function ItemModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  useBodyScrollLock(Boolean(item));

  return (
    <AnimatePresence>
      {item && <ItemModalContent key={item.id} item={item} onClose={onClose} />}
    </AnimatePresence>
  );
}
