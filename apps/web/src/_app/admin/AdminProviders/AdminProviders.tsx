"use client";

import "dayjs/locale/ru";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DatesProvider settings={{ locale: "ru", firstDayOfWeek: 1 }}>
        <ModalsProvider>
          <Notifications position="bottom-right" autoClose={5000} limit={3} />
          {children}
        </ModalsProvider>
      </DatesProvider>
    </QueryClientProvider>
  );
}
