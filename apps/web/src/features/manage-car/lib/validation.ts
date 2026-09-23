import { z } from "zod";

const positiveInteger = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) > 0, {
      error: message,
    });

export const carFormSchema = z
  .object({
    brand: z.string().trim().min(1, { error: "Выберите марку" }),
    model: z.string().trim().min(1, { error: "Выберите модель" }),
    year: positiveInteger("Укажите год выпуска"),
    country: z.enum(["japan", "china", "korea"]),
    mileageKm: z
      .string()
      .trim()
      .refine((value) => !value || /^\d+$/.test(value), {
        error: "Укажите пробег целым числом",
      }),
    bodyType: z.string(),
    engineVolumeCc: z
      .string()
      .trim()
      .refine((value) => !value || (/^\d+$/.test(value) && Number(value) > 0), {
        error: "Укажите объём целым числом",
      }),
    powerHp: z
      .string()
      .trim()
      .refine((value) => !value || (/^\d+$/.test(value) && Number(value) > 0), {
        error: "Укажите мощность целым числом",
      }),
    fuelType: z.string(),
    transmission: z.string(),
    drive: z.string(),
    steeringWheel: z.string(),
    color: z.string(),
    description: z.string(),
    sourcePrice: z
      .string()
      .trim()
      .refine((value) => !value || (/^\d+$/.test(value) && Number(value) > 0), {
        error: "Укажите цену целым положительным числом",
      }),
    currency: z.enum(["JPY", "CNY", "KRW"]),
    priceMode: z.enum(["calculated", "fixed"]),
    fixedPriceRub: z.string(),
    manager: z.string(),
    publicationStatus: z.enum(["draft", "published"]),
  })
  .superRefine((value, context) => {
    const year = Number(value.year);
    if (value.year && (year < 1980 || year > new Date().getFullYear() + 1)) {
      context.addIssue({
        code: "custom",
        path: ["year"],
        message: "Проверьте год выпуска",
      });
    }
    if (
      value.priceMode === "fixed" &&
      (!/^\d+$/.test(value.fixedPriceRub) || Number(value.fixedPriceRub) <= 0)
    ) {
      context.addIssue({
        code: "custom",
        path: ["fixedPriceRub"],
        message: "Укажите цену в рублях",
      });
    }
    if (
      value.publicationStatus === "published" &&
      value.priceMode === "calculated" &&
      !value.sourcePrice
    ) {
      context.addIssue({
        code: "custom",
        path: ["sourcePrice"],
        message: "Укажите исходную цену перед публикацией",
      });
    }
  });
