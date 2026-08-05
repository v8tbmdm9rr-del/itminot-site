/**
 * Основные данные пиццерии ITMINOT.
 * Все значения временные — замените на реальные при запуске.
 */
export const RESTAURANT = {
  name: "ITMINOT",
  fullName: "ITMINOT — неаполитанская пиццерия",
  city: "Гудермес",
  address: "г. Гудермес, ул. Кадырова, 12",
  phoneDisplay: "+7 938 001-10-01",
  phoneLink: "tel:+79380011001",
  instagram: "https://www.instagram.com/itminot.gudermes",
  workingHours: [
    { days: "Пн – Чт", hours: "10:00 – 23:00" },
    { days: "Пт – Вс", hours: "10:00 – 00:00" },
  ],
  coordinates: {
    lat: 43.3506,
    lng: 45.7852,
  },
  mapEmbedUrl:
    "https://yandex.ru/map-widget/v1/?ll=45.7852%2C43.3506&z=16&pt=45.7852,43.3506,pm2rdm",
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/itminot.gudermes" },
  ],
} as const;

export const BOOKING_ZONES = [{ id: "main-hall", label: "Основной зал" }] as const;

export const BOOKING_HOURS = {
  openHour: 10,
  closeHour: 23,
  slotMinutes: 30,
} as const;
