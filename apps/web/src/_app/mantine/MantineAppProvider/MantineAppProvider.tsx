"use client";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  fontFamily: '"Inter Variable", Arial, sans-serif',
  primaryColor: "brand",
  colors: {
    brand: [
      "#fff0f0",
      "#ffdfdf",
      "#ffc3c3",
      "#ff9d9d",
      "#f87171",
      "#ed4c4c",
      "#d63f3f",
      "#b93636",
      "#9b3030",
      "#7f2c2c",
    ],
  },
});

export function MantineAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
