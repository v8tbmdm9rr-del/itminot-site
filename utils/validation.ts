import { z } from "zod";
import { BOOKING_HOURS } from "@/config/restaurant";

export const PHONE_REGEX = /^(\+7|8|7)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, "Введите имя").max(60, "Слишком длинное имя"),
    phone: z.string().trim().regex(PHONE_REGEX, "Введите корректный номер телефона"),
    fulfillment: z.enum(["delivery", "pickup"]),
    address: z.string().trim().optional().or(z.literal("")),
    entrance: z.string().trim().max(10).optional().or(z.literal("")),
    floor: z.string().trim().max(10).optional().or(z.literal("")),
    apartment: z.string().trim().max(10).optional().or(z.literal("")),
    comment: z.string().trim().max(500, "Не более 500 символов").optional().or(z.literal("")),
    timeOption: z.enum(["asap", "scheduled"]),
    scheduledTime: z.string().optional().or(z.literal("")),
    payment: z.enum(["cash", "card", "transfer"]),
    consent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === "delivery" && (!data.address || data.address.trim().length < 5)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Укажите адрес доставки",
      });
    }
    if (data.timeOption === "scheduled" && !data.scheduledTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledTime"],
        message: "Укажите желаемое время",
      });
    }
    if (!data.consent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["consent"],
        message: "Необходимо согласие на обработку персональных данных",
      });
    }
  });

export type CheckoutSchema = z.infer<typeof checkoutSchema>;

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Введите имя").max(60, "Слишком длинное имя"),
    phone: z.string().trim().regex(PHONE_REGEX, "Введите корректный номер телефона"),
    date: z.string().min(1, "Выберите дату"),
    time: z.string().min(1, "Выберите время"),
    guests: z
      .string()
      .min(1, "Укажите количество гостей")
      .refine((v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 30;
      }, "От 1 до 30 гостей"),
    zone: z.literal("main-hall"),
    wishes: z.string().trim().max(500, "Не более 500 символов").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.date || !data.time) return;
    const [hour] = data.time.split(":").map(Number);
    if (hour < BOOKING_HOURS.openHour || hour >= BOOKING_HOURS.closeHour) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time"],
        message: `Мы принимаем брони с ${BOOKING_HOURS.openHour}:00 до ${BOOKING_HOURS.closeHour}:00`,
      });
      return;
    }
    const dateTime = new Date(`${data.date}T${data.time}`);
    if (dateTime.getTime() < Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time"],
        message: "Выберите дату и время в будущем",
      });
    }
  });

export type BookingSchema = z.infer<typeof bookingSchema>;

export const adminMenuItemSchema = z.object({
  name: z.string().trim().min(2, "Введите название").max(80, "Слишком длинное название"),
  category: z.enum(["pizza", "roman", "drinks"]),
  shortDescription: z.string().trim().min(1, "Добавьте описание").max(200, "Слишком длинное описание"),
  composition: z.string().trim().min(1, "Укажите состав"),
  weight: z.string().trim().min(1, "Укажите вес или объём"),
  price: z.coerce.number().min(1, "Цена должна быть больше нуля"),
  smallPrice: z.coerce.number().optional(),
  hasSizes: z.boolean(),
  tags: z.array(z.enum(["hit", "spicy", "new", "vegetarian"])),
  image: z.string().trim().optional().or(z.literal("")),
});

export type AdminMenuItemSchema = z.infer<typeof adminMenuItemSchema>;
