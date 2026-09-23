export function formatImageType(
  name: string,
  mimeType?: string,
): string | null {
  const type = mimeType?.split("/")[1] || name.split(".").pop();
  if (!type || type === name) return null;
  return type
    .toLowerCase()
    .replace("jpeg", "jpg")
    .replace("svg+xml", "svg")
    .toUpperCase();
}
