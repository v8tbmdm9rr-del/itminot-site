"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { CategoryId, ModifierOption, SizeOption } from "@/types/menu";

export interface AddToCartInput {
  menuItemId: string;
  name: string;
  category: CategoryId;
  image?: string;
  size?: SizeOption;
  basePrice: number;
  quantity: number;
  modifiers: ModifierOption[];
  removedIngredients: string[];
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
}

function computeUnitPrice(basePrice: number, size: SizeOption | undefined, modifiers: ModifierOption[]): number {
  const base = size ? size.price : basePrice;
  const modifiersTotal = modifiers.reduce((sum, m) => sum + m.price, 0);
  return base + modifiersTotal;
}

function sameLine(a: AddToCartInput, b: CartItem): boolean {
  if (a.menuItemId !== b.menuItemId) return false;
  if ((a.size?.id ?? "") !== (b.size?.id ?? "")) return false;
  const aModIds = a.modifiers.map((m) => m.id).sort().join(",");
  const bModIds = b.modifiers.map((m) => m.id).sort().join(",");
  if (aModIds !== bModIds) return false;
  const aRemoved = [...a.removedIngredients].sort().join(",");
  const bRemoved = [...b.removedIngredients].sort().join(",");
  return aRemoved === bRemoved;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (input) => {
        const existing = get().items.find((item) => sameLine(input, item));
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.lineId === existing.lineId
                ? { ...item, quantity: item.quantity + input.quantity }
                : item,
            ),
          });
          return;
        }
        const newItem: CartItem = {
          lineId: `${input.menuItemId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          menuItemId: input.menuItemId,
          name: input.name,
          category: input.category,
          image: input.image,
          size: input.size,
          quantity: input.quantity,
          basePrice: input.basePrice,
          modifiers: input.modifiers,
          removedIngredients: input.removedIngredients,
          unitPrice: computeUnitPrice(input.basePrice, input.size, input.modifiers),
        };
        set({ items: [...get().items, newItem] });
      },
      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.lineId === lineId ? { ...item, quantity } : item,
          ),
        });
      },
      removeItem: (lineId) => {
        set({ items: get().items.filter((item) => item.lineId !== lineId) });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "itminot-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function selectCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
