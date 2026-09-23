import type { LeadStatus } from "./lead";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  "in-progress": "В работе",
  waiting: "Ожидает клиента",
  won: "Завершена",
  lost: "Закрыта",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "blue",
  "in-progress": "orange",
  waiting: "yellow",
  won: "green",
  lost: "gray",
};

export const LEAD_STATUS_OPTIONS = [
  { value: "new", label: LEAD_STATUS_LABELS.new },
  { value: "in-progress", label: LEAD_STATUS_LABELS["in-progress"] },
  { value: "waiting", label: LEAD_STATUS_LABELS.waiting },
  { value: "won", label: LEAD_STATUS_LABELS.won },
  { value: "lost", label: LEAD_STATUS_LABELS.lost },
] as const;
