import { CAR_COUNTRY_OPTIONS, type CarCountry } from "@/entities/car";
import type { PriceCurrency } from "./car-form";

export const COUNTRY_OPTIONS = CAR_COUNTRY_OPTIONS;

export const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() + 2 - 1980 },
  (_, index) => String(new Date().getFullYear() + 1 - index),
);

export const CURRENCY_BY_COUNTRY: Record<CarCountry, PriceCurrency> = {
  japan: "JPY",
  china: "CNY",
  korea: "KRW",
};

export const BODY_TYPE_OPTIONS = [
  "Седан",
  "Хэтчбек",
  "Универсал",
  "Кроссовер",
  "Внедорожник",
  "Минивэн",
  "Купе",
  "Пикап",
];

export const DRIVE_OPTIONS = ["Передний", "Задний", "Полный"];
export const FUEL_TYPE_OPTIONS = ["Бензин", "Дизель", "Гибрид", "Электро"];
export const TRANSMISSION_OPTIONS = [
  "Автомат",
  "Механика",
  "Вариатор",
  "Робот",
];
export const STEERING_WHEEL_OPTIONS = ["Левый", "Правый"];
export const CURRENCY_OPTIONS = ["JPY", "CNY", "KRW"];
export type CarColor = { id: string; name: string; hex: string };
export const COLOR_OPTIONS: CarColor[] = [
  { id: "white", name: "Белый", hex: "#FFFFFF" },
  { id: "black", name: "Чёрный", hex: "#171717" },
  { id: "gray", name: "Серый", hex: "#808080" },
  { id: "silver", name: "Серебристый", hex: "#C0C0C0" },
  { id: "blue", name: "Синий", hex: "#2563A8" },
  { id: "red", name: "Красный", hex: "#C92834" },
];

export const PRICE_MODE_OPTIONS = [
  { value: "calculated", label: "По расчёту" },
  { value: "fixed", label: "Фиксированная" },
];

export const PUBLICATION_OPTIONS = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликован" },
];
