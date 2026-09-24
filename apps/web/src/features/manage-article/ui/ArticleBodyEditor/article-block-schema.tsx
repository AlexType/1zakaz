import { createContext } from "react";
import { Button, FileButton, Image, Select, TextInput } from "@mantine/core";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultProps,
  type PartialBlock,
} from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { IconInfoCircle, IconPhotoPlus } from "@tabler/icons-react";
import type { UploadArticleImage } from "../../lib/mock-upload-article-image";
import classes from "./ArticleBodyEditor.module.css";

const CALLOUT_TONE_OPTIONS = [
  { value: "info", label: "Информация" },
  { value: "warning", label: "Важно" },
  { value: "success", label: "Совет" },
] as const;

export const ArticleImageUploadContext =
  createContext<UploadArticleImage | null>(null);

const CalloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      tone: { default: "info", values: ["info", "warning", "success"] },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => (
      <div
        className={`${classes.customBlock} ${classes.callout}`}
        data-tone={block.props.tone}
      >
        {editor.isEditable ? (
          <Select
            aria-label="Тип врезки"
            className={classes.blockSelect}
            contentEditable={false}
            value={block.props.tone}
            data={CALLOUT_TONE_OPTIONS}
            allowDeselect={false}
            size="xs"
            variant="unstyled"
            onChange={(tone) =>
              tone &&
              editor.updateBlock(block, {
                type: "callout",
                props: { tone: tone as typeof block.props.tone },
              })
            }
          />
        ) : (
          <IconInfoCircle size={20} aria-hidden />
        )}
        <div ref={contentRef} />
      </div>
    ),
  },
);

function parseGalleryImages(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

const GalleryBlock = createReactBlockSpec(
  {
    type: "gallery",
    propSchema: {
      images: { default: "[]" },
      columns: { default: 3, values: [2, 3] },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const images = parseGalleryImages(block.props.images);
      return (
        <ArticleImageUploadContext.Consumer>
          {(uploadImage) => (
            <div
              className={`${classes.customBlock} ${classes.gallery}`}
              contentEditable={false}
            >
              <div
                className={classes.galleryGrid}
                style={
                  {
                    "--gallery-columns": block.props.columns,
                  } as React.CSSProperties
                }
              >
                {images.map((url, index) => (
                  <Image
                    className={classes.galleryImage}
                    key={`${url}-${index}`}
                    src={url}
                    alt=""
                  />
                ))}
                {editor.isEditable && (
                  <FileButton
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={async (files) => {
                      if (!uploadImage || !files?.length) return;
                      const urls = await Promise.all(files.map(uploadImage));
                      editor.updateBlock(block, {
                        type: "gallery",
                        props: {
                          images: JSON.stringify([...images, ...urls]),
                        },
                      });
                    }}
                  >
                    {(props) => (
                      <Button
                        {...props}
                        className={classes.galleryPlaceholder}
                        variant="default"
                        leftSection={<IconPhotoPlus size={20} />}
                      >
                        {images.length ? "Добавить" : "Добавить изображения"}
                      </Button>
                    )}
                  </FileButton>
                )}
              </div>
            </div>
          )}
        </ArticleImageUploadContext.Consumer>
      );
    },
  },
);

const CtaBlock = createReactBlockSpec(
  {
    type: "cta",
    propSchema: {
      url: { default: "/catalog" },
      buttonLabel: { default: "Перейти" },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => (
      <div className={`${classes.customBlock} ${classes.cta}`}>
        <div className={classes.ctaContent} ref={contentRef} />
        {editor.isEditable ? (
          <div className={classes.ctaControls} contentEditable={false}>
            <TextInput
              aria-label="Ссылка CTA"
              classNames={{ input: classes.ctaInput }}
              size="xs"
              value={block.props.url}
              onChange={(event) =>
                editor.updateBlock(block, {
                  type: "cta",
                  props: { url: event.currentTarget.value },
                })
              }
            />
            <TextInput
              aria-label="Текст кнопки CTA"
              classNames={{ input: classes.ctaButtonInput }}
              size="xs"
              value={block.props.buttonLabel}
              onChange={(event) =>
                editor.updateBlock(block, {
                  type: "cta",
                  props: { buttonLabel: event.currentTarget.value },
                })
              }
            />
          </div>
        ) : (
          <div className={classes.ctaControls} contentEditable={false}>
            <Button component="span" variant="white" size="compact-sm">
              {block.props.buttonLabel}
            </Button>
          </div>
        )}
      </div>
    ),
  },
);

export const articleBlockSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    callout: CalloutBlock(),
    gallery: GalleryBlock(),
    cta: CtaBlock(),
  },
});

export type ArticlePartialBlock = PartialBlock<
  typeof articleBlockSchema.blockSchema,
  typeof articleBlockSchema.inlineContentSchema,
  typeof articleBlockSchema.styleSchema
>;

export const articleCustomSlashItems = (editor: {
  insertBlocks: (blocks: ArticlePartialBlock[], referenceBlock: string) => void;
  getTextCursorPosition: () => { block: { id: string } };
}) => [
  {
    title: "Врезка",
    subtext: "Важная мысль, совет или предупреждение",
    aliases: ["callout", "info", "важно", "совет"],
    group: "Первый Заказ",
    icon: <IconInfoCircle size={18} />,
    onItemClick: () =>
      editor.insertBlocks(
        [{ type: "callout", content: "Введите текст врезки" }],
        editor.getTextCursorPosition().block.id,
      ),
  },
  {
    title: "Галерея",
    subtext: "Несколько фотографий в одном блоке",
    aliases: ["gallery", "фото", "изображения"],
    group: "Первый Заказ",
    icon: <IconPhotoPlus size={18} />,
    onItemClick: () =>
      editor.insertBlocks(
        [{ type: "gallery" }],
        editor.getTextCursorPosition().block.id,
      ),
  },
  {
    title: "Призыв",
    subtext: "Призыв к действию со ссылкой",
    aliases: ["cta", "кнопка", "ссылка"],
    group: "Первый Заказ",
    icon: <span aria-hidden>→</span>,
    onItemClick: () =>
      editor.insertBlocks(
        [{ type: "cta", content: "Подберите автомобиль под свой бюджет" }],
        editor.getTextCursorPosition().block.id,
      ),
  },
];
