import { AuthActionError, type StaffAuthGateway } from "../model/contracts";

const unavailable = async (): Promise<never> => {
  throw new AuthActionError("unavailable");
};

// Replace this adapter with the typed .NET API client when the auth endpoints exist.
export const unavailableGateway: StaffAuthGateway = {
  requestEmailCode: unavailable,
  resendEmailCode: unavailable,
  verifyEmailCode: unavailable,
  signInWithPassword: unavailable,
  acceptInvitation: unavailable,
  resendInvitationCode: unavailable,
  verifyInvitationEmail: unavailable,
  requestRecovery: unavailable,
};
