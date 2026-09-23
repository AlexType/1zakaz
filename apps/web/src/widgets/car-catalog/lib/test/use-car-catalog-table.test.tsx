import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { catalogCars } from "../stories/catalog-cars";
import { useCarCatalogTable } from "../use-car-catalog-table";

it("фильтрует автомобили по отдельным колонкам и сбрасывает отбор", () => {
  const { result } = renderHook(() => useCarCatalogTable(catalogCars));

  act(() => result.current.updateFilter("model", "Monjaro"));
  expect(result.current.count).toBe(1);
  expect(result.current.pageRecords[0].model).toBe("Monjaro");

  act(() => result.current.updateFilter("country", "japan"));
  expect(result.current.count).toBe(0);

  act(() => result.current.resetFilters());
  expect(result.current.count).toBe(catalogCars.length);
  expect(result.current.hasFilters).toBe(false);
});
