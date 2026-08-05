"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { CategoryId, MenuItem } from "@/types/menu";
import { CATEGORIES } from "@/data/categories";
import { MenuCard } from "./MenuCard";
import { ItemModal } from "./ItemModal";
import { cn } from "@/utils/cn";

export function MenuBrowser({ items }: { items: MenuItem[] }) {
  const [category, setCategory] = useState<CategoryId>("pizza");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = item.category === category;
      if (!q) return matchesCategory;
      const matchesQuery =
        item.name.toLowerCase().includes(q) ||
        item.composition.some((c) => c.toLowerCase().includes(q));
      return q ? matchesQuery : matchesCategory;
    });
  }, [items, category, query]);

  return (
    <div>
      <div className="sticky top-[64px] z-30 -mx-5 border-b border-cream/10 bg-charcoal/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="thin-scrollbar flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                  category === cat.id
                    ? "border-gold bg-gold text-charcoal"
                    : "border-cream/15 text-cream/70 hover:border-cream/40",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Поиск по меню…"
              aria-label="Поиск по меню"
              className="w-full rounded-full border border-cream/15 bg-charcoal-soft py-2.5 pl-10 pr-9 text-sm text-cream placeholder:text-cream/40 focus:border-gold"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Очистить поиск"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={query ? `search-${query}` : category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {filtered.length === 0 ? (
              <p className="py-20 text-center text-cream/50">
                Ничего не найдено. Попробуйте другой запрос или категорию.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((item, index) => (
                  <MenuCard key={item.id} item={item} onOpen={setActive} delay={Math.min(index, 6) * 0.05} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ItemModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}
