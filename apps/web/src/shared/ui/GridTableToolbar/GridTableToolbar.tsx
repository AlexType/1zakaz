import { Button, Group, Text } from "@mantine/core";
import type { DataTableColumnToggle } from "mantine-datatable";
import type { GridDensity } from "@/shared/lib/grid-options";
import { GridViewOptions } from "@/shared/ui/GridViewOptions";

type Props = {
  count: number;
  loading?: boolean;
  loadingLabel?: string;
  hasFilters: boolean;
  onResetFilters: () => void;
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  columnsToggle: DataTableColumnToggle[];
  onColumnsToggleChange: (columns: DataTableColumnToggle[]) => void;
  onResetView: () => void;
  columnLabels: Record<string, string>;
};

export function GridTableToolbar({
  count,
  loading,
  loadingLabel,
  hasFilters,
  onResetFilters,
  density,
  onDensityChange,
  columnsToggle,
  onColumnsToggleChange,
  onResetView,
  columnLabels,
}: Props) {
  return (
    <Group justify="space-between" align="center" gap="sm">
      <Group gap="sm">
        <Text size="sm" c="dimmed" aria-live="polite">
          {loading ? (loadingLabel ?? "Загружаем…") : `Найдено: ${count}`}
        </Text>
        {hasFilters && (
          <Button variant="subtle" size="compact-sm" onClick={onResetFilters}>
            Сбросить фильтры
          </Button>
        )}
      </Group>
      <GridViewOptions
        density={density}
        onDensityChange={onDensityChange}
        columnsToggle={columnsToggle}
        onColumnsToggleChange={onColumnsToggleChange}
        onReset={onResetView}
        columnLabels={columnLabels}
      />
    </Group>
  );
}
