"use client";

import { useState } from "react";
import {
  Anchor,
  Badge,
  Button,
  Drawer,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Timeline,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconExternalLink,
  IconMessageCircle,
  IconPhone,
  IconPlus,
} from "@tabler/icons-react";
import { COUNTRY_LABELS } from "@/entities/car";
import {
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_OPTIONS,
  type Lead,
} from "@/entities/lead";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { formatRubles } from "@/shared/lib/format-rubles";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { DateTimeInput } from "@/shared/ui/DateTimeInput";
import { DigitNumberInput } from "@/shared/ui/DigitNumberInput";
import { PhoneInput } from "@/shared/ui/PhoneInput";
import {
  LEAD_CONDITION_LABELS,
  LEAD_CONTACT_METHOD_LABELS,
  LEAD_COUNTRY_OPTIONS,
  LEAD_PURCHASE_TIMING_LABELS,
  LEAD_SOURCE_OPTIONS,
  LEAD_VEHICLE_TYPE_LABELS,
} from "../../model/leads-options";
import classes from "./LeadDetailsDrawer.module.css";

type Props = {
  lead: Lead;
  opened: boolean;
  managerOptions: { value: string; label: string }[];
  onClose: () => void;
  onChange: (lead: Lead) => void;
  onCreate: (lead: Lead) => void;
};

export function LeadDetailsDrawer({
  lead,
  opened,
  managerOptions,
  onClose,
  onChange,
  onCreate,
}: Props) {
  const [draft, setDraft] = useState(structuredClone(lead));
  const [note, setNote] = useState("");
  const isNew = lead.id.startsWith("new-");
  const sourcePageUrl = draft.pageUrl
    ? draft.pageUrl.startsWith("http")
      ? draft.pageUrl
      : `https://perviyzakaz.ru${draft.pageUrl}`
    : null;

  function updateDraft(patch: Partial<Lead>) {
    const next = {
      ...draft,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setDraft(next);
    if (!isNew) onChange(next);
  }

  function addNote() {
    const text = note.trim();
    if (!text) return;
    const next = {
      ...draft,
      updatedAt: new Date().toISOString(),
      notes: [
        ...draft.notes,
        {
          id: crypto.randomUUID(),
          authorName: draft.managerName ?? "Администратор",
          createdAt: new Date().toISOString(),
          text,
        },
      ],
    };
    setDraft(next);
    setNote("");
    onChange(next);
    showActionSuccess("Заметка добавлена");
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="min(720px, 100vw)"
      title={
        <Stack gap={3}>
          <Group gap="xs" wrap="wrap">
            <Text fw={700} size="lg">
              {isNew ? "Новая заявка" : draft.clientName}
            </Text>
            <Badge variant="light" color={LEAD_STATUS_COLORS[draft.status]}>
              {LEAD_STATUS_LABELS[draft.status]}
            </Badge>
          </Group>
          <Text size="xs" c="dimmed">
            {isNew
              ? "Ручное обращение"
              : `${draft.id} · ${formatCompactDateTime(draft.createdAt)} · ${draft.managerName ?? "без ответственного"}`}
          </Text>
        </Stack>
      }
      classNames={{ body: classes.body, header: classes.header }}
    >
      <Stack gap="md">
        {!isNew && (
          <Group justify="space-between" gap="xs" wrap="wrap">
            <Group gap="xs">
              <Button
                component="a"
                href={`tel:${draft.phone.replace(/\D/g, "")}`}
                variant="default"
                size="compact-sm"
                leftSection={<IconPhone size={15} aria-hidden="true" />}
              >
                Позвонить
              </Button>
              {sourcePageUrl && (
                <Button
                  component="a"
                  href={sourcePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="subtle"
                  size="compact-sm"
                  leftSection={
                    <IconExternalLink size={15} aria-hidden="true" />
                  }
                >
                  Исходная страница
                </Button>
              )}
            </Group>
            <Group gap={5} c="dimmed">
              <IconCircleCheck size={14} aria-hidden="true" />
              <Text size="xs">Изменения сохраняются автоматически</Text>
            </Group>
          </Group>
        )}

        {isNew && (
          <section className={classes.section}>
            <Text className={classes.sectionTitle}>Основные данные</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <TextInput
                label="Имя клиента"
                placeholder="Как обращаться"
                value={draft.clientName}
                onChange={(event) =>
                  updateDraft({ clientName: event.currentTarget.value })
                }
              />
              <PhoneInput
                label="Телефон"
                value={draft.phone}
                onChange={(event) =>
                  updateDraft({ phone: event.currentTarget.value })
                }
              />
              <TextInput
                label="Почта"
                placeholder="client@example.ru"
                value={draft.email ?? ""}
                onChange={(event) =>
                  updateDraft({ email: event.currentTarget.value || null })
                }
              />
              <Select
                label="Источник"
                data={LEAD_SOURCE_OPTIONS}
                value={draft.source}
                allowDeselect={false}
                onChange={(source) => source && updateDraft({ source })}
              />
              <TextInput
                label="Запрос"
                placeholder="Например, подбор автомобиля"
                value={draft.subject}
                onChange={(event) =>
                  updateDraft({ subject: event.currentTarget.value })
                }
              />
              <Select
                label="Страна"
                data={LEAD_COUNTRY_OPTIONS}
                value={draft.country}
                clearable
                onChange={(country) =>
                  updateDraft({ country: country as Lead["country"] })
                }
              />
              <DigitNumberInput
                label="Бюджет"
                placeholder="Например, 2 500 000"
                suffix=" ₽"
                defaultValue={draft.budgetRub ? String(draft.budgetRub) : ""}
                onChange={(budgetRub) =>
                  updateDraft({
                    budgetRub: budgetRub === "" ? null : Number(budgetRub),
                  })
                }
              />
            </SimpleGrid>
            <Textarea
              label="Комментарий клиента"
              placeholder="Запрос и важные подробности"
              rows={3}
              mt="sm"
              value={draft.message}
              onChange={(event) =>
                updateDraft({ message: event.currentTarget.value })
              }
            />
          </section>
        )}

        <section className={classes.section}>
          <Text className={classes.sectionTitle}>Работа с заявкой</Text>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs">
            <Select
              label="Статус"
              size="sm"
              data={LEAD_STATUS_OPTIONS}
              value={draft.status}
              allowDeselect={false}
              onChange={(status) =>
                status && updateDraft({ status: status as Lead["status"] })
              }
            />
            <Select
              label="Ответственный"
              size="sm"
              placeholder="Не назначен"
              data={managerOptions}
              value={draft.managerName}
              clearable
              onChange={(managerName) => updateDraft({ managerName })}
            />
            <DateTimeInput
              label="Следующее действие"
              size="sm"
              placeholder="Не запланировано"
              value={draft.nextActionAt}
              onChange={(nextActionAt) => updateDraft({ nextActionAt })}
            />
          </SimpleGrid>
        </section>

        {!isNew && (
          <>
            <section className={classes.section}>
              <Text className={classes.sectionTitle}>Контакты</Text>
              <dl className={classes.detailsGrid}>
                <div>
                  <dt>Телефон</dt>
                  <dd>
                    <Anchor href={`tel:${draft.phone.replace(/\D/g, "")}`}>
                      {formatRussianPhone(draft.phone)}
                    </Anchor>
                  </dd>
                </div>
                <div>
                  <dt>Предпочтительный способ</dt>
                  <dd>
                    {draft.preferredContactMethod
                      ? LEAD_CONTACT_METHOD_LABELS[draft.preferredContactMethod]
                      : "Не указан"}
                  </dd>
                </div>
                {draft.email && (
                  <div>
                    <dt>Почта</dt>
                    <dd>
                      <Anchor href={`mailto:${draft.email}`}>
                        {draft.email}
                      </Anchor>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className={classes.section}>
              <Text className={classes.sectionTitle}>Запрос клиента</Text>
              <dl className={classes.detailsGrid}>
                <div>
                  <dt>Обращение</dt>
                  <dd>{draft.subject}</dd>
                </div>
                <div>
                  <dt>Автомобиль</dt>
                  <dd>
                    {draft.vehicleQuery ||
                      draft.carLabel ||
                      (draft.vehicleType
                        ? LEAD_VEHICLE_TYPE_LABELS[draft.vehicleType]
                        : "Не указан")}
                  </dd>
                </div>
              </dl>
              {draft.message && (
                <Text size="sm" mt="xs">
                  {draft.message}
                </Text>
              )}
            </section>

            <section className={classes.section}>
              <Text className={classes.sectionTitle}>Условия</Text>
              <dl className={classes.detailsGrid}>
                <div>
                  <dt>Бюджет под ключ</dt>
                  <dd>
                    {draft.budgetRub
                      ? formatRubles(draft.budgetRub)
                      : "Не указан"}
                  </dd>
                </div>
                <div>
                  <dt>Страна</dt>
                  <dd>
                    {draft.country
                      ? COUNTRY_LABELS[draft.country]
                      : "Не указана"}
                  </dd>
                </div>
                <div>
                  <dt>Состояние</dt>
                  <dd>
                    {draft.condition
                      ? LEAD_CONDITION_LABELS[draft.condition]
                      : "Не указано"}
                  </dd>
                </div>
                <div>
                  <dt>Город получения</dt>
                  <dd>{draft.deliveryCity ?? "Не указан"}</dd>
                </div>
                <div>
                  <dt>Срок покупки</dt>
                  <dd>
                    {draft.purchaseTiming
                      ? LEAD_PURCHASE_TIMING_LABELS[draft.purchaseTiming]
                      : "Не указан"}
                  </dd>
                </div>
                {draft.wishes && (
                  <div className={classes.fullWidth}>
                    <dt>Пожелания</dt>
                    <dd>{draft.wishes}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section className={`${classes.section} ${classes.systemSection}`}>
              <Group justify="space-between" gap="xs">
                <Text className={classes.sectionTitle}>
                  Источник и контекст
                </Text>
                <Text size="xs" c="dimmed">
                  Системные данные
                </Text>
              </Group>
              <dl className={classes.detailsGrid}>
                <div>
                  <dt>Источник</dt>
                  <dd>{draft.source}</dd>
                </div>
                {draft.carLabel && (
                  <div>
                    <dt>Автомобиль из каталога</dt>
                    <dd>{draft.carLabel}</dd>
                  </div>
                )}
                {draft.calculationId && (
                  <div>
                    <dt>Расчёт</dt>
                    <dd>{draft.calculationId}</dd>
                  </div>
                )}
                {draft.pageUrl && (
                  <div className={classes.fullWidth}>
                    <dt>Страница</dt>
                    <dd className={classes.breakText}>{draft.pageUrl}</dd>
                  </div>
                )}
                {draft.utm && (
                  <div className={classes.fullWidth}>
                    <dt>UTM</dt>
                    <dd className={classes.breakText}>
                      {[
                        draft.utm.source && `source=${draft.utm.source}`,
                        draft.utm.medium && `medium=${draft.utm.medium}`,
                        draft.utm.campaign && `campaign=${draft.utm.campaign}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className={classes.section}>
              <Text className={classes.sectionTitle}>История</Text>
              <Timeline bulletSize={20} lineWidth={1} mt="xs">
                <Timeline.Item title="Заявка создана">
                  <Text size="xs" c="dimmed">
                    {formatCompactDateTime(draft.createdAt)} · {draft.source}
                  </Text>
                </Timeline.Item>
                {draft.notes.map((item) => (
                  <Timeline.Item
                    key={item.id}
                    bullet={<IconMessageCircle size={11} />}
                    title={item.authorName}
                  >
                    <Text size="sm">{item.text}</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {formatCompactDateTime(item.createdAt)}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
              <div className={classes.noteComposer}>
                <Textarea
                  aria-label="Новая заметка"
                  placeholder="Результат звонка или договорённость"
                  rows={2}
                  value={note}
                  onChange={(event) => setNote(event.currentTarget.value)}
                />
                <Button
                  size="sm"
                  leftSection={<IconPlus size={16} aria-hidden="true" />}
                  disabled={!note.trim()}
                  onClick={addNote}
                >
                  Добавить заметку
                </Button>
              </div>
            </section>
          </>
        )}

        {isNew && (
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Отмена
            </Button>
            <Button
              disabled={
                !draft.clientName.trim() ||
                !draft.phone.trim() ||
                !draft.subject.trim()
              }
              onClick={() =>
                onCreate({ ...draft, updatedAt: new Date().toISOString() })
              }
            >
              Создать заявку
            </Button>
          </Group>
        )}
      </Stack>
    </Drawer>
  );
}
