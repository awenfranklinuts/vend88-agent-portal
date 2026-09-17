"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import QuotationShell from "@/components/quotations/QuotationShell";
import { HeaderActions, Muted, QuoteStatusBadge } from "@/components/quotations/ui";
import {
  ContentHeaderFlex,
  EmptyState,
  EmptySubtext,
  EmptyText,
  FilterSelect,
  HeaderLeft,
  LoadingText,
  PageDescription,
  PageTitle,
  PrimaryButton,
  SearchFilterContainer,
  SearchInput,
  SecondaryButton,
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
  type Quotation,
  type QuotationStatus,
  QUOTATION_STATUSES,
  STATUS_LABELS,
  calculateTotals,
  customerDisplayName,
  displayNumber,
  formatMoney,
} from "@/lib/quotations";

const LIMIT = 20;

export default function QuotationManagementPage() {
  return (
    <QuotationShell>
      <QuotationList />
    </QuotationShell>
  );
}

function QuotationList() {
  const router = useRouter();
  const { adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";
  const showTeamColumn = canSeeAllTeams(adminProfile);

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<QuotationStatus | "">("");
  const [loading, setLoading] = useState(true);

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await QuotationApi.listQuotations({ search, status, page, limit: LIMIT });
      setQuotations(result.quotations);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to load quotations:", error);
      showToast(zh ? "获取报价失败" : "Failed to load quotations", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, zh, showToast]);

  useEffect(() => {
    const t = setTimeout(fetchQuotations, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchQuotations, search]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <>
      <ContentHeaderFlex>
        <HeaderLeft>
          <PageTitle>{zh ? "报价管理" : "Quotation Management"}</PageTitle>
          <PageDescription>
            {zh ? "创建、发送和跟踪客户报价。" : "Create, send, and track quotations for customers."}
          </PageDescription>
        </HeaderLeft>
        <HeaderActions>
          <SecondaryButton onClick={() => router.push("/admin/quotations/price-list")}>
            {zh ? "价目表" : "Price List"}
          </SecondaryButton>
          <PrimaryButton onClick={() => router.push("/admin/quotations/new")}>
            + {zh ? "新建报价" : "New Quotation"}
          </PrimaryButton>
        </HeaderActions>
      </ContentHeaderFlex>

      <SearchFilterContainer>
        <SearchInput
          placeholder={zh ? "按报价编号、公司、联系人、邮箱或电话搜索" : "Search by quote number, company, contact, email, or mobile"}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <FilterSelect
          value={status}
          onChange={e => {
            setStatus(e.target.value as QuotationStatus | "");
            setPage(1);
          }}
        >
          <option value="">{zh ? "所有有效报价" : "All current quotes"}</option>
          {QUOTATION_STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s][lang]}</option>
          ))}
        </FilterSelect>
      </SearchFilterContainer>

      <TableContainer>
        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : quotations.length === 0 ? (
          <EmptyState>
            <EmptyText>{search || status ? (zh ? "没有匹配的报价" : "No matching quotations") : (zh ? "还没有报价" : "No quotations yet")}</EmptyText>
            <EmptySubtext>
              {zh ? "点击“新建报价”，或在咨询管理中从咨询创建报价。" : "Click “New Quotation”, or create one from an inquiry in Inquiry Management."}
            </EmptySubtext>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th>{zh ? "报价编号" : "Quote"}</Th>
                  <Th>{zh ? "客户" : "Customer"}</Th>
                  {showTeamColumn && <Th>{zh ? "团队" : "Team"}</Th>}
                  <Th>{zh ? "一次性合计" : "One-off"}</Th>
                  <Th>{zh ? "每月合计" : "Monthly"}</Th>
                  <Th>{zh ? "有效期至" : "Valid until"}</Th>
                  <Th>{zh ? "状态" : "Status"}</Th>
                  <Th>{zh ? "更新时间" : "Updated"}</Th>
                </tr>
              </Thead>
              <Tbody>
                {quotations.map(quote => {
                  const totals = calculateTotals(quote);
                  return (
                    <Tr key={quote.id} onClick={() => router.push(`/admin/quotations/${quote.id}`)} style={{ cursor: "pointer" }}>
                      <Td><strong>{displayNumber(quote)}</strong></Td>
                      <Td>
                        <div>{customerDisplayName(quote.customer)}</div>
                        {quote.customer.companyName && quote.customer.contactName && <Muted>{quote.customer.contactName}</Muted>}
                      </Td>
                      {showTeamColumn && (
                        <Td>
                          <div>{quote.teamName || <Muted>Vend88</Muted>}</div>
                          {quote.attributedToName && <Muted>{quote.attributedToName}</Muted>}
                        </Td>
                      )}
                      <Td>{totals.once.total ? formatMoney(totals.once.total) : "—"}</Td>
                      <Td>{totals.monthly.total ? formatMoney(totals.monthly.total) : "—"}</Td>
                      <Td>{new Date(`${quote.validUntil}T00:00:00`).toLocaleDateString()}</Td>
                      <Td><QuoteStatusBadge $status={quote.status}>{STATUS_LABELS[quote.status][lang]}</QuoteStatusBadge></Td>
                      <Td>
                        <div>{new Date(quote.updatedAt).toLocaleDateString()}</div>
                        <Muted>{quote.createdBy}</Muted>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
        )}
      </TableContainer>

      {totalPages > 1 && (
        <HeaderActions style={{ justifyContent: "center", marginTop: "1.25rem" }}>
          <SecondaryButton disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{zh ? "上一页" : "Previous"}</SecondaryButton>
          <span>{zh ? `第 ${page} / ${totalPages} 页` : `Page ${page} of ${totalPages}`}</span>
          <SecondaryButton disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>{zh ? "下一页" : "Next"}</SecondaryButton>
        </HeaderActions>
      )}
    </>
  );
}
