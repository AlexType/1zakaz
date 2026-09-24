import { Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { formatRubles } from "@/shared/lib/format-rubles";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import {
  CAR_SELECTION_CONDITION_LABELS,
  CAR_SELECTION_CONTACT_METHOD_LABELS,
  CAR_SELECTION_COUNTRY_LABELS,
  CAR_SELECTION_VEHICLE_TYPE_LABELS,
} from "../../model/car-selection-options";
import type { CarSelectionRequestSubmission } from "../../model/car-selection-request";
import classes from "./CarSelectionSuccess.module.css";

type CarSelectionSuccessProps = {
  submission: CarSelectionRequestSubmission;
  responseTimeText: string;
};

export function CarSelectionSuccess({
  submission,
  responseTimeText,
}: CarSelectionSuccessProps) {
  const vehicle =
    submission.selectionMode === "specific"
      ? submission.vehicleQuery
      : CAR_SELECTION_VEHICLE_TYPE_LABELS[submission.vehicleType || "other"];

  return (
    <Paper
      component="section"
      withBorder
      radius="lg"
      p={{ base: "md", sm: "lg" }}
    >
      <Stack gap="md">
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <ThemeIcon color="teal" variant="light" radius="xl" size={36}>
            <IconCheck size={20} aria-hidden="true" />
          </ThemeIcon>
          <div>
            <Title order={2} size="h3">
              Заявка принята
            </Title>
            <Text c="dimmed" size="sm" mt={2}>
              {responseTimeText}
            </Text>
          </div>
        </Group>
        <div>
          <Text size="sm" fw={600} mb={4}>
            Ваша заявка
          </Text>
          <dl className={classes.summary}>
            <div className={classes.summaryItem}>
              <dt>
                <Text size="xs" c="dimmed">
                  Автомобиль
                </Text>
              </dt>
              <dd>
                <Text size="sm" fw={500}>
                  {vehicle}
                </Text>
              </dd>
            </div>
            <div className={classes.summaryItem}>
              <dt>
                <Text size="xs" c="dimmed">
                  Страна и состояние
                </Text>
              </dt>
              <dd>
                <Text size="sm" fw={500}>
                  {
                    CAR_SELECTION_COUNTRY_LABELS[
                      submission.country || "unknown"
                    ]
                  }
                  {" · "}
                  {
                    CAR_SELECTION_CONDITION_LABELS[
                      submission.condition || "any"
                    ]
                  }
                </Text>
              </dd>
            </div>
            <div className={classes.summaryItem}>
              <dt>
                <Text size="xs" c="dimmed">
                  Бюджет под ключ
                </Text>
              </dt>
              <dd>
                <Text size="sm" fw={500}>
                  до {formatRubles(Number(submission.budgetRub))}
                </Text>
              </dd>
            </div>
            <div className={classes.summaryItem}>
              <dt>
                <Text size="xs" c="dimmed">
                  Город получения
                </Text>
              </dt>
              <dd>
                <Text size="sm" fw={500}>
                  {submission.deliveryCity}
                </Text>
              </dd>
            </div>
            <div className={classes.summaryItem}>
              <dt>
                <Text size="xs" c="dimmed">
                  Контакт
                </Text>
              </dt>
              <dd>
                <Text size="sm" fw={500}>
                  {
                    CAR_SELECTION_CONTACT_METHOD_LABELS[
                      submission.contactMethod || "phone"
                    ]
                  }
                  {" · "}
                  {formatRussianPhone(submission.phone)}
                </Text>
              </dd>
            </div>
          </dl>
        </div>
      </Stack>
    </Paper>
  );
}
