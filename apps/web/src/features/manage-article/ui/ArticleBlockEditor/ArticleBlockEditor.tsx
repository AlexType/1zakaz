"use client";

import { useMemo } from "react";
import { filterSuggestionItems } from "@blocknote/core";
import { ru } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import { useComputedColorScheme } from "@mantine/core";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import type { ArticleContent } from "@/entities/article";
import { hasMeaningfulArticleContent } from "../../lib/is-meaningful-article";
import type { ArticleBodyEditorProps } from "../ArticleBodyEditor/ArticleBodyEditor";
import {
  ArticleImageUploadContext,
  articleBlockSchema,
  articleCustomSlashItems,
  type ArticlePartialBlock,
} from "../ArticleBodyEditor/article-block-schema";
import classes from "../ArticleBodyEditor/ArticleBodyEditor.module.css";

const EMPTY_CONTENT: ArticlePartialBlock[] = [{ type: "paragraph" }];

export function ArticleBlockEditor({
  initialValue,
  onChange,
  uploadImage,
  readOnly = false,
}: ArticleBodyEditorProps) {
  const colorScheme = useComputedColorScheme("light");
  const initialContent = useMemo(
    () =>
      (initialValue.length
        ? initialValue
        : EMPTY_CONTENT) as ArticlePartialBlock[],
    [initialValue],
  );
  const editor = useCreateBlockNote({
    schema: articleBlockSchema,
    initialContent,
    dictionary: ru,
    uploadFile: uploadImage,
  });

  return (
    <ArticleImageUploadContext.Provider value={uploadImage}>
      <BlockNoteView
        className={`${classes.editor} ${readOnly ? classes.readOnly : ""}`}
        editor={editor}
        theme={colorScheme}
        editable={!readOnly}
        slashMenu={readOnly ? false : undefined}
        sideMenu={readOnly ? false : undefined}
        formattingToolbar={readOnly ? false : undefined}
        onChange={() => {
          const content = editor.document as ArticleContent;
          onChange?.(content, hasMeaningfulArticleContent(content));
        }}
      >
        {!readOnly && (
          <SuggestionMenuController
            triggerCharacter="/"
            getItems={async (query) =>
              filterSuggestionItems(
                [
                  ...getDefaultReactSlashMenuItems(editor),
                  ...articleCustomSlashItems(editor),
                ],
                query,
              )
            }
          />
        )}
      </BlockNoteView>
    </ArticleImageUploadContext.Provider>
  );
}
