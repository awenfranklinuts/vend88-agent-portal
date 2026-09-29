"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import PeriodToggle, { type Period } from "./PeriodToggle";
import type { ReportFilter } from "./TransactionsSummaryCard";

/* ─── Data ─── */

type Health = "active" | "quiet" | "inactive" | "never";
type RiskReason = "no_recent_orders" | "revenue_drop";

interface StoreRow {
  shop_id: string;
  business_id: string | null;
  name: string;
  /** Street address; empty when the store has none on file */
  address: string;
  /** The store's status, else its business's (as Store Management shows it); null when neither is set */
  status: string | null;
  revenue: number;
  orders: number;
  avg_order: number;
  previous_revenue: number | null;
  change_pct: number | null;
  last_order_at: string | null;
  days_since_last_order: number | null;
  health: Health;
  at_risk: boolean;
  risk_reasons: RiskReason[];
}

interface PerformanceResponse {
  status_code: number;
  period: Period;
  thresholds: { quiet_days: number; inactive_days: number; drop_pct: number };
  health: Record<Health, number>;
  hidden_no_status: number;
  total_revenue: number;
  stores: StoreRow[];
}

type View = "all" | "at_risk" | Health;
type SortKey = "revenue" | "orders" | "avg_order" | "change_pct" | "days_since_last_order";

// Status colours (validated as a set: lightness, colour-blind separation and
// normal-vision separation all pass). "Never traded" is deliberately a neutral
// grey - it is an absence, not a fourth state to compare against the others.
const HEALTH: Record<Health, { color: string; en: string; zh: string; hint_en: string; hint_zh: string }> = {
  active: { color: "#15803d", en: "Active", zh: "活跃", hint_en: "Ordered in the last 7 days", hint_zh: "最近7天内有订单" },
  quiet: { color: "#f59e0b", en: "Quiet", zh: "冷清", hint_en: "Last order 7–30 days ago", hint_zh: "最后订单在7–30天前" },
  inactive: { color: "#b91c1c", en: "Inactive", zh: "不活跃", hint_en: "No orders for over 30 days", hint_zh: "超过30天没有订单" },
  never: { color: "#cbd5e1", en: "Never traded", zh: "从未交易", hint_en: "No orders recorded yet", hint_zh: "尚无订单记录" },
};
const HEALTH_ORDER: Health[] = ["active", "quiet", "inactive", "never"];

const PAGE_SIZE = 10;

// Same labels and badge colours as Store Management's status column
const STATUS_BADGE: Record<string, { en: string; zh: string; bg: string; fg: string }> = {
  active: { en: "Active", zh: "活跃", bg: "#d1fae5", fg: "#065f46" },
  setup: { en: "In Setup", zh: "设置中", bg: "#dbeafe", fg: "#1e40af" },
  test: { en: "Test", zh: "测试", bg: "#fef3c7", fg: "#92400e" },
  inactive: { en: "Inactive", zh: "非活跃", bg: "#fee2e2", fg: "#991b1b" },
  suspended: { en: "Suspended", zh: "已暂停", bg: "#fecaca", fg: "#7f1d1d" },
};

const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ─── Styles ─── */

const Card = styled.div`
  background: white;
  padding: 1.75rem 2rem;
  border-radius: 16px;
  border: 1px solid #eef1f5;
  box-shadow: 0 1px 3px rgba(16, 30, 54, 0.05);
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    padding: 1.25rem;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`;

const Label = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #8a94a3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.4rem;
`;

const Sub = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const HealthBar = styled.div`
  display: flex;
  gap: 2px;
  height: 14px;
  margin-bottom: 0.5rem;
`;

const HealthSegment = styled.button<{ $color: string; $dim: boolean }>`
  border: none;
  padding: 0;
  background: ${p => p.$color};
  opacity: ${p => (p.$dim ? 0.3 : 1)};
  cursor: pointer;
  transition: opacity 0.15s ease;
  min-width: 6px;
  &:first-child { border-radius: 4px 0 0 4px; }
  &:last-child { border-radius: 0 4px 4px 0; }
  &:only-child { border-radius: 4px; }
`;

const HoverLine = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
  min-height: 1.25rem;
  margin-bottom: 0.75rem;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const Chip = styled.button<{ $active: boolean; $risk?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  border: 1.5px solid ${p => (p.$active ? "#1a237e" : p.$risk ? "#fecaca" : "#e0e7ef")};
  background: ${p => (p.$active ? "#1a237e" : p.$risk ? "#fef2f2" : "white")};
  color: ${p => (p.$active ? "white" : "#0a3655")};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { border-color: #1a237e; }
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

const RiskPanel = styled.div`
  border: 1px solid #fecaca;
  background: #fef2f2;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
`;

const RiskTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #991b1b;
  margin-bottom: 0.5rem;
`;

const RiskList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.375rem 1.5rem;
`;

const RiskItem = styled.li`
  font-size: 0.8125rem;
  color: #0a3655;
  button {
    border: none;
    background: none;
    padding: 0;
    font: inherit;
    font-weight: 600;
    color: #0a3655;
    cursor: pointer;
    text-align: left;
    &:hover { text-decoration: underline; }
  }
  span { color: #5c6b7a; }
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  min-width: 940px;
`;

const Th = styled.th<{ $align?: "right"; $sortable?: boolean; $sorted?: boolean }>`
  text-align: ${p => p.$align || "left"};
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid #e0e7ef;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${p => (p.$sorted ? "#1a237e" : "#5c6b7a")};
  white-space: nowrap;
  cursor: ${p => (p.$sortable ? "pointer" : "default")};
  user-select: none;
`;

const Tr = styled.tr<{ $clickable: boolean }>`
  cursor: ${p => (p.$clickable ? "pointer" : "default")};
  &:hover td { background: ${p => (p.$clickable ? "#f7faff" : "transparent")}; }
`;

const Td = styled.td<{ $align?: "right"; $muted?: boolean }>`
  padding: 0.75rem;
  border-bottom: 1px solid #eef2f7;
  text-align: ${p => p.$align || "left"};
  color: ${p => (p.$muted ? "#9ca3af" : "#0a3655")};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const StoreName = styled.div`
  font-weight: 600;
  white-space: normal;
`;

const StoreAddress = styled.div<{ $missing: boolean }>`
  font-size: 0.75rem;
  color: ${p => (p.$missing ? "#b0b7c3" : "#6b7280")};
  font-style: ${p => (p.$missing ? "italic" : "normal")};
  white-space: normal;
`;

const Change = styled.span<{ $dir: "up" | "down" | "flat" }>`
  font-weight: 600;
  color: ${p => (p.$dir === "up" ? "#15803d" : p.$dir === "down" ? "#b91c1c" : "#6b7280")};
`;

const HealthBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: #0a3655;
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${p => p.$color};
  }
`;

const RiskTag = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: #6b7280;
  flex-wrap: wrap;
`;

const LinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: #1273eb;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const StatusBadge = styled.span<{ $bg: string; $fg: string }>`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${p => p.$bg};
  color: ${p => p.$fg};
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  font-size: 0.8125rem;
  color: #5c6b7a;
  cursor: pointer;
  input { accent-color: #1a237e; cursor: pointer; }
`;

const Empty = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

/* ─── Component ─── */

const filterKey = (period: string, filter: ReportFilter | undefined, includeNoStatus: boolean) =>
  `${period}|${filter?.team_id ?? ""}|${filter?.owner_user_id ?? ""}|${includeNoStatus ? 1 : 0}`;

export default function StorePerformanceCard({ filter }: { filter?: ReportFilter } = {}) {
  const router = useRouter();
  const { token } = useAuth();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [period, setPeriod] = useState<Period>("30d");
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>("all");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "revenue", desc: true });
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState<Health | null>(null);
  // Off by default, like Store Management's "Include accounts with no status"
  const [includeNoStatus, setIncludeNoStatus] = useState(false);
  const cacheRef = useRef<Record<string, PerformanceResponse>>({});
  const key = filterKey(period, filter, includeNoStatus);

  useEffect(() => {
    if (!token) return;
    const cached = cacheRef.current[key];
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    axios
      .post("/api/reports/store-performance", { token, period, include_no_status: includeNoStatus, ...filter })
      .then((res) => {
        if (cancelled) return;
        if (res.data?.status_code === 200) {
          cacheRef.current[key] = res.data;
          setData(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, key]);

  // A new filter or period is a new list - start again from the top
  useEffect(() => { setShowAll(false); }, [key, view]);

  const stores = data?.stores ?? [];
  const atRisk = stores.filter(s => s.at_risk);
  const total = stores.length;

  const visible = useMemo(() => {
    const rows = stores.filter(s => view === "all" ? true : view === "at_risk" ? s.at_risk : s.health === view);
    // Missing values (no previous period, never ordered) always sort last,
    // whichever way the column is sorted
    const val = (s: StoreRow) => s[sort.key];
    return [...rows].sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return sort.desc ? (vb as number) - (va as number) : (va as number) - (vb as number);
    });
  }, [stores, view, sort]);

  const shown = showAll ? visible : visible.slice(0, PAGE_SIZE);

  const toggleSort = (k: SortKey) =>
    setSort(prev => (prev.key === k ? { key: k, desc: !prev.desc } : { key: k, desc: k !== "days_since_last_order" }));

  const riskText = (s: StoreRow) =>
    s.risk_reasons
      .map(r => r === "revenue_drop"
        ? (zh ? `收入下降 ${Math.abs(Math.round(s.change_pct || 0))}%` : `revenue down ${Math.abs(Math.round(s.change_pct || 0))}%`)
        : (zh ? `${s.days_since_last_order} 天无订单` : `no orders for ${s.days_since_last_order} days`))
      .join(zh ? "，" : ", ");

  const lastOrderText = (s: StoreRow) => {
    if (s.days_since_last_order === null) return zh ? "从未" : "Never";
    if (s.days_since_last_order === 0) return zh ? "今天" : "Today";
    if (s.days_since_last_order === 1) return zh ? "昨天" : "Yesterday";
    return zh ? `${s.days_since_last_order} 天前` : `${s.days_since_last_order} days ago`;
  };

  const openStore = (s: StoreRow) => { if (s.business_id) router.push(`/admin/businesses/${s.business_id}`); };

  if (error) return null;

  const sortArrow = (k: SortKey) => (sort.key === k ? (sort.desc ? " ↓" : " ↑") : "");
  const periodHasPrevious = period !== "all";

  return (
    <Card style={{ opacity: loading && !data ? 0.5 : 1 }}>
      <TopRow>
        <div>
          <Label>{zh ? "店铺表现" : "Store performance"}</Label>
          <Sub>
            {zh
              ? `${total} 家店铺 · 收入合计 ${money(data?.total_revenue ?? 0)}`
              : `${total} stores · ${money(data?.total_revenue ?? 0)} total revenue`}
            {!!data?.hidden_no_status && (
              <> · {zh ? `已隐藏 ${data.hidden_no_status} 家无状态账户` : `${data.hidden_no_status} without a status hidden`}</>
            )}
          </Sub>
        </div>
        <PeriodToggle
          period={period}
          onChange={setPeriod}
          options={[
            { value: "all", label: zh ? "全部" : "All time" },
            { value: "1y", label: zh ? "近1年" : "1 year" },
            { value: "30d", label: zh ? "近30天" : "30 days" },
            { value: "7d", label: zh ? "近7天" : "7 days" },
            { value: "today", label: zh ? "今天" : "Today" },
          ]}
        />
      </TopRow>

      {data && total > 0 && (
        <>
          {/* Store health: one bar split by how recently each store last took an order */}
          <HealthBar role="img" aria-label={HEALTH_ORDER.map(h => `${HEALTH[h][lang]} ${data.health[h]}`).join(", ")}>
            {HEALTH_ORDER.filter(h => data.health[h] > 0).map(h => (
              <HealthSegment
                key={h}
                type="button"
                $color={HEALTH[h].color}
                $dim={(hovered !== null && hovered !== h) || (HEALTH_ORDER.includes(view as Health) && view !== h)}
                style={{ flex: data.health[h] }}
                onMouseEnter={() => setHovered(h)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(h)}
                onBlur={() => setHovered(null)}
                onClick={() => setView(view === h ? "all" : h)}
                aria-label={`${HEALTH[h][lang]}: ${data.health[h]}`}
              />
            ))}
          </HealthBar>
          <HoverLine>
            {hovered
              ? `${HEALTH[hovered][lang]} · ${data.health[hovered]} ${zh ? "家店铺" : data.health[hovered] === 1 ? "store" : "stores"} (${Math.round((data.health[hovered] / total) * 100)}%) · ${zh ? HEALTH[hovered].hint_zh : HEALTH[hovered].hint_en}`
              : (zh ? "悬停查看详情，点击筛选" : "Hover a segment for details, click to filter")}
          </HoverLine>

          <Chips>
            <Chip $active={view === "all"} onClick={() => setView("all")}>
              {zh ? "全部" : "All stores"} ({total})
            </Chip>
            <Chip $active={view === "at_risk"} $risk={atRisk.length > 0} onClick={() => setView("at_risk")}>
              ⚠ {zh ? "有风险" : "At risk"} ({atRisk.length})
            </Chip>
            {HEALTH_ORDER.map(h => (
              <Chip key={h} $active={view === h} onClick={() => setView(view === h ? "all" : h)} title={zh ? HEALTH[h].hint_zh : HEALTH[h].hint_en}>
                <Dot $color={HEALTH[h].color} />
                {HEALTH[h][lang]} ({data.health[h]})
              </Chip>
            ))}
            <CheckboxLabel>
              <input type="checkbox" checked={includeNoStatus} onChange={e => setIncludeNoStatus(e.target.checked)} />
              {zh ? "包含无状态账户" : "Include accounts with no status"}
            </CheckboxLabel>
          </Chips>

          {atRisk.length > 0 && view !== "at_risk" && (
            <RiskPanel>
              <RiskTitle>
                ⚠ {zh ? `${atRisk.length} 家店铺需要关注` : `${atRisk.length} ${atRisk.length === 1 ? "store needs" : "stores need"} attention`}
              </RiskTitle>
              <RiskList>
                {atRisk.slice(0, 6).map(s => (
                  <RiskItem key={s.shop_id}>
                    <button onClick={() => openStore(s)}>{s.name}</button> <span>- {riskText(s)}</span>
                  </RiskItem>
                ))}
              </RiskList>
              {atRisk.length > 6 && (
                <LinkButton style={{ marginTop: "0.5rem" }} onClick={() => setView("at_risk")}>
                  {zh ? `查看全部 ${atRisk.length} 家` : `See all ${atRisk.length}`}
                </LinkButton>
              )}
            </RiskPanel>
          )}
        </>
      )}

      {data && visible.length === 0 ? (
        <Empty>{zh ? "没有符合条件的店铺" : "No stores match this view"}</Empty>
      ) : data ? (
        <>
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>{zh ? "店铺" : "Store"}</Th>
                  <Th $align="right" $sortable $sorted={sort.key === "revenue"} onClick={() => toggleSort("revenue")}>{zh ? "收入" : "Revenue"}{sortArrow("revenue")}</Th>
                  <Th $align="right" $sortable $sorted={sort.key === "orders"} onClick={() => toggleSort("orders")}>{zh ? "订单" : "Orders"}{sortArrow("orders")}</Th>
                  <Th $align="right" $sortable $sorted={sort.key === "avg_order"} onClick={() => toggleSort("avg_order")}>{zh ? "客单价" : "Avg order"}{sortArrow("avg_order")}</Th>
                  <Th $align="right" $sortable $sorted={sort.key === "change_pct"} onClick={() => toggleSort("change_pct")}>{zh ? "较上期" : "vs previous"}{sortArrow("change_pct")}</Th>
                  <Th $sortable $sorted={sort.key === "days_since_last_order"} onClick={() => toggleSort("days_since_last_order")}>{zh ? "最后订单" : "Last order"}{sortArrow("days_since_last_order")}</Th>
                  <Th>{zh ? "账户状态" : "Status"}</Th>
                  <Th>{zh ? "交易健康度" : "Health"}</Th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s, i) => {
                  const dir = s.change_pct === null ? "flat" : s.change_pct > 0 ? "up" : s.change_pct < 0 ? "down" : "flat";
                  return (
                    <Tr key={s.shop_id} $clickable={!!s.business_id} onClick={() => openStore(s)}>
                      <Td $muted>{i + 1}</Td>
                      <Td>
                        <StoreName>{s.name}</StoreName>
                        <StoreAddress $missing={!s.address}>{s.address || (zh ? "未设置地址" : "No address set")}</StoreAddress>
                      </Td>
                      <Td $align="right" $muted={s.revenue === 0}>{money(s.revenue)}</Td>
                      <Td $align="right" $muted={s.orders === 0}>{s.orders.toLocaleString()}</Td>
                      <Td $align="right" $muted={s.orders === 0}>{s.orders ? money(s.avg_order) : "—"}</Td>
                      <Td $align="right">
                        {!periodHasPrevious || s.change_pct === null ? (
                          <Change $dir="flat" title={periodHasPrevious && s.previous_revenue === 0 && s.revenue > 0 ? (zh ? "上期无收入" : "No revenue in the previous period") : undefined}>
                            {periodHasPrevious && s.previous_revenue === 0 && s.revenue > 0 ? (zh ? "新" : "New") : "—"}
                          </Change>
                        ) : (
                          <Change $dir={dir}>
                            {dir === "up" ? "▲" : dir === "down" ? "▼" : ""} {Math.abs(s.change_pct).toFixed(Math.abs(s.change_pct) < 10 ? 1 : 0)}%
                          </Change>
                        )}
                      </Td>
                      <Td $muted={s.days_since_last_order === null}>{lastOrderText(s)}</Td>
                      <Td>
                        {s.status ? (
                          <StatusBadge $bg={(STATUS_BADGE[s.status] || { bg: "#e5e7eb" }).bg} $fg={(STATUS_BADGE[s.status] || { fg: "#374151" }).fg}>
                            {STATUS_BADGE[s.status]?.[lang] || s.status}
                          </StatusBadge>
                        ) : (
                          <span style={{ color: "#b0b7c3" }}>—</span>
                        )}
                      </Td>
                      <Td>
                        <HealthBadge $color={HEALTH[s.health].color}>{HEALTH[s.health][lang]}</HealthBadge>
                        {s.at_risk && <RiskTag title={riskText(s)}>{zh ? "有风险" : "At risk"}</RiskTag>}
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableScroll>
          <Footer>
            <span>
              {zh
                ? "收入按已付款订单计算（已扣除退款）。点击店铺查看详情。"
                : "Revenue counts paid orders, net of refunds. Click a store to open it."}
            </span>
            {visible.length > PAGE_SIZE && (
              <LinkButton onClick={() => setShowAll(v => !v)}>
                {showAll
                  ? (zh ? "收起" : "Show fewer")
                  : (zh ? `显示全部 ${visible.length} 家` : `Show all ${visible.length}`)}
              </LinkButton>
            )}
          </Footer>
        </>
      ) : null}
    </Card>
  );
}
