import type { Metadata } from "next";
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
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
