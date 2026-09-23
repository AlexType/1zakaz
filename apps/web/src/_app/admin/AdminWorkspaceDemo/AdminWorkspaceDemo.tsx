"use client";

import { useState } from "react";
import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconArticle,
  IconCar,
  IconClipboardList,
  IconUser,
} from "@tabler/icons-react";
import { StaffProfileDemo } from "@/features/staff-profile";
import {
  AdminShell,
  type AdminSearchItem,
  type AdminSection,
} from "@/widgets/admin-shell";
import { ArticlesWorkspace } from "@/widgets/articles-workspace";
import { CarCatalogDemo } from "@/widgets/car-catalog";
import { LeadsWorkspace } from "@/widgets/leads-workspace";
import { PricingWorkspace } from "@/widgets/pricing-workspace";
import { ReferenceDataWorkspace } from "@/widgets/reference-data-workspace";
import { SiteManagementWorkspace } from "@/widgets/site-management";
import { StaffWorkspaceDemo } from "@/widgets/staff-workspace";
import classes from "./AdminWorkspaceDemo.module.css";

type DemoRole = "admin" | "manager";

const DEMO_USER: Record<
  DemoRole,
  { name: string; roleLabel: string; avatarUrl: string | null }
> = {
  admin: { name: "Михаил Орлов", roleLabel: "Администратор", avatarUrl: null },
  manager: {
    name: "Анна Петрова",
    roleLabel: "Менеджер",
    avatarUrl: "/storybook-avatar.svg",
  },
};

const DEMO_SEARCH_ITEMS: AdminSearchItem[] = [
  {
    id: "car-toyota-corolla-cross",
    label: "Toyota Corolla Cross, 2022",
    description: "Автомобиль · опубликован",
    group: "Автомобили",
    section: "cars",
    keywords: ["тойота", "королла", "япония"],
    icon: IconCar,
  },
  {
    id: "car-geely-monjaro",
    label: "Geely Monjaro, 2024",
    description: "Автомобиль · опубликован",
    group: "Автомобили",
    section: "cars",
    keywords: ["джили", "монжаро", "китай"],
    icon: IconCar,
  },
  {
    id: "lead-elena-smirnova",
    label: "Елена Смирнова",
    description: "Заявка · Toyota RAV4 из Японии",
    group: "Заявки",
    section: "leads",
    keywords: ["рав4", "клиент"],
    icon: IconClipboardList,
  },
  {
    id: "article-auction-sheet",
    label: "Как читать аукционный лист",
    description: "Статья · опубликована",
    group: "Статьи",
    section: "articles",
    keywords: ["аукцион", "лист", "япония"],
    icon: IconArticle,
  },
  {
    id: "employee-anna-petrova",
    label: "Анна Петрова",
    description: "Сотрудник · менеджер",
    group: "Сотрудники",
    section: "staff",
    keywords: ["петрова", "менеджер"],
    icon: IconUser,
  },
];

export function AdminWorkspaceDemo({ role = "admin" }: { role?: DemoRole }) {
  const [section, setSection] = useState<AdminSection>("cars");
  const [signedOut, setSignedOut] = useState(false);
  const user = DEMO_USER[role];

  if (signedOut)
    return (
      <Center className={classes.signedOut}>
        <Paper withBorder radius="lg" p="xl" className={classes.signedOutCard}>
          <Stack align="center" gap="md">
            <Title order={1} size="h2">
              Вы вышли
            </Title>
            <Text c="dimmed" size="sm">
              Работа в панели завершена.
            </Text>
            <Button
              onClick={() => {
                setSignedOut(false);
                setSection("leads");
              }}
            >
              Войти снова
            </Button>
          </Stack>
        </Paper>
      </Center>
    );

  return (
    <AdminShell
      section={section}
      personName={user.name}
      roleLabel={user.roleLabel}
      avatarUrl={user.avatarUrl}
      publicSiteUrl="https://perviyzakaz.ru/"
      canManageStaff={role === "admin"}
      searchItems={DEMO_SEARCH_ITEMS.filter(
        (item) => item.section !== "staff" || role === "admin",
      )}
      onNavigate={setSection}
      onLogout={() => setSignedOut(true)}
    >
      <div hidden={section !== "leads"}>
        <LeadsWorkspace />
      </div>
      <div hidden={section !== "cars"}>
        <CarCatalogDemo />
      </div>
      {role === "admin" && (
        <div hidden={section !== "pricing"}>
          <PricingWorkspace />
        </div>
      )}
      <div hidden={section !== "articles"}>
        <ArticlesWorkspace />
      </div>
      {role === "admin" && (
        <div hidden={section !== "site"}>
          <SiteManagementWorkspace />
        </div>
      )}
      {role === "admin" && (
        <div hidden={section !== "references"}>
          <ReferenceDataWorkspace />
        </div>
      )}
      {role === "admin" && (
        <div hidden={section !== "staff"}>
          <StaffWorkspaceDemo />
        </div>
      )}
      <div hidden={section !== "profile"}>
        <StaffProfileDemo role={role} />
      </div>
    </AdminShell>
  );
}
