import { slugify } from "@/shared/lib/slugify";

export function resolveArticleSlug(
  slug: string,
  title: string,
  existingSlugs: string[],
): string {
  const manualSlug = slugify(slug);
  if (manualSlug) return manualSlug;

  const base = slugify(title) || "article";
  const taken = new Set(existingSlugs);
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
