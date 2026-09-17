"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import PeriodToggle, { Period } from "./PeriodToggle";
import SummaryLineChart, { ChartBucket, Granularity } from "./SummaryLineChart";

interface DailyBucket {
  date: string;
  count: number;
}

interface SummaryResponse {
  status_code: number;
  period: Period;
  granularity: Granularity;
  total: number;
  daily: DailyBucket[];
}

const Card = styled.div`
  background: white;
  padding: 1.75rem 2rem;
  border-radius: 16px;
  border: 1px solid #eef1f5;
  box-shadow: 0 1px 3px rgba(16, 30, 54, 0.05);
  margin-bottom: 2rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Label = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.4rem;
`;

const Value = styled.div<{ $dimmed: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a3655;
  line-height: 1.1;
  letter-spacing: -0.01em;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `${Math.round(n).toLocaleString()}`;
}

/** Administrators can narrow a report to one team ('house' = unattributed) or one person; ignored for team users */
export interface ReportFilter {
  team_id?: string;
  owner_user_id?: string;
}

const filterKey = (period: string, filter?: ReportFilter) =>
  `${period}|${filter?.team_id ?? ""}|${filter?.owner_user_id ?? ""}`;

export default function TransactionsSummaryCard({ filter }: { filter?: ReportFilter } = {}) {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>("today");
  const [displayData, setDisplayData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cacheRef = useRef<Record<string, SummaryResponse>>({});
  const key = filterKey(period, filter);

  useEffect(() => {
    if (!token) return;

    // Once a period has been fetched, switching back to it is instant -
    // no reload, no flicker, that's what actually makes the toggle feel smooth.
    const cached = cacheRef.current[key];
    if (cached) {
      setDisplayData(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    axios
      .post("/api/reports/transactions-summary", { token, period, ...filter })
      .then((res) => {
        if (cancelled) return;
        if (res.data?.status_code === 200) {
          cacheRef.current[key] = res.data;
          setDisplayData(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, period, key]);

  const daily = displayData?.daily;
  const chartData: ChartBucket[] = useMemo(
    () => (daily ?? []).map((d) => ({ date: d.date, value: d.count })),
    [daily]
  );
  const granularity: Granularity = displayData?.granularity
    ?? (period === "today" ? "hour" : period === "1y" || period === "all" ? "month" : "day");
  const total = displayData?.total ?? 0;
  const dimmed = loading && !cacheRef.current[key];

  if (error) return null;

  return (
    <Card>
      <TopRow>
        <div>
          <Label>
            {lang === "zh" ? "已处理交易数" : "Transactions Processed"}
          </Label>
          <Value $dimmed={dimmed}>{total.toLocaleString()}</Value>
        </div>
        <PeriodToggle
          period={period}
          onChange={setPeriod}
          options={[
            { value: "all", label: lang === "zh" ? "全部" : "All time" },
            { value: "1y", label: lang === "zh" ? "近1年" : "1 year" },
            { value: "30d", label: lang === "zh" ? "近30天" : "30 days" },
            { value: "7d", label: lang === "zh" ? "近7天" : "7 days" },
            { value: "today", label: lang === "zh" ? "今天" : "Today" },
          ]}
        />
      </TopRow>

      <SummaryLineChart
        gradientId="txn"
        data={chartData}
        granularity={granularity}
        total={total}
        dimmed={dimmed}
        lang={lang}
        seriesLabel={lang === "zh" ? "交易数" : "Transactions"}
        formatValue={(n) => n.toLocaleString()}
        formatAxisValue={formatCount}
        skeletonCount={period === "7d" ? 7 : period === "30d" ? 10 : period === "1y" ? 12 : 6}
      />
    </Card>
  );
}
