import { Flame, Leaf, Sparkles, ChefHat } from "lucide-react";
import type { MenuTag } from "@/types/menu";
import { cn } from "@/utils/cn";

const TAG_META: Record<MenuTag, { label: string; icon: typeof Flame; className: string }> = {
  hit: {
    label: "Хит",
    icon: ChefHat,
    className: "bg-ember/90 text-cream",
  },
  spicy: {
    label: "Острое",
    icon: Flame,
    className: "bg-wine/90 text-cream",
  },
  new: {
    label: "Новинка",
    icon: Sparkles,
    className: "bg-gold/90 text-charcoal",
  },
  vegetarian: {
    label: "Вегетарианское",
    icon: Leaf,
    className: "bg-olive/90 text-cream",
  },
};

export function Tag({ tag, className }: { tag: MenuTag; className?: string }) {
  const meta = TAG_META[tag];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm",
        meta.className,
        className,
      )}
    >
      <Icon size={11} aria-hidden />
      {meta.label}
    </span>
  );
}
