"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { Article, ArticleCategory } from "@/entities/article";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import {
  ArticleEditor,
  ArticleList,
  ARTICLE_CATEGORIES,
  resolveArticleSlug,
  type SaveArticleInput,
} from "@/features/manage-article";
import { DEMO_ARTICLES } from "../../lib/stories/demo-articles";

type ActiveArticle = { mode: "create" } | { mode: "edit"; id: string };

export function ArticlesWorkspace({
  initialArticles = DEMO_ARTICLES,
  initialView = "list",
  initialEditorMode = "edit",
  categories = ARTICLE_CATEGORIES,
  loading = false,
  error = null,
}: {
  initialArticles?: Article[];
  initialView?: "list" | "create" | "edit";
  initialEditorMode?: "edit" | "preview";
  categories?: ArticleCategory[];
  loading?: boolean;
  error?: string | null;
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [loadError, setLoadError] = useState(error);
  const [active, setActive] = useState<ActiveArticle | null>(() =>
    initialView === "create"
      ? { mode: "create" }
      : initialView === "edit" && initialArticles.length
        ? { mode: "edit", id: initialArticles[0].id }
        : null,
  );
  const [unpublish, setUnpublish] = useState<Article | null>(null);
  const objectUrls = useRef<string[]>([]);
  useEffect(() => () => objectUrls.current.forEach(URL.revokeObjectURL), []);

  async function save(input: SaveArticleInput) {
    const previous = input.id
      ? articles.find((article) => article.id === input.id)
      : active?.mode === "edit"
        ? articles.find((article) => article.id === active.id)
        : undefined;
    const now = new Date().toISOString();
    const coverUrl = input.coverFile
      ? URL.createObjectURL(input.coverFile)
      : input.removeCover
        ? null
        : (previous?.coverUrl ?? null);
    if (input.coverFile && coverUrl) objectUrls.current.push(coverUrl);
    const article: Article = {
      id: previous?.id ?? crypto.randomUUID(),
      title: input.title,
      slug: resolveArticleSlug(
        input.slug,
        input.title,
        articles
          .filter((item) => item.id !== previous?.id)
          .map((item) => item.slug),
      ),
      excerpt: input.excerpt,
      categoryId: input.categoryId,
      tags: input.tags,
      content: input.content,
      coverUrl,
      coverAlt: input.coverAlt,
      status: input.status,
      authorName: input.authorName,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      ogImageUrl: input.ogImageUsesCover ? coverUrl : input.ogImageUrl,
      updatedAt: now,
      publishedAt:
        input.status === "published"
          ? (input.publishedAt ?? previous?.publishedAt ?? now)
          : input.publishedAt,
    };
    setArticles((current) =>
      previous
        ? current.map((item) => (item.id === article.id ? article : item))
        : [article, ...current],
    );
    if (input.status === "published") showActionSuccess("Статья опубликована");
    return article;
  }

  const editingArticle =
    active?.mode === "edit"
      ? articles.find((article) => article.id === active.id)
      : undefined;
  return (
    <>
      {active ? (
        <ArticleEditor
          key={active.mode === "edit" ? active.id : "new"}
          initialArticle={editingArticle}
          categories={categories}
          onSave={save}
          onBack={() => setActive(null)}
          initialMode={initialEditorMode}
        />
      ) : (
        <ArticleList
          articles={articles}
          loading={loading}
          error={loadError}
          onRetry={() => setLoadError(null)}
          categories={categories}
          onCreate={() => setActive({ mode: "create" })}
          onEdit={(article) => setActive({ mode: "edit", id: article.id })}
          onSetStatus={(article, status) =>
            status === "published"
              ? setActive({ mode: "edit", id: article.id })
              : setUnpublish(article)
          }
        />
      )}
      <Modal
        opened={Boolean(unpublish)}
        onClose={() => setUnpublish(null)}
        title="Снять с публикации"
        centered
      >
        <Stack>
          <Text size="sm">
            Статья «{unpublish?.title}» перестанет открываться посетителям.
            Черновик сохранится.
          </Text>
          <Group justify="end">
            <Button variant="default" onClick={() => setUnpublish(null)}>
              Отмена
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (!unpublish) return;
                setArticles((current) =>
                  current.map((article) =>
                    article.id === unpublish.id
                      ? {
                          ...article,
                          status: "draft",
                          publishedAt: null,
                          updatedAt: new Date().toISOString(),
                        }
                      : article,
                  ),
                );
                setUnpublish(null);
                showActionSuccess("Статья снята с публикации");
              }}
            >
              Снять с публикации
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
