import type { ReferenceCategory } from "@/entities/reference-entry";

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  { id: "brands", label: "Марки", description: "Марки автомобилей" },
  { id: "models", label: "Модели", description: "Модели с привязкой к марке" },
  { id: "body-types", label: "Типы кузова", description: "Кузова автомобилей" },
  { id: "colors", label: "Цвета", description: "Название и HEX-цвет" },
  {
    id: "fuel-types",
    label: "Типы топлива",
    description: "Двигатели и силовые установки",
  },
  {
    id: "transmissions",
    label: "Коробки передач",
    description: "Типы трансмиссий",
  },
  { id: "drives", label: "Приводы", description: "Типы привода" },
  {
    id: "steering-wheels",
    label: "Расположение руля",
    description: "Левый или правый руль",
  },
  {
    id: "article-categories",
    label: "Рубрики статей",
    description: "Группировка материалов",
  },
  { id: "cities", label: "Города", description: "Города доставки и выдачи" },
  {
    id: "lead-sources",
    label: "Источники заявок",
    description: "Откуда пришло обращение",
  },
  {
    id: "lead-loss-reasons",
    label: "Причины закрытия",
    description: "Почему заявка не завершена",
  },
  {
    id: "lead-stages",
    label: "Этапы заявок",
    description: "Названия и цвета этапов",
  },
];

export const REFERENCE_COLUMN_LABELS = {
  name: "Название",
  code: "Код",
  details: "Связь или пояснение",
  usedCount: "Используется",
  active: "Состояние",
  updatedAt: "Изменён",
  actions: "Действия",
};

export const REFERENCE_COLUMNS_STORAGE_KEY = "reference-data-columns-v1";
export const REFERENCE_DENSITY_STORAGE_KEY = "reference-data-density-v1";
