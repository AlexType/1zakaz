import type { StaffRole, StaffStatus } from "@/entities/employee";

export const STAFF_ROLE_OPTIONS: { value: StaffRole; label: string }[] = [
  { value: "admin", label: "Администратор" },
  { value: "manager", label: "Менеджер" },
];

export const STAFF_STATUS_OPTIONS: { value: StaffStatus; label: string }[] = [
  { value: "active", label: "Работает" },
  { value: "invited", label: "Приглашён" },
  { value: "suspended", label: "Доступ закрыт" },
];

export const STAFF_COLUMNS_STORAGE_KEY = "staff-columns-v1";
export const STAFF_ROLE_FILTER_OPTIONS = [
  { value: "all", label: "Все роли" },
  ...STAFF_ROLE_OPTIONS,
];
export const STAFF_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Все статусы" },
  ...STAFF_STATUS_OPTIONS,
];
export const STAFF_COLUMN_LABELS = {
  role: "Роль",
  email: "Почта",
  phone: "Телефон",
  status: "Доступ",
  lastSeenAt: "Последний вход",
};
