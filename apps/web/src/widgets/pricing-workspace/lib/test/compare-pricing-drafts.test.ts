import { describe, expect, it } from "vitest";
import { getEffectiveRate, getPricingChanges } from "../compare-pricing-drafts";
import { DEMO_EXPENSES, DEMO_RATES } from "../../model/pricing-demo";

describe("pricing draft comparison", () => {
  it("uses the reference rate in automatic mode and manual rate in manual mode", () => {
    expect(getEffectiveRate(DEMO_RATES[0])).toBe(0.58);
    expect(
      getEffectiveRate({ ...DEMO_RATES[0], mode: "manual", manualRub: 0.61 }),
    ).toBe(0.61);
  });

  it("detects changes by stable rule identifiers without mutating published values", () => {
    const draftRates = DEMO_RATES.map((rate) =>
      rate.currency === "JPY"
        ? { ...rate, mode: "manual" as const, manualRub: 0.61 }
        : rate,
    );
    const draftExpenses = DEMO_EXPENSES.map((expense) =>
      expense.id === "jp-logistics"
        ? { ...expense, amountRub: 40_000 }
        : expense,
    );
    const changes = getPricingChanges(
      DEMO_RATES,
      draftRates,
      DEMO_EXPENSES,
      draftExpenses,
    );
    expect(changes.count).toBe(2);
    expect(changes.rates[0]).toMatchObject({ before: 0.58, after: 0.61 });
    expect(changes.expenses[0]).toMatchObject({
      before: 38_000,
      after: 40_000,
    });
    expect(DEMO_RATES[0].mode).toBe("auto");
  });
});
