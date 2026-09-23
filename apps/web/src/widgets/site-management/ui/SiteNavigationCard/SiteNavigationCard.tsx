"use client";

import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import type { NavigationItem } from "../../model/site-management";
import { isValidSiteUrl } from "../../lib/is-valid-site-url";
import classes from "./SiteNavigationCard.module.css";

const PLACEMENT_OPTIONS = [
  { value: "header", label: "Шапка" },
  { value: "footer", label: "Подвал" },
  { value: "both", label: "Шапка и подвал" },
];

type Props = {
  items: NavigationItem[];
  onChange: (items: NavigationItem[]) => void;
  onSave: () => void;
};

export function SiteNavigationCard({ items, onChange, onSave }: Props) {
  const valid = items.every(
    (item) => item.label.trim() && isValidSiteUrl(item.url),
  );
  function update(id: string, change: Partial<NavigationItem>) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...change } : item)),
    );
  }
  function move(index: number, offset: -1 | 1) {
    const destination = index + offset;
    if (destination < 0 || destination >= items.length) return;
    const next = [...items];
    [next[index], next[destination]] = [next[destination], next[index]];
    onChange(next);
  }
  return (
    <Paper withBorder radius="lg" className={classes.paper}>
      <Group
        justify="space-between"
        align="start"
        gap="md"
        className={classes.heading}
      >
        <Stack gap={4}>
          <Title order={2} size="h3">
            Навигация сайта
          </Title>
          <Text size="sm" c="dimmed">
            Порядок строк соответствует порядку пунктов в меню.
          </Text>
        </Stack>
        <Button
          variant="default"
          leftSection={<IconPlus size={17} />}
          onClick={() =>
            onChange([
              ...items,
              {
                id: crypto.randomUUID(),
                label: "",
                url: "",
                placement: "footer",
                enabled: true,
              },
            ])
          }
        >
          Добавить пункт
        </Button>
      </Group>
      <div className={classes.scroll}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="sm"
          className={classes.table}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Название</Table.Th>
              <Table.Th>Ссылка</Table.Th>
              <Table.Th>Расположение</Table.Th>
              <Table.Th ta="center">Показывать</Table.Th>
              <Table.Th ta="center">Порядок</Table.Th>
              <Table.Th w={56} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((item, index) => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <TextInput
                    aria-label={`Название пункта ${item.id}`}
                    placeholder="Название"
                    className={classes.label}
                    value={item.label}
                    onChange={(event) =>
                      update(item.id, { label: event.currentTarget.value })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    aria-label={`Ссылка пункта ${item.label || item.id}`}
                    placeholder="/раздел"
                    className={classes.url}
                    value={item.url}
                    onChange={(event) =>
                      update(item.id, { url: event.currentTarget.value })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Select
                    aria-label={`Расположение пункта ${item.label || item.id}`}
                    data={PLACEMENT_OPTIONS}
                    value={item.placement}
                    onChange={(value) =>
                      value &&
                      update(item.id, {
                        placement: value as NavigationItem["placement"],
                      })
                    }
                    allowDeselect={false}
                  />
                </Table.Td>
                <Table.Td ta="center">
                  <Switch
                    aria-label={`Показывать пункт ${item.label || item.id}`}
                    checked={item.enabled}
                    onChange={(event) =>
                      update(item.id, { enabled: event.currentTarget.checked })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Group justify="center" gap={2} wrap="nowrap">
                    <Button
                      variant="subtle"
                      color="gray"
                      px={7}
                      disabled={index === 0}
                      aria-label={`Поднять пункт ${item.label || item.id}`}
                      onClick={() => move(index, -1)}
                    >
                      <IconChevronUp size={17} />
                    </Button>
                    <Button
                      variant="subtle"
                      color="gray"
                      px={7}
                      disabled={index === items.length - 1}
                      aria-label={`Опустить пункт ${item.label || item.id}`}
                      onClick={() => move(index, 1)}
                    >
                      <IconChevronDown size={17} />
                    </Button>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Button
                    variant="subtle"
                    color="red"
                    px={8}
                    aria-label={`Удалить пункт ${item.label || item.id}`}
                    onClick={() =>
                      onChange(
                        items.filter((current) => current.id !== item.id),
                      )
                    }
                  >
                    <IconTrash size={17} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <Group justify="space-between" p="lg">
        <Text size="sm" c={valid ? "dimmed" : "red"}>
          {valid
            ? "Внешние ссылки должны использовать HTTPS."
            : "Заполните названия и укажите корректные ссылки."}
        </Text>
        <Button
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={onSave}
          disabled={!valid}
        >
          Сохранить меню
        </Button>
      </Group>
    </Paper>
  );
}
