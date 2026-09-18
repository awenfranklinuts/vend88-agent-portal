"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import AuthShell, { ErrorMessage, InfoMessage, SuccessMessage } from "@/components/auth/AuthShell";
import SetPasswordForm from "@/components/auth/SetPasswordForm";
import TeamSetupForm from "@/components/auth/TeamSetupForm";

type Invite = { email: string; first_name: string; last_name?: string; team_name: string; setup_team?: boolean; team_kind?: string };

function AcceptInvite() {
  const { lang } = useLanguage();
  const t = (key: keyof typeof dict) => dict[key][lang];
  const params = useSearchParams();
  const token = params?.get("token") || "";

  const [invite, setInvite] = useState<Invite | null>(null);
  const [checking, setChecking] = useState(true);
  const [invalid, setInvalid] = useState("");
  const [done, setDone] = useState(false);

  // Looked up before showing the form so an expired link says so immediately,
  // rather than after someone has typed a password twice. This read does not
  // spend the token - only the submit below does.
  useEffect(() => {
    if (!token) { setChecking(false); setInvalid(t("linkInvalid")); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.post("/api/auth/invite-info", { token });
        if (cancelled) return;
        if (res.data?.status_code === 200) setInvite(res.data);
        else setInvalid(res.data?.message || t("linkInvalid"));
      } catch {
        if (!cancelled) setInvalid(t("linkInvalid"));
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (checking) {
    return (
      <AuthShell title={t("acceptInviteTitle")} backLabel={t("backToLogin")}>
        <InfoMessage>{t("checkingLink")}</InfoMessage>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell title={t("acceptInviteTitle")} backLabel={t("backToLogin")}>
        <SuccessMessage>{t("accountReady")}</SuccessMessage>
      </AuthShell>
    );
  }

  if (invalid || !invite) {
    return (
      <AuthShell title={t("acceptInviteTitle")} backLabel={t("backToLogin")}>
        <ErrorMessage>{invalid || t("linkInvalid")}</ErrorMessage>
      </AuthShell>
    );
  }

  const greeting = invite.first_name
    ? (lang === "zh" ? `${invite.first_name}，您好` : `Welcome, ${invite.first_name}`)
    : t("acceptInviteTitle");

  // An owner invited to stand up a brand new team names it here; an ordinary
  // member joins a team that already exists and only needs a password.
  if (invite.setup_team) {
    return (
      <AuthShell title={t("setUpYourTeam")} subtitle={t("setUpYourTeamSubtitle")} backLabel={t("backToLogin")}>
        <InfoMessage style={{ marginBottom: "1.25rem" }}>{invite.email}</InfoMessage>
        <TeamSetupForm token={token} onDone={() => setDone(true)} />
      </AuthShell>
    );
  }

  return (
    <AuthShell title={greeting} subtitle={t("acceptInviteSubtitle")} backLabel={t("backToLogin")}>
      <InfoMessage style={{ marginBottom: "1.25rem" }}>
        {invite.email}
        {invite.team_name && <><br />{t("invitedToTeam")}: {invite.team_name}</>}
      </InfoMessage>
      <SetPasswordForm
        token={token}
        endpoint="/api/auth/accept-invite"
        submitLabel={t("activateAccount")}
        onDone={() => setDone(true)}
        askName
        initialFirstName={invite.first_name}
        initialLastName={invite.last_name || ""}
      />
    </AuthShell>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInvite />
    </Suspense>
  );
}
