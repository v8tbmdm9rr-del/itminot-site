export type CategoryId = "pizza" | "roman" | "drinks";

export type MenuTag = "hit" | "spicy" | "new" | "vegetarian";

export interface SizeOption {
  id: string;
  label: string;
  diameter?: string;
  price: number;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  category: CategoryId;
  name: string;
  shortDescription: string;
  composition: string[];
  weight: string;
  price: number;
  sizes?: SizeOption[];
  tags?: MenuTag[];
  image?: string;
  removableIngredients?: string[];
  modifierIds?: string[];
}

export interface Category {
  id: CategoryId;
  label: string;
}
