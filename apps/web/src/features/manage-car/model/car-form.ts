import type { CarCountry, PublicationStatus } from "@/entities/car";

export type PriceMode = "calculated" | "fixed";
export type PriceCurrency = "JPY" | "CNY" | "KRW";

export type CarFormValues = {
  brand: string;
  model: string;
  year: string;
  country: CarCountry;
  mileageKm: string;
  bodyType: string;
  engineVolumeCc: string;
  powerHp: string;
  fuelType: string;
  transmission: string;
  drive: string;
  steeringWheel: string;
  color: string; // Идентификатор цвета из справочника
  description: string;
  sourcePrice: string;
  currency: PriceCurrency;
  priceMode: PriceMode;
  fixedPriceRub: string;
  manager: string;
  publicationStatus: PublicationStatus;
};

export type CarPhoto = {
  id: string;
  url: string;
  name: string;
  file?: File;
  sizeBytes?: number;
  mimeType?: string;
};

export type SaveCar = (
  values: CarFormValues,
  photos: CarPhoto[],
) => void | Promise<void>;

export const EMPTY_CAR: CarFormValues = {
  brand: "",
  model: "",
  year: "",
  country: "japan",
  mileageKm: "",
  bodyType: "",
  engineVolumeCc: "",
  powerHp: "",
  fuelType: "",
  transmission: "",
  drive: "",
  steeringWheel: "",
  color: "",
  description: "",
  sourcePrice: "",
  currency: "JPY",
  priceMode: "calculated",
  fixedPriceRub: "",
  manager: "",
  publicationStatus: "draft",
};
