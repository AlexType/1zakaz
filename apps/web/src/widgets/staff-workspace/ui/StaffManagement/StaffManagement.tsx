"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Drawer,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  DataTable,
  useDataTableColumns,
  type DataTableSortStatus,
} from "mantine-datatable";
import { IconPlus } from "@tabler/icons-react";
import type { StaffMember, StaffRole, StaffStatus } from "@/entities/employee";
import {
  CreateInvitationForm,
  type CreateInvitation,
} from "@/features/create-staff-invitation";
import {
  GRID_PAGE_SIZE_OPTIONS,
  type GridDensity,
} from "@/shared/lib/grid-options";
import { GridTableToolbar } from "@/shared/ui/GridTableToolbar";
import { GridErrorState } from "@/shared/ui/GridErrorState";
import { AdminPageHeader } from "@/shared/ui/AdminPageHeader";
import {
  showActionError,
  showActionSuccess,
} from "@/shared/lib/show-action-notification";
import {
  createStaffColumns,
  type StaffAction,
  type StaffFilters,
} from "../../lib/create-staff-columns";
import {
  STAFF_COLUMN_LABELS,
  STAFF_COLUMNS_STORAGE_KEY,
  STAFF_DENSITY_STORAGE_KEY,
  STAFF_ROLE_OPTIONS,
} from "../../model/staff-management-options";
import classes from "./StaffManagement.module.css";

type Props = {
  members: StaffMember[];
  currentUserId: string;
  onSetRole: (id: string, role: StaffRole) => Promise<void>;
  onSetStatus: (id: string, status: StaffStatus) => Promise<void>;
  onCreateInvitation: CreateInvitation;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const INITIAL_FILTERS: StaffFilters = {
  name: "",
  role: "all",
  email: "",
  phone: "",
  status: "all",
};

export function StaffManagement({
  members,
  currentUserId,
  onSetRole,
  onSetStatus,
  onCreateInvitation,
  loading = false,
  error = null,
  onRetry,
}: Props) {
  const [filters, setFilters] = useState<StaffFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<StaffMember>
  >({ columnAccessor: "name", direction: "asc" });
  const [density, setDensity] = useLocalStorage<GridDensity>({
    key: STAFF_DENSITY_STORAGE_KEY,
    defaultValue: "normal",
  });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pending, setPending] = useState<StaffAction | null>(null);
  const [busy, setBusy] = useState(false);
  const activeAdmins = members.filter(
    (member) => member.role === "admin" && member.status === "active",
  ).length;
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => value !== INITIAL_FILTERS[key as keyof StaffFilters],
  );
  const updateFilter = useCallback(
    <K extends keyof StaffFilters>(key: K, value: StaffFilters[K]) => {
      setFilters((current) => ({ ...current, [key]: value }));
      setPage(1);
    },
    [],
  );
  const filtered = useMemo(
    () =>
      members
        .filter(
          (member) =>
            `${member.lastName} ${member.firstName} ${member.patronymic ?? ""}`
              .toLocaleLowerCase("ru-RU")
              .includes(filters.name.trim().toLocaleLowerCase("ru-RU")) &&
            (filters.role === "all" || member.role === filters.role) &&
            member.email
              .toLocaleLowerCase("ru-RU")
              .includes(filters.email.trim().toLocaleLowerCase("ru-RU")) &&
            member.phone
              .replace(/\D/g, "")
              .includes(filters.phone.replace(/\D/g, "")) &&
            (filters.status === "all" || member.status === filters.status),
        )
        .sort((left, right) => {
          const value = (member: StaffMember) =>
            sortStatus.columnAccessor === "name"
              ? `${member.lastName} ${member.firstName}`
              : String(
                  member[sortStatus.columnAccessor as keyof StaffMember] ?? "",
                );
          const result = value(left).localeCompare(value(right), "ru-RU");
          return sortStatus.direction === "asc" ? result : -result;
        }),
    [members, filters, sortStatus],
  );
  const columns = useMemo(
    () =>
      createStaffColumns({
        filters,
        updateFilter,
        currentUserId,
        activeAdmins,
        onAction: setPending,
      }),
    [filters, updateFilter, currentUserId, activeAdmins],
  );
  const {
    effectiveColumns,
    columnsToggle,
    setColumnsToggle,
    resetColumnsToggle,
    resetColumnsOrder,
    resetColumnsWidth,
    resetColumnsPinning,
  } = useDataTableColumns({ key: STAFF_COLUMNS_STORAGE_KEY, columns });

  function resetView() {
    resetColumnsToggle();
    resetColumnsOrder();
    resetColumnsWidth();
    resetColumnsPinning();
    setDensity("normal");
  }
  async function confirmAction() {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending.kind === "role")
        await onSetRole(pending.id, pending.value as StaffRole);
      else await onSetStatus(pending.id, pending.value as StaffStatus);
      showActionSuccess("Изменение сохранено");
      setPending(null);
    } catch {
      showActionError("Не удалось сохранить изменение. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }
  const subject = members.find((member) => member.id === pending?.id);
  return (
    <section className={classes.root} aria-label="Управление сотрудниками">
      <Stack gap="lg">
        <AdminPageHeader
          title="Сотрудники"
          description="Доступ к панели управления"
          actions={
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setInviteOpen(true)}
            >
              Пригласить
            </Button>
          }
        />
        <Paper withBorder radius="lg" className={classes.table}>
          {!error && (
            <div className={classes.toolbar}>
              <GridTableToolbar
                count={filtered.length}
                loading={loading}
                loadingLabel="Загружаем сотрудников…"
                hasFilters={hasFilters}
                onResetFilters={() => {
                  setFilters(INITIAL_FILTERS);
                  setPage(1);
                }}
                density={density}
                onDensityChange={setDensity}
                columnsToggle={columnsToggle}
                onColumnsToggleChange={setColumnsToggle}
                onResetView={resetView}
                columnLabels={STAFF_COLUMN_LABELS}
              />
            </div>
          )}
          {error ? (
            <GridErrorState
              title="Не удалось загрузить сотрудников"
              message={error}
              onRetry={onRetry}
            />
          ) : (
            <DataTable
              records={filtered.slice((page - 1) * pageSize, page * pageSize)}
              columns={effectiveColumns}
              idAccessor="id"
              storeColumnsKey={STAFF_COLUMNS_STORAGE_KEY}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              horizontalSpacing={density === "compact" ? "sm" : "md"}
              verticalSpacing={density === "compact" ? "xs" : "sm"}
              highlightOnHover
              fetching={loading}
              loadingText="Загружаем сотрудников…"
              minHeight={loading || filtered.length === 0 ? 280 : undefined}
              page={page}
              onPageChange={setPage}
              recordsPerPage={pageSize}
              totalRecords={filtered.length}
              recordsPerPageOptions={GRID_PAGE_SIZE_OPTIONS}
              onRecordsPerPageChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
              recordsPerPageLabel="На странице"
              paginationText={({ from, to, totalRecords }) =>
                `${from}–${to} из ${totalRecords}`
              }
              emptyState={
                <Stack align="center" gap="xs" py="xl">
                  <Text fw={600}>
                    {members.length
                      ? "Сотрудники не найдены"
                      : "Сотрудников пока нет"}
                  </Text>
                  {hasFilters && (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setFilters(INITIAL_FILTERS);
                        setPage(1);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </Stack>
              }
            />
          )}
        </Paper>
      </Stack>
      <Drawer
        opened={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Приглашение сотрудника"
        position="right"
        size="md"
      >
        <CreateInvitationForm
          availableRoles={STAFF_ROLE_OPTIONS}
          onCreate={onCreateInvitation}
        />
      </Drawer>
      <Modal
        opened={Boolean(pending)}
        onClose={() => !busy && setPending(null)}
        title={pending?.kind === "role" ? "Изменить роль" : "Изменить доступ"}
        centered
      >
        <Stack>
          <Text size="sm">
            {pending?.kind === "role"
              ? `Изменить роль сотрудника ${subject?.lastName ?? ""} ${subject?.firstName ?? ""}?`
              : pending?.value === "active"
                ? `Вернуть доступ сотруднику ${subject?.lastName ?? ""} ${subject?.firstName ?? ""}?`
                : `Закрыть доступ сотруднику ${subject?.lastName ?? ""} ${subject?.firstName ?? ""}?`}
          </Text>
          <Group justify="end">
            <Button
              variant="default"
              onClick={() => setPending(null)}
              disabled={busy}
            >
              Отмена
            </Button>
            <Button
              color={pending?.value === "suspended" ? "red" : undefined}
              loading={busy}
              onClick={() => void confirmAction()}
            >
              Подтвердить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </section>
  );
}
