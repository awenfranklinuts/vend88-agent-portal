"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Period } from "./PeriodToggle";

interface CountSeries {
  total: number;
  previous: number;
  series: { date: string; count: number }[];
}

interface GrowthResponse {
  status_code: number;
  new_businesses: CountSeries;
  new_shops: CountSeries;
  active_businesses: { period: Period; total: number; previous: number; business_count: number };
  average_transaction_value: { value: number; previous: number; orders: number };
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Tile = styled.div<{ $dimmed: boolean }>`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  border: 1px solid #eef1f5;
  box-shadow: 0 1px 3px rgba(16, 30, 54, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 150px;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.45 : 1)};
  transition: opacity 0.2s ease;
`;

const Label = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Value = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0a3655;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
`;

const Sub = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
`;

const Change = styled.div<{ $tone: "up" | "down" | "flat" }>`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ $tone }) => ($tone === "up" ? "#047857" : $tone === "down" ? "#b91c1c" : "#5c6b7a")};
  margin-top: auto;
`;

const Spark = styled.svg`
  width: 100%;
  height: 32px;
  display: block;
`;

const formatCurrency = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Tiny trend line; decorative, the numbers carry the meaning */
function Sparkline({ values, id }: { values: number[]; id: string }) {
  if (values.length < 2) return null;
  const width = 200;
  const height = 32;
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => [(i / (values.length - 1)) * width, height - 2 - (v / max) * (height - 4)]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <Spark viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00c2e0" />
          <stop offset="100%" stopColor="#1a237e" />
        </linearGradient>
      </defs>
      <path d={line} fill="none" stroke={`url(#${id})`} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </Spark>
  );
}

interface Props {
  period?: Period;
  /** Window for the Active Businesses tile only */
  activePeriod?: Period;
}

/** New businesses, new stores, active businesses and average sale, each compared with the previous period */
export default function GrowthSummaryRow({ period = "30d", activePeriod = "7d" }: Props) {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [data, setData] = useState<GrowthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    axios
      .post("/api/reports/growth-summary", { token, period, active_period: activePeriod })
      .then(res => {
        if (cancelled) return;
        if (res.data?.status_code === 200) setData(res.data);
        else setError(true);
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, period, activePeriod]);

  if (error) return null;

  const previousText = (p: Period) => p === "30d" ? (zh ? "上一个30天" : "previous 30 days")
    : p === "7d" ? (zh ? "上一个7天" : "previous 7 days")
    : (zh ? "昨天" : "yesterday");
  const periodText = previousText(period);

  const countChange = (current: number, previous: number, comparedWith = periodText) => {
    const diff = current - previous;
    const tone = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
    const text = diff === 0
      ? (zh ? `与${comparedWith}持平` : `Same as ${comparedWith}`)
      : `${diff > 0 ? "▲" : "▼"} ${Math.abs(diff).toLocaleString()} ${zh ? `对比${comparedWith}` : `vs ${comparedWith}`}`;
    return { tone, text } as const;
  };

  const percentChange = (current: number, previous: number) => {
    if (previous <= 0) return { tone: "flat", text: zh ? `${periodText}无数据` : `No data for ${periodText}` } as const;
    const pct = ((current - previous) / previous) * 100;
    const rounded = Math.abs(pct) < 0.05 ? 0 : pct;
    const tone = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
    const text = rounded === 0
      ? (zh ? `与${periodText}持平` : `Same as ${periodText}`)
      : `${rounded > 0 ? "▲" : "▼"} ${Math.abs(rounded).toFixed(1)}% ${zh ? `对比${periodText}` : `vs ${periodText}`}`;
    return { tone, text } as const;
  };

  const dimmed = loading && !data;
  const nb = data?.new_businesses;
  const ns = data?.new_shops;
  const active = data?.active_businesses;
  const atv = data?.average_transaction_value;

  const tiles = [
    {
      key: "new-businesses",
      label: zh ? "新增商户" : "New Businesses",
      value: nb ? nb.total.toLocaleString() : "—",
      change: nb && countChange(nb.total, nb.previous),
      spark: nb?.series.map(s => s.count),
    },
    {
      key: "new-stores",
      label: zh ? "新增门店" : "New Stores",
      value: ns ? ns.total.toLocaleString() : "—",
      change: ns && countChange(ns.total, ns.previous),
      spark: ns?.series.map(s => s.count),
    },
    {
      key: "active-businesses",
      label: zh ? "活跃商户" : "Active Businesses",
      value: active ? active.total.toLocaleString() : "—",
      sub: active && (zh
        ? `${activePeriod === "7d" ? "近7天" : activePeriod === "30d" ? "近30天" : "今天"}有销售，共 ${active.business_count.toLocaleString()} 个商户`
        : `with sales ${activePeriod === "7d" ? "in the last 7 days" : activePeriod === "30d" ? "in the last 30 days" : "today"}, of ${active.business_count.toLocaleString()}`),
      change: active && countChange(active.total, active.previous, previousText(activePeriod)),
    },
    {
      key: "average-sale",
      label: zh ? "平均交易额" : "Average Transaction",
      value: atv ? formatCurrency(atv.value) : "—",
      sub: atv && (zh ? `基于 ${atv.orders.toLocaleString()} 笔已付款订单` : `across ${atv.orders.toLocaleString()} paid orders`),
      change: atv && percentChange(atv.value, atv.previous),
    },
  ];

  return (
    <Row>
      {tiles.map(tile => (
        <Tile key={tile.key} $dimmed={dimmed}>
          <Label>{tile.label}</Label>
          <Value>{tile.value}</Value>
          {tile.sub && <Sub>{tile.sub}</Sub>}
          {tile.spark && <Sparkline values={tile.spark} id={`spark-${tile.key}`} />}
          {tile.change && <Change $tone={tile.change.tone}>{tile.change.text}</Change>}
        </Tile>
      ))}
    </Row>
  );
}
