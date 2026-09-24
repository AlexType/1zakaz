import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { catalogCars } from "../../lib/stories/catalog-cars";
import { CarCatalogTable } from "./CarCatalogTable";

it("показывает число записей каталога", () => {
  render(
    <MantineProvider>
      <CarCatalogTable cars={catalogCars} />
    </MantineProvider>,
  );
  expect(screen.getByText("1–10 из 12")).toBeInTheDocument();
});
