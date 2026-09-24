import { Button, Group, Text } from "@mantine/core";
import type { DataTableColumnToggle } from "mantine-datatable";
import { GridViewOptions } from "@/shared/ui/GridViewOptions";

type Props = {
  loading?: boolean;
  loadingLabel?: string;
  hasFilters: boolean;
  onResetFilters: () => void;
  columnsToggle: DataTableColumnToggle[];
  onColumnsToggleChange: (columns: DataTableColumnToggle[]) => void;
  onResetView: () => void;
  columnLabels: Record<string, string>;
};

export function GridTableToolbar({
  loading,
  loadingLabel,
  hasFilters,
  onResetFilters,
  columnsToggle,
  onColumnsToggleChange,
  onResetView,
  columnLabels,
}: Props) {
  return (
    <Group justify="space-between" align="center" gap="sm">
      <Group gap="sm">
        {loading && (
          <Text size="sm" c="dimmed" aria-live="polite">
            {loadingLabel ?? "Загружаем…"}
          </Text>
        )}
        {hasFilters && (
          <Button variant="subtle" size="compact-sm" onClick={onResetFilters}>
            Сбросить фильтры
          </Button>
        )}
      </Group>
      <GridViewOptions
        columnsToggle={columnsToggle}
        onColumnsToggleChange={onColumnsToggleChange}
        onReset={onResetView}
        columnLabels={columnLabels}
      />
    </Group>
  );
}
