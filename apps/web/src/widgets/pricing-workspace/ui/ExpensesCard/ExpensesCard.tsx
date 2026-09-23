import {
  Group,
  NumberInput,
  Paper,
  SegmentedControl,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { formatRubles } from "@/shared/lib/format-rubles";
import {
  COUNTRY_OPTIONS,
  type Country,
  type Expense,
} from "../../model/pricing-demo";
import classes from "./ExpensesCard.module.css";

type ExpensesCardProps = {
  country: Country;
  publishedExpenses: Expense[];
  expenses: Expense[];
  onCountryChange: (country: Country) => void;
  onAmountChange: (id: string, amountRub: number | "") => void;
};

export function ExpensesCard({
  country,
  publishedExpenses,
  expenses,
  onCountryChange,
  onAmountChange,
}: ExpensesCardProps) {
  const visible = expenses.filter((expense) => expense.country === country);
  return (
    <Paper withBorder radius="lg" className={classes.paper}>
      <Group
        justify="space-between"
        align="start"
        gap="md"
        className={classes.heading}
      >
        <Stack gap={4}>
          <Title order={2} size="h3">
            Расходы по направлениям
          </Title>
          <Text size="sm" c="dimmed">
            Изменения тарифов вступают в силу после публикации.
          </Text>
        </Stack>
        <SegmentedControl
          aria-label="Страна расходов"
          data={COUNTRY_OPTIONS.map(({ value, label }) => ({ value, label }))}
          value={country}
          onChange={(value) => onCountryChange(value as Country)}
        />
      </Group>
      <div className={classes.scroll}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="md"
          miw={540}
          className={classes.table}
        >
          <colgroup>
            <col className={classes.expenseColumn} />
            <col className={classes.currentColumn} />
            <col className={classes.nextColumn} />
          </colgroup>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Расход</Table.Th>
              <Table.Th>Текущее значение</Table.Th>
              <Table.Th>Новое значение, ₽</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visible.map((expense) => (
              <Table.Tr key={expense.id}>
                <Table.Td>
                  <Text fw={600}>{expense.label}</Text>
                  {expense.note && (
                    <Text size="xs" c="dimmed">
                      {expense.note}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  {formatRubles(
                    Number(
                      publishedExpenses.find((item) => item.id === expense.id)
                        ?.amountRub ?? 0,
                    ),
                  )}
                </Table.Td>
                <Table.Td>
                  <NumberInput
                    aria-label={`Сумма: ${expense.label}`}
                    placeholder="0"
                    value={expense.amountRub}
                    onChange={(value) =>
                      onAmountChange(
                        expense.id,
                        typeof value === "number" ? value : "",
                      )
                    }
                    thousandSeparator=" "
                    allowNegative={false}
                    allowDecimal={false}
                    hideControls
                    w={148}
                    error={
                      expense.amountRub === "" ? "Укажите сумму" : undefined
                    }
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Paper>
  );
}
