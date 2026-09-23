"use client";

import { Anchor, Button, PasswordInput, Stack, Tabs } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { emailSchema, passwordSchema } from "../../lib/validation";
import { FormError } from "@/shared/ui/FormError";
import { EmailInput } from "../EmailInput";

type SignInFormProps = {
  busy: boolean;
  error: string | null;
  initialMethod?: "email" | "password";
  onEmailCode: (email: string) => void;
  onPassword: (email: string, password: string) => void;
  onRecovery: () => void;
};

export function SignInForm({
  busy,
  error,
  initialMethod = "email",
  onEmailCode,
  onPassword,
  onRecovery,
}: SignInFormProps) {
  const emailForm = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: schemaResolver(emailSchema, { sync: true }),
  });
  const passwordForm = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: schemaResolver(passwordSchema, { sync: true }),
  });

  return (
    <Stack gap="lg">
      <FormError message={error} />
      <Tabs defaultValue={initialMethod} keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value="email">Код на почту</Tabs.Tab>
          <Tabs.Tab value="password">Почта и пароль</Tabs.Tab>
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
            onSubmit={passwordForm.onSubmit(({ email, password }) =>
              onPassword(email.trim(), password),
            )}
            noValidate
          >
            <Stack gap="md">
              <EmailInput
                key={passwordForm.key("email")}
                disabled={busy}
                {...passwordForm.getInputProps("email")}
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
