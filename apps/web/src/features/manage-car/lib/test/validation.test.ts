import { describe, expect, it } from "vitest";
import { demoCar } from "../stories/car-editor-examples";
import { carFormSchema } from "../validation";

describe("carFormSchema", () => {
  it("принимает заполненную карточку", () => {
    expect(carFormSchema.safeParse(demoCar).success).toBe(true);
  });

  it("не принимает карточку без марки, модели и года", () => {
    const result = carFormSchema.safeParse({
      ...demoCar,
      brand: "",
      model: "",
      year: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["brand", "model", "year"]),
      );
    }
  });

  it("требует рублёвую цену в фиксированном режиме", () => {
    const result = carFormSchema.safeParse({ ...demoCar, fixedPriceRub: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === "fixedPriceRub"),
      ).toBe(true);
    }
  });

  it("позволяет сохранять черновик без исходной цены", () => {
    const result = carFormSchema.safeParse({
      ...demoCar,
      priceMode: "calculated",
      fixedPriceRub: "",
      sourcePrice: "",
      publicationStatus: "draft",
    });
    expect(result.success).toBe(true);
  });
});
