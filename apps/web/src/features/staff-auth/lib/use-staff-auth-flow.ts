"use client";

import { useState } from "react";
import {
  AuthActionError,
  type EmailChallenge,
  type InvitationDetails,
  type StaffAuthGateway,
  type StaffProfile,
} from "../model/contracts";

export type AuthScreen =
  | "login"
  | "email-code"
  | "totp"
  | "invite"
  | "invite-code"
  | "invite-invalid"
  | "invite-complete"
  | "recovery"
  | "recovery-complete"
  | "authenticated";

export type StaffAuthFlowOptions = {
  gateway: StaffAuthGateway;
  invitation?: InvitationDetails;
  initialScreen?: AuthScreen;
  previewChallenge?: EmailChallenge;
  onAuthenticated?: () => void;
};

const errorMessages: Record<AuthActionError["code"], string> = {
  "invalid-credentials":
    "Не удалось войти. Проверьте данные или выберите другой способ входа.",
  "invalid-code": "Код не подошёл. Проверьте цифры и попробуйте ещё раз.",
  "expired-code": "Срок действия кода истёк. Запросите новый код.",
  "rate-limited": "Слишком много попыток. Попробуйте позже.",
  "passkey-unavailable":
    "Passkey недоступен на этом устройстве или операция была отменена.",
  "invitation-expired":
    "Приглашение недействительно. Попросите администратора отправить новое.",
  unavailable: "Сервис входа пока недоступен. Попробуйте позже.",
};

export function useStaffAuthFlow({
  gateway,
  invitation,
  initialScreen,
  previewChallenge,
  onAuthenticated,
}: StaffAuthFlowOptions) {
  const [screen, setScreen] = useState<AuthScreen>(
    initialScreen ?? (invitation ? "invite" : "login"),
  );
  const [challenge, setChallenge] = useState<EmailChallenge | null>(
    previewChallenge ?? null,
  );
  const [challengeVersion, setChallengeVersion] = useState(0);
  const [totpChallengeId, setTotpChallengeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goTo(next: AuthScreen) {
    setError(null);
    setScreen(next);
  }

  function execute(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    void action()
      .catch((caught: unknown) => {
        setError(
          caught instanceof AuthActionError
            ? errorMessages[caught.code]
            : errorMessages.unavailable,
        );
      })
      .finally(() => setBusy(false));
  }

  function authenticated() {
    goTo("authenticated");
    onAuthenticated?.();
  }

  function requestEmailCode(email: string) {
    execute(async () => {
      setChallenge(await gateway.requestEmailCode(email));
      goTo("email-code");
    });
  }

  function signInWithPassword(phone: string, password: string) {
    execute(async () => {
      const result = await gateway.signInWithPassword(phone, password);
      if (result.status === "totp-required") {
        setTotpChallengeId(result.challengeId);
        goTo("totp");
      } else {
        authenticated();
      }
    });
  }

  function signInWithPasskey() {
    execute(async () => {
      await gateway.signInWithPasskey();
      authenticated();
    });
  }

  function acceptInvitation(profile: StaffProfile) {
    if (!invitation) return;
    execute(async () => {
      setChallenge(await gateway.acceptInvitation(invitation.token, profile));
      goTo("invite-code");
    });
  }

  function verifyCode(code: string) {
    if (screen === "totp") {
      execute(async () => {
        await gateway.verifyTotp(totpChallengeId, code);
        authenticated();
      });
      return;
    }

    if (!challenge) {
      setError(errorMessages.unavailable);
      return;
    }

    execute(async () => {
      if (screen === "invite-code") {
        await gateway.verifyInvitationEmail(challenge.id, code);
        goTo("invite-complete");
      } else {
        await gateway.verifyEmailCode(challenge.id, code);
        authenticated();
      }
    });
  }

  function resendCode() {
    if (!challenge) {
      setError(errorMessages.unavailable);
      return;
    }
    execute(async () => {
      const next =
        screen === "invite-code"
          ? await gateway.resendInvitationCode(challenge.id)
          : await gateway.resendEmailCode(challenge.id);
      setChallenge(next);
      setChallengeVersion((version) => version + 1);
    });
  }

  function requestRecovery(email: string) {
    execute(async () => {
      await gateway.requestRecovery(email);
      goTo("recovery-complete");
    });
  }

  return {
    screen,
    challenge,
    challengeVersion,
    totpChallengeId,
    busy,
    error,
    goTo,
    requestEmailCode,
    signInWithPassword,
    signInWithPasskey,
    acceptInvitation,
    verifyCode,
    resendCode,
    requestRecovery,
  };
}
