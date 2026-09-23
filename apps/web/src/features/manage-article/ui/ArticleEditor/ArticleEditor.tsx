"use client";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  FileButton,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconPhoto,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import type { JSONContent } from "@tiptap/react";
import type {
  Article,
  ArticleCategory,
  ArticleStatus,
} from "@/entities/article";
import { showActionError } from "@/shared/lib/show-action-notification";
import { useUnsavedChanges } from "@/shared/lib/use-unsaved-changes";
import { EditorLayout } from "@/shared/ui/EditorLayout";
import { PhotoPreview } from "@/shared/ui/PhotoPreview";
import { UnsavedChangesModal } from "@/shared/ui/UnsavedChangesModal";
import { validateArticleForSave } from "../../lib/validate-article-for-save";
import { ArticleBodyEditor } from "../ArticleBodyEditor";
import classes from "./ArticleEditor.module.css";

export type SaveArticleInput = Pick<
  Article,
  "title" | "excerpt" | "categoryId" | "body" | "status"
> & {
  coverFile: File | null;
  removeCover: boolean;
};

type ArticleEditorProps = {
  initialArticle?: Article;
  categories: ArticleCategory[];
  onSave: (input: SaveArticleInput) => Promise<void>;
  onBack: () => void;
};

const EMPTY_BODY: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function ArticleEditor({
  initialArticle,
  categories,
  onSave,
  onBack,
}: ArticleEditorProps) {
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(
    initialArticle?.categoryId ?? null,
  );
  const [body, setBody] = useState<JSONContent>(
    initialArticle?.body ?? EMPTY_BODY,
  );
  const [hasBody, setHasBody] = useState(
    Boolean(initialArticle?.body.content?.some((node) => node.content?.length)),
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [localCoverUrl, setLocalCoverUrl] = useState<string | null>(null);
  const localCoverRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [view, setView] = useState<"edit" | "preview">("edit");

  useEffect(
    () => () => {
      if (localCoverRef.current) URL.revokeObjectURL(localCoverRef.current);
    },
    [],
  );

  function selectCover(file: File | null) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Загрузите JPG, PNG или WebP размером до 10 МБ.");
      return;
    }
    setError(null);
    if (localCoverRef.current) URL.revokeObjectURL(localCoverRef.current);
    const url = URL.createObjectURL(file);
    localCoverRef.current = url;
    setLocalCoverUrl(url);
    setCoverFile(file);
    setRemoveCover(false);
  }

  function clearCover() {
    if (localCoverRef.current) URL.revokeObjectURL(localCoverRef.current);
    localCoverRef.current = null;
    setCoverFile(null);
    setLocalCoverUrl(null);
    setRemoveCover(true);
  }

  const coverUrl =
    localCoverUrl ?? (removeCover ? null : (initialArticle?.coverUrl ?? null));
  const dirty =
    title !== (initialArticle?.title ?? "") ||
    excerpt !== (initialArticle?.excerpt ?? "") ||
    categoryId !== (initialArticle?.categoryId ?? null) ||
    JSON.stringify(body) !==
      JSON.stringify(initialArticle?.body ?? EMPTY_BODY) ||
    Boolean(coverFile) ||
    removeCover;
  useUnsavedChanges(dirty);

  function back() {
    if (dirty) setConfirmLeave(true);
    else onBack();
  }

  async function save(status: ArticleStatus) {
    setError(null);
    const validationError = validateArticleForSave({
      title,
      excerpt,
      categoryId,
      hasBody,
      status,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    try {
      await onSave({
        title: title.trim(),
        excerpt: excerpt.trim(),
        categoryId: categoryId ?? "",
        body,
        status,
        coverFile,
        removeCover,
      });
    } catch {
      showActionError(
        "Не удалось сохранить статью. Изменения остались в форме.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <EditorLayout
        title={initialArticle ? "Редактировать статью" : "Новая статья"}
        backLabel="К статьям"
        onBack={back}
        ariaLabel={initialArticle ? "Редактирование статьи" : "Создание статьи"}
        status={
          <Badge
            color={initialArticle?.status === "published" ? "green" : "gray"}
            variant="light"
          >
            {initialArticle?.status === "published"
              ? "Опубликована"
              : "Черновик"}
          </Badge>
        }
        toolbar={
          <SegmentedControl
            aria-label="Режим просмотра статьи"
            data={[
              { value: "edit", label: "Редактор" },
              { value: "preview", label: "Предпросмотр" },
            ]}
            value={view}
            onChange={(value) => setView(value as "edit" | "preview")}
          />
        }
        aside={
          view === "edit" ? (
            <Paper withBorder radius="lg" p="lg">
              <Stack gap="md">
                <Title order={2} size="h4">
                  Публикация
                </Title>
                <Select
                  label="Рубрика"
                  placeholder="Выберите рубрику"
                  data={categories.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  }))}
                  value={categoryId}
                  onChange={setCategoryId}
                  searchable
                />
                <Text size="sm" c="dimmed">
                  Адрес материала будет сформирован автоматически из заголовка.
                </Text>
              </Stack>
            </Paper>
          ) : undefined
        }
        actions={
          <>
            <Button variant="default" onClick={back} disabled={busy}>
              Отмена
            </Button>
            <Button
              variant="default"
              leftSection={<IconDeviceFloppy size={17} />}
              onClick={() => void save("draft")}
              loading={busy}
            >
              Сохранить черновик
            </Button>
            <Button
              leftSection={<IconSend size={17} />}
              onClick={() => void save("published")}
              loading={busy}
            >
              {initialArticle?.status === "published"
                ? "Сохранить и опубликовать"
                : "Опубликовать"}
            </Button>
          </>
        }
      >
        {error && (
          <Alert
            color="red"
            role="alert"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {view === "preview" ? (
          <Paper withBorder radius="lg" p="xl" maw={840} w="100%" mx="auto">
            <Stack gap="lg">
              {coverUrl && (
                <PhotoPreview
                  src={coverUrl}
                  alt="Обложка статьи"
                  className={classes.cover}
                />
              )}
              <Text size="sm" c="dimmed">
                {categories.find((category) => category.id === categoryId)
                  ?.name ?? "Без рубрики"}
              </Text>
              <Title order={2}>{title || "Без заголовка"}</Title>
              {excerpt && (
                <Text size="lg" c="dimmed">
                  {excerpt}
                </Text>
              )}
              <ArticleBodyEditor initialValue={body} readOnly />
            </Stack>
          </Paper>
        ) : (
          <>
            <Paper withBorder radius="lg" p="xl">
              <Stack gap="lg">
                <TextInput
                  label="Заголовок"
                  placeholder="Например, как привезти автомобиль из Японии"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                />
                <Textarea
                  label="Краткое описание"
                  description="Покажем в списке статей и в карточках ссылок."
                  placeholder="О чём эта статья и кому она полезна"
                  minRows={3}
                  autosize
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.currentTarget.value)}
                />
                <ArticleBodyEditor
                  initialValue={initialArticle?.body ?? EMPTY_BODY}
                  onChange={(value, present) => {
                    setBody(value);
                    setHasBody(present);
                  }}
                />
              </Stack>
            </Paper>
            <Paper withBorder radius="lg" p="xl">
              <Stack gap="md">
                <Title order={2} size="h3">
                  Обложка
                </Title>
                {coverUrl ? (
                  <PhotoPreview
                    src={coverUrl}
                    alt={`Обложка статьи ${title || "без названия"}`}
                    className={classes.cover}
                  />
                ) : (
                  <div className={classes.emptyCover}>
                    <Stack align="center" gap={4}>
                      <IconPhoto size={28} stroke={1.5} />
                      <Text size="sm">Изображение 16:9</Text>
                    </Stack>
                  </div>
                )}
                <Group gap="sm">
                  <FileButton
                    onChange={selectCover}
                    accept="image/png,image/jpeg,image/webp"
                  >
                    {(props) => (
                      <Button variant="light" {...props}>
                        {coverUrl ? "Заменить обложку" : "Загрузить обложку"}
                      </Button>
                    )}
                  </FileButton>
                  {coverUrl && (
                    <Button
                      variant="subtle"
                      color="gray"
                      leftSection={<IconX size={16} />}
                      onClick={clearCover}
                    >
                      Убрать
                    </Button>
                  )}
                </Group>
                <Text c="dimmed" size="xs">
                  JPG, PNG или WebP до 10 МБ. Горизонтальное фото лучше
                  смотрится в ленте.
                </Text>
              </Stack>
            </Paper>
          </>
        )}
      </EditorLayout>
      <UnsavedChangesModal
        opened={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onDiscard={onBack}
      />
    </>
  );
}
