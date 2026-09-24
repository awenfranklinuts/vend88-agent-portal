"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth, isPortalUser, hasPermission } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { inviteLabel } from "@/lib/inviteStatus";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  ActionButton,
  Container,
  ContentHeaderFlex,
  EmptyState,
  EmptySubtext,
  EmptyText,
  FilterSelect,
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  HeaderLeft,
  LoadingText,
  MainContent,
  Modal,
  ModalActions,
  ModalButton,
  ModalContent,
  ModalTitle,
  PageDescription,
  PageTitle,
  PrimaryButton,
  SearchFilterContainer,
  SearchInput,
  StatusBadge,
  Table,
  TableContainer,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@/components/ui/AdminPageLayout";

/* ─── Types ─── */

type TeamKind = "internal" | "organisation" | "individual";
// 'pending' is a team whose invited owner has not completed setup yet.
type TeamStatus = "active" | "suspended" | "pending";

interface TeamCounts {
  members: number;
  businesses: number;
  registrations: number;
  open_registrations: number;
  quotations: number;
  inquiries: number;
}

interface Team {
  id: string;
  name: string;
  kind: TeamKind;
  status: TeamStatus;
  slug: string | null;
  invited_email: string;
  invite_expires_at?: string | null;
  invite_expired?: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  abn: string;
  commission_rate: number | null;
  notes: string;
  created_at: string;
  counts: TeamCounts;
}

interface CreateForm {
  name: string;
  kind: TeamKind;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  abn: string;
  notes: string;
  owner_email: string;
  owner_password: string;
  owner_first_name: string;
  owner_last_name: string;
  // true: send the owner a link and let them name the team and fill in the rest.
  // false: the administrator fills everything in here, as before.
  inviteMode: boolean;
}

const emptyForm: CreateForm = {
  name: "", kind: "organisation", contact_name: "", contact_email: "", contact_phone: "", abn: "",
  notes: "", owner_email: "", owner_password: "", owner_first_name: "", owner_last_name: "",
  inviteMode: true,
};

const KIND_LABELS: Record<TeamKind, { en: string; zh: string }> = {
  internal: { en: "Internal", zh: "内部" },
  organisation: { en: "Organisation", zh: "组织" },
  individual: { en: "Individual", zh: "个人代理" },
};

/* ─── Styles ─── */

const KindBadge = styled.span<{ $kind: TeamKind }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  ${p => p.$kind === "internal"
    ? "background: rgba(26, 35, 126, 0.1); color: #1a237e;"
    : p.$kind === "organisation"
      ? "background: #dbeafe; color: #1e40af;"
      : "background: #fef3c7; color: #92400e;"}
`;

const Count = styled.span<{ $muted?: boolean }>`
  font-weight: ${p => p.$muted ? 400 : 600};
  color: ${p => p.$muted ? "#9ca3af" : "#0a3655"};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const RefreshButton = styled.button`
  padding: 0.625rem;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;

  &:hover:not(:disabled) {
    background: #eff6ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    transition: transform 0.6s ease-in-out;
  }

  &:disabled svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const SwitchModeLink = styled.button`
  display: block;
  margin: 1rem 0 0;
  padding: 0;
  background: none;
  border: none;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a237e;
  cursor: pointer;
  text-align: left;

  &:hover { text-decoration: underline; }
`;

const PendingBadge = styled.span<{ $expired?: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  ${p => p.$expired
    ? "background: rgba(239, 68, 68, 0.12); color: #991b1b;"
    : "background: #fef3c7; color: #92400e;"}
`;

const SectionLabel = styled.h4`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 1.5rem 0 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const Hint = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: -0.25rem 0 1rem;
`;

const ErrorText = styled.span`
  display: block;
  font-size: 0.8125rem;
  color: #dc2626;
  margin-top: 0.25rem;
`;

const ClickableRow = styled(Tr)`
  cursor: pointer;
`;

/* Grid / table toggle - same control as Business and Customer Management */
const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
  flex-shrink: 0;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: ${p => p.$active ? '#3b82f6' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#5c6b7a'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$active ? '#2563eb' : '#e5e7eb'};
  }
`;

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
`;

const TeamCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(30, 64, 175, 0.16);
    border-color: rgba(59, 130, 246, 0.35);
  }
`;

const TeamCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
`;

const TeamCardName = styled.div`
  font-size: 1.1875rem;
  font-weight: 700;
  color: #0a3655;
  line-height: 1.3;
  overflow-wrap: anywhere;
`;

const TeamCardEmail = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TeamCardBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

/* Two per row: four across can't fit readable labels at card width */
const TeamCardStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const TeamCardStat = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: #f7faff;
  border-radius: 10px;
  padding: 0.75rem 0.875rem;
  min-width: 0;
`;

const TeamCardStatValue = styled.div<{ $muted?: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  color: ${p => p.$muted ? '#9ca3af' : '#0a3655'};
  flex-shrink: 0;
`;

const TeamCardStatLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #5c6b7a;
  min-width: 0;
`;

/* ─── Page ─── */

export default function TeamManagementPage() {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";
  const t = (key: keyof typeof dict) => dict[key][lang];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<"" | TeamKind>("");
  const [statusFilter, setStatusFilter] = useState<"" | TeamStatus>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateForm, string>>>({});
  const [saving, setSaving] = useState(false);

  const canManageTeams = hasPermission(adminProfile, "manage_teams");

  useEffect(() => {
    if (isLoading) return;
    if (!token) { router.push("/login"); return; }
    if (!isPortalUser(role)) { router.push("/login"); return; }
    if (!adminProfile) return;
    // A team owner lands here from the sidebar's "My Team": send them to their own team
    if (!canManageTeams) {
      router.push(hasPermission(adminProfile, "manage_team_members") ? "/admin/teams/mine" : "/admin");
    }
  }, [isLoading, token, role, adminProfile, canManageTeams, router]);

  const fetchTeams = useCallback(async ({ silent = false } = {}) => {
    if (!token) return;
    // A manual refresh keeps the current list on screen and only spins the
    // button; the full-page loading state is for the first load.
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axios.post("/api/teams/list", { token });
      setTeams(res.data?.teams || []);
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "获取团队失败" : "Failed to load teams"), "error");
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, [token, zh, showToast]);

  useEffect(() => {
    if (token && canManageTeams) fetchTeams();
  }, [token, canManageTeams, fetchTeams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams.filter(t => {
      if (kindFilter && t.kind !== kindFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (!q) return true;
      return [t.name, t.contact_name, t.contact_email, t.abn].some(v => (v || "").toLowerCase().includes(q));
    });
  }, [teams, search, kindFilter, statusFilter]);

  /* ─── Create ─── */

  const setField = (field: keyof CreateForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof CreateForm, string>> = {};
    const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    if (form.inviteMode) {
      // The owner names the team and fills in its details from the emailed link,
      // so their address is the only thing needed here.
      if (!emailOk(form.owner_email)) next.owner_email = zh ? "请输入有效的负责人邮箱" : "A valid owner email is required";
    } else {
      if (!form.name.trim()) next.name = zh ? "请输入团队名称" : "Team name is required";
      if (form.contact_email && !emailOk(form.contact_email)) {
        next.contact_email = zh ? "邮箱格式无效" : "Invalid email format";
      }
      const wantsOwner = form.owner_email || form.owner_password || form.owner_first_name || form.owner_last_name;
      if (wantsOwner) {
        if (!emailOk(form.owner_email)) next.owner_email = zh ? "请输入有效的负责人邮箱" : "A valid owner email is required";
        if (form.owner_password.length < 8) next.owner_password = zh ? "密码至少8个字符" : "Password must be at least 8 characters";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Omitting `name` is what puts the backend into invite mode.
      const payload: Record<string, unknown> = form.inviteMode
        ? { token, kind: form.kind, owner: { email: form.owner_email.trim() } }
        : {
            token,
            name: form.name.trim(),
            kind: form.kind,
            contact_name: form.contact_name.trim(),
            contact_email: form.contact_email.trim(),
            contact_phone: form.contact_phone.trim(),
            abn: form.abn.trim(),
            notes: form.notes.trim(),
            owner: form.owner_email ? {
              email: form.owner_email.trim(),
              password: form.owner_password,
              first_name: form.owner_first_name.trim(),
              last_name: form.owner_last_name.trim(),
            } : undefined,
          };
      const res = await axios.post("/api/teams/create", payload);

      if (form.inviteMode) {
        // The team row exists either way, so a failed send is a warning about
        // the email rather than an error about the team.
        showToast(
          res.data?.invite_sent === false
            ? t("inviteNotSent")
            : (zh ? `邀请已发送至 ${form.owner_email.trim()}` : `Invite sent to ${form.owner_email.trim()}`),
          res.data?.invite_sent === false ? "error" : "success",
        );
      } else {
        showToast(zh ? "团队已创建" : "Team created", "success");
      }
      setShowCreate(false);
      setForm(emptyForm);
      // A pending team has nothing on its detail page yet, so stay on the list
      // where the invite is visible and can be resent.
      const id = res.data?.team?.id;
      if (!form.inviteMode && id) router.push(`/admin/teams/${id}`);
      else fetchTeams();
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "创建团队失败" : "Failed to create team"), "error");
    } finally {
      setSaving(false);
    }
  };

  /* ─── Render ─── */

  if (isLoading || !token || !adminProfile || !canManageTeams) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  const title = zh ? "团队管理" : "Team Management";

  return (
    <MainLayout currentPage={title} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeaderFlex>
            <HeaderLeft>
              <PageTitle>{title}</PageTitle>
              <PageDescription>
                {zh
                  ? "合作组织、独立代理和内部销售团队。每个客户都归属于带来它的成员及其团队。"
                  : "Partner organisations, individual agents and internal sales teams. Every customer is attributed to the person who brought them in, and their team."}
              </PageDescription>
            </HeaderLeft>
            <PrimaryButton onClick={() => { setForm(emptyForm); setErrors({}); setShowCreate(true); }}>
              + {zh ? "新建团队" : "New Team"}
            </PrimaryButton>
          </ContentHeaderFlex>

          <SearchFilterContainer>
            <SearchInput
              placeholder={zh ? "按名称、联系人、邮箱或ABN搜索" : "Search by name, contact, email or ABN"}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FilterSelect value={kindFilter} onChange={e => setKindFilter(e.target.value as "" | TeamKind)}>
              <option value="">{zh ? "所有类型" : "All kinds"}</option>
              {(Object.keys(KIND_LABELS) as TeamKind[]).map(k => (
                <option key={k} value={k}>{KIND_LABELS[k][lang]}</option>
              ))}
            </FilterSelect>
            <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value as "" | TeamStatus)}>
              <option value="">{zh ? "所有状态" : "All statuses"}</option>
              <option value="active">{zh ? "活跃" : "Active"}</option>
              <option value="pending">{zh ? "待设置" : "Pending"}</option>
              <option value="suspended">{zh ? "已暂停" : "Suspended"}</option>
            </FilterSelect>
            <ViewToggle>
              <ViewButton $active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                <GridIcon /> {zh ? "网格" : "Grid"}
              </ViewButton>
              <ViewButton $active={viewMode === "table"} onClick={() => setViewMode("table")}>
                <ListIcon /> {zh ? "表格" : "Table"}
              </ViewButton>
            </ViewToggle>
            <RefreshButton
              onClick={() => fetchTeams({ silent: true })}
              disabled={loading || refreshing}
              title={refreshing ? (zh ? "刷新中..." : "Refreshing...") : (zh ? "刷新" : "Refresh")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 10 18.995 7.26822 17.3662 5.63824C15.7373 4.00827 13.4864 3 11 3C6.02944 3 2 7.02944 2 12C2 16.9706 6.02944 21 11 21C15.1031 21 18.5649 18.2543 19.6482 14.5M21 10V4M21 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </RefreshButton>
          </SearchFilterContainer>

          {!loading && filtered.length > 0 && viewMode === "grid" ? (
            <TeamGrid>
              {filtered.map(team => (
                <TeamCard key={team.id} onClick={() => router.push(`/admin/teams/${team.id}`)}>
                  <TeamCardHeader>
                    <div>
                      <TeamCardName>{team.status === "pending" ? (team.invited_email || team.name) : team.name}</TeamCardName>
                      {team.status === "pending"
                        ? <TeamCardEmail style={{ color: team.invite_expired ? "#991b1b" : undefined }}>
                            {inviteLabel({ invite_pending: true, ...team }, t) || (zh ? "等待负责人完成设置" : "Awaiting owner setup")}
                          </TeamCardEmail>
                        : team.contact_email && <TeamCardEmail title={team.contact_email}>{team.contact_email}</TeamCardEmail>}
                    </div>
                    <TeamCardBadges>
                      <KindBadge $kind={team.kind}>{KIND_LABELS[team.kind][lang]}</KindBadge>
                      {team.status === "pending" ? (
                        <PendingBadge $expired={!!team.invite_expired}>
                          {team.invite_expired ? t("inviteExpired") : (zh ? "待设置" : "Pending")}
                        </PendingBadge>
                      ) : (
                        <StatusBadge $status={team.status === "active" ? "active" : "inactive"}>
                          {team.status === "active" ? (zh ? "活跃" : "Active") : (zh ? "已暂停" : "Suspended")}
                        </StatusBadge>
                      )}
                    </TeamCardBadges>
                  </TeamCardHeader>
                  <TeamCardStats>
                    <TeamCardStat>
                      <TeamCardStatLabel>{zh ? "成员" : "Members"}</TeamCardStatLabel>
                      <TeamCardStatValue $muted={!team.counts.members}>{team.counts.members}</TeamCardStatValue>
                    </TeamCardStat>
                    <TeamCardStat>
                      <TeamCardStatLabel>{zh ? "店铺" : "Stores"}</TeamCardStatLabel>
                      <TeamCardStatValue $muted={!team.counts.businesses}>{team.counts.businesses}</TeamCardStatValue>
                    </TeamCardStat>
                    <TeamCardStat>
                      <TeamCardStatLabel>{zh ? "待处理注册" : "Open registrations"}</TeamCardStatLabel>
                      <TeamCardStatValue $muted={!team.counts.open_registrations}>{team.counts.open_registrations}</TeamCardStatValue>
                    </TeamCardStat>
                    <TeamCardStat>
                      <TeamCardStatLabel>{zh ? "报价" : "Quotations"}</TeamCardStatLabel>
                      <TeamCardStatValue $muted={!team.counts.quotations}>{team.counts.quotations}</TeamCardStatValue>
                    </TeamCardStat>
                  </TeamCardStats>
                </TeamCard>
              ))}
            </TeamGrid>
          ) : (
          <TableContainer>
            {loading ? (
              <LoadingText>Loading...</LoadingText>
            ) : filtered.length === 0 ? (
              <EmptyState>
                <EmptyText>{teams.length ? (zh ? "没有匹配的团队" : "No matching teams") : (zh ? "还没有团队" : "No teams yet")}</EmptyText>
                <EmptySubtext>
                  {teams.length
                    ? (zh ? "尝试调整搜索或筛选条件" : "Try adjusting your search or filters")
                    : (zh ? "创建第一个团队，然后为其添加成员登录" : "Create your first team, then add member logins to it")}
                </EmptySubtext>
              </EmptyState>
            ) : (
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th>{zh ? "团队" : "Team"}</Th>
                      <Th>{zh ? "类型" : "Kind"}</Th>
                      <Th>{zh ? "状态" : "Status"}</Th>
                      <Th>{zh ? "成员" : "Members"}</Th>
                      <Th>{zh ? "店铺" : "Stores"}</Th>
                      <Th>{zh ? "待处理注册" : "Open registrations"}</Th>
                      <Th>{zh ? "报价" : "Quotations"}</Th>
                      <Th>{zh ? "操作" : "Actions"}</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {filtered.map(team => (
                      <ClickableRow key={team.id} onClick={() => router.push(`/admin/teams/${team.id}`)}>
                        <Td>
                          <div style={{ fontWeight: 600 }}>
                            {team.status === "pending" ? (team.invited_email || team.name) : team.name}
                          </div>
                          {team.status === "pending"
                            ? <div style={{ fontSize: "0.8125rem", color: team.invite_expired ? "#991b1b" : "#5c6b7a" }}>
                                {inviteLabel({ invite_pending: true, ...team }, t) || (zh ? "等待负责人完成设置" : "Awaiting owner setup")}
                              </div>
                            : team.contact_email && <div style={{ fontSize: "0.8125rem", color: "#5c6b7a" }}>{team.contact_email}</div>}
                        </Td>
                        <Td><KindBadge $kind={team.kind}>{KIND_LABELS[team.kind][lang]}</KindBadge></Td>
                        <Td>
                          {team.status === "pending" ? (
                            <PendingBadge $expired={!!team.invite_expired}>
                              {team.invite_expired ? t("inviteExpired") : (zh ? "待设置" : "Pending")}
                            </PendingBadge>
                          ) : (
                            <StatusBadge $status={team.status === "active" ? "active" : "inactive"}>
                              {team.status === "active" ? (zh ? "活跃" : "Active") : (zh ? "已暂停" : "Suspended")}
                            </StatusBadge>
                          )}
                        </Td>
                        <Td><Count $muted={!team.counts.members}>{team.counts.members}</Count></Td>
                        <Td><Count $muted={!team.counts.businesses}>{team.counts.businesses}</Count></Td>
                        <Td><Count $muted={!team.counts.open_registrations}>{team.counts.open_registrations}</Count></Td>
                        <Td><Count $muted={!team.counts.quotations}>{team.counts.quotations}</Count></Td>
                        <Td>
                          <ActionButton $variant="view" onClick={e => { e.stopPropagation(); router.push(`/admin/teams/${team.id}`); }}>
                            {zh ? "管理" : "Manage"}
                          </ActionButton>
                        </Td>
                      </ClickableRow>
                    ))}
                  </Tbody>
                </Table>
              </TableWrapper>
            )}
          </TableContainer>
          )}
        </MainContent>
      </Container>

      {/* Create modal */}
      <Modal $show={showCreate} onClick={() => !saving && setShowCreate(false)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
          <ModalTitle>{zh ? "新建团队" : "New Team"}</ModalTitle>

          <FormGroup>
            <FormLabel>{zh ? "类型" : "Kind"} *</FormLabel>
            <FormSelect value={form.kind} onChange={e => setField("kind", e.target.value)}>
              {(Object.keys(KIND_LABELS) as TeamKind[]).map(k => (
                <option key={k} value={k}>{KIND_LABELS[k][lang]}</option>
              ))}
            </FormSelect>
          </FormGroup>
          <Hint>
            {zh
              ? "组织：合作公司，可自行管理成员。个人代理：单人团队。内部：Vend88 自己的销售人员。"
              : "Organisation: a partner company that manages its own members. Individual: a team of one. Internal: Vend88's own sales staff."}
          </Hint>

          {form.inviteMode ? (
            <>
              <FormGroup style={{ marginTop: "1rem" }}>
                <FormLabel>{zh ? "负责人邮箱" : "Owner email"} *</FormLabel>
                <FormInput
                  value={form.owner_email}
                  onChange={e => setField("owner_email", e.target.value)}
                  placeholder="owner@company.com"
                  autoComplete="off"
                />
                {errors.owner_email && <ErrorText>{errors.owner_email}</ErrorText>}
              </FormGroup>
              <Hint>
                {zh
                  ? "我们会向该邮箱发送设置链接。对方将自行填写团队名称、联系方式，并设置自己的密码。在此之前，该团队在列表中显示为“待设置”。"
                  : "We email them a setup link. They fill in the team name and contact details, and choose their own password. Until then the team shows as Pending in the list."}
              </Hint>
              <SwitchModeLink onClick={() => setField("inviteMode", false)}>
                {zh ? "改为手动填写全部信息" : "Or fill everything in yourself"}
              </SwitchModeLink>
            </>
          ) : (
            <>
              <FormGroup style={{ marginTop: "1rem" }}>
                <FormLabel>{zh ? "团队名称" : "Team name"} *</FormLabel>
                <FormInput value={form.name} onChange={e => setField("name", e.target.value)} placeholder={zh ? "例如：Acme 零售方案" : "e.g. Acme Retail Solutions"} />
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <FormLabel>{zh ? "联系人" : "Contact name"}</FormLabel>
                  <FormInput value={form.contact_name} onChange={e => setField("contact_name", e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{zh ? "联系邮箱" : "Contact email"}</FormLabel>
                  <FormInput value={form.contact_email} onChange={e => setField("contact_email", e.target.value)} />
                  {errors.contact_email && <ErrorText>{errors.contact_email}</ErrorText>}
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <FormLabel>{zh ? "联系电话" : "Contact phone"}</FormLabel>
                  <FormInput value={form.contact_phone} onChange={e => setField("contact_phone", e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>ABN</FormLabel>
                  <FormInput value={form.abn} onChange={e => setField("abn", e.target.value)} />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <FormLabel>{zh ? "备注" : "Notes"}</FormLabel>
                <FormTextarea rows={2} value={form.notes} onChange={e => setField("notes", e.target.value)} />
              </FormGroup>

              <SectionLabel>{zh ? "首位负责人登录（可选）" : "First owner login (optional)"}</SectionLabel>
              <Hint>
                {zh
                  ? "负责人可以管理本团队的成员登录，并看到整个团队的客户。也可以稍后再添加。"
                  : "The owner manages this team's member logins and sees the whole team's book. You can add one later instead."}
              </Hint>
              <FormRow>
                <FormGroup>
                  <FormLabel>{zh ? "名字" : "First name"}</FormLabel>
                  <FormInput value={form.owner_first_name} onChange={e => setField("owner_first_name", e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{zh ? "姓氏" : "Last name"}</FormLabel>
                  <FormInput value={form.owner_last_name} onChange={e => setField("owner_last_name", e.target.value)} />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <FormLabel>{zh ? "登录邮箱" : "Login email"}</FormLabel>
                  <FormInput value={form.owner_email} onChange={e => setField("owner_email", e.target.value)} autoComplete="off" />
                  {errors.owner_email && <ErrorText>{errors.owner_email}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <FormLabel>{zh ? "密码" : "Password"}</FormLabel>
                  <FormInput type="password" value={form.owner_password} onChange={e => setField("owner_password", e.target.value)} autoComplete="new-password" />
                  {errors.owner_password && <ErrorText>{errors.owner_password}</ErrorText>}
                </FormGroup>
              </FormRow>
              <SwitchModeLink onClick={() => setField("inviteMode", true)}>
                {zh ? "改为发送邀请链接" : "Or send them an invite link instead"}
              </SwitchModeLink>
            </>
          )}

          <ModalActions>
            <ModalButton onClick={() => setShowCreate(false)} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $primary onClick={handleCreate} disabled={saving}>
              {saving
                ? (form.inviteMode ? (zh ? "发送中..." : "Sending...") : (zh ? "创建中..." : "Creating..."))
                : (form.inviteMode ? (zh ? "发送邀请" : "Send Invite") : (zh ? "创建团队" : "Create Team"))}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
