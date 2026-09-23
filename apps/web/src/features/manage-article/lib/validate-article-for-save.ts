import type { ArticleStatus } from "@/entities/article";

type Draft = {
  title: string;
  excerpt: string;
  categoryId: string | null;
  hasBody: boolean;
  status: ArticleStatus;
};

export function validateArticleForSave({
  title,
  excerpt,
  categoryId,
  hasBody,
  status,
}: Draft): string | null {
  if (!title.trim()) return "Укажите заголовок статьи.";
  if (status === "published" && (!categoryId || !excerpt.trim() || !hasBody))
    return "Для публикации нужны рубрика, краткое описание и текст статьи.";
  return null;
}
