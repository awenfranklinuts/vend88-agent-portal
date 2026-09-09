"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import PeriodToggle, { Period } from "./PeriodToggle";
import SummaryLineChart, { ChartBucket, Granularity } from "./SummaryLineChart";

interface BreakdownRow {
  key: string;
  label: string;
  amount: number;
  pct: number;
}

interface SeriesBucket {
  date: string;
  amount: number;
}

interface SummaryResponse {
  status_code: number;
  period: Period;
  granularity: Granularity;
  total: number;
  breakdown: BreakdownRow[];
  series: SeriesBucket[];
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

const BreakdownList = styled.div<{ $dimmed: boolean }>`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eef1f5;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const RowLabel = styled.div`
  flex: 0 0 120px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #33414f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Track = styled.div`
  flex: 1;
  height: 10px;
  border-radius: 6px;
  background: #eef2f7;
  overflow: hidden;
`;

const Fill = styled.div<{ $pct: number; $negative: boolean }>`
  height: 100%;
  width: ${({ $pct }) => Math.min(Math.abs($pct), 100)}%;
  border-radius: 6px;
  background: ${({ $negative }) =>
    $negative
      ? "linear-gradient(90deg, #ffb199 0%, #e34948 100%)"
      : "linear-gradient(90deg, #00eaff 0%, #1a237e 100%)"};
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const RowAmount = styled.div<{ $negative: boolean }>`
  flex: 0 0 auto;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ $negative }) => ($negative ? "#c0392b" : "#0a3655")};
  min-width: 90px;
  text-align: right;
`;

const EmptyState = styled.div`
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #9aa7b5;
`;

function formatCurrency(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Compact form for the y-axis ticks, where two decimal places would crowd out
// the plot: $4.2k / $1.3M.
function formatShortCurrency(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(abs >= 10_000 ? 0 : 1)}k`;
  return `${sign}$${Math.round(abs).toLocaleString()}`;
}

export default function RevenueSummaryCard() {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>("today");
  const [displayData, setDisplayData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cacheRef = useRef<Partial<Record<Period, SummaryResponse>>>({});

  useEffect(() => {
    if (!token) return;

    const cached = cacheRef.current[period];
    if (cached) {
      setDisplayData(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    axios
      .post("/api/reports/revenue-summary", { token, period })
      .then((res) => {
        if (cancelled) return;
        if (res.data?.status_code === 200) {
          cacheRef.current[period] = res.data;
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
  }, [token, period]);

  const series = displayData?.series;
  const chartData: ChartBucket[] = useMemo(
    () => (series ?? []).map((s) => ({ date: s.date, value: s.amount })),
    [series]
  );

  if (error) return null;

  const dimmed = loading && !cacheRef.current[period];
  const breakdown = displayData?.breakdown ?? [];
  const granularity: Granularity = displayData?.granularity ?? (period === "7d" ? "day" : "hour");
  const total = displayData?.total ?? 0;

  return (
    <Card>
      <TopRow>
        <div>
          <Label>
            {lang === "zh" ? "已处理收入" : "Total Revenue Processed"}
          </Label>
          <Value $dimmed={dimmed}>{formatCurrency(total)}</Value>
        </div>
        <PeriodToggle
          period={period}
          onChange={setPeriod}
          todayLabel={lang === "zh" ? "今天" : "Today"}
          sevenDayLabel={lang === "zh" ? "近7天" : "Last 7 days"}
        />
      </TopRow>

      <SummaryLineChart
        gradientId="rev"
        data={chartData}
        granularity={granularity}
        total={total}
        dimmed={dimmed}
        lang={lang}
        seriesLabel={lang === "zh" ? "收入" : "Revenue"}
        formatValue={formatCurrency}
        formatAxisValue={formatShortCurrency}
        skeletonCount={period === "7d" ? 7 : 6}
      />

      {breakdown.length > 0 ? (
        <BreakdownList $dimmed={dimmed}>
          {breakdown.map((row) => {
            const negative = row.amount < 0;
            return (
              <Row key={row.key}>
                <RowLabel title={row.label}>{row.label}</RowLabel>
                <Track>
                  <Fill $pct={row.pct} $negative={negative} />
                </Track>
                <RowAmount $negative={negative}>
                  {formatCurrency(row.amount)}
                </RowAmount>
              </Row>
            );
          })}
        </BreakdownList>
      ) : !loading ? (
        <EmptyState>
          {lang === "zh" ? "此期间无收入数据" : "No revenue in this period"}
        </EmptyState>
      ) : null}
    </Card>
  );
}
