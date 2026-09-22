export type InviteRole = { value: string; label: string };
export type CreatedInvitation = { url: string; expiresAt: string };

export type CreateInvitation = (
  roleId: string,
  lifetimeHours: number,
) => Promise<CreatedInvitation>;
