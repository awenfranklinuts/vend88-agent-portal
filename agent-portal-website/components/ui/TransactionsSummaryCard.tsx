"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import PeriodToggle, { Period } from "./PeriodToggle";

interface DailyBucket {
  date: string;
  count: number;
}

interface SummaryResponse {
  status_code: number;
  period: Period;
  total: number;
  daily: DailyBucket[];
}

const Card = styled.div`
  background: white;
  padding: 1.75rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
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
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
`;

const Value = styled.div<{ $dimmed: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a3655;
  line-height: 1.1;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

// Grid-rows trick animates from a "0 height" state to auto-sized content
// smoothly, which a plain height/max-height transition can't do cleanly.
const SparkArea = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SparkInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

const Sparkline = styled.div<{ $dimmed: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 48px;
  margin-top: 1.25rem;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

const Bar = styled.div<{ $heightPct: number; $delay: number }>`
  flex: 1;
  height: ${({ $heightPct }) => Math.max($heightPct, 4)}%;
  min-height: 3px;
  background: linear-gradient(180deg, #00eaff 0%, #1a237e 100%);
  border-radius: 4px 4px 2px 2px;
  transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1) ${({ $delay }) => $delay}ms;
`;

const SparklineLabels = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 0.4rem;
`;

const SparklineLabel = styled.div`
  flex: 1;
  text-align: center;
  font-size: 0.6875rem;
  color: #9aa7b5;
`;

function formatDayLabel(dateStr: string, lang: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

export default function TransactionsSummaryCard() {
  const { token } = useAuth();
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>("today");
  const [displayData, setDisplayData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cacheRef = useRef<Partial<Record<Period, SummaryResponse>>>({});

  useEffect(() => {
    if (!token) return;

    // Once a period has been fetched, switching back to it is instant -
    // no reload, no flicker, that's what actually makes the toggle feel smooth.
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
      .post("/api/reports/transactions-summary", { token, period })
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

  if (error) return null;

  const maxCount = displayData?.daily?.length
    ? Math.max(...displayData.daily.map((d) => d.count), 1)
    : 1;
  const showSpark = period === "7d";
  const dimmed = loading && !cacheRef.current[period];

  return (
    <Card>
      <TopRow>
        <div>
          <Label>
            {lang === "zh" ? "已处理交易数" : "Transactions Processed"}
          </Label>
          <Value $dimmed={dimmed}>
            {(displayData?.total ?? 0).toLocaleString()}
          </Value>
        </div>
        <PeriodToggle
          period={period}
          onChange={setPeriod}
          todayLabel={lang === "zh" ? "今天" : "Today"}
          sevenDayLabel={lang === "zh" ? "近7天" : "Last 7 days"}
        />
      </TopRow>

      <SparkArea $open={showSpark}>
        <SparkInner>
          <Sparkline $dimmed={dimmed}>
            {(displayData?.daily?.length ? displayData.daily : Array(7).fill(null)).map(
              (d: DailyBucket | null, i) =>
                d ? (
                  <Bar
                    key={d.date}
                    $heightPct={(d.count / maxCount) * 100}
                    $delay={i * 25}
                    title={`${d.date}: ${d.count.toLocaleString()}`}
                  />
                ) : (
                  <Bar key={i} $heightPct={4} $delay={0} />
                )
            )}
          </Sparkline>
          <SparklineLabels>
            {(displayData?.daily?.length ? displayData.daily : Array(7).fill(null)).map(
              (d: DailyBucket | null, i) => (
                <SparklineLabel key={d?.date ?? i}>
                  {d ? formatDayLabel(d.date, lang) : ""}
                </SparklineLabel>
              )
            )}
          </SparklineLabels>
        </SparkInner>
      </SparkArea>
    </Card>
  );
}
