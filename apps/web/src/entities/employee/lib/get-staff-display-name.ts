import type { StaffAccount } from "../model/staff-account";

export function getStaffDisplayName(
  staff: Pick<StaffAccount, "lastName" | "firstName" | "patronymic">,
) {
  return [staff.lastName, staff.firstName, staff.patronymic]
    .filter(Boolean)
    .join(" ");
}
