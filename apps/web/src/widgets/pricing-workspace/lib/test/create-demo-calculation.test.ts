import { expect, it } from "vitest";
import { createDemoCalculation } from "../stories/create-demo-calculation";
import {
  DEMO_EXPENSES,
  DEMO_RATES,
  DEMO_RULE_SET,
} from "../../model/pricing-demo";
import type { CalculationRequest } from "../../model/calculation";

const BASE_REQUEST: CalculationRequest = {
  country: "japan",
  purchaseChannel: "auction",
  priceAmount: 1_200_000,
  currency: "JPY",
  manufactureYear: new Date().getFullYear() - 4,
  manufactureMonth: 1,
  vehicleCategory: "M1",
  powertrainType: "petrol",
  engineVolumeCm3: 1800,
  enginePowerHp: 140,
  systemPowerHp: 140,
  importerType: "individual",
  usagePurpose: "personal",
  preferentialRecyclingEligible: true,
  destinationCity: "Владивосток",
};

it("переключает льготный утильсбор на коммерческий после порога мощности", async () => {
  const preferential = await createDemoCalculation(
    BASE_REQUEST,
    DEMO_RATES,
    DEMO_EXPENSES,
    DEMO_RULE_SET,
  );
  const commercial = await createDemoCalculation(
    { ...BASE_REQUEST, enginePowerHp: 161, systemPowerHp: 161 },
    DEMO_RATES,
    DEMO_EXPENSES,
    DEMO_RULE_SET,
  );

  expect(
    preferential.lines.find((line) => line.id === "recycling")?.amountRub,
  ).toBe(5_200);
  expect(
    commercial.lines.find((line) => line.id === "recycling")?.amountRub,
  ).toBe(667_400);
});

it("добавляет акциз и НДС только в коммерческий профиль", async () => {
  const individual = await createDemoCalculation(
    BASE_REQUEST,
    DEMO_RATES,
    DEMO_EXPENSES,
    DEMO_RULE_SET,
  );
  const company = await createDemoCalculation(
    {
      ...BASE_REQUEST,
      importerType: "company",
      usagePurpose: "commercial",
      preferentialRecyclingEligible: false,
    },
    DEMO_RATES,
    DEMO_EXPENSES,
    DEMO_RULE_SET,
  );

  expect(individual.lines.some((line) => line.id === "vat")).toBe(false);
  expect(
    company.lines.find((line) => line.id === "vat")?.amountRub,
  ).toBeGreaterThan(0);
  expect(
    company.lines.find((line) => line.id === "excise")?.amountRub,
  ).toBeGreaterThan(0);
});
