export type CarCountry = "japan" | "china" | "korea";
export type PublicationStatus = "draft" | "published";

export type CatalogCar = {
  id: string;
  brand: string;
  model: string;
  year: number;
  country: CarCountry;
  publicationStatus: PublicationStatus;
  priceRub: number | null;
  priceUpdatedAt: string | null;
  managerName: string | null;
  updatedAt: string;
  thumbnailUrl: string | null;
  previewUrl?: string | null;
  publicUrl: string | null;
};
