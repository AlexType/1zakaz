import type { CarFormValues, CarPhoto } from "../../model/car-form";

export const demoBrands = [
  "Toyota",
  "Honda",
  "Nissan",
  "Hyundai",
  "Kia",
  "Geely",
];
export const demoModels = [
  "Corolla Cross",
  "RAV4",
  "Vezel",
  "Sorento",
  "Monjaro",
];
export const demoManagers = [
  "Петрова Анна Сергеевна",
  "Морозов Иван Петрович",
  "Ким Дмитрий Александрович",
];

export const demoCar: CarFormValues = {
  brand: "Toyota",
  model: "Corolla Cross",
  year: "2022",
  country: "japan",
  mileageKm: "45000",
  bodyType: "Кроссовер",
  engineVolumeCc: "1987",
  powerHp: "171",
  fuelType: "Бензин",
  transmission: "Вариатор",
  drive: "Полный",
  steeringWheel: "Правый",
  color: "white",
  description: "Один владелец. Проверенная история обслуживания, два ключа.",
  sourcePrice: "1200000",
  currency: "JPY",
  priceMode: "fixed",
  fixedPriceRub: "2480000",
  manager: demoManagers[0],
  publicationStatus: "published",
};

export const demoPhotos: CarPhoto[] = [
  {
    id: "photo-1",
    url: "https://placecats.com/neo/400/300",
    name: "Вид спереди",
  },
  { id: "photo-2", url: "https://placecats.com/millie/400/300", name: "Салон" },
];
