"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { checkoutSchema, type CheckoutSchema } from "@/utils/validation";
import { useCartStore, selectSubtotal } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { DELIVERY_CONFIG, getDeliveryPrice } from "@/config/delivery";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/config/whatsapp";
import { buildOrderMessage } from "@/utils/whatsappMessage";
import { formatPrice, generateOrderNumber } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { DishImage } from "@/components/menu/DishImage";
import { cn } from "@/utils/cn";
import type { CheckoutFormValues } from "@/types/order";

const inputClasses =
  "w-full rounded-xl border border-cream/15 bg-charcoal-soft px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold";
const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cream/60";
const errorClasses = "mt-1.5 text-xs text-ember";

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const mounted = useHasMounted();

  const [submitted, setSubmitted] = useState<{ orderNumber: string; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillment: "delivery",
      timeOption: "asap",
      payment: "cash",
      consent: false,
    },
  });

  const fulfillment = watch("fulfillment");
  const timeOption = watch("timeOption");

  const subtotal = mounted ? selectSubtotal(items) : 0;
  const deliveryPrice = fulfillment === "delivery" ? getDeliveryPrice(subtotal) : 0;
  const total = subtotal + deliveryPrice;
  const belowMinimum =
    fulfillment === "delivery" && subtotal > 0 && subtotal < DELIVERY_CONFIG.minimumOrder;

  function onSubmit(data: CheckoutSchema) {
    const orderNumber = generateOrderNumber();
    const values: CheckoutFormValues = {
      name: data.name,
      phone: data.phone,
      fulfillment: data.fulfillment,
      address: data.address,
      entrance: data.entrance,
      floor: data.floor,
      apartment: data.apartment,
      comment: data.comment,
      desiredTime: data.timeOption === "asap" ? "Как можно скорее" : `К ${data.scheduledTime}`,
      payment: data.payment,
      consent: data.consent,
    };
    const message = buildOrderMessage({
      orderNumber,
      items,
      subtotal,
      deliveryPrice,
      total,
      values,
    });
    const link = buildWhatsAppLink(message, WHATSAPP_NUMBER);
    window.open(link, "_blank", "noopener,noreferrer");
    setSubmitted({ orderNumber, message });
  }

  if (!mounted) return null;

  if (items.length === 0 && !submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag size={40} className="text-cream/30" aria-hidden />
        <p className="text-cream/60">Ваша корзина пуста — сначала выберите блюда.</p>
        <LinkButton href="/menu">Перейти в меню</LinkButton>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl border border-gold/30 bg-charcoal-soft p-8 text-center sm:p-12"
      >
        <CheckCircle2 size={44} className="text-gold" aria-hidden />
        <h2 className="font-display text-3xl text-cream">Заказ №{submitted.orderNumber} готов к отправке</h2>
        <p className="text-cream/70">
          Мы открыли WhatsApp с готовым сообщением. Чтобы менеджер получил заказ,{" "}
          <strong className="text-cream">нажмите кнопку «Отправить» в WhatsApp</strong>. Если приложение не
          открылось — воспользуйтесь кнопкой ниже.
        </p>
        <a
          href={buildWhatsAppLink(submitted.message, WHATSAPP_NUMBER)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-olive px-6 py-3 text-sm font-semibold text-cream hover:bg-olive-soft"
        >
          <MessageCircle size={18} aria-hidden /> Открыть WhatsApp ещё раз
        </a>
        <Button
          variant="outline"
          onClick={() => {
            clear();
            setSubmitted(null);
          }}
        >
          Заказ отправлен, очистить корзину
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="name">Имя</label>
            <input id="name" className={inputClasses} placeholder="Ваше имя" {...register("name")} />
            {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClasses} htmlFor="phone">Телефон</label>
            <input id="phone" className={inputClasses} placeholder="+7 999 999-99-99" {...register("phone")} />
            {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <p className={labelClasses}>Способ получения</p>
          <div className="flex gap-3">
            <label className={cn(
              "flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm transition-colors",
              fulfillment === "delivery" ? "border-gold bg-gold/10 text-cream" : "border-cream/15 text-cream/70",
            )}>
              <input type="radio" value="delivery" className="sr-only" {...register("fulfillment")} />
              Доставка
            </label>
            <label className={cn(
              "flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm transition-colors",
              fulfillment === "pickup" ? "border-gold bg-gold/10 text-cream" : "border-cream/15 text-cream/70",
            )}>
              <input type="radio" value="pickup" className="sr-only" {...register("fulfillment")} />
              Самовывоз
            </label>
          </div>
        </div>

        {fulfillment === "delivery" && (
          <div className="space-y-5">
            <div>
              <label className={labelClasses} htmlFor="address">Адрес доставки</label>
              <input id="address" className={inputClasses} placeholder="Улица, дом" {...register("address")} />
              {errors.address && <p className={errorClasses}>{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClasses} htmlFor="entrance">Подъезд</label>
                <input id="entrance" className={inputClasses} {...register("entrance")} />
              </div>
              <div>
                <label className={labelClasses} htmlFor="floor">Этаж</label>
                <input id="floor" className={inputClasses} {...register("floor")} />
              </div>
              <div>
                <label className={labelClasses} htmlFor="apartment">Квартира</label>
                <input id="apartment" className={inputClasses} {...register("apartment")} />
              </div>
            </div>
          </div>
        )}

        <div>
          <p className={labelClasses}>Желаемое время</p>
          <div className="flex flex-wrap gap-3">
            <label className={cn(
              "cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors",
              timeOption === "asap" ? "border-gold bg-gold/10 text-cream" : "border-cream/15 text-cream/70",
            )}>
              <input type="radio" value="asap" className="sr-only" {...register("timeOption")} />
              Как можно скорее
            </label>
            <label className={cn(
              "cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors",
              timeOption === "scheduled" ? "border-gold bg-gold/10 text-cream" : "border-cream/15 text-cream/70",
            )}>
              <input type="radio" value="scheduled" className="sr-only" {...register("timeOption")} />
              К определённому времени
            </label>
            {timeOption === "scheduled" && (
              <input type="time" className={cn(inputClasses, "w-36")} {...register("scheduledTime")} />
            )}
          </div>
          {errors.scheduledTime && <p className={errorClasses}>{errors.scheduledTime.message}</p>}
        </div>

        <div>
          <label className={labelClasses} htmlFor="comment">Комментарий к заказу</label>
          <textarea
            id="comment"
            rows={3}
            className={inputClasses}
            placeholder="Например: позвонить за 5 минут до приезда"
            {...register("comment")}
          />
          {errors.comment && <p className={errorClasses}>{errors.comment.message}</p>}
        </div>

        <div>
          <p className={labelClasses}>Способ оплаты</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { value: "cash", label: "Наличными" },
              { value: "card", label: "Картой при получении" },
              { value: "transfer", label: "Переводом" },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors",
                  watch("payment") === option.value
                    ? "border-gold bg-gold/10 text-cream"
                    : "border-cream/15 text-cream/70",
                )}
              >
                <input type="radio" value={option.value} className="sr-only" {...register("payment")} />
                {option.label}
              </label>
            ))}
            <label className="cursor-not-allowed rounded-xl border border-cream/10 px-4 py-3 text-sm text-cream/30">
              Онлайн-оплата <span className="ml-1 rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase">Скоро</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-cream/70">
            <input type="checkbox" className="mt-1 accent-[var(--color-gold)]" {...register("consent")} />
            Я согласен(на) на обработку персональных данных в соответствии с политикой конфиденциальности.
          </label>
          {errors.consent && <p className={errorClasses}>{errors.consent.message}</p>}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-cream/10 bg-charcoal-soft p-6">
        <h2 className="font-display text-xl text-cream">Ваш заказ</h2>
        <div className="thin-scrollbar mt-4 max-h-72 space-y-4 overflow-y-auto">
          {items.map((item) => (
            <div key={item.lineId} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <DishImage image={item.image} name={item.name} category={item.category} sizes="56px" />
              </div>
              <div className="flex-1 text-sm">
                <p className="text-cream">{item.name} × {item.quantity}</p>
                {item.size && <p className="text-xs text-cream/50">{item.size.label}</p>}
              </div>
              <p className="text-sm text-cream/80">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>

        {belowMinimum && (
          <p className="mt-4 rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold">
            Минимальная сумма заказа для доставки — {formatPrice(DELIVERY_CONFIG.minimumOrder)}
          </p>
        )}

        <div className="mt-4 space-y-2 border-t border-cream/10 pt-4 text-sm">
          <div className="flex justify-between text-cream/70">
            <span>Сумма блюд</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-cream/70">
            <span>Доставка</span>
            <span>{fulfillment === "pickup" ? "самовывоз" : deliveryPrice === 0 ? "бесплатно" : formatPrice(deliveryPrice)}</span>
          </div>
          <div className="flex justify-between font-display text-lg text-cream">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full">
          Оформить заказ
        </Button>
      </div>
    </form>
  );
}
