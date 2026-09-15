"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styled from "styled-components";
import { useAuth, hasPermission } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { FixedPeriodLabel, type Period } from "./PeriodToggle";

interface StageCount {
  total: number;
  previous: number;
}

interface PipelineResponse {
  status_code: number;
  inquiries: StageCount;
  quotes_sent: StageCount;
  quotes_accepted: StageCount & {
    declined: number;
    win_rate: number | null;
    one_off_value: number;
    monthly_value: number;
    yearly_value: number;
  };
  registrations_submitted: StageCount;
  registrations_approved: StageCount;
}

const Card = styled.section<{ $dimmed: boolean }>`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 1px solid #eef1f5;
  box-shadow: 0 1px 3px rgba(16, 30, 54, 0.05);
  margin-bottom: 2rem;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.45 : 1)};
  transition: opacity 0.2s ease;

  @media (max-width: 968px) {
    padding: 1.25rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`;

const Title = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Stages = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1.3fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 0.75rem;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

const Arrow = styled.div`
  display: flex;
  align-items: center;
  color: #c3ccd6;

  @media (max-width: 1280px) {
    display: none;
  }
`;

const Stage = styled.div`
  background: #f7faff;
  border-radius: 12px;
  padding: 1rem 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const StageLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #33414f;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: #1a237e;
    text-decoration: underline;
  }
`;

const StageValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
`;

const Detail = styled.div`
  font-size: 0.75rem;
  color: #5c6b7a;
  line-height: 1.45;
`;

const Change = styled.div<{ $tone: "up" | "down" | "flat" }>`
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: auto;
  padding-top: 0.25rem;
  color: ${({ $tone }) => ($tone === "up" ? "#047857" : $tone === "down" ? "#b91c1c" : "#5c6b7a")};
`;

const formatCurrency = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface Props {
  period?: Period;
}

/** Inquiries → quotes sent → quotes accepted → registrations submitted → approved, for a period vs the one before */
export default function SalesPipelineCard({ period = "30d" }: Props) {
  const { token, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    axios
      .post("/api/reports/pipeline-summary", { token, period })
      .then(res => {
        if (cancelled) return;
        if (res.data?.status_code === 200) setData(res.data);
        else setError(true);
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, period]);

  if (error) return null;

  const periodLabel = period === "30d" ? (zh ? "近30天" : "Last 30 days") : period === "7d" ? (zh ? "近7天" : "Last 7 days") : (zh ? "今天" : "Today");
  const previousText = period === "30d" ? (zh ? "上一个30天" : "previous 30 days") : period === "7d" ? (zh ? "上一个7天" : "previous 7 days") : (zh ? "昨天" : "yesterday");

  const change = (count?: StageCount) => {
    if (!count) return null;
    const diff = count.total - count.previous;
    const tone = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
    const text = diff === 0
      ? (zh ? `与${previousText}持平` : `Same as ${previousText}`)
      : `${diff > 0 ? "▲" : "▼"} ${Math.abs(diff).toLocaleString()} ${zh ? `对比${previousText}` : `vs ${previousText}`}`;
    return <Change $tone={tone}>{text}</Change>;
  };

  const accepted = data?.quotes_accepted;
  const acceptedValue = accepted && [
    accepted.one_off_value > 0 && (zh ? `一次性 ${formatCurrency(accepted.one_off_value)}` : `${formatCurrency(accepted.one_off_value)} one-off`),
    accepted.monthly_value > 0 && (zh ? `每月 ${formatCurrency(accepted.monthly_value)}` : `${formatCurrency(accepted.monthly_value)}/mo`),
    accepted.yearly_value > 0 && (zh ? `每年 ${formatCurrency(accepted.yearly_value)}` : `${formatCurrency(accepted.yearly_value)}/yr`),
  ].filter(Boolean).join(" · ");

  const stages = [
    {
      key: "inquiries",
      label: zh ? "新咨询" : "New Inquiries",
      href: "/admin/inquiries",
      permission: "manage_inquiries",
      count: data?.inquiries,
    },
    {
      key: "quotes-sent",
      label: zh ? "已发送报价" : "Quotes Sent",
      href: "/admin/quotations",
      permission: "manage_quotations",
      count: data?.quotes_sent,
    },
    {
      key: "quotes-accepted",
      label: zh ? "已接受报价" : "Quotes Accepted",
      href: "/admin/quotations",
      permission: "manage_quotations",
      count: accepted,
      details: accepted && [
        accepted.win_rate !== null
          ? (zh ? `成交率 ${accepted.win_rate}%（${accepted.declined} 个被拒绝）` : `${accepted.win_rate}% win rate (${accepted.declined} declined)`)
          : (zh ? "暂无已决定的报价" : "No decisions yet"),
        acceptedValue,
      ].filter(Boolean) as string[],
    },
    {
      key: "registrations-submitted",
      label: zh ? "已提交注册" : "Registrations Submitted",
      href: "/admin/registrations",
      permission: "manage_registration_forms",
      count: data?.registrations_submitted,
    },
    {
      key: "registrations-approved",
      label: zh ? "已批准（已开通）" : "Approved (Onboarded)",
      href: "/admin/registrations",
      permission: "manage_registration_forms",
      count: data?.registrations_approved,
    },
  ];

  return (
    <Card $dimmed={loading && !data} aria-label={zh ? "销售漏斗" : "Sales pipeline"}>
      <Header>
        <Title>{zh ? "销售漏斗" : "Sales Pipeline"}</Title>
        <FixedPeriodLabel label={periodLabel} />
      </Header>
      <Stages>
        {stages.map((stage, index) => (
          <Fragment key={stage.key}>
            {index > 0 && <Arrow><ArrowIcon /></Arrow>}
            <Stage>
              <StageLabel>
                {hasPermission(adminProfile, stage.permission) ? <Link href={stage.href}>{stage.label}</Link> : stage.label}
              </StageLabel>
              <StageValue>{stage.count ? stage.count.total.toLocaleString() : "—"}</StageValue>
              {stage.details?.map(line => <Detail key={line}>{line}</Detail>)}
              {change(stage.count)}
            </Stage>
          </Fragment>
        ))}
      </Stages>
    </Card>
  );
}
