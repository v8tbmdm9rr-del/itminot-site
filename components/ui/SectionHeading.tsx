import { cn } from "@/utils/cn";
import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  light = false,
  className,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      {kicker && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.3em]",
            light ? "text-charcoal/60" : "text-gold",
          )}
        >
          {kicker}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.1] sm:text-5xl",
          light ? "text-charcoal" : "text-cream",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed",
            light ? "text-charcoal/70" : "text-cream/70",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
