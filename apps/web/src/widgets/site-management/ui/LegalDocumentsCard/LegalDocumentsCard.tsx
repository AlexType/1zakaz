"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Drawer,
  Paper,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy, IconPencil } from "@tabler/icons-react";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { RichTextContentEditor } from "@/shared/ui/RichTextContentEditor";
import type {
  LegalDocument,
  SitePageStatus,
} from "../../model/site-management";

type Props = {
  documents: LegalDocument[];
  onSave: (document: LegalDocument) => void;
};

export function LegalDocumentsCard({ documents, onSave }: Props) {
  const [draft, setDraft] = useState<LegalDocument | null>(null);
  return (
    <>
      <Paper withBorder radius="lg" p="lg">
        <Stack gap="lg">
          <div>
            <Title order={2} size="h3">
              Юридические документы
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Ссылки на опубликованные документы автоматически показываются
              рядом с формами и в подвале.
            </Text>
          </div>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Документ</Table.Th>
                <Table.Th>Адрес</Table.Th>
                <Table.Th>Состояние</Table.Th>
                <Table.Th>Обновлён</Table.Th>
                <Table.Th w={56} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {documents.map((document) => (
                <Table.Tr key={document.id}>
                  <Table.Td fw={600}>{document.title}</Table.Td>
                  <Table.Td>{document.path}</Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={document.status === "published" ? "green" : "gray"}
                    >
                      {document.status === "published"
                        ? "Опубликован"
                        : "Черновик"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {formatCompactDateTime(document.updatedAt)}
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant="subtle"
                      px={8}
                      aria-label={`Редактировать ${document.title}`}
                      onClick={() => setDraft(structuredClone(document))}
                    >
                      <IconPencil size={17} />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
      <Drawer
        opened={Boolean(draft)}
        onClose={() => setDraft(null)}
        title="Редактирование документа"
        position="right"
        size="lg"
      >
        {draft && (
          <Stack gap="lg">
            <TextInput
              label="Название"
              placeholder="Название документа"
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.currentTarget.value })
              }
            />
            <TextInput
              label="Адрес страницы"
              placeholder="/document"
              value={draft.path}
              disabled
            />
            <RichTextContentEditor
              key={draft.id}
              label="Текст документа"
              placeholder="Введите текст документа"
              initialValue={draft.content}
              onChange={(content) => setDraft({ ...draft, content })}
            />
            <div>
              <Text size="sm" fw={500} mb={6}>
                Состояние
              </Text>
              <SegmentedControl
                data={[
                  { value: "draft", label: "Черновик" },
                  { value: "published", label: "Опубликован" },
                ]}
                value={draft.status}
                onChange={(value) =>
                  setDraft({ ...draft, status: value as SitePageStatus })
                }
              />
            </div>
            <Button
              leftSection={<IconDeviceFloppy size={18} />}
              onClick={() => {
                onSave({ ...draft, updatedAt: new Date().toISOString() });
                setDraft(null);
              }}
            >
              Сохранить документ
            </Button>
          </Stack>
        )}
      </Drawer>
    </>
  );
}
