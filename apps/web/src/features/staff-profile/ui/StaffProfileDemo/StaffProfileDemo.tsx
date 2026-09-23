import {
  demoProfile,
  demoProfileActions,
} from "../../lib/stories/profile-examples";
import { StaffProfileSettings } from "../StaffProfileSettings";

export function StaffProfileDemo({
  role = "manager",
}: {
  role?: "admin" | "manager";
}) {
  const profile =
    role === "admin"
      ? {
          ...demoProfile,
          id: "1",
          lastName: "Орлов",
          firstName: "Михаил",
          patronymic: "Петрович",
          email: "m.orlov@example.ru",
          roleName: "Администратор",
        }
      : demoProfile;
  return (
    <StaffProfileSettings
      initialProfile={profile}
      actions={demoProfileActions}
    />
  );
}
