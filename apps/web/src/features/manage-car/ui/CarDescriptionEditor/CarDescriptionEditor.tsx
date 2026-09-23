"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import classes from "./CarDescriptionEditor.module.css";

type CarDescriptionEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export function CarDescriptionEditor({
  value,
  onChange,
}: CarDescriptionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      Placeholder.configure({
        placeholder: "Особенности, комплектация, состояние автомобиля",
      }),
    ],
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  return (
    <div>
      <label className={classes.label}>Описание</label>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset="0">
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content
          aria-label="Описание автомобиля"
          className={classes.content}
        />
      </RichTextEditor>
    </div>
  );
}
