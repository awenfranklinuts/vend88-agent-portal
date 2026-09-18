"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import { inviteLabel } from "@/lib/inviteStatus";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import ReassignModal, { type ReassignableEntity } from "@/components/teams/ReassignModal";
import DashboardStatsRow from "@/components/ui/DashboardStatsRow";
import {
  ActionButton,
  Container,
  EmptyState,
  EmptyText,
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  LoadingText,
  MainContent,
  Modal,
  ModalActions,
  ModalButton,
  ModalContent,
  ModalText,
  ModalTitle,
  SecondaryButton,
  StatusBadge,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@/components/ui/AdminPageLayout";

/* ─── Types ─── */

type TeamKind = "internal" | "organisation" | "individual";
type TeamRole = "team_owner" | "team_member";
type Visibility = "self" | "team";

interface Team {
  id: string;
  name: string;
  kind: TeamKind;
  status: "active" | "suspended";
  slug: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  abn: string;
  commission_rate: number | null;
  notes: string;
  created_at: string;
  counts: { members: number; businesses: number; registrations: number; open_registrations: number; quotations: number; inquiries: number };
}

interface Member {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: TeamRole | "agent";
  status: "active" | "suspended";
  visibility: Visibility | "all";
  last_login?: string;
  created_at?: string;
  invite_pending?: boolean;
  email_verified?: boolean;
  invite_expires_at?: string | null;
  invite_expired?: boolean;
}

interface Can {
  edit_team: boolean;
  edit_contact: boolean;
  manage_members: boolean;
  reassign_anywhere: boolean;
}

interface AttributedRow {
  _id: string;
  team_name: string;
  attributed_to_name: string;
  attributed_to_email: string;
  owner_user_id: string | null;
  [key: string]: any;
}

interface Attributed {
  businesses: AttributedRow[];
  registrations: AttributedRow[];
  quotations: AttributedRow[];
  inquiries: AttributedRow[];
}

interface AuditRow {
  timestamp: string;
  action: string;
  target_email: string;
  actor_email: string;
  details: string;
}

interface MemberForm {
  email: string;
  // Blank on create means "invite them" - see inviteMode below.
  password: string;
  inviteMode: boolean;
  first_name: string;
  last_name: string;
  role: TeamRole;
  visibility: Visibility;
  status: "active" | "suspended";
}

const emptyMember: MemberForm = { email: "", password: "", inviteMode: true, first_name: "", last_name: "", role: "team_member", visibility: "self", status: "active" };

const KIND_LABELS: Record<TeamKind, { en: string; zh: string }> = {
  internal: { en: "Internal", zh: "内部" },
  organisation: { en: "Organisation", zh: "组织" },
  individual: { en: "Individual", zh: "个人代理" },
};

const ROLE_LABELS: Record<string, { en: string; zh: string }> = {
  team_owner: { en: "Team Owner", zh: "团队负责人" },
  team_member: { en: "Team Member", zh: "团队成员" },
  agent: { en: "Team Member", zh: "团队成员" },
};

const VISIBILITY_LABELS: Record<string, { en: string; zh: string; hint_en: string; hint_zh: string }> = {
  self: { en: "Own clients only", zh: "仅自己的客户", hint_en: "Sees only the customers and deals they brought in", hint_zh: "只能看到自己带来的客户和交易" },
  team: { en: "Whole team", zh: "整个团队", hint_en: "Sees everything attributed to this team", hint_zh: "可以看到归属于本团队的所有内容" },
  all: { en: "Everything", zh: "全部", hint_en: "", hint_zh: "" },
};

/* ─── Styles ─── */

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin: 1rem 0;
  border: none;
  background: none;
  color: #1a237e;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  @media (max-width: 968px) { padding: 1.25rem; }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0;
`;

const TeamName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

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

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.375rem;
`;

const DetailValue = styled.div`
  font-size: 0.9375rem;
  color: #0a3655;
  font-weight: 500;
  word-break: break-word;
`;

const Muted = styled.span`
  color: #9ca3af;
  font-weight: 400;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Stat = styled.div`
  background: #f7faff;
  border-radius: 12px;
  padding: 1rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #5c6b7a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${p => p.$active ? "#1a237e" : "#e0e7ef"};
  border-radius: 8px;
  background: ${p => p.$active ? "#1a237e" : "white"};
  color: ${p => p.$active ? "white" : "#0a3655"};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { border-color: #1a237e; }
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Warning = styled.p`
  font-size: 0.875rem;
  color: #991b1b;
  background: #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0 0 1rem;
`;

const Note = styled.p`
  font-size: 0.875rem;
  color: #1e40af;
  background: #dbeafe;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0 0 1rem;
`;

const ErrorText = styled.span`
  display: block;
  font-size: 0.8125rem;
  color: #dc2626;
  margin-top: 0.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Hint = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: -0.5rem 0 1rem;
`;

const ActionBadge = styled.span<{ $action: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  ${p => p.$action.endsWith("created")
    ? "background: rgba(34, 197, 94, 0.12); color: #15803d;"
    : p.$action.endsWith("deleted")
      ? "background: rgba(239, 68, 68, 0.12); color: #991b1b;"
      : p.$action === "reassigned"
        ? "background: #fef3c7; color: #92400e;"
        : "background: rgba(59, 130, 246, 0.12); color: #1e40af;"}
`;

const DateRangeFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f7faff;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateInputGroup = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const DateLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
  }
`;

const PresetButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PresetButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  ${p => p.$active ? `
    background: #1a237e;
    color: white;
    border-color: #1a237e;
  ` : `
    &:hover { border-color: #1a237e; color: #1a237e; }
  `}
`;

const ClearFilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:hover { background: #dc2626; }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  ${p => p.$active ? `
    background: #1a237e;
    color: white;
    border-color: #1a237e;
  ` : `
    &:hover:not(:disabled) { border-color: #1a237e; color: #1a237e; }
  `}
`;

const PaginationInfo = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
  margin-bottom: 0.75rem;
`;

const InviteBadge = styled.span<{ $expired?: boolean }>`
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

const ChoiceCard = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 2px solid ${p => (p.$selected ? "#1a237e" : "#e0e7ef")};
  background: ${p => (p.$selected ? "#f7faff" : "white")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  & + & { margin-top: 0.625rem; }
  &:hover { border-color: ${p => (p.$selected ? "#1a237e" : "#b9c6d6")}; }
`;

const ChoiceRadio = styled.input`
  margin-top: 0.2rem;
  accent-color: #1a237e;
  cursor: pointer;
`;

const ChoiceTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.2rem;
`;

/* ─── Page ─── */

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, role, isLoading: authLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";
  const t = (key: keyof typeof dict) => dict[key][lang];

  const routeId = (params?.id as string) || "";
  // "mine" is the sidebar's link for team owners; resolve it to their own team
  const isMine = routeId === "mine";
  const teamId = isMine ? adminProfile?.team?.id || "" : routeId;
  const admin = canSeeAllTeams(adminProfile);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [can, setCan] = useState<Can | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [attributed, setAttributed] = useState<Attributed | null>(null);
  const [attributedTab, setAttributedTab] = useState<ReassignableEntity>("business");
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [auditDateStart, setAuditDateStart] = useState("");
  const [auditDateEnd, setAuditDateEnd] = useState("");
  const [auditPage, setAuditPage] = useState(1);
  // Reported by the server for the current filter, not derived from a local slice.
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditLoading, setAuditLoading] = useState(false);
  // Distinguishes "this team has no history" from "nothing in this date range".
  const [auditHasAny, setAuditHasAny] = useState(false);

  // Team edit
  const [editingTeam, setEditingTeam] = useState(false);
  const [teamForm, setTeamForm] = useState<Partial<Team>>({});
  const [savingTeam, setSavingTeam] = useState(false);

  // Member modal
  const [memberModal, setMemberModal] = useState<null | { mode: "create" } | { mode: "edit"; member: Member }>(null);
  const [memberForm, setMemberForm] = useState<MemberForm>(emptyMember);
  const [memberErrors, setMemberErrors] = useState<Partial<Record<keyof MemberForm, string>>>({});
  const [savingMember, setSavingMember] = useState(false);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);
  const [resendingInvite, setResendingInvite] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Reassign
  const [reassign, setReassign] = useState<null | { type: ReassignableEntity; id: string; label: string; owner: string | null }>(null);

  // Suspend / delete team
  const [confirmStatus, setConfirmStatus] = useState<null | "active" | "suspended">(null);
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const allowed = hasPermission(adminProfile, "manage_team_members");

  useEffect(() => {
    if (authLoading) return;
    if (!token || !isPortalUser(role)) { router.push("/login"); return; }
    if (adminProfile && !allowed) router.push("/admin");
  }, [authLoading, token, role, adminProfile, allowed, router]);

  /* ─── Fetch ─── */

  const fetchAll = useCallback(async () => {
    if (!token || !teamId) return;
    setLoading(true);
    try {
      const [detail, attr] = await Promise.all([
        axios.post("/api/teams/detail", { token, team_id: teamId }),
        axios.post("/api/teams/attributed", { token, team_id: teamId }),
      ]);
      setTeam(detail.data.team);
      setMembers(detail.data.members || []);
      setCan(detail.data.can || null);
      setAttributed({
        businesses: attr.data.businesses || [],
        registrations: attr.data.registrations || [],
        quotations: attr.data.quotations || [],
        inquiries: attr.data.inquiries || [],
      });
      setNotFound(false);
    } catch (err: any) {
      if (err?.response?.status === 404) setNotFound(true);
      else showToast(err?.response?.data?.message || (zh ? "获取团队失败" : "Failed to load team"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, teamId, zh, showToast]);

  useEffect(() => {
    if (token && teamId && allowed) fetchAll();
    else if (isMine && adminProfile && !adminProfile.team) setLoading(false);
  }, [token, teamId, allowed, fetchAll, isMine, adminProfile]);

  /* ─── Team edit ─── */

  const startEditTeam = () => {
    if (!team) return;
    setTeamForm({
      name: team.name, kind: team.kind, contact_name: team.contact_name, contact_email: team.contact_email,
      contact_phone: team.contact_phone, abn: team.abn, notes: team.notes,
    });
    setEditingTeam(true);
  };

  const saveTeam = async () => {
    if (!team) return;
    setSavingTeam(true);
    try {
      const payload: Record<string, unknown> = { token, team_id: team.id };
      // Owners may only send contact fields; the backend refuses the rest, so don't send them
      const fields: (keyof Team)[] = can?.edit_team
        ? ["name", "kind", "contact_name", "contact_email", "contact_phone", "abn", "notes"]
        : ["contact_name", "contact_email", "contact_phone", "notes"];
      for (const f of fields) if (teamForm[f] !== undefined) payload[f] = teamForm[f];
      await axios.post("/api/teams/update", payload);
      showToast(zh ? "团队已更新" : "Team updated", "success");
      setEditingTeam(false);
      fetchAll();
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "更新团队失败" : "Failed to update team"), "error");
    } finally {
      setSavingTeam(false);
    }
  };

  const setTeamStatus = async (status: "active" | "suspended") => {
    if (!team) return;
    setSavingStatus(true);
    try {
      await axios.post("/api/teams/update", { token, team_id: team.id, status });
      showToast(status === "suspended" ? (zh ? "团队已暂停，所有成员已被锁定" : "Team suspended - every member is now locked out") : (zh ? "团队已重新激活" : "Team reactivated"), "success");
      setConfirmStatus(null);
      fetchAll();
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "更新失败" : "Failed to update"), "error");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) return;
    setSavingStatus(true);
    try {
      await axios.post("/api/teams/delete", { token, team_id: team.id });
      showToast(zh ? "团队已删除" : "Team deleted", "success");
      router.push("/admin/teams");
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "删除失败" : "Failed to delete"), "error");
      setSavingStatus(false);
      setConfirmDeleteTeam(false);
    }
  };

  /* ─── Members ─── */

  const openCreateMember = () => {
    setMemberForm(emptyMember);
    setMemberErrors({});
    setMemberModal({ mode: "create" });
  };

  const openEditMember = (m: Member) => {
    setMemberForm({
      email: m.email, password: "", inviteMode: false, first_name: m.first_name, last_name: m.last_name,
      role: m.role === "agent" ? "team_member" : m.role, visibility: m.visibility === "all" ? "team" : m.visibility, status: m.status,
    });
    setMemberErrors({});
    setMemberModal({ mode: "edit", member: m });
  };

  const setMemberField = (field: keyof MemberForm, value: string) => {
    setMemberForm(prev => ({ ...prev, [field]: value }));
    if (memberErrors[field]) setMemberErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Switching back to an invite drops anything already typed into the password
  // box, so a half-typed password can never be sent along with an invite.
  const setInviteMode = (inviteMode: boolean) => {
    setMemberForm(prev => ({ ...prev, inviteMode, password: inviteMode ? "" : prev.password }));
    setMemberErrors(prev => ({ ...prev, password: undefined }));
  };

  const validateMember = (): boolean => {
    const next: Partial<Record<keyof MemberForm, string>> = {};
    if (memberModal?.mode === "create") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email.trim())) next.email = zh ? "请输入有效邮箱" : "A valid email is required";
      if (!memberForm.inviteMode && memberForm.password.length < 8) next.password = zh ? "密码至少8个字符" : "Password must be at least 8 characters";
    } else if (memberForm.password && memberForm.password.length < 8) {
      next.password = zh ? "密码至少8个字符" : "Password must be at least 8 characters";
    }
    setMemberErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveMember = async () => {
    if (!memberModal || !team || !validateMember()) return;
    setSavingMember(true);
    try {
      if (memberModal.mode === "create") {
        const payload: Record<string, unknown> = {
          token, team_id: team.id,
          email: memberForm.email.trim(),
          first_name: memberForm.first_name.trim(), last_name: memberForm.last_name.trim(),
          role: memberForm.role, visibility: memberForm.visibility,
        };
        // Omitted, not empty: the backend reads "no password" as "send an invite".
        if (!memberForm.inviteMode) payload.password = memberForm.password;
        const res = await axios.post("/api/teams/members/create", payload);
        // The member exists either way, so a failed invite email is a warning
        // about the email, not an error about the member.
        if (memberForm.inviteMode && res.data?.invite_sent === false) {
          showToast(t("inviteNotSent"), "error");
        } else {
          showToast(memberForm.inviteMode ? t("inviteSent") : (zh ? "成员已创建" : "Member created"), "success");
        }
      } else {
        const payload: Record<string, unknown> = {
          token, user_id: memberModal.member.user_id,
          first_name: memberForm.first_name.trim(), last_name: memberForm.last_name.trim(),
          role: memberForm.role, visibility: memberForm.visibility, status: memberForm.status,
        };
        if (memberForm.password) payload.password = memberForm.password;
        await axios.post("/api/teams/members/update", payload);
        showToast(zh ? "成员已更新" : "Member updated", "success");
      }
      setMemberModal(null);
      fetchAll();
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "保存成员失败" : "Failed to save member"), "error");
    } finally {
      setSavingMember(false);
    }
  };

  // Sending a new invite kills the previous link, so this is also the recovery
  // path for an invite that went to a typo'd address the owner has since fixed.
  const resendInvite = async (m: Member) => {
    setResendingInvite(m.user_id);
    try {
      await axios.post("/api/teams/members/resend-invite", { token, user_id: m.user_id });
      showToast(t("inviteSent"), "success");
      fetchAll();
    } catch (err: any) {
      showToast(err?.response?.data?.message || t("inviteNotSent"), "error");
    } finally {
      setResendingInvite(null);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteMember) return;
    setDeleting(true);
    try {
      await axios.post("/api/teams/members/delete", { token, user_id: deleteMember.user_id });
      showToast(zh ? "成员已删除" : "Member deleted", "success");
      setDeleteMember(null);
      fetchAll();
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "删除成员失败" : "Failed to delete member"), "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Helpers ─── */


  /* ─── Activity history: server-side date filter + pagination ─── */

  const AUDIT_PER_PAGE = 10;

  // Presets write into the same two date inputs, so the filter stays one source of truth
  const applyPreset = (preset: "today" | "last7days" | "last30days" | "alltime") => {
    if (preset === "alltime") {
      setAuditDateStart("");
      setAuditDateEnd("");
      setAuditPage(1);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    if (preset === "last7days") start.setDate(start.getDate() - 6);
    if (preset === "last30days") start.setDate(start.getDate() - 29);
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setAuditDateStart(iso(start));
    setAuditDateEnd(iso(today));
    setAuditPage(1);
  };

  // The date range and page go to the server, which filters and pages the whole
  // history. Doing it here would only ever see the rows already fetched, so a
  // range outside them would wrongly report nothing.
  const fetchAudit = useCallback(async () => {
    if (!token || !teamId) return;
    setAuditLoading(true);
    try {
      const res = await axios.post("/api/teams/audit-log", {
        token,
        team_id: teamId,
        date_start: auditDateStart || undefined,
        date_end: auditDateEnd || undefined,
        page: auditPage,
        page_size: AUDIT_PER_PAGE,
      });
      setAudit(res.data?.audit_log || []);
      setAuditTotal(res.data?.total ?? 0);
      setAuditTotalPages(res.data?.total_pages ?? 1);
      // A page beyond the end is clamped server-side; follow it so the controls agree.
      if (res.data?.page && res.data.page !== auditPage) setAuditPage(res.data.page);
      if (!auditDateStart && !auditDateEnd) setAuditHasAny((res.data?.total ?? 0) > 0);
      else if ((res.data?.total ?? 0) > 0) setAuditHasAny(true);
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "获取活动记录失败" : "Failed to load activity"), "error");
    } finally {
      setAuditLoading(false);
    }
  }, [token, teamId, auditDateStart, auditDateEnd, auditPage, zh, showToast]);

  useEffect(() => {
    if (token && teamId && allowed) fetchAudit();
  }, [token, teamId, allowed, fetchAudit]);

  const formatDate = (v?: string) => (v ? new Date(v).toLocaleString(zh ? "zh-CN" : "en-AU") : "-");
  const isSelf = (m: Member) => m.user_id === adminProfile?.user_id;
  const backHref = admin ? "/admin/teams" : "/admin";

  const attributedRows = useMemo(() => {
    if (!attributed) return [];
    switch (attributedTab) {
      case "business": return attributed.businesses;
      case "registration": return attributed.registrations;
      case "quotation": return attributed.quotations;
      case "inquiry": return attributed.inquiries;
    }
  }, [attributed, attributedTab]);

  const rowLabel = (row: AttributedRow): string => {
    switch (attributedTab) {
      case "business": return row.name || row._id;
      case "registration": return row.business_name || row.form_id || row._id;
      case "quotation": return row.number || row._id;
      case "inquiry": return row.company_name || row.full_name || row._id;
    }
  };

  const rowHref = (row: AttributedRow): string | null => {
    switch (attributedTab) {
      case "business": return `/admin/businesses/${row._id}`;
      case "registration": return `/admin/registrations/${row._id}`;
      case "quotation": return `/admin/quotations/${row._id}`;
      case "inquiry": return null;
    }
  };

  const rowSecondary = (row: AttributedRow): string => {
    switch (attributedTab) {
      case "business": return [row.suburb, row.state].filter(Boolean).join(", ");
      case "registration": return row.contact_email || row.contact_name || "";
      case "quotation": return row.customer?.company_name || row.customer?.contact_name || "";
      case "inquiry": return row.email || row.mobile || "";
    }
  };

  /* ─── Render ─── */

  const title = isMine || !admin ? (zh ? "我的团队" : "My Team") : (zh ? "团队管理" : "Team Management");

  const shell = (content: React.ReactNode) => (
    <MainLayout currentPage={title} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>{content}</MainContent>
      </Container>
    </MainLayout>
  );

  if (authLoading || !token || !adminProfile) return <Container><LoadingText>Loading...</LoadingText></Container>;
  if (!allowed) return null;

  if (isMine && !adminProfile.team) {
    return shell(
      <Card>
        <CardTitle>{zh ? "您未被分配到任何团队" : "You are not assigned to a team"}</CardTitle>
        <p style={{ color: "#5c6b7a", marginTop: "0.5rem" }}>{zh ? "请联系管理员。" : "Contact an administrator."}</p>
      </Card>
    );
  }

  if (loading) return shell(<LoadingText>Loading...</LoadingText>);

  if (notFound || !team) {
    return shell(
      <>
        <BackButton onClick={() => router.push(backHref)}>← {zh ? "返回" : "Back"}</BackButton>
        <Card>
          <CardTitle>{zh ? "未找到团队" : "Team not found"}</CardTitle>
        </Card>
      </>
    );
  }

  return shell(
    <>
      <BackButton onClick={() => router.push(backHref)}>← {admin ? (zh ? "返回团队列表" : "Back to Teams") : (zh ? "返回首页" : "Back to Home")}</BackButton>

      {team.status === "suspended" && (
        <Warning>{zh ? "此团队已暂停。其所有成员目前无法登录。" : "This team is suspended. None of its members can sign in."}</Warning>
      )}

      {/* ── Team card ── */}
      <Card>
        <CardHeader>
          <div>
            <TeamName>
              {team.name}
              <KindBadge $kind={team.kind}>{KIND_LABELS[team.kind][lang]}</KindBadge>
              <StatusBadge $status={team.status === "active" ? "active" : "inactive"}>
                {team.status === "active" ? (zh ? "活跃" : "Active") : (zh ? "已暂停" : "Suspended")}
              </StatusBadge>
            </TeamName>
            <Muted>{zh ? "创建于" : "Created"} {formatDate(team.created_at)}</Muted>
          </div>
          <Actions>
            {editingTeam ? (
              <>
                <SecondaryButton onClick={() => setEditingTeam(false)} disabled={savingTeam}>{zh ? "取消" : "Cancel"}</SecondaryButton>
                <ActionButton onClick={saveTeam} disabled={savingTeam}>{savingTeam ? (zh ? "保存中..." : "Saving...") : (zh ? "保存" : "Save")}</ActionButton>
              </>
            ) : (
              <>
                {(can?.edit_team || can?.edit_contact) && (
                  <ActionButton onClick={startEditTeam}>{zh ? "编辑" : "Edit"}</ActionButton>
                )}
                {can?.edit_team && team.status === "active" && (
                  <ActionButton $variant="reject" onClick={() => setConfirmStatus("suspended")}>{zh ? "暂停团队" : "Suspend Team"}</ActionButton>
                )}
                {can?.edit_team && team.status === "suspended" && (
                  <ActionButton $variant="approve" onClick={() => setConfirmStatus("active")}>{zh ? "重新激活" : "Reactivate"}</ActionButton>
                )}
                {can?.edit_team && team.slug !== "vend88-direct" && (
                  <ActionButton $variant="delete" onClick={() => setConfirmDeleteTeam(true)}>{zh ? "删除" : "Delete"}</ActionButton>
                )}
              </>
            )}
          </Actions>
        </CardHeader>

        <DetailGrid>
          {editingTeam && can?.edit_team && (
            <>
              <div>
                <DetailLabel>{zh ? "团队名称" : "Team name"}</DetailLabel>
                <FormInput value={teamForm.name || ""} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <DetailLabel>{zh ? "类型" : "Kind"}</DetailLabel>
                <FormSelect value={teamForm.kind} onChange={e => setTeamForm(f => ({ ...f, kind: e.target.value as TeamKind }))}>
                  {(Object.keys(KIND_LABELS) as TeamKind[]).map(k => <option key={k} value={k}>{KIND_LABELS[k][lang]}</option>)}
                </FormSelect>
              </div>
            </>
          )}
          <div>
            <DetailLabel>{zh ? "联系人" : "Contact name"}</DetailLabel>
            {editingTeam ? <FormInput value={teamForm.contact_name || ""} onChange={e => setTeamForm(f => ({ ...f, contact_name: e.target.value }))} />
              : <DetailValue>{team.contact_name || <Muted>-</Muted>}</DetailValue>}
          </div>
          <div>
            <DetailLabel>{zh ? "联系邮箱" : "Contact email"}</DetailLabel>
            {editingTeam ? <FormInput value={teamForm.contact_email || ""} onChange={e => setTeamForm(f => ({ ...f, contact_email: e.target.value }))} />
              : <DetailValue>{team.contact_email || <Muted>-</Muted>}</DetailValue>}
          </div>
          <div>
            <DetailLabel>{zh ? "联系电话" : "Contact phone"}</DetailLabel>
            {editingTeam ? <FormInput value={teamForm.contact_phone || ""} onChange={e => setTeamForm(f => ({ ...f, contact_phone: e.target.value }))} />
              : <DetailValue>{team.contact_phone || <Muted>-</Muted>}</DetailValue>}
          </div>
          <div>
            <DetailLabel>ABN</DetailLabel>
            {editingTeam && can?.edit_team ? <FormInput value={teamForm.abn || ""} onChange={e => setTeamForm(f => ({ ...f, abn: e.target.value }))} />
              : <DetailValue>{team.abn || <Muted>-</Muted>}</DetailValue>}
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <DetailLabel>{zh ? "备注" : "Notes"}</DetailLabel>
            {editingTeam ? <FormTextarea rows={3} value={teamForm.notes || ""} onChange={e => setTeamForm(f => ({ ...f, notes: e.target.value }))} />
              : <DetailValue>{team.notes || <Muted>{zh ? "暂无备注" : "No notes"}</Muted>}</DetailValue>}
          </div>
        </DetailGrid>

        <StatsRow>
          <Stat><StatValue>{team.counts.members}</StatValue><StatLabel>{zh ? "成员" : "Members"}</StatLabel></Stat>
          <Stat><StatValue>{team.counts.businesses}</StatValue><StatLabel>{zh ? "业务" : "Businesses"}</StatLabel></Stat>
          <Stat><StatValue>{team.counts.open_registrations}</StatValue><StatLabel>{zh ? "待处理注册" : "Open registrations"}</StatLabel></Stat>
          <Stat><StatValue>{team.counts.quotations}</StatValue><StatLabel>{zh ? "报价" : "Quotations"}</StatLabel></Stat>
          <Stat><StatValue>{team.counts.inquiries}</StatValue><StatLabel>{zh ? "咨询" : "Inquiries"}</StatLabel></Stat>
        </StatsRow>
      </Card>

      {/* ── Performance: revenue, transactions and pipeline for this team only.
           An owner's backend scope already limits this to their team; the
           team_id is what lets an administrator see the same view. ── */}
      <DashboardStatsRow filter={{ team_id: team.id }} />

      {/* ── Members ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{zh ? "成员" : "Members"}</CardTitle>
            <Muted style={{ fontSize: "0.875rem" }}>
              {zh ? "负责人可管理成员并看到整个团队；成员默认只看到自己的客户。" : "Owners manage members and see the whole team; members see only their own clients by default."}
            </Muted>
          </div>
          {can?.manage_members && <ActionButton onClick={openCreateMember}>+ {zh ? "添加成员" : "Add Member"}</ActionButton>}
        </CardHeader>
        {members.length === 0 ? (
          <EmptyState><EmptyText>{zh ? "还没有成员" : "No members yet"}</EmptyText></EmptyState>
        ) : (
          <TableScroll>
            <Table>
              <Thead>
                <Tr>
                  <Th>{zh ? "姓名" : "Name"}</Th>
                  <Th>{zh ? "邮箱" : "Email"}</Th>
                  <Th>{zh ? "角色" : "Role"}</Th>
                  <Th>{zh ? "可见范围" : "Visibility"}</Th>
                  <Th>{zh ? "状态" : "Status"}</Th>
                  <Th>{zh ? "最后登录" : "Last login"}</Th>
                  {can?.manage_members && <Th>{zh ? "操作" : "Actions"}</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {members.map(m => (
                  <Tr key={m.user_id}>
                    <Td style={{ fontWeight: 600 }}>{m.name}{isSelf(m) && <Muted> ({zh ? "我" : "you"})</Muted>}</Td>
                    <Td>{m.email}</Td>
                    <Td>{ROLE_LABELS[m.role]?.[lang] || m.role}</Td>
                    <Td>{VISIBILITY_LABELS[m.visibility]?.[lang] || m.visibility}</Td>
                    <Td>
                      {m.invite_pending ? (
                        <>
                          <InviteBadge $expired={!!m.invite_expired}>
                            {m.invite_expired ? t("inviteExpired") : t("invitePending")}
                          </InviteBadge>
                          {!m.invite_expired && (
                            <div style={{ fontSize: "0.75rem", color: "#5c6b7a", marginTop: "0.25rem" }}>
                              {inviteLabel(m, t)}
                            </div>
                          )}
                        </>
                      ) : (
                        <StatusBadge $status={m.status === "active" ? "active" : "inactive"}>
                          {m.status === "active" ? (zh ? "活跃" : "Active") : (zh ? "已暂停" : "Suspended")}
                        </StatusBadge>
                      )}
                    </Td>
                    <Td>{formatDate(m.last_login)}</Td>
                    {can?.manage_members && (
                      <Td>
                        <ActionButton $variant="edit" onClick={() => openEditMember(m)}>{zh ? "编辑" : "Edit"}</ActionButton>
                        {m.invite_pending && (
                          <ActionButton
                            $variant="edit"
                            onClick={() => resendInvite(m)}
                            disabled={resendingInvite === m.user_id}
                          >
                            {resendingInvite === m.user_id ? t("sending") : t("resendInvite")}
                          </ActionButton>
                        )}
                        {!isSelf(m) && (
                          <ActionButton $variant="delete" onClick={() => setDeleteMember(m)}>{zh ? "删除" : "Delete"}</ActionButton>
                        )}
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableScroll>
        )}
      </Card>

      {/* ── Attributed records ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{zh ? "归属记录" : "Attributed to this team"}</CardTitle>
            <Muted style={{ fontSize: "0.875rem" }}>
              {admin
                ? (zh ? "可将记录重新分配给任何成员或团队。每次变更都记录在活动历史中。" : "Records can be reassigned to anyone. Every change is recorded in the activity history.")
                : (zh ? "可在本团队成员之间重新分配。跨团队转移需要管理员。" : "Reassign between your own members. Moving a record to another team needs an administrator.")}
            </Muted>
          </div>
        </CardHeader>
        <Tabs>
          {([
            ["business", zh ? "业务" : "Businesses", attributed?.businesses.length || 0],
            ["registration", zh ? "注册" : "Registrations", attributed?.registrations.length || 0],
            ["quotation", zh ? "报价" : "Quotations", attributed?.quotations.length || 0],
            ["inquiry", zh ? "咨询" : "Inquiries", attributed?.inquiries.length || 0],
          ] as [ReassignableEntity, string, number][]).map(([key, label, n]) => (
            <Tab key={key} $active={attributedTab === key} onClick={() => setAttributedTab(key)}>{label} ({n})</Tab>
          ))}
        </Tabs>
        {attributedRows.length === 0 ? (
          <EmptyState><EmptyText>{zh ? "暂无记录" : "Nothing here yet"}</EmptyText></EmptyState>
        ) : (
          <TableScroll>
            <Table>
              <Thead>
                <Tr>
                  <Th>{zh ? "名称" : "Name"}</Th>
                  <Th>{zh ? "状态" : "Status"}</Th>
                  <Th>{zh ? "负责人" : "Attributed to"}</Th>
                  <Th>{zh ? "操作" : "Actions"}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {attributedRows.map(row => {
                  const href = rowHref(row);
                  return (
                    <Tr key={row._id}>
                      <Td>
                        <div style={{ fontWeight: 600 }}>{rowLabel(row)}</div>
                        {rowSecondary(row) && <div style={{ fontSize: "0.8125rem", color: "#5c6b7a" }}>{rowSecondary(row)}</div>}
                      </Td>
                      <Td>{row.status ? <StatusBadge $status={row.status}>{row.status}</StatusBadge> : "-"}</Td>
                      <Td>{row.attributed_to_name || row.attributed_to_email || <Muted>{zh ? "未分配" : "Unassigned"}</Muted>}</Td>
                      <Td>
                        {href && <ActionButton $variant="view" onClick={() => router.push(href)}>{zh ? "查看" : "View"}</ActionButton>}
                        <ActionButton onClick={() => setReassign({ type: attributedTab, id: row._id, label: rowLabel(row), owner: row.owner_user_id })}>
                          {zh ? "重新分配" : "Reassign"}
                        </ActionButton>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableScroll>
        )}
      </Card>

      {/* ── Activity history ── */}
      <Card>
        <CardTitle style={{ marginBottom: "1rem" }}>{zh ? "活动历史" : "Activity History"}</CardTitle>
        {!auditHasAny && !auditLoading && !auditDateStart && !auditDateEnd ? (
          <EmptyState><EmptyText>{zh ? "暂无活动" : "No activity yet"}</EmptyText></EmptyState>
        ) : (
          <>
            <DateRangeFilter>
              <FilterRow>
                <DateInputGroup>
                  <DateLabel>{zh ? "开始日期" : "Start date"}</DateLabel>
                  <DateInput
                    type="date"
                    value={auditDateStart}
                    max={auditDateEnd || undefined}
                    onChange={e => { setAuditDateStart(e.target.value); setAuditPage(1); }}
                  />
                </DateInputGroup>
                <DateInputGroup>
                  <DateLabel>{zh ? "结束日期" : "End date"}</DateLabel>
                  <DateInput
                    type="date"
                    value={auditDateEnd}
                    min={auditDateStart || undefined}
                    onChange={e => { setAuditDateEnd(e.target.value); setAuditPage(1); }}
                  />
                </DateInputGroup>
                {(auditDateStart || auditDateEnd) && (
                  <ClearFilterButton onClick={() => { setAuditDateStart(""); setAuditDateEnd(""); setAuditPage(1); }}>
                    {zh ? "清除" : "Clear"}
                  </ClearFilterButton>
                )}
              </FilterRow>
              <PresetButtonGroup>
                <PresetButton onClick={() => applyPreset("today")}>{zh ? "今天" : "Today"}</PresetButton>
                <PresetButton onClick={() => applyPreset("last7days")}>{zh ? "最近7天" : "Last 7 days"}</PresetButton>
                <PresetButton onClick={() => applyPreset("last30days")}>{zh ? "最近30天" : "Last 30 days"}</PresetButton>
                <PresetButton $active={!auditDateStart && !auditDateEnd} onClick={() => applyPreset("alltime")}>
                  {zh ? "全部" : "All time"}
                </PresetButton>
              </PresetButtonGroup>
            </DateRangeFilter>

            {auditTotal === 0 ? (
              <EmptyState><EmptyText>{zh ? "该日期范围内无活动记录" : "No activity in this date range"}</EmptyText></EmptyState>
            ) : (
              <>
                <PaginationInfo style={{ opacity: auditLoading ? 0.5 : 1 }}>
                  {zh
                    ? `第 ${(auditPage - 1) * AUDIT_PER_PAGE + 1} - ${Math.min(auditPage * AUDIT_PER_PAGE, auditTotal)} 条，共 ${auditTotal} 条`
                    : `${(auditPage - 1) * AUDIT_PER_PAGE + 1} - ${Math.min(auditPage * AUDIT_PER_PAGE, auditTotal)} of ${auditTotal}`}
                </PaginationInfo>
                <TableScroll>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>{zh ? "时间" : "When"}</Th>
                        <Th>{zh ? "操作" : "Action"}</Th>
                        <Th>{zh ? "对象" : "Target"}</Th>
                        <Th>{zh ? "操作人" : "By"}</Th>
                        <Th>{zh ? "详情" : "Details"}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {audit.map((row, i) => (
                        <Tr key={i}>
                          <Td style={{ whiteSpace: "nowrap" }}>{formatDate(row.timestamp)}</Td>
                          <Td><ActionBadge $action={row.action}>{row.action.replace(/_/g, " ")}</ActionBadge></Td>
                          <Td>{row.target_email || "-"}</Td>
                          <Td>{row.actor_email || "-"}</Td>
                          <Td>{row.details}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableScroll>

                {auditTotalPages > 1 && (
                  <PaginationContainer>
                    <PaginationButton disabled={auditPage === 1} onClick={() => setAuditPage(1)}>
                      {zh ? "首页" : "First"}
                    </PaginationButton>
                    <PaginationButton disabled={auditPage === 1} onClick={() => setAuditPage(p => Math.max(1, p - 1))}>
                      {zh ? "上一页" : "Prev"}
                    </PaginationButton>
                    {Array.from({ length: Math.min(5, auditTotalPages) }, (_, i) => {
                      // Keep the current page centred once there are more pages than buttons
                      if (auditTotalPages <= 5) return i + 1;
                      if (auditPage <= 3) return i + 1;
                      if (auditPage >= auditTotalPages - 2) return auditTotalPages - 4 + i;
                      return auditPage - 2 + i;
                    }).map(pageNum => (
                      <PaginationButton key={pageNum} $active={auditPage === pageNum} onClick={() => setAuditPage(pageNum)}>
                        {pageNum}
                      </PaginationButton>
                    ))}
                    <PaginationButton disabled={auditPage === auditTotalPages} onClick={() => setAuditPage(p => Math.min(auditTotalPages, p + 1))}>
                      {zh ? "下一页" : "Next"}
                    </PaginationButton>
                    <PaginationButton disabled={auditPage === auditTotalPages} onClick={() => setAuditPage(auditTotalPages)}>
                      {zh ? "末页" : "Last"}
                    </PaginationButton>
                  </PaginationContainer>
                )}
              </>
            )}
          </>
        )}
      </Card>

      {/* ── Member modal ── */}
      <Modal $show={!!memberModal} onClick={() => !savingMember && setMemberModal(null)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
          <ModalTitle>{memberModal?.mode === "edit" ? (zh ? "编辑成员" : "Edit Member") : (zh ? "添加成员" : "Add Member")}</ModalTitle>
          {!admin && (
            <Note>
              {zh
                ? "您只能授予不高于自己的角色和可见范围。"
                : "You can grant up to your own role and visibility, never beyond."}
            </Note>
          )}
          <FormRow>
            <FormGroup>
              <FormLabel>{zh ? "名字" : "First name"}</FormLabel>
              <FormInput value={memberForm.first_name} onChange={e => setMemberField("first_name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <FormLabel>{zh ? "姓氏" : "Last name"}</FormLabel>
              <FormInput value={memberForm.last_name} onChange={e => setMemberField("last_name", e.target.value)} />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <FormLabel>{zh ? "登录邮箱" : "Login email"} {memberModal?.mode === "create" && "*"}</FormLabel>
            <FormInput value={memberForm.email} onChange={e => setMemberField("email", e.target.value)} disabled={memberModal?.mode === "edit"} autoComplete="off" />
            {memberErrors.email && <ErrorText>{memberErrors.email}</ErrorText>}
          </FormGroup>
          {memberModal?.mode === "create" ? (
            <FormGroup>
              <ChoiceCard $selected={memberForm.inviteMode} onClick={() => setInviteMode(true)}>
                <ChoiceRadio type="radio" checked={memberForm.inviteMode} onChange={() => setInviteMode(true)} />
                <div>
                  <ChoiceTitle>{t("inviteByEmail")}</ChoiceTitle>
                  <Hint style={{ margin: 0 }}>{t("inviteByEmailHint")}</Hint>
                </div>
              </ChoiceCard>
              <ChoiceCard $selected={!memberForm.inviteMode} onClick={() => setInviteMode(false)}>
                <ChoiceRadio type="radio" checked={!memberForm.inviteMode} onChange={() => setInviteMode(false)} />
                <div style={{ flex: 1 }}>
                  <ChoiceTitle>{t("setPasswordManually")}</ChoiceTitle>
                  <Hint style={{ margin: 0 }}>{t("setPasswordManuallyHint")}</Hint>
                  {!memberForm.inviteMode && (
                    <>
                      <FormInput
                        type="password"
                        value={memberForm.password}
                        onChange={e => setMemberField("password", e.target.value)}
                        autoComplete="new-password"
                        placeholder={zh ? "至少8个字符" : "At least 8 characters"}
                        style={{ marginTop: "0.75rem" }}
                        onClick={e => e.stopPropagation()}
                      />
                      {memberErrors.password && <ErrorText>{memberErrors.password}</ErrorText>}
                    </>
                  )}
                </div>
              </ChoiceCard>
            </FormGroup>
          ) : (
            <FormGroup>
              <FormLabel>
                {zh ? "密码" : "Password"} <Muted>({zh ? "留空则不修改" : "leave blank to keep unchanged"})</Muted>
              </FormLabel>
              <FormInput type="password" value={memberForm.password} onChange={e => setMemberField("password", e.target.value)} autoComplete="new-password" />
              {memberErrors.password && <ErrorText>{memberErrors.password}</ErrorText>}
              <Hint style={{ margin: "0.375rem 0 0" }}>
                {zh
                  ? "设置新密码会立即结束该成员的所有登录会话。"
                  : "Setting a password here signs the member out of every active session."}
              </Hint>
            </FormGroup>
          )}
          <FormRow>
            <FormGroup>
              <FormLabel>{zh ? "角色" : "Role"}</FormLabel>
              <FormSelect
                value={memberForm.role}
                onChange={e => setMemberField("role", e.target.value)}
                disabled={memberModal?.mode === "edit" && memberModal.member.user_id === adminProfile.user_id}
              >
                <option value="team_member">{ROLE_LABELS.team_member[lang]}</option>
                {(admin || adminProfile.role === "team_owner") && <option value="team_owner">{ROLE_LABELS.team_owner[lang]}</option>}
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel>{zh ? "可见范围" : "Visibility"}</FormLabel>
              <FormSelect value={memberForm.visibility} onChange={e => setMemberField("visibility", e.target.value)}>
                <option value="self">{VISIBILITY_LABELS.self[lang]}</option>
                {(admin || adminProfile.visibility === "team") && <option value="team">{VISIBILITY_LABELS.team[lang]}</option>}
              </FormSelect>
            </FormGroup>
          </FormRow>
          <Hint>{zh ? VISIBILITY_LABELS[memberForm.visibility].hint_zh : VISIBILITY_LABELS[memberForm.visibility].hint_en}</Hint>
          {memberModal?.mode === "edit" && memberModal.member.user_id !== adminProfile.user_id && (
            <FormGroup>
              <FormLabel>{zh ? "状态" : "Status"}</FormLabel>
              <FormSelect value={memberForm.status} onChange={e => setMemberField("status", e.target.value)}>
                <option value="active">{zh ? "活跃" : "Active"}</option>
                <option value="suspended">{zh ? "已暂停" : "Suspended"}</option>
              </FormSelect>
            </FormGroup>
          )}
          <ModalActions>
            <ModalButton onClick={() => setMemberModal(null)} disabled={savingMember}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $primary onClick={saveMember} disabled={savingMember}>
              {savingMember ? (zh ? "保存中..." : "Saving...") : (zh ? "保存" : "Save")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* ── Delete member ── */}
      <Modal $show={!!deleteMember} onClick={() => !deleting && setDeleteMember(null)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
          <ModalTitle>{zh ? "删除成员" : "Delete Member"}</ModalTitle>
          <ModalText>
            {zh
              ? `确定要删除 ${deleteMember?.email} 的登录吗？如果仍有客户归属于此人，删除会被拒绝——请先重新分配，或改为暂停账户。`
              : `Delete the login for ${deleteMember?.email}? This is refused while anything is still attributed to them - reassign first, or suspend the account instead.`}
          </ModalText>
          <ModalActions>
            <ModalButton onClick={() => setDeleteMember(null)} disabled={deleting}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $danger onClick={handleDeleteMember} disabled={deleting}>{deleting ? (zh ? "删除中..." : "Deleting...") : (zh ? "删除" : "Delete")}</ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* ── Suspend / reactivate team ── */}
      <Modal $show={!!confirmStatus} onClick={() => !savingStatus && setConfirmStatus(null)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
          <ModalTitle>{confirmStatus === "suspended" ? (zh ? "暂停团队" : "Suspend Team") : (zh ? "重新激活团队" : "Reactivate Team")}</ModalTitle>
          <ModalText>
            {confirmStatus === "suspended"
              ? (zh ? "暂停后，此团队的所有成员将立即无法登录，即使他们各自的账户仍为活跃状态。归属记录会保留。" : "Every member of this team is locked out immediately, even though their own accounts stay active. Attribution is kept.")
              : (zh ? "成员将恢复登录。" : "Members will be able to sign in again.")}
          </ModalText>
          <ModalActions>
            <ModalButton onClick={() => setConfirmStatus(null)} disabled={savingStatus}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $danger={confirmStatus === "suspended"} $primary={confirmStatus === "active"} onClick={() => confirmStatus && setTeamStatus(confirmStatus)} disabled={savingStatus}>
              {savingStatus ? "..." : confirmStatus === "suspended" ? (zh ? "暂停" : "Suspend") : (zh ? "激活" : "Reactivate")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* ── Delete team ── */}
      <Modal $show={confirmDeleteTeam} onClick={() => !savingStatus && setConfirmDeleteTeam(false)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
          <ModalTitle>{zh ? "删除团队" : "Delete Team"}</ModalTitle>
          <ModalText>
            {zh
              ? "只有没有成员且没有任何归属记录的团队才能删除。要在保留历史的同时锁定团队，请改用暂停。"
              : "Only a team with no members and nothing attributed to it can be deleted. To lock a team out while keeping its history, suspend it instead."}
          </ModalText>
          <ModalActions>
            <ModalButton onClick={() => setConfirmDeleteTeam(false)} disabled={savingStatus}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $danger onClick={handleDeleteTeam} disabled={savingStatus}>{savingStatus ? "..." : (zh ? "删除" : "Delete")}</ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {reassign && (
        <ReassignModal
          open
          entityType={reassign.type}
          entityId={reassign.id}
          entityLabel={reassign.label}
          currentOwnerUserId={reassign.owner}
          onClose={() => setReassign(null)}
          onReassigned={fetchAll}
        />
      )}
    </>
  );
}
