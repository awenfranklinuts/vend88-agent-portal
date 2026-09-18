"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import AuthShell, { ErrorMessage, SuccessMessage } from "@/components/auth/AuthShell";
import SetPasswordForm from "@/components/auth/SetPasswordForm";

function ResetPassword() {
  const { lang } = useLanguage();
  const t = (key: keyof typeof dict) => dict[key][lang];
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <AuthShell title={t("resetPasswordTitle")} backLabel={t("backToLogin")}>
        <SuccessMessage>{t("passwordUpdated")}</SuccessMessage>
      </AuthShell>
    );
  }

  // A missing token means the link was mangled in transit, not that it expired -
  // but the fix is the same either way, so the message is too.
  if (!token) {
    return (
      <AuthShell title={t("resetPasswordTitle")} backLabel={t("backToLogin")}>
        <ErrorMessage>{t("linkInvalid")}</ErrorMessage>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t("setNewPassword")}
      subtitle={lang === "zh" ? "请设置一个新密码。" : "Choose a new password for your account."}
      backLabel={t("backToLogin")}
    >
      <SetPasswordForm
        token={token}
        endpoint="/api/auth/reset-password"
        submitLabel={t("setNewPassword")}
        onDone={() => setDone(true)}
      />
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  // useSearchParams needs a Suspense boundary or the route cannot be prerendered.
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
