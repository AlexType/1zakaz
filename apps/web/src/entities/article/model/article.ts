import type { JSONContent } from "@tiptap/react";

export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  coverUrl: string | null;
  body: JSONContent;
  status: ArticleStatus;
  authorName: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ArticleCategory = { id: string; name: string };
