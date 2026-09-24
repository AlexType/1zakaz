"use client";

import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconPhone,
} from "@tabler/icons-react";
import { CountryFlag, type CarCountry } from "@/entities/car";
import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";
import { DigitNumberInput } from "@/shared/ui/DigitNumberInput";
import { FormError } from "@/shared/ui/FormError";
import { PhoneInput } from "@/shared/ui/PhoneInput";
import { createCarSelectionRequestValues } from "../../lib/create-car-selection-request-values";
import {
  validateCarSelectionRequest,
  validateCarSelectionRequestStep,
} from "../../lib/validate-car-selection-request";
import {
  CAR_SELECTION_CONDITION_OPTIONS,
  CAR_SELECTION_CONTACT_METHOD_OPTIONS,
  CAR_SELECTION_COUNTRY_OPTIONS,
  CAR_SELECTION_PURCHASE_TIMING_OPTIONS,
  CAR_SELECTION_VEHICLE_TYPE_OPTIONS,
} from "../../model/car-selection-options";
import type {
  CarSelectionCondition,
  CarSelectionContactMethod,
  CarSelectionCountry,
  CarSelectionMode,
  CarSelectionPurchaseTiming,
  CarSelectionRequestSource,
  CarSelectionRequestStep,
  CarSelectionRequestSubmission,
  CarSelectionRequestValues,
  CarSelectionVehicleType,
} from "../../model/car-selection-request";
import { CarSelectionSuccess } from "../CarSelectionSuccess";
import classes from "./CarSelectionRequestForm.module.css";

const STEP_TITLES = ["Автомобиль", "Условия", "Контакты"] as const;

type CarSelectionRequestFormProps = {
  source?: CarSelectionRequestSource;
  initialValues?: Partial<CarSelectionRequestValues>;
  initialStep?: CarSelectionRequestStep;
  initialSubmission?: CarSelectionRequestSubmission;
  privacyPolicyUrl?: string;
  responseTimeText?: string;
  onSubmit?: (
    submission: CarSelectionRequestSubmission,
    source: CarSelectionRequestSource,
  ) => void | Promise<void>;
};

const DEFAULT_SOURCE: CarSelectionRequestSource = { kind: "default" };

const CONTACT_METHOD_ICONS = {
  telegram: IconBrandTelegram,
  whatsapp: IconBrandWhatsapp,
  phone: IconPhone,
} as const;

function ChoiceLabel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: string;
}) {
  return (
    <Group gap={6} wrap="nowrap" align="center">
      {icon}
      <span>{children}</span>
    </Group>
  );
}

export function CarSelectionRequestForm({
  source = DEFAULT_SOURCE,
  initialValues,
  initialStep = 0,
  initialSubmission,
  privacyPolicyUrl = "/privacy",
  responseTimeText = "Свяжемся с вами в рабочее время в течение 30 минут.",
  onSubmit,
}: CarSelectionRequestFormProps) {
  const [step, setStep] = useState<CarSelectionRequestStep>(initialStep);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submission, setSubmission] =
    useState<CarSelectionRequestSubmission | null>(initialSubmission ?? null);
  const form = useForm<CarSelectionRequestValues>({
    mode: "controlled",
    initialValues: createCarSelectionRequestValues(source, initialValues),
  });

  if (submission) {
    return (
      <div className={classes.shell}>
        <CarSelectionSuccess
          submission={submission}
          responseTimeText={responseTimeText}
        />
      </div>
    );
  }

  function showStepErrors(nextStep: CarSelectionRequestStep) {
    const errors = validateCarSelectionRequestStep(form.values, nextStep);
    form.setErrors(errors);
    return Object.keys(errors).length > 0;
  }

  function goForward() {
    if (showStepErrors(step)) return;
    setStep((step + 1) as CarSelectionRequestStep);
  }

  async function submit(values: CarSelectionRequestValues) {
    const errors = validateCarSelectionRequest(values);
    if (Object.keys(errors).length > 0) {
      form.setErrors(errors);
      if (
        errors.selectionMode ||
        errors.vehicleQuery ||
        errors.vehicleType ||
        errors.country ||
        errors.condition
      ) {
        setStep(0);
      } else if (errors.budgetRub || errors.deliveryCity || errors.wishes) {
        setStep(1);
      }
      return;
    }

    const normalizedPhone = normalizeRussianPhone(values.phone);
    if (!normalizedPhone) return;

    const nextSubmission: CarSelectionRequestSubmission = {
      ...values,
      vehicleQuery: values.vehicleQuery.trim(),
      deliveryCity: values.deliveryCity.trim(),
      wishes: values.wishes.trim(),
      clientName: values.clientName.trim(),
      phone: normalizedPhone,
    };

    setBusy(true);
    setSubmitError(null);
    try {
      await onSubmit?.(nextSubmission, source);
      setSubmission(nextSubmission);
    } catch {
      setSubmitError(
        "Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Paper
      component="section"
      withBorder
      radius="lg"
      p={{ base: "md", sm: "lg" }}
      className={classes.shell}
    >
      <Stack gap="md">
        <Title order={1} size="h3" className={classes.title}>
          Подбор и расчёт автомобиля
        </Title>

        <div
          className={classes.progress}
          aria-label={`Шаг ${step + 1} из 3: ${STEP_TITLES[step]}`}
        >
          <div className={classes.progressLabel}>
            <Text size="sm" fw={600}>
              {STEP_TITLES[step]}
            </Text>
            <Text size="xs" c="dimmed">
              {step + 1} / 3
            </Text>
          </div>
          <Progress
            value={((step + 1) / 3) * 100}
            size="xs"
            aria-hidden="true"
          />
        </div>

        <form
          onSubmit={form.onSubmit((values) => void submit(values))}
          noValidate
        >
          <Stack gap="md">
            <FormError message={submitError} />

            {step === 0 && (
              <>
                <Radio.Group
                  label="Вы уже выбрали автомобиль?"
                  required
                  withAsterisk={false}
                  value={form.values.selectionMode}
                  error={form.errors.selectionMode}
                  onChange={(value) =>
                    form.setFieldValue(
                      "selectionMode",
                      value as CarSelectionMode,
                    )
                  }
                >
                  <div className={`${classes.optionGrid} ${classes.twoColumn}`}>
                    <Radio
                      className={classes.choice}
                      value="specific"
                      label="Да, знаю марку и модель"
                    />
                    <Radio
                      className={classes.choice}
                      value="help"
                      label="Нужна помощь с подбором"
                    />
                  </div>
                </Radio.Group>

                {form.values.selectionMode === "specific" && (
                  <TextInput
                    label="Марка и модель"
                    placeholder="Например, Toyota RAV4"
                    required
                    withAsterisk={false}
                    {...form.getInputProps("vehicleQuery")}
                  />
                )}

                {form.values.selectionMode === "help" && (
                  <Radio.Group
                    label="Какой тип автомобиля рассматриваете?"
                    required
                    withAsterisk={false}
                    value={form.values.vehicleType}
                    error={form.errors.vehicleType}
                    onChange={(value) =>
                      form.setFieldValue(
                        "vehicleType",
                        value as CarSelectionVehicleType,
                      )
                    }
                  >
                    <div
                      className={`${classes.optionGrid} ${classes.twoColumn}`}
                    >
                      {CAR_SELECTION_VEHICLE_TYPE_OPTIONS.map((option) => (
                        <Radio
                          className={classes.choice}
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </div>
                  </Radio.Group>
                )}

                <Radio.Group
                  label="Из какой страны привезти автомобиль?"
                  required
                  withAsterisk={false}
                  value={form.values.country}
                  error={form.errors.country}
                  onChange={(value) =>
                    form.setFieldValue("country", value as CarSelectionCountry)
                  }
                >
                  <div
                    className={`${classes.optionGrid} ${classes.fourColumn}`}
                  >
                    {CAR_SELECTION_COUNTRY_OPTIONS.map((option) => (
                      <Radio
                        className={classes.choice}
                        key={option.value}
                        value={option.value}
                        label={
                          <ChoiceLabel
                            icon={
                              option.value !== "unknown" ? (
                                <CountryFlag
                                  country={option.value as CarCountry}
                                  decorative
                                />
                              ) : undefined
                            }
                          >
                            {option.label}
                          </ChoiceLabel>
                        }
                      />
                    ))}
                  </div>
                </Radio.Group>

                <Radio.Group
                  label="Какое состояние рассматриваете?"
                  required
                  withAsterisk={false}
                  value={form.values.condition}
                  error={form.errors.condition}
                  onChange={(value) =>
                    form.setFieldValue(
                      "condition",
                      value as CarSelectionCondition,
                    )
                  }
                >
                  <div
                    className={`${classes.optionGrid} ${classes.threeColumn}`}
                  >
                    {CAR_SELECTION_CONDITION_OPTIONS.map((option) => (
                      <Radio
                        className={classes.choice}
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </div>
                </Radio.Group>
              </>
            )}

            {step === 1 && (
              <>
                <DigitNumberInput
                  label="Максимальный бюджет под ключ"
                  description="С доставкой и оформлением"
                  placeholder="Например, 3 000 000"
                  suffix=" ₽"
                  required
                  withAsterisk={false}
                  error={form.errors.budgetRub}
                  defaultValue={form.values.budgetRub}
                  onChange={(budgetRub) =>
                    form.setFieldValue("budgetRub", budgetRub)
                  }
                />
                <TextInput
                  label="Город получения"
                  placeholder="Например, Хабаровск"
                  autoComplete="address-level2"
                  required
                  withAsterisk={false}
                  {...form.getInputProps("deliveryCity")}
                />
                <Radio.Group
                  label="Срок покупки (необязательно)"
                  value={form.values.purchaseTiming}
                  onChange={(value) =>
                    form.setFieldValue(
                      "purchaseTiming",
                      value as CarSelectionPurchaseTiming,
                    )
                  }
                >
                  <div
                    className={`${classes.optionGrid} ${classes.fourColumn}`}
                  >
                    {CAR_SELECTION_PURCHASE_TIMING_OPTIONS.map((option) => (
                      <Radio
                        className={classes.choice}
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </div>
                </Radio.Group>
                <Textarea
                  label="Пожелания (необязательно)"
                  placeholder="Год, привод, руль или важные опции"
                  rows={3}
                  maxLength={500}
                  {...form.getInputProps("wishes")}
                />
              </>
            )}

            {step === 2 && (
              <>
                <TextInput
                  label="Как к вам обращаться?"
                  placeholder="Имя"
                  autoComplete="name"
                  required
                  withAsterisk={false}
                  {...form.getInputProps("clientName")}
                />
                <PhoneInput
                  label="Телефон"
                  required
                  withAsterisk={false}
                  {...form.getInputProps("phone")}
                />
                <Radio.Group
                  label="Как удобнее получить ответ?"
                  required
                  withAsterisk={false}
                  value={form.values.contactMethod}
                  error={form.errors.contactMethod}
                  onChange={(value) =>
                    form.setFieldValue(
                      "contactMethod",
                      value as CarSelectionContactMethod,
                    )
                  }
                >
                  <div
                    className={`${classes.optionGrid} ${classes.threeColumn}`}
                  >
                    {CAR_SELECTION_CONTACT_METHOD_OPTIONS.map((option) => {
                      const Icon = CONTACT_METHOD_ICONS[option.value];
                      return (
                        <Radio
                          className={classes.choice}
                          key={option.value}
                          value={option.value}
                          label={
                            <ChoiceLabel icon={<Icon size={18} aria-hidden />}>
                              {option.label}
                            </ChoiceLabel>
                          }
                        />
                      );
                    })}
                  </div>
                </Radio.Group>
                <Checkbox
                  required
                  label={
                    <Text size="sm">
                      Согласен на обработку персональных данных ·{" "}
                      <Anchor href={privacyPolicyUrl} target="_blank">
                        Политика
                      </Anchor>
                    </Text>
                  }
                  {...form.getInputProps("personalDataConsent", {
                    type: "checkbox",
                  })}
                />
              </>
            )}

            <div className={classes.actions}>
              {step > 0 && (
                <Button
                  size="sm"
                  type="button"
                  variant="default"
                  leftSection={<IconArrowLeft size={18} aria-hidden="true" />}
                  disabled={busy}
                  onClick={() => setStep((step - 1) as CarSelectionRequestStep)}
                >
                  Назад
                </Button>
              )}
              {step < 2 ? (
                <Button
                  size="sm"
                  type="button"
                  rightSection={<IconArrowRight size={18} aria-hidden="true" />}
                  onClick={goForward}
                >
                  Продолжить
                </Button>
              ) : (
                <Button type="submit" size="sm" loading={busy}>
                  Получить варианты и расчёт
                </Button>
              )}
            </div>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
