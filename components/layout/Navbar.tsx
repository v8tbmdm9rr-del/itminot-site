"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { RESTAURANT } from "@/config/restaurant";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/config/whatsapp";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";

const NAV_LINKS = [
  { href: "/menu", label: "Меню" },
  { href: "/#about", label: "О нас" },
  { href: "/booking", label: "Бронирование" },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const mounted = useHasMounted();
  const count = mounted ? selectCartCount(items) : 0;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-charcoal/90 py-3 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md"
          : "bg-gradient-to-b from-black/50 to-transparent py-6",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="neon-text font-display text-2xl tracking-wide">
          ITMINOT
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={RESTAURANT.phoneLink}
            aria-label="Позвонить в пиццерию"
            className="hidden items-center gap-2 text-sm text-cream/85 hover:text-gold md:flex"
          >
            <Phone size={16} aria-hidden />
            {RESTAURANT.phoneDisplay}
          </a>
          <a
            href={buildWhatsAppLink("Здравствуйте! Хочу задать вопрос по пиццерии ITMINOT.", WHATSAPP_NUMBER)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-gold hover:text-charcoal sm:flex"
          >
            <MessageCircle size={18} aria-hidden />
          </a>
          <button
            onClick={openCart}
            aria-label={`Корзина, товаров: ${count}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-gold hover:text-charcoal"
          >
            <ShoppingBag size={18} aria-hidden />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-cream"
              >
                {count}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню навигации"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream lg:hidden"
          >
            <Menu size={18} aria-hidden />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-charcoal/98 p-6 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between">
            <span className="neon-text font-display text-2xl">ITMINOT</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню навигации"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <nav className="mt-12 flex flex-1 flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl text-cream/90 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 border-t border-cream/10 pt-6">
            <a href={RESTAURANT.phoneLink} className="flex items-center gap-3 text-cream/85">
              <Phone size={18} aria-hidden /> {RESTAURANT.phoneDisplay}
            </a>
            <a
              href={buildWhatsAppLink("Здравствуйте! Хочу задать вопрос по пиццерии ITMINOT.", WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-cream/85"
            >
              <MessageCircle size={18} aria-hidden /> Написать в WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
