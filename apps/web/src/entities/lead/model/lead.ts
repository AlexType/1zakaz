export type LeadCountry = "japan" | "china" | "korea";

export type LeadStatus = "new" | "in-progress" | "waiting" | "won" | "lost";

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
  budgetRub: number | null;
  managerName: string | null;
  managerAvatarUrl: string | null;
  nextActionAt: string | null;
  pageUrl: string;
  carLabel: string | null;
  calculationId: string | null;
  notes: LeadNote[];
};

export type LeadNote = {
  id: string;
  authorName: string;
  createdAt: string;
  text: string;
};
