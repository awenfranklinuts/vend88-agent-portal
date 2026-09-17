"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import {
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  Modal,
  ModalActions,
  ModalButton,
  ModalContent,
  ModalText,
  ModalTitle,
} from "@/components/ui/AdminPageLayout";

export type ReassignableEntity = "business" | "registration" | "quotation" | "inquiry";

export interface Assignee {
  user_id: string;
  email: string;
  name: string;
  role: string;
  team_id: string | null;
  team_name: string;
}

interface ReassignModalProps {
  open: boolean;
  entityType: ReassignableEntity;
  entityId: string;
  /** Shown in the dialog so the user can confirm they have the right record */
  entityLabel: string;
  currentOwnerUserId?: string | null;
  onClose: () => void;
  /** Called after a successful reassignment so the caller can refetch */
  onReassigned?: () => void;
}

const ENTITY_LABELS: Record<ReassignableEntity, { en: string; zh: string }> = {
  business: { en: "business", zh: "业务" },
  registration: { en: "registration", zh: "注册" },
  quotation: { en: "quotation", zh: "报价" },
  inquiry: { en: "inquiry", zh: "咨询" },
};

/**
 * Moves one record to a different owner. Who appears in the list, and where the
 * record may go, is decided by the backend: administrators see everyone and may
 * move anything; a team owner sees only their own members and may only move
 * within their team. This dialog just presents what /api/teams/assignees returns.
 */
export default function ReassignModal({
  open, entityType, entityId, entityLabel, currentOwnerUserId, onClose, onReassigned,
}: ReassignModalProps) {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open || !token) return;
    setOwnerUserId("");
    setReason("");
    setLoading(true);
    axios.post("/api/teams/assignees", { token })
      .then(res => setAssignees(res.data?.assignees || []))
      .catch(err => {
        showToast(err?.response?.data?.message || (zh ? "无法加载可分配人员" : "Could not load assignees"), "error");
        setAssignees([]);
      })
      .finally(() => setLoading(false));
  }, [open, token, zh, showToast]);

  // Group by team so a long list stays readable; administrators first
  const groups = useMemo(() => {
    const byTeam = new Map<string, { label: string; people: Assignee[] }>();
    for (const a of assignees) {
      if (a.user_id === currentOwnerUserId) continue;
      const key = a.team_id || "__admins__";
      const label = a.team_id ? a.team_name : (zh ? "管理员（内部账户）" : "Administrators (house account)");
      if (!byTeam.has(key)) byTeam.set(key, { label, people: [] });
      byTeam.get(key)!.people.push(a);
    }
    return [...byTeam.values()];
  }, [assignees, currentOwnerUserId, zh]);

  const handleSubmit = async () => {
    if (!ownerUserId) return;
    setSaving(true);
    try {
      await axios.post("/api/teams/reassign", {
        token,
        entity_type: entityType,
        entity_id: entityId,
        owner_user_id: ownerUserId,
        reason: reason.trim() || undefined,
      });
      showToast(zh ? "已重新分配" : "Reassigned successfully", "success");
      onReassigned?.();
      onClose();
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "重新分配失败" : "Failed to reassign"), "error");
    } finally {
      setSaving(false);
    }
  };

  const noun = ENTITY_LABELS[entityType][lang];

  return (
    <Modal $show={open} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <ModalTitle>{zh ? `重新分配${noun}` : `Reassign ${noun}`}</ModalTitle>
        <ModalText>
          {zh
            ? `将「${entityLabel}」归属到另一位成员。归属决定谁能看到这条记录，以及它计入哪个团队。`
            : `Move “${entityLabel}” to a different owner. Attribution decides who can see this record and which team it counts toward.`}
        </ModalText>

        <FormGroup>
          <FormLabel>{zh ? "新负责人" : "New owner"} *</FormLabel>
          <FormSelect value={ownerUserId} onChange={e => setOwnerUserId(e.target.value)} disabled={loading}>
            <option value="">{loading ? (zh ? "加载中..." : "Loading...") : (zh ? "选择成员" : "Select a person")}</option>
            {groups.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.people.map(p => (
                  <option key={p.user_id} value={p.user_id}>
                    {p.name}{p.name !== p.email ? ` — ${p.email}` : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <FormLabel>{zh ? "原因（可选，记录在活动历史中）" : "Reason (optional, recorded in the activity history)"}</FormLabel>
          <FormInput
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={zh ? "例如：员工离职、区域调整" : "e.g. staff departure, territory change"}
            maxLength={500}
          />
        </FormGroup>

        <ModalActions>
          <ModalButton onClick={onClose} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
          <ModalButton $primary onClick={handleSubmit} disabled={saving || !ownerUserId}>
            {saving ? (zh ? "处理中..." : "Reassigning...") : (zh ? "确认重新分配" : "Reassign")}
          </ModalButton>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
}
