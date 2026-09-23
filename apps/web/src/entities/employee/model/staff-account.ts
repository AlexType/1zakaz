export type StaffAccount = {
  id: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  avatarSourceUrl: string | null;
  roleName: string;
  passwordEnabled: boolean;
};
