import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "md" | "lg" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ember text-cream hover:bg-[#c94a24] shadow-[0_8px_30px_-8px_rgba(226,87,43,0.55)]",
  secondary: "bg-cream text-charcoal hover:bg-cream-dim",
  ghost: "bg-transparent text-cream hover:bg-cream/10",
  outline:
    "bg-transparent text-cream border border-cream/35 hover:border-cream/70 hover:bg-cream/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm tracking-wide",
  lg: "px-8 py-4 text-base tracking-wide",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
