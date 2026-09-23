"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { Article } from "@/entities/article";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import {
  ArticleEditor,
  ArticleList,
  ARTICLE_CATEGORIES,
  type SaveArticleInput,
} from "@/features/manage-article";
import { DEMO_ARTICLES } from "../../lib/stories/demo-articles";
import { createDemoArticleSlug } from "../../lib/stories/create-demo-article-slug";

type ActiveArticle = { mode: "create" } | { mode: "edit"; id: string };

export function ArticlesWorkspace({
  initialArticles = DEMO_ARTICLES,
  initialView = "list",
  loading = false,
  error = null,
}: {
  initialArticles?: Article[];
  initialView?: "list" | "create" | "edit";
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
    const previous =
      active?.mode === "edit"
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
      slug:
        previous?.slug ??
        createDemoArticleSlug(
          input.title,
          articles.map((item) => item.slug),
        ),
      excerpt: input.excerpt,
      categoryId: input.categoryId,
      body: input.body,
      coverUrl,
      status: input.status,
      authorName: previous?.authorName ?? "Орлов Михаил Петрович",
      updatedAt: now,
      publishedAt:
        input.status === "published" ? (previous?.publishedAt ?? now) : null,
    };
    setArticles((current) =>
      previous
        ? current.map((item) => (item.id === article.id ? article : item))
        : [article, ...current],
    );
    showActionSuccess(
      input.status === "published"
        ? "Статья опубликована"
        : "Черновик сохранён",
    );
    setActive(null);
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
          categories={ARTICLE_CATEGORIES}
          onSave={save}
          onBack={() => setActive(null)}
        />
      ) : (
        <ArticleList
          articles={articles}
          loading={loading}
          error={loadError}
          onRetry={() => setLoadError(null)}
          categories={ARTICLE_CATEGORIES}
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
