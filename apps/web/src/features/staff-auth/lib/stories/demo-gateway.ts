import { AuthActionError, type StaffAuthGateway } from "../../model/contracts";

export const demoGateway: StaffAuthGateway = {
  async requestEmailCode(email) {
    return { id: "demo-email", destination: email, resendAfterSeconds: 10 };
  },
  async resendEmailCode() {
    return {
      id: "demo-email-new",
      destination: "name@example.ru",
      resendAfterSeconds: 10,
    };
  },
  async verifyEmailCode(_challengeId, code) {
    if (code !== "123456") throw new AuthActionError("invalid-code");
  },
  async signInWithPassword(_phone, password) {
    if (password !== "demo-password")
      throw new AuthActionError("invalid-credentials");
    return { status: "totp-required", challengeId: "demo-totp" };
  },
  async verifyTotp(_challengeId, code) {
    if (code !== "123456") throw new AuthActionError("invalid-code");
  },
  async signInWithPasskey() {},
  async acceptInvitation(_token, profile) {
    return {
      id: "demo-invite",
      destination: profile.email,
      resendAfterSeconds: 10,
    };
  },
  async resendInvitationCode() {
    return {
      id: "demo-invite-new",
      destination: "name@example.ru",
      resendAfterSeconds: 10,
    };
  },
  async verifyInvitationEmail(_challengeId, code) {
    if (code !== "123456") throw new AuthActionError("invalid-code");
  },
  async requestRecovery() {},
};
