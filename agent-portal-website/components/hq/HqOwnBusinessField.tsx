"use client";

import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { FormSelect } from "@/components/ui/AdminPageLayout";

// Whether the HQ gets a business of its own - the head office, which can hold
// stock and supply its stores with the same transfers and requests the stores
// use between themselves. "new" makes a warehouse-only business (no POS shop,
// starts with no products); a business id marks one of the HQ's stores as the
// head office; "" leaves the HQ without one.
export type OwnBusinessChoice = "" | "new" | string;

const Option = styled.label<{ $active: boolean }>`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  border: 2px solid ${p => p.$active ? "#3b82f6" : "#e0e7ef"};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  background: ${p => p.$active ? "#f7faff" : "white"};
  input { margin-top: 0.2rem; }
`;

const Title = styled.div`
  font-weight: 600;
  color: #0a3655;
`;

const Desc = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
  margin-top: 0.125rem;
`;

export default function HqOwnBusinessField({
  value,
  onChange,
  stores,
  allowNone = true,
}: {
  value: OwnBusinessChoice;
  onChange: (next: OwnBusinessChoice) => void;
  /** The stores that could act as the head office */
  stores: { business_id: string; name: string }[];
  allowNone?: boolean;
}) {
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const existing = value !== "" && value !== "new";

  return (
    <div style={{ marginBottom: "1rem" }}>
      {allowNone && (
        <Option $active={value === ""}>
          <input type="radio" checked={value === ""} onChange={() => onChange("")} />
          <div>
            <Title>{zh ? "暂不设置" : "Not now"}</Title>
            <Desc>{zh ? "总部只用于组合店铺，之后可随时添加。" : "The HQ only groups its stores. You can add a head office later."}</Desc>
          </div>
        </Option>
      )}
      <Option $active={value === "new"}>
        <input type="radio" checked={value === "new"} onChange={() => onChange("new")} />
        <div>
          <Title>{zh ? "新建总部仓库" : "Create an HQ warehouse"}</Title>
          <Desc>
            {zh
              ? "新建一个仅用于仓储的总部业务，不出现在 POS 中，初始没有商品。可向各店铺调拨库存。"
              : "A new warehouse-only business for the head office. It doesn't appear in the POS and starts with no products. It can supply stock to the stores."}
          </Desc>
        </div>
      </Option>
      <Option $active={existing}>
        <input
          type="radio"
          checked={existing}
          disabled={!stores.length}
          onChange={() => stores[0] && onChange(stores[0].business_id)}
        />
        <div style={{ flex: 1 }}>
          <Title>{zh ? "使用现有店铺作为总部" : "Use one of the stores as the head office"}</Title>
          <Desc>
            {stores.length
              ? (zh ? "该店铺保留其 POS 和商品，同时作为总部向其他店铺供货。" : "The store keeps its POS and products, and acts as the head office for the others.")
              : (zh ? "请先选择要加入的店铺。" : "Choose the stores to attach first.")}
          </Desc>
          {existing && (
            <FormSelect value={value} onChange={e => onChange(e.target.value)} style={{ marginTop: "0.5rem" }}>
              {stores.map(s => <option key={s.business_id} value={s.business_id}>{s.name}</option>)}
            </FormSelect>
          )}
        </div>
      </Option>
    </div>
  );
}
