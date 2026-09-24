"use client";

import { useState } from "react";
import { Badge, Paper, Stack, Tabs } from "@mantine/core";
import {
  IconCalculator,
  IconCurrencyRubel,
  IconListCheck,
  IconScale,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import { PageLoadingState } from "@/shared/ui/PageLoadingState";
import { createDemoCalculation } from "../../lib/stories/create-demo-calculation";
import { createDemoPriceImpact } from "../../lib/stories/create-demo-price-impact";
import { getPricingChanges } from "../../lib/compare-pricing-drafts";
import {
  DEMO_EXPENSES,
  DEMO_RULE_SET,
  DEMO_RATES,
  type Country,
  type Currency,
  type ExchangeRate,
  type Expense,
  type RateMode,
} from "../../model/pricing-demo";
import type { DemoRuleSet } from "../../model/calculation-rules";
import { CalculationRulesCard } from "../CalculationRulesCard";
import { ExchangeRatesCard } from "../ExchangeRatesCard";
import { ExpensesCard } from "../ExpensesCard";
import { PricingCalculator } from "../PricingCalculator";
import { PricingPreview } from "../PricingPreview";
import classes from "./PricingWorkspace.module.css";

type Props = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  initialTab?: string;
};

export function PricingWorkspace({
  loading = false,
  error = null,
  onRetry,
  initialTab = "rates",
}: Props = {}) {
  const [publishedRates, setPublishedRates] =
    useState<ExchangeRate[]>(DEMO_RATES);
  const [draftRates, setDraftRates] = useState<ExchangeRate[]>(DEMO_RATES);
  const [publishedExpenses, setPublishedExpenses] =
    useState<Expense[]>(DEMO_EXPENSES);
  const [draftExpenses, setDraftExpenses] = useState<Expense[]>(DEMO_EXPENSES);
  const [publishedRules, setPublishedRules] =
    useState<DemoRuleSet>(DEMO_RULE_SET);
  const [draftRules, setDraftRules] = useState<DemoRuleSet>(DEMO_RULE_SET);
  const [country, setCountry] = useState<Country>("japan");
  const [tab, setTab] = useState<string | null>(initialTab);
  const [version, setVersion] = useState(1);
  const changes = getPricingChanges(
    publishedRates,
    draftRates,
    publishedExpenses,
    draftExpenses,
  );
  const ruleChangeCount =
    JSON.stringify(publishedRules) === JSON.stringify(draftRules) ? 0 : 1;
  const valid =
    draftRates.every(
      (rate) =>
        rate.mode === "auto" || (rate.manualRub !== null && rate.manualRub > 0),
    ) &&
    draftExpenses.every((expense) => expense.amountRub !== "") &&
    draftRules.parameters.every((item) => item.value !== "") &&
    draftRules.newVehicleDutyBands.every(
      (item) => item.percent !== "" && item.minimumEuroPerCm3 !== "",
    ) &&
    draftRules.usedVehicleDutyBands.every(
      (item) =>
        item.threeToFiveEuroPerCm3 !== "" && item.overFiveEuroPerCm3 !== "",
    ) &&
    draftRules.recyclingRules.every(
      (item) =>
        item.maxPowerHp !== "" &&
        item.newVehicleRub !== "" &&
        item.overThreeYearsRub !== "",
    ) &&
    draftRules.deliveryTariffs.every((item) => item.amountRub !== "");

  function updateRate(
    currency: Currency,
    update: (rate: ExchangeRate) => ExchangeRate,
  ) {
    setDraftRates((rates) =>
      rates.map((rate) => (rate.currency === currency ? update(rate) : rate)),
    );
  }

  function changeMode(currency: Currency, mode: RateMode) {
    updateRate(currency, (rate) => ({
      ...rate,
      mode,
      manualRub:
        mode === "manual"
          ? (rate.manualRub ?? rate.referenceRub)
          : rate.manualRub,
    }));
  }

  function reset() {
    setDraftRates(publishedRates);
    setDraftExpenses(publishedExpenses);
    setDraftRules(publishedRules);
    showActionSuccess("Изменения отменены");
  }

  function publish() {
    if (!valid || (!changes.count && !ruleChangeCount)) return;
    setPublishedRates(draftRates.map((rate) => ({ ...rate })));
    setPublishedExpenses(draftExpenses.map((expense) => ({ ...expense })));
    setPublishedRules(structuredClone(draftRules));
    setVersion((current) => current + 1);
    showActionSuccess("Версия расчётных параметров опубликована");
  }

  return (
    <section className={classes.section} aria-label="Цены и калькуляторы">
      <Stack gap="lg">
        <AdminPageHeader
          title="Цены и калькуляторы"
          description="Курсы, расходы и проверка изменений перед публикацией"
          actions={
            <Badge variant="light" color="gray">
              Редакция {version}
            </Badge>
          }
        />
        {loading ? (
          <Paper withBorder radius="lg">
            <PageLoadingState label="Загружаем расчётные параметры…" />
          </Paper>
        ) : error ? (
          <Paper withBorder radius="lg">
            <GridErrorState
              title="Не удалось загрузить расчётные параметры"
              message={error}
              onRetry={onRetry}
            />
          </Paper>
        ) : (
          <Tabs value={tab} onChange={setTab}>
            <Tabs.List className={classes.tabsList}>
              <Tabs.Tab
                value="rates"
                leftSection={<IconCurrencyRubel size={17} />}
              >
                Курсы валют
              </Tabs.Tab>
              <Tabs.Tab value="rules" leftSection={<IconScale size={17} />}>
                Правила расчёта
              </Tabs.Tab>
              <Tabs.Tab
                value="expenses"
                leftSection={<IconTruckDelivery size={17} />}
              >
                Расходы
              </Tabs.Tab>
              <Tabs.Tab
                value="calculator"
                leftSection={<IconCalculator size={17} />}
              >
                Проверить расчёт
              </Tabs.Tab>
              <Tabs.Tab
                value="review"
                leftSection={<IconListCheck size={17} />}
              >
                Проверка{changes.count ? ` (${changes.count})` : ""}
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="rates" pt="lg">
              <ExchangeRatesCard
                rates={draftRates}
                onModeChange={changeMode}
                onManualChange={(currency, value) =>
                  updateRate(currency, (rate) => ({
                    ...rate,
                    manualRub: value,
                  }))
                }
              />
            </Tabs.Panel>
            <Tabs.Panel value="expenses" pt="lg">
              <ExpensesCard
                country={country}
                publishedExpenses={publishedExpenses}
                expenses={draftExpenses}
                onCountryChange={setCountry}
                onAmountChange={(id, amountRub) =>
                  setDraftExpenses((expenses) =>
                    expenses.map((expense) =>
                      expense.id === id ? { ...expense, amountRub } : expense,
                    ),
                  )
                }
              />
            </Tabs.Panel>
            <Tabs.Panel value="calculator" pt="lg">
              <PricingCalculator
                onCalculate={(request) =>
                  createDemoCalculation(
                    request,
                    draftRates,
                    draftExpenses,
                    draftRules,
                  )
                }
                revisionKey={JSON.stringify([
                  draftRates,
                  draftExpenses,
                  draftRules,
                ])}
              />
            </Tabs.Panel>
            <Tabs.Panel value="rules" pt="lg">
              <CalculationRulesCard
                rules={draftRules}
                onChange={setDraftRules}
              />
            </Tabs.Panel>
            <Tabs.Panel value="review" pt="lg">
              <PricingPreview
                publishedRates={publishedRates}
                draftRates={draftRates}
                publishedExpenses={publishedExpenses}
                draftExpenses={draftExpenses}
                affectedCars={createDemoPriceImpact(publishedRates, draftRates)}
                valid={valid}
                ruleChangeCount={ruleChangeCount}
                onPublish={publish}
                onReset={reset}
              />
            </Tabs.Panel>
          </Tabs>
        )}
      </Stack>
    </section>
  );
}
