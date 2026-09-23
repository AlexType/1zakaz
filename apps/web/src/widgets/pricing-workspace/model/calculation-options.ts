import type {
  CalculationLineCategory,
  ImporterType,
  PowertrainType,
  PurchaseChannel,
  UsagePurpose,
  VehicleCategory,
} from "./calculation";
import type { Country, Currency } from "./pricing-demo";

export const COUNTRY_CURRENCY: Record<Country, Currency> = {
  japan: "JPY",
  china: "CNY",
  korea: "KRW",
};

export const POWERTRAIN_OPTIONS: { value: PowertrainType; label: string }[] = [
  { value: "petrol", label: "Бензин" },
  { value: "diesel", label: "Дизель" },
  { value: "parallel_hybrid", label: "Параллельный гибрид" },
  { value: "series_hybrid", label: "Последовательный гибрид" },
  { value: "plug_in_hybrid", label: "Подключаемый гибрид" },
  { value: "electric", label: "Электромобиль" },
];

export const PURCHASE_CHANNEL_OPTIONS: {
  value: PurchaseChannel;
  label: string;
}[] = [
  { value: "auction", label: "Аукцион" },
  { value: "dealer", label: "Дилер" },
  { value: "offer", label: "Готовое предложение" },
];

export const IMPORTER_OPTIONS: { value: ImporterType; label: string }[] = [
  { value: "individual", label: "Физическое лицо" },
  { value: "company", label: "Юридическое лицо или ИП" },
];

export const USAGE_PURPOSE_OPTIONS: {
  value: UsagePurpose;
  label: string;
}[] = [
  { value: "personal", label: "Личное пользование" },
  { value: "commercial", label: "Коммерческое использование" },
];

export const VEHICLE_CATEGORY_OPTIONS: {
  value: VehicleCategory;
  label: string;
}[] = [
  { value: "M1", label: "M1 — легковой автомобиль" },
  { value: "M1G", label: "M1G — повышенной проходимости" },
];

export const DESTINATION_OPTIONS = [
  "Владивосток",
  "Хабаровск",
  "Новосибирск",
  "Москва",
  "Санкт-Петербург",
];

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(
    new Date(2020, index, 1),
  ),
}));

export const YEAR_OPTIONS = Array.from({ length: 50 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return { value: String(year), label: String(year) };
});

export const RESULT_CATEGORY_LABELS: Record<CalculationLineCategory, string> = {
  vehicle: "Автомобиль",
  origin: "Расходы в стране покупки",
  payment: "Оплата и конвертация",
  international: "Международная перевозка",
  customs: "Таможенные платежи",
  certification: "Документы и сертификация",
  services: "Услуги компании",
  domestic: "Доставка по России",
};

export const RESULT_CATEGORY_ORDER: CalculationLineCategory[] = [
  "vehicle",
  "origin",
  "payment",
  "international",
  "customs",
  "certification",
  "services",
  "domestic",
];
