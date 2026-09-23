import type { DataTableSortStatus } from "mantine-datatable";
import {
  COUNTRY_LABELS,
  PUBLICATION_LABELS,
  type CatalogCar,
} from "@/entities/car";

const collator = new Intl.Collator("ru", {
  numeric: true,
  sensitivity: "base",
});

export function sortCatalogCars(
  cars: CatalogCar[],
  sortStatus: DataTableSortStatus<CatalogCar>,
): CatalogCar[] {
  const { columnAccessor, direction } = sortStatus;
  const multiplier = direction === "asc" ? 1 : -1;

  return [...cars].sort((left, right) => {
    const leftValue =
      columnAccessor === "country"
        ? COUNTRY_LABELS[left.country]
        : columnAccessor === "publicationStatus"
          ? PUBLICATION_LABELS[left.publicationStatus]
          : left[columnAccessor as keyof CatalogCar];
    const rightValue =
      columnAccessor === "country"
        ? COUNTRY_LABELS[right.country]
        : columnAccessor === "publicationStatus"
          ? PUBLICATION_LABELS[right.publicationStatus]
          : right[columnAccessor as keyof CatalogCar];

    if (leftValue == null) return rightValue == null ? 0 : 1;
    if (rightValue == null) return -1;

    const result =
      typeof leftValue === "number" && typeof rightValue === "number"
        ? leftValue - rightValue
        : collator.compare(String(leftValue), String(rightValue));
    return result * multiplier;
  });
}
