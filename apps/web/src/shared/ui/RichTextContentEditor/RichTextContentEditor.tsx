"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import classes from "./RichTextContentEditor.module.css";

type RichTextContentEditorProps = {
  initialValue: JSONContent;
  label: string;
  placeholder: string;
  onChange?: (value: JSONContent, hasText: boolean) => void;
  readOnly?: boolean;
};

export function RichTextContentEditor({
  initialValue,
  label,
  placeholder,
  onChange,
  readOnly = false,
}: RichTextContentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      Placeholder.configure({ placeholder }),
    ],
    content: initialValue,
    editable: !readOnly,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: current }) =>
      onChange?.(current.getJSON(), !current.isEmpty),
  });

  return (
    <div>
      {!readOnly && <label className={classes.label}>{label}</label>}
      <RichTextEditor
        editor={editor}
        className={classes.editor}
        labels={{
          linkEditorInputLabel: "Адрес ссылки",
          linkEditorInputPlaceholder: "https://",
          linkEditorSave: "Сохранить",
          linkEditorExternalLink: "Открывать в новой вкладке",
          linkEditorInternalLink: "Открывать в этой вкладке",
        }}
      >
        {!readOnly && (
          <RichTextEditor.Toolbar sticky stickyOffset="0">
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Blockquote />
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content aria-label={label} />
      </RichTextEditor>
    </div>
  );
}
