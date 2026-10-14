"use client";

import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";

// What /api/hq/options returns for one customer: the stores that could join
// an HQ, each with the reason it can't when it can't. Shared by the create
// form and the detail page's attach.
export interface HqOptions {
  customer: { customer_id: string; name: string; email: string };
  businesses: {
    business_id: string;
    /** The store's name, as Store Management shows it */
    name: string;
    /** The business record behind it, when named differently */
    business_name: string;
    shop_count: number;
    status: string;
    hq_name: string;
    blocked_reason: string | null;
  }[];
}

const List = styled.div`
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const Row = styled.label<{ $disabled: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e7ef;
  cursor: ${p => p.$disabled ? "not-allowed" : "pointer"};
  opacity: ${p => p.$disabled ? 0.6 : 1};
  &:last-child { border-bottom: none; }
  &:hover { background: ${p => p.$disabled ? "transparent" : "#f7faff"}; }
  input { margin-top: 0.2rem; }
`;

const Name = styled.div`
  font-weight: 600;
  color: #0a3655;
`;

const Meta = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
`;

const Reason = styled.div`
  font-size: 0.8125rem;
  color: #991b1b;
`;

const Empty = styled.div`
  padding: 1rem;
  font-size: 0.875rem;
  color: #5c6b7a;
`;

// "Business: pospal · 5 stores" - shown only when it adds something to the name
export function StoreMeta({ name, business_name, shop_count }: { name: string; business_name: string; shop_count: number }) {
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const parts = [
    business_name && business_name !== name ? `${zh ? "业务" : "Business"}: ${business_name}` : "",
    shop_count > 1 ? (zh ? `${shop_count} 家门店` : `${shop_count} stores`) : "",
  ].filter(Boolean);
  return parts.length ? <Meta>{parts.join(" · ")}</Meta> : null;
}

export default function HqStorePicker({
  businesses,
  selected,
  onChange,
}: {
  businesses: HqOptions["businesses"];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  return (
    <List>
      {businesses.length === 0 ? (
        <Empty>{zh ? "该客户没有其他可加入的店铺。" : "This customer has no other stores to attach."}</Empty>
      ) : businesses.map(b => {
        const disabled = Boolean(b.blocked_reason);
        return (
          <Row key={b.business_id} $disabled={disabled}>
            <input
              type="checkbox"
              checked={selected.includes(b.business_id)}
              disabled={disabled}
              onChange={() => toggle(b.business_id)}
            />
            <div>
              <Name>{b.name}</Name>
              <StoreMeta business_name={b.business_name} name={b.name} shop_count={b.shop_count} />
              {b.blocked_reason && (
                <Reason>{b.blocked_reason}{b.hq_name ? ` (${b.hq_name})` : ""}</Reason>
              )}
            </div>
          </Row>
        );
      })}
    </List>
  );
}
