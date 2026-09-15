"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import {
  ContentHeaderFlex,
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  HeaderLeft,
  PageDescription,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui/AdminPageLayout";
import * as QuotationApi from "@/lib/quotationApi";
import { DEFAULT_QUOTE_TERMS, DEFAULT_VALID_DAYS } from "@/config/quotation";
import {
  type BillingPeriod,
  type CatalogueItem,
  type LineItemType,
  type Quotation,
  type QuotationCustomer,
  type QuotationInput,
  type QuotationLineItem,
  AU_STATES,
  BILLING_LABELS,
  EMPTY_CUSTOMER,
  LINE_ITEM_TYPES,
  addDaysIso,
  calculateTotals,
  displayNumber,
  formatMoney,
  fromDisplayPrice,
  lineSubtotal,
  newId,
  toDisplayPrice,
} from "@/lib/quotations";
import TotalsSummary from "./TotalsSummary";
import { BackLink, Card, CardTitle, ErrorText, FieldGrid, HeaderActions, Muted, TextButton } from "./ui";

/* ─── Styles ─── */

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

const ItemsToolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  select {
    flex: 1;
    min-width: 240px;
  }
`;

const ItemsScroll = styled.div`
  overflow-x: auto;
`;

const ItemsTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;

  th {
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #5c6b7a;
    padding: 0.5rem;
    border-bottom: 1px solid #e0e7ef;
    white-space: nowrap;
  }

  td {
    padding: 0.5rem;
    vertical-align: top;
    border-bottom: 1px solid #f0f3f7;
  }

  input, select {
    padding: 0.5rem 0.625rem;
    font-size: 0.875rem;
  }

  td.amount {
    text-align: right;
    font-weight: 600;
    color: #0a3655;
    padding-top: 1rem;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;

  ul {
    margin: 0.25rem 0 0 1.25rem;
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: #0a3655;
  cursor: pointer;
  margin-bottom: 1rem;
`;

/* ─── Inputs ─── */

const formatNumber = (value: number, decimals: number) => String(Math.round(value * 10 ** decimals) / 10 ** decimals);

/** Keeps the typed text while focused so conversions (like GST) don't fight the cursor */
function NumberInput({ value, onChange, decimals = 2, min = 0, ...rest }: {
  value: number;
  onChange: (value: number) => void;
  decimals?: number;
  min?: number;
  "aria-label"?: string;
  style?: React.CSSProperties;
}) {
  const [text, setText] = useState(formatNumber(value, decimals));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(formatNumber(value, decimals));
  }, [value, decimals]);

  return (
    <FormInput
      {...rest}
      type="number"
      inputMode="decimal"
      min={min}
      step="any"
      value={text}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        setText(formatNumber(value, decimals));
      }}
      onChange={e => {
        setText(e.target.value);
        const parsed = parseFloat(e.target.value);
        onChange(Number.isNaN(parsed) ? 0 : Math.max(min, parsed));
      }}
    />
  );
}

/* ─── Line item kinds ─── */

const KIND_OPTIONS: { type: LineItemType; billing: BillingPeriod }[] = [
  { type: "hardware", billing: "once" },
  { type: "subscription", billing: "monthly" },
  { type: "subscription", billing: "yearly" },
  { type: "service", billing: "once" },
];

const kindKey = (item: { type: LineItemType; billing: BillingPeriod }) => `${item.type}:${item.billing}`;

/* ─── Editor ─── */

export interface QuotationEditorProps {
  /** Existing draft to edit; omit to create a new quotation */
  quotation?: Quotation;
  /** Prefilled customer details, e.g. from an inquiry */
  prefill?: { customer?: Partial<QuotationCustomer>; inquiryId?: string };
}

export default function QuotationEditor({ quotation, prefill }: QuotationEditorProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [form, setForm] = useState<QuotationInput>(() =>
    quotation
      ? {
          customer: { ...EMPTY_CUSTOMER, ...quotation.customer },
          inquiryId: quotation.inquiryId,
          items: quotation.items,
          discountPercent: quotation.discountPercent,
          pricesIncludeGst: quotation.pricesIncludeGst,
          validUntil: quotation.validUntil,
          notes: quotation.notes,
          terms: quotation.terms,
        }
      : {
          customer: { ...EMPTY_CUSTOMER, ...prefill?.customer },
          inquiryId: prefill?.inquiryId,
          items: [],
          discountPercent: 0,
          pricesIncludeGst: false,
          validUntil: addDaysIso(DEFAULT_VALID_DAYS),
          notes: "",
          terms: DEFAULT_QUOTE_TERMS,
        }
  );
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    QuotationApi.listCatalogue()
      .then(setCatalogue)
      .catch(() => showToast(zh ? "获取价目表失败" : "Failed to load price list", "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => calculateTotals(form), [form]);
  const includeGst = form.pricesIncludeGst;
  const gstLabel = includeGst ? (zh ? "含GST" : "inc GST") : (zh ? "不含GST" : "ex GST");

  const setCustomer = (field: keyof QuotationCustomer, value: string) =>
    setForm(prev => ({ ...prev, customer: { ...prev.customer, [field]: value } }));

  const updateItem = (id: string, patch: Partial<QuotationLineItem>) =>
    setForm(prev => ({ ...prev, items: prev.items.map(item => (item.id === id ? { ...item, ...patch } : item)) }));

  const removeItem = (id: string) => setForm(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));

  const addItem = (item: Omit<QuotationLineItem, "id">) =>
    setForm(prev => ({ ...prev, items: [...prev.items, { ...item, id: newId() }] }));

  const addFromCatalogue = (catalogueId: string) => {
    const source = catalogue.find(c => c.id === catalogueId);
    if (!source) return;
    addItem({
      catalogueItemId: source.id,
      type: source.type,
      billing: source.billing,
      name: source.name,
      description: source.description,
      quantity: 1,
      unitPrice: source.unitPrice,
      discountPercent: 0,
    });
  };

  const validate = (): string[] => {
    const problems: string[] = [];
    const { customer, items } = form;
    if (!customer.companyName.trim() && !customer.contactName.trim()) {
      problems.push(zh ? "请填写公司名称或联系人姓名。" : "Enter a company name or contact name.");
    }
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      problems.push(zh ? "邮箱格式不正确。" : "Email address is not valid.");
    }
    if (items.length === 0) problems.push(zh ? "请至少添加一个项目。" : "Add at least one item.");
    items.forEach((item, index) => {
      if (!item.name.trim()) problems.push(zh ? `第 ${index + 1} 行缺少项目名称。` : `Line ${index + 1} needs a name.`);
      if (item.quantity <= 0) problems.push(zh ? `第 ${index + 1} 行数量必须大于 0。` : `Line ${index + 1} quantity must be more than 0.`);
      if (item.discountPercent > 100) problems.push(zh ? `第 ${index + 1} 行折扣不能超过 100%。` : `Line ${index + 1} discount can't be over 100%.`);
    });
    if (form.discountPercent > 100) problems.push(zh ? "报价折扣不能超过 100%。" : "Quote discount can't be over 100%.");
    if (!form.validUntil) problems.push(zh ? "请选择有效期。" : "Choose a valid-until date.");
    return problems;
  };

  const handleSave = async () => {
    const problems = validate();
    setErrors(problems);
    if (problems.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    try {
      const input: QuotationInput = {
        ...form,
        items: form.items.map(item => ({ ...item, name: item.name.trim(), description: item.description?.trim() || undefined })),
      };
      const saved = quotation
        ? await QuotationApi.updateQuotation(quotation.id, input)
        : await QuotationApi.createQuotation(input);
      showToast(zh ? "报价已保存" : "Quotation saved", "success");
      router.push(`/admin/quotations/${saved.id}`);
    } catch (error) {
      console.error("Failed to save quotation:", error);
      showToast(error instanceof Error ? error.message : (zh ? "保存失败" : "Failed to save quotation"), "error");
      setSaving(false);
    }
  };

  const hasItems = (billing: BillingPeriod) => form.items.some(i => i.billing === billing);

  return (
    <>
      <BackLink onClick={() => router.push(quotation ? `/admin/quotations/${quotation.id}` : "/admin/quotations")}>
        ← {quotation ? (zh ? "返回报价" : "Back to quotation") : (zh ? "返回报价列表" : "Back to quotations")}
      </BackLink>

      <ContentHeaderFlex>
        <HeaderLeft>
          <PageTitle>
            {quotation ? `${zh ? "编辑" : "Edit"} ${displayNumber(quotation)}` : (zh ? "新建报价" : "New Quotation")}
          </PageTitle>
          <PageDescription>
            {form.inquiryId
              ? (zh ? "客户信息已从咨询中预填。" : "Customer details were filled in from the inquiry.")
              : (zh ? "报价在发送前会保存为草稿。" : "The quotation is saved as a draft until you mark it as sent.")}
          </PageDescription>
        </HeaderLeft>
        <HeaderActions>
          <SecondaryButton onClick={() => router.back()} disabled={saving}>{zh ? "取消" : "Cancel"}</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? (zh ? "保存中…" : "Saving…") : (zh ? "保存草稿" : "Save Draft")}
          </PrimaryButton>
        </HeaderActions>
      </ContentHeaderFlex>

      {errors.length > 0 && (
        <ErrorBox role="alert">
          <strong>{zh ? "请先修正以下问题：" : "Please fix the following:"}</strong>
          <ul>{errors.map(e => <li key={e}>{e}</li>)}</ul>
        </ErrorBox>
      )}

      <Card>
        <CardTitle>{zh ? "客户信息" : "Customer"}</CardTitle>
        <FieldGrid>
          <FormGroup>
            <FormLabel htmlFor="q-company">{zh ? "公司名称" : "Company name"}</FormLabel>
            <FormInput id="q-company" value={form.customer.companyName} onChange={e => setCustomer("companyName", e.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="q-contact">{zh ? "联系人" : "Contact name"}</FormLabel>
            <FormInput id="q-contact" value={form.customer.contactName} onChange={e => setCustomer("contactName", e.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="q-email">Email</FormLabel>
            <FormInput id="q-email" type="email" value={form.customer.email} onChange={e => setCustomer("email", e.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="q-mobile">{zh ? "电话" : "Mobile"}</FormLabel>
            <FormInput id="q-mobile" value={form.customer.mobile} onChange={e => setCustomer("mobile", e.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="q-abn">ABN</FormLabel>
            <FormInput id="q-abn" value={form.customer.abn} onChange={e => setCustomer("abn", e.target.value)} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="q-state">{zh ? "州" : "State"}</FormLabel>
            <FormSelect id="q-state" value={form.customer.state} onChange={e => setCustomer("state", e.target.value)}>
              <option value="">—</option>
              {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </FormSelect>
          </FormGroup>
        </FieldGrid>
        <FormGroup>
          <FormLabel htmlFor="q-address">{zh ? "地址" : "Address"}</FormLabel>
          <FormInput id="q-address" value={form.customer.address} onChange={e => setCustomer("address", e.target.value)} />
        </FormGroup>
      </Card>

      <Card>
        <CardTitle>{zh ? "项目" : "Items"}</CardTitle>
        <ItemsToolbar>
          <FormSelect
            aria-label={zh ? "从价目表添加" : "Add from price list"}
            value=""
            onChange={e => addFromCatalogue(e.target.value)}
          >
            <option value="">{zh ? "+ 从价目表添加…" : "+ Add from price list…"}</option>
            {LINE_ITEM_TYPES.map(type => (
              <optgroup key={type.id} label={type.label[lang]}>
                {catalogue.filter(c => c.type === type.id).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {formatMoney(toDisplayPrice(c.unitPrice, includeGst))}
                    {c.billing !== "once" ? ` / ${BILLING_LABELS[c.billing][lang]}` : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </FormSelect>
          <SecondaryButton
            onClick={() => addItem({ type: "hardware", billing: "once", name: "", quantity: 1, unitPrice: 0, discountPercent: 0 })}
          >
            + {zh ? "自定义项目" : "Custom item"}
          </SecondaryButton>
        </ItemsToolbar>

        {form.items.length === 0 ? (
          <Muted>{zh ? "还没有项目。从价目表添加或创建自定义项目。" : "No items yet. Add one from the price list or create a custom item."}</Muted>
        ) : (
          <ItemsScroll>
            <ItemsTable>
              <thead>
                <tr>
                  <th style={{ width: "32%" }}>{zh ? "项目" : "Item"}</th>
                  <th>{zh ? "类型" : "Type"}</th>
                  <th style={{ width: 80 }}>{zh ? "数量" : "Qty"}</th>
                  <th style={{ width: 130 }}>{zh ? `单价（${gstLabel}）` : `Unit price (${gstLabel})`}</th>
                  <th style={{ width: 90 }}>{zh ? "折扣 %" : "Disc. %"}</th>
                  <th style={{ textAlign: "right" }}>{zh ? `金额（${gstLabel}）` : `Amount (${gstLabel})`}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <FormInput
                        aria-label={`${zh ? "项目名称" : "Item name"} ${index + 1}`}
                        placeholder={zh ? "项目名称" : "Item name"}
                        value={item.name}
                        onChange={e => updateItem(item.id, { name: e.target.value })}
                      />
                      <FormInput
                        aria-label={`${zh ? "描述" : "Description"} ${index + 1}`}
                        placeholder={zh ? "描述（可选）" : "Description (optional)"}
                        value={item.description || ""}
                        onChange={e => updateItem(item.id, { description: e.target.value })}
                        style={{ marginTop: "0.375rem" }}
                      />
                    </td>
                    <td>
                      <FormSelect
                        aria-label={`${zh ? "类型" : "Type"} ${index + 1}`}
                        value={kindKey(item)}
                        onChange={e => {
                          const kind = KIND_OPTIONS.find(k => kindKey(k) === e.target.value);
                          if (kind) updateItem(item.id, kind);
                        }}
                      >
                        {KIND_OPTIONS.map(kind => (
                          <option key={kindKey(kind)} value={kindKey(kind)}>
                            {LINE_ITEM_TYPES.find(t => t.id === kind.type)?.label[lang]} · {BILLING_LABELS[kind.billing][lang]}
                          </option>
                        ))}
                      </FormSelect>
                    </td>
                    <td>
                      <NumberInput aria-label={`${zh ? "数量" : "Quantity"} ${index + 1}`} value={item.quantity} decimals={2} onChange={quantity => updateItem(item.id, { quantity })} />
                    </td>
                    <td>
                      <NumberInput
                        aria-label={`${zh ? "单价" : "Unit price"} ${index + 1}`}
                        value={toDisplayPrice(item.unitPrice, includeGst)}
                        onChange={price => updateItem(item.id, { unitPrice: fromDisplayPrice(price, includeGst) })}
                      />
                    </td>
                    <td>
                      <NumberInput aria-label={`${zh ? "折扣" : "Discount"} ${index + 1}`} value={item.discountPercent} onChange={discountPercent => updateItem(item.id, { discountPercent })} />
                    </td>
                    <td className="amount">
                      {formatMoney(toDisplayPrice(lineSubtotal(item), includeGst))}
                      {item.billing !== "once" && <Muted> / {BILLING_LABELS[item.billing][lang]}</Muted>}
                    </td>
                    <td>
                      <TextButton $danger onClick={() => removeItem(item.id)} aria-label={`${zh ? "删除" : "Remove"} ${item.name || index + 1}`}>
                        {zh ? "删除" : "Remove"}
                      </TextButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ItemsTable>
          </ItemsScroll>
        )}
      </Card>

      <TwoColumn>
        <Card>
          <CardTitle>{zh ? "报价设置" : "Quote settings"}</CardTitle>
          <FormGroup>
            <FormLabel htmlFor="q-valid">{zh ? "有效期至" : "Valid until"}</FormLabel>
            <FormInput id="q-valid" type="date" value={form.validUntil} onChange={e => setForm(prev => ({ ...prev, validUntil: e.target.value }))} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="q-discount">{zh ? "整单折扣 %" : "Quote discount %"}</FormLabel>
            <NumberInput value={form.discountPercent} onChange={discountPercent => setForm(prev => ({ ...prev, discountPercent }))} aria-label={zh ? "整单折扣" : "Quote discount"} />
            <Muted>{zh ? "在每行折扣之后应用于所有项目。" : "Applied to every item, after line discounts."}</Muted>
          </FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={form.pricesIncludeGst}
              onChange={e => setForm(prev => ({ ...prev, pricesIncludeGst: e.target.checked }))}
            />
            {zh ? "单价含GST" : "Unit prices include GST"}
          </Toggle>
          <Muted>
            {zh
              ? "仅改变价格的输入和显示方式，合计始终分别显示GST。"
              : "Only changes how prices are entered and shown. Totals always show GST separately."}
          </Muted>
        </Card>

        <Card>
          <CardTitle>{zh ? "合计" : "Totals"}</CardTitle>
          <TotalsSummary totals={totals} hasItems={hasItems} />
        </Card>
      </TwoColumn>

      <Card>
        <CardTitle>{zh ? "备注与条款" : "Notes & terms"}</CardTitle>
        <FormGroup>
          <FormLabel htmlFor="q-notes">{zh ? "给客户的备注" : "Notes to customer"}</FormLabel>
          <FormTextarea id="q-notes" rows={3} value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="q-terms">{zh ? "条款" : "Terms"}</FormLabel>
          <FormTextarea id="q-terms" rows={4} value={form.terms} onChange={e => setForm(prev => ({ ...prev, terms: e.target.value }))} />
        </FormGroup>
        {errors.length > 0 && <ErrorText>{zh ? "请修正页面顶部列出的问题。" : "Fix the problems listed at the top of the page."}</ErrorText>}
        <HeaderActions style={{ justifyContent: "flex-end" }}>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? (zh ? "保存中…" : "Saving…") : (zh ? "保存草稿" : "Save Draft")}
          </PrimaryButton>
        </HeaderActions>
      </Card>
    </>
  );
}
