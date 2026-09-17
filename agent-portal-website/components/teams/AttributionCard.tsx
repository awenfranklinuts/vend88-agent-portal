"use client";

import { useState } from "react";
import styled from "styled-components";
import { useAuth, hasPermission } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import ReassignModal, { type ReassignableEntity } from "./ReassignModal";

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Heading = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const Label = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #5c6b7a;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 0.9375rem;
  color: #0a3655;
  font-weight: 500;
  word-break: break-word;
`;

const Muted = styled.span`
  color: #9ca3af;
  font-weight: 400;
`;

const ReassignButton = styled.button`
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 8px;
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;
  &:hover { background: #bfdbfe; }
`;

interface AttributionCardProps {
  entityType: ReassignableEntity;
  entityId: string;
  entityLabel: string;
  teamName?: string | null;
  attributedToName?: string | null;
  attributedToEmail?: string | null;
  ownerUserId?: string | null;
  /** Called after a reassignment so the page can refetch */
  onChanged?: () => void;
}

/**
 * Who a record is credited to, and the team it counts toward. Shown on detail
 * pages; the Reassign action appears for anyone with manage_team_members (the
 * backend decides how far they can move it).
 */
export default function AttributionCard({
  entityType, entityId, entityLabel, teamName, attributedToName, attributedToEmail, ownerUserId, onChanged,
}: AttributionCardProps) {
  const { adminProfile } = useAuth();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [open, setOpen] = useState(false);

  const canReassign = hasPermission(adminProfile, "manage_team_members");
  const house = !ownerUserId;

  return (
    <Card>
      <Heading>
        <span>{zh ? "归属" : "Attribution"}</span>
        {canReassign && (
          <ReassignButton onClick={() => setOpen(true)}>{zh ? "重新分配" : "Reassign"}</ReassignButton>
        )}
      </Heading>
      <Grid>
        <div>
          <Label>{zh ? "负责人" : "Attributed to"}</Label>
          <Value>
            {house
              ? <Muted>{zh ? "未分配（内部账户）" : "Unassigned (house account)"}</Muted>
              : (attributedToName || attributedToEmail || <Muted>{zh ? "未知用户" : "Unknown user"}</Muted>)}
            {!house && attributedToName && attributedToEmail && attributedToName !== attributedToEmail && (
              <div style={{ fontSize: "0.8125rem", color: "#5c6b7a", fontWeight: 400 }}>{attributedToEmail}</div>
            )}
          </Value>
        </div>
        <div>
          <Label>{zh ? "团队" : "Team"}</Label>
          <Value>{teamName || <Muted>{zh ? "Vend88（内部）" : "Vend88 (internal)"}</Muted>}</Value>
        </div>
      </Grid>

      <ReassignModal
        open={open}
        entityType={entityType}
        entityId={entityId}
        entityLabel={entityLabel}
        currentOwnerUserId={ownerUserId}
        onClose={() => setOpen(false)}
        onReassigned={onChanged}
      />
    </Card>
  );
}
