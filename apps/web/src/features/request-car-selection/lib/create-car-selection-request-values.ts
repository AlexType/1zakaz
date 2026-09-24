import {
  EMPTY_CAR_SELECTION_REQUEST,
  type CarSelectionRequestSource,
  type CarSelectionRequestValues,
} from "../model/car-selection-request";

export function createCarSelectionRequestValues(
  source: CarSelectionRequestSource,
  initialValues?: Partial<CarSelectionRequestValues>,
): CarSelectionRequestValues {
  const sourceValues: Partial<CarSelectionRequestValues> = {};

  if (source.kind === "car") {
    sourceValues.selectionMode = "specific";
    sourceValues.vehicleQuery = source.vehicleLabel;
    sourceValues.country = source.country;
    sourceValues.condition = source.condition ?? "";
  }

  if (source.kind === "calculator") {
    sourceValues.country = source.country;
    sourceValues.budgetRub = source.budgetRub ? String(source.budgetRub) : "";
    sourceValues.deliveryCity = source.deliveryCity ?? "";
    if (source.vehicleLabel) {
      sourceValues.selectionMode = "specific";
      sourceValues.vehicleQuery = source.vehicleLabel;
    }
  }

  return {
    ...EMPTY_CAR_SELECTION_REQUEST,
    ...sourceValues,
    ...initialValues,
  };
}
