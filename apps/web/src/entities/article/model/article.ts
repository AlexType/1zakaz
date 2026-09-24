export type ArticleStatus = "draft" | "published";

export type ArticleContentBlock = {
  id?: string;
  type: string;
  props?: Record<string, boolean | number | string>;
  content?: unknown;
  children?: ArticleContentBlock[];
};

export type ArticleContent = ArticleContentBlock[];

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  tags: string[];
  coverUrl: string | null;
  coverAlt: string;
  content: ArticleContent;
  status: ArticleStatus;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string | null;
  updatedAt: string;
  publishedAt: string | null;
};

export type ArticleCategory = { id: string; name: string };
