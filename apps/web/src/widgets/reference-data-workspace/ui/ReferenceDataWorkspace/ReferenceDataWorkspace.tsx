"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  DataTable,
  useDataTableColumns,
  type DataTableSortStatus,
} from "mantine-datatable";
import type {
  ReferenceCategoryId,
  ReferenceEntry,
} from "@/entities/reference-entry";
import {
  GRID_PAGE_SIZE_OPTIONS,
  type GridDensity,
} from "@/shared/lib/grid-options";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import {
  createReferenceColumns,
  type ReferenceFilters,
} from "../../lib/create-reference-columns";
import { DEMO_REFERENCE_ENTRIES } from "../../lib/stories/reference-data-demo";
import {
  REFERENCE_CATEGORIES,
  REFERENCE_COLUMN_LABELS,
  REFERENCE_COLUMNS_STORAGE_KEY,
  REFERENCE_DENSITY_STORAGE_KEY,
} from "../../model/reference-data-options";
import { ReferenceEntryEditor } from "../ReferenceEntryEditor";
import classes from "./ReferenceDataWorkspace.module.css";

const INITIAL_FILTERS: ReferenceFilters = { name: "", code: "", active: "all" };

export function ReferenceDataWorkspace() {
  const [entries, setEntries] = useState(DEMO_REFERENCE_ENTRIES);
  const [categoryId, setCategoryId] = useState<ReferenceCategoryId>("brands");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [editing, setEditing] = useState<ReferenceEntry | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ReferenceEntry>
  >({ columnAccessor: "name", direction: "asc" });
  const [density, setDensity] = useLocalStorage<GridDensity>({
    key: REFERENCE_DENSITY_STORAGE_KEY,
    defaultValue: "normal",
  });
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
        filters,
        updateFilter: (key, value) => {
          setFilters((current) => ({ ...current, [key]: value }));
          setPage(1);
        },
        onEdit: (entry) => {
          setEditing(structuredClone(entry));
          setEditorOpen(true);
        },
      }),
    [filters],
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
    setDensity("normal");
  }

  return (
    <section className={classes.section} aria-label="Справочники">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} size="h2">
              Справочники
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Значения для автомобилей, статей и заявок
            </Text>
          </div>
          <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
            Добавить значение
          </Button>
        </Group>
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
              <div className={classes.toolbar}>
                <GridTableToolbar
                  count={filtered.length}
                  hasFilters={hasFilters}
                  onResetFilters={() => setFilters(INITIAL_FILTERS)}
                  density={density}
                  onDensityChange={setDensity}
                  columnsToggle={tableColumns.columnsToggle}
                  onColumnsToggleChange={tableColumns.setColumnsToggle}
                  onResetView={resetView}
                  columnLabels={REFERENCE_COLUMN_LABELS}
                />
              </div>
              <DataTable
                records={filtered.slice((page - 1) * pageSize, page * pageSize)}
                columns={tableColumns.effectiveColumns}
                idAccessor="id"
                storeColumnsKey={REFERENCE_COLUMNS_STORAGE_KEY}
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
                emptyState={
                  <Stack align="center" gap="xs" py="xl">
                    <Text fw={600}>Значений пока нет</Text>
                    <Button variant="light" size="sm" onClick={openCreate}>
                      Добавить значение
                    </Button>
                  </Stack>
                }
              />
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
