"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styled from "styled-components";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { getApiUrl, API_CONFIG } from "@/config/api";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";

interface Inquiry {
  _id: string;
  full_name: string;
  company_name: string;
  email?: string;
  mobile: string;
  state?: string;
  business_type?: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  source?: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "closed"] as const;

function formatSource(source?: string): string {
  if (!source) return "Pospal Website";
  const s = source.toLowerCase();
  if (s.includes("pospal")) return "Pospal Website";
  if (s.includes("vendpos")) return "Vendpos Website";
  return source;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
  margin-left: 320px;
  overflow-y: auto;

  @media (max-width: 968px) {
    padding: 0 1rem 1rem 1rem;
    margin-left: 0;
  }
`;

const ContentHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #5c6b7a;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 0.65rem 1rem;
  border: 1px solid #d7dfe9;
  border-radius: 10px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const StatusSelect = styled.select`
  padding: 0.65rem 1rem;
  border: 1px solid #d7dfe9;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const TableWrap = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.25rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #5c6b7a;
  border-bottom: 1px solid #eef1f5;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.9rem;
  color: #1f2d3d;
  border-bottom: 1px solid #eef1f5;
  vertical-align: top;
`;

const Row = styled.tr`
  cursor: pointer;
  &:hover {
    background: #f7faff;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${({ $status }) =>
    $status === "new" ? "#fef3c7" : $status === "contacted" ? "#dbeafe" : "#dcfce7"};
  color: ${({ $status }) =>
    $status === "new" ? "#92400e" : $status === "contacted" ? "#1e40af" : "#166534"};
`;

const SourceBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #ede9fe;
  color: #5b21b6;
`;

const RowActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  color: #c53030;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  &:hover {
    background: #fee2e2;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #5c6b7a;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d7dfe9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 40, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 520px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  margin-bottom: 0.9rem;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8592a3;
  margin-bottom: 0.2rem;
`;

const DetailValue = styled.div`
  font-size: 0.95rem;
  color: #1f2d3d;
  white-space: pre-wrap;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const CloseButton = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  border: 1px solid #d7dfe9;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
`;

const LIMIT = 20;

export default function InquiriesPage() {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && !isAdminRole(role)) {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  const hasPermission = adminProfile?.permissions?.includes("manage_inquiries");

  const fetchInquiries = useCallback(async () => {
    if (!token) return;
    setLoadingList(true);
    try {
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.INQUIRIES_LIST), {
        token,
        page,
        limit: LIMIT,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      if (response.data.status_code === 200) {
        setInquiries(response.data.inquiries || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      showToast(lang === "zh" ? "获取咨询失败" : "Failed to load inquiries", "error");
    } finally {
      setLoadingList(false);
    }
  }, [token, page, statusFilter, search, lang, showToast]);

  useEffect(() => {
    if (hasPermission) fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission, page, statusFilter]);

  // Debounce free-text search
  useEffect(() => {
    if (!hasPermission) return;
    const t = setTimeout(() => {
      setPage(1);
      fetchInquiries();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.INQUIRIES_UPDATE), { token, id, status });
      if (response.data.status_code === 200) {
        setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status: status as Inquiry["status"] } : i)));
        showToast(lang === "zh" ? "状态已更新" : "Status updated", "success");
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error);
      showToast(lang === "zh" ? "更新失败" : "Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = lang === "zh" ? "确定要删除此咨询吗?" : "Delete this inquiry? This cannot be undone.";
    if (!window.confirm(confirmMsg)) return;
    try {
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.INQUIRIES_DELETE), { token, id });
      if (response.data.status_code === 200) {
        setInquiries((prev) => prev.filter((i) => i._id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
        showToast(lang === "zh" ? "已删除" : "Inquiry deleted", "success");
        setSelected((prev) => (prev?._id === id ? null : prev));
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      showToast(lang === "zh" ? "删除失败" : "Failed to delete inquiry", "error");
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (!token || !isAdminRole(role)) {
    return null;
  }

  if (!hasPermission) {
    router.push("/admin");
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <MainLayout currentPage={lang === "zh" ? "咨询管理" : "Inquiry Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <PageTitle>{lang === "zh" ? "咨询管理" : "Inquiry Management"}</PageTitle>
            <PageDescription>
              {lang === "zh"
                ? "查看和管理来自 pospal.com.au 和 vendpos.com.au 的客户与潜在客户咨询。"
                : "View and manage customer and lead inquiries submitted from pospal.com.au and vendpos.com.au."}
            </PageDescription>
          </ContentHeader>

          <Toolbar>
            <SearchInput
              placeholder={lang === "zh" ? "按姓名、公司、邮箱或电话搜索" : "Search by name, company, email, or mobile"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <StatusSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">{lang === "zh" ? "所有状态" : "All statuses"}</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </StatusSelect>
          </Toolbar>

          <TableWrap>
            {loadingList ? (
              <LoadingText>Loading...</LoadingText>
            ) : inquiries.length === 0 ? (
              <EmptyState>{lang === "zh" ? "暂无咨询" : "No inquiries found"}</EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>{lang === "zh" ? "姓名" : "Name"}</Th>
                    <Th>{lang === "zh" ? "公司" : "Company"}</Th>
                    <Th>{lang === "zh" ? "联系方式" : "Contact"}</Th>
                    <Th>{lang === "zh" ? "州" : "State"}</Th>
                    <Th>{lang === "zh" ? "业务类型" : "Business Type"}</Th>
                    <Th>{lang === "zh" ? "来源" : "Source"}</Th>
                    <Th>{lang === "zh" ? "提交时间" : "Submitted"}</Th>
                    <Th>{lang === "zh" ? "状态" : "Status"}</Th>
                    <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <Row key={inquiry._id} onClick={() => setSelected(inquiry)}>
                      <Td>{inquiry.full_name}</Td>
                      <Td>{inquiry.company_name}</Td>
                      <Td>
                        {inquiry.email && <div>{inquiry.email}</div>}
                        <div>{inquiry.mobile}</div>
                      </Td>
                      <Td>{inquiry.state || "—"}</Td>
                      <Td>{inquiry.business_type || "—"}</Td>
                      <Td>
                        <SourceBadge>{formatSource(inquiry.source)}</SourceBadge>
                      </Td>
                      <Td>{new Date(inquiry.created_at).toLocaleString()}</Td>
                      <Td onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </StatusSelect>
                      </Td>
                      <Td onClick={(e) => e.stopPropagation()}>
                        <RowActions>
                          <IconButton onClick={() => handleDelete(inquiry._id)}>
                            {lang === "zh" ? "删除" : "Delete"}
                          </IconButton>
                        </RowActions>
                      </Td>
                    </Row>
                  ))}
                </tbody>
              </Table>
            )}
          </TableWrap>

          {totalPages > 1 && (
            <Pagination>
              <PageButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                {lang === "zh" ? "上一页" : "Previous"}
              </PageButton>
              <span>
                {lang === "zh" ? `第 ${page} / ${totalPages} 页` : `Page ${page} of ${totalPages}`}
              </span>
              <PageButton disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                {lang === "zh" ? "下一页" : "Next"}
              </PageButton>
            </Pagination>
          )}
        </MainContent>
      </Container>

      {selected && (
        <ModalOverlay onClick={() => setSelected(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{selected.full_name}</ModalTitle>

            <DetailRow>
              <DetailLabel>{lang === "zh" ? "来源" : "Source"}</DetailLabel>
              <SourceBadge>{formatSource(selected.source)}</SourceBadge>
            </DetailRow>

            <DetailRow>
              <DetailLabel>{lang === "zh" ? "公司" : "Company"}</DetailLabel>
              <DetailValue>{selected.company_name}</DetailValue>
            </DetailRow>

            {selected.email && (
              <DetailRow>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{selected.email}</DetailValue>
              </DetailRow>
            )}

            <DetailRow>
              <DetailLabel>{lang === "zh" ? "电话" : "Mobile"}</DetailLabel>
              <DetailValue>{selected.mobile}</DetailValue>
            </DetailRow>

            {selected.state && (
              <DetailRow>
                <DetailLabel>{lang === "zh" ? "州" : "State"}</DetailLabel>
                <DetailValue>{selected.state}</DetailValue>
              </DetailRow>
            )}

            {selected.business_type && (
              <DetailRow>
                <DetailLabel>{lang === "zh" ? "业务类型" : "Business Type"}</DetailLabel>
                <DetailValue>{selected.business_type}</DetailValue>
              </DetailRow>
            )}

            {selected.message && (
              <DetailRow>
                <DetailLabel>{lang === "zh" ? "留言" : "Message"}</DetailLabel>
                <DetailValue>{selected.message}</DetailValue>
              </DetailRow>
            )}

            <DetailRow>
              <DetailLabel>{lang === "zh" ? "提交时间" : "Submitted"}</DetailLabel>
              <DetailValue>{new Date(selected.created_at).toLocaleString()}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>{lang === "zh" ? "状态" : "Status"}</DetailLabel>
              <StatusBadge $status={selected.status}>{selected.status}</StatusBadge>
            </DetailRow>

            <ModalActions>
              <CloseButton onClick={() => setSelected(null)}>{lang === "zh" ? "关闭" : "Close"}</CloseButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </MainLayout>
  );
}
