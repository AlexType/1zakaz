import {
  Button,
  Checkbox,
  Divider,
  Popover,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import type { DataTableColumnToggle } from "mantine-datatable";
import {
  GRID_DENSITY_OPTIONS,
  type GridDensity,
} from "@/shared/lib/grid-options";

type Props = {
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  columnsToggle: DataTableColumnToggle[];
  onColumnsToggleChange: (columns: DataTableColumnToggle[]) => void;
  onReset: () => void;
  columnLabels: Record<string, string>;
};

export function GridViewOptions({
  density,
  onDensityChange,
  columnsToggle,
  onColumnsToggleChange,
  onReset,
  columnLabels,
}: Props) {
  const toggleableColumns = columnsToggle.filter((column) => column.toggleable);
  return (
    <Popover position="bottom-end" shadow="md" width={240} withinPortal>
      <Popover.Target>
        <Button
          variant="default"
          leftSection={<IconAdjustmentsHorizontal size={17} />}
        >
          Вид таблицы
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="sm">
          <Text size="sm" fw={600}>
            Плотность строк
          </Text>
          <SegmentedControl
            fullWidth
            data={GRID_DENSITY_OPTIONS}
            value={density}
            onChange={(value) =>
              onDensityChange(value === "compact" ? "compact" : "normal")
            }
          />
          <Divider />
          <Text size="sm" fw={600}>
            Показывать в таблице
          </Text>
          {toggleableColumns.map((column) => (
            <Checkbox
              key={column.accessor}
              label={columnLabels[column.accessor] ?? column.accessor}
              checked={column.toggled}
              onChange={(event) =>
                onColumnsToggleChange(
                  columnsToggle.map((item) =>
                    item.accessor === column.accessor
                      ? { ...item, toggled: event.currentTarget.checked }
                      : item,
                  ),
                )
              }
            />
          ))}
          <Divider />
          <Button variant="subtle" size="xs" onClick={onReset}>
            Сбросить вид таблицы
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
