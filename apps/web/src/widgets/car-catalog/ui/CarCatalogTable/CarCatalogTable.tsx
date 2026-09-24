"use client";

import { useMemo, useState } from "react";
import { Button, Paper, Select, Stack, Text, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { DataTable, useDataTableColumns } from "mantine-datatable";
import type { CatalogCar } from "@/entities/car";
import { PhotoLightbox } from "@/shared/ui/PhotoLightbox";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import { GridFiltersBar } from "@/shared/ui/GridFiltersBar";
import { GRID_PAGE_SIZE_OPTIONS } from "@/shared/lib/grid-options";
import { createCarColumns } from "../../lib/create-car-columns";
import { useCarCatalogTable } from "../../lib/use-car-catalog-table";
import {
  CATALOG_COLUMNS_STORAGE_KEY,
  COUNTRY_FILTER_OPTIONS,
  PHOTO_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  PUBLICATION_FILTER_OPTIONS,
} from "../../model/filter-options";
import { CATALOG_COLUMN_LABELS } from "../../model/view-options";
import classes from "./CarCatalogTable.module.css";

type CarCatalogTableProps = {
  cars: CatalogCar[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCreate?: () => void;
  onEdit?: (car: CatalogCar) => void;
  onDuplicate?: (car: CatalogCar) => void;
};

export function CarCatalogTable({
  cars,
  loading = false,
  error = null,
  onRetry,
  onCreate,
  onEdit,
  onDuplicate,
}: CarCatalogTableProps) {
  const [previewCar, setPreviewCar] = useState<CatalogCar | null>(null);
  const catalog = useCarCatalogTable(cars);
  const columns = useMemo(
    () =>
      createCarColumns({
        onEdit,
        onDuplicate,
        onPreviewPhoto: setPreviewCar,
      }),
    [onEdit, onDuplicate],
  );
  const {
    effectiveColumns,
    columnsToggle,
    setColumnsToggle,
    resetColumnsToggle,
    resetColumnsOrder,
    resetColumnsWidth,
    resetColumnsPinning,
  } = useDataTableColumns({ key: CATALOG_COLUMNS_STORAGE_KEY, columns });

  function resetColumns() {
    resetColumnsToggle();
    resetColumnsOrder();
    resetColumnsWidth();
    resetColumnsPinning();
  }

  return (
    <section className={classes.section} aria-label="Каталог автомобилей">
      <Stack gap="lg">
        <AdminPageHeader
          title="Автомобили"
          description="Каталог автомобилей и управление публикациями"
          actions={
            onCreate && (
              <Button leftSection={<IconPlus size={18} />} onClick={onCreate}>
                Добавить автомобиль
              </Button>
            )
          }
        />

        <Paper
          withBorder
          radius="lg"
          data-grid-density="compact"
          className={classes.paper}
        >
          {!error && (
            <>
              <GridFiltersBar>
                <TextInput
                  aria-label="Марка"
                  placeholder="Марка"
                  leftSection={<IconSearch size={16} />}
                  value={catalog.filters.brand}
                  onChange={(event) =>
                    catalog.updateFilter("brand", event.currentTarget.value)
                  }
                />
                <TextInput
                  aria-label="Модель или номер"
                  placeholder="Модель или номер"
                  value={catalog.filters.model}
                  onChange={(event) =>
                    catalog.updateFilter("model", event.currentTarget.value)
                  }
                />
                <Select
                  aria-label="Страна"
                  data={COUNTRY_FILTER_OPTIONS}
                  value={catalog.filters.country}
                  allowDeselect={false}
                  onChange={(value) =>
                    catalog.updateFilter("country", value ?? "all")
                  }
                />
                <Select
                  aria-label="Публикация"
                  data={PUBLICATION_FILTER_OPTIONS}
                  value={catalog.filters.publication}
                  allowDeselect={false}
                  onChange={(value) =>
                    catalog.updateFilter("publication", value ?? "all")
                  }
                />
                <Select
                  aria-label="Ответственный"
                  data={catalog.managerOptions}
                  value={catalog.filters.manager}
                  allowDeselect={false}
                  onChange={(value) =>
                    catalog.updateFilter("manager", value ?? "all")
                  }
                />
                <Select
                  aria-label="Год"
                  data={catalog.yearOptions}
                  value={catalog.filters.year}
                  allowDeselect={false}
                  onChange={(value) =>
                    catalog.updateFilter("year", value ?? "all")
                  }
                />
                <Select
                  aria-label="Цена"
                  data={PRICE_FILTER_OPTIONS}
                  value={catalog.filters.price}
                  allowDeselect={false}
                  onChange={(value) =>
                    catalog.updateFilter("price", value ?? "all")
                  }
                />
                <Select
                  aria-label="Фото"
                  data={PHOTO_FILTER_OPTIONS}
                  value={catalog.filters.photo}
                  allowDeselect={false}
                  onChange={(value) =>
                    catalog.updateFilter("photo", value ?? "all")
                  }
                />
              </GridFiltersBar>
              <div className={classes.toolbar}>
                <GridTableToolbar
                  loading={loading}
                  loadingLabel="Загружаем автомобили…"
                  hasFilters={catalog.hasFilters}
                  onResetFilters={catalog.resetFilters}
                  columnsToggle={columnsToggle}
                  onColumnsToggleChange={setColumnsToggle}
                  onResetView={resetColumns}
                  columnLabels={CATALOG_COLUMN_LABELS}
                />
              </div>
            </>
          )}

          {error ? (
            <GridErrorState
              title="Не удалось загрузить автомобили"
              message={error}
              onRetry={onRetry}
            />
          ) : (
            <DataTable
              records={catalog.pageRecords}
              columns={effectiveColumns}
              idAccessor="id"
              storeColumnsKey={CATALOG_COLUMNS_STORAGE_KEY}
              sortStatus={catalog.sortStatus}
              onSortStatusChange={catalog.setSortStatus}
              fetching={loading}
              minHeight={loading || catalog.count === 0 ? 280 : undefined}
              highlightOnHover
              verticalSpacing="xs"
              horizontalSpacing="sm"
              page={catalog.page}
              onPageChange={catalog.setPage}
              totalRecords={catalog.count}
              recordsPerPage={catalog.pageSize}
              recordsPerPageOptions={GRID_PAGE_SIZE_OPTIONS}
              onRecordsPerPageChange={catalog.setPageSize}
              recordsPerPageLabel="На странице"
              paginationText={({ from, to, totalRecords }) =>
                `${from}–${to} из ${totalRecords}`
              }
              loadingText="Загружаем автомобили…"
              emptyState={
                <Stack align="center" gap="xs" py="xl">
                  <Text fw={600}>
                    {cars.length ? "Ничего не найдено" : "Автомобилей пока нет"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {cars.length
                      ? "Измените запрос или сбросьте фильтры."
                      : "Добавьте первый автомобиль в каталог."}
                  </Text>
                  {catalog.hasFilters ? (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={catalog.resetFilters}
                    >
                      Сбросить фильтры
                    </Button>
                  ) : (
                    onCreate && (
                      <Button variant="light" size="sm" onClick={onCreate}>
                        Добавить автомобиль
                      </Button>
                    )
                  )}
                </Stack>
              }
            />
          )}
        </Paper>
      </Stack>
      <PhotoLightbox
        slides={
          previewCar
            ? [
                {
                  src: previewCar.previewUrl ?? previewCar.thumbnailUrl ?? "",
                  alt: `Фото ${previewCar.brand} ${previewCar.model}`,
                },
              ]
            : []
        }
        index={previewCar ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setPreviewCar(null)}
      />
    </section>
  );
}
