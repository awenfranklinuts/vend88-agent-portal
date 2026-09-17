"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useAuth, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { ReportFilter } from "@/components/ui/RevenueSummaryCard";

interface TeamOption { id: string; name: string; kind: string; status: string }
interface PersonOption { user_id: string; name: string; email: string; role: string; team_id: string | null }

const Bar = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8a97a6;
`;

const Select = styled.select`
  padding: 0.625rem 0.875rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  min-width: 200px;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Summary = styled.span`
  margin-left: auto;
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const Clear = styled.button`
  border: none;
  background: #f3f4f6;
  color: #374151;
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #e5e7eb; }
`;

interface ReportFilterBarProps {
  value: ReportFilter;
  onChange: (next: ReportFilter) => void;
}

/**
 * Team / person filter for the report cards. Only rendered for users who see
 * every team - a team user's reports are already limited to their own scope by
 * the backend, so there is nothing for them to choose here.
 */
export default function ReportFilterBar({ value, onChange }: ReportFilterBarProps) {
  const { token, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [loading, setLoading] = useState(true);

  const show = canSeeAllTeams(adminProfile);

  useEffect(() => {
    if (!token || !show) return;
    axios.post("/api/teams/options", { token })
      .then(res => {
        setTeams(res.data?.teams || []);
        setPeople(res.data?.people || []);
      })
      .catch(() => { setTeams([]); setPeople([]); })
      .finally(() => setLoading(false));
  }, [token, show]);

  // People narrow to the chosen team; 'house' shows administrators (whose own
  // deals are the unattributed house accounts)
  const peopleForTeam = useMemo(() => {
    if (!value.team_id) return people;
    if (value.team_id === "house") return people.filter(p => !p.team_id);
    return people.filter(p => p.team_id === value.team_id);
  }, [people, value.team_id]);

  if (!show) return null;

  const teamName = value.team_id === "house"
    ? (zh ? "Vend88（内部账户）" : "Vend88 (house accounts)")
    : teams.find(t => t.id === value.team_id)?.name;
  const personName = people.find(p => p.user_id === value.owner_user_id)?.name;
  const active = !!(value.team_id || value.owner_user_id);

  return (
    <Bar>
      <Label>{zh ? "筛选" : "Filter"}</Label>
      <Select
        value={value.team_id ?? ""}
        disabled={loading}
        onChange={e => onChange({ team_id: e.target.value || undefined, owner_user_id: undefined })}
      >
        <option value="">{zh ? "所有团队" : "All teams"}</option>
        <option value="house">{zh ? "Vend88（内部账户）" : "Vend88 (house accounts)"}</option>
        {teams.map(t => (
          <option key={t.id} value={t.id}>{t.name}{t.status === "suspended" ? (zh ? "（已暂停）" : " (suspended)") : ""}</option>
        ))}
      </Select>
      <Select
        value={value.owner_user_id ?? ""}
        disabled={loading}
        onChange={e => onChange({ ...value, owner_user_id: e.target.value || undefined })}
      >
        <option value="">{value.team_id ? (zh ? "团队全部成员" : "Everyone in team") : (zh ? "所有人" : "Everyone")}</option>
        {peopleForTeam.map(p => (
          <option key={p.user_id} value={p.user_id}>{p.name}{p.name !== p.email ? ` — ${p.email}` : ""}</option>
        ))}
      </Select>
      {active && (
        <>
          <Clear onClick={() => onChange({})}>{zh ? "清除" : "Clear"}</Clear>
          <Summary>
            {zh ? "显示：" : "Showing: "}
            <strong>{personName || teamName}</strong>
            {personName && teamName ? ` · ${teamName}` : ""}
          </Summary>
        </>
      )}
    </Bar>
  );
}
