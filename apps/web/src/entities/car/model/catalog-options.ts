import type { CarCountry, PublicationStatus } from "./catalog-car";

export const COUNTRY_LABELS: Record<CarCountry, string> = {
  japan: "Япония",
  china: "Китай",
  korea: "Корея",
};

export const PUBLICATION_LABELS: Record<PublicationStatus, string> = {
  draft: "Черновик",
  published: "Опубликован",
};
