import { expect, it } from "vitest";
import { catalogCars } from "../stories/catalog-cars";
import { sortCatalogCars } from "../sort-catalog-cars";

it("сортирует цены численно и оставляет незаполненные в конце", () => {
  const cars = [catalogCars[0], catalogCars[4], catalogCars[2]];

  expect(
    sortCatalogCars(cars, {
      columnAccessor: "priceRub",
      direction: "desc",
    }).map((car) => car.id),
  ).toEqual(["car-03", "car-01", "car-05"]);
  expect(
    sortCatalogCars(cars, { columnAccessor: "priceRub", direction: "asc" }).map(
      (car) => car.id,
    ),
  ).toEqual(["car-01", "car-03", "car-05"]);
});
