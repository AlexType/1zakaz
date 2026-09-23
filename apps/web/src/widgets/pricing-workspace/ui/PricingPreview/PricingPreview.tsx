import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { formatRubles } from "@/shared/lib/format-rubles";
import { getPricingChanges } from "../../lib/compare-pricing-drafts";
import {
  COUNTRY_OPTIONS,
  type ExchangeRate,
  type Expense,
} from "../../model/pricing-demo";
import type { PriceImpact } from "../../model/price-impact";
import classes from "./PricingPreview.module.css";

type PricingPreviewProps = {
  publishedRates: ExchangeRate[];
  draftRates: ExchangeRate[];
  publishedExpenses: Expense[];
  draftExpenses: Expense[];
  affectedCars: PriceImpact[];
  valid: boolean;
  ruleChangeCount?: number;
  onPublish: () => void;
  onReset: () => void;
};

export function PricingPreview({
  publishedRates,
  draftRates,
  publishedExpenses,
  draftExpenses,
  affectedCars,
  valid,
  ruleChangeCount = 0,
  onPublish,
  onReset,
}: PricingPreviewProps) {
  const changes = getPricingChanges(
    publishedRates,
    draftRates,
    publishedExpenses,
    draftExpenses,
  );
  const totalChanges = changes.count + ruleChangeCount;
  return (
    <Stack gap="lg">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" align="start" gap="md" mb="lg">
          <div>
            <Title order={2} size="h3">
              Изменения перед публикацией
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Проверьте значения. После публикации новая версия станет доступна
              для расчётов.
            </Text>
          </div>
          <Badge variant="light" color={totalChanges ? "orange" : "gray"}>
            {totalChanges ? `Изменено: ${totalChanges}` : "Нет изменений"}
          </Badge>
        </Group>
        {totalChanges ? (
          <div className={classes.scroll}>
            <Table verticalSpacing="sm" horizontalSpacing="md" miw={550}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Параметр</Table.Th>
                  <Table.Th ta="right">Было</Table.Th>
                  <Table.Th ta="center" w={44} />
                  <Table.Th ta="right">Станет</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {changes.rates.map((change) => (
                  <Table.Tr key={change.id}>
                    <Table.Td>{change.label}</Table.Td>
                    <Table.Td ta="right">
                      {Number(change.before).toLocaleString("ru-RU", {
                        maximumFractionDigits: 4,
                      })}{" "}
                      ₽
                    </Table.Td>
                    <Table.Td ta="center">
                      <IconArrowRight size={15} />
                    </Table.Td>
                    <Table.Td ta="right" fw={600}>
                      {Number(change.after).toLocaleString("ru-RU", {
                        maximumFractionDigits: 4,
                      })}{" "}
                      ₽
                    </Table.Td>
                  </Table.Tr>
                ))}
                {changes.expenses.map((change) => (
                  <Table.Tr key={change.id}>
                    <Table.Td>{change.label}</Table.Td>
                    <Table.Td ta="right">
                      {formatRubles(Number(change.before))}
                    </Table.Td>
                    <Table.Td ta="center">
                      <IconArrowRight size={15} />
                    </Table.Td>
                    <Table.Td ta="right" fw={600}>
                      {typeof change.after === "number"
                        ? formatRubles(change.after)
                        : "Не заполнено"}
                    </Table.Td>
                  </Table.Tr>
                ))}
                {ruleChangeCount > 0 && (
                  <Table.Tr>
                    <Table.Td>Таблицы и параметры расчёта</Table.Td>
                    <Table.Td ta="right">Текущая редакция</Table.Td>
                    <Table.Td ta="center">
                      <IconArrowRight size={15} />
                    </Table.Td>
                    <Table.Td ta="right" fw={600}>
                      Новая редакция
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <Text size="sm" c="dimmed">
            Измените курс, тариф или правило, чтобы сравнить новую версию с
            опубликованной.
          </Text>
        )}
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={onReset} disabled={!totalChanges}>
            Отменить изменения
          </Button>
          <Button
            leftSection={<IconCheck size={18} />}
            onClick={onPublish}
            disabled={!totalChanges || !valid}
          >
            Опубликовать версию
          </Button>
        </Group>
        {!valid && (
          <Text size="sm" c="red" ta="right" mt="xs">
            Заполните все обязательные значения.
          </Text>
        )}
      </Paper>

      <Paper withBorder radius="lg" p="lg">
        <Title order={2} size="h3">
          Влияние курса на автомобили
        </Title>
        <Text size="sm" c="dimmed" mt={4} mb="md">
          Показана только валютная часть: исходная цена × курс. Доставка,
          пошлины, комиссия и итоговая цена здесь не рассчитываются.
        </Text>
        {affectedCars.length ? (
          <div className={classes.scroll}>
            <Table verticalSpacing="sm" horizontalSpacing="md" miw={670}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Автомобиль</Table.Th>
                  <Table.Th ta="right">Цена в валюте</Table.Th>
                  <Table.Th ta="right">Было, ₽</Table.Th>
                  <Table.Th ta="right">Станет, ₽</Table.Th>
                  <Table.Th ta="right">Разница</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {affectedCars.map((car) => (
                  <Table.Tr key={car.id}>
                    <Table.Td>
                      <Text fw={600} size="sm">
                        {car.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {
                          COUNTRY_OPTIONS.find(
                            (option) => option.value === car.country,
                          )?.label
                        }
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      {car.sourcePrice.toLocaleString("ru-RU")} {car.currency}
                    </Table.Td>
                    <Table.Td ta="right">{formatRubles(car.oldRub)}</Table.Td>
                    <Table.Td ta="right">{formatRubles(car.newRub)}</Table.Td>
                    <Table.Td
                      ta="right"
                      c={car.newRub > car.oldRub ? "red" : "green"}
                      fw={600}
                    >
                      {car.newRub > car.oldRub ? "+" : ""}
                      {formatRubles(car.newRub - car.oldRub)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <Text size="sm" c="dimmed">
            Валютная часть автомобилей не изменилась.
          </Text>
        )}
      </Paper>
    </Stack>
  );
}
