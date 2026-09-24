import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";
import type {
  CarSelectionRequestStep,
  CarSelectionRequestValues,
} from "../model/car-selection-request";

export type CarSelectionRequestErrors = Partial<
  Record<keyof CarSelectionRequestValues, string>
>;

export function validateCarSelectionRequestStep(
  values: CarSelectionRequestValues,
  step: CarSelectionRequestStep,
): CarSelectionRequestErrors {
  const errors: CarSelectionRequestErrors = {};

  if (step === 0) {
    if (!values.selectionMode) {
      errors.selectionMode = "Выберите, знаете ли вы конкретную модель";
    }
    if (
      values.selectionMode === "specific" &&
      values.vehicleQuery.trim().length < 2
    ) {
      errors.vehicleQuery = "Укажите марку и модель автомобиля";
    }
    if (values.selectionMode === "help" && !values.vehicleType) {
      errors.vehicleType = "Выберите подходящий тип автомобиля";
    }
    if (!values.country) {
      errors.country = "Выберите страну или вариант «Не знаю»";
    }
    if (!values.condition) {
      errors.condition = "Выберите состояние автомобиля";
    }
  }

  if (step === 1) {
    const budget = Number(values.budgetRub);
    if (!values.budgetRub || !Number.isFinite(budget) || budget <= 0) {
      errors.budgetRub = "Укажите максимальный бюджет";
    }
    if (values.deliveryCity.trim().length < 2) {
      errors.deliveryCity = "Укажите город получения";
    }
    if (values.wishes.trim().length > 500) {
      errors.wishes = "Сократите пожелания до 500 символов";
    }
  }

  if (step === 2) {
    if (values.clientName.trim().length < 2) {
      errors.clientName = "Укажите, как к вам обращаться";
    }
    if (!normalizeRussianPhone(values.phone)) {
      errors.phone = "Укажите номер в формате +7 999 123-45-67";
    }
    if (!values.contactMethod) {
      errors.contactMethod = "Выберите удобный способ связи";
    }
    if (!values.personalDataConsent) {
      errors.personalDataConsent =
        "Подтвердите согласие на обработку персональных данных";
    }
  }

  return errors;
}

export function validateCarSelectionRequest(
  values: CarSelectionRequestValues,
): CarSelectionRequestErrors {
  return {
    ...validateCarSelectionRequestStep(values, 0),
    ...validateCarSelectionRequestStep(values, 1),
    ...validateCarSelectionRequestStep(values, 2),
  };
}
