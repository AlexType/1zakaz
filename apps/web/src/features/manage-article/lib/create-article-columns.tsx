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
import { GridPhotoCell } from "@/shared/ui/GridPhotoCell";
import classes from "../ui/ArticleList/ArticleList.module.css";

export type ArticleFilters = {
  photo: string;
  title: string;
  category: string;
  status: string;
  author: string;
};
type Options = {
  categories: ArticleCategory[];
  onEdit: (article: Article) => void;
  onSetStatus: (article: Article, status: ArticleStatus) => void;
  onPreviewPhoto: (article: Article) => void;
};

export function createArticleColumns({
  categories,
  onEdit,
  onSetStatus,
  onPreviewPhoto,
}: Options): DataTableColumn<Article>[] {
  return [
    {
      accessor: "coverUrl",
      title: "Фото",
      width: 104,
      textAlign: "center",
      pinned: "left",
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
