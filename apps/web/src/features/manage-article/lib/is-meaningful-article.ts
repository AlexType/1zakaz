import type { ArticleContent } from "@/entities/article";

function valueHasText(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(valueHasText);
  if (value && typeof value === "object")
    return Object.values(value).some(valueHasText);
  return false;
}

export function hasMeaningfulArticleContent(content: ArticleContent) {
  return content.some((block) => {
    if (["gallery", "cta", "callout", "image", "video"].includes(block.type))
      return true;
    return (
      valueHasText(block.content) || Boolean(block.children?.some(valueHasText))
    );
  });
}

export function isMeaningfulArticle({
  title,
  excerpt,
  content,
  hasCover,
}: {
  title: string;
  excerpt: string;
  content: ArticleContent;
  hasCover: boolean;
}) {
  return Boolean(
    title.trim() ||
    excerpt.trim() ||
    hasCover ||
    hasMeaningfulArticleContent(content),
  );
}
