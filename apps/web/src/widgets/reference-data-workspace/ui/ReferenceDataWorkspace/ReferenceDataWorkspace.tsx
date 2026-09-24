"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  DataTable,
  useDataTableColumns,
  type DataTableSortStatus,
} from "mantine-datatable";
import type {
  ReferenceCategoryId,
  ReferenceEntry,
} from "@/entities/reference-entry";
import { GRID_PAGE_SIZE_OPTIONS } from "@/shared/lib/grid-options";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import { GridFiltersBar } from "@/shared/ui/GridFiltersBar";
import {
  createReferenceColumns,
  type ReferenceFilters,
} from "../../lib/create-reference-columns";
import { DEMO_REFERENCE_ENTRIES } from "../../lib/stories/reference-data-demo";
import {
  REFERENCE_CATEGORIES,
  REFERENCE_COLUMN_LABELS,
  REFERENCE_COLUMNS_STORAGE_KEY,
} from "../../model/reference-data-options";
import { ReferenceEntryEditor } from "../ReferenceEntryEditor";
import classes from "./ReferenceDataWorkspace.module.css";

const INITIAL_FILTERS: ReferenceFilters = { name: "", code: "", active: "all" };

type Props = {
  initialEntries?: ReferenceEntry[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function ReferenceDataWorkspace({
  initialEntries = DEMO_REFERENCE_ENTRIES,
  loading = false,
  error = null,
  onRetry,
}: Props = {}) {
  const [entries, setEntries] = useState(initialEntries);
  const [categoryId, setCategoryId] = useState<ReferenceCategoryId>("brands");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [editing, setEditing] = useState<ReferenceEntry | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ReferenceEntry>
  >({ columnAccessor: "name", direction: "asc" });
  const category =
    REFERENCE_CATEGORIES.find((item) => item.id === categoryId) ??
    REFERENCE_CATEGORIES[0];
  const filtered = useMemo(
    () =>
      entries
        .filter(
          (entry) =>
            entry.categoryId === categoryId &&
            entry.name
              .toLocaleLowerCase("ru-RU")
              .includes(filters.name.toLocaleLowerCase("ru-RU")) &&
            entry.code.includes(filters.code.toLowerCase()) &&
            (filters.active === "all" ||
              entry.active === (filters.active === "active")),
        )
        .sort((a, b) => {
          const left = String(
            a[sortStatus.columnAccessor as keyof ReferenceEntry] ?? "",
          );
          const right = String(
            b[sortStatus.columnAccessor as keyof ReferenceEntry] ?? "",
          );
          const result = left.localeCompare(right, "ru-RU", { numeric: true });
          return sortStatus.direction === "asc" ? result : -result;
        }),
    [entries, categoryId, filters, sortStatus],
  );
  const columns = useMemo(
    () =>
      createReferenceColumns({
        onEdit: (entry) => {
          setEditing(structuredClone(entry));
          setEditorOpen(true);
        },
      }),
    [],
  );
  const tableColumns = useDataTableColumns({
    key: REFERENCE_COLUMNS_STORAGE_KEY,
    columns,
  });
  const hasFilters =
    filters.name !== "" || filters.code !== "" || filters.active !== "all";

  function openCreate() {
    setEditing({
      id: crypto.randomUUID(),
      categoryId,
      name: "",
      code: "",
      details: "",
      colorHex: null,
      active: true,
      locked: false,
      usedCount: 0,
      updatedAt: new Date().toISOString(),
    });
    setEditorOpen(true);
  }
  function save(entry: ReferenceEntry) {
    setEntries((current) =>
      current.some((item) => item.id === entry.id)
        ? current.map((item) => (item.id === entry.id ? entry : item))
        : [...current, entry],
    );
    setEditorOpen(false);
    showActionSuccess("Значение справочника сохранено");
  }
  function resetView() {
    tableColumns.resetColumnsToggle();
    tableColumns.resetColumnsOrder();
    tableColumns.resetColumnsWidth();
    tableColumns.resetColumnsPinning();
  }

  return (
    <section className={classes.section} aria-label="Справочники">
      <Stack gap="lg">
        <AdminPageHeader
          title="Справочники"
          description="Значения для автомобилей, статей и заявок"
          actions={
            <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
              Добавить значение
            </Button>
          }
        />
        <div className={classes.layout}>
          <Paper withBorder radius="lg" className={classes.categories}>
            {REFERENCE_CATEGORIES.map((item) => (
              <UnstyledButton
                key={item.id}
                className={classes.category}
                data-active={item.id === categoryId}
                onClick={() => {
                  setCategoryId(item.id);
                  setFilters(INITIAL_FILTERS);
                  setPage(1);
                }}
              >
                <Text fw={600} size="sm">
                  {item.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {
                    entries.filter((entry) => entry.categoryId === item.id)
                      .length
                  }{" "}
                  знач.
                </Text>
              </UnstyledButton>
            ))}
          </Paper>
          <Stack gap="sm">
            <div>
              <Title order={2} size="h3">
                {category.label}
              </Title>
              <Text size="sm" c="dimmed">
                {category.description}
              </Text>
            </div>
            <Paper withBorder radius="lg" className={classes.table}>
              {!error && (
                <>
                  <GridFiltersBar>
                    <TextInput
                      aria-label="Поиск по справочнику"
                      placeholder="Название"
                      leftSection={<IconSearch size={16} />}
                      value={filters.name}
                      onChange={(event) => {
                        setFilters((current) => ({
                          ...current,
                          name: event.currentTarget.value,
                        }));
                        setPage(1);
                      }}
                    />
                    <TextInput
                      aria-label="Код значения"
                      placeholder="Код"
                      value={filters.code}
                      onChange={(event) => {
                        setFilters((current) => ({
                          ...current,
                          code: event.currentTarget.value,
                        }));
                        setPage(1);
                      }}
                    />
                    <Select
                      aria-label="Состояние"
                      data={[
                        { value: "all", label: "Все состояния" },
                        { value: "active", label: "Активные" },
                        { value: "inactive", label: "Отключённые" },
                      ]}
                      value={filters.active}
                      allowDeselect={false}
                      onChange={(value) => {
                        setFilters((current) => ({
                          ...current,
                          active: value ?? "all",
                        }));
                        setPage(1);
                      }}
                    />
                  </GridFiltersBar>
                  <div className={classes.toolbar}>
                    <GridTableToolbar
                      loading={loading}
                      loadingLabel="Загружаем значения…"
                      hasFilters={hasFilters}
                      onResetFilters={() => setFilters(INITIAL_FILTERS)}
                      columnsToggle={tableColumns.columnsToggle}
                      onColumnsToggleChange={tableColumns.setColumnsToggle}
                      onResetView={resetView}
                      columnLabels={REFERENCE_COLUMN_LABELS}
                    />
                  </div>
                </>
              )}
              {error ? (
                <GridErrorState
                  title="Не удалось загрузить справочники"
                  message={error}
                  onRetry={onRetry}
                />
              ) : (
                <DataTable
                  records={filtered.slice(
                    (page - 1) * pageSize,
                    page * pageSize,
                  )}
                  columns={tableColumns.effectiveColumns}
                  idAccessor="id"
                  storeColumnsKey={REFERENCE_COLUMNS_STORAGE_KEY}
                  sortStatus={sortStatus}
                  onSortStatusChange={setSortStatus}
                  highlightOnHover
                  fetching={loading}
                  loadingText="Загружаем значения…"
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
                  emptyState={
                    <Stack align="center" gap="xs" py="xl">
                      <Text fw={600}>Значений пока нет</Text>
                      <Button variant="light" size="sm" onClick={openCreate}>
                        Добавить значение
                      </Button>
                    </Stack>
                  }
                />
              )}
            </Paper>
          </Stack>
        </div>
      </Stack>
      <ReferenceEntryEditor
        key={`${editing?.id ?? "empty"}-${editing?.updatedAt ?? "new"}-${editorOpen}`}
        opened={editorOpen}
        category={category}
        entry={editing}
        onClose={() => setEditorOpen(false)}
        onSave={save}
      />
    </section>
  );
}
