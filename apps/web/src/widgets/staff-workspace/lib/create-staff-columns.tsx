import {
  ActionIcon,
  Badge,
  Menu,
  Text,
  Tooltip,
  VisuallyHidden,
} from "@mantine/core";
import { IconDots, IconLock, IconUserCheck } from "@tabler/icons-react";
import type { DataTableColumn } from "mantine-datatable";
import type { StaffMember, StaffRole, StaffStatus } from "@/entities/employee";
import { formatCompactDateTime } from "@/shared/lib/format-compact-date";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { GridPersonCell } from "@/shared/ui/GridPersonCell";
import { canManageStaffMember } from "./can-manage-staff-member";
import {
  STAFF_ROLE_OPTIONS,
  STAFF_STATUS_OPTIONS,
} from "../model/staff-management-options";
import classes from "../ui/StaffManagement/StaffManagement.module.css";

export type StaffFilters = {
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
};
export type StaffAction = {
  id: string;
  kind: "role" | "status";
  value: StaffRole | StaffStatus;
};

type Options = {
  currentUserId: string;
  activeAdmins: number;
  onAction: (action: StaffAction) => void;
};

export function createStaffColumns({
  currentUserId,
  activeAdmins,
  onAction,
}: Options): DataTableColumn<StaffMember>[] {
  return [
    {
      accessor: "name",
      title: "Сотрудник",
      width: 205,
      pinned: "left",
      sortable: true,
      render: (member) => (
        <GridPersonCell
          name={`${member.lastName} ${member.firstName} ${member.patronymic ?? ""}`.trim()}
          avatarUrl={member.avatarUrl}
        />
      ),
    },
    {
      accessor: "role",
      title: "Роль",
      width: 145,
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (member) =>
        STAFF_ROLE_OPTIONS.find((option) => option.value === member.role)
          ?.label,
    },
    {
      accessor: "email",
      title: "Почта",
      width: 220,
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (member) => (
        <Text size="sm" className={classes.email} title={member.email}>
          {member.email}
        </Text>
      ),
    },
    {
      accessor: "phone",
      title: "Телефон",
      width: 180,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (member) =>
        member.phone ? formatRussianPhone(member.phone) : "—",
    },
    {
      accessor: "status",
      title: "Доступ",
      width: 175,
      textAlign: "center",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (member) => (
        <Badge
          color={
            member.status === "active"
              ? "teal"
              : member.status === "invited"
                ? "blue"
                : "gray"
          }
          variant="light"
          size="sm"
        >
          {
            STAFF_STATUS_OPTIONS.find(
              (option) => option.value === member.status,
            )?.label
          }
        </Badge>
      ),
    },
    {
      accessor: "lastSeenAt",
      title: "Последний вход",
      width: 165,
      textAlign: "right",
      sortable: true,
      resizable: true,
      draggable: true,
      toggleable: true,
      render: (member) =>
        member.lastSeenAt ? formatCompactDateTime(member.lastSeenAt) : "—",
    },
    {
      accessor: "actions",
      title: <VisuallyHidden>Действия</VisuallyHidden>,
      width: 70,
      textAlign: "center",
      pinned: "right",
      render: (member) => {
        const protectedAccount = !canManageStaffMember(
          member,
          currentUserId,
          activeAdmins,
        );
        return (
          <Menu withinPortal position="bottom-end" shadow="md">
            <Menu.Target>
              <Tooltip
                label={`Действия: ${member.lastName} ${member.firstName}`}
              >
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label={`Действия: ${member.lastName} ${member.firstName}`}
                >
                  <IconDots size={18} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Роль</Menu.Label>
              {STAFF_ROLE_OPTIONS.map((option) => (
                <Menu.Item
                  key={option.value}
                  disabled={
                    member.role === option.value ||
                    member.status === "invited" ||
                    protectedAccount
                  }
                  onClick={() =>
                    onAction({
                      id: member.id,
                      kind: "role",
                      value: option.value,
                    })
                  }
                >
                  {option.label}
                </Menu.Item>
              ))}
              <Menu.Divider />
              {member.status === "active" && (
                <Menu.Item
                  color="red"
                  leftSection={<IconLock size={16} />}
                  disabled={protectedAccount}
                  onClick={() =>
                    onAction({
                      id: member.id,
                      kind: "status",
                      value: "suspended",
                    })
                  }
                >
                  Закрыть доступ
                </Menu.Item>
              )}
              {member.status === "suspended" && (
                <Menu.Item
                  leftSection={<IconUserCheck size={16} />}
                  onClick={() =>
                    onAction({ id: member.id, kind: "status", value: "active" })
                  }
                >
                  Вернуть доступ
                </Menu.Item>
              )}
              {member.status === "invited" && (
                <Menu.Item
                  color="red"
                  leftSection={<IconLock size={16} />}
                  onClick={() =>
                    onAction({
                      id: member.id,
                      kind: "status",
                      value: "suspended",
                    })
                  }
                >
                  Отозвать приглашение
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        );
      },
    },
  ];
}
