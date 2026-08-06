/**
 * Основные данные пиццерии ITMINOT.
 * Все значения временные — замените на реальные при запуске.
 */
export const RESTAURANT = {
  name: "ITMINOT",
  fullName: "ITMINOT — неаполитанская пиццерия",
  city: "Гудермес",
  address: "г. Гудермес, ул. Вокзальная, 30",
  phoneDisplay: "+7 938 001-10-01",
  phoneLink: "tel:+79380011001",
  instagram: "https://www.instagram.com/itminot.gudermes",
  workingHours: [{ days: "Пн – Вс", hours: "10:00 – 00:00" }],
  coordinates: {
    lat: 43.34195,
    lng: 46.12148,
  },
  mapEmbedUrl:
    "https://yandex.ru/map-widget/v1/?ll=46.12148%2C43.34195&z=16&pt=46.12148,43.34195,pm2rdm",
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
