"use client";

import {
  Anchor,
  Button,
  Divider,
  PasswordInput,
  Stack,
  Tabs,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { IconFingerprint } from "@tabler/icons-react";
import { emailSchema, passwordSchema } from "../../lib/validation";
import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";
import { FormError } from "@/shared/ui/FormError";
import { EmailInput } from "../EmailInput";
import { PhoneInput } from "../PhoneInput";

type SignInFormProps = {
  busy: boolean;
  error: string | null;
  initialMethod?: "email" | "password";
  onEmailCode: (email: string) => void;
  onPassword: (phone: string, password: string) => void;
  onPasskey: () => void;
  onRecovery: () => void;
};

export function SignInForm({
  busy,
  error,
  initialMethod = "email",
  onEmailCode,
  onPassword,
  onPasskey,
  onRecovery,
}: SignInFormProps) {
  const emailForm = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: schemaResolver(emailSchema, { sync: true }),
  });
  const passwordForm = useForm({
    mode: "uncontrolled",
    initialValues: { phone: "", password: "" },
    validate: schemaResolver(passwordSchema, { sync: true }),
  });

  return (
    <Stack gap="lg">
      <FormError message={error} />
      <Tabs defaultValue={initialMethod} keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value="email">Код на почту</Tabs.Tab>
          <Tabs.Tab value="password">Номер и пароль</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="email" pt="lg">
          <form
            onSubmit={emailForm.onSubmit(({ email }) =>
              onEmailCode(email.trim()),
            )}
            noValidate
          >
            <Stack gap="md">
              <EmailInput
                key={emailForm.key("email")}
                disabled={busy}
                {...emailForm.getInputProps("email")}
              />
              <Button type="submit" size="md" loading={busy} fullWidth>
                Получить код
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="password" pt="lg">
          <form
            onSubmit={passwordForm.onSubmit(({ phone, password }) => {
              const normalizedPhone = normalizeRussianPhone(phone);
              if (normalizedPhone) onPassword(normalizedPhone, password);
            })}
            noValidate
          >
            <Stack gap="md">
              <PhoneInput
                key={passwordForm.key("phone")}
                disabled={busy}
                {...passwordForm.getInputProps("phone")}
              />
              <PasswordInput
                key={passwordForm.key("password")}
                label="Пароль"
                placeholder="Введите пароль"
                autoComplete="current-password"
                required
                disabled={busy}
                {...passwordForm.getInputProps("password")}
              />
              <Button type="submit" size="md" loading={busy} fullWidth>
                Войти
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
      <Divider label="или" labelPosition="center" />
      <Button
        variant="default"
        size="md"
        leftSection={<IconFingerprint size={20} />}
        onClick={onPasskey}
        loading={busy}
        fullWidth
      >
        Войти с passkey
      </Button>
      <Anchor
        component="button"
        type="button"
        size="sm"
        ta="center"
        onClick={onRecovery}
      >
        Не получается войти?
      </Anchor>
    </Stack>
  );
}
