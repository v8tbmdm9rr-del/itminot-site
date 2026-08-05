/**
 * Настройки доставки. Измените значения, чтобы обновить условия на сайте.
 */
export const DELIVERY_CONFIG = {
  minimumOrder: 1000,
  deliveryPrice: 200,
  freeDeliveryFrom: 3000,
  estimatedTime: "40–60 минут",
  zones: [
    { id: "center", name: "Центральный район", time: "30–40 минут" },
    { id: "north", name: "Северный округ", time: "40–55 минут" },
    { id: "south", name: "Южный округ", time: "45–60 минут" },
  ],
  pickup: {
    available: true,
    estimatedTime: "25–35 минут",
  },
} as const;

export function getDeliveryPrice(orderSubtotal: number): number {
  if (orderSubtotal >= DELIVERY_CONFIG.freeDeliveryFrom) return 0;
  return DELIVERY_CONFIG.deliveryPrice;
}
