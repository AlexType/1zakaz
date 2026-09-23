"use client";

import type { JSONContent } from "@tiptap/react";
import { RichTextContentEditor } from "@/shared/ui/RichTextContentEditor";

type ArticleBodyEditorProps = {
  initialValue: JSONContent;
  onChange?: (value: JSONContent, hasText: boolean) => void;
  readOnly?: boolean;
};

export function ArticleBodyEditor({
  initialValue,
  onChange,
  readOnly = false,
}: ArticleBodyEditorProps) {
  return (
    <RichTextContentEditor
      initialValue={initialValue}
      label="Текст статьи"
      placeholder="Начните писать статью…"
      onChange={onChange}
      readOnly={readOnly}
    />
  );
}
