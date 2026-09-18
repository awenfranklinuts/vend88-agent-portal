"use client";

import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { Button, ErrorMessage, Form, FormGroup, Hint, Input, Label } from "@/components/auth/AuthShell";
import { MIN_PASSWORD_LENGTH } from "@/components/auth/SetPasswordForm";

const SectionLabel = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5c6b7a;
  margin: 1.25rem 0 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;

  > * { flex: 1; min-width: 0; }

  @media (max-width: 460px) {
    flex-direction: column;
  }
`;

// The form an invited team owner completes: the team's details, their own name,
// and their password, all in one submission. Separate from SetPasswordForm
// because it collects a great deal more and has its own required fields, but it
// posts to the same accept-invite endpoint.
export default function TeamSetupForm({
  token,
  onDone,
}: {
  token: string;
  onDone: () => void;
}) {
  const { lang } = useLanguage();
  const t = (key: keyof typeof dict) => dict[key][lang];

  const [teamName, setTeamName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [abn, setAbn] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit =
    teamName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === confirm &&
    !saving;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/accept-invite", {
        token,
        password,
        team_name: teamName.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        contact_phone: contactPhone.trim(),
        abn: abn.trim(),
      });
      if (res.data?.status_code === 200) onDone();
      else setError(res.data?.message || t("linkInvalid"));
    } catch {
      setError(lang === "zh" ? "请求失败，请稍后再试。" : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={submit}>
      <SectionLabel>{t("teamDetails")}</SectionLabel>
      <FormGroup>
        <Label htmlFor="teamName">{t("teamNameLabel")} *</Label>
        <Input
          id="teamName"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          placeholder={lang === "zh" ? "例如：Acme 零售方案" : "e.g. Acme Retail Solutions"}
          autoFocus
          required
        />
      </FormGroup>
      <Row>
        <FormGroup>
          <Label htmlFor="phone">{lang === "zh" ? "联系电话" : "Contact phone"}</Label>
          <Input id="phone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="abn">ABN</Label>
          <Input id="abn" value={abn} onChange={e => setAbn(e.target.value)} />
        </FormGroup>
      </Row>
      <Hint>{t("optionalFields")}</Hint>

      <SectionLabel>{t("yourDetails")}</SectionLabel>
      <Hint>{t("yourDetailsHint")}</Hint>
      <Row>
        <FormGroup>
          <Label htmlFor="firstName">{lang === "zh" ? "名字" : "First name"} *</Label>
          <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="lastName">{lang === "zh" ? "姓氏" : "Last name"}</Label>
          <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
        </FormGroup>
      </Row>
      <FormGroup>
        <Label htmlFor="password">{t("newPassword")} *</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Hint>
          {password.length > 0 && password.length < MIN_PASSWORD_LENGTH
            ? t("passwordTooShort")
            : `${MIN_PASSWORD_LENGTH}+ ${lang === "zh" ? "个字符" : "characters"}`}
        </Hint>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="confirm">{t("confirmPassword")} *</Label>
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
        {saving ? t("savingPassword") : t("activateAccount")}
      </Button>
    </Form>
  );
}
