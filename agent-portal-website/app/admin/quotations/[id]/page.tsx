"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import QuotationShell from "@/components/quotations/QuotationShell";
import TotalsSummary from "@/components/quotations/TotalsSummary";
import { BackLink, Card, CardTitle, HeaderActions, Muted, QuoteStatusBadge, TextButton } from "@/components/quotations/ui";
import {
  ContentHeaderFlex,
  HeaderLeft,
  LoadingText,
  ModalActions,
  ModalButton,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui/AdminPageLayout";
import * as QuotationApi from "@/lib/quotationApi";
import { downloadQuotationPdf } from "@/lib/quotationPdf";
import {
  type BillingPeriod,
  type Quotation,
  type QuotationStatus,
  BILLING_LABELS,
  LINE_ITEM_TYPES,
  STATUS_LABELS,
  calculateTotals,
  customerDisplayName,
  displayNumber,
  formatMoney,
  lineSubtotal,
  toDisplayPrice,
  todayIso,
} from "@/lib/quotations";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

const InfoGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #8592a3;
    margin-bottom: 0.2rem;
  }

  dd {
    color: #0a3655;
    font-size: 0.9375rem;
    word-break: break-word;
  }
`;

const ItemsScroll = styled.div`
  overflow-x: auto;
`;

const ItemsTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: 0.9375rem;

  th {
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #5c6b7a;
    padding: 0.5rem;
    border-bottom: 1px solid #e0e7ef;
  }

  td {
    padding: 0.625rem 0.5rem;
    border-bottom: 1px solid #f0f3f7;
    color: #0a3655;
    vertical-align: top;
  }

  .num {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;

const Timeline = styled.ul`
  list-style: none;
  display: grid;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: #0a3655;
`;

const PreWrap = styled.p`
  white-space: pre-wrap;
  color: #0a3655;
  font-size: 0.9375rem;
  line-height: 1.6;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ConfirmCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  max-width: 460px;
  width: 100%;

  h2 {
    font-size: 1.25rem;
    color: #0a3655;
    margin-bottom: 0.5rem;
  }

  p {
    color: #5c6b7a;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

type PendingAction = "send" | "accept" | "decline" | "revise" | "delete";

export default function QuotationDetailPage() {
  return (
    <QuotationShell>
      <QuotationDetail />
    </QuotationShell>
  );
}

function QuotationDetail() {
  const id = useParams<{ id: string }>()?.id ?? "";
  const router = useRouter();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [versions, setVersions] = useState<Quotation[]>([]);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await QuotationApi.getQuotation(id);
      setQuotation(result.quotation);
      setVersions(result.versions);
    } catch {
      showToast(zh ? "未找到报价" : "Quotation not found", "error");
      router.replace("/admin/quotations");
    }
  }, [id, zh, router, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  if (!quotation) return <LoadingText>Loading...</LoadingText>;

  const totals = calculateTotals(quotation);
  const gstLabel = quotation.pricesIncludeGst ? (zh ? "含GST" : "inc GST") : (zh ? "不含GST" : "ex GST");
  const validDatePassed = quotation.validUntil < todayIso();
  const { customer } = quotation;

  const runAction = async (action: PendingAction) => {
    setBusy(true);
    try {
      if (action === "delete") {
        await QuotationApi.deleteQuotation(quotation.id);
        showToast(zh ? "草稿已删除" : "Draft deleted", "success");
        router.push("/admin/quotations");
        return;
      }
      if (action === "revise") {
        const revision = await QuotationApi.reviseQuotation(quotation.id);
        showToast(zh ? `已创建第 ${revision.version} 版草稿` : `Version ${revision.version} created as a draft`, "success");
        router.push(`/admin/quotations/${revision.id}/edit`);
        return;
      }
      const nextStatus: Record<"send" | "accept" | "decline", QuotationStatus> = { send: "sent", accept: "accepted", decline: "declined" };
      await QuotationApi.setQuotationStatus(quotation.id, nextStatus[action]);
      showToast(zh ? "状态已更新" : "Status updated", "success");
      await load();
    } catch (error) {
      showToast(error instanceof Error ? error.message : (zh ? "操作失败" : "Action failed"), "error");
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  const handleDuplicate = async () => {
    setBusy(true);
    try {
      const copy = await QuotationApi.duplicateQuotation(quotation.id);
      showToast(zh ? `已复制为 ${copy.number}` : `Copied as ${copy.number}`, "success");
      router.push(`/admin/quotations/${copy.id}/edit`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : (zh ? "复制失败" : "Failed to copy"), "error");
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadQuotationPdf(quotation);
    } catch (error) {
      console.error("PDF generation failed:", error);
      showToast(zh ? "生成PDF失败" : "Failed to create PDF", "error");
    }
  };

  const CONFIRM_COPY: Record<PendingAction, { title: string; body: string; confirm: string; danger?: boolean }> = {
    send: {
      title: zh ? "标记为已发送？" : "Mark as sent?",
      body: zh ? "发送后报价将被锁定。如需修改，请创建新版本。" : "The quotation will be locked. To change it later, create a new version.",
      confirm: zh ? "标记为已发送" : "Mark as sent",
    },
    accept: {
      title: zh ? "标记为已接受？" : "Mark as accepted?",
      body: zh ? "请确认客户已接受此报价。" : "Confirm the customer has accepted this quotation.",
      confirm: zh ? "标记为已接受" : "Mark as accepted",
    },
    decline: {
      title: zh ? "标记为已拒绝？" : "Mark as declined?",
      body: zh ? "之后仍可以创建新版本重新报价。" : "You can still create a new version later to re-quote.",
      confirm: zh ? "标记为已拒绝" : "Mark as declined",
      danger: true,
    },
    revise: {
      title: zh ? "创建新版本？" : "Create a new version?",
      body: zh
        ? `将创建可编辑的第 ${Math.max(...versions.map(v => v.version)) + 1} 版草稿，当前版本将标记为已被替代。`
        : `An editable draft of version ${Math.max(...versions.map(v => v.version)) + 1} will be created and this version will be marked as superseded.`,
      confirm: zh ? "创建新版本" : "Create version",
    },
    delete: {
      title: zh ? "删除草稿？" : "Delete draft?",
      body: zh ? "此操作无法撤销。" : "This can't be undone.",
      confirm: zh ? "删除" : "Delete",
      danger: true,
    },
  };

  const groups = (["once", "monthly", "yearly"] as BillingPeriod[]).filter(b => quotation.items.some(i => i.billing === b));
  const latest = versions[0];

  const timeline = [
    { label: zh ? "创建" : "Created", at: quotation.createdAt, by: quotation.createdBy },
    quotation.sentAt && { label: zh ? "已发送" : "Sent", at: quotation.sentAt },
    quotation.acceptedAt && { label: zh ? "已接受" : "Accepted", at: quotation.acceptedAt },
    quotation.declinedAt && { label: zh ? "已拒绝" : "Declined", at: quotation.declinedAt },
  ].filter(Boolean) as { label: string; at: string; by?: string }[];

  return (
    <>
      <BackLink onClick={() => router.push("/admin/quotations")}>← {zh ? "返回报价列表" : "Back to quotations"}</BackLink>

      <ContentHeaderFlex>
        <HeaderLeft>
          <PageTitle>{displayNumber(quotation)}</PageTitle>
          <HeaderActions>
            <QuoteStatusBadge $status={quotation.status}>{STATUS_LABELS[quotation.status][lang]}</QuoteStatusBadge>
            <Muted>{customerDisplayName(customer)}</Muted>
          </HeaderActions>
        </HeaderLeft>
        <HeaderActions>
          <SecondaryButton onClick={handleDownload}>{zh ? "下载PDF" : "Download PDF"}</SecondaryButton>
          {quotation.status === "draft" && (
            <>
              <SecondaryButton onClick={() => router.push(`/admin/quotations/${quotation.id}/edit`)}>{zh ? "编辑" : "Edit"}</SecondaryButton>
              <PrimaryButton onClick={() => setPending("send")} disabled={busy || validDatePassed} title={validDatePassed ? "Valid-until date has passed" : undefined}>
                {zh ? "标记为已发送" : "Mark as Sent"}
              </PrimaryButton>
            </>
          )}
          {quotation.status === "sent" && (
            <>
              <SecondaryButton onClick={() => setPending("revise")} disabled={busy}>{zh ? "新版本" : "New Version"}</SecondaryButton>
              <SecondaryButton onClick={() => setPending("decline")} disabled={busy}>{zh ? "标记为已拒绝" : "Mark Declined"}</SecondaryButton>
              <PrimaryButton onClick={() => setPending("accept")} disabled={busy}>{zh ? "标记为已接受" : "Mark Accepted"}</PrimaryButton>
            </>
          )}
          {(quotation.status === "declined" || quotation.status === "expired" || quotation.status === "accepted") && (
            <SecondaryButton onClick={() => setPending("revise")} disabled={busy}>{zh ? "新版本" : "New Version"}</SecondaryButton>
          )}
        </HeaderActions>
      </ContentHeaderFlex>

      {quotation.status === "draft" && validDatePassed && (
        <Card style={{ background: "#fffbeb", color: "#92400e" }}>
          {zh ? "有效期已过。请先编辑报价并更新有效期，然后再标记为已发送。" : "The valid-until date has passed. Edit the quotation and update the date before marking it as sent."}
        </Card>
      )}
      {quotation.status === "superseded" && latest && latest.id !== quotation.id && (
        <Card style={{ background: "#f3f4f6" }}>
          {zh ? "此版本已被替代。" : "This version has been replaced. "}
          <TextButton onClick={() => router.push(`/admin/quotations/${latest.id}`)}>
            {zh ? `查看最新版本（v${latest.version}）` : `View latest version (v${latest.version})`}
          </TextButton>
        </Card>
      )}

      <Layout>
        <div>
          <Card>
            <CardTitle>{zh ? "客户信息" : "Customer"}</CardTitle>
            <InfoGrid>
              {[
                [zh ? "公司名称" : "Company", customer.companyName],
                [zh ? "联系人" : "Contact", customer.contactName],
                ["Email", customer.email],
                [zh ? "电话" : "Mobile", customer.mobile],
                ["ABN", customer.abn],
                [zh ? "地址" : "Address", [customer.address, customer.state].filter(Boolean).join(", ")],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
            </InfoGrid>
          </Card>

          <Card>
            <CardTitle>{zh ? "项目" : "Items"}</CardTitle>
            {groups.map(billing => (
              <ItemsScroll key={billing} style={{ marginBottom: "1.25rem" }}>
                <strong style={{ color: "#0a3655", fontSize: "0.875rem" }}>{BILLING_LABELS[billing][lang]}</strong>
                <ItemsTable>
                  <thead>
                    <tr>
                      <th>{zh ? "项目" : "Item"}</th>
                      <th className="num">{zh ? "数量" : "Qty"}</th>
                      <th className="num">{zh ? `单价（${gstLabel}）` : `Unit (${gstLabel})`}</th>
                      <th className="num">{zh ? "折扣" : "Disc."}</th>
                      <th className="num">{zh ? `金额（${gstLabel}）` : `Amount (${gstLabel})`}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.items.filter(i => i.billing === billing).map(item => (
                      <tr key={item.id}>
                        <td>
                          <div>{item.name}</div>
                          <Muted>
                            {LINE_ITEM_TYPES.find(t => t.id === item.type)?.label[lang]}
                            {item.description ? ` · ${item.description}` : ""}
                          </Muted>
                        </td>
                        <td className="num">{item.quantity}</td>
                        <td className="num">{formatMoney(toDisplayPrice(item.unitPrice, quotation.pricesIncludeGst))}</td>
                        <td className="num">{item.discountPercent ? `${item.discountPercent}%` : "—"}</td>
                        <td className="num">{formatMoney(toDisplayPrice(lineSubtotal(item), quotation.pricesIncludeGst))}</td>
                      </tr>
                    ))}
                  </tbody>
                </ItemsTable>
              </ItemsScroll>
            ))}
            {quotation.discountPercent > 0 && (
              <Muted>{zh ? `整单折扣 ${quotation.discountPercent}%，已计入合计。` : `A ${quotation.discountPercent}% quote discount is applied in the totals.`}</Muted>
            )}
          </Card>

          {(quotation.notes || quotation.terms) && (
            <Card>
              {quotation.notes && (
                <>
                  <CardTitle>{zh ? "备注" : "Notes"}</CardTitle>
                  <PreWrap>{quotation.notes}</PreWrap>
                </>
              )}
              {quotation.terms && (
                <>
                  <CardTitle style={{ marginTop: quotation.notes ? "1.25rem" : 0 }}>{zh ? "条款" : "Terms"}</CardTitle>
                  <PreWrap>{quotation.terms}</PreWrap>
                </>
              )}
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardTitle>{zh ? "合计" : "Totals"}</CardTitle>
            <TotalsSummary totals={totals} hasItems={b => quotation.items.some(i => i.billing === b)} />
          </Card>

          <Card>
            <CardTitle>{zh ? "详情" : "Details"}</CardTitle>
            <InfoGrid style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <dt>{zh ? "有效期至" : "Valid until"}</dt>
                <dd>{new Date(`${quotation.validUntil}T00:00:00`).toLocaleDateString()}</dd>
              </div>
              {quotation.inquiryId && (
                <div>
                  <dt>{zh ? "来源" : "Source"}</dt>
                  <dd>
                    <TextButton style={{ padding: 0 }} onClick={() => router.push("/admin/inquiries")}>
                      {zh ? "网站咨询" : "Website inquiry"}
                    </TextButton>
                  </dd>
                </div>
              )}
            </InfoGrid>
            <Timeline style={{ marginTop: "1rem" }}>
              {timeline.map(event => (
                <li key={event.label}>
                  <strong>{event.label}</strong> <Muted>{new Date(event.at).toLocaleString()}{event.by ? ` · ${event.by}` : ""}</Muted>
                </li>
              ))}
            </Timeline>
          </Card>

          {versions.length > 1 && (
            <Card>
              <CardTitle>{zh ? "版本" : "Versions"}</CardTitle>
              <Timeline>
                {versions.map(v => (
                  <li key={v.id}>
                    {v.id === quotation.id ? (
                      <strong>v{v.version}</strong>
                    ) : (
                      <TextButton style={{ padding: 0 }} onClick={() => router.push(`/admin/quotations/${v.id}`)}>v{v.version}</TextButton>
                    )}{" "}
                    <QuoteStatusBadge $status={v.status}>{STATUS_LABELS[v.status][lang]}</QuoteStatusBadge>{" "}
                    <Muted>{new Date(v.updatedAt).toLocaleDateString()}</Muted>
                  </li>
                ))}
              </Timeline>
            </Card>
          )}

          <Card>
            <CardTitle>{zh ? "更多操作" : "More actions"}</CardTitle>
            <HeaderActions>
              <TextButton onClick={handleDuplicate} disabled={busy}>{zh ? "复制为新报价" : "Copy as new quotation"}</TextButton>
              {quotation.status === "draft" && (
                <TextButton $danger onClick={() => setPending("delete")} disabled={busy}>{zh ? "删除草稿" : "Delete draft"}</TextButton>
              )}
            </HeaderActions>
          </Card>
        </div>
      </Layout>

      {pending && (
        <ConfirmOverlay onClick={() => !busy && setPending(null)}>
          <ConfirmCard role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={e => e.stopPropagation()}>
            <h2 id="confirm-title">{CONFIRM_COPY[pending].title}</h2>
            <p>{CONFIRM_COPY[pending].body}</p>
            <ModalActions>
              <ModalButton onClick={() => setPending(null)} disabled={busy}>{zh ? "取消" : "Cancel"}</ModalButton>
              <ModalButton
                $primary={!CONFIRM_COPY[pending].danger}
                $danger={CONFIRM_COPY[pending].danger}
                onClick={() => runAction(pending)}
                disabled={busy}
              >
                {CONFIRM_COPY[pending].confirm}
              </ModalButton>
            </ModalActions>
          </ConfirmCard>
        </ConfirmOverlay>
      )}
    </>
  );
}
