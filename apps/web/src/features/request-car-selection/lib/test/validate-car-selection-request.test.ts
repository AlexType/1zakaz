import { describe, expect, it } from "vitest";
import { EMPTY_CAR_SELECTION_REQUEST } from "../../model/car-selection-request";
import {
  validateCarSelectionRequest,
  validateCarSelectionRequestStep,
} from "../validate-car-selection-request";

describe("validateCarSelectionRequestStep", () => {
  it("проверяет условное поле марки и модели", () => {
    const errors = validateCarSelectionRequestStep(
      {
        ...EMPTY_CAR_SELECTION_REQUEST,
        selectionMode: "specific",
        country: "japan",
        condition: "used",
      },
      0,
    );

    expect(errors.vehicleQuery).toBe("Укажите марку и модель автомобиля");
    expect(errors.vehicleType).toBeUndefined();
  });

  it("при подборе требует тип автомобиля, но не модель", () => {
    const errors = validateCarSelectionRequestStep(
      {
        ...EMPTY_CAR_SELECTION_REQUEST,
        selectionMode: "help",
        country: "unknown",
        condition: "any",
      },
      0,
    );

    expect(errors.vehicleType).toBe("Выберите подходящий тип автомобиля");
    expect(errors.vehicleQuery).toBeUndefined();
  });
});

it("принимает полностью заполненную заявку", () => {
  expect(
    validateCarSelectionRequest({
      ...EMPTY_CAR_SELECTION_REQUEST,
      selectionMode: "specific",
      vehicleQuery: "Toyota RAV4",
      country: "japan",
      condition: "used",
      budgetRub: "3000000",
      deliveryCity: "Хабаровск",
      clientName: "Анна",
      phone: "+7 999 123-45-67",
      contactMethod: "telegram",
      personalDataConsent: true,
    }),
  ).toEqual({});
});
