"use client";

import {
  Anchor,
  Button,
  Group,
  Input,
  PinInput,
  Stack,
  Text,
} from "@mantine/core";
import { useId, useState, type SubmitEvent } from "react";
import { useCountdown } from "@/shared/lib/use-countdown";
import { FormError } from "@/shared/ui/FormError";

type CodeFormProps = {
  destination: string;
  busy: boolean;
  error: string | null;
  resendAfterSeconds: number;
  onVerify: (code: string) => void;
  onResend?: () => void;
  onBack?: () => void;
};

export function CodeForm({
  destination,
  busy,
  error,
  resendAfterSeconds,
  onVerify,
  onResend,
  onBack,
}: CodeFormProps) {
  const [code, setCode] = useState("");
  const countdown = useCountdown(resendAfterSeconds);
  const [validationError, setValidationError] = useState<string | null>(null);
  const codeId = useId();

  const codeLabel = "Код из письма";

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setValidationError("Введите 6 цифр кода");
      return;
    }
    setValidationError(null);
    onVerify(code);
  }

  return (
    <form onSubmit={submit} noValidate>
      <Stack gap="lg">
        <FormError message={error} />
        <Text size="sm" c="dimmed">
          Код отправлен на {destination}.
        </Text>
        <div>
          <Input.Label htmlFor={`${codeId}-1`} mb="xs">
            {codeLabel}
          </Input.Label>
          <PinInput
            id={codeId}
            length={6}
            type="number"
            inputMode="numeric"
            size="md"
            gap={8}
            placeholder="–"
            value={code}
            onChange={(value) => {
              setCode(value);
              setValidationError(null);
            }}
            error={Boolean(validationError || error)}
            disabled={busy}
            autoFocus
            ariaLabel={codeLabel}
            getInputProps={(index) => ({
              "aria-label": `${codeLabel}, цифра ${index + 1} из 6`,
            })}
          />
          {validationError && (
            <Text size="xs" c="red" role="alert" mt={6}>
              {validationError}
            </Text>
          )}
        </div>
        <Button type="submit" size="md" loading={busy} fullWidth>
          Подтвердить
        </Button>
        <Group justify="space-between" gap="xs">
          {onBack && (
            <Anchor component="button" type="button" size="sm" onClick={onBack}>
              Назад
            </Anchor>
          )}
          {onResend && (
            <Anchor
              component="button"
              type="button"
              size="sm"
              disabled={busy || countdown > 0}
              onClick={onResend}
            >
              {countdown > 0
                ? `Повторить через ${countdown} с`
                : "Отправить код ещё раз"}
            </Anchor>
          )}
        </Group>
      </Stack>
    </form>
  );
}
