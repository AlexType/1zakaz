import { Box, Paper, Text, Title } from "@mantine/core";
import Image from "next/image";
import type { ReactNode } from "react";
import classes from "./AuthShell.module.css";

type AuthShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <Box className={classes.page}>
      <main className={classes.layout}>
        <Image
          src="/perviy-zakaz-logo.svg"
          alt="Первый заказ"
          width={178}
          height={60}
          priority
          className={classes.logo}
        />
        <Paper withBorder radius="md" className={classes.card}>
          <Title order={1} className={classes.title}>
            {title}
          </Title>
          {description && (
            <Text c="dimmed" className={classes.description}>
              {description}
            </Text>
          )}
          {children}
        </Paper>
      </main>
    </Box>
  );
}
