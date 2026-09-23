"use client";

import { useState } from "react";
import type { StaffMember, StaffRole, StaffStatus } from "@/entities/employee";
import { DEMO_STAFF } from "../../lib/stories/demo-staff";
import { StaffManagement } from "../StaffManagement";

export function StaffWorkspaceDemo({
  initialMembers = DEMO_STAFF,
  currentUserId = "1",
  loading = false,
  error = null,
}: {
  initialMembers?: StaffMember[];
  currentUserId?: string;
  loading?: boolean;
  error?: string | null;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [loadError, setLoadError] = useState(error);
  async function setRole(id: string, role: StaffRole) {
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, role } : member,
      ),
    );
  }
  async function setStatus(id: string, status: StaffStatus) {
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, status } : member,
      ),
    );
  }
  return (
    <StaffManagement
      members={members}
      currentUserId={currentUserId}
      loading={loading}
      error={loadError}
      onRetry={() => setLoadError(null)}
      onSetRole={setRole}
      onSetStatus={setStatus}
      onCreateInvitation={async () => ({
        url: "https://perviyzakaz.ru/admin/invite/storybook-demo",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      })}
    />
  );
}
