"use client";

import { useState } from "react";
import {
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import type {
  LegalDocument,
  SiteArticleOption,
  SiteFormSettings,
} from "../../model/site-management";

type Props = {
  forms: SiteFormSettings[];
  articleOptions: SiteArticleOption[];
  documents: LegalDocument[];
  onSave: (form: SiteFormSettings) => void;
};

export function SiteFormsCard({
  forms,
  articleOptions,
  documents,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<SiteFormSettings | null>(
    forms[0] ? structuredClone(forms[0]) : null,
  );
  if (!draft) return null;

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} size="h3">
            Формы на сайте
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            Текст после отправки и материалы, которые посетитель увидит дальше.
          </Text>
        </div>
        <Select
          label="Сценарий"
          placeholder="Выберите форму"
          data={forms.map((form) => ({ value: form.id, label: form.name }))}
          value={draft.id}
          allowDeselect={false}
          onChange={(id) => {
            const form = forms.find((item) => item.id === id);
            if (form) setDraft(structuredClone(form));
          }}
        />
        <TextInput
          label="Заголовок после отправки"
          placeholder="Заявка отправлена"
          value={draft.successTitle}
          onChange={(event) =>
            setDraft({ ...draft, successTitle: event.currentTarget.value })
          }
        />
        <Textarea
          label="Сообщение"
          placeholder="Сообщите, что заявка принята"
          autosize
          minRows={3}
          value={draft.successMessage}
          onChange={(event) =>
            setDraft({ ...draft, successMessage: event.currentTarget.value })
          }
        />
        <TextInput
          label="Срок ответа"
          placeholder="Например, ответим в течение 30 минут"
          value={draft.responseTimeText}
          onChange={(event) =>
            setDraft({ ...draft, responseTimeText: event.currentTarget.value })
          }
        />
        <MultiSelect
          label="Полезные материалы"
          description="Выбираются из опубликованных статей. Название и адрес подставляются автоматически."
          placeholder="Выберите статьи"
          data={articleOptions}
          value={draft.suggestedArticleIds}
          searchable
          clearable
          onChange={(suggestedArticleIds) =>
            setDraft({ ...draft, suggestedArticleIds })
          }
        />
        <Select
          label="Согласие под формой"
          placeholder="Выберите документ"
          data={documents.map((document) => ({
            value: document.id,
            label: document.title,
          }))}
          value={draft.consentDocumentId}
          allowDeselect={false}
          onChange={(consentDocumentId) =>
            consentDocumentId && setDraft({ ...draft, consentDocumentId })
          }
        />
        <Group justify="flex-end">
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            disabled={
              !draft.successTitle.trim() ||
              !draft.successMessage.trim() ||
              !draft.responseTimeText.trim()
            }
            onClick={() => onSave(draft)}
          >
            Сохранить настройки
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
