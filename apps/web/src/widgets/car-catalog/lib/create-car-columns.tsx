import {
  Badge,
  Text,
  Tooltip,
  UnstyledButton,
  VisuallyHidden,
} from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import {
  COUNTRY_LABELS,
  PUBLICATION_LABELS,
  type CatalogCar,
  CountryFlag,
} from "@/entities/car";
import { GridPhotoCell } from "@/shared/ui/GridPhotoCell";
import {
  formatCompactDate,
  formatCompactDateTime,
} from "@/shared/lib/format-compact-date";
import { formatRubles } from "@/shared/lib/format-rubles";
import { GridPersonCell } from "@/shared/ui/GridPersonCell";
import { CarCatalogRowActions } from "../ui/CarCatalogRowActions";
import classes from "../ui/CarCatalogTable/CarCatalogTable.module.css";

type ColumnOptions = {
  onEdit?: (car: CatalogCar) => void;
  onDuplicate?: (car: CatalogCar) => void;
  onPreviewPhoto?: (car: CatalogCar) => void;
};

export function createCarColumns({
  onEdit,
  onDuplicate,
  onPreviewPhoto,
}: ColumnOptions): DataTableColumn<CatalogCar>[] {
  return [
    {
      accessor: "thumbnailUrl",
      title: "Фото",
      width: 104,
      textAlign: "center",
      pinned: "left",
      render: (car) => (
        <GridPhotoCell
          src={car.thumbnailUrl}
          alt={`Фото ${car.brand} ${car.model}`}
          openLabel={`Открыть фото ${car.brand} ${car.model}`}
          onPreview={() => onPreviewPhoto?.(car)}
        />
      ),
    },
    {
      accessor: "brand",
      title: "Марка",
      width: 120,
      sortable: true,
      resizable: true,
      pinnable: true,
      render: (car) => (
        <Text size="sm" fw={600} textWrap="nowrap">
          {car.brand}
        </Text>
      ),
    },
    {
      accessor: "model",
      title: "Модель",
      width: 165,
      sortable: true,
      resizable: true,
      draggable: true,
      render: (car) =>
        onEdit ? (
          <UnstyledButton
            className={classes.modelLink}
            aria-label={`Редактировать ${car.brand} ${car.model}`}
            onClick={() => onEdit(car)}
          >
            {car.model}
          </UnstyledButton>
        ) : (
          <Text size="sm" fw={500} textWrap="nowrap">
            {car.model}
          </Text>
        ),
    },
    {
      accessor: "year",
      title: "Год",
      width: 88,
      textAlign: "right",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
    },
    {
      accessor: "country",
      title: "Страна",
      width: 105,
      textAlign: "center",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (car) => (
        <Tooltip label={COUNTRY_LABELS[car.country]} withArrow>
          <CountryFlag country={car.country} />
        </Tooltip>
      ),
    },
    {
      accessor: "priceRub",
      title: "Цена, ₽",
      width: 148,
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      textAlign: "right",
      render: (car) =>
        car.priceRub === null ? (
          <Text size="sm" c="dimmed">
            Не указана
          </Text>
        ) : (
          <Text size="sm" fw={600} textWrap="nowrap">
            {formatRubles(car.priceRub)}
          </Text>
        ),
    },
    {
      accessor: "priceUpdatedAt",
      title: "Цена обновлена",
      width: 135,
      textAlign: "right",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      defaultToggle: false,
      render: (car) =>
        car.priceUpdatedAt ? formatCompactDate(car.priceUpdatedAt) : "—",
    },
    {
      accessor: "publicationStatus",
      title: "Публикация",
      width: 140,
      textAlign: "center",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (car) => (
        <Badge
          color={car.publicationStatus === "published" ? "green" : "gray"}
          variant="light"
          size="sm"
        >
          {PUBLICATION_LABELS[car.publicationStatus]}
        </Badge>
      ),
    },
    {
      accessor: "managerName",
      title: "Ответственный",
      width: 190,
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (car) => <GridPersonCell name={car.managerName} />,
    },
    {
      accessor: "updatedAt",
      title: "Изменён",
      width: 150,
      textAlign: "right",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (car) => formatCompactDateTime(car.updatedAt),
    },
    {
      accessor: "actions",
      title: <VisuallyHidden>Действия</VisuallyHidden>,
      width: 70,
      textAlign: "center",
      pinned: "right",
      render: (car) => (
        <CarCatalogRowActions
          car={car}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
        />
      ),
    },
  ];
}
