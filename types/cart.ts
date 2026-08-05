import type { CategoryId, ModifierOption, SizeOption } from "./menu";

export interface CartItem {
  lineId: string;
  menuItemId: string;
  name: string;
  category: CategoryId;
  image?: string;
  size?: SizeOption;
  quantity: number;
  basePrice: number;
  modifiers: ModifierOption[];
  removedIngredients: string[];
  unitPrice: number;
}
