export type StaffRole = "admin" | "manager";
export type StaffStatus = "active" | "suspended" | "invited";

export type StaffMember = {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: StaffRole;
  status: StaffStatus;
  lastSeenAt: string | null;
  inviteExpiresAt: string | null;
};
