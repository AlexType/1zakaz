import { MantineProvider } from "@mantine/core";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { Article } from "@/entities/article";
import type { SaveArticleInput } from "./ArticleEditor";
import { ArticleEditor } from "./ArticleEditor";

vi.mock("../ArticleBodyEditor", () => ({
  ArticleBodyEditor: () => <div data-testid="block-editor" />,
}));

Object.defineProperty(document, "fonts", {
  configurable: true,
  value: {
    addEventListener: () => {},
    removeEventListener: () => {},
  },
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function toArticle(input: SaveArticleInput): Article {
  return {
    id: input.id ?? "article-1",
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    categoryId: input.categoryId,
    tags: input.tags,
    coverUrl: null,
    coverAlt: input.coverAlt,
    content: input.content,
    status: input.status,
    authorName: input.authorName,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    ogImageUrl: input.ogImageUrl,
    updatedAt: "2026-09-24T00:00:00Z",
    publishedAt: input.publishedAt,
  };
}

function renderEditor(onSave: (input: SaveArticleInput) => Promise<Article>) {
  render(
    <MantineProvider>
      <ArticleEditor
        categories={[{ id: "guides", name: "Гайды" }]}
        onSave={onSave}
        onBack={vi.fn()}
      />
    </MantineProvider>,
  );
}

it("не создаёт черновик, пока новая статья пуста", async () => {
  vi.useFakeTimers();
  const onSave = vi.fn(async (input: SaveArticleInput) => toArticle(input));
  renderEditor(onSave);

  await act(() => vi.advanceTimersByTimeAsync(2_000));

  expect(onSave).not.toHaveBeenCalled();
});

it("создаёт один черновик и обновляет его при следующих autosave", async () => {
  vi.useFakeTimers();
  const onSave = vi.fn(async (input: SaveArticleInput) => toArticle(input));
  renderEditor(onSave);

  fireEvent.change(screen.getByRole("textbox", { name: "Заголовок" }), {
    target: { value: "Как выбрать автомобиль" },
  });
  await act(() => vi.advanceTimersByTimeAsync(1_000));

  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave.mock.calls[0][0]).toMatchObject({
    id: undefined,
    status: "draft",
    slug: "kak-vybrat-avtomobil",
    seoTitle: "Как выбрать автомобиль",
  });

  fireEvent.change(screen.getByRole("textbox", { name: "Краткое описание" }), {
    target: { value: "Короткое введение" },
  });
  await act(() => vi.advanceTimersByTimeAsync(1_000));

  expect(onSave).toHaveBeenCalledTimes(2);
  expect(onSave.mock.calls[1][0]).toMatchObject({
    id: "article-1",
    seoDescription: "Короткое введение",
  });
});

it("автоматически обновляет адрес и позволяет перейти к ручному режиму", () => {
  const onSave = vi.fn(async (input: SaveArticleInput) => toArticle(input));
  renderEditor(onSave);

  const title = screen.getByRole("textbox", { name: "Заголовок" });
  fireEvent.change(title, { target: { value: "Автомобиль из Японии" } });

  const slug = screen.getByRole("textbox", { name: "Адрес" });
  expect(slug).toHaveValue("avtomobil-iz-yaponii");
  expect(slug).toHaveAttribute("readonly");

  fireEvent.click(
    screen.getByRole("button", { name: "Изменить адрес вручную" }),
  );
  fireEvent.change(slug, { target: { value: "special-offer" } });
  fireEvent.change(title, { target: { value: "Автомобиль из Кореи" } });
  expect(slug).toHaveValue("special-offer");

  fireEvent.click(
    screen.getByRole("button", { name: "Вернуть автозаполнение" }),
  );
  expect(slug).toHaveValue("avtomobil-iz-korei");
  expect(slug).toHaveAttribute("readonly");
});
