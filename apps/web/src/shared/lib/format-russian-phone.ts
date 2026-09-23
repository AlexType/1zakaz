import { normalizeRussianPhone } from "./normalize-russian-phone";

export function formatRussianPhone(value: string): string {
  const normalized = normalizeRussianPhone(value);
  if (!normalized) return value;
  const digits = normalized.slice(2);
  return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
}
