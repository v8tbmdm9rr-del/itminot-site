import type { ModifierOption } from "@/types/menu";

/**
 * Дополнительные ингредиенты, доступные для добавления к пицце.
 * Цену и состав легко изменить здесь — изменения применятся во всём сайте.
 */
export const PIZZA_MODIFIERS: ModifierOption[] = [
  { id: "extra-mozzarella", name: "Моцарелла", price: 150 },
  { id: "extra-pepperoni", name: "Пепперони", price: 180 },
  { id: "extra-mushrooms", name: "Грибы", price: 120 },
  { id: "extra-jalapeno", name: "Халапеньо", price: 100 },
  { id: "extra-olives", name: "Оливки", price: 110 },
  { id: "extra-basil", name: "Базилик", price: 80 },
  { id: "extra-parmesan", name: "Пармезан", price: 150 },
  { id: "extra-chicken", name: "Куриное филе", price: 170 },
];

export function getModifierById(id: string): ModifierOption | undefined {
  return PIZZA_MODIFIERS.find((modifier) => modifier.id === id);
}
