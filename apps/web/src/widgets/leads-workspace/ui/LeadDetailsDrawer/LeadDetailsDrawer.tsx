"use client";

import { useState } from "react";
import {
  Anchor,
  Badge,
  Button,
  Divider,
  Drawer,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconDeviceFloppy,
  IconExternalLink,
  IconPhone,
} from "@tabler/icons-react";
import {
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_OPTIONS,
  type Lead,
} from "@/entities/lead";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { formatRubles } from "@/shared/lib/format-rubles";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { DigitNumberInput } from "@/shared/ui/DigitNumberInput";
import {
  LEAD_COUNTRY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
} from "../../model/leads-options";

type Props = {
  lead: Lead;
  opened: boolean;
  managerOptions: { value: string; label: string }[];
  onClose: () => void;
  onSave: (lead: Lead) => void;
};

export function LeadDetailsDrawer({
  lead,
  opened,
  managerOptions,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState(structuredClone(lead));
  const [note, setNote] = useState("");
  const isNew = lead.id.startsWith("new-");

  function save() {
    const next = note.trim()
      ? {
          ...draft,
          notes: [
            ...draft.notes,
            {
              id: crypto.randomUUID(),
              authorName: draft.managerName ?? "Администратор",
              createdAt: new Date().toISOString(),
              text: note.trim(),
            },
          ],
        }
      : draft;
    onSave({ ...next, updatedAt: new Date().toISOString() });
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="xl"
      title={`Заявка ${lead.id}`}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="start">
          <div>
            <Title order={2} size="h3">
              {isNew ? "Новая заявка" : draft.clientName}
            </Title>
            {!isNew && (
              <Text size="sm" c="dimmed">
                Создана {formatCompactDateTime(draft.createdAt)}
              </Text>
            )}
          </div>
          <Badge variant="light" color={LEAD_STATUS_COLORS[draft.status]}>
            {LEAD_STATUS_LABELS[draft.status]}
          </Badge>
        </Group>
        {isNew ? (
          <Stack gap="md">
            <TextInput
              label="Имя клиента"
              placeholder="Как обращаться к клиенту"
              value={draft.clientName}
              onChange={(event) =>
                setDraft({ ...draft, clientName: event.currentTarget.value })
              }
            />
            <TextInput
              label="Телефон"
              placeholder="+7 999 000-00-00"
              value={draft.phone}
              onChange={(event) =>
                setDraft({ ...draft, phone: event.currentTarget.value })
              }
            />
            <TextInput
              label="Почта"
              placeholder="client@example.ru"
              value={draft.email ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, email: event.currentTarget.value || null })
              }
            />
            <Select
              label="Источник"
              placeholder="Выберите источник"
              data={LEAD_SOURCE_OPTIONS}
              value={draft.source}
              allowDeselect={false}
              onChange={(source) => source && setDraft({ ...draft, source })}
            />
            <Select
              label="Страна"
              placeholder="Выберите страну"
              data={LEAD_COUNTRY_OPTIONS}
              value={draft.country}
              clearable
              onChange={(country) =>
                setDraft({ ...draft, country: country as Lead["country"] })
              }
            />
            <TextInput
              label="Тема"
              placeholder="Например, подбор автомобиля"
              value={draft.subject}
              onChange={(event) =>
                setDraft({ ...draft, subject: event.currentTarget.value })
              }
            />
            <Textarea
              label="Сообщение"
              placeholder="Запрос клиента и важные подробности"
              autosize
              minRows={3}
              value={draft.message}
              onChange={(event) =>
                setDraft({ ...draft, message: event.currentTarget.value })
              }
            />
            <DigitNumberInput
              label="Бюджет"
              placeholder="Например, 2 500 000"
              suffix=" ₽"
              defaultValue={draft.budgetRub ? String(draft.budgetRub) : ""}
              onChange={(budgetRub) =>
                setDraft({
                  ...draft,
                  budgetRub: budgetRub === "" ? null : Number(budgetRub),
                })
              }
            />
          </Stack>
        ) : (
          <Paper withBorder radius="md" p="md">
            <Stack gap="xs">
              <Text fw={600}>Контакты</Text>
              <Anchor
                href={`tel:${draft.phone.replace(/\D/g, "")}`}
                c="inherit"
              >
                <Group gap="xs">
                  <IconPhone size={16} />
                  {formatRussianPhone(draft.phone)}
                </Group>
              </Anchor>
              {draft.email && (
                <Anchor href={`mailto:${draft.email}`}>{draft.email}</Anchor>
              )}
            </Stack>
          </Paper>
        )}
        <div>
          <Text size="sm" fw={600}>
            {draft.subject}
          </Text>
          {draft.message && (
            <Text size="sm" mt={6}>
              {draft.message}
            </Text>
          )}
          <Group gap="lg" mt="sm">
            <Text size="sm" c="dimmed">
              Источник: {draft.source}
            </Text>
            {draft.budgetRub && (
              <Text size="sm" c="dimmed">
                Бюджет: {formatRubles(draft.budgetRub)}
              </Text>
            )}
          </Group>
        </div>
        {(draft.carLabel || draft.calculationId || draft.pageUrl) && (
          <Paper withBorder radius="md" p="md">
            <Stack gap="xs">
              <Text fw={600}>Контекст обращения</Text>
              {draft.carLabel && (
                <Text size="sm">Автомобиль: {draft.carLabel}</Text>
              )}
              {draft.calculationId && (
                <Text size="sm">Расчёт: {draft.calculationId}</Text>
              )}
              <Anchor
                href={`https://perviyzakaz.ru${draft.pageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                Открыть исходную страницу{" "}
                <IconExternalLink
                  size={13}
                  style={{ verticalAlign: "middle" }}
                />
              </Anchor>
            </Stack>
          </Paper>
        )}
        <Divider />
        <Select
          label="Состояние"
          placeholder="Выберите состояние"
          data={LEAD_STATUS_OPTIONS}
          value={draft.status}
          allowDeselect={false}
          onChange={(status) =>
            status && setDraft({ ...draft, status: status as Lead["status"] })
          }
        />
        <Select
          label="Ответственный"
          placeholder="Назначить менеджера"
          data={managerOptions}
          value={draft.managerName}
          clearable
          onChange={(managerName) => setDraft({ ...draft, managerName })}
        />
        <DateTimePicker
          label="Следующее действие"
          placeholder="Выберите дату и время"
          value={draft.nextActionAt}
          clearable
          valueFormat="DD.MM.YYYY, HH:mm"
          onChange={(nextActionAt) => setDraft({ ...draft, nextActionAt })}
        />
        <Divider label="История" labelPosition="left" />
        {draft.notes.length ? (
          <Stack gap="sm">
            {draft.notes.map((item) => (
              <Paper key={item.id} withBorder radius="md" p="sm">
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    {item.authorName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {formatCompactDateTime(item.createdAt)}
                  </Text>
                </Group>
                <Text size="sm" mt={4}>
                  {item.text}
                </Text>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text size="sm" c="dimmed">
            Записей пока нет.
          </Text>
        )}
        <Textarea
          label="Добавить заметку"
          placeholder="Результат звонка или следующий шаг"
          autosize
          minRows={3}
          value={note}
          onChange={(event) => setNote(event.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Отмена
          </Button>
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            disabled={
              !draft.clientName.trim() ||
              !draft.phone.trim() ||
              !draft.subject.trim()
            }
            onClick={save}
          >
            {isNew ? "Создать заявку" : "Сохранить заявку"}
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
