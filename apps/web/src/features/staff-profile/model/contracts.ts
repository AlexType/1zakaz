import type { StaffAccount } from "@/entities/employee";

export type SavePersonalDetails = (
  values: Pick<StaffAccount, "lastName" | "firstName" | "patronymic">,
) => Promise<void>;

export type AvatarChange = {
  file: File | null;
  originalFile: File | null;
  previewUrl: string | null;
  sourceUrl: string | null;
};

export type StaffProfileActions = {
  savePersonalDetails: SavePersonalDetails;
  updateAvatar: (file: File | null, originalFile: File | null) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  requestEmailChange: (email: string) => Promise<{ challengeId: string }>;
  confirmEmailChange: (challengeId: string, code: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
};
