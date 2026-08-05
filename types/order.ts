export type FulfillmentMethod = "delivery" | "pickup";
export type PaymentMethod = "cash" | "card" | "transfer" | "online";

export interface CheckoutFormValues {
  name: string;
  phone: string;
  fulfillment: FulfillmentMethod;
  address?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  comment?: string;
  desiredTime: string;
  payment: PaymentMethod;
  consent: boolean;
}

export type BookingZone = "main-hall";

export interface BookingFormValues {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  zone: BookingZone;
  wishes?: string;
}

export interface BookingRecord extends BookingFormValues {
  id: string;
  createdAt: string;
}
