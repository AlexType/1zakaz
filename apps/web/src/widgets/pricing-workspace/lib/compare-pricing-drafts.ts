import type { ExchangeRate, Expense } from "../model/pricing-demo";

export function getEffectiveRate(rate: ExchangeRate): number {
  return rate.mode === "manual" && rate.manualRub !== null
    ? rate.manualRub
    : rate.referenceRub;
}

export function getPricingChanges(
  publishedRates: ExchangeRate[],
  draftRates: ExchangeRate[],
  publishedExpenses: Expense[],
  draftExpenses: Expense[],
) {
  const rates = draftRates.flatMap((draft) => {
    const published = publishedRates.find(
      (rate) => rate.currency === draft.currency,
    );
    return published &&
      (published.mode !== draft.mode || published.manualRub !== draft.manualRub)
      ? [
          {
            id: draft.currency,
            label: `${draft.currency}: курс и режим`,
            before: getEffectiveRate(published),
            after: getEffectiveRate(draft),
          },
        ]
      : [];
  });
  const expenses = draftExpenses.flatMap((draft) => {
    const published = publishedExpenses.find(
      (expense) => expense.id === draft.id,
    );
    return published && published.amountRub !== draft.amountRub
      ? [
          {
            id: draft.id,
            label: draft.label,
            before: published.amountRub,
            after: draft.amountRub,
          },
        ]
      : [];
  });
  return { rates, expenses, count: rates.length + expenses.length };
}
