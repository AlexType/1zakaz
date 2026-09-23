import {
  ActionIcon,
  Badge,
  Button,
  Menu,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import { IconDots, IconEdit } from "@tabler/icons-react";
import type { DataTableColumn } from "mantine-datatable";
import type {
  Article,
  ArticleCategory,
  ArticleStatus,
} from "@/entities/article";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { GridPersonCell } from "@/shared/ui/GridPersonCell";
import { GridSelectFilter, GridTextFilter } from "@/shared/ui/GridColumnFilter";
import { GridPhotoCell } from "@/shared/ui/GridPhotoCell";
import {
  ARTICLE_PHOTO_FILTER_OPTIONS,
  ARTICLE_STATUS_FILTER_OPTIONS,
} from "../model/article-options";
import classes from "../ui/ArticleList/ArticleList.module.css";

export type ArticleFilters = {
  photo: string;
  title: string;
  category: string;
  status: string;
  author: string;
};
type Options = {
  filters: ArticleFilters;
  categories: ArticleCategory[];
  authorOptions: { value: string; label: string }[];
  updateFilter: <K extends keyof ArticleFilters>(
    key: K,
    value: ArticleFilters[K],
  ) => void;
  onEdit: (article: Article) => void;
  onSetStatus: (article: Article, status: ArticleStatus) => void;
  onPreviewPhoto: (article: Article) => void;
};

export function createArticleColumns({
  filters,
  categories,
  authorOptions,
  updateFilter,
  onEdit,
  onSetStatus,
  onPreviewPhoto,
}: Options): DataTableColumn<Article>[] {
  const categoryOptions = [
    { value: "all", label: "Все рубрики" },
    ...categories.map(({ id, name }) => ({ value: id, label: name })),
  ];
  return [
    {
      accessor: "coverUrl",
      title: "Фото",
      width: 104,
      textAlign: "center",
      pinned: "left",
      filter: (
        <GridSelectFilter
          label="Фото"
          value={filters.photo}
          options={ARTICLE_PHOTO_FILTER_OPTIONS}
          onChange={(value) => updateFilter("photo", value)}
        />
      ),
      filtering: filters.photo !== "all",
      render: (article) => (
        <GridPhotoCell
          src={article.coverUrl}
          alt={`Обложка статьи ${article.title}`}
          openLabel={`Открыть обложку статьи ${article.title}`}
          onPreview={() => onPreviewPhoto(article)}
        />
      ),
    },
    {
      accessor: "title",
      title: "Статья",
      width: 300,
      sortable: true,
      resizable: true,
      filter: (
        <GridTextFilter
          label="Название статьи"
          value={filters.title}
          onChange={(value) => updateFilter("title", value)}
        />
      ),
      filtering: Boolean(filters.title.trim()),
      render: (article) => (
        <div className={classes.title}>
          <Button
            variant="transparent"
            p={0}
            h="auto"
            ta="left"
            onClick={() => onEdit(article)}
          >
            {article.title}
          </Button>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {article.excerpt || "Краткое описание не добавлено"}
          </Text>
        </div>
      ),
    },
    {
      accessor: "categoryId",
      title: "Рубрика",
      width: 175,
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      filter: (
        <GridSelectFilter
          label="Рубрика"
          value={filters.category}
          options={categoryOptions}
          onChange={(value) => updateFilter("category", value)}
        />
      ),
      filtering: filters.category !== "all",
      render: (article) =>
        categories.find((category) => category.id === article.categoryId)
          ?.name ?? "—",
    },
    {
      accessor: "status",
      title: "Публикация",
      width: 155,
      textAlign: "center",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      filter: (
        <GridSelectFilter
          label="Публикация"
          value={filters.status}
          options={ARTICLE_STATUS_FILTER_OPTIONS}
          onChange={(value) => updateFilter("status", value)}
        />
      ),
      filtering: filters.status !== "all",
      render: (article) => (
        <Badge
          color={article.status === "published" ? "green" : "gray"}
          variant="light"
          size="sm"
        >
          {article.status === "published" ? "Опубликована" : "Черновик"}
        </Badge>
      ),
    },
    {
      accessor: "authorName",
      title: "Автор",
      width: 190,
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      filter: (
        <GridSelectFilter
          label="Автор"
          value={filters.author}
          options={authorOptions}
          onChange={(value) => updateFilter("author", value)}
        />
      ),
      filtering: filters.author !== "all",
      render: (article) => <GridPersonCell name={article.authorName} />,
    },
    {
      accessor: "updatedAt",
      title: "Изменена",
      width: 150,
      textAlign: "right",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (article) => formatCompactDateTime(article.updatedAt),
    },
    {
      accessor: "publishedAt",
      title: "Опубликована",
      width: 150,
      textAlign: "right",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      defaultToggle: false,
      render: (article) =>
        article.publishedAt ? formatCompactDateTime(article.publishedAt) : "—",
    },
    {
      accessor: "actions",
      title: <VisuallyHidden>Действия</VisuallyHidden>,
      width: 70,
      textAlign: "center",
      pinned: "right",
      render: (article) => (
        <Menu withinPortal shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`Действия со статьёй ${article.title}`}
            >
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => onEdit(article)}
            >
              Редактировать
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                onSetStatus(
                  article,
                  article.status === "published" ? "draft" : "published",
                )
              }
            >
              {article.status === "published"
                ? "Снять с публикации"
                : "Опубликовать"}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
}
