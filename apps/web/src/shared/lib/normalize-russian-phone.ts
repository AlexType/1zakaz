export function normalizeRussianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
  return /^7\d{10}$/.test(normalized) ? `+${normalized}` : null;
}
