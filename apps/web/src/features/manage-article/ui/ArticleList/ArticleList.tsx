"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Paper, Select, Stack, Text, TextInput } from "@mantine/core";
import {
  DataTable,
  useDataTableColumns,
  type DataTableSortStatus,
} from "mantine-datatable";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import type {
  Article,
  ArticleCategory,
  ArticleStatus,
} from "@/entities/article";
import { GRID_PAGE_SIZE_OPTIONS } from "@/shared/lib/grid-options";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import { GridFiltersBar } from "@/shared/ui/GridFiltersBar";
import { PhotoLightbox } from "@/shared/ui/PhotoLightbox";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import {
  createArticleColumns,
  type ArticleFilters,
} from "../../lib/create-article-columns";
import {
  ARTICLE_COLUMN_LABELS,
  ARTICLE_COLUMNS_STORAGE_KEY,
  ARTICLE_PHOTO_FILTER_OPTIONS,
  ARTICLE_STATUS_FILTER_OPTIONS,
} from "../../model/article-options";
import classes from "./ArticleList.module.css";

type Props = {
  articles: Article[];
  categories: ArticleCategory[];
  onCreate: () => void;
  onEdit: (article: Article) => void;
  onSetStatus: (article: Article, status: ArticleStatus) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const INITIAL_FILTERS: ArticleFilters = {
  photo: "all",
  title: "",
  category: "all",
  status: "all",
  author: "all",
};

export function ArticleList({
  articles,
  categories,
  onCreate,
  onEdit,
  onSetStatus,
  loading = false,
  error = null,
  onRetry,
}: Props) {
  const [filters, setFilters] = useState<ArticleFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Article>>({
    columnAccessor: "updatedAt",
    direction: "desc",
  });
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => value !== INITIAL_FILTERS[key as keyof ArticleFilters],
  );
  const updateFilter = useCallback(
    <K extends keyof ArticleFilters>(key: K, value: ArticleFilters[K]) => {
      setFilters((current) => ({ ...current, [key]: value }));
      setPage(1);
    },
    [],
  );
  const authorOptions = useMemo(
    () => [
      { value: "all", label: "Все авторы" },
      ...[...new Set(articles.map((article) => article.authorName))]
        .sort((a, b) => a.localeCompare(b, "ru-RU"))
        .map((name) => ({ value: name, label: name })),
    ],
    [articles],
  );
  const filtered = useMemo(
    () =>
      articles
        .filter(
          (article) =>
            (filters.photo === "all" ||
              (filters.photo === "with"
                ? Boolean(article.coverUrl)
                : !article.coverUrl)) &&
            article.title
              .toLocaleLowerCase("ru-RU")
              .includes(filters.title.trim().toLocaleLowerCase("ru-RU")) &&
            (filters.category === "all" ||
              article.categoryId === filters.category) &&
            (filters.status === "all" || article.status === filters.status) &&
            (filters.author === "all" || article.authorName === filters.author),
        )
        .sort((left, right) => {
          const accessor = sortStatus.columnAccessor as keyof Article;
          const result = String(left[accessor] ?? "").localeCompare(
            String(right[accessor] ?? ""),
            "ru-RU",
          );
          return sortStatus.direction === "asc" ? result : -result;
        }),
    [articles, filters, sortStatus],
  );
  const columns = useMemo(
    () =>
      createArticleColumns({
        categories,
        onEdit,
        onSetStatus,
        onPreviewPhoto: setPreviewArticle,
      }),
    [categories, onEdit, onSetStatus],
  );
  const {
    effectiveColumns,
    columnsToggle,
    setColumnsToggle,
    resetColumnsToggle,
    resetColumnsOrder,
    resetColumnsWidth,
    resetColumnsPinning,
  } = useDataTableColumns({ key: ARTICLE_COLUMNS_STORAGE_KEY, columns });
  function resetView() {
    resetColumnsToggle();
    resetColumnsOrder();
    resetColumnsWidth();
    resetColumnsPinning();
  }
  return (
    <section className={classes.root} aria-label="Лента статей">
      <Stack gap="lg">
        <AdminPageHeader
          title="Статьи"
          description="Материалы для сайта"
          actions={
            <Button leftSection={<IconPlus size={18} />} onClick={onCreate}>
              Новая статья
            </Button>
          }
        />
        <Paper
          withBorder
          radius="lg"
          className={classes.paper}
          data-grid-density="compact"
        >
          {!error && (
            <>
              <GridFiltersBar>
                <TextInput
                  aria-label="Поиск статей"
                  placeholder="Название статьи"
                  leftSection={<IconSearch size={16} />}
                  value={filters.title}
                  onChange={(event) =>
                    updateFilter("title", event.currentTarget.value)
                  }
                />
                <Select
                  aria-label="Рубрика"
                  data={[
                    { value: "all", label: "Все рубрики" },
                    ...categories.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    })),
                  ]}
                  value={filters.category}
                  allowDeselect={false}
                  onChange={(value) => updateFilter("category", value ?? "all")}
                />
                <Select
                  aria-label="Статус публикации"
                  data={ARTICLE_STATUS_FILTER_OPTIONS}
                  value={filters.status}
                  allowDeselect={false}
                  onChange={(value) => updateFilter("status", value ?? "all")}
                />
                <Select
                  aria-label="Автор"
                  data={authorOptions}
                  value={filters.author}
                  allowDeselect={false}
                  onChange={(value) => updateFilter("author", value ?? "all")}
                />
                <Select
                  aria-label="Обложка"
                  data={ARTICLE_PHOTO_FILTER_OPTIONS}
                  value={filters.photo}
                  allowDeselect={false}
                  onChange={(value) => updateFilter("photo", value ?? "all")}
                />
              </GridFiltersBar>
              <div className={classes.toolbar}>
                <GridTableToolbar
                  loading={loading}
                  loadingLabel="Загружаем статьи…"
                  hasFilters={hasFilters}
                  onResetFilters={() => {
                    setFilters(INITIAL_FILTERS);
                    setPage(1);
                  }}
                  columnsToggle={columnsToggle}
                  onColumnsToggleChange={setColumnsToggle}
                  onResetView={resetView}
                  columnLabels={ARTICLE_COLUMN_LABELS}
                />
              </div>
            </>
          )}
          {error ? (
            <GridErrorState
              title="Не удалось загрузить статьи"
              message={error}
              onRetry={onRetry}
            />
          ) : (
            <DataTable
              records={filtered.slice((page - 1) * pageSize, page * pageSize)}
              columns={effectiveColumns}
              idAccessor="id"
              storeColumnsKey={ARTICLE_COLUMNS_STORAGE_KEY}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              horizontalSpacing="sm"
              verticalSpacing="xs"
              highlightOnHover
              fetching={loading}
              loadingText="Загружаем статьи…"
              minHeight={loading || filtered.length === 0 ? 280 : undefined}
              page={page}
              onPageChange={setPage}
              recordsPerPage={pageSize}
              totalRecords={filtered.length}
              recordsPerPageOptions={GRID_PAGE_SIZE_OPTIONS}
              onRecordsPerPageChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              recordsPerPageLabel="На странице"
              paginationText={({ from, to, totalRecords }) =>
                `${from}–${to} из ${totalRecords}`
              }
              emptyState={
                <Stack align="center" gap="xs" py="xl">
                  <Text fw={600}>
                    {articles.length ? "Статьи не найдены" : "Статей пока нет"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {articles.length
                      ? "Измените фильтры."
                      : "Создайте первый материал."}
                  </Text>
                  {hasFilters && (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setFilters(INITIAL_FILTERS);
                        setPage(1);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </Stack>
              }
            />
          )}
        </Paper>
      </Stack>
      <PhotoLightbox
        slides={
          previewArticle?.coverUrl
            ? [
                {
                  src: previewArticle.coverUrl,
                  alt: `Обложка статьи ${previewArticle.title}`,
                },
              ]
            : []
        }
        index={previewArticle ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setPreviewArticle(null)}
      />
    </section>
  );
}
