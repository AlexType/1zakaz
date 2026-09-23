import type { Country, Currency } from "./pricing-demo";

export type PriceImpact = {
  id: string;
  country: Country;
  name: string;
  sourcePrice: number;
  currency: Currency;
  oldRub: number;
  newRub: number;
};
