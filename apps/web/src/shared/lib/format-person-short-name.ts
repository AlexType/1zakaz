/** Expects a person's full name in "Фамилия Имя Отчество" order. */
export function formatPersonShortName(name: string): string {
  const [surname, firstName, patronymic] = name.trim().split(/\s+/);
  if (!firstName) return surname;
  return `${surname} ${firstName[0]}.${patronymic ? `${patronymic[0]}.` : ""}`;
}

export function getPersonInitials(name: string): string {
  const [surname, firstName] = name.trim().split(/\s+/);
  return `${surname?.[0] ?? ""}${firstName?.[0] ?? ""}`.toLocaleUpperCase(
    "ru-RU",
  );
}
