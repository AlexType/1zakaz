import type { PriceImpact } from "../../model/price-impact";
import { DEMO_CARS, type ExchangeRate } from "../../model/pricing-demo";
import { getEffectiveRate } from "../compare-pricing-drafts";

export function createDemoPriceImpact(
  publishedRates: ExchangeRate[],
  draftRates: ExchangeRate[],
): PriceImpact[] {
  return DEMO_CARS.flatMap((car) => {
    const before = publishedRates.find(
      (rate) => rate.currency === car.currency,
    );
    const after = draftRates.find((rate) => rate.currency === car.currency);
    if (
      !before ||
      !after ||
      getEffectiveRate(before) === getEffectiveRate(after)
    )
      return [];
    return [
      {
        ...car,
        oldRub: Math.round(car.sourcePrice * getEffectiveRate(before)),
        newRub: Math.round(car.sourcePrice * getEffectiveRate(after)),
      },
    ];
  });
}
