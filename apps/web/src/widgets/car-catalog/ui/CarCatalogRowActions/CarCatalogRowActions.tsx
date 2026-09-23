import { ActionIcon, CopyButton, Menu } from "@mantine/core";
import { IconCopy, IconDots, IconPencil } from "@tabler/icons-react";
import type { CatalogCar } from "@/entities/car";

type CarCatalogRowActionsProps = {
  car: CatalogCar;
  onEdit?: (car: CatalogCar) => void;
  onDuplicate?: (car: CatalogCar) => void;
};

export function CarCatalogRowActions({
  car,
  onEdit,
  onDuplicate,
}: CarCatalogRowActionsProps) {
  const name = `${car.brand} ${car.model}`;

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label={`Действия с ${name}`}
        >
          <IconDots size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconPencil size={16} />}
          onClick={() => onEdit?.(car)}
          disabled={!onEdit}
        >
          Редактировать
        </Menu.Item>
        {onDuplicate && (
          <Menu.Item
            leftSection={<IconCopy size={16} />}
            onClick={() => onDuplicate(car)}
          >
            Создать копию
          </Menu.Item>
        )}
        {car.publicationStatus === "published" && car.publicUrl && (
          <CopyButton value={car.publicUrl} timeout={2000}>
            {({ copied, copy }) => (
              <Menu.Item leftSection={<IconCopy size={16} />} onClick={copy}>
                {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
              </Menu.Item>
            )}
          </CopyButton>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
