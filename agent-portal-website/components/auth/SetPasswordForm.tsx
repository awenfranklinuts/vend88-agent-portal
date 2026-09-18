"use client";

import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { Button, ErrorMessage, Form, FormGroup, Hint, Input, Label } from "@/components/auth/AuthShell";

export const MIN_PASSWORD_LENGTH = 8;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;

  > * { flex: 1; min-width: 0; }

  @media (max-width: 460px) {
    flex-direction: column;
  }
`;

// The "choose a password from an emailed token" form, shared by the reset and
// invite pages - the two differ in wording and endpoint, not in what they do.
//
// `askName` adds the invitee's own name to the form. An administrator is invited
// with nothing but an address and a role, so they name themselves here; a team
// member invited by their owner already has one, which is passed in and shown
// for them to confirm or correct.
export default function SetPasswordForm({
  token,
  endpoint,
  submitLabel,
  onDone,
  askName = false,
  initialFirstName = "",
  initialLastName = "",
}: {
  token: string;
  endpoint: string;
  submitLabel: string;
  onDone: () => void;
  askName?: boolean;
  initialFirstName?: string;
  initialLastName?: string;
}) {
  const { lang } = useLanguage();
  const t = (key: keyof typeof dict) => dict[key][lang];

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const mismatch = confirm.length > 0 && password !== confirm;
  const nameOk = !askName || firstName.trim().length > 0;
  const canSubmit = nameOk && password.length >= MIN_PASSWORD_LENGTH && password === confirm && !saving;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.post(endpoint, {
        token,
        password,
        // Only sent when the form collected them, so a reset never blanks a name.
        ...(askName ? { first_name: firstName.trim(), last_name: lastName.trim() } : {}),
      });
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
      {askName && (
        <Row>
          <FormGroup>
            <Label htmlFor="firstName">{lang === "zh" ? "名字" : "First name"} *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              autoComplete="given-name"
              autoFocus
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="lastName">{lang === "zh" ? "姓氏" : "Last name"}</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </FormGroup>
        </Row>
      )}
      <FormGroup>
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          autoFocus={!askName}
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
