import type { Country, Currency } from "./pricing-demo";

export type PowertrainType =
  | "petrol"
  | "diesel"
  | "parallel_hybrid"
  | "series_hybrid"
  | "plug_in_hybrid"
  | "electric";
export type ImporterType = "individual" | "company";
export type PurchaseChannel = "auction" | "dealer" | "offer";
export type UsagePurpose = "personal" | "commercial";
export type VehicleCategory = "M1" | "M1G";

export type CalculationRequest = {
  country: Country;
  purchaseChannel: PurchaseChannel;
  priceAmount: number;
  currency: Currency;
  manufactureYear: number;
  manufactureMonth: number;
  vehicleCategory: VehicleCategory;
  powertrainType: PowertrainType;
  engineVolumeCm3: number | null;
  enginePowerHp: number | null;
  systemPowerHp: number;
  importerType: ImporterType;
  usagePurpose: UsagePurpose;
  preferentialRecyclingEligible: boolean;
  destinationCity: string;
};

export type CalculationLineCategory =
  | "vehicle"
  | "origin"
  | "payment"
  | "international"
  | "customs"
  | "certification"
  | "services"
  | "domestic";

export type CalculationLine = {
  id: string;
  label: string;
  category: CalculationLineCategory;
  amountRub: number | null;
  status: "calculated" | "estimate" | "pending";
  explanation?: string;
  source?: string;
};

export type CalculationResult = {
  status: "complete" | "estimate" | "partial";
  calculatedAt: string;
  rulesRevision: string;
  rate: {
    currency: Currency;
    rubPerUnit: number;
    source: string;
    effectiveAt: string;
  };
  lines: CalculationLine[];
  totalRub: number | null;
  notice?: string;
};

export type CalculatePrice = (
  request: CalculationRequest,
) => Promise<CalculationResult>;
