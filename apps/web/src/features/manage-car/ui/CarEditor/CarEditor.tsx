"use client";

import { useState } from "react";
import {
  Alert,
  Autocomplete,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import {
  CountryFlag,
  PUBLICATION_LABELS,
  type CarCountry,
  type PublicationStatus,
} from "@/entities/car";
import { DigitNumberInput } from "@/shared/ui/DigitNumberInput";
import {
  showActionError,
  showActionSuccess,
} from "@/shared/lib/show-action-notification";
import { useUnsavedChanges } from "@/shared/lib/use-unsaved-changes";
import { EditorLayout } from "@/shared/ui/EditorLayout";
import { UnsavedChangesModal } from "@/shared/ui/UnsavedChangesModal";
import { useCarPhotos } from "../../lib/use-car-photos";
import { carFormSchema } from "../../lib/validation";
import type {
  CarFormValues,
  CarPhoto,
  PriceMode,
  SaveCar,
} from "../../model/car-form";
import { EMPTY_CAR } from "../../model/car-form";
import {
  BODY_TYPE_OPTIONS,
  COLOR_OPTIONS,
  COUNTRY_OPTIONS,
  CURRENCY_OPTIONS,
  CURRENCY_BY_COUNTRY,
  DRIVE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  PRICE_MODE_OPTIONS,
  PUBLICATION_OPTIONS,
  STEERING_WHEEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  YEAR_OPTIONS,
  type CarColor,
} from "../../model/car-form-options";
import { CarDescriptionEditor } from "../CarDescriptionEditor";
import { CarPhotoEditor } from "../CarPhotoEditor";
import classes from "./CarEditor.module.css";

type CarEditorProps = {
  mode: "create" | "edit" | "duplicate";
  initialValues?: Partial<CarFormValues>;
  initialPhotos?: CarPhoto[];
  brands: string[];
  models: string[];
  managers: string[];
  colors?: CarColor[];
  onSave: SaveCar;
  onCancel: () => void;
  onDelete?: () => void | Promise<void>;
};

export function CarEditor({
  mode,
  initialValues,
  initialPhotos = [],
  brands,
  models,
  managers,
  colors = COLOR_OPTIONS,
  onSave,
  onCancel,
  onDelete,
}: CarEditorProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const values = { ...EMPTY_CAR, ...initialValues };
  const form = useForm<CarFormValues>({
    mode: "uncontrolled",
    initialValues: values,
    validate: schemaResolver(carFormSchema, { sync: true }),
    onValuesChange: () => setHasChanges(true),
  });
  const [priceMode, setPriceMode] = useState<PriceMode>(values.priceMode);
  const [status, setStatus] = useState<PublicationStatus>(
    values.publicationStatus,
  );
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { photos, addFiles, movePhoto, removePhoto } =
    useCarPhotos(initialPhotos);
  useUnsavedChanges(hasChanges);

  const title =
    mode === "edit"
      ? "Редактировать автомобиль"
      : mode === "duplicate"
        ? "Копия автомобиля"
        : "Новый автомобиль";

  async function submit(value: CarFormValues) {
    setSaveError(null);
    if (
      value.publicationStatus === "published" &&
      value.priceMode === "calculated"
    ) {
      setSaveError(
        "Для публикации нужна рассчитанная цена. Сохраните черновик или укажите фиксированную цену.",
      );
      return;
    }
    setBusy(true);
    try {
      await onSave(
        {
          ...value,
          brand: value.brand.trim(),
          model: value.model.trim(),
          description: value.description,
        },
        photos,
      );
      showActionSuccess(
        mode === "edit"
          ? "Изменения сохранены"
          : "Автомобиль добавлен в каталог",
      );
      form.resetDirty();
      setHasChanges(false);
    } catch {
      showActionError(
        "Не удалось сохранить автомобиль. Проверьте данные и попробуйте ещё раз.",
      );
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    if (hasChanges) setConfirmLeave(true);
    else onCancel();
  }

  async function addPhotos(files: File[]) {
    await addFiles(files);
    if (files.length) setHasChanges(true);
  }

  function moveCarPhoto(from: number, to: number) {
    movePhoto(from, to);
    if (from !== to) setHasChanges(true);
  }

  function removeCarPhoto(id: string) {
    removePhoto(id);
    setHasChanges(true);
  }

  async function remove() {
    if (!onDelete) return;
    setBusy(true);
    setSaveError(null);
    try {
      await onDelete();
      setConfirmDelete(false);
      showActionSuccess("Автомобиль удалён из каталога");
    } catch {
      showActionError("Не удалось удалить автомобиль. Попробуйте ещё раз.");
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={form.onSubmit((value) => void submit(value))} noValidate>
        <EditorLayout
          title={title}
          backLabel="К автомобилям"
          onBack={cancel}
          ariaLabel={title}
          status={
            <Badge
              color={status === "published" ? "green" : "gray"}
              variant="light"
            >
              {PUBLICATION_LABELS[status]}
            </Badge>
          }
          aside={
            <>
              <Paper withBorder radius="lg" p="lg">
                <Stack gap="md">
                  <Title order={2} size="h4">
                    Публикация
                  </Title>
                  <Select
                    key={form.key("publicationStatus")}
                    label="Видимость на сайте"
                    placeholder="Выберите состояние"
                    data={PUBLICATION_OPTIONS}
                    allowDeselect={false}
                    {...form.getInputProps("publicationStatus")}
                    onChange={(value) => {
                      if (!value) return;
                      setStatus(value as PublicationStatus);
                      form.setFieldValue(
                        "publicationStatus",
                        value as PublicationStatus,
                      );
                    }}
                  />
                  <Text size="sm" c="dimmed">
                    {status === "draft"
                      ? "Черновик доступен только сотрудникам."
                      : "После сохранения карточка будет доступна на сайте."}
                  </Text>
                </Stack>
              </Paper>
              <Paper withBorder radius="lg" p="lg">
                <Stack gap="md">
                  <Title order={2} size="h4">
                    Ответственный
                  </Title>
                  <Select
                    key={form.key("manager")}
                    label="Менеджер"
                    placeholder="Выберите менеджера"
                    data={managers}
                    searchable
                    clearable
                    {...form.getInputProps("manager")}
                  />
                </Stack>
              </Paper>
              {mode === "edit" && onDelete && (
                <Button
                  color="red"
                  variant="subtle"
                  leftSection={<IconTrash size={18} />}
                  onClick={() => setConfirmDelete(true)}
                >
                  Удалить автомобиль
                </Button>
              )}
            </>
          }
          actions={
            <>
              <Button variant="default" onClick={cancel} disabled={busy}>
                Отмена
              </Button>
              <Button
                type="submit"
                loading={busy}
                leftSection={<IconDeviceFloppy size={18} />}
              >
                Сохранить
              </Button>
            </>
          }
        >
          {saveError && (
            <Alert color="red" title="Автомобиль не сохранён" role="alert">
              {saveError}
            </Alert>
          )}
          <Paper withBorder radius="lg" p="lg">
            <Stack gap="lg">
              <Title order={2} size="h4">
                Основное
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Select
                  key={form.key("country")}
                  label="Страна"
                  placeholder="Выберите страну"
                  data={COUNTRY_OPTIONS}
                  renderOption={({ option }) => (
                    <Group gap="xs">
                      <CountryFlag country={option.value as CarCountry} />
                      {option.label}
                    </Group>
                  )}
                  leftSection={
                    <CountryFlag country={form.getValues().country} />
                  }
                  allowDeselect={false}
                  required
                  {...form.getInputProps("country")}
                  onChange={(country) => {
                    if (!country) return;
                    form.setFieldValue("country", country as CarCountry);
                    form.setFieldValue(
                      "currency",
                      CURRENCY_BY_COUNTRY[country as CarCountry],
                    );
                  }}
                />
                <Select
                  key={form.key("year")}
                  label="Год выпуска"
                  placeholder="Выберите год"
                  data={YEAR_OPTIONS}
                  searchable
                  required
                  {...form.getInputProps("year")}
                />
                <Autocomplete
                  key={form.key("brand")}
                  label="Марка"
                  placeholder="Toyota"
                  data={brands}
                  required
                  {...form.getInputProps("brand")}
                />
                <Autocomplete
                  key={form.key("model")}
                  label="Модель"
                  placeholder="Corolla Cross"
                  data={models}
                  required
                  {...form.getInputProps("model")}
                />
              </SimpleGrid>
              <Divider />
              <Title order={3} size="h5">
                Характеристики
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DigitNumberInput
                  label="Пробег, км"
                  placeholder="45 000"
                  defaultValue={values.mileageKm}
                  onChange={(value) =>
                    form.setFieldValue("mileageKm", value, {
                      forceUpdate: false,
                    })
                  }
                  error={form.errors.mileageKm}
                />
                <Select
                  key={form.key("bodyType")}
                  label="Кузов"
                  placeholder="Выберите кузов"
                  data={BODY_TYPE_OPTIONS}
                  searchable
                  clearable
                  {...form.getInputProps("bodyType")}
                />
                <DigitNumberInput
                  label="Объём двигателя, см³"
                  placeholder="1 987"
                  defaultValue={values.engineVolumeCc}
                  onChange={(value) =>
                    form.setFieldValue("engineVolumeCc", value, {
                      forceUpdate: false,
                    })
                  }
                  error={form.errors.engineVolumeCc}
                />
                <DigitNumberInput
                  label="Мощность, л. с."
                  placeholder="171"
                  defaultValue={values.powerHp}
                  onChange={(value) =>
                    form.setFieldValue("powerHp", value, {
                      forceUpdate: false,
                    })
                  }
                  error={form.errors.powerHp}
                />
                <Select
                  key={form.key("fuelType")}
                  label="Топливо"
                  placeholder="Выберите тип"
                  data={FUEL_TYPE_OPTIONS}
                  searchable
                  clearable
                  {...form.getInputProps("fuelType")}
                />
                <Select
                  key={form.key("transmission")}
                  label="Коробка передач"
                  placeholder="Выберите тип"
                  data={TRANSMISSION_OPTIONS}
                  searchable
                  clearable
                  {...form.getInputProps("transmission")}
                />
                <Select
                  key={form.key("drive")}
                  label="Привод"
                  placeholder="Выберите привод"
                  data={DRIVE_OPTIONS}
                  searchable
                  clearable
                  {...form.getInputProps("drive")}
                />
                <Select
                  key={form.key("steeringWheel")}
                  label="Руль"
                  placeholder="Выберите сторону"
                  data={STEERING_WHEEL_OPTIONS}
                  clearable
                  {...form.getInputProps("steeringWheel")}
                />
                <Select
                  key={form.key("color")}
                  label="Цвет"
                  placeholder="Выберите цвет"
                  data={colors.map((color) => ({
                    value: color.id,
                    label: color.name,
                  }))}
                  renderOption={({ option }) => (
                    <Group gap="xs">
                      <span
                        className={classes.swatch}
                        style={{
                          backgroundColor: colors.find(
                            (color) => color.id === option.value,
                          )?.hex,
                        }}
                      />
                      {option.label}
                    </Group>
                  )}
                  leftSection={
                    form.getValues().color ? (
                      <span
                        className={classes.swatch}
                        style={{
                          backgroundColor: colors.find(
                            (color) => color.id === form.getValues().color,
                          )?.hex,
                        }}
                      />
                    ) : undefined
                  }
                  searchable
                  clearable
                  {...form.getInputProps("color")}
                />
              </SimpleGrid>
              <CarDescriptionEditor
                value={form.getValues().description}
                onChange={(html) => form.setFieldValue("description", html)}
              />
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <CarPhotoEditor
              photos={photos}
              onAdd={addPhotos}
              onMove={moveCarPhoto}
              onRemove={removeCarPhoto}
            />
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <Stack gap="lg">
              <Title order={2} size="h4">
                Цена
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DigitNumberInput
                  label="Исходная цена"
                  placeholder="1 200 000"
                  defaultValue={values.sourcePrice}
                  onChange={(value) =>
                    form.setFieldValue("sourcePrice", value, {
                      forceUpdate: false,
                    })
                  }
                  error={form.errors.sourcePrice}
                />
                <Select
                  key={form.key("currency")}
                  label="Валюта"
                  placeholder="Выберите валюту"
                  data={CURRENCY_OPTIONS}
                  allowDeselect={false}
                  {...form.getInputProps("currency")}
                />
              </SimpleGrid>
              <Divider />
              <Radio.Group
                label="Цена на сайте"
                value={priceMode}
                onChange={(value) => {
                  const next = value as PriceMode;
                  setPriceMode(next);
                  form.setFieldValue("priceMode", next);
                }}
              >
                <Group mt="xs">
                  {PRICE_MODE_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Group>
              </Radio.Group>
              {priceMode === "fixed" ? (
                <DigitNumberInput
                  label="Фиксированная цена, ₽"
                  placeholder="2 480 000"
                  required
                  defaultValue={values.fixedPriceRub}
                  onChange={(value) =>
                    form.setFieldValue("fixedPriceRub", value, {
                      forceUpdate: false,
                    })
                  }
                  error={form.errors.fixedPriceRub}
                />
              ) : (
                <Text size="sm" c="dimmed">
                  Рублёвая цена появится после расчёта. Карточку можно сохранить
                  как черновик.
                </Text>
              )}
            </Stack>
          </Paper>
        </EditorLayout>
      </form>
      <UnsavedChangesModal
        opened={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onDiscard={() => {
          setConfirmLeave(false);
          onCancel();
        }}
      />
      <Modal
        opened={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Удалить автомобиль?"
        centered
      >
        <Stack gap="lg">
          <Text size="sm">
            Карточка и её публикация будут удалены. Это действие нельзя
            отменить.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setConfirmDelete(false)}>
              Отмена
            </Button>
            <Button color="red" loading={busy} onClick={() => void remove()}>
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
