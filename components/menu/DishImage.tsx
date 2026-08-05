import Image from "next/image";
import { CupSoda, Pizza } from "lucide-react";
import type { CategoryId } from "@/types/menu";
import { cn } from "@/utils/cn";

const CATEGORY_ICON: Record<CategoryId, typeof Pizza> = {
  pizza: Pizza,
  roman: Pizza,
  drinks: CupSoda,
};

export function DishImage({
  image,
  name,
  category,
  sizes,
  fill = true,
  className,
  priority,
}: {
  image?: string;
  name: string;
  category: CategoryId;
  sizes?: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        fill={fill}
        sizes={sizes ?? "(max-width: 768px) 100vw, 400px"}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  const Icon = CATEGORY_ICON[category];
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.18),transparent_60%),linear-gradient(160deg,#211d16,#0d0c0b)]",
        className,
      )}
    >
      <Icon size={40} className="text-gold/50" strokeWidth={1.25} aria-hidden />
      <span className="sr-only">{name}</span>
    </div>
  );
}
