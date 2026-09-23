"use client";

import { Kbd } from "@mantine/core";
import { Spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import type { AdminSearchItem } from "../../model/admin-search";

type AdminGlobalSearchProps = {
  items: AdminSearchItem[];
  onSelect: (item: AdminSearchItem) => void;
};

export function AdminGlobalSearch({ items, onSelect }: AdminGlobalSearchProps) {
  return (
    <Spotlight
      actions={items.map((item) => {
        const Icon = item.icon;

        return {
          id: item.id,
          group: item.group,
          label: item.label,
          description: item.description,
          keywords: item.keywords,
          leftSection: <Icon size={20} stroke={1.7} />,
          rightSection: <Kbd size="xs">Enter</Kbd>,
          onClick: () => onSelect(item),
        };
      })}
      searchProps={{
        leftSection: <IconSearch size={20} stroke={1.7} />,
        placeholder: "Автомобиль, заявка, статья или сотрудник",
        "aria-label": "Поиск по панели управления",
      }}
      nothingFound="Ничего не найдено"
      highlightQuery
      limit={8}
      scrollable
      maxHeight={420}
      radius="lg"
      size="lg"
      overlayProps={{ backgroundOpacity: 0.34, blur: 3 }}
    />
  );
}
