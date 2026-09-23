import type { StaffMember } from "@/entities/employee";

export function canManageStaffMember(
  member: StaffMember,
  currentUserId: string,
  activeAdminCount: number,
): boolean {
  return (
    member.id !== currentUserId &&
    !(
      member.role === "admin" &&
      member.status === "active" &&
      activeAdminCount <= 1
    )
  );
}
