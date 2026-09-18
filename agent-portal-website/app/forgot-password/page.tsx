"use client";

import { useState } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import AuthShell, {
  Button,
  ErrorMessage,
  Form,
  FormGroup,
  Input,
  Label,
  SuccessMessage,
} from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const t = (key: keyof typeof dict) => dict[key][lang];

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/forgot-password", { email: email.trim() });
      // The backend answers the same way whether or not the address has an
      // account, and so does this screen - showing "no such user" here would
      // hand anyone a way to test which addresses are registered.
      if (res.data?.status_code === 429) {
        setError(res.data.message);
      } else {
        setSent(true);
      }
    } catch {
      setError(lang === "zh" ? "请求失败，请稍后再试。" : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <AuthShell title={t("checkYourEmail")} backLabel={t("backToLogin")}>
        <SuccessMessage>
          {lang === "zh"
            ? `如果 ${email} 有对应账号，重置链接已发送。链接 1 小时内有效。`
            : `If ${email} has an account, a reset link is on its way. The link is good for 1 hour.`}
        </SuccessMessage>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t("resetPasswordTitle")}
      subtitle={t("resetPasswordSubtitle")}
      backLabel={t("backToLogin")}
    >
      <Form onSubmit={submit}>
        <FormGroup>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            required
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={sending || !email.trim()}>
          {sending ? t("sending") : t("sendResetLink")}
        </Button>
      </Form>
    </AuthShell>
  );
}
