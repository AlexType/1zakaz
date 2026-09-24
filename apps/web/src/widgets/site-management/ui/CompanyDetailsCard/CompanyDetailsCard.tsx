"use client";

import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { PhoneInput } from "@/shared/ui/PhoneInput";
import type { CompanyDetails } from "../../model/site-management";

type Props = {
  value: CompanyDetails;
  onChange: (value: CompanyDetails) => void;
  onSave: () => void;
};

export function CompanyDetailsCard({ value, onChange, onSave }: Props) {
  const field = (key: keyof CompanyDetails) => ({
    value: value[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: event.currentTarget.value }),
  });
  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} size="h3">
            Компания и контакты
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            Эти данные используются в контактах, подвале сайта и юридических
            документах.
          </Text>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Название на сайте"
            placeholder="Название компании"
            {...field("publicName")}
          />
          <TextInput
            label="Юридическое наименование"
            placeholder="ООО «Название»"
            {...field("legalName")}
          />
          <TextInput
            label="ИНН"
            placeholder="10 или 12 цифр"
            inputMode="numeric"
            {...field("inn")}
          />
          <TextInput
            label="ОГРН"
            placeholder="13 или 15 цифр"
            inputMode="numeric"
            {...field("ogrn")}
          />
          <PhoneInput label="Телефон" {...field("phone")} />
          <TextInput
            label="Почта"
            placeholder="mail@example.ru"
            type="email"
            {...field("email")}
          />
          <TextInput
            label="Telegram"
            placeholder="https://t.me/..."
            {...field("telegramUrl")}
          />
          <TextInput
            label="WhatsApp"
            placeholder="https://wa.me/..."
            {...field("whatsappUrl")}
          />
          <TextInput
            label="Режим работы"
            placeholder="Пн–Пт, 09:00–18:00"
            {...field("workingHours")}
          />
          <TextInput
            label="Адрес"
            placeholder="Город, улица, дом"
            {...field("address")}
          />
        </SimpleGrid>
        <Group justify="flex-end">
          <Button leftSection={<IconDeviceFloppy size={18} />} onClick={onSave}>
            Сохранить данные
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
