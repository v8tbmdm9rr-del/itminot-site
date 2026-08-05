"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";

export function MobileTabBar() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const mounted = useHasMounted();
  const count = mounted ? selectCartCount(items) : 0;

  const tabs = [
    { href: "/menu", label: "Меню", icon: UtensilsCrossed, active: pathname === "/menu" },
    { href: "/booking", label: "Бронь", icon: CalendarCheck, active: pathname === "/booking" },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-cream/10 bg-charcoal/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Мобильная навигация"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium uppercase tracking-wide",
            tab.active ? "text-gold" : "text-cream/70",
          )}
        >
          <tab.icon size={20} aria-hidden />
          {tab.label}
        </Link>
      ))}
      <button
        onClick={openCart}
        className="relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium uppercase tracking-wide text-cream/70"
      >
        <span className="relative">
          <ShoppingBag size={20} aria-hidden />
          {count > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[9px] font-bold text-cream">
              {count}
            </span>
          )}
        </span>
        Корзина
      </button>
    </nav>
  );
}
