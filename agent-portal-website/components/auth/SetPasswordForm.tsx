"use client";

import { useState } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { Button, ErrorMessage, Form, FormGroup, Hint, Input, Label } from "@/components/auth/AuthShell";

export const MIN_PASSWORD_LENGTH = 8;

// The "choose a password from an emailed token" form, shared by the reset and
// invite pages - the two differ in wording and endpoint, not in what they do.
export default function SetPasswordForm({
  token,
  endpoint,
  submitLabel,
  onDone,
}: {
  token: string;
  endpoint: string;
  submitLabel: string;
  onDone: () => void;
}) {
  const { lang } = useLanguage();
  const t = (key: keyof typeof dict) => dict[key][lang];

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = password.length >= MIN_PASSWORD_LENGTH && password === confirm && !saving;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.post(endpoint, { token, password });
      if (res.data?.status_code === 200) {
        onDone();
      } else {
        // Covers an expired or already-used link and the rate limiter; the
        // backend's message is the specific one, so show it rather than a guess.
        setError(res.data?.message || t("linkInvalid"));
      }
    } catch {
      setError(lang === "zh" ? "请求失败，请稍后再试。" : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={submit}>
      <FormGroup>
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          autoFocus
          required
        />
        <Hint>{tooShort ? t("passwordTooShort") : `${MIN_PASSWORD_LENGTH}+ ${lang === "zh" ? "个字符" : "characters"}`}</Hint>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="confirm">{t("confirmPassword")}</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />
        {mismatch && <Hint style={{ color: "#991b1b" }}>{t("passwordsDoNotMatch")}</Hint>}
      </FormGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit" disabled={!canSubmit}>
        {saving ? t("savingPassword") : submitLabel}
      </Button>
    </Form>
  );
}
