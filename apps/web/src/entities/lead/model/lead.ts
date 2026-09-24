export type LeadCountry = "japan" | "china" | "korea";

export type LeadStatus = "new" | "in-progress" | "waiting" | "won" | "lost";

export type LeadVehicleType =
  "crossover" | "sedan" | "minivan" | "compact" | "pickup" | "other";

export type LeadVehicleCondition = "new" | "used" | "any";

export type LeadPurchaseTiming =
  "as-soon-as-possible" | "one-to-three-months" | "later" | "comparing";

export type LeadContactMethod = "telegram" | "whatsapp" | "phone";

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientName: string;
  phone: string;
  email: string | null;
  status: LeadStatus;
  source: string;
  country: LeadCountry | null;
  subject: string;
  message: string;
  vehicleQuery: string | null;
  vehicleType: LeadVehicleType | null;
  condition: LeadVehicleCondition | null;
  budgetRub: number | null;
  deliveryCity: string | null;
  purchaseTiming: LeadPurchaseTiming | null;
  wishes: string | null;
  preferredContactMethod: LeadContactMethod | null;
  managerName: string | null;
  managerAvatarUrl: string | null;
  nextActionAt: string | null;
  pageUrl: string;
  carLabel: string | null;
  calculationId: string | null;
  utm: {
    source: string | null;
    medium: string | null;
    campaign: string | null;
  } | null;
  notes: LeadNote[];
};

export type LeadNote = {
  id: string;
  authorName: string;
  createdAt: string;
  text: string;
};
