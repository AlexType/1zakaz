"use client";

import dynamic from "next/dynamic";
import { Skeleton, Stack } from "@mantine/core";
import type { ArticleContent } from "@/entities/article";
import type { UploadArticleImage } from "../../lib/mock-upload-article-image";

export type ArticleBodyEditorProps = {
  initialValue: ArticleContent;
  onChange?: (value: ArticleContent, hasContent: boolean) => void;
  uploadImage: UploadArticleImage;
  readOnly?: boolean;
};

const ArticleBlockEditor = dynamic(
  () =>
    import("../ArticleBlockEditor/ArticleBlockEditor").then(
      (module) => module.ArticleBlockEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <Stack gap="sm" py="md">
        <Skeleton height={22} width="75%" />
        <Skeleton height={16} />
        <Skeleton height={16} width="90%" />
      </Stack>
    ),
  },
);

export function ArticleBodyEditor(props: ArticleBodyEditorProps) {
  return <ArticleBlockEditor {...props} />;
}
