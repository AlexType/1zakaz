const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatCompactDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatCompactDateTime(value: string): string {
  const date = new Date(value);
  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}
