import { useCallback, useMemo, useState } from "react";
import type { DataTableSortStatus } from "mantine-datatable";
import type { CatalogCar } from "@/entities/car";
import { formatPersonShortName } from "@/shared/lib/format-person-short-name";
import { CATALOG_PAGE_SIZE } from "../model/filter-options";
import { sortCatalogCars } from "./sort-catalog-cars";

export type CatalogFilters = {
  photo: string;
  brand: string;
  model: string;
  year: string;
  country: string;
  price: string;
  publication: string;
  manager: string;
};

const initialFilters: CatalogFilters = {
  photo: "all",
  brand: "",
  model: "",
  year: "all",
  country: "all",
  price: "all",
  publication: "all",
  manager: "all",
};

export function useCarCatalogTable(cars: CatalogCar[]) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CATALOG_PAGE_SIZE);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<CatalogCar>>(
    {
      columnAccessor: "updatedAt",
      direction: "desc",
    },
  );

  const managerOptions = useMemo(
    () => [
      { value: "all", label: "Все сотрудники" },
      ...Array.from(
        new Set(
          cars.map((car) => car.managerName).filter((name) => name !== null),
        ),
      )
        .sort((left, right) => left.localeCompare(right, "ru"))
        .map((name) => ({ value: name, label: formatPersonShortName(name) })),
      { value: "unassigned", label: "Не назначен" },
    ],
    [cars],
  );
  const yearOptions = useMemo(
    () => [
      { value: "all", label: "Все годы" },
      ...Array.from(new Set(cars.map((car) => car.year)))
        .sort((left, right) => right - left)
        .map((year) => ({ value: String(year), label: String(year) })),
    ],
    [cars],
  );

  const filteredCars = useMemo(() => {
    const brand = filters.brand.trim().toLocaleLowerCase("ru-RU");
    const model = filters.model.trim().toLocaleLowerCase("ru-RU");
    return cars.filter((car) => {
      if (filters.photo === "with" && !car.thumbnailUrl) return false;
      if (filters.photo === "without" && car.thumbnailUrl) return false;
      if (brand && !car.brand.toLocaleLowerCase("ru-RU").includes(brand))
        return false;
      if (
        model &&
        !`${car.model} ${car.id}`.toLocaleLowerCase("ru-RU").includes(model)
      )
        return false;
      if (filters.year !== "all" && car.year !== Number(filters.year))
        return false;
      if (filters.country !== "all" && car.country !== filters.country)
        return false;
      if (filters.price === "with" && car.priceRub === null) return false;
      if (filters.price === "without" && car.priceRub !== null) return false;
      if (
        filters.publication !== "all" &&
        car.publicationStatus !== filters.publication
      )
        return false;
      if (filters.manager === "unassigned" && car.managerName !== null)
        return false;
      if (
        filters.manager !== "all" &&
        filters.manager !== "unassigned" &&
        car.managerName !== filters.manager
      )
        return false;
      return true;
    });
  }, [cars, filters]);

  const sortedCars = useMemo(
    () => sortCatalogCars(filteredCars, sortStatus),
    [filteredCars, sortStatus],
  );
  const pageCount = Math.max(1, Math.ceil(sortedCars.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const updateFilter = useCallback(
    <Key extends keyof CatalogFilters>(
      key: Key,
      value: CatalogFilters[Key],
    ) => {
      setPage(1);
      setFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  return {
    filters,
    managerOptions,
    yearOptions,
    page: currentPage,
    pageSize,
    sortStatus,
    pageRecords: sortedCars.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    ),
    count: sortedCars.length,
    hasFilters: (Object.keys(initialFilters) as (keyof CatalogFilters)[]).some(
      (key) => filters[key] !== initialFilters[key],
    ),
    setPage,
    setPageSize: (size: number) => {
      setPage(1);
      setPageSize(size);
    },
    setSortStatus: (status: DataTableSortStatus<CatalogCar>) => {
      setPage(1);
      setSortStatus(status);
    },
    updateFilter,
    resetFilters: () => {
      setPage(1);
      setFilters(initialFilters);
    },
  };
}
