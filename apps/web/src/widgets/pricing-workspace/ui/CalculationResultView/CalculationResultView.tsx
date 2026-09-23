import {
  Badge,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  formatCompactDate,
  formatCompactDateTime,
} from "@/shared/lib/format-compact-date";
import { formatRubles } from "@/shared/lib/format-rubles";
import type { CalculationResult } from "../../model/calculation";
import {
  RESULT_CATEGORY_LABELS,
  RESULT_CATEGORY_ORDER,
} from "../../model/calculation-options";
import classes from "./CalculationResultView.module.css";

type CalculationResultViewProps = { result: CalculationResult };
const LINE_STATUS_LABELS = {
  calculated: "Рассчитано",
  estimate: "Оценка",
  pending: "Требует уточнения",
};

export function CalculationResultView({ result }: CalculationResultViewProps) {
  return (
    <Paper withBorder radius="lg" p="lg" aria-live="polite">
      <Group justify="space-between" align="start" gap="sm" mb="xs">
        <Title order={2} size="h3">
          Расчёт стоимости
        </Title>
        <Badge
          variant="light"
          color={result.status === "complete" ? "green" : "orange"}
        >
          {result.status === "complete"
            ? "Расчёт готов"
            : result.status === "estimate"
              ? "Предварительная смета"
              : "Часть сумм не рассчитана"}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        {formatCompactDateTime(result.calculatedAt)} · редакция{" "}
        {result.rulesRevision} · {result.rate.source}:{" "}
        {result.rate.rubPerUnit.toLocaleString("ru-RU", {
          maximumFractionDigits: 4,
        })}{" "}
        ₽ за 1 {result.rate.currency} · курс от{" "}
        {formatCompactDate(result.rate.effectiveAt)}
      </Text>
      <Stack gap="lg" mt="xl">
        {RESULT_CATEGORY_ORDER.map((category) => {
          const lines = result.lines.filter(
            (line) => line.category === category,
          );
          if (!lines.length) return null;
          return (
            <section
              key={category}
              aria-label={RESULT_CATEGORY_LABELS[category]}
            >
              <Text fw={700} size="sm" mb="xs">
                {RESULT_CATEGORY_LABELS[category]}
              </Text>
              <Stack gap="xs">
                {lines.map((line) => (
                  <Group
                    key={line.id}
                    justify="space-between"
                    align="baseline"
                    gap="sm"
                    wrap="nowrap"
                    className={classes.line}
                  >
                    <div>
                      <Text
                        size="sm"
                        c={line.amountRub === null ? "dimmed" : undefined}
                      >
                        {line.label}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {line.source ?? LINE_STATUS_LABELS[line.status]}
                      </Text>
                    </div>
                    <Group gap="xs" wrap="nowrap">
                      {line.status === "pending" && (
                        <Badge size="xs" variant="light" color="gray">
                          {LINE_STATUS_LABELS[line.status]}
                        </Badge>
                      )}
                      <Text
                        size="sm"
                        fw={line.amountRub === null ? 400 : 600}
                        c={line.amountRub === null ? "dimmed" : undefined}
                        ta="right"
                      >
                        {line.amountRub === null
                          ? "Не рассчитано"
                          : formatRubles(line.amountRub)}
                      </Text>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </section>
          );
        })}
      </Stack>
      <Divider my="lg" />
      {result.notice && (
        <Text size="sm" c="dimmed" mb="sm">
          {result.notice}
        </Text>
      )}
      {result.totalRub === null ? (
        <Text size="sm" c="dimmed">
          Итоговая стоимость пока не определена.
        </Text>
      ) : (
        <Group justify="space-between" gap="sm">
          <Text fw={700}>Итого</Text>
          <Text fw={700} size="lg">
            {formatRubles(result.totalRub)}
          </Text>
        </Group>
      )}
    </Paper>
  );
}
