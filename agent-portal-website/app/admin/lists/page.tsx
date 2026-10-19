"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  Container, MainContent, ContentHeader, PageTitle, PageDescription, LoadingText,
  SearchFilterContainer, SearchInput, FilterSelect,
  TableContainer, TableWrapper, Table, Thead, Th, Tbody, Tr, Td,
  EmptyState, EmptyText, EmptySubtext,
} from "@/components/ui/AdminPageLayout";

/**
 * Quick Lists: flat, read-only tables for checking things across every
 * account at a glance. Pick a view from the selector; each view is one
 * backend endpoint under /portal/lists/<view>.
 *
 * To add a view: add an entry to VIEWS, then render it below.
 */

type ViewId = "logins";

const VIEWS: { id: ViewId; label: { en: string; zh: string } }[] = [
  { id: "logins", label: { en: "Store & HQ logins", zh: "店铺与总部登录" } },
];

interface LoginRow {
  type: "store" | "hq";
  id: string;
  business_id: string | null;
  name: string;
  business_name: string;
  customer_name: string;
  hq_name: string;
  status: string;
  logins: { username: string; password: string }[];
}

/* ─── Styles ─── */

const ViewBar = styled(SearchFilterContainer)`
  flex-wrap: wrap;
`;

const ViewLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5c6b7a;
`;

const ViewSelect = styled(FilterSelect)`
  font-weight: 600;
  min-width: 220px;
`;

const Divider = styled.span`
  width: 1px;
  align-self: stretch;
  background: #e0e7ef;

  @media (max-width: 968px) {
    display: none;
  }
`;

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: #0a3655;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
`;

const Summary = styled.div`
  padding: 1.25rem 2rem 0;
  font-size: 0.875rem;
  color: #5c6b7a;

  @media (max-width: 968px) {
    padding: 1rem 1rem 0;
  }
`;

const NameLink = styled(Link)`
  font-weight: 600;
  color: #0a3655;
  text-decoration: none;

  &:hover {
    color: #1e40af;
    text-decoration: underline;
  }
`;

const Sub = styled.div`
  font-size: 0.75rem;
  color: #5c6b7a;
  margin-top: 2px;
`;

const Muted = styled.span`
  color: #9ca3af;
`;

const TypeBadge = styled.span<{ $hq: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  ${(p) => (p.$hq ? "background: #ede9fe; color: #5b21b6;" : "background: #e0f2fe; color: #075985;")}
`;

// Store Management's status colours and labels, so the two pages read the same
const STATUS_STYLE: Record<string, { css: string; en: string; zh: string }> = {
  active: { css: "background: #d1fae5; color: #065f46;", en: "Active", zh: "活跃" },
  setup: { css: "background: #dbeafe; color: #1e40af;", en: "In setup", zh: "设置中" },
  test: { css: "background: #fef3c7; color: #92400e;", en: "Test", zh: "测试" },
  inactive: { css: "background: #fee2e2; color: #991b1b;", en: "Inactive", zh: "停用" },
  suspended: { css: "background: #fee2e2; color: #991b1b;", en: "Suspended", zh: "已暂停" },
};

const StoreStatus = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  ${(p) => STATUS_STYLE[p.$status]?.css || "background: #e5e7eb; color: #374151;"}
`;

const LoginLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 28px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #5c6b7a;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #e0e7ef;
    color: #0a3655;
  }
`;

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ─── Page ─── */

export default function QuickListsPage() {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [view, setView] = useState<ViewId>("logins");
  const [rows, setRows] = useState<LoginRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "store" | "hq">("all");
  const [loginFilter, setLoginFilter] = useState<"all" | "with" | "without">("all");
  const [showAll, setShowAll] = useState(false);
  // Same default as Store Management: stores with no status are half-made
  // records and stay hidden unless asked for. HQs are always listed, as on
  // HQ Management.
  const [includeNoStatus, setIncludeNoStatus] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const allowed = !!token && isPortalUser(role) && canSeeAllTeams(adminProfile) && hasPermission(adminProfile, "manage_businesses");

  useEffect(() => {
    if (isLoading) return;
    if (!token || !isPortalUser(role)) router.push("/login");
    else if (adminProfile && !allowed) router.push("/admin");
  }, [token, role, isLoading, adminProfile, allowed, router]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/lists/${view}`, { token });
      setRows(res.data?.data || []);
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "加载列表失败" : "Failed to load the list"), "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token, view, zh, showToast]);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (!includeNoStatus && r.type === "store" && !r.status) return false;
      if (loginFilter === "with" && r.logins.length === 0) return false;
      if (loginFilter === "without" && r.logins.length > 0) return false;
      if (!q) return true;
      return [r.name, r.business_name, r.customer_name, r.hq_name, ...r.logins.map((l) => l.username)]
        .some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [rows, search, typeFilter, loginFilter, includeNoStatus]);

  const counts = useMemo(() => ({
    stores: filtered.filter((r) => r.type === "store").length,
    hqs: filtered.filter((r) => r.type === "hq").length,
    logins: filtered.reduce((n, r) => n + r.logins.length, 0),
  }), [filtered]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(zh ? `${label}已复制` : `${label} copied`, "success");
    } catch {
      showToast(zh ? "复制失败" : "Failed to copy", "error");
    }
  };

  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }
  if (!allowed) return null;

  const title = zh ? "快速列表" : "Quick Lists";
  const detailHref = (r: LoginRow) =>
    r.type === "hq" ? `/admin/hq/${r.id}` : r.business_id ? `/admin/businesses/${r.business_id}` : null;

  return (
    <MainLayout currentPage={title} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <PageTitle>{title}</PageTitle>
            <PageDescription>
              {zh
                ? "选择要查看的列表，快速核对所有账户。"
                : "Pick a list to check across every account at a glance."}
            </PageDescription>
          </ContentHeader>

          <ViewBar>
            <ViewLabel>{zh ? "查看" : "View"}</ViewLabel>
            <ViewSelect value={view} onChange={(e) => setView(e.target.value as ViewId)} aria-label={zh ? "选择列表" : "Choose a list"}>
              {VIEWS.map((v) => <option key={v.id} value={v.id}>{v.label[lang === "zh" ? "zh" : "en"]}</option>)}
            </ViewSelect>
            <Divider />
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={zh ? "搜索店铺、客户、总部或用户名" : "Search store, customer, HQ or username"}
            />
            <FilterSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}>
              <option value="all">{zh ? "店铺和总部" : "Stores & HQs"}</option>
              <option value="store">{zh ? "仅店铺" : "Stores only"}</option>
              <option value="hq">{zh ? "仅总部" : "HQs only"}</option>
            </FilterSelect>
            <FilterSelect value={loginFilter} onChange={(e) => setLoginFilter(e.target.value as typeof loginFilter)}>
              <option value="all">{zh ? "全部" : "Any login"}</option>
              <option value="with">{zh ? "有登录" : "Has a login"}</option>
              <option value="without">{zh ? "无登录" : "No login"}</option>
            </FilterSelect>
            <ToggleLabel>
              <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
              {zh ? "显示所有密码" : "Show passwords"}
            </ToggleLabel>
            <ToggleLabel>
              <input type="checkbox" checked={includeNoStatus} onChange={(e) => setIncludeNoStatus(e.target.checked)} />
              {zh ? "包含无状态账户" : "Include accounts with no status"}
            </ToggleLabel>
          </ViewBar>

          <TableContainer>
            {!loading && rows.length > 0 && (
              <Summary>
                {zh
                  ? `${counts.stores} 家店铺 · ${counts.hqs} 个总部 · ${counts.logins} 个登录`
                  : `${counts.stores} stores · ${counts.hqs} HQs · ${counts.logins} logins`}
              </Summary>
            )}
            <TableWrapper>
              {loading ? (
                <LoadingText>{zh ? "加载中..." : "Loading..."}</LoadingText>
              ) : filtered.length === 0 ? (
                <EmptyState>
                  <EmptyText>{zh ? "没有匹配的记录" : "Nothing matches"}</EmptyText>
                  <EmptySubtext>{zh ? "尝试调整搜索或筛选条件。" : "Try a different search or filter."}</EmptySubtext>
                </EmptyState>
              ) : (
                <Table>
                  <Thead>
                    <tr>
                      <Th style={{ width: 40 }}>#</Th>
                      <Th>{zh ? "名称" : "Name"}</Th>
                      <Th>{zh ? "类型" : "Type"}</Th>
                      <Th>{zh ? "总部" : "HQ"}</Th>
                      <Th>{zh ? "状态" : "Status"}</Th>
                      <Th>{zh ? "用户名" : "Username"}</Th>
                      <Th>{zh ? "密码" : "Password"}</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {filtered.map((r, i) => {
                      const href = detailHref(r);
                      const sub = [r.customer_name, r.type === "store" && r.business_name !== r.name ? r.business_name : ""]
                        .filter(Boolean).join(" · ");
                      return (
                        <Tr key={`${r.type}-${r.id}`}>
                          <Td><Muted>{i + 1}</Muted></Td>
                          <Td>
                            {href ? <NameLink href={href}>{r.name}</NameLink> : <strong>{r.name}</strong>}
                            {sub && <Sub>{sub}</Sub>}
                          </Td>
                          <Td><TypeBadge $hq={r.type === "hq"}>{r.type === "hq" ? "HQ" : (zh ? "店铺" : "STORE")}</TypeBadge></Td>
                          <Td>{r.type === "store" ? (r.hq_name || <Muted>—</Muted>) : <Muted>—</Muted>}</Td>
                          <Td>{r.status ? <StoreStatus $status={r.status}>{STATUS_STYLE[r.status]?.[zh ? "zh" : "en"] || r.status}</StoreStatus> : <Muted>—</Muted>}</Td>
                          <Td>
                            {r.logins.length === 0 ? <Muted>{zh ? "无登录" : "No login"}</Muted> : r.logins.map((l, j) => (
                              <LoginLine key={j}>
                                <span>{l.username || "—"}</span>
                                {l.username && (
                                  <IconBtn onClick={() => copy(l.username, zh ? "用户名" : "Username")} title={zh ? "复制用户名" : "Copy username"} aria-label={zh ? "复制用户名" : "Copy username"}>
                                    <CopyIcon />
                                  </IconBtn>
                                )}
                              </LoginLine>
                            ))}
                          </Td>
                          <Td>
                            {r.logins.length === 0 ? <Muted>—</Muted> : r.logins.map((l, j) => {
                              const key = `${r.type}-${r.id}-${j}`;
                              const visible = showAll || revealed.has(key);
                              return (
                                <LoginLine key={j}>
                                  <span>{!l.password ? "—" : visible ? l.password : "••••••••"}</span>
                                  {l.password && (
                                    <>
                                      {!showAll && (
                                        <IconBtn
                                          onClick={() => toggleReveal(key)}
                                          title={visible ? (zh ? "隐藏密码" : "Hide password") : (zh ? "显示密码" : "Show password")}
                                          aria-label={visible ? (zh ? "隐藏密码" : "Hide password") : (zh ? "显示密码" : "Show password")}
                                        >
                                          {visible ? <EyeOffIcon /> : <EyeIcon />}
                                        </IconBtn>
                                      )}
                                      <IconBtn onClick={() => copy(l.password, zh ? "密码" : "Password")} title={zh ? "复制密码" : "Copy password"} aria-label={zh ? "复制密码" : "Copy password"}>
                                        <CopyIcon />
                                      </IconBtn>
                                    </>
                                  )}
                                </LoginLine>
                              );
                            })}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </TableWrapper>
          </TableContainer>
        </MainContent>
      </Container>
    </MainLayout>
  );
}
