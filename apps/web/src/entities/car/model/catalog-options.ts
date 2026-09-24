import type { CarCountry, PublicationStatus } from "./catalog-car";

export const COUNTRY_LABELS: Record<CarCountry, string> = {
  japan: "Япония",
  china: "Китай",
  korea: "Корея",
};

export const CAR_COUNTRY_OPTIONS = (
  Object.entries(COUNTRY_LABELS) as [CarCountry, string][]
).map(([value, label]) => ({ value, label }));

export const PUBLICATION_LABELS: Record<PublicationStatus, string> = {
  draft: "Черновик",
  published: "Опубликован",
};
