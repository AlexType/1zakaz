import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { expect, it, vi } from "vitest";
import { createDemoCalculation } from "../../lib/stories/create-demo-calculation";
import {
  DEMO_EXPENSES,
  DEMO_RATES,
  DEMO_RULE_SET,
} from "../../model/pricing-demo";
import { PricingCalculator } from "./PricingCalculator";

it("changes the currency with the country and sends the selected inputs to the calculator API", async () => {
  const onCalculate = vi.fn((request) =>
    createDemoCalculation(request, DEMO_RATES, DEMO_EXPENSES, DEMO_RULE_SET),
  );
  render(
    <MantineProvider>
      <PricingCalculator onCalculate={onCalculate} />
    </MantineProvider>,
  );

  fireEvent.click(screen.getByRole("radio", { name: "Китай" }));
  const price = screen.getByRole("textbox", { name: "Цена автомобиля, CNY" });
  expect(price).toHaveValue("");
  fireEvent.change(price, { target: { value: "100000" } });
  fireEvent.click(screen.getByRole("button", { name: "Рассчитать" }));

  await waitFor(() =>
    expect(onCalculate).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "china",
        currency: "CNY",
        priceAmount: 100000,
      }),
    ),
  );
  expect(await screen.findByText("Предварительная смета")).toBeInTheDocument();
  expect(screen.getByText("Итого")).toBeInTheDocument();
});
