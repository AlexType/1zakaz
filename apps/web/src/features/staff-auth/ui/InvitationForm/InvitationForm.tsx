"use client";

import { Badge, Button, Stack, Text, TextInput } from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import type { StaffProfile } from "../../model/contracts";
import { invitationSchema } from "../../lib/validation";
import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";
import { formatDateTime } from "@/shared/lib/format-date-time";
import { FormError } from "@/shared/ui/FormError";
import { EmailInput } from "../EmailInput";
import { PhoneInput } from "../PhoneInput";

type InvitationFormProps = {
  roleName: string;
  expiresAt: string;
  busy: boolean;
  error: string | null;
  onSubmit: (profile: StaffProfile) => void;
};

export function InvitationForm({
  roleName,
  expiresAt,
  busy,
  error,
  onSubmit,
}: InvitationFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { fullName: "", email: "", phone: "" },
    validate: schemaResolver(invitationSchema, { sync: true }),
  });

  return (
    <form
      onSubmit={form.onSubmit(({ fullName, email, phone }) => {
        const normalizedPhone = normalizeRussianPhone(phone);
        if (normalizedPhone) {
          onSubmit({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: normalizedPhone,
          });
        }
      })}
      noValidate
    >
      <Stack gap="md">
        <FormError message={error} />
        <Badge variant="light" size="lg" w="fit-content">
          Роль: {roleName}
        </Badge>
        <Text size="sm" c="dimmed">
          Приглашение действует до {formatDateTime(expiresAt)}.
        </Text>
        <TextInput
          key={form.key("fullName")}
          label="Имя и фамилия"
          placeholder="Александр Иванов"
          autoComplete="name"
          required
          disabled={busy}
          {...form.getInputProps("fullName")}
        />
        <EmailInput
          key={form.key("email")}
          description="На этот адрес придёт код подтверждения."
          disabled={busy}
          {...form.getInputProps("email")}
        />
        <PhoneInput
          key={form.key("phone")}
          description="Контактный номер сотрудника. Для входа используется почта."
          disabled={busy}
          {...form.getInputProps("phone")}
        />
        <Button type="submit" size="md" loading={busy} fullWidth mt="xs">
          Продолжить
        </Button>
      </Stack>
    </form>
  );
}
