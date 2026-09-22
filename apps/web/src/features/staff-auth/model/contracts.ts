export type StaffProfile = {
  fullName: string;
  email: string;
  phone: string;
};

export type EmailChallenge = {
  id: string;
  destination: string;
  resendAfterSeconds: number;
};

export type PasswordSignInResult =
  | { status: "authenticated" }
  | { status: "totp-required"; challengeId: string };

/** The API adapter will translate HTTP responses into these UI operations. */
export type StaffAuthGateway = {
  requestEmailCode(email: string): Promise<EmailChallenge>;
  resendEmailCode(challengeId: string): Promise<EmailChallenge>;
  verifyEmailCode(challengeId: string, code: string): Promise<void>;
  signInWithPassword(
    phone: string,
    password: string,
  ): Promise<PasswordSignInResult>;
  verifyTotp(challengeId: string, code: string): Promise<void>;
  signInWithPasskey(): Promise<void>;
  acceptInvitation(
    token: string,
    profile: StaffProfile,
  ): Promise<EmailChallenge>;
  resendInvitationCode(challengeId: string): Promise<EmailChallenge>;
  verifyInvitationEmail(challengeId: string, code: string): Promise<void>;
  requestRecovery(email: string): Promise<void>;
};

export type InvitationDetails = {
  token: string;
  roleName: string;
  expiresAt: string;
};

export type AuthFailureCode =
  | "invalid-credentials"
  | "invalid-code"
  | "expired-code"
  | "rate-limited"
  | "passkey-unavailable"
  | "invitation-expired"
  | "unavailable";

export class AuthActionError extends Error {
  constructor(public readonly code: AuthFailureCode) {
    super(code);
    this.name = "AuthActionError";
  }
}
