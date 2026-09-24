export type CarSelectionMode = "specific" | "help";

export type CarSelectionCountry = "japan" | "china" | "korea" | "unknown";

export type CarSelectionCondition = "new" | "used" | "any";

export type CarSelectionVehicleType =
  "crossover" | "sedan" | "minivan" | "compact" | "pickup" | "other";

export type CarSelectionPurchaseTiming =
  "" | "as-soon-as-possible" | "one-to-three-months" | "later" | "comparing";

export type CarSelectionContactMethod = "telegram" | "whatsapp" | "phone";

export type CarSelectionRequestValues = {
  selectionMode: CarSelectionMode | "";
  vehicleQuery: string;
  vehicleType: CarSelectionVehicleType | "";
  country: CarSelectionCountry | "";
  condition: CarSelectionCondition | "";
  budgetRub: string;
  deliveryCity: string;
  purchaseTiming: CarSelectionPurchaseTiming;
  wishes: string;
  clientName: string;
  phone: string;
  contactMethod: CarSelectionContactMethod | "";
  personalDataConsent: boolean;
};

export type CarSelectionRequestSubmission = CarSelectionRequestValues & {
  phone: string;
};

export type CarSelectionRequestSource =
  | {
      kind: "default";
    }
  | {
      kind: "car";
      carId: string;
      vehicleLabel: string;
      country: Exclude<CarSelectionCountry, "unknown">;
      condition?: Exclude<CarSelectionCondition, "any">;
    }
  | {
      kind: "calculator";
      calculationId: string;
      country: Exclude<CarSelectionCountry, "unknown">;
      vehicleLabel?: string;
      budgetRub?: number;
      deliveryCity?: string;
    };

export const EMPTY_CAR_SELECTION_REQUEST: CarSelectionRequestValues = {
  selectionMode: "",
  vehicleQuery: "",
  vehicleType: "",
  country: "",
  condition: "",
  budgetRub: "",
  deliveryCity: "",
  purchaseTiming: "",
  wishes: "",
  clientName: "",
  phone: "",
  contactMethod: "",
  personalDataConsent: false,
};

export type CarSelectionRequestStep = 0 | 1 | 2;
