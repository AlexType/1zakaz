import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { MantineAppProvider } from "@/_app/mantine";
import "@fontsource-variable/inter/wght.css";
import "@mantine/core/styles.css";
import "@/_app/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Первый Заказ",
    template: "%s — Первый Заказ",
  },
  description: "Как заказать автомобиль из Японии, Китая и Кореи.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineAppProvider>{children}</MantineAppProvider>
      </body>
    </html>
  );
}
