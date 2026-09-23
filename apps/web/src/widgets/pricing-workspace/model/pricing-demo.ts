import type { DemoRuleSet } from "./calculation-rules";

export type Currency = "JPY" | "CNY" | "KRW" | "USD" | "EUR";
export type Country = "japan" | "china" | "korea";
export type RateMode = "auto" | "manual";

export type ExchangeRate = {
  currency: Currency;
  country: Country;
  referenceRub: number;
  mode: RateMode;
  manualRub: number | null;
  source: string;
  effectiveAt: string;
};

export type Expense = {
  id: string;
  country: Country;
  label: string;
  amountRub: number | "";
  category: "origin" | "international";
  note?: string;
};

export const COUNTRY_OPTIONS = [
  { value: "japan", label: "Япония" },
  { value: "china", label: "Китай" },
  { value: "korea", label: "Корея" },
] as const;

export const CURRENCY_LABELS: Record<Currency, string> = {
  JPY: "Японская иена",
  CNY: "Китайский юань",
  KRW: "Корейская вона",
  USD: "Доллар США",
  EUR: "Евро",
};

// Значения нужны только для Storybook и не являются текущими курсами или тарифами.
export const DEMO_RATES: ExchangeRate[] = [
  {
    currency: "JPY",
    country: "japan",
    referenceRub: 0.58,
    mode: "auto",
    manualRub: null,
    source: "ЦБ РФ",
    effectiveAt: "2026-09-22T00:00:00Z",
  },
  {
    currency: "CNY",
    country: "china",
    referenceRub: 11.8,
    mode: "auto",
    manualRub: null,
    source: "ЦБ РФ",
    effectiveAt: "2026-09-22T00:00:00Z",
  },
  {
    currency: "KRW",
    country: "korea",
    referenceRub: 0.065,
    mode: "auto",
    manualRub: null,
    source: "ЦБ РФ",
    effectiveAt: "2026-09-22T00:00:00Z",
  },
  {
    currency: "USD",
    country: "japan",
    referenceRub: 84.25,
    mode: "auto",
    manualRub: null,
    source: "ЦБ РФ",
    effectiveAt: "2026-09-22T00:00:00Z",
  },
  {
    currency: "EUR",
    country: "japan",
    referenceRub: 99.4,
    mode: "auto",
    manualRub: null,
    source: "ЦБ РФ",
    effectiveAt: "2026-09-22T00:00:00Z",
  },
];

export const DEMO_EXPENSES: Expense[] = [
  {
    id: "jp-logistics",
    country: "japan",
    label: "Доставка по Японии",
    amountRub: 38_000,
    category: "origin",
  },
  {
    id: "jp-shipping",
    country: "japan",
    label: "Морская перевозка",
    amountRub: 115_000,
    category: "international",
  },
  {
    id: "cn-logistics",
    country: "china",
    label: "Доставка по Китаю",
    amountRub: 45_000,
    category: "origin",
  },
  {
    id: "cn-shipping",
    country: "china",
    label: "Международная перевозка",
    amountRub: 125_000,
    category: "international",
  },
  {
    id: "kr-logistics",
    country: "korea",
    label: "Доставка по Корее",
    amountRub: 42_000,
    category: "origin",
  },
  {
    id: "kr-shipping",
    country: "korea",
    label: "Морская перевозка",
    amountRub: 120_000,
    category: "international",
  },
];

// Демонстрационные значения нужны для Storybook. Они не являются коммерческим
// предложением и не заменяют опубликованный набор правил backend.
export const DEMO_RULE_SET: DemoRuleSet = {
  revision: "demo-2026-09-23",
  effectiveFrom: "2026-09-23T00:00:00Z",
  parameters: [
    {
      id: "bank-fee-percent",
      group: "payment",
      label: "Комиссия за оплату",
      value: 1.5,
      unit: "percent",
      source: "Тариф компании",
    },
    {
      id: "insurance-percent",
      group: "payment",
      label: "Страхование перевозки",
      value: 0.7,
      unit: "percent",
      source: "Тариф компании",
    },
    {
      id: "customs-clearance-rub",
      group: "clearance",
      label: "Таможенный сбор",
      value: 31_067,
      unit: "rub",
      source: "Демонстрационное правило",
    },
    {
      id: "broker-rub",
      group: "clearance",
      label: "Таможенный представитель",
      value: 35_000,
      unit: "rub",
      source: "Тариф компании",
    },
    {
      id: "storage-rub",
      group: "clearance",
      label: "СВХ и терминал",
      value: 18_000,
      unit: "rub",
      source: "Тариф компании",
    },
    {
      id: "certification-rub",
      group: "clearance",
      label: "СБКТС и лаборатория",
      value: 40_000,
      unit: "rub",
      source: "Тариф партнёра",
    },
    {
      id: "epts-rub",
      group: "clearance",
      label: "Оформление ЭПТС",
      value: 12_000,
      unit: "rub",
      source: "Тариф партнёра",
    },
    {
      id: "glonass-rub",
      group: "clearance",
      label: "ЭРА-ГЛОНАСС",
      value: 45_000,
      unit: "rub",
      source: "Тариф партнёра",
    },
    {
      id: "company-fee-percent",
      group: "company",
      label: "Комиссия компании",
      value: 5,
      unit: "percent",
      source: "Тариф компании",
    },
    {
      id: "company-duty-percent",
      group: "commercial",
      label: "Ввозная пошлина для проверки",
      value: 15,
      unit: "percent",
      source: "Демонстрационное правило",
    },
    {
      id: "company-excise-per-hp-rub",
      group: "commercial",
      label: "Акциз за л.с. для проверки",
      value: 65,
      unit: "rub_per_hp",
      source: "Демонстрационное правило",
    },
    {
      id: "vat-percent",
      group: "commercial",
      label: "НДС",
      value: 22,
      unit: "percent",
      source: "Демонстрационное правило",
    },
    {
      id: "commercial-recycling-rub",
      group: "commercial",
      label: "Коммерческий утильсбор для проверки",
      value: 667_400,
      unit: "rub",
      source: "Демонстрационное правило",
    },
  ],
  newVehicleDutyBands: [
    { id: "to-8500", maxValueEuro: 8_500, percent: 54, minimumEuroPerCm3: 2.5 },
    {
      id: "to-16700",
      maxValueEuro: 16_700,
      percent: 48,
      minimumEuroPerCm3: 3.5,
    },
    {
      id: "to-42300",
      maxValueEuro: 42_300,
      percent: 48,
      minimumEuroPerCm3: 5.5,
    },
    {
      id: "to-84500",
      maxValueEuro: 84_500,
      percent: 48,
      minimumEuroPerCm3: 7.5,
    },
    {
      id: "to-169000",
      maxValueEuro: 169_000,
      percent: 48,
      minimumEuroPerCm3: 15,
    },
    {
      id: "over-169000",
      maxValueEuro: null,
      percent: 48,
      minimumEuroPerCm3: 20,
    },
  ],
  usedVehicleDutyBands: [
    {
      id: "to-1000",
      maxVolumeCm3: 1_000,
      threeToFiveEuroPerCm3: 1.5,
      overFiveEuroPerCm3: 3,
    },
    {
      id: "to-1500",
      maxVolumeCm3: 1_500,
      threeToFiveEuroPerCm3: 1.7,
      overFiveEuroPerCm3: 3.2,
    },
    {
      id: "to-1800",
      maxVolumeCm3: 1_800,
      threeToFiveEuroPerCm3: 2.5,
      overFiveEuroPerCm3: 3.5,
    },
    {
      id: "to-2300",
      maxVolumeCm3: 2_300,
      threeToFiveEuroPerCm3: 2.7,
      overFiveEuroPerCm3: 4.8,
    },
    {
      id: "to-3000",
      maxVolumeCm3: 3_000,
      threeToFiveEuroPerCm3: 3,
      overFiveEuroPerCm3: 5,
    },
    {
      id: "over-3000",
      maxVolumeCm3: null,
      threeToFiveEuroPerCm3: 3.6,
      overFiveEuroPerCm3: 5.7,
    },
  ],
  recyclingRules: [
    {
      id: "ice-personal",
      label: "ДВС и параллельные гибриды",
      powertrains: ["petrol", "diesel", "parallel_hybrid", "plug_in_hybrid"],
      maxPowerHp: 160,
      newVehicleRub: 3_400,
      overThreeYearsRub: 5_200,
    },
    {
      id: "electric-personal",
      label: "Электромобили и последовательные гибриды",
      powertrains: ["electric", "series_hybrid"],
      maxPowerHp: 80,
      newVehicleRub: 3_400,
      overThreeYearsRub: 5_200,
    },
  ],
  deliveryTariffs: [
    { city: "Владивосток", amountRub: 0 },
    { city: "Хабаровск", amountRub: 35_000 },
    { city: "Новосибирск", amountRub: 145_000 },
    { city: "Москва", amountRub: 235_000 },
    { city: "Санкт-Петербург", amountRub: 255_000 },
  ],
};

export const DEMO_CARS = [
  {
    id: "toyota",
    country: "japan",
    name: "Toyota Corolla Cross",
    sourcePrice: 1_200_000,
    currency: "JPY",
  },
  {
    id: "honda",
    country: "japan",
    name: "Honda Vezel",
    sourcePrice: 1_050_000,
    currency: "JPY",
  },
  {
    id: "geely",
    country: "china",
    name: "Geely Monjaro",
    sourcePrice: 145_000,
    currency: "CNY",
  },
  {
    id: "changan",
    country: "china",
    name: "Changan UNI-K",
    sourcePrice: 128_000,
    currency: "CNY",
  },
  {
    id: "hyundai",
    country: "korea",
    name: "Hyundai Palisade",
    sourcePrice: 36_000_000,
    currency: "KRW",
  },
  {
    id: "genesis",
    country: "korea",
    name: "Genesis GV70",
    sourcePrice: 42_000_000,
    currency: "KRW",
  },
] as const;
