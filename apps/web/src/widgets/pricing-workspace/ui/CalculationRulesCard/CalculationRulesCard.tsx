import {
  Accordion,
  Badge,
  Group,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type {
  DemoRuleSet,
  RuleParameterId,
} from "../../model/calculation-rules";
import classes from "./CalculationRulesCard.module.css";

type CalculationRulesCardProps = {
  rules: DemoRuleSet;
  onChange: (rules: DemoRuleSet) => void;
};

function numeric(value: string | number) {
  return typeof value === "number" ? value : "";
}

export function CalculationRulesCard({
  rules,
  onChange,
}: CalculationRulesCardProps) {
  function updateParameter(id: RuleParameterId, value: string | number) {
    onChange({
      ...rules,
      parameters: rules.parameters.map((item) =>
        item.id === id ? { ...item, value: numeric(value) } : item,
      ),
    });
  }

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
            Правила расчёта
          </Title>
          <Text size="sm" c="dimmed">
            Таблицы ставок имеют редакцию и дату действия. Изменения применяются
            к проверочному расчёту до публикации.
          </Text>
        </Stack>
        <Badge variant="light" color="gray">
          {rules.revision}
        </Badge>
      </Group>
      <Accordion multiple defaultValue={["parameters"]}>
        <Accordion.Item value="parameters">
          <Accordion.Control>
            Тарифы, услуги и коммерческий ввоз
          </Accordion.Control>
          <Accordion.Panel>
            <div className={classes.scroll}>
              <Table
                striped
                highlightOnHover
                verticalSpacing="sm"
                className={classes.table}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Параметр</Table.Th>
                    <Table.Th>Источник</Table.Th>
                    <Table.Th>Единица</Table.Th>
                    <Table.Th ta="right">Значение</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rules.parameters.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Text fw={600} size="sm">
                          {item.label}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {item.source}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {item.unit === "percent"
                            ? "%"
                            : item.unit === "rub_per_hp"
                              ? "₽ за л.с."
                              : "₽"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          aria-label={item.label}
                          placeholder="0"
                          className={classes.number}
                          ml="auto"
                          value={item.value}
                          onChange={(value) => updateParameter(item.id, value)}
                          thousandSeparator=" "
                          decimalScale={item.unit === "percent" ? 2 : 0}
                          allowNegative={false}
                          hideControls
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="new-duty">
          <Accordion.Control>
            Пошлина: автомобили младше 3 лет
          </Accordion.Control>
          <Accordion.Panel>
            <div className={classes.scroll}>
              <Table striped verticalSpacing="sm" className={classes.table}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Стоимость до, €</Table.Th>
                    <Table.Th ta="right">Ставка, %</Table.Th>
                    <Table.Th ta="right">Минимум, €/см³</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rules.newVehicleDutyBands.map((band) => (
                    <Table.Tr key={band.id}>
                      <Table.Td>
                        {band.maxValueEuro === null
                          ? "Без верхней границы"
                          : band.maxValueEuro.toLocaleString("ru-RU")}
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          aria-label={`Процент ${band.id}`}
                          placeholder="0"
                          className={classes.number}
                          ml="auto"
                          value={band.percent}
                          onChange={(value) =>
                            onChange({
                              ...rules,
                              newVehicleDutyBands:
                                rules.newVehicleDutyBands.map((item) =>
                                  item.id === band.id
                                    ? { ...item, percent: numeric(value) }
                                    : item,
                                ),
                            })
                          }
                          allowNegative={false}
                          hideControls
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          aria-label={`Минимум ${band.id}`}
                          placeholder="0"
                          className={classes.number}
                          ml="auto"
                          value={band.minimumEuroPerCm3}
                          onChange={(value) =>
                            onChange({
                              ...rules,
                              newVehicleDutyBands:
                                rules.newVehicleDutyBands.map((item) =>
                                  item.id === band.id
                                    ? {
                                        ...item,
                                        minimumEuroPerCm3: numeric(value),
                                      }
                                    : item,
                                ),
                            })
                          }
                          decimalScale={2}
                          allowNegative={false}
                          hideControls
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="used-duty">
          <Accordion.Control>
            Пошлина: автомобили старше 3 лет
          </Accordion.Control>
          <Accordion.Panel>
            <div className={classes.scroll}>
              <Table striped verticalSpacing="sm" className={classes.table}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Объём до, см³</Table.Th>
                    <Table.Th ta="right">3–5 лет, €/см³</Table.Th>
                    <Table.Th ta="right">Старше 5 лет, €/см³</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rules.usedVehicleDutyBands.map((band) => (
                    <Table.Tr key={band.id}>
                      <Table.Td>
                        {band.maxVolumeCm3 === null
                          ? "Без верхней границы"
                          : band.maxVolumeCm3.toLocaleString("ru-RU")}
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          aria-label={`Ставка 3–5 лет ${band.id}`}
                          placeholder="0"
                          className={classes.number}
                          ml="auto"
                          value={band.threeToFiveEuroPerCm3}
                          onChange={(value) =>
                            onChange({
                              ...rules,
                              usedVehicleDutyBands:
                                rules.usedVehicleDutyBands.map((item) =>
                                  item.id === band.id
                                    ? {
                                        ...item,
                                        threeToFiveEuroPerCm3: numeric(value),
                                      }
                                    : item,
                                ),
                            })
                          }
                          decimalScale={2}
                          allowNegative={false}
                          hideControls
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          aria-label={`Ставка старше 5 лет ${band.id}`}
                          placeholder="0"
                          className={classes.number}
                          ml="auto"
                          value={band.overFiveEuroPerCm3}
                          onChange={(value) =>
                            onChange({
                              ...rules,
                              usedVehicleDutyBands:
                                rules.usedVehicleDutyBands.map((item) =>
                                  item.id === band.id
                                    ? {
                                        ...item,
                                        overFiveEuroPerCm3: numeric(value),
                                      }
                                    : item,
                                ),
                            })
                          }
                          decimalScale={2}
                          allowNegative={false}
                          hideControls
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="recycling">
          <Accordion.Control>Льготный утилизационный сбор</Accordion.Control>
          <Accordion.Panel>
            <div className={classes.scroll}>
              <Table striped verticalSpacing="sm" className={classes.table}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Группа</Table.Th>
                    <Table.Th ta="right">Мощность до, л.с.</Table.Th>
                    <Table.Th ta="right">До 3 лет, ₽</Table.Th>
                    <Table.Th ta="right">Старше 3 лет, ₽</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rules.recyclingRules.map((rule) => (
                    <Table.Tr key={rule.id}>
                      <Table.Td>
                        <Text fw={600} size="sm">
                          {rule.label}
                        </Text>
                      </Table.Td>
                      {(
                        [
                          "maxPowerHp",
                          "newVehicleRub",
                          "overThreeYearsRub",
                        ] as const
                      ).map((field) => (
                        <Table.Td key={field}>
                          <NumberInput
                            aria-label={`${rule.label}: ${field}`}
                            placeholder="0"
                            className={classes.number}
                            ml="auto"
                            value={rule[field]}
                            onChange={(value) =>
                              onChange({
                                ...rules,
                                recyclingRules: rules.recyclingRules.map(
                                  (item) =>
                                    item.id === rule.id
                                      ? { ...item, [field]: numeric(value) }
                                      : item,
                                ),
                              })
                            }
                            thousandSeparator=" "
                            allowNegative={false}
                            hideControls
                          />
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="delivery">
          <Accordion.Control>Доставка по России</Accordion.Control>
          <Accordion.Panel>
            <div className={classes.scroll}>
              <Table striped verticalSpacing="sm" className={classes.table}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Город</Table.Th>
                    <Table.Th ta="right">Тариф, ₽</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rules.deliveryTariffs.map((tariff) => (
                    <Table.Tr key={tariff.city}>
                      <Table.Td>{tariff.city}</Table.Td>
                      <Table.Td>
                        <NumberInput
                          aria-label={`Доставка: ${tariff.city}`}
                          placeholder="0"
                          className={classes.number}
                          ml="auto"
                          value={tariff.amountRub}
                          onChange={(value) =>
                            onChange({
                              ...rules,
                              deliveryTariffs: rules.deliveryTariffs.map(
                                (item) =>
                                  item.city === tariff.city
                                    ? { ...item, amountRub: numeric(value) }
                                    : item,
                              ),
                            })
                          }
                          thousandSeparator=" "
                          allowNegative={false}
                          hideControls
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
}
