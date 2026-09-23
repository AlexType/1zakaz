"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconDeviceFloppy, IconExternalLink } from "@tabler/icons-react";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import type { SitePage, SitePageStatus } from "../../model/site-management";
import classes from "./SitePagesCard.module.css";

const SOURCE_LABELS = {
  manual: "Редактируется здесь",
  cars: "Из каталога",
  articles: "Из статей",
  cases: "Из кейсов",
} as const;

type Props = { pages: SitePage[]; onSave: (page: SitePage) => void };

export function SitePagesCard({ pages, onSave }: Props) {
  const [draft, setDraft] = useState<SitePage | null>(
    pages[0] ? structuredClone(pages[0]) : null,
  );
  if (!draft) return null;

  function setStatus(status: SitePageStatus) {
    setDraft((current) => (current ? { ...current, status } : current));
  }

  return (
    <div className={classes.layout}>
      <Paper withBorder radius="lg" className={classes.pageList}>
        {pages.map((page) => (
          <UnstyledButton
            key={page.id}
            className={classes.pageButton}
            data-active={page.id === draft.id}
            onClick={() => {
              setDraft(structuredClone(page));
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <div>
                <Text fw={600} size="sm">
                  {page.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {page.path}
                </Text>
              </div>
              <Badge
                size="xs"
                variant="light"
                color={page.status === "published" ? "green" : "gray"}
              >
                {page.status === "published" ? "Опубликована" : "Черновик"}
              </Badge>
            </Group>
          </UnstyledButton>
        ))}
      </Paper>
      <Stack gap="lg">
        <Paper withBorder radius="lg" p="lg">
          <Group justify="space-between" align="start" mb="lg">
            <div>
              <Title order={2} size="h3">
                {draft.title}
              </Title>
              <Text size="xs" c="dimmed" mt={4}>
                Обновлена {formatCompactDateTime(draft.updatedAt)}
              </Text>
            </div>
            <Button
              component="a"
              href={`https://perviyzakaz.ru${draft.path}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              color="gray"
              rightSection={<IconExternalLink size={15} />}
            >
              Открыть страницу
            </Button>
          </Group>
          <Stack gap="md">
            <TextInput
              label="Название в панели"
              placeholder="Например, Главная"
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.currentTarget.value })
              }
            />
            <TextInput
              label="Заголовок страницы"
              placeholder="Главный заголовок страницы"
              value={draft.heading}
              onChange={(event) =>
                setDraft({ ...draft, heading: event.currentTarget.value })
              }
            />
            <Textarea
              label="Вводный текст"
              placeholder="Коротко объясните назначение страницы"
              autosize
              minRows={3}
              value={draft.lead}
              onChange={(event) =>
                setDraft({ ...draft, lead: event.currentTarget.value })
              }
            />
            <div>
              <Text size="sm" fw={500} mb={6}>
                Состояние
              </Text>
              <SegmentedControl
                data={[
                  { value: "draft", label: "Черновик" },
                  { value: "published", label: "Опубликована" },
                ]}
                value={draft.status}
                onChange={(value) => setStatus(value as SitePageStatus)}
              />
            </div>
          </Stack>
        </Paper>
        <Paper withBorder radius="lg" p="lg">
          <Title order={2} size="h3" mb={4}>
            Блоки страницы
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Автомобили, статьи и кейсы подставляются из соответствующих разделов
            без копирования данных.
          </Text>
          <Stack gap="xs">
            {draft.blocks.map((block) => (
              <Paper
                key={block.id}
                withBorder
                radius="md"
                className={classes.block}
              >
                <Group justify="space-between" gap="md">
                  <div>
                    <Text fw={600} size="sm">
                      {block.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {SOURCE_LABELS[block.source]}
                    </Text>
                  </div>
                  <Switch
                    aria-label={`Показывать блок «${block.title}»`}
                    checked={block.enabled}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        blocks: draft.blocks.map((item) =>
                          item.id === block.id
                            ? { ...item, enabled: event.currentTarget.checked }
                            : item,
                        ),
                      })
                    }
                  />
                </Group>
              </Paper>
            ))}
          </Stack>
        </Paper>
        <Group justify="flex-end">
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            onClick={() => {
              const saved = { ...draft, updatedAt: new Date().toISOString() };
              setDraft(saved);
              onSave(saved);
            }}
          >
            Сохранить страницу
          </Button>
        </Group>
      </Stack>
    </div>
  );
}
