"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Kbd,
  Menu,
  NavLink,
  ScrollArea,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Spotlight } from "@mantine/spotlight";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconExternalLink,
  IconLogout,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import { getPersonInitials } from "@/shared/lib/format-person-short-name";
import type { AdminSearchItem } from "../../model/admin-search";
import {
  ADMIN_NAV_ITEMS,
  type AdminSection,
} from "../../model/admin-navigation";
import { AdminGlobalSearch } from "../AdminGlobalSearch";
import classes from "./AdminShell.module.css";

type AdminShellProps = {
  section: AdminSection;
  personName: string;
  roleLabel: string;
  avatarUrl?: string | null;
  publicSiteUrl?: string;
  canManageStaff: boolean;
  searchItems?: AdminSearchItem[];
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
  children: ReactNode;
};

export function AdminShell({
  section,
  personName,
  roleLabel,
  avatarUrl,
  publicSiteUrl = "/",
  canManageStaff,
  searchItems = [],
  onNavigate,
  onLogout,
  children,
}: AdminShellProps) {
  const [mobileOpened, { toggle, close }] = useDisclosure(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const availableNavigation = useMemo(
    () =>
      ADMIN_NAV_ITEMS.filter(
        (item) => !("adminOnly" in item && item.adminOnly) || canManageStaff,
      ),
    [canManageStaff],
  );
  const globalSearchItems = useMemo<AdminSearchItem[]>(
    () => [
      ...availableNavigation.map(({ id, label, icon }) => ({
        id: `section-${id}`,
        label,
        description: "Перейти в раздел",
        group: "Разделы",
        section: id,
        icon,
      })),
      ...searchItems,
    ],
    [availableNavigation, searchItems],
  );

  function navigate(next: AdminSection) {
    onNavigate(next);
    close();
  }

  return (
    <AppShell
      className={classes.shell}
      data-compact={!sidebarExpanded}
      padding={0}
      header={{ height: 60 }}
      navbar={{
        width: 244,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
    >
      <AppShell.Header className={classes.header}>
        <div className={classes.headerBrand}>
          <Image
            src="/perviy-zakaz-logo-on-dark.svg"
            alt="Первый заказ"
            width={178}
            height={60}
            className={classes.logo}
            priority
          />
        </div>
        <Group gap="sm" wrap="nowrap" className={classes.headerStart}>
          <Burger
            opened={mobileOpened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
            aria-label={mobileOpened ? "Закрыть меню" : "Открыть меню"}
          />
          <UnstyledButton
            className={classes.searchTrigger}
            onClick={Spotlight.open}
            aria-label="Открыть поиск по панели"
          >
            <IconSearch size={18} stroke={1.8} />
            <Text component="span" size="sm" className={classes.searchLabel}>
              Поиск по панели
            </Text>
            <Kbd className={classes.searchHotkey}>⌘ K</Kbd>
          </UnstyledButton>
        </Group>

        <Tooltip label="Открыть сайт" position="bottom">
          <ActionIcon
            component="a"
            href={publicSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="gray"
            size="lg"
            className={classes.headerAction}
            aria-label="Открыть сайт"
          >
            <IconExternalLink size={19} stroke={1.7} />
          </ActionIcon>
        </Tooltip>
      </AppShell.Header>

      <AppShell.Navbar
        className={classes.navbar}
        data-compact={!sidebarExpanded}
      >
        <AppShell.Section grow component={ScrollArea} scrollbarSize={5}>
          <nav className={classes.navSection} aria-label="Разделы панели">
            {availableNavigation.map(({ id, label, icon: Icon }) => (
              <NavLink
                key={id}
                component="button"
                type="button"
                label={label}
                aria-label={label}
                leftSection={
                  <Tooltip
                    label={label}
                    position="right"
                    offset={12}
                    disabled={sidebarExpanded}
                  >
                    <span className={classes.navIcon}>
                      <Icon size={20} stroke={1.65} />
                    </span>
                  </Tooltip>
                }
                rightSection={
                  sidebarExpanded && section === id ? (
                    <IconChevronRight size={15} stroke={1.8} />
                  ) : undefined
                }
                active={section === id}
                aria-current={section === id ? "page" : undefined}
                className={classes.navLink}
                onClick={() => navigate(id)}
              />
            ))}
          </nav>
        </AppShell.Section>

        <AppShell.Section className={classes.accountSection}>
          <Menu position="right-end" shadow="xl" width={230} withinPortal>
            <Menu.Target>
              <UnstyledButton
                className={classes.accountButton}
                aria-label={`Меню пользователя: ${personName}`}
              >
                <Avatar
                  src={avatarUrl}
                  name={personName}
                  radius="xl"
                  size={36}
                  className={classes.accountAvatar}
                >
                  {getPersonInitials(personName)}
                </Avatar>
                <span className={classes.accountCopy}>
                  <Text size="sm" fw={600} c="white" truncate>
                    {personName}
                  </Text>
                  <Text size="xs" c="gray.5" truncate>
                    {roleLabel}
                  </Text>
                </span>
                <IconDots
                  size={18}
                  stroke={1.8}
                  className={classes.accountMenuIcon}
                />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                {personName}
                <Text size="xs" c="dimmed" fw={400}>
                  {roleLabel}
                </Text>
              </Menu.Label>
              <Menu.Item
                leftSection={<IconUserCircle size={18} />}
                onClick={() => navigate("profile")}
              >
                Профиль
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={18} />}
                onClick={onLogout}
              >
                Выйти
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </AppShell.Section>
      </AppShell.Navbar>

      <div className={classes.navRail}>
        <UnstyledButton
          visibleFrom="sm"
          className={classes.collapseButton}
          title={sidebarExpanded ? "Свернуть меню" : "Развернуть меню"}
          aria-label={sidebarExpanded ? "Свернуть меню" : "Развернуть меню"}
          aria-expanded={sidebarExpanded}
          onClick={() => setSidebarExpanded((expanded) => !expanded)}
        >
          <span className={classes.collapseControl}>
            <IconChevronLeft size={18} stroke={2} />
          </span>
        </UnstyledButton>
      </div>

      <AppShell.Main className={classes.main}>
        <div className={classes.content}>{children}</div>
      </AppShell.Main>

      <AdminGlobalSearch
        items={globalSearchItems}
        onSelect={(item) => navigate(item.section)}
      />
    </AppShell>
  );
}
