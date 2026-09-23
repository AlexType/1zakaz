import type { ArticleCategory } from "@/entities/article";

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { id: "guides", name: "Гайды" },
  { id: "delivery", name: "Доставка и оформление" },
  { id: "market", name: "Рынок и новости" },
];

export const ARTICLE_COLUMNS_STORAGE_KEY = "article-columns-v1";
export const ARTICLE_DENSITY_STORAGE_KEY = "article-density";
export const ARTICLE_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Все статусы" },
  { value: "draft", label: "Черновики" },
  { value: "published", label: "Опубликованы" },
];
export const ARTICLE_PHOTO_FILTER_OPTIONS = [
  { value: "all", label: "Все статьи" },
  { value: "with", label: "С обложкой" },
  { value: "without", label: "Без обложки" },
];
export const ARTICLE_COLUMN_LABELS = {
  categoryId: "Рубрика",
  status: "Статус",
  authorName: "Автор",
  updatedAt: "Изменена",
  publishedAt: "Опубликована",
};
