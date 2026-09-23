import {
  Badge,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { formatCompactDate } from "@/shared/lib/format-compact-date";
import {
  CURRENCY_LABELS,
  type Currency,
  type ExchangeRate,
  type RateMode,
} from "../../model/pricing-demo";
import { getEffectiveRate } from "../../lib/compare-pricing-drafts";
import classes from "./ExchangeRatesCard.module.css";

const MODE_OPTIONS = [
  { value: "auto", label: "Автоматически" },
  { value: "manual", label: "Вручную" },
];

type ExchangeRatesCardProps = {
  rates: ExchangeRate[];
  onModeChange: (currency: Currency, mode: RateMode) => void;
  onManualChange: (currency: Currency, value: number | null) => void;
};

export function ExchangeRatesCard({
  rates,
  onModeChange,
  onManualChange,
}: ExchangeRatesCardProps) {
  return (
    <Paper withBorder radius="lg" className={classes.paper}>
      <Stack gap={4} className={classes.heading}>
        <Title order={2} size="h3">
          Курсы валют
        </Title>
        <Text size="sm" c="dimmed">
          Курс ЦБ — справочный. Курс фактической оплаты задаётся отдельно после
          согласования с компанией.
        </Text>
      </Stack>
      <div className={classes.scroll}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          miw={800}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Валюта</Table.Th>
              <Table.Th>Источник и дата</Table.Th>
              <Table.Th>Режим</Table.Th>
              <Table.Th>Курс для проверки, ₽</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rates.map((rate) => (
              <Table.Tr key={rate.currency}>
                <Table.Td>
                  <Text fw={600}>{rate.currency}</Text>
                  <Text size="xs" c="dimmed">
                    {CURRENCY_LABELS[rate.currency]}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={8} wrap="nowrap">
                    <Badge variant="light" color="gray">
                      {rate.source}
                    </Badge>
                    <Text size="sm">{formatCompactDate(rate.effectiveAt)}</Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    Справочный:{" "}
                    {rate.referenceRub.toLocaleString("ru-RU", {
                      maximumFractionDigits: 4,
                    })}{" "}
                    ₽
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Select
                    aria-label={`Режим курса ${rate.currency}`}
                    data={MODE_OPTIONS}
                    value={rate.mode}
                    onChange={(value) =>
                      value && onModeChange(rate.currency, value as RateMode)
                    }
                    allowDeselect={false}
                    w={168}
                  />
                </Table.Td>
                <Table.Td>
                  {rate.mode === "manual" ? (
                    <NumberInput
                      aria-label={`Ручной курс ${rate.currency}`}
                      placeholder="0"
                      value={rate.manualRub ?? ""}
                      onChange={(value) =>
                        onManualChange(
                          rate.currency,
                          typeof value === "number" ? value : null,
                        )
                      }
                      min={0.0001}
                      decimalScale={4}
                      allowNegative={false}
                      hideControls
                      w={150}
                      error={
                        rate.manualRub === null || rate.manualRub <= 0
                          ? "Укажите курс"
                          : undefined
                      }
                    />
                  ) : (
                    <Text fw={600}>
                      {getEffectiveRate(rate).toLocaleString("ru-RU", {
                        maximumFractionDigits: 4,
                      })}
                    </Text>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Paper>
  );
}
