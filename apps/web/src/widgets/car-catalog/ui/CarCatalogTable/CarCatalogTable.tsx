"use client";

import { useMemo, useState } from "react";
import { Button, Paper, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";
import { DataTable, useDataTableColumns } from "mantine-datatable";
import type { CatalogCar } from "@/entities/car";
import { PhotoLightbox } from "@/shared/ui/PhotoLightbox";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import {
  GRID_PAGE_SIZE_OPTIONS,
  type GridDensity,
} from "@/shared/lib/grid-options";
import { createCarColumns } from "../../lib/create-car-columns";
import { useCarCatalogTable } from "../../lib/use-car-catalog-table";
import { CATALOG_COLUMNS_STORAGE_KEY } from "../../model/filter-options";
import {
  CATALOG_COLUMN_LABELS,
  CATALOG_DENSITY_STORAGE_KEY,
} from "../../model/view-options";
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
  const [density, setDensity] = useLocalStorage<GridDensity>({
    key: CATALOG_DENSITY_STORAGE_KEY,
    defaultValue: "normal",
  });
  const columns = useMemo(
    () =>
      createCarColumns({
        filters: catalog.filters,
        yearOptions: catalog.yearOptions,
        managerOptions: catalog.managerOptions,
        updateFilter: catalog.updateFilter,
        onEdit,
        onDuplicate,
        onPreviewPhoto: setPreviewCar,
      }),
    [
      catalog.filters,
      catalog.yearOptions,
      catalog.managerOptions,
      catalog.updateFilter,
      onEdit,
      onDuplicate,
    ],
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
    setDensity("normal");
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
          data-grid-density={density}
          className={`${classes.paper} ${density === "compact" ? classes.compact : ""}`}
        >
          {!error && (
            <div className={classes.toolbar}>
              <GridTableToolbar
                count={catalog.count}
                loading={loading}
                loadingLabel="Загружаем автомобили…"
                hasFilters={catalog.hasFilters}
                onResetFilters={catalog.resetFilters}
                density={density}
                onDensityChange={setDensity}
                columnsToggle={columnsToggle}
                onColumnsToggleChange={setColumnsToggle}
                onResetView={resetColumns}
                columnLabels={CATALOG_COLUMN_LABELS}
              />
            </div>
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
              verticalSpacing={density === "compact" ? "xs" : "sm"}
              horizontalSpacing={density === "compact" ? "sm" : "md"}
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
