export function formatFileSize(bytes: number): string {
  const unit = bytes >= 1024 * 1024 ? "МБ" : "КБ";
  const amount = unit === "МБ" ? bytes / (1024 * 1024) : bytes / 1024;
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(amount)} ${unit}`;
}
