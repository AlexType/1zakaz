import { ActionIcon, Badge, Text, Tooltip } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import type { DataTableColumn } from "mantine-datatable";
import { COUNTRY_LABELS, CountryFlag } from "@/entities/car";
import {
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_OPTIONS,
  type Lead,
} from "@/entities/lead";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { formatRubles } from "@/shared/lib/format-rubles";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { GridPersonCell } from "@/shared/ui/GridPersonCell";
import { GridSelectFilter, GridTextFilter } from "@/shared/ui/GridColumnFilter";

export type LeadFilters = {
  client: string;
  phone: string;
  status: string;
  country: string;
  manager: string;
  subject: string;
};
type Options = {
  filters: LeadFilters;
  managerOptions: { value: string; label: string }[];
  updateFilter: (key: keyof LeadFilters, value: string) => void;
  onOpen: (lead: Lead) => void;
};

export function createLeadColumns({
  filters,
  managerOptions,
  updateFilter,
  onOpen,
}: Options): DataTableColumn<Lead>[] {
  return [
    {
      accessor: "id",
      title: "Номер",
      width: 100,
      pinned: "left",
      sortable: true,
      render: (lead) => (
        <Text size="sm" fw={600}>
          {lead.id}
        </Text>
      ),
    },
    {
      accessor: "createdAt",
      title: "Создана",
      width: 155,
      sortable: true,
      resizable: true,
      render: (lead) => formatCompactDateTime(lead.createdAt),
    },
    {
      accessor: "clientName",
      title: "Клиент",
      width: 180,
      sortable: true,
      resizable: true,
      filter: (
        <GridTextFilter
          label="Клиент"
          value={filters.client}
          onChange={(value) => updateFilter("client", value)}
        />
      ),
      filtering: Boolean(filters.client.trim()),
      render: (lead) => (
        <Text size="sm" fw={600} textWrap="nowrap">
          {lead.clientName}
        </Text>
      ),
    },
    {
      accessor: "phone",
      title: "Телефон",
      width: 170,
      resizable: true,
      filter: (
        <GridTextFilter
          label="Телефон"
          value={filters.phone}
          onChange={(value) => updateFilter("phone", value)}
        />
      ),
      filtering: Boolean(filters.phone.trim()),
      render: (lead) => (
        <Text
          component="a"
          href={`tel:${lead.phone.replace(/\D/g, "")}`}
          size="sm"
          c="inherit"
          textWrap="nowrap"
        >
          {formatRussianPhone(lead.phone)}
        </Text>
      ),
    },
    {
      accessor: "subject",
      title: "Обращение",
      width: 230,
      resizable: true,
      filter: (
        <GridTextFilter
          label="Обращение"
          value={filters.subject}
          onChange={(value) => updateFilter("subject", value)}
        />
      ),
      filtering: Boolean(filters.subject.trim()),
      render: (lead) => (
        <div>
          <Text size="sm" fw={500}>
            {lead.subject}
          </Text>
          <Text size="xs" c="dimmed">
            {lead.source}
          </Text>
        </div>
      ),
    },
    {
      accessor: "country",
      title: "Страна",
      width: 105,
      textAlign: "center",
      sortable: true,
      filter: (
        <GridSelectFilter
          label="Страна"
          value={filters.country}
          options={[
            { value: "all", label: "Все" },
            { value: "japan", label: "Япония" },
            { value: "china", label: "Китай" },
            { value: "korea", label: "Корея" },
          ]}
          onChange={(value) => updateFilter("country", value)}
        />
      ),
      filtering: filters.country !== "all",
      render: (lead) =>
        lead.country ? (
          <Tooltip label={COUNTRY_LABELS[lead.country]}>
            <CountryFlag country={lead.country} />
          </Tooltip>
        ) : (
          <Text c="dimmed">—</Text>
        ),
    },
    {
      accessor: "budgetRub",
      title: "Бюджет",
      width: 145,
      textAlign: "right",
      sortable: true,
      render: (lead) =>
        lead.budgetRub ? (
          formatRubles(lead.budgetRub)
        ) : (
          <Text c="dimmed">—</Text>
        ),
    },
    {
      accessor: "status",
      title: "Состояние",
      width: 155,
      textAlign: "center",
      sortable: true,
      filter: (
        <GridSelectFilter
          label="Состояние"
          value={filters.status}
          options={[{ value: "all", label: "Все" }, ...LEAD_STATUS_OPTIONS]}
          onChange={(value) => updateFilter("status", value)}
        />
      ),
      filtering: filters.status !== "all",
      render: (lead) => (
        <Badge variant="light" color={LEAD_STATUS_COLORS[lead.status]}>
          {LEAD_STATUS_LABELS[lead.status]}
        </Badge>
      ),
    },
    {
      accessor: "managerName",
      title: "Ответственный",
      width: 190,
      sortable: true,
      resizable: true,
      filter: (
        <GridSelectFilter
          label="Ответственный"
          value={filters.manager}
          options={[
            { value: "all", label: "Все" },
            { value: "none", label: "Не назначен" },
            ...managerOptions,
          ]}
          onChange={(value) => updateFilter("manager", value)}
        />
      ),
      filtering: filters.manager !== "all",
      render: (lead) => (
        <GridPersonCell
          name={lead.managerName}
          avatarUrl={lead.managerAvatarUrl}
        />
      ),
    },
    {
      accessor: "nextActionAt",
      title: "Следующее действие",
      width: 175,
      textAlign: "right",
      sortable: true,
      render: (lead) =>
        lead.nextActionAt ? (
          formatCompactDateTime(lead.nextActionAt)
        ) : (
          <Text c="dimmed">—</Text>
        ),
    },
    {
      accessor: "actions",
      title: "",
      width: 62,
      textAlign: "center",
      pinned: "right",
      render: (lead) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label={`Открыть заявку ${lead.id}`}
          onClick={() => onOpen(lead)}
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      ),
    },
  ];
}
