"use client";

import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { FormGroup, FormInput, FormLabel, ModalButton } from "@/components/ui/AdminPageLayout";

// The HQ's own login: a username and password of its own, separate from every
// store's logins. Same rules and Generate button as a store login in Store
// Management (components/shops/ShopDetailPanel.tsx).

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const PasswordRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const generateHqPassword = () => `Vend${Math.floor(1000 + Math.random() * 9000)}`;

/** Mirrors the backend's checks so the form can say what's wrong before saving */
export function hqLoginError(
  { username, password }: { username: string; password: string },
  { passwordOptional = false, zh = false } = {}
): string {
  if (!/^\S{3,50}$/.test(username.trim())) {
    return zh ? "用户名需为 3-50 个字符，不含空格" : "Username must be 3-50 characters with no spaces";
  }
  if (!(passwordOptional && !password) && password.length < 6) {
    return zh ? "密码至少 6 个字符" : "Password must be at least 6 characters";
  }
  return "";
}

export default function HqLoginFields({
  username,
  password,
  onChange,
  disabled,
  editing = false,
}: {
  username: string;
  password: string;
  onChange: (next: { username: string; password: string }) => void;
  disabled?: boolean;
  /** Editing an existing login: a blank password keeps the current one */
  editing?: boolean;
}) {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <Row>
      <FormGroup>
        <FormLabel>{zh ? "用户名" : "Username"} *</FormLabel>
        <FormInput
          value={username}
          autoComplete="off"
          disabled={disabled}
          onChange={e => onChange({ username: e.target.value, password })}
          placeholder={zh ? "3-50 个字符，不含空格" : "3-50 characters, no spaces"}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>{zh ? "密码" : "Password"}{editing ? "" : " *"}</FormLabel>
        <PasswordRow>
          <FormInput
            type="text"
            value={password}
            autoComplete="new-password"
            disabled={disabled}
            onChange={e => onChange({ username, password: e.target.value })}
            placeholder={editing
              ? (zh ? "留空则保持不变" : "Leave blank to keep")
              : (zh ? "至少 6 个字符" : "At least 6 characters")}
          />
          <ModalButton type="button" disabled={disabled} onClick={() => onChange({ username, password: generateHqPassword() })}>
            {zh ? "生成" : "Generate"}
          </ModalButton>
        </PasswordRow>
      </FormGroup>
    </Row>
  );
}
