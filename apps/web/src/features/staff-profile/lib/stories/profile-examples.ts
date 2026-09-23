import type { StaffAccount } from "@/entities/employee";
import type { StaffProfileActions } from "../../model/contracts";

export const demoProfile: StaffAccount = {
  id: "staff-01",
  lastName: "Петрова",
  firstName: "Анна",
  patronymic: "Сергеевна",
  email: "anna@example.ru",
  phone: "+79991234567",
  avatarUrl: null,
  avatarSourceUrl: null,
  roleName: "Менеджер",
  passwordEnabled: false,
};

export const demoProfileActions: StaffProfileActions = {
  savePersonalDetails: async () => {},
  updateAvatar: async () => {},
  updatePhone: async () => {},
  requestEmailChange: async () => ({ challengeId: "storybook-email-change" }),
  confirmEmailChange: async (_challengeId, code) => {
    if (code !== "123456") throw new Error("Wrong demo code");
  },
  setPassword: async () => {},
};
