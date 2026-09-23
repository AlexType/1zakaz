"use client";

import {
  Button,
  Group,
  Paper,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import type { SiteRedirect } from "../../model/site-management";
import { isValidSiteUrl } from "../../lib/is-valid-site-url";
import classes from "./SiteRedirectsCard.module.css";

type Props = {
  redirects: SiteRedirect[];
  onChange: (redirects: SiteRedirect[]) => void;
  onSave: () => void;
};

export function SiteRedirectsCard({ redirects, onChange, onSave }: Props) {
  const valid = redirects.every(
    (item) =>
      item.sourcePath.startsWith("/") &&
      isValidSiteUrl(item.destinationPath) &&
      item.sourcePath !== item.destinationPath,
  );
  function update(id: string, change: Partial<SiteRedirect>) {
    onChange(
      redirects.map((item) => (item.id === id ? { ...item, ...change } : item)),
    );
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
            Перенаправления
          </Title>
          <Text size="sm" c="dimmed">
            Старые адреса продолжают вести на соответствующие страницы после
            запуска нового сайта.
          </Text>
        </Stack>
        <Button
          variant="default"
          leftSection={<IconPlus size={17} />}
          onClick={() =>
            onChange([
              ...redirects,
              {
                id: crypto.randomUUID(),
                sourcePath: "",
                destinationPath: "",
                enabled: true,
              },
            ])
          }
        >
          Добавить
        </Button>
      </Group>
      <div className={classes.scroll}>
        <Table striped verticalSpacing="sm" className={classes.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Старый адрес</Table.Th>
              <Table.Th>Новый адрес</Table.Th>
              <Table.Th ta="center">Активно</Table.Th>
              <Table.Th w={56} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {redirects.map((redirect) => (
              <Table.Tr key={redirect.id}>
                <Table.Td>
                  <TextInput
                    aria-label={`Старый адрес ${redirect.id}`}
                    placeholder="/old-page"
                    className={classes.path}
                    value={redirect.sourcePath}
                    onChange={(event) =>
                      update(redirect.id, {
                        sourcePath: event.currentTarget.value,
                      })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    aria-label={`Новый адрес ${redirect.id}`}
                    placeholder="/new-page"
                    className={classes.path}
                    value={redirect.destinationPath}
                    onChange={(event) =>
                      update(redirect.id, {
                        destinationPath: event.currentTarget.value,
                      })
                    }
                  />
                </Table.Td>
                <Table.Td ta="center">
                  <Switch
                    aria-label={`Активно ${redirect.sourcePath || redirect.id}`}
                    checked={redirect.enabled}
                    onChange={(event) =>
                      update(redirect.id, {
                        enabled: event.currentTarget.checked,
                      })
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Button
                    variant="subtle"
                    color="red"
                    px={8}
                    aria-label={`Удалить перенаправление ${redirect.sourcePath || redirect.id}`}
                    onClick={() =>
                      onChange(
                        redirects.filter((item) => item.id !== redirect.id),
                      )
                    }
                  >
                    <IconTrash size={17} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <Group justify="space-between" p="lg">
        <Text size="sm" c={valid ? "dimmed" : "red"}>
          {valid
            ? "Для старых адресов будет использован постоянный редирект 301."
            : "Проверьте адреса: источник и назначение должны быть разными."}
        </Text>
        <Button
          leftSection={<IconDeviceFloppy size={18} />}
          onClick={onSave}
          disabled={!valid}
        >
          Сохранить перенаправления
        </Button>
      </Group>
    </Paper>
  );
}
