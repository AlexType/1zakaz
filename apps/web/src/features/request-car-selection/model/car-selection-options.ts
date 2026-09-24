import type {
  CarSelectionCondition,
  CarSelectionContactMethod,
  CarSelectionCountry,
  CarSelectionPurchaseTiming,
  CarSelectionVehicleType,
} from "./car-selection-request";
import { CAR_COUNTRY_OPTIONS } from "@/entities/car";

export const CAR_SELECTION_COUNTRY_OPTIONS: ReadonlyArray<{
  value: CarSelectionCountry;
  label: string;
}> = [...CAR_COUNTRY_OPTIONS, { value: "unknown", label: "Не знаю" }];

export const CAR_SELECTION_CONDITION_OPTIONS: ReadonlyArray<{
  value: CarSelectionCondition;
  label: string;
}> = [
  { value: "new", label: "Новый" },
  { value: "used", label: "С пробегом" },
  { value: "any", label: "Без разницы" },
];

export const CAR_SELECTION_VEHICLE_TYPE_OPTIONS: ReadonlyArray<{
  value: CarSelectionVehicleType;
  label: string;
}> = [
  { value: "crossover", label: "Кроссовер или внедорожник" },
  { value: "sedan", label: "Седан" },
  { value: "minivan", label: "Минивэн" },
  { value: "compact", label: "Компактный автомобиль или кейкар" },
  { value: "pickup", label: "Пикап" },
  { value: "other", label: "Другой или пока не знаю" },
];

export const CAR_SELECTION_PURCHASE_TIMING_OPTIONS: ReadonlyArray<{
  value: Exclude<CarSelectionPurchaseTiming, "">;
  label: string;
}> = [
  { value: "as-soon-as-possible", label: "Как можно скорее" },
  { value: "one-to-three-months", label: "В течение 1–3 месяцев" },
  { value: "later", label: "Позже" },
  { value: "comparing", label: "Пока сравниваю варианты" },
];

export const CAR_SELECTION_CONTACT_METHOD_OPTIONS: ReadonlyArray<{
  value: CarSelectionContactMethod;
  label: string;
}> = [
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Позвонить" },
];

export const CAR_SELECTION_COUNTRY_LABELS = Object.fromEntries(
  CAR_SELECTION_COUNTRY_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<CarSelectionCountry, string>;

export const CAR_SELECTION_CONDITION_LABELS = Object.fromEntries(
  CAR_SELECTION_CONDITION_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<CarSelectionCondition, string>;

export const CAR_SELECTION_VEHICLE_TYPE_LABELS = Object.fromEntries(
  CAR_SELECTION_VEHICLE_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<CarSelectionVehicleType, string>;

export const CAR_SELECTION_CONTACT_METHOD_LABELS = Object.fromEntries(
  CAR_SELECTION_CONTACT_METHOD_OPTIONS.map(({ value, label }) => [
    value,
    label,
  ]),
) as Record<CarSelectionContactMethod, string>;
