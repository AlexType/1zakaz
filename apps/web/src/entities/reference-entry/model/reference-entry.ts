export type ReferenceCategoryId =
  | "brands"
  | "models"
  | "body-types"
  | "colors"
  | "fuel-types"
  | "transmissions"
  | "drives"
  | "steering-wheels"
  | "article-categories"
  | "cities"
  | "lead-sources"
  | "lead-loss-reasons"
  | "lead-stages";

export type ReferenceEntry = {
  id: string;
  categoryId: ReferenceCategoryId;
  name: string;
  code: string;
  details: string;
  colorHex: string | null;
  active: boolean;
  locked: boolean;
  usedCount: number;
  updatedAt: string;
};

export type ReferenceCategory = {
  id: ReferenceCategoryId;
  label: string;
  description: string;
};
