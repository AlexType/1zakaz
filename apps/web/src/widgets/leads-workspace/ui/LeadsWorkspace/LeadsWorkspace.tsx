"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  DataTable,
  useDataTableColumns,
  type DataTableSortStatus,
} from "mantine-datatable";
import { LEAD_STATUS_OPTIONS, type Lead } from "@/entities/lead";
import { GRID_PAGE_SIZE_OPTIONS } from "@/shared/lib/grid-options";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import { createLeadColumns } from "../../lib/create-lead-columns";
import {
  EMPTY_LEAD_FILTERS,
  filterLeads,
  isLeadOverdue,
  type LeadFilters,
} from "../../lib/filter-leads";
import { DEMO_LEADS, DEMO_LEAD_MANAGERS } from "../../lib/stories/leads-demo";
import {
  LEADS_COLUMN_LABELS,
  LEADS_COLUMNS_STORAGE_KEY,
  LEAD_COUNTRY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
} from "../../model/leads-options";
import { LeadDetailsDrawer } from "../LeadDetailsDrawer";
import classes from "./LeadsWorkspace.module.css";

type LeadsWorkspaceProps = {
  initialFilters?: Partial<LeadFilters>;
  initialSelectedLeadId?: string;
  managerOptions?: { value: string; label: string }[];
};

export function LeadsWorkspace({
  initialFilters,
  initialSelectedLeadId,
  managerOptions = DEMO_LEAD_MANAGERS,
}: LeadsWorkspaceProps = {}) {
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [filters, setFilters] = useState<LeadFilters>({
    ...EMPTY_LEAD_FILTERS,
    ...initialFilters,
  });
  const [selected, setSelected] = useState<Lead | null>(
    DEMO_LEADS.find((lead) => lead.id === initialSelectedLeadId) ?? null,
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Lead>>({
    columnAccessor: "createdAt",
    direction: "desc",
  });
  const filtered = useMemo(
    () =>
      filterLeads(leads, filters).sort((a, b) => {
        const left = String(a[sortStatus.columnAccessor as keyof Lead] ?? "");
        const right = String(b[sortStatus.columnAccessor as keyof Lead] ?? "");
        const result = left.localeCompare(right, "ru-RU", { numeric: true });
        return sortStatus.direction === "asc" ? result : -result;
      }),
    [leads, filters, sortStatus],
  );
  const columns = useMemo(() => createLeadColumns(), []);
  const tableColumns = useDataTableColumns({
    key: LEADS_COLUMNS_STORAGE_KEY,
    columns,
  });
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => value !== EMPTY_LEAD_FILTERS[key as keyof LeadFilters],
  );
  function updateFilter<Key extends keyof LeadFilters>(
    key: Key,
    value: LeadFilters[Key],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }
  function resetView() {
    tableColumns.resetColumnsToggle();
    tableColumns.resetColumnsOrder();
    tableColumns.resetColumnsWidth();
    tableColumns.resetColumnsPinning();
  }
  function create(lead: Lead) {
    const saved = { ...lead, id: `L-${1043 + leads.length}` };
    setLeads((current) => [saved, ...current]);
    setSelected(null);
    showActionSuccess("Заявка создана");
  }
  function update(lead: Lead) {
    setLeads((current) =>
      current.map((item) => (item.id === lead.id ? lead : item)),
    );
    setSelected(lead);
  }
  function createLead() {
    const createdAt = new Date().toISOString();
    setSelected({
      id: `new-${crypto.randomUUID()}`,
      createdAt,
      updatedAt: createdAt,
      clientName: "",
      phone: "",
      email: null,
      status: "new",
      source: "Телефон",
      country: null,
      subject: "",
      message: "",
      vehicleQuery: null,
      vehicleType: null,
      condition: null,
      budgetRub: null,
      deliveryCity: null,
      purchaseTiming: null,
      wishes: null,
      preferredContactMethod: null,
      managerName: null,
      managerAvatarUrl: null,
      nextActionAt: null,
      pageUrl: "",
      carLabel: null,
      calculationId: null,
      utm: null,
      notes: [],
    });
  }

  return (
    <section className={classes.section} aria-label="Заявки">
      <Stack gap="lg">
        <AdminPageHeader
          title="Заявки"
          description="Обращения с сайта, карточек автомобилей и калькуляторов"
          actions={
            <Button leftSection={<IconPlus size={18} />} onClick={createLead}>
              Добавить заявку
            </Button>
          }
        />
        <Paper withBorder radius="lg" className={classes.paper}>
          <div className={classes.filters}>
            <TextInput
              className={classes.search}
              size="sm"
              placeholder="Клиент, телефон, автомобиль или номер"
              aria-label="Поиск заявок"
              leftSection={<IconSearch size={16} aria-hidden="true" />}
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
            />
            <Select
              size="sm"
              aria-label="Статус"
              data={[
                { value: "all", label: "Все статусы" },
                ...LEAD_STATUS_OPTIONS,
              ]}
              value={filters.status}
              allowDeselect={false}
              onChange={(value) => updateFilter("status", value ?? "all")}
            />
            <Select
              size="sm"
              aria-label="Ответственный"
              data={[
                { value: "all", label: "Все ответственные" },
                { value: "none", label: "Не назначен" },
                ...managerOptions,
              ]}
              value={filters.manager}
              allowDeselect={false}
              onChange={(value) => updateFilter("manager", value ?? "all")}
            />
            <Select
              size="sm"
              aria-label="Источник"
              data={[
                { value: "all", label: "Все источники" },
                ...LEAD_SOURCE_OPTIONS,
              ]}
              value={filters.source}
              allowDeselect={false}
              onChange={(value) => updateFilter("source", value ?? "all")}
            />
            <Select
              size="sm"
              aria-label="Страна"
              data={[
                { value: "all", label: "Все страны" },
                ...LEAD_COUNTRY_OPTIONS,
              ]}
              value={filters.country}
              allowDeselect={false}
              onChange={(value) => updateFilter("country", value ?? "all")}
            />
            <Checkbox
              className={classes.overdueFilter}
              label="Только просроченные"
              checked={filters.overdueOnly}
              onChange={(event) =>
                updateFilter("overdueOnly", event.currentTarget.checked)
              }
            />
          </div>
          <div className={classes.toolbar}>
            <GridTableToolbar
              hasFilters={hasFilters}
              onResetFilters={() => {
                setFilters(EMPTY_LEAD_FILTERS);
                setPage(1);
              }}
              columnsToggle={tableColumns.columnsToggle}
              onColumnsToggleChange={tableColumns.setColumnsToggle}
              onResetView={resetView}
              columnLabels={LEADS_COLUMN_LABELS}
            />
          </div>
          <DataTable
            records={filtered.slice((page - 1) * pageSize, page * pageSize)}
            columns={tableColumns.effectiveColumns}
            idAccessor="id"
            storeColumnsKey={LEADS_COLUMNS_STORAGE_KEY}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            highlightOnHover
            verticalSpacing="xs"
            horizontalSpacing="sm"
            minHeight={filtered.length === 0 ? 280 : undefined}
            page={page}
            onPageChange={setPage}
            totalRecords={filtered.length}
            recordsPerPage={pageSize}
            recordsPerPageOptions={GRID_PAGE_SIZE_OPTIONS}
            onRecordsPerPageChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            recordsPerPageLabel="На странице"
            paginationText={({ from, to, totalRecords }) =>
              `${from}–${to} из ${totalRecords}`
            }
            onRowClick={({ record }) => setSelected(record)}
            rowClassName={(record) =>
              [
                classes.clickableRow,
                record.status === "new" ? classes.newRow : "",
                isLeadOverdue(record) ? classes.overdueRow : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
            emptyState={
              <Stack align="center" gap="xs" py="xl">
                <Text fw={600}>
                  {leads.length ? "Заявки не найдены" : "Заявок пока нет"}
                </Text>
                {hasFilters && (
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => setFilters(EMPTY_LEAD_FILTERS)}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </Stack>
            }
          />
        </Paper>
      </Stack>
      {selected && (
        <LeadDetailsDrawer
          key={selected.id}
          lead={selected}
          opened
          managerOptions={managerOptions}
          onClose={() => setSelected(null)}
          onChange={update}
          onCreate={create}
        />
      )}
    </section>
  );
}
