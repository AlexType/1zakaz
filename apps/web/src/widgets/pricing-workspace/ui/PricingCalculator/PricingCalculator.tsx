"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCalculator } from "@tabler/icons-react";
import { showActionError } from "@/shared/lib/show-action-notification";
import type {
  CalculatePrice,
  CalculationRequest,
  CalculationResult,
  ImporterType,
  PowertrainType,
  PurchaseChannel,
  UsagePurpose,
  VehicleCategory,
} from "../../model/calculation";
import {
  COUNTRY_CURRENCY,
  DESTINATION_OPTIONS,
  IMPORTER_OPTIONS,
  MONTH_OPTIONS,
  POWERTRAIN_OPTIONS,
  PURCHASE_CHANNEL_OPTIONS,
  USAGE_PURPOSE_OPTIONS,
  VEHICLE_CATEGORY_OPTIONS,
  YEAR_OPTIONS,
} from "../../model/calculation-options";
import { COUNTRY_OPTIONS, type Country } from "../../model/pricing-demo";
import { CalculationResultView } from "../CalculationResultView";
import classes from "./PricingCalculator.module.css";

type CalculatorForm = Omit<
  CalculationRequest,
  | "priceAmount"
  | "manufactureYear"
  | "manufactureMonth"
  | "engineVolumeCm3"
  | "enginePowerHp"
  | "systemPowerHp"
> & {
  priceAmount: number | "";
  manufactureYear: string;
  manufactureMonth: string;
  engineVolumeCm3: number | "";
  enginePowerHp: number | "";
  systemPowerHp: number | "";
};

type PricingCalculatorProps = {
  onCalculate: CalculatePrice;
  revisionKey?: string;
};

const POWERTRAIN_WITHOUT_VOLUME: PowertrainType[] = ["electric"];
const POWERTRAIN_WITH_SEPARATE_ENGINE_POWER: PowertrainType[] = [
  "parallel_hybrid",
  "series_hybrid",
  "plug_in_hybrid",
];

export function PricingCalculator({
  onCalculate,
  revisionKey = "",
}: PricingCalculatorProps) {
  const form = useForm<CalculatorForm>({
    mode: "controlled",
    initialValues: {
      country: "japan",
      purchaseChannel: "auction",
      currency: "JPY",
      priceAmount: 1_200_000,
      manufactureYear: String(new Date().getFullYear() - 3),
      manufactureMonth: "6",
      vehicleCategory: "M1",
      powertrainType: "petrol",
      engineVolumeCm3: 1800,
      enginePowerHp: 140,
      systemPowerHp: 140,
      importerType: "individual",
      usagePurpose: "personal",
      preferentialRecyclingEligible: true,
      destinationCity: "Владивосток",
    },
    validate: {
      priceAmount: (value) =>
        typeof value !== "number" || value <= 0
          ? "Укажите цену автомобиля"
          : null,
      manufactureYear: (value) => (!value ? "Выберите год выпуска" : null),
      manufactureMonth: (value) => (!value ? "Выберите месяц выпуска" : null),
      engineVolumeCm3: (value, values) =>
        !POWERTRAIN_WITHOUT_VOLUME.includes(values.powertrainType) &&
        (typeof value !== "number" || value <= 0)
          ? "Укажите объём двигателя"
          : null,
      enginePowerHp: (value, values) =>
        values.powertrainType !== "electric" &&
        (typeof value !== "number" || value <= 0)
          ? "Укажите мощность ДВС"
          : null,
      systemPowerHp: (value) =>
        typeof value !== "number" || value <= 0
          ? "Укажите суммарную мощность"
          : null,
      destinationCity: (value) => (!value ? "Выберите город доставки" : null),
    },
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [lastInput, setLastInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputKey = `${JSON.stringify(form.values)}:${revisionKey}`;
  const stale = result !== null && lastInput !== inputKey;
  const needsVolume = !POWERTRAIN_WITHOUT_VOLUME.includes(
    form.values.powertrainType,
  );
  const needsSeparateEnginePower =
    POWERTRAIN_WITH_SEPARATE_ENGINE_POWER.includes(form.values.powertrainType);

  function changeCountry(country: Country) {
    form.setValues({
      country,
      currency: COUNTRY_CURRENCY[country],
      priceAmount: "",
    });
    form.clearFieldError("priceAmount");
    setResult(null);
  }

  function changePowertrain(powertrainType: PowertrainType) {
    form.setFieldValue("powertrainType", powertrainType);
    if (powertrainType === "electric") {
      form.setFieldValue("engineVolumeCm3", "");
      form.setFieldValue("enginePowerHp", "");
    }
  }

  function changeImporter(importerType: ImporterType) {
    form.setFieldValue("importerType", importerType);
    if (importerType === "company") {
      form.setFieldValue("usagePurpose", "commercial");
      form.setFieldValue("preferentialRecyclingEligible", false);
    }
  }

  async function calculate(values: CalculatorForm) {
    if (loading || values.priceAmount === "" || values.systemPowerHp === "")
      return;
    setLoading(true);
    try {
      const response = await onCalculate({
        ...values,
        priceAmount: values.priceAmount,
        manufactureYear: Number(values.manufactureYear),
        manufactureMonth: Number(values.manufactureMonth),
        engineVolumeCm3: needsVolume ? Number(values.engineVolumeCm3) : null,
        enginePowerHp:
          values.powertrainType === "electric"
            ? null
            : Number(values.enginePowerHp),
        systemPowerHp: values.systemPowerHp,
      });
      setResult(response);
      setLastInput(`${JSON.stringify(values)}:${revisionKey}`);
    } catch {
      showActionError(
        "Расчёт недоступен. Проверьте параметры и повторите запрос.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={classes.layout}>
      <Paper withBorder radius="lg" p="lg">
        <Stack gap="lg">
          <div>
            <Title order={2} size="h3">
              Параметры расчёта
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Поля меняются в зависимости от способа ввоза и силовой установки.
            </Text>
          </div>
          <Box component="form" onSubmit={form.onSubmit(calculate)}>
            <Stack gap="lg">
              <div>
                <Text size="sm" fw={500} mb={6}>
                  Страна покупки
                </Text>
                <SegmentedControl
                  fullWidth
                  aria-label="Страна покупки"
                  data={COUNTRY_OPTIONS.map(({ value, label }) => ({
                    value,
                    label,
                  }))}
                  value={form.values.country}
                  onChange={(value) => changeCountry(value as Country)}
                />
              </div>
              <SimpleGrid cols={{ base: 1, xs: 2 }}>
                <Select
                  label="Способ покупки"
                  placeholder="Выберите способ"
                  data={PURCHASE_CHANNEL_OPTIONS}
                  value={form.values.purchaseChannel}
                  onChange={(value) =>
                    value &&
                    form.setFieldValue(
                      "purchaseChannel",
                      value as PurchaseChannel,
                    )
                  }
                  allowDeselect={false}
                />
                <NumberInput
                  label={`Цена автомобиля, ${form.values.currency}`}
                  placeholder="Например, 1 200 000"
                  value={form.values.priceAmount}
                  onChange={(value) =>
                    form.setFieldValue(
                      "priceAmount",
                      typeof value === "number" ? value : "",
                    )
                  }
                  error={form.errors.priceAmount}
                  thousandSeparator=" "
                  allowNegative={false}
                  allowDecimal={false}
                  hideControls
                  min={0}
                  inputMode="numeric"
                />
              </SimpleGrid>
              <Divider label="Автомобиль" labelPosition="left" />
              <SimpleGrid cols={{ base: 1, xs: 2 }}>
                <Select
                  label="Год выпуска"
                  placeholder="Выберите год"
                  data={YEAR_OPTIONS}
                  searchable
                  {...form.getInputProps("manufactureYear")}
                />
                <Select
                  label="Месяц выпуска"
                  placeholder="Выберите месяц"
                  data={MONTH_OPTIONS}
                  {...form.getInputProps("manufactureMonth")}
                />
                <Select
                  label="Категория"
                  placeholder="Выберите категорию"
                  data={VEHICLE_CATEGORY_OPTIONS}
                  value={form.values.vehicleCategory}
                  onChange={(value) =>
                    value &&
                    form.setFieldValue(
                      "vehicleCategory",
                      value as VehicleCategory,
                    )
                  }
                  allowDeselect={false}
                />
                <Select
                  label="Силовая установка"
                  placeholder="Выберите тип"
                  data={POWERTRAIN_OPTIONS}
                  value={form.values.powertrainType}
                  onChange={(value) =>
                    value && changePowertrain(value as PowertrainType)
                  }
                  allowDeselect={false}
                />
                {needsVolume && (
                  <NumberInput
                    label="Объём двигателя, см³"
                    placeholder="Например, 1 800"
                    value={form.values.engineVolumeCm3}
                    onChange={(value) =>
                      form.setFieldValue(
                        "engineVolumeCm3",
                        typeof value === "number" ? value : "",
                      )
                    }
                    error={form.errors.engineVolumeCm3}
                    thousandSeparator=" "
                    allowNegative={false}
                    allowDecimal={false}
                    hideControls
                    min={1}
                    inputMode="numeric"
                  />
                )}
                {form.values.powertrainType !== "electric" && (
                  <NumberInput
                    label={
                      needsSeparateEnginePower
                        ? "Мощность ДВС, л.с."
                        : "Мощность, л.с."
                    }
                    placeholder="Например, 140"
                    value={form.values.enginePowerHp}
                    onChange={(value) => {
                      const next = typeof value === "number" ? value : "";
                      form.setFieldValue("enginePowerHp", next);
                      if (!needsSeparateEnginePower)
                        form.setFieldValue("systemPowerHp", next);
                    }}
                    error={form.errors.enginePowerHp}
                    allowNegative={false}
                    allowDecimal={false}
                    hideControls
                    min={1}
                    inputMode="numeric"
                  />
                )}
                {(needsSeparateEnginePower ||
                  form.values.powertrainType === "electric") && (
                  <NumberInput
                    label="Суммарная мощность, л.с."
                    placeholder="Например, 150"
                    description="По данным документации на силовую установку"
                    value={form.values.systemPowerHp}
                    onChange={(value) =>
                      form.setFieldValue(
                        "systemPowerHp",
                        typeof value === "number" ? value : "",
                      )
                    }
                    error={form.errors.systemPowerHp}
                    allowNegative={false}
                    allowDecimal={false}
                    hideControls
                    min={1}
                    inputMode="numeric"
                  />
                )}
              </SimpleGrid>
              <Divider label="Ввоз и доставка" labelPosition="left" />
              <SimpleGrid cols={{ base: 1, xs: 2 }}>
                <Select
                  label="Кто ввозит автомобиль"
                  placeholder="Выберите категорию"
                  data={IMPORTER_OPTIONS}
                  value={form.values.importerType}
                  onChange={(value) =>
                    value && changeImporter(value as ImporterType)
                  }
                  allowDeselect={false}
                />
                <Select
                  label="Назначение ввоза"
                  placeholder="Выберите назначение"
                  data={USAGE_PURPOSE_OPTIONS}
                  value={form.values.usagePurpose}
                  onChange={(value) =>
                    value &&
                    form.setFieldValue("usagePurpose", value as UsagePurpose)
                  }
                  allowDeselect={false}
                  disabled={form.values.importerType === "company"}
                />
                <Select
                  label="Город доставки"
                  placeholder="Выберите город"
                  searchable
                  data={DESTINATION_OPTIONS}
                  {...form.getInputProps("destinationCity")}
                />
              </SimpleGrid>
              {form.values.importerType === "individual" &&
                form.values.usagePurpose === "personal" && (
                  <Checkbox
                    label="Условия льготного утильсбора соблюдены"
                    description="Автомобиль ввозится для личного пользования; право на льготный коэффициент будет проверено при оформлении."
                    checked={form.values.preferentialRecyclingEligible}
                    onChange={(event) =>
                      form.setFieldValue(
                        "preferentialRecyclingEligible",
                        event.currentTarget.checked,
                      )
                    }
                  />
                )}
              <Group justify="flex-end">
                <Button
                  type="submit"
                  leftSection={<IconCalculator size={18} />}
                  loading={loading}
                >
                  Рассчитать
                </Button>
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      {result ? (
        <Stack gap="sm">
          {stale && (
            <Text size="sm" c="orange" fw={600}>
              Параметры изменены. Рассчитайте заново, чтобы обновить результат.
            </Text>
          )}
          <CalculationResultView result={result} />
        </Stack>
      ) : (
        <Paper withBorder radius="lg" p="xl" className={classes.emptyResult}>
          <Title order={2} size="h3">
            Расчёт стоимости
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            Заполните параметры и нажмите «Рассчитать».
          </Text>
        </Paper>
      )}
    </div>
  );
}
