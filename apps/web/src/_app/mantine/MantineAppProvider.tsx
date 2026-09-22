"use client";

import { MantineProvider } from "@mantine/core";

export function MantineAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
  );
}
