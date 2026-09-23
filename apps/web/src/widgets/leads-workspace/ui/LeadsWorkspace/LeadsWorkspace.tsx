"use client";

import { useMemo, useState } from "react";
import { Button, Paper, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  DataTable,
  useDataTableColumns,
  type DataTableSortStatus,
} from "mantine-datatable";
import type { Lead } from "@/entities/lead";
import {
  GRID_PAGE_SIZE_OPTIONS,
  type GridDensity,
} from "@/shared/lib/grid-options";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import {
  createLeadColumns,
  type LeadFilters,
} from "../../lib/create-lead-columns";
import { DEMO_LEADS, DEMO_LEAD_MANAGERS } from "../../lib/stories/leads-demo";
import {
  LEADS_COLUMN_LABELS,
  LEADS_COLUMNS_STORAGE_KEY,
  LEADS_DENSITY_STORAGE_KEY,
} from "../../model/leads-options";
import { LeadDetailsDrawer } from "../LeadDetailsDrawer";
import classes from "./LeadsWorkspace.module.css";

const INITIAL_FILTERS: LeadFilters = {
  client: "",
  phone: "",
  status: "all",
  country: "all",
  manager: "all",
  subject: "",
};

export function LeadsWorkspace() {
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Lead>>({
    columnAccessor: "createdAt",
    direction: "desc",
  });
  const [density, setDensity] = useLocalStorage<GridDensity>({
    key: LEADS_DENSITY_STORAGE_KEY,
    defaultValue: "normal",
  });
  const filtered = useMemo(
    () =>
      leads
        .filter(
          (lead) =>
            lead.clientName
              .toLocaleLowerCase("ru-RU")
              .includes(filters.client.toLocaleLowerCase("ru-RU")) &&
            lead.phone
              .replace(/\D/g, "")
              .includes(filters.phone.replace(/\D/g, "")) &&
            lead.subject
              .toLocaleLowerCase("ru-RU")
              .includes(filters.subject.toLocaleLowerCase("ru-RU")) &&
            (filters.status === "all" || lead.status === filters.status) &&
            (filters.country === "all" || lead.country === filters.country) &&
            (filters.manager === "all" ||
              (filters.manager === "none"
                ? !lead.managerName
                : lead.managerName === filters.manager)),
        )
        .sort((a, b) => {
          const left = String(a[sortStatus.columnAccessor as keyof Lead] ?? "");
          const right = String(
            b[sortStatus.columnAccessor as keyof Lead] ?? "",
          );
          const result = left.localeCompare(right, "ru-RU", { numeric: true });
          return sortStatus.direction === "asc" ? result : -result;
        }),
    [leads, filters, sortStatus],
  );
  const columns = useMemo(
    () =>
      createLeadColumns({
        filters,
        managerOptions: DEMO_LEAD_MANAGERS,
        updateFilter: (key, value) => {
          setFilters((current) => ({ ...current, [key]: value }));
          setPage(1);
        },
        onOpen: setSelected,
      }),
    [filters],
  );
  const tableColumns = useDataTableColumns({
    key: LEADS_COLUMNS_STORAGE_KEY,
    columns,
  });
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => value !== INITIAL_FILTERS[key as keyof LeadFilters],
  );
  function resetView() {
    tableColumns.resetColumnsToggle();
    tableColumns.resetColumnsOrder();
    tableColumns.resetColumnsWidth();
    tableColumns.resetColumnsPinning();
    setDensity("normal");
  }
  function save(lead: Lead) {
    const isNew = lead.id.startsWith("new-");
    const saved = isNew ? { ...lead, id: `L-${1043 + leads.length}` } : lead;
    setLeads((current) =>
      isNew
        ? [saved, ...current]
        : current.map((item) => (item.id === saved.id ? saved : item)),
    );
    setSelected(null);
    showActionSuccess(isNew ? "Заявка создана" : "Заявка сохранена");
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
      budgetRub: null,
      managerName: null,
      managerAvatarUrl: null,
      nextActionAt: null,
      pageUrl: "",
      carLabel: null,
      calculationId: null,
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
          <div className={classes.toolbar}>
            <GridTableToolbar
              count={filtered.length}
              hasFilters={hasFilters}
              onResetFilters={() => {
                setFilters(INITIAL_FILTERS);
                setPage(1);
              }}
              density={density}
              onDensityChange={setDensity}
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
            verticalSpacing={density === "compact" ? "xs" : "sm"}
            horizontalSpacing={density === "compact" ? "sm" : "md"}
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
            emptyState={
              <Stack align="center" gap="xs" py="xl">
                <Text fw={600}>
                  {leads.length ? "Заявки не найдены" : "Заявок пока нет"}
                </Text>
                {hasFilters && (
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => setFilters(INITIAL_FILTERS)}
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
          key={`${selected.id}-${selected.updatedAt}`}
          lead={selected}
          opened
          managerOptions={DEMO_LEAD_MANAGERS}
          onClose={() => setSelected(null)}
          onSave={save}
        />
      )}
    </section>
  );
}
