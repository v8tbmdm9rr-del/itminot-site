"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UtensilsCrossed, CalendarCheck2 } from "lucide-react";
import { cn } from "@/utils/cn";

const LINKS = [
  { href: "/admin", label: "Меню", icon: UtensilsCrossed },
  { href: "/admin/bookings", label: "Бронирования", icon: CalendarCheck2 },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-cream/10 bg-charcoal-soft">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-8">
          <span className="font-display text-xl text-cream">ITMINOT · Админ</span>
          <nav className="flex items-center gap-2">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                    active ? "bg-gold text-charcoal" : "text-cream/70 hover:bg-cream/10",
                  )}
                >
                  <link.icon size={16} aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-sm text-cream hover:bg-cream/20"
        >
          <LogOut size={16} aria-hidden /> Выйти
        </button>
      </div>
    </header>
  );
}
