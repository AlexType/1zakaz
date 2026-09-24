"use client";

import { useState } from "react";
import type { CatalogCar } from "@/entities/car";
import { CarEditor } from "@/features/manage-car";
import type { CarFormValues, CarPhoto } from "@/features/manage-car";
import {
  createDemoRecords,
  type DemoCarRecord,
} from "../../lib/stories/create-demo-records";
import { CarCatalogTable } from "../CarCatalogTable";

type ActiveEditor =
  { mode: "create" } | { mode: "edit" | "duplicate"; id: string };

type Props = {
  brands?: string[];
  models?: string[];
  managers?: string[];
};

export function CarCatalogDemo({ brands, models, managers }: Props = {}) {
  const [records, setRecords] = useState(createDemoRecords);
  const [active, setActive] = useState<ActiveEditor | null>(null);
  function open(mode: "edit" | "duplicate", car: CatalogCar) {
    setActive({ mode, id: car.id });
  }

  function save(values: CarFormValues, photos: CarPhoto[]) {
    const id = active?.mode === "edit" ? active.id : crypto.randomUUID();
    const now = new Date().toISOString();
    const previous = records.find((record) => record.summary.id === id);
    const summary: CatalogCar = {
      id,
      brand: values.brand,
      model: values.model,
      year: Number(values.year),
      country: values.country,
      publicationStatus: values.publicationStatus,
      priceRub:
        values.priceMode === "fixed" ? Number(values.fixedPriceRub) : null,
      priceUpdatedAt: values.priceMode === "fixed" ? now : null,
      managerName: values.manager || null,
      updatedAt: now,
      thumbnailUrl: photos[0]?.url ?? null,
      previewUrl: photos[0]?.url ?? null,
      publicUrl:
        values.publicationStatus === "published"
          ? `https://example.com/cars/${id}`
          : null,
    };
    const next: DemoCarRecord = { summary, values, photos };
    setRecords((current) =>
      previous
        ? current.map((record) => (record.summary.id === id ? next : record))
        : [next, ...current],
    );
    setActive(null);
  }

  if (active) {
    const record =
      active.mode === "create"
        ? null
        : records.find((item) => item.summary.id === active.id);
    return (
      <CarEditor
        key={`${active.mode}-${record?.summary.id ?? "new"}`}
        mode={active.mode}
        initialValues={
          record
            ? {
                ...record.values,
                publicationStatus:
                  active.mode === "duplicate"
                    ? "draft"
                    : record.values.publicationStatus,
              }
            : undefined
        }
        initialPhotos={record?.photos}
        brands={
          brands ?? [...new Set(records.map((item) => item.values.brand))]
        }
        models={
          models ?? [...new Set(records.map((item) => item.values.model))]
        }
        managers={
          managers ?? [
            ...new Set(
              records.map((item) => item.values.manager).filter(Boolean),
            ),
          ]
        }
        onSave={save}
        onCancel={() => setActive(null)}
        onDelete={
          active.mode === "edit"
            ? () => {
                setRecords((current) =>
                  current.filter((item) => item.summary.id !== active.id),
                );
                setActive(null);
              }
            : undefined
        }
      />
    );
  }

  return (
    <CarCatalogTable
      cars={records.map((record) => record.summary)}
      onCreate={() => {
        setActive({ mode: "create" });
      }}
      onEdit={(car) => open("edit", car)}
      onDuplicate={(car) => open("duplicate", car)}
    />
  );
}
