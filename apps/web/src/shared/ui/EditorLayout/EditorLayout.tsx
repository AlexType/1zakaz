import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import classes from "./EditorLayout.module.css";

type EditorLayoutProps = {
  title: string;
  description?: string;
  backLabel: string;
  onBack: () => void;
  status?: React.ReactNode;
  toolbar?: React.ReactNode;
  aside?: React.ReactNode;
  actions: React.ReactNode;
  children: React.ReactNode;
  ariaLabel: string;
};

export function EditorLayout({
  title,
  description,
  backLabel,
  onBack,
  status,
  toolbar,
  aside,
  actions,
  children,
  ariaLabel,
}: EditorLayoutProps) {
  return (
    <section className={classes.root} aria-label={ariaLabel}>
      <Stack gap="lg">
        <Stack gap="sm" className={classes.header}>
          <Button
            variant="subtle"
            size="compact-sm"
            leftSection={<IconArrowLeft size={16} />}
            onClick={onBack}
            w="fit-content"
          >
            {backLabel}
          </Button>
          <Group justify="space-between" align="flex-start" gap="md">
            <Group gap="sm" align="center" className={classes.titleRow}>
              <Title order={1} size="h2">
                {title}
              </Title>
              {status}
            </Group>
            {toolbar}
          </Group>
          {description && (
            <Text c="dimmed" size="sm">
              {description}
            </Text>
          )}
        </Stack>

        <div className={classes.layout}>
          <Stack gap="lg" className={classes.main}>
            {children}
          </Stack>
          {aside && (
            <Stack gap="lg" className={classes.aside}>
              {aside}
            </Stack>
          )}
        </div>

        <Paper radius="lg" className={classes.actionBar}>
          <Group justify="flex-end" gap="sm">
            {actions}
          </Group>
        </Paper>
      </Stack>
    </section>
  );
}
