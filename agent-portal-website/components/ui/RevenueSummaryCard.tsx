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

const BreakdownHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.25rem;
`;

const BreakdownTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const ShowMore = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e40af;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const Row = styled.div<{ $muted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  opacity: ${({ $muted }) => ($muted ? 0.7 : 1)};
`;

const RowPct = styled.div`
  flex: 0 0 3.25rem;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a94a3;
  font-variant-numeric: tabular-nums;
`;

// Rows shown before the long tail folds into "Other"
const TOP_ROWS = 5;

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

/** Administrators can narrow a report to one team ('house' = unattributed) or one person; ignored for team users */
export interface ReportFilter {
  team_id?: string;
  owner_user_id?: string;
}

const filterKey = (period: string, filter?: ReportFilter) =>
  `${period}|${filter?.team_id ?? ""}|${filter?.owner_user_id ?? ""}`;

export default function RevenueSummaryCard({ filter }: { filter?: ReportFilter } = {}) {
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
      .post("/api/reports/revenue-summary", { token, period, ...filter })
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

  const series = displayData?.series;
  const chartData: ChartBucket[] = useMemo(
    () => (series ?? []).map((s) => ({ date: s.date, value: s.amount })),
    [series]
  );

  if (error) return null;

  const dimmed = loading && !cacheRef.current[key];
  const breakdown = displayData?.breakdown ?? [];
  const granularity: Granularity = displayData?.granularity
    ?? (period === "today" ? "hour" : period === "1y" || period === "all" ? "month" : "day");

  // The long tail of tiny payment types folds into one "Other" row so the top
  // methods stay readable; refunds sit last whatever their size.
  const [showAll, setShowAll] = useState(false);
  const positives = breakdown.filter((r) => r.amount >= 0);
  const negatives = breakdown.filter((r) => r.amount < 0);
  // Folding a single row saves nothing, so the tail only folds when it has two or more
  const tail = positives.slice(TOP_ROWS);
  const folded = tail.length > 1;
  const hiddenRows = showAll || !folded ? [] : tail;
  const otherRow: BreakdownRow | null = hiddenRows.length > 0
    ? {
        key: "__other__",
        label: lang === "zh" ? `其他 (${hiddenRows.length})` : `Other (${hiddenRows.length})`,
        amount: hiddenRows.reduce((sum, r) => sum + r.amount, 0),
        pct: hiddenRows.reduce((sum, r) => sum + r.pct, 0),
      }
    : null;
  const visibleRows: BreakdownRow[] = [
    ...(otherRow ? positives.slice(0, TOP_ROWS) : positives),
    ...(otherRow ? [otherRow] : []),
    ...negatives,
  ];
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
        gradientId="rev"
        data={chartData}
        granularity={granularity}
        total={total}
        dimmed={dimmed}
        lang={lang}
        seriesLabel={lang === "zh" ? "收入" : "Revenue"}
        formatValue={formatCurrency}
        formatAxisValue={formatShortCurrency}
        skeletonCount={period === "7d" ? 7 : period === "30d" ? 10 : period === "1y" ? 12 : 6}
      />

      {breakdown.length > 0 ? (
        <BreakdownList $dimmed={dimmed}>
          <BreakdownHeader>
            <BreakdownTitle>{lang === "zh" ? "按支付方式" : "By payment method"}</BreakdownTitle>
            {folded && (
              <ShowMore onClick={() => setShowAll((v) => !v)}>
                {showAll
                  ? (lang === "zh" ? "收起" : "Show less")
                  : (lang === "zh" ? `显示全部 ${breakdown.length} 项` : `Show all ${breakdown.length}`)}
              </ShowMore>
            )}
          </BreakdownHeader>
          {visibleRows.map((row) => {
            const negative = row.amount < 0;
            return (
              <Row key={row.key} $muted={row.key === "__other__"}>
                <RowLabel title={row.label}>{row.label}</RowLabel>
                <Track>
                  <Fill $pct={row.pct} $negative={negative} />
                </Track>
                <RowPct>{negative ? "" : `${Math.round(row.pct)}%`}</RowPct>
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
