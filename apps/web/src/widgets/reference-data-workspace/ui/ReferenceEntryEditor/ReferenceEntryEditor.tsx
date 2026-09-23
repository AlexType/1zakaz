"use client";

import { useState } from "react";
import {
  Button,
  ColorInput,
  Drawer,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import type {
  ReferenceCategory,
  ReferenceEntry,
} from "@/entities/reference-entry";

type Props = {
  opened: boolean;
  category: ReferenceCategory;
  entry: ReferenceEntry | null;
  onClose: () => void;
  onSave: (entry: ReferenceEntry) => void;
};

export function ReferenceEntryEditor({
  opened,
  category,
  entry,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<ReferenceEntry | null>(entry);
  if (!draft) return null;
  const colorEnabled =
    category.id === "colors" || category.id === "lead-stages";

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={entry?.id ? "Редактирование значения" : "Новое значение"}
      position="right"
      size="md"
    >
      <Stack gap="lg">
        <div>
          <Text fw={600}>{category.label}</Text>
          <Text size="sm" c="dimmed">
            {category.description}
          </Text>
        </div>
        <TextInput
          label="Название"
          placeholder="Введите название"
          value={draft.name}
          onChange={(event) =>
            setDraft({ ...draft, name: event.currentTarget.value })
          }
        />
        <TextInput
          label="Код"
          description="Стабильный идентификатор для API"
          placeholder="latin-code"
          value={draft.code}
          disabled={draft.locked}
          onChange={(event) =>
            setDraft({
              ...draft,
              code: event.currentTarget.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "-"),
            })
          }
        />
        <TextInput
          label={
            category.id === "models"
              ? "Марка"
              : category.id === "brands"
                ? "Страна"
                : "Связь или пояснение"
          }
          placeholder={
            category.id === "models"
              ? "Например, Toyota"
              : category.id === "brands"
                ? "Например, Япония"
                : "Необязательно"
          }
          value={draft.details}
          onChange={(event) =>
            setDraft({ ...draft, details: event.currentTarget.value })
          }
        />
        {colorEnabled && (
          <ColorInput
            label="Цвет"
            placeholder="#C92834"
            format="hex"
            value={draft.colorHex ?? ""}
            onChange={(colorHex) => setDraft({ ...draft, colorHex })}
          />
        )}
        <Switch
          label="Доступно для выбора"
          checked={draft.active}
          onChange={(event) =>
            setDraft({ ...draft, active: event.currentTarget.checked })
          }
        />
        {draft.usedCount > 0 && (
          <Text size="sm" c="dimmed">
            Значение используется в {draft.usedCount} записях. Отключение
            сохранит существующие данные.
          </Text>
        )}
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Отмена
          </Button>
          <Button
            disabled={!draft.name.trim() || !draft.code.trim()}
            onClick={() =>
              onSave({ ...draft, updatedAt: new Date().toISOString() })
            }
          >
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
