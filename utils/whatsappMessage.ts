import type { CartItem } from "@/types/cart";
import type { BookingFormValues, CheckoutFormValues } from "@/types/order";
import { BOOKING_ZONES } from "@/config/restaurant";
import { formatPrice } from "./format";

const FULFILLMENT_LABEL: Record<CheckoutFormValues["fulfillment"], string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
  "dine-in": "В зале",
};

const PAYMENT_LABEL: Record<CheckoutFormValues["payment"], string> = {
  cash: "Наличными",
  card: "Банковской картой при получении",
  transfer: "Переводом",
  online: "Онлайн-оплата (скоро)",
};

interface OrderMessageParams {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  values: CheckoutFormValues;
}

function itemLabel(item: CartItem): string {
  if (item.category === "pizza") return `Пицца ${item.name}`;
  if (item.category === "roman") return `Римская пицца ${item.name}`;
  return item.name;
}

export function buildOrderMessage({
 orderNumber,
  items,
  subtotal,
  deliveryPrice,
  total,
  values,
}: OrderMessageParams): string {
  const now = new Date();
  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const lines: string[] = [];
  lines.push("🍕 Новый заказ с сайта ITMINOT", "");
  lines.push(`Номер заказа: ${orderNumber}`);
  lines.push(`Дата: ${date}`);
  lines.push(`Время: ${time}`, "");
  lines.push(`Клиент: ${values.name}`);
  lines.push(`Телефон: ${values.phone}`, "");
  lines.push(`Способ получения: ${FULFILLMENT_LABEL[values.fulfillment]}`);

  if (values.fulfillment === "delivery") {
    lines.push(`Адрес: ${values.address ?? ""}`);
    if (values.entrance) lines.push(`Подъезд: ${values.entrance}`);
    if (values.floor) lines.push(`ЭтаЖ: ${values.floor}`);
    if (values.apartment) lines.push(`Квартира: ${values.apartment}`);
  }
  lines.push(`Желаемое время: ${values.desiredTime}`, "");
  lines.push("Состав заказа:", "");

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${itemLabel(item)} — ${item.quantity} шт.`);
    if (item.size) lines.push(`Размер: ${item.size.label}`);
    if (item.modifiers.length > 0) {
      lines.push(`Дополнительно: ${item.modifiers.map((m) => m.name.toLowerCase()).join(", ")}`);
    }
    if (item.removedIngredients.length > 0) {
      lines.push(`Без: ${item.removedIngredients.join(", ").toLowerCase()}`);
    }
    lines.push(`Стоимость: ${formatPrice(item.unitPrice * item.quantity)}`, "");
  });

  lines.push(`Сумма блюд: ${formatPrice(subtotal)}`);
  lines.push(
    values.fulfillment === "delivery"
      ? `Доставка: ${deliveryPrice === 0 ? "бесплатно" : formatPrice(deliveryPrice)}`
      : `Доставка: ${FULFILLMENT_LABEL[values.fulfillment].toLowerCase()}`,
  );
  lines.push(`Итого: ${formatPrice(total)}`, "");
  lines.push(`Способ оплаты: ${PAYMENT_LABEL[values.payment]}`);

  if (values.comment) {
    lines.push("", "Комментарий:", values.comment);
  }

  return lines.join("\n");
}

const ZONE_LABEL: Record<string, string> = Object.fromEntries(
  BOOKING_ZONES.map((z) => [z.id, z.label]),
);

export function buildBookingMessage(values: BookingFormValues): string {
  const lines: string[] = [];
  lines.push("📅 Новая заявка на бронирование — ITMINOT", "");
  lines.push(`Имя: ${values.name}`);
  lines.push(`Телефон: ${values.phone}`);
  lines.push(`Дата: ${values.date}`);
  lines.push(`Время: ${values.time}`);
  lines.push(`Количество гостей: ${values.guests}`);
  lines.push(`Зона: ${ZONE_LABEL[values.zone] ?? values.zone}`);

  if (values.wishes) {
    lines.push("", "Пожелания:", values.wishes);
  }

  return lines.join("\n");
}
