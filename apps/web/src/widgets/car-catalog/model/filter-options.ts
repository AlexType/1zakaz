import { COUNTRY_LABELS, PUBLICATION_LABELS } from "@/entities/car";

export const PHOTO_FILTER_OPTIONS = [
  { value: "all", label: "Все автомобили" },
  { value: "with", label: "С фото" },
  { value: "without", label: "Без фото" },
];
export const COUNTRY_FILTER_OPTIONS = [
  { value: "all", label: "Все страны" },
  { value: "japan", label: COUNTRY_LABELS.japan },
  { value: "china", label: COUNTRY_LABELS.china },
  { value: "korea", label: COUNTRY_LABELS.korea },
];
export const PRICE_FILTER_OPTIONS = [
  { value: "all", label: "Все автомобили" },
  { value: "with", label: "С ценой" },
  { value: "without", label: "Без цены" },
];
export const PUBLICATION_FILTER_OPTIONS = [
  { value: "all", label: "Все статусы" },
  { value: "published", label: PUBLICATION_LABELS.published },
  { value: "draft", label: PUBLICATION_LABELS.draft },
];
export const CATALOG_PAGE_SIZE = 10;
export const CATALOG_COLUMNS_STORAGE_KEY = "catalog-car-columns-v4";
