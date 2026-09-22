"use client";

import { Anchor, Button, Stack, Text } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { emailSchema } from "../../lib/validation";
import { FormError } from "@/shared/ui/FormError";
import { EmailInput } from "../EmailInput";

type RecoveryFormProps = {
  busy: boolean;
  error: string | null;
  onSubmit: (email: string) => void;
  onBack: () => void;
};

export function RecoveryForm({
  busy,
  error,
  onSubmit,
  onBack,
}: RecoveryFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: schemaResolver(emailSchema, { sync: true }),
  });

  return (
    <form
      onSubmit={form.onSubmit(({ email }) => onSubmit(email.trim()))}
      noValidate
    >
      <Stack gap="lg">
        <FormError message={error} />
        <Text size="sm" c="dimmed">
          Если доступа к почте нет, обратитесь к администратору.
        </Text>
        <EmailInput
          key={form.key("email")}
          label="Почта, указанная в учётной записи"
          disabled={busy}
          {...form.getInputProps("email")}
        />
        <Button type="submit" size="md" loading={busy} fullWidth>
          Отправить запрос
        </Button>
        <Anchor
          component="button"
          type="button"
          size="sm"
          ta="center"
          onClick={onBack}
        >
          Вернуться ко входу
        </Anchor>
      </Stack>
    </form>
  );
}
