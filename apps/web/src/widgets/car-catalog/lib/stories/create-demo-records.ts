import type { CatalogCar } from "@/entities/car";
import type { CarFormValues, CarPhoto } from "@/features/manage-car";
import { catalogCars } from "./catalog-cars";

export type DemoCarRecord = {
  summary: CatalogCar;
  values: CarFormValues;
  photos: CarPhoto[];
};

export function createDemoRecords(): DemoCarRecord[] {
  return catalogCars.map((car) => ({
    summary: car,
    values: {
      brand: car.brand,
      model: car.model,
      year: String(car.year),
      country: car.country,
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
      currency:
        car.country === "japan"
          ? "JPY"
          : car.country === "china"
            ? "CNY"
            : "KRW",
      priceMode: car.priceRub === null ? "calculated" : "fixed",
      fixedPriceRub: car.priceRub === null ? "" : String(car.priceRub),
      manager: car.managerName ?? "",
      publicationStatus: car.publicationStatus,
    },
    photos: car.thumbnailUrl
      ? [
          {
            id: `${car.id}-cover`,
            url: car.previewUrl ?? car.thumbnailUrl,
            name: `${car.brand} ${car.model}`,
          },
        ]
      : [],
  }));
}
