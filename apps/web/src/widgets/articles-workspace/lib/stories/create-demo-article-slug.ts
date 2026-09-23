import { slugifyArticleTitle } from "./slugify-article-title";

export function createDemoArticleSlug(
  title: string,
  existingSlugs: string[],
): string {
  const base = slugifyArticleTitle(title) || "article";
  const taken = new Set(existingSlugs);
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
