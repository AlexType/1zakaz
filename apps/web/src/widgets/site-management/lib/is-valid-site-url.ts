export function isValidSiteUrl(value: string) {
  const url = value.trim();
  return url.startsWith("/") || /^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(url);
}
