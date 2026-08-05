"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, selectSubtotal } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { CartLineItem } from "./CartLineItem";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { formatPrice } from "@/utils/format";
import { getDeliveryPrice, DELIVERY_CONFIG } from "@/config/delivery";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const mounted = useHasMounted();

  useBodyScrollLock(isOpen);

  const subtotal = mounted ? selectSubtotal(items) : 0;
  const deliveryPrice = subtotal > 0 ? getDeliveryPrice(subtotal) : 0;
  const total = subtotal + deliveryPrice;
  const belowMinimum = subtotal > 0 && subtotal < DELIVERY_CONFIG.minimumOrder;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full flex-col bg-charcoal-soft shadow-2xl sm:max-w-md"
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 className="font-display text-2xl text-cream">Ваша корзина</h2>
              <button
                onClick={closeCart}
                aria-label="Закрыть корзину"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {!mounted || items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={40} className="text-cream/30" aria-hidden />
                <p className="text-cream/60">Корзина пока пуста.</p>
                <LinkButton href="/menu" onClick={closeCart} variant="outline" size="sm">
                  Перейти в меню
                </LinkButton>
              </div>
            ) : (
              <>
                <div className="thin-scrollbar flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartLineItem key={item.lineId} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="space-y-3 border-t border-cream/10 px-6 py-5">
                  {belowMinimum && (
                    <p className="rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold">
                      Минимальная сумма заказа для доставки — {formatPrice(DELIVERY_CONFIG.minimumOrder)}
                    </p>
                  )}
                  <div className="flex justify-between text-sm text-cream/70">
                    <span>Сумма блюд</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cream/70">
                    <span>Доставка (ориентировочно)</span>
                    <span>{deliveryPrice === 0 ? "бесплатно" : formatPrice(deliveryPrice)}</span>
                  </div>
                  <div className="flex justify-between font-display text-xl text-cream">
                    <span>Итого</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <LinkButton href="/checkout" onClick={closeCart} size="lg">
                      Оформить заказ
                    </LinkButton>
                    <Button variant="ghost" size="sm" onClick={clear} className="gap-2 normal-case text-cream/60">
                      <Trash2 size={14} aria-hidden /> Очистить корзину
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
