/**
 * Номер WhatsApp пиццерии.
 * Формат: только цифры, без "+", пробелов, скобок и дефисов.
 * Пример замены: "79281234567"
 */
export const WHATSAPP_NUMBER = "79380011001";

export function buildWhatsAppLink(message: string, phone: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
