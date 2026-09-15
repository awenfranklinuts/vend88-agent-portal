"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import QuotationShell from "@/components/quotations/QuotationShell";
import { BackLink, ErrorText, FieldGrid, HeaderActions, Muted, TextButton } from "@/components/quotations/ui";
import {
  ContentHeaderFlex,
  EmptyState,
  EmptySubtext,
  EmptyText,
  FilterSelect,
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  HeaderLeft,
  LoadingText,
  Modal,
  ModalActions,
  ModalButton,
  ModalContent,
  ModalTitle,
  PageDescription,
  PageTitle,
  PrimaryButton,
  SearchFilterContainer,
  SearchInput,
  Table,
  TableContainer,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@/components/ui/AdminPageLayout";
import * as QuotationApi from "@/lib/quotationApi";
import {
  type BillingPeriod,
  type CatalogueItem,
  type LineItemType,
  BILLING_LABELS,
  LINE_ITEM_TYPES,
  formatMoney,
  toDisplayPrice,
} from "@/lib/quotations";

type Draft = Omit<CatalogueItem, "id" | "unitPrice"> & { id?: string; unitPrice: string };

const EMPTY_DRAFT: Draft = { name: "", description: "", sku: "", type: "hardware", billing: "once", unitPrice: "", active: true };

const billingOptionsFor = (type: LineItemType): BillingPeriod[] => (type === "subscription" ? ["monthly", "yearly"] : ["once"]);

export default function PriceListPage() {
  return (
    <QuotationShell>
      <PriceList />
    </QuotationShell>
  );
}

function PriceList() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LineItemType | "">("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftError, setDraftError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await QuotationApi.listCatalogue({ includeInactive: true }));
    } catch {
      showToast(zh ? "获取价目表失败" : "Failed to load price list", "error");
    } finally {
      setLoading(false);
    }
  }, [zh, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const term = search.trim().toLowerCase();
  const visible = items
    .filter(item => !typeFilter || item.type === typeFilter)
    .filter(item => !term || [item.name, item.sku, item.description].some(v => v?.toLowerCase().includes(term)));

  const openEditor = (item?: CatalogueItem) => {
    setDraftError("");
    setDraft(item ? { ...item, description: item.description || "", sku: item.sku || "", unitPrice: String(item.unitPrice) } : EMPTY_DRAFT);
  };

  const handleSave = async () => {
    if (!draft) return;
    const price = parseFloat(draft.unitPrice);
    if (!draft.name.trim()) return setDraftError(zh ? "请填写名称。" : "Enter a name.");
    if (Number.isNaN(price) || price < 0) return setDraftError(zh ? "请输入有效价格。" : "Enter a valid price.");

    setSaving(true);
    try {
      await QuotationApi.saveCatalogueItem({
        ...draft,
        name: draft.name.trim(),
        description: draft.description?.trim() || undefined,
        sku: draft.sku?.trim() || undefined,
        unitPrice: price,
      });
      showToast(zh ? "已保存" : "Item saved", "success");
      setDraft(null);
      await load();
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : (zh ? "保存失败" : "Failed to save item"));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: CatalogueItem) => {
    try {
      await QuotationApi.saveCatalogueItem({ ...item, active: !item.active });
      await load();
    } catch {
      showToast(zh ? "更新失败" : "Failed to update item", "error");
    }
  };

  return (
    <>
      <BackLink onClick={() => router.push("/admin/quotations")}>← {zh ? "返回报价列表" : "Back to quotations"}</BackLink>

      <ContentHeaderFlex>
        <HeaderLeft>
          <PageTitle>{zh ? "价目表" : "Price List"}</PageTitle>
          <PageDescription>
            {zh
              ? "报价中可选择的产品和服务。价格均不含GST。修改价格不会影响已创建的报价。"
              : "Products and services available when building a quote. Prices exclude GST. Changing a price doesn't affect existing quotes."}
          </PageDescription>
        </HeaderLeft>
        <PrimaryButton onClick={() => openEditor()}>+ {zh ? "添加项目" : "Add Item"}</PrimaryButton>
      </ContentHeaderFlex>

      <SearchFilterContainer>
        <SearchInput placeholder={zh ? "按名称或SKU搜索" : "Search by name or SKU"} value={search} onChange={e => setSearch(e.target.value)} />
        <FilterSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value as LineItemType | "")}>
          <option value="">{zh ? "所有类型" : "All types"}</option>
          {LINE_ITEM_TYPES.map(t => <option key={t.id} value={t.id}>{t.label[lang]}</option>)}
        </FilterSelect>
      </SearchFilterContainer>

      <TableContainer>
        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : visible.length === 0 ? (
          <EmptyState>
            <EmptyText>{items.length === 0 ? (zh ? "价目表还是空的" : "The price list is empty") : (zh ? "没有匹配的项目" : "No matching items")}</EmptyText>
            {items.length === 0 && (
              <EmptySubtext>{zh ? "添加产品和服务后，即可在报价中直接选择。" : "Add your products and services so they can be picked when building a quote."}</EmptySubtext>
            )}
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th>{zh ? "名称" : "Name"}</Th>
                  <Th>{zh ? "类型" : "Type"}</Th>
                  <Th>{zh ? "价格（不含GST）" : "Price (ex GST)"}</Th>
                  <Th>{zh ? "含GST" : "Inc GST"}</Th>
                  <Th>{zh ? "状态" : "Status"}</Th>
                  <Th />
                </tr>
              </Thead>
              <Tbody>
                {visible.map(item => (
                  <Tr key={item.id} style={{ opacity: item.active ? 1 : 0.55 }}>
                    <Td>
                      <div>{item.name}</div>
                      <Muted>{[item.sku, item.description].filter(Boolean).join(" · ")}</Muted>
                    </Td>
                    <Td>
                      {LINE_ITEM_TYPES.find(t => t.id === item.type)?.label[lang]}
                      {item.billing !== "once" && <Muted> · {BILLING_LABELS[item.billing][lang]}</Muted>}
                    </Td>
                    <Td>{formatMoney(item.unitPrice)}</Td>
                    <Td><Muted>{formatMoney(toDisplayPrice(item.unitPrice, true))}</Muted></Td>
                    <Td>{item.active ? (zh ? "启用" : "Active") : (zh ? "已隐藏" : "Hidden")}</Td>
                    <Td>
                      <HeaderActions style={{ flexWrap: "nowrap", gap: "0.25rem" }}>
                        <TextButton onClick={() => openEditor(item)}>{zh ? "编辑" : "Edit"}</TextButton>
                        <TextButton onClick={() => toggleActive(item)}>
                          {item.active ? (zh ? "隐藏" : "Hide") : (zh ? "启用" : "Show")}
                        </TextButton>
                      </HeaderActions>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrapper>
        )}
      </TableContainer>

      <Modal $show={!!draft} onClick={() => !saving && setDraft(null)}>
        {draft && (
          <ModalContent role="dialog" aria-modal="true" aria-labelledby="price-item-title" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <ModalTitle id="price-item-title">{draft.id ? (zh ? "编辑项目" : "Edit Item") : (zh ? "添加项目" : "Add Item")}</ModalTitle>
            <FormGroup>
              <FormLabel htmlFor="pl-name">{zh ? "名称" : "Name"}</FormLabel>
              <FormInput id="pl-name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} autoFocus />
            </FormGroup>
            <FieldGrid>
              <FormGroup>
                <FormLabel htmlFor="pl-type">{zh ? "类型" : "Type"}</FormLabel>
                <FormSelect
                  id="pl-type"
                  value={draft.type}
                  onChange={e => {
                    const type = e.target.value as LineItemType;
                    setDraft({ ...draft, type, billing: billingOptionsFor(type)[0] });
                  }}
                >
                  {LINE_ITEM_TYPES.map(t => <option key={t.id} value={t.id}>{t.label[lang]}</option>)}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="pl-billing">{zh ? "计费" : "Billing"}</FormLabel>
                <FormSelect
                  id="pl-billing"
                  value={draft.billing}
                  disabled={draft.type !== "subscription"}
                  onChange={e => setDraft({ ...draft, billing: e.target.value as BillingPeriod })}
                >
                  {billingOptionsFor(draft.type).map(b => <option key={b} value={b}>{BILLING_LABELS[b][lang]}</option>)}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="pl-price">{zh ? "价格（不含GST）" : "Price (ex GST)"}</FormLabel>
                <FormInput id="pl-price" type="number" min={0} step="any" inputMode="decimal" value={draft.unitPrice} onChange={e => setDraft({ ...draft, unitPrice: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="pl-sku">SKU</FormLabel>
                <FormInput id="pl-sku" value={draft.sku} onChange={e => setDraft({ ...draft, sku: e.target.value })} />
              </FormGroup>
            </FieldGrid>
            <FormGroup>
              <FormLabel htmlFor="pl-desc">{zh ? "描述" : "Description"}</FormLabel>
              <FormInput id="pl-desc" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
            </FormGroup>
            {draftError && <ErrorText role="alert">{draftError}</ErrorText>}
            <ModalActions style={{ marginTop: "1rem" }}>
              <ModalButton onClick={() => setDraft(null)} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
              <ModalButton $primary onClick={handleSave} disabled={saving}>{saving ? (zh ? "保存中…" : "Saving…") : (zh ? "保存" : "Save")}</ModalButton>
            </ModalActions>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
