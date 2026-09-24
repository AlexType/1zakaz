"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Divider,
  Drawer,
  FileButton,
  Group,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconPhoto,
  IconSend,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import type {
  Article,
  ArticleCategory,
  ArticleContent,
  ArticleStatus,
} from "@/entities/article";
import { showActionError } from "@/shared/lib/show-action-notification";
import { slugify } from "@/shared/lib/slugify";
import { useUnsavedChanges } from "@/shared/lib/use-unsaved-changes";
import { DateTimeInput } from "@/shared/ui/DateTimeInput";
import { PhotoPreview } from "@/shared/ui/PhotoPreview";
import { UnsavedChangesModal } from "@/shared/ui/UnsavedChangesModal";
import { isMeaningfulArticle } from "../../lib/is-meaningful-article";
import type { UploadArticleImage } from "../../lib/mock-upload-article-image";
import { mockUploadArticleImage } from "../../lib/mock-upload-article-image";
import { validateArticleForSave } from "../../lib/validate-article-for-save";
import {
  ARTICLE_AUTHORS,
  ARTICLE_AUTOSAVE_DELAY,
  ARTICLE_STATUSES,
} from "../../model/article-editor-options";
import { ArticleBodyEditor } from "../ArticleBodyEditor";
import classes from "./ArticleEditor.module.css";

export type SaveArticleInput = Pick<
  Article,
  | "title"
  | "excerpt"
  | "categoryId"
  | "tags"
  | "coverAlt"
  | "content"
  | "status"
  | "authorName"
  | "slug"
  | "seoTitle"
  | "seoDescription"
  | "publishedAt"
> & {
  id?: string;
  coverFile: File | null;
  removeCover: boolean;
  ogImageUrl: string | null;
  ogImageUsesCover: boolean;
};

type ArticleEditorProps = {
  initialArticle?: Article;
  categories: ArticleCategory[];
  onSave: (input: SaveArticleInput) => Promise<Article>;
  onBack: () => void;
  uploadImage?: UploadArticleImage;
  initialMode?: "edit" | "preview";
};

type SaveState = "idle" | "saving" | "saved" | "error";

const EMPTY_CONTENT: ArticleContent = [{ type: "paragraph", content: [] }];

export function ArticleEditor({
  initialArticle,
  categories,
  onSave,
  onBack,
  uploadImage = mockUploadArticleImage,
  initialMode = "edit",
}: ArticleEditorProps) {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [mode, setMode] = useState<"edit" | "preview">(initialMode);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? "");
  const [content, setContent] = useState<ArticleContent>(
    initialArticle?.content ?? EMPTY_CONTENT,
  );
  const [hasContent, setHasContent] = useState(
    initialArticle
      ? isMeaningfulArticle({
          title: "",
          excerpt: "",
          content: initialArticle.content,
          hasCover: false,
        })
      : false,
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initialArticle?.categoryId ?? null,
  );
  const [tags, setTags] = useState(initialArticle?.tags ?? []);
  const [authorName, setAuthorName] = useState(
    initialArticle?.authorName ?? ARTICLE_AUTHORS[1],
  );
  const [status, setStatus] = useState<ArticleStatus>(
    initialArticle?.status ?? "draft",
  );
  const [publishedAt, setPublishedAt] = useState<string | null>(
    initialArticle?.publishedAt ?? null,
  );
  const [slug, setSlug] = useState(initialArticle?.slug ?? "");
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialArticle?.seoDescription ?? "",
  );
  const [coverAlt, setCoverAlt] = useState(initialArticle?.coverAlt ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [localCoverUrl, setLocalCoverUrl] = useState<string | null>(null);
  const [ogImageUrl, setOgImageUrl] = useState(
    initialArticle?.ogImageUrl ?? null,
  );
  const [ogImageUsesCover, setOgImageUsesCover] = useState(
    !initialArticle?.ogImageUrl ||
      initialArticle.ogImageUrl === initialArticle.coverUrl,
  );
  const [slugTouched, setSlugTouched] = useState(
    Boolean(
      initialArticle && initialArticle.slug !== slugify(initialArticle.title),
    ),
  );
  const [seoTitleTouched, setSeoTitleTouched] = useState(
    Boolean(initialArticle),
  );
  const [seoDescriptionTouched, setSeoDescriptionTouched] = useState(
    Boolean(initialArticle),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [revision, setRevision] = useState(0);
  const [persistedId, setPersistedId] = useState(initialArticle?.id);
  const localCoverRef = useRef<string | null>(null);
  const latestRef = useRef<SaveArticleInput | null>(null);

  const coverUrl =
    localCoverUrl ?? (removeCover ? null : (initialArticle?.coverUrl ?? null));
  useEffect(
    () => () => {
      if (localCoverRef.current) URL.revokeObjectURL(localCoverRef.current);
    },
    [],
  );

  useEffect(() => {
    latestRef.current = {
      id: persistedId,
      title: title.trim(),
      excerpt: excerpt.trim(),
      categoryId: categoryId ?? "",
      tags,
      coverAlt: coverAlt.trim(),
      content,
      status,
      authorName,
      slug: slug.trim(),
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      publishedAt,
      coverFile,
      removeCover,
      ogImageUrl: ogImageUsesCover ? coverUrl : ogImageUrl,
      ogImageUsesCover,
    };
  }, [
    authorName,
    categoryId,
    content,
    coverAlt,
    coverFile,
    coverUrl,
    excerpt,
    ogImageUrl,
    ogImageUsesCover,
    persistedId,
    publishedAt,
    removeCover,
    seoDescription,
    seoTitle,
    slug,
    status,
    tags,
    title,
  ]);

  useEffect(() => {
    if (!revision || !latestRef.current) return;
    const current = latestRef.current;
    if (
      !current.id &&
      !isMeaningfulArticle({
        title: current.title,
        excerpt: current.excerpt,
        content: current.content,
        hasCover: Boolean(current.coverFile || coverUrl),
      })
    )
      return;

    const timeout = window.setTimeout(() => {
      setSaveState("saving");
      void onSave({
        ...current,
        id: current.id,
        status: current.id ? current.status : "draft",
      })
        .then((saved) => {
          setPersistedId(saved.id);
          setSaveState("saved");
        })
        .catch(() => setSaveState("error"));
    }, ARTICLE_AUTOSAVE_DELAY);
    return () => window.clearTimeout(timeout);
  }, [coverUrl, onSave, revision]);

  const dirty = revision > 0 && saveState !== "saved";
  useUnsavedChanges(dirty);

  function change(mutator: () => void) {
    mutator();
    setRevision((value) => value + 1);
    setSaveState("idle");
  }

  function changeTitle(value: string) {
    change(() => {
      setTitle(value);
      if (!slugTouched) setSlug(slugify(value));
      if (!seoTitleTouched) setSeoTitle(value);
      if (!coverAlt) setCoverAlt(value);
    });
  }

  function changeExcerpt(value: string) {
    change(() => {
      setExcerpt(value);
      if (!seoDescriptionTouched) setSeoDescription(value);
    });
  }

  function selectCover(file: File | null) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Загрузите JPG, PNG или WebP размером до 10 МБ.");
      return;
    }
    if (localCoverRef.current) URL.revokeObjectURL(localCoverRef.current);
    const url = URL.createObjectURL(file);
    localCoverRef.current = url;
    change(() => {
      setLocalCoverUrl(url);
      setCoverFile(file);
      setRemoveCover(false);
      setOgImageUsesCover(true);
    });
  }

  function clearCover() {
    if (localCoverRef.current) URL.revokeObjectURL(localCoverRef.current);
    localCoverRef.current = null;
    change(() => {
      setCoverFile(null);
      setLocalCoverUrl(null);
      setRemoveCover(true);
      if (ogImageUsesCover) setOgImageUrl(null);
    });
  }

  function back() {
    if (dirty) setConfirmLeave(true);
    else onBack();
  }

  async function publish() {
    const current = latestRef.current;
    if (!current) return;
    const validationError = validateArticleForSave({
      title,
      excerpt,
      categoryId,
      hasBody: hasContent,
      status: "published",
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaveState("saving");
    try {
      const saved = await onSave({
        ...current,
        id: persistedId,
        status: "published",
        publishedAt: current.publishedAt ?? new Date().toISOString(),
      });
      setPersistedId(saved.id);
      setStatus("published");
      setSaveState("saved");
      onBack();
    } catch {
      setSaveState("error");
      showActionError(
        "Не удалось опубликовать статью. Изменения сохранены в форме.",
      );
    }
  }

  const settings = (
    <Stack gap="md">
      <div>
        <Text fw={600} size="sm">
          Публикация
        </Text>
        <Text c="dimmed" size="xs">
          Основные параметры материала
        </Text>
      </div>
      <Select
        label="Статус"
        data={ARTICLE_STATUSES}
        value={status}
        onChange={(value) =>
          value && change(() => setStatus(value as ArticleStatus))
        }
      />
      <Select
        label="Категория"
        placeholder="Выберите категорию"
        data={categories.map(({ id, name }) => ({ value: id, label: name }))}
        value={categoryId}
        onChange={(value) => change(() => setCategoryId(value))}
        searchable
      />
      <TagsInput
        label="Теги"
        placeholder="Введите тег и нажмите Enter"
        value={tags}
        onChange={(value) => change(() => setTags(value))}
        splitChars={[","]}
      />
      <Select
        label="Автор"
        data={ARTICLE_AUTHORS}
        value={authorName}
        onChange={(value) => value && change(() => setAuthorName(value))}
      />
      <DateTimeInput
        label="Дата публикации"
        placeholder="При публикации"
        value={publishedAt}
        onChange={(value) => change(() => setPublishedAt(value))}
      />
      <Divider />
      <Accordion variant="separated" radius="md" defaultValue="address">
        <Accordion.Item value="address">
          <Accordion.Control>Адрес и SEO</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <TextInput
                label="Адрес"
                value={slug}
                leftSection={<Text size="xs">/</Text>}
                readOnly={!slugTouched}
                onChange={(event) => {
                  setSlugTouched(true);
                  change(() => setSlug(slugify(event.currentTarget.value)));
                }}
              />
              <Button
                variant="subtle"
                size="compact-sm"
                w="fit-content"
                onClick={() => {
                  if (slugTouched) {
                    change(() => setSlug(slugify(title)));
                  }
                  setSlugTouched((value) => !value);
                }}
              >
                {slugTouched
                  ? "Вернуть автозаполнение"
                  : "Изменить адрес вручную"}
              </Button>
              <TextInput
                label="Заголовок для поиска"
                value={seoTitle}
                maxLength={70}
                onChange={(event) => {
                  setSeoTitleTouched(true);
                  change(() => setSeoTitle(event.currentTarget.value));
                }}
              />
              <Textarea
                label="Описание для поиска"
                value={seoDescription}
                minRows={3}
                maxLength={180}
                onChange={(event) => {
                  setSeoDescriptionTouched(true);
                  change(() => setSeoDescription(event.currentTarget.value));
                }}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="social">
          <Accordion.Control>Социальные сети</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <Text size="xs" c="dimmed">
                По умолчанию используется обложка статьи.
              </Text>
              <TextInput
                label="Картинка для соцсетей"
                placeholder="Ссылка на изображение"
                value={ogImageUsesCover ? (coverUrl ?? "") : (ogImageUrl ?? "")}
                disabled={ogImageUsesCover}
                onChange={(event) =>
                  change(() => {
                    setOgImageUsesCover(false);
                    setOgImageUrl(event.currentTarget.value || null);
                  })
                }
              />
              <Button
                variant="subtle"
                size="compact-sm"
                onClick={() =>
                  change(() => setOgImageUsesCover(!ogImageUsesCover))
                }
              >
                {ogImageUsesCover ? "Задать другое" : "Использовать обложку"}
              </Button>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );

  return (
    <section className={classes.root} aria-label="Редактор статьи">
      <header className={classes.topbar}>
        <Group wrap="nowrap" justify="space-between" gap="sm">
          <Group wrap="nowrap" gap="xs" className={classes.topbarLead}>
            <Button
              variant="subtle"
              color="gray"
              size="compact-sm"
              leftSection={<IconArrowLeft size={16} />}
              onClick={back}
            >
              <span className={classes.backLabel}>Статьи</span>
            </Button>
            <Divider orientation="vertical" />
            <div className={classes.saveStatus} aria-live="polite">
              {saveState === "saving" && (
                <Text size="xs" c="dimmed">
                  Сохраняем…
                </Text>
              )}
              {saveState === "saved" && (
                <Group gap={4} wrap="nowrap">
                  <IconCheck size={14} color="var(--mantine-color-green-6)" />
                  <Text size="xs" c="dimmed">
                    Сохранено
                  </Text>
                </Group>
              )}
              {saveState === "error" && (
                <Text size="xs" c="red">
                  Не сохранено
                </Text>
              )}
              {saveState === "idle" && (
                <Text size="xs" c="dimmed">
                  {persistedId ? "Автосохранение" : "Новая статья"}
                </Text>
              )}
            </div>
          </Group>
          <Group wrap="nowrap" gap="xs">
            {isMobile && mode === "edit" && (
              <Button
                variant="default"
                size="compact-sm"
                leftSection={<IconSettings size={16} />}
                onClick={() => setSettingsOpened(true)}
              >
                Настройки
              </Button>
            )}
            <Button
              variant="default"
              size="compact-sm"
              leftSection={<IconEye size={16} />}
              onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
            >
              {mode === "edit" ? "Предпросмотр" : "Редактор"}
            </Button>
            <Button
              size="compact-sm"
              leftSection={<IconSend size={16} />}
              loading={saveState === "saving"}
              onClick={() => void publish()}
            >
              Опубликовать
            </Button>
          </Group>
        </Group>
      </header>

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

      {mode === "preview" ? (
        <article className={classes.preview}>
          <Text size="sm" c="dimmed">
            {categories.find((category) => category.id === categoryId)?.name ??
              "Без категории"}
          </Text>
          <Title order={1} className={classes.previewTitle}>
            {title || "Без заголовка"}
          </Title>
          {excerpt && (
            <Text size="lg" c="dimmed" className={classes.previewExcerpt}>
              {excerpt}
            </Text>
          )}
          {coverUrl && (
            <PhotoPreview
              src={coverUrl}
              alt={coverAlt || title}
              className={classes.previewCover}
            />
          )}
          <ArticleBodyEditor
            initialValue={content}
            uploadImage={uploadImage}
            readOnly
          />
        </article>
      ) : (
        <div className={classes.layout}>
          <main className={classes.canvas}>
            <Textarea
              aria-label="Заголовок"
              classNames={{ input: classes.titleInput }}
              placeholder="Заголовок статьи"
              value={title}
              autosize
              minRows={1}
              onChange={(event) => changeTitle(event.currentTarget.value)}
            />
            <Textarea
              aria-label="Краткое описание"
              classNames={{ input: classes.excerptInput }}
              placeholder="Кратко расскажите, о чём материал"
              value={excerpt}
              autosize
              minRows={2}
              onChange={(event) => changeExcerpt(event.currentTarget.value)}
            />

            <div className={classes.coverSection}>
              {coverUrl ? (
                <div className={classes.coverWrap}>
                  <PhotoPreview
                    src={coverUrl}
                    alt={coverAlt || title}
                    className={classes.cover}
                  />
                  <Group className={classes.coverActions} gap="xs">
                    <FileButton
                      onChange={selectCover}
                      accept="image/png,image/jpeg,image/webp"
                    >
                      {(props) => (
                        <Button size="compact-sm" variant="white" {...props}>
                          Заменить
                        </Button>
                      )}
                    </FileButton>
                    <Button
                      size="compact-sm"
                      variant="white"
                      color="gray"
                      onClick={clearCover}
                    >
                      <IconX size={15} />
                    </Button>
                  </Group>
                </div>
              ) : (
                <FileButton
                  onChange={selectCover}
                  accept="image/png,image/jpeg,image/webp"
                >
                  {(props) => (
                    <button
                      className={classes.emptyCover}
                      type="button"
                      {...props}
                    >
                      <IconPhoto size={22} />
                      <span>Добавить обложку</span>
                    </button>
                  )}
                </FileButton>
              )}
              {(coverUrl || coverAlt) && (
                <TextInput
                  label="Описание обложки (alt)"
                  value={coverAlt}
                  onChange={(event) =>
                    change(() => setCoverAlt(event.currentTarget.value))
                  }
                />
              )}
            </div>

            <Divider />
            <ArticleBodyEditor
              initialValue={initialArticle?.content ?? EMPTY_CONTENT}
              uploadImage={uploadImage}
              onChange={(value, present) => {
                setContent(value);
                setHasContent(present);
                setRevision((current) => current + 1);
                setSaveState("idle");
              }}
            />
          </main>
          {!isMobile && <aside className={classes.aside}>{settings}</aside>}
        </div>
      )}

      <Drawer
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        position="right"
        title="Настройки публикации"
        size="min(92vw, 380px)"
      >
        {settings}
      </Drawer>
      <UnsavedChangesModal
        opened={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onDiscard={onBack}
      />
    </section>
  );
}
