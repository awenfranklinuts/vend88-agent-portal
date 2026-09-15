"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { generateVendPassword } from "@/lib/passwords";

interface ShopCredential {
  _id: string;
  username: string;
  password: string;
  created_at: string | null;
}

// Fixed-length mask so a hidden value doesn't leak its real length
const MASKED_VALUE = "••••••••••••";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0a3655;
`;

const Hint = styled.p`
  font-size: 0.875rem;
  color: #5c6b7a;
  margin-bottom: 1.25rem;
`;

const PrimaryButton = styled.button`
  padding: 0.65rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const List = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  border: 1px solid #e0e7ef;
  border-radius: 12px;
  padding: 1rem 1.25rem;

  @media (max-width: 968px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
  }
`;

const Field = styled.div`
  min-width: 0;
`;

const FieldLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #8592a3;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
`;

const FieldValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9375rem;
    color: #0a3655;
    overflow-wrap: anywhere;
  }
`;

const SmallButton = styled.button`
  flex-shrink: 0;
  padding: 0.35rem 0.65rem;
  background: #f3f4f6;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
`;

const Created = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
  white-space: nowrap;
`;

const Empty = styled.div`
  text-align: center;
  padding: 2rem;
  color: #5c6b7a;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Dialog = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  width: 100%;
  max-width: 440px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0a3655;
    margin-bottom: 1.25rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0a3655;
    margin-bottom: 0.4rem;
  }

  input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 2px solid #e0e7ef;
    border-radius: 8px;
    font-size: 0.9375rem;
    color: #0a3655;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  small {
    display: block;
    color: #5c6b7a;
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }
`;

const PasswordRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ErrorText = styled.p`
  color: #b91c1c;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const SecondaryButton = styled.button`
  padding: 0.65rem 1.25rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }
`;

/** Naive UTC timestamps from the POS ("2026-09-15T01:18:53.998609") are read as UTC */
const formatCreated = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value.slice(0, 23)}Z`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

export default function ShopCredentialsTab({ shopId }: { shopId: string }) {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [credentials, setCredentials] = useState<ShopCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setLoadError("");
    try {
      const response = await axios.post(`/api/shops/${shopId}/credentials`, { token });
      setCredentials(response.data?.data || []);
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      setLoadError(message || (zh ? "加载登录凭证失败" : "Failed to load credentials"));
    } finally {
      setLoading(false);
    }
  }, [token, shopId, zh]);

  useEffect(() => {
    load();
  }, [load]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(zh ? `${label}已复制` : `${label} copied to clipboard`, "success");
    } catch {
      showToast(zh ? "复制失败" : "Couldn't copy to clipboard", "error");
    }
  };

  const openAdd = () => {
    setForm({ username: "", password: "" });
    setFormError("");
    setShowFormPassword(false);
    setShowAdd(true);
  };

  const handleCreate = async () => {
    const username = form.username.trim();
    if (!/^\S{3,50}$/.test(username)) {
      setFormError(zh ? "用户名需为 3-50 个字符，且不能包含空格。" : "Username must be 3-50 characters with no spaces.");
      return;
    }
    if (form.password.length < 6) {
      setFormError(zh ? "密码至少需要 6 个字符。" : "Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      await axios.put(`/api/shops/${shopId}/credentials`, { token, username, password: form.password });
      showToast(zh ? "登录凭证已添加" : "Credential added", "success");
      setShowAdd(false);
      await load();
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      setFormError(message || (zh ? "添加失败" : "Failed to add credential"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header>
        <Title>{zh ? "门店登录凭证" : "Store Login Credentials"}</Title>
        <PrimaryButton onClick={openAdd}>+ {zh ? "添加凭证" : "Add Credential"}</PrimaryButton>
      </Header>
      <Hint>
        {zh ? "用于登录此门店 POS 的用户名和密码。" : "Usernames and passwords used to log in to this store's POS."}
      </Hint>

      {loading ? (
        <Empty>{zh ? "加载中…" : "Loading…"}</Empty>
      ) : loadError ? (
        <Empty role="alert">{loadError}</Empty>
      ) : credentials.length === 0 ? (
        <Empty>{zh ? "此门店暂无登录凭证" : "No credentials for this store yet"}</Empty>
      ) : (
        <List>
          {credentials.map(credential => {
            const isRevealed = !!revealed[credential._id];
            return (
              <Row key={credential._id}>
                <Field>
                  <FieldLabel>{zh ? "用户名" : "Username"}</FieldLabel>
                  <FieldValue>
                    <code>{credential.username || "—"}</code>
                    {credential.username && (
                      <SmallButton onClick={() => copy(credential.username, zh ? "用户名" : "Username")}>{zh ? "复制" : "Copy"}</SmallButton>
                    )}
                  </FieldValue>
                </Field>
                <Field>
                  <FieldLabel>{zh ? "密码" : "Password"}</FieldLabel>
                  <FieldValue>
                    <code>{credential.password ? (isRevealed ? credential.password : MASKED_VALUE) : "—"}</code>
                    {credential.password && (
                      <>
                        <SmallButton
                          onClick={() => setRevealed(prev => ({ ...prev, [credential._id]: !isRevealed }))}
                          aria-label={isRevealed ? (zh ? "隐藏密码" : "Hide password") : (zh ? "显示密码" : "Show password")}
                        >
                          {isRevealed ? (zh ? "隐藏" : "Hide") : (zh ? "显示" : "Show")}
                        </SmallButton>
                        <SmallButton onClick={() => copy(credential.password, zh ? "密码" : "Password")}>{zh ? "复制" : "Copy"}</SmallButton>
                      </>
                    )}
                  </FieldValue>
                </Field>
                <Created>
                  <FieldLabel>{zh ? "创建时间" : "Created"}</FieldLabel>
                  {formatCreated(credential.created_at)}
                </Created>
              </Row>
            );
          })}
        </List>
      )}

      {showAdd && (
        <Overlay onClick={() => !saving && setShowAdd(false)}>
          <Dialog role="dialog" aria-modal="true" aria-labelledby="add-credential-title" onClick={e => e.stopPropagation()}>
            <h3 id="add-credential-title">{zh ? "添加门店登录凭证" : "Add Store Login"}</h3>
            <FormGroup>
              <label htmlFor="shop-cred-username">{zh ? "用户名" : "Username"}</label>
              <input
                id="shop-cred-username"
                autoComplete="off"
                autoFocus
                value={form.username}
                onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
              />
              <small>{zh ? "3-50 个字符，不含空格，所有门店中不能重复。" : "3-50 characters, no spaces. Must be unique across all stores."}</small>
            </FormGroup>
            <FormGroup>
              <label htmlFor="shop-cred-password">{zh ? "密码" : "Password"}</label>
              <PasswordRow>
                <input
                  id="shop-cred-password"
                  type={showFormPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
                />
                <SmallButton type="button" onClick={() => setShowFormPassword(v => !v)}>
                  {showFormPassword ? (zh ? "隐藏" : "Hide") : (zh ? "显示" : "Show")}
                </SmallButton>
                <SmallButton
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ ...prev, password: generateVendPassword() }));
                    setShowFormPassword(true);
                    setFormError("");
                  }}
                >
                  {zh ? "生成密码" : "Generate"}
                </SmallButton>
              </PasswordRow>
              <small>{zh ? "至少 6 个字符，或点击“生成密码”。" : "At least 6 characters, or click Generate."}</small>
            </FormGroup>
            {formError && <ErrorText role="alert">{formError}</ErrorText>}
            <DialogActions>
              <SecondaryButton onClick={() => setShowAdd(false)} disabled={saving}>{zh ? "取消" : "Cancel"}</SecondaryButton>
              <PrimaryButton onClick={handleCreate} disabled={saving}>
                {saving ? (zh ? "保存中…" : "Saving…") : (zh ? "添加" : "Add")}
              </PrimaryButton>
            </DialogActions>
          </Dialog>
        </Overlay>
      )}
    </>
  );
}
