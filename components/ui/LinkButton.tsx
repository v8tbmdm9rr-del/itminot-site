import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";

export function LinkButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & React.ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
