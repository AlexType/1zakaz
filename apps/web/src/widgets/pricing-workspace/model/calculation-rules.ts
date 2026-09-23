import type { PowertrainType } from "./calculation";

export type RuleParameterId =
  | "bank-fee-percent"
  | "insurance-percent"
  | "company-fee-percent"
  | "customs-clearance-rub"
  | "broker-rub"
  | "storage-rub"
  | "certification-rub"
  | "epts-rub"
  | "glonass-rub"
  | "company-duty-percent"
  | "company-excise-per-hp-rub"
  | "vat-percent"
  | "commercial-recycling-rub";

export type RuleParameter = {
  id: RuleParameterId;
  group: "payment" | "clearance" | "company" | "commercial";
  label: string;
  value: number | "";
  unit: "percent" | "rub" | "rub_per_hp";
  source: string;
};

export type NewVehicleDutyBand = {
  id: string;
  maxValueEuro: number | null;
  percent: number | "";
  minimumEuroPerCm3: number | "";
};

export type UsedVehicleDutyBand = {
  id: string;
  maxVolumeCm3: number | null;
  threeToFiveEuroPerCm3: number | "";
  overFiveEuroPerCm3: number | "";
};

export type RecyclingRule = {
  id: string;
  label: string;
  powertrains: PowertrainType[];
  maxPowerHp: number | "";
  newVehicleRub: number | "";
  overThreeYearsRub: number | "";
};

export type DomesticDeliveryTariff = {
  city: string;
  amountRub: number | "";
};

export type DemoRuleSet = {
  revision: string;
  effectiveFrom: string;
  parameters: RuleParameter[];
  newVehicleDutyBands: NewVehicleDutyBand[];
  usedVehicleDutyBands: UsedVehicleDutyBand[];
  recyclingRules: RecyclingRule[];
  deliveryTariffs: DomesticDeliveryTariff[];
};
