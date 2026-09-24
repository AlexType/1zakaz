export const LEADS_COLUMN_LABELS = {
  id: "№",
  createdAt: "Создана",
  client: "Клиент и телефон",
  request: "Запрос",
  budgetRub: "Бюджет",
  status: "Состояние",
  managerName: "Ответственный",
  nextActionAt: "Следующее действие",
};
export const LEADS_COLUMNS_STORAGE_KEY = "leads-columns-v2";

export const LEAD_SOURCE_OPTIONS = [
  { value: "Форма на сайте", label: "Форма на сайте" },
  { value: "Карточка автомобиля", label: "Карточка автомобиля" },
  { value: "Калькулятор", label: "Калькулятор" },
  { value: "Телефон", label: "Телефон" },
  { value: "Telegram", label: "Telegram" },
  { value: "WhatsApp", label: "WhatsApp" },
];

export const LEAD_COUNTRY_OPTIONS = CAR_COUNTRY_OPTIONS;

export const LEAD_VEHICLE_TYPE_LABELS = {
  crossover: "Кроссовер или внедорожник",
  sedan: "Седан",
  minivan: "Минивэн",
  compact: "Компактный автомобиль или кейкар",
  pickup: "Пикап",
  other: "Другой тип",
} as const;

export const LEAD_CONDITION_LABELS = {
  new: "Новый",
  used: "С пробегом",
  any: "Без разницы",
} as const;

export const LEAD_PURCHASE_TIMING_LABELS = {
  "as-soon-as-possible": "Как можно скорее",
  "one-to-three-months": "В течение 1–3 месяцев",
  later: "Позже",
  comparing: "Пока сравнивает варианты",
} as const;

export const LEAD_CONTACT_METHOD_LABELS = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  phone: "Телефон",
} as const;
import { CAR_COUNTRY_OPTIONS } from "@/entities/car";
