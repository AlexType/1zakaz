import { ActionIcon, Badge, Group, Text, Tooltip } from "@mantine/core";
import { IconLock, IconPencil } from "@tabler/icons-react";
import type { DataTableColumn } from "mantine-datatable";
import type { ReferenceEntry } from "@/entities/reference-entry";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";

export type ReferenceFilters = { name: string; code: string; active: string };

type Options = {
  onEdit: (entry: ReferenceEntry) => void;
};

export function createReferenceColumns({
  onEdit,
}: Options): DataTableColumn<ReferenceEntry>[] {
  return [
    {
      accessor: "name",
      title: "Название",
      sortable: true,
      resizable: true,
      render: (entry) => (
        <Group gap="xs" wrap="nowrap">
          {entry.colorHex && (
            <span
              aria-hidden
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "1px solid var(--mantine-color-gray-4)",
                background: entry.colorHex,
                flex: "0 0 auto",
              }}
            />
          )}
          <Text size="sm" fw={600}>
            {entry.name}
          </Text>
          {entry.locked && (
            <Tooltip label="Системное значение: код и удаление недоступны">
              <IconLock size={14} color="var(--mantine-color-gray-6)" />
            </Tooltip>
          )}
        </Group>
      ),
    },
    {
      accessor: "code",
      title: "Код",
      width: 170,
      sortable: true,
      resizable: true,
      render: (entry) => (
        <Text size="sm" ff="monospace">
          {entry.code}
        </Text>
      ),
    },
    {
      accessor: "details",
      title: "Связь или пояснение",
      width: 220,
      resizable: true,
      render: (entry) =>
        entry.details || (
          <Text size="sm" c="dimmed">
            —
          </Text>
        ),
    },
    {
      accessor: "usedCount",
      title: "Используется",
      width: 120,
      textAlign: "right",
      sortable: true,
      render: (entry) => `${entry.usedCount} раз`,
    },
    {
      accessor: "active",
      title: "Состояние",
      width: 130,
      textAlign: "center",
      sortable: true,
      render: (entry) => (
        <Badge variant="light" color={entry.active ? "green" : "gray"}>
          {entry.active ? "Активен" : "Отключён"}
        </Badge>
      ),
    },
    {
      accessor: "updatedAt",
      title: "Изменён",
      width: 155,
      textAlign: "right",
      sortable: true,
      render: (entry) => formatCompactDateTime(entry.updatedAt),
    },
    {
      accessor: "actions",
      title: "",
      width: 64,
      textAlign: "center",
      render: (entry) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label={`Редактировать ${entry.name}`}
          onClick={() => onEdit(entry)}
        >
          <IconPencil size={17} />
        </ActionIcon>
      ),
    },
  ];
}
