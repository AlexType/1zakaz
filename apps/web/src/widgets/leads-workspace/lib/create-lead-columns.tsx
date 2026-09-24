import { Badge, Stack, Text } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import { COUNTRY_LABELS } from "@/entities/car";
import {
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
  type Lead,
} from "@/entities/lead";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { formatRubles } from "@/shared/lib/format-rubles";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { GridPersonCell } from "@/shared/ui/GridPersonCell";
import { LEAD_VEHICLE_TYPE_LABELS } from "../model/leads-options";
import { isLeadOverdue } from "./filter-leads";

function getLeadRequestTitle(lead: Lead) {
  return (
    lead.vehicleQuery ||
    lead.carLabel ||
    (lead.vehicleType ? LEAD_VEHICLE_TYPE_LABELS[lead.vehicleType] : null) ||
    lead.subject
  );
}

export function createLeadColumns(): DataTableColumn<Lead>[] {
  return [
    {
      accessor: "id",
      title: "№",
      width: 90,
      pinned: "left",
      sortable: true,
      render: (lead) => (
        <Text size="sm" fw={lead.status === "new" ? 700 : 600}>
          {lead.id.replace("L-", "")}
        </Text>
      ),
    },
    {
      accessor: "createdAt",
      title: "Создана",
      width: 145,
      sortable: true,
      resizable: true,
      render: (lead) => (
        <Text size="sm" textWrap="nowrap">
          {formatCompactDateTime(lead.createdAt)}
        </Text>
      ),
    },
    {
      accessor: "client",
      sortKey: "clientName",
      title: "Клиент и телефон",
      width: 210,
      sortable: true,
      resizable: true,
      render: (lead) => (
        <Stack gap={2}>
          <Text size="sm" fw={600} lineClamp={1}>
            {lead.clientName}
          </Text>
          <Text
            component="a"
            href={`tel:${lead.phone.replace(/\D/g, "")}`}
            size="xs"
            c="dimmed"
            textWrap="nowrap"
            onClick={(event) => event.stopPropagation()}
          >
            {formatRussianPhone(lead.phone)}
          </Text>
        </Stack>
      ),
    },
    {
      accessor: "request",
      sortKey: "subject",
      title: "Запрос",
      width: 300,
      sortable: true,
      resizable: true,
      render: (lead) => (
        <Stack gap={2}>
          <Text size="sm" fw={500} lineClamp={1}>
            {getLeadRequestTitle(lead)}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {[lead.country ? COUNTRY_LABELS[lead.country] : null, lead.source]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </Stack>
      ),
    },
    {
      accessor: "budgetRub",
      title: "Бюджет",
      width: 140,
      textAlign: "right",
      sortable: true,
      render: (lead) =>
        lead.budgetRub ? (
          <Text size="sm" textWrap="nowrap">
            {formatRubles(lead.budgetRub)}
          </Text>
        ) : (
          <Text c="dimmed">—</Text>
        ),
    },
    {
      accessor: "status",
      title: "Статус",
      width: 165,
      sortable: true,
      render: (lead) => (
        <Badge variant="light" color={LEAD_STATUS_COLORS[lead.status]}>
          {LEAD_STATUS_LABELS[lead.status]}
        </Badge>
      ),
    },
    {
      accessor: "managerName",
      title: "Ответственный",
      width: 185,
      sortable: true,
      resizable: true,
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
      width: 180,
      sortable: true,
      render: (lead) => {
        if (!lead.nextActionAt) return <Text c="dimmed">—</Text>;
        const overdue = isLeadOverdue(lead);
        return (
          <Stack gap={2}>
            <Text
              size="sm"
              fw={overdue ? 600 : undefined}
              c={overdue ? "red.7" : undefined}
              textWrap="nowrap"
            >
              {formatCompactDateTime(lead.nextActionAt)}
            </Text>
            {overdue && (
              <Text size="xs" c="red.7">
                Просрочено
              </Text>
            )}
          </Stack>
        );
      },
    },
  ];
}
