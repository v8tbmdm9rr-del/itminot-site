import "server-only";
import type { AdminMenuItemSchema } from "@/utils/validation";
import type { MenuItem, SizeOption } from "@/types/menu";
import { ALL_PIZZA_MODIFIER_IDS, pizzaSizes, romanSizes } from "@/data/menu";

function buildSizes(
  category: AdminMenuItemSchema["category"],
  price: number,
  smallPrice: number | undefined,
): SizeOption[] | undefined {
  if (category === "drinks") return undefined;
  const sizes = category === "pizza" ? pizzaSizes(price) : romanSizes(price);
  if (smallPrice && smallPrice > 0) {
    sizes[0] = { ...sizes[0], price: smallPrice };
  }
  return sizes;
}

/** Преобразует данные формы админ-панели в поля MenuItem (без id/slug). */
export function mapAdminFormToMenuItem(
  form: AdminMenuItemSchema,
): Omit<MenuItem, "id" | "slug"> {
  const composition = form.composition
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    category: form.category,
    name: form.name,
    shortDescription: form.shortDescription,
    composition,
    weight: form.weight,
    price: form.price,
    sizes: form.hasSizes ? buildSizes(form.category, form.price, form.smallPrice) : undefined,
    tags: form.tags,
    image: form.image || undefined,
    modifierIds: form.category === "drinks" ? undefined : ALL_PIZZA_MODIFIER_IDS,
  };
}
