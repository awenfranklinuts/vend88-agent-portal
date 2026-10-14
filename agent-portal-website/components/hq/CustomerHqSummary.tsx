"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

// A customer's HQ accounts, for Customer Management: a compact block on the
// customer card and a fuller one on the customer's page. Each HQ links to its
// page in HQ Management. Fed from /api/hq/list, filtered to the customer.
export interface CustomerHq {
  hq_id: string;
  name: string;
  customer_id: string | null;
  username: string;
  store_count: number;
  store_names: string[];
  own_business: { business_id: string; name: string; warehouse_only: boolean } | null;
  created_at: string | null;
}

/** The HQs of one customer, from a /api/hq/list response */
export const hqsForCustomer = (hqs: CustomerHq[], customerId: string) =>
  hqs.filter((h) => String(h.customer_id) === String(customerId));

const BuildingIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
    <path d="M10 21v-4h4v4" />
  </svg>
);

/* ─── Compact: on the customer card ─── */

const CompactWrap = styled.div`
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const Title = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0a3655;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
`;

const CompactRow = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid rgba(26, 35, 126, 0.15);
  border-radius: 6px;
  background: rgba(26, 35, 126, 0.05);
  color: #1a237e;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  margin-bottom: 0.375rem;
  &:hover { background: rgba(26, 35, 126, 0.1); }
  span.name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  span.meta { font-size: 0.75rem; font-weight: 500; color: #5c6b7a; flex-shrink: 0; }
`;

export function CustomerHqCompact({ hqs }: { hqs: CustomerHq[] }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  if (!hqs.length) return null;
  return (
    <CompactWrap>
      <Title>{zh ? "总部账户" : "HQ account"}</Title>
      {hqs.map((h) => (
        <CompactRow
          key={h.hq_id}
          type="button"
          onClick={(e) => { e.stopPropagation(); router.push(`/admin/hq/${h.hq_id}`); }}
          title={zh ? "打开总部" : "Open HQ"}
        >
          <BuildingIcon />
          <span className="name">{h.name}</span>
          <span className="meta">{zh ? `${h.store_count} 家店铺` : `${h.store_count} ${h.store_count === 1 ? "store" : "stores"}`}</span>
        </CompactRow>
      ))}
    </CompactWrap>
  );
}

/* ─── Full: on the customer's page ─── */

const Card = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 1.25rem;
  border: 2px solid rgba(26, 35, 126, 0.12);
  border-radius: 12px;
  background: #f7faff;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
  &:hover { border-color: rgba(59, 130, 246, 0.5); transform: translateY(-1px); }
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.875rem;
  color: #1a237e;
  h3 { flex: 1; font-size: 1.0625rem; font-weight: 700; color: #0a3655; margin: 0; }
  span.open { font-size: 0.8125rem; font-weight: 600; color: #3b82f6; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.875rem;
`;

const Label = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 0.9375rem;
  color: #0a3655;
  font-weight: 500;
  word-break: break-word;
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.875rem; }
`;

const Muted = styled.span`
  color: #9ca3af;
  font-weight: 400;
`;

export function CustomerHqDetail({ hqs }: { hqs: CustomerHq[] }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  if (!hqs.length) return null;
  return (
    <>
      {hqs.map((h) => (
        <Card key={h.hq_id} type="button" onClick={() => router.push(`/admin/hq/${h.hq_id}`)}>
          <CardHead>
            <BuildingIcon size={20} />
            <h3>{h.name}</h3>
            <span className="open">{zh ? "打开 →" : "Open →"}</span>
          </CardHead>
          <Grid>
            <div>
              <Label>{zh ? "总部登录" : "HQ login"}</Label>
              <Value>{h.username ? <code>{h.username}</code> : <Muted>{zh ? "未设置" : "Not set"}</Muted>}</Value>
            </div>
            <div>
              <Label>{zh ? "总部仓库" : "Head office"}</Label>
              <Value>
                {h.own_business
                  ? `${h.own_business.name}${h.own_business.warehouse_only ? (zh ? "（仅仓库）" : " (warehouse)") : ""}`
                  : <Muted>{zh ? "未设置" : "None"}</Muted>}
              </Value>
            </div>
            <div>
              <Label>{zh ? `店铺（${h.store_count}）` : `Stores (${h.store_count})`}</Label>
              <Value>{h.store_names.length ? h.store_names.join(", ") : <Muted>{zh ? "尚未加入店铺" : "None yet"}</Muted>}</Value>
            </div>
            <div>
              <Label>{zh ? "创建" : "Created"}</Label>
              <Value>{h.created_at ? new Date(h.created_at).toLocaleDateString() : <Muted>—</Muted>}</Value>
            </div>
          </Grid>
        </Card>
      ))}
    </>
  );
}
