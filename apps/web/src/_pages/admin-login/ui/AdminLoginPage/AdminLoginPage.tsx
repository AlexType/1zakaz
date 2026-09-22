"use client";

import { useRouter } from "next/navigation";
import { StaffAuthFlow, unavailableGateway } from "@/features/staff-auth";

export function AdminLoginPage() {
  const router = useRouter();
  return (
    <StaffAuthFlow
      gateway={unavailableGateway}
      onAuthenticated={() => router.replace("/admin")}
    />
  );
}
