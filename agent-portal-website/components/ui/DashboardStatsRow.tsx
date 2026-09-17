"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { ReportFilter } from "@/components/ui/RevenueSummaryCard";
import PeriodToggle, { Period } from "./PeriodToggle";
import Sparkline from "./Sparkline";
import { ChartBucket, Granularity } from "./SummaryLineChart";

// Every counter the growth and pipeline endpoints return has this shape: the count
// for the period, plus the same count for the period immediately before it.
interface Counter {
  total: number;
  previous: number;
}

interface PipelineResponse {
  status_code: number;
  inquiries: Counter;
  quotes_sent: Counter;
  quotes_accepted: Counter & { declined: number; win_rate: number | null };
  registrations_submitted: Counter;
  registrations_approved: Counter;
}

interface GrowthResponse {
  status_code: number;
  new_businesses: Counter;
  new_shops: Counter;
  active_businesses: Counter & { business_count: number };
}

// Revenue and transactions report a period total plus its buckets, but no
// prior-period figure - so these two headline numbers carry a sparkline instead
// of a delta.
interface RevenueResponse {
  status_code: number;
  total: number;
  granularity: Granularity;
  series: { date: string; amount: number }[];
}

interface TransactionsResponse {
  status_code: number;
  total: number;
  granularity: Granularity;
  daily: { date: string; count: number }[];
}

interface Funnel {
  pipeline: PipelineResponse;
  growth: GrowthResponse;
}

interface HeadlineMetric {
  total: number;
  granularity: Granularity;
  buckets: ChartBucket[];
}

interface Headline {
  revenue: HeadlineMetric;
  transactions: HeadlineMetric;
}

const Card = styled.div`
  background: white;
  padding: 1.75rem 2rem;
  border-radius: 16px;
  border: 1px solid #eef1f5;
  box-shadow: 0 1px 3px rgba(16, 30, 54, 0.05);
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const SectionLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const HeadlineBand = styled.div<{ $dimmed: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eef1f5;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }
`;

const TileGrid = styled.div<{ $dimmed: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.25rem;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;

  /* A 160px floor can't shrink to fit a phone, so the tracks are pinned to two
     columns that may go narrower than their content and wrap the long labels. */
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
`;

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-left: 1.25rem;
  border-left: 1px solid #eef1f5;

  &:first-child {
    padding-left: 0;
    border-left: none;
  }

  /* Once the grid wraps, the per-row first tile keeps a divider it shouldn't have,
     so the rule is dropped at the width where wrapping starts. */
  @media (max-width: 1100px) {
    padding-left: 0;
    border-left: none;
  }
`;

const TileLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Proportional figures (no tabular-nums): at this size tabular digits read loose.
const TileValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
  line-height: 1.1;
  letter-spacing: -0.01em;
`;

// Larger than the funnel tiles so the two money figures lead the card.
const HeadlineValue = styled(TileValue)`
  font-size: 2.5rem;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const TileFooter = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
  min-height: 1.1rem;
`;

// Direction is carried by the arrow glyph as well as the color, so the chip still
// reads for the red/green colorblind case.
const Delta = styled.span<{ $direction: "up" | "down" | "flat" }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $direction }) =>
    $direction === "up" ? "#157347" : $direction === "down" ? "#c0392b" : "#5c6b7a"};
`;

const SubText = styled.span`
  font-size: 0.75rem;
  color: #5c6b7a;
`;

const SkeletonValue = styled.div<{ $tall?: boolean }>`
  height: ${({ $tall }) => ($tall ? "2.5rem" : "1.75rem")};
  width: 60%;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Reserves the sparkline's height so the band doesn't jump when the fetch lands.
const SkeletonPlot = styled.div`
  height: 84px;
  margin-top: 0.5rem;
  border-radius: 8px;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

function formatCount(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

// Matches the figure on Reports & Analytics so the same number reads the same in
// both places.
function formatCurrency(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface DeltaInfo {
  direction: "up" | "down" | "flat";
  text: string;
}

// Percent change against the previous window. With no prior activity a percentage
// is meaningless (any increase is infinite), so that case is named instead.
function computeDelta(current: number, previous: number, lang: string): DeltaInfo {
  if (previous === 0) {
    if (current === 0) return { direction: "flat", text: lang === "zh" ? "无变化" : "No change" };
    return { direction: "up", text: lang === "zh" ? "全新" : "New" };
  }
  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(pct));
  if (rounded === 0) return { direction: "flat", text: lang === "zh" ? "持平" : "Flat" };
  const direction = pct > 0 ? "up" : "down";
  return { direction, text: `${direction === "up" ? "▲" : "▼"} ${rounded}%` };
}

interface TileSpec {
  key: string;
  label: string;
  value: number;
  previous: number;
  sub?: string | null;
}

interface DashboardStatsRowProps {
  filter?: ReportFilter;
  /** Hide the revenue/transactions band; the pipeline tiles still show. Off on Reports, where the full charts sit below. */
  showHeadline?: boolean;
  /** Section heading; defaults to "Overview" */
  title?: string;
}

export default function DashboardStatsRow({ filter, showHeadline = true, title }: DashboardStatsRowProps = {}) {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>("30d");
  const [headline, setHeadline] = useState<Headline | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const headlineCache = useRef<Record<string, Headline>>({});
  const funnelCache = useRef<Record<string, Funnel>>({});
  const key = `${period}|${filter?.team_id ?? ""}|${filter?.owner_user_id ?? ""}`;

  useEffect(() => {
    if (!token) return;

    const cachedHeadline = headlineCache.current[key];
    const cachedFunnel = funnelCache.current[key];
    if (cachedHeadline && cachedFunnel) {
      setHeadline(cachedHeadline);
      setFunnel(cachedFunnel);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const post = (path: string, extra: Record<string, unknown> = {}) =>
      axios.post(path, { token, period, ...filter, ...extra }).then((res) => {
        if (res.data?.status_code !== 200) throw new Error(res.data?.message || "request failed");
        return res.data;
      });

    // allSettled, not all: the two bands fail independently, so a broken revenue
    // call still leaves the funnel counts on screen.
    // Without the headline band there is no reason to fetch the two heavier revenue calls
    const skip = () => Promise.reject(new Error("skipped"));
    Promise.allSettled([
      showHeadline ? post("/api/reports/revenue-summary") : skip(),
      showHeadline ? post("/api/reports/transactions-summary") : skip(),
      post("/api/reports/pipeline-summary"),
      // Active businesses get their own window on the backend; matching it to the
      // toggle keeps every tile describing the same stretch of time.
      post("/api/reports/growth-summary", { active_period: period }),
    ])
      .then(([revenueRes, transactionsRes, pipelineRes, growthRes]) => {
        if (cancelled) return;

        if (revenueRes.status === "fulfilled" && transactionsRes.status === "fulfilled") {
          const revenue = revenueRes.value as RevenueResponse;
          const transactions = transactionsRes.value as TransactionsResponse;
          const next: Headline = {
            revenue: {
              total: revenue.total,
              granularity: revenue.granularity,
              buckets: (revenue.series ?? []).map((s) => ({ date: s.date, value: s.amount })),
            },
            transactions: {
              total: transactions.total,
              granularity: transactions.granularity,
              buckets: (transactions.daily ?? []).map((d) => ({ date: d.date, value: d.count })),
            },
          };
          headlineCache.current[key] = next;
          setHeadline(next);
        } else {
          setHeadline(null);
        }

        if (pipelineRes.status === "fulfilled" && growthRes.status === "fulfilled") {
          const next: Funnel = {
            pipeline: pipelineRes.value as PipelineResponse,
            growth: growthRes.value as GrowthResponse,
          };
          funnelCache.current[key] = next;
          setFunnel(next);
        } else {
          setFunnel(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, period, key, showHeadline]);

  const headlineDimmed = showHeadline && loading && !headlineCache.current[key];
  const funnelDimmed = loading && !funnelCache.current[key];

  // Matches the summary cards on Reports: a failed panel leaves the page alone
  // rather than showing a broken shell.
  if (!loading && !headline && !funnel) return null;

  const winRate = funnel?.pipeline.quotes_accepted.win_rate;

  const tiles: TileSpec[] = [
    {
      key: "inquiries",
      label: lang === "zh" ? "咨询" : "Inquiries",
      value: funnel?.pipeline.inquiries.total ?? 0,
      previous: funnel?.pipeline.inquiries.previous ?? 0,
    },
    {
      key: "quotes_sent",
      label: lang === "zh" ? "已发送报价" : "Quotes sent",
      value: funnel?.pipeline.quotes_sent.total ?? 0,
      previous: funnel?.pipeline.quotes_sent.previous ?? 0,
    },
    {
      key: "quotes_accepted",
      label: lang === "zh" ? "已接受报价" : "Quotes accepted",
      value: funnel?.pipeline.quotes_accepted.total ?? 0,
      previous: funnel?.pipeline.quotes_accepted.previous ?? 0,
      sub:
        winRate !== null && winRate !== undefined
          ? `${winRate}% ${lang === "zh" ? "成交率" : "win rate"}`
          : null,
    },
    {
      key: "registrations",
      label: lang === "zh" ? "已批准注册" : "Registrations approved",
      value: funnel?.pipeline.registrations_approved.total ?? 0,
      previous: funnel?.pipeline.registrations_approved.previous ?? 0,
    },
    {
      key: "new_businesses",
      label: lang === "zh" ? "新增商户" : "New businesses",
      value: funnel?.growth.new_businesses.total ?? 0,
      previous: funnel?.growth.new_businesses.previous ?? 0,
    },
    {
      key: "active_businesses",
      label: lang === "zh" ? "活跃商户" : "Active businesses",
      value: funnel?.growth.active_businesses.total ?? 0,
      previous: funnel?.growth.active_businesses.previous ?? 0,
      sub: funnel
        ? `${lang === "zh" ? "共" : "of"} ${formatCount(funnel.growth.active_businesses.business_count)}`
        : null,
    },
  ];

  return (
    <Card>
      <TopRow>
        <SectionLabel>{title ?? (lang === "zh" ? "概览" : "Overview")}</SectionLabel>
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

      {showHeadline && (headline || headlineDimmed) && (
        <HeadlineBand $dimmed={headlineDimmed}>
          <Tile>
            <TileLabel>
              {lang === "zh" ? "已处理收入" : "Total Revenue Processed"}
            </TileLabel>
            {!headline ? (
              <>
                <SkeletonValue $tall />
                <SkeletonPlot />
              </>
            ) : (
              <>
                <HeadlineValue>{formatCurrency(headline.revenue.total)}</HeadlineValue>
                <Sparkline
                  gradientId="dash-rev"
                  data={headline.revenue.buckets}
                  granularity={headline.revenue.granularity}
                  lang={lang}
                  formatValue={formatCurrency}
                />
              </>
            )}
          </Tile>
          <Tile>
            <TileLabel>
              {lang === "zh" ? "已处理交易数" : "Transactions Processed"}
            </TileLabel>
            {!headline ? (
              <>
                <SkeletonValue $tall />
                <SkeletonPlot />
              </>
            ) : (
              <>
                <HeadlineValue>
                  {headline.transactions.total.toLocaleString()}
                </HeadlineValue>
                <Sparkline
                  gradientId="dash-txn"
                  data={headline.transactions.buckets}
                  granularity={headline.transactions.granularity}
                  lang={lang}
                  formatValue={(n) => n.toLocaleString()}
                />
              </>
            )}
          </Tile>
        </HeadlineBand>
      )}

      {(funnel || funnelDimmed) && (
        <TileGrid $dimmed={funnelDimmed}>
          {tiles.map((tile) => {
            const delta = computeDelta(tile.value, tile.previous, lang);
            return (
              <Tile key={tile.key}>
                <TileLabel>{tile.label}</TileLabel>
                {!funnel ? (
                  <SkeletonValue />
                ) : (
                  <TileValue>{formatCount(tile.value)}</TileValue>
                )}
                <TileFooter>
                  {funnel && (
                    <>
                      <Delta $direction={delta.direction}>{delta.text}</Delta>
                      {tile.sub && <SubText>{tile.sub}</SubText>}
                    </>
                  )}
                </TileFooter>
              </Tile>
            );
          })}
        </TileGrid>
      )}
    </Card>
  );
}
