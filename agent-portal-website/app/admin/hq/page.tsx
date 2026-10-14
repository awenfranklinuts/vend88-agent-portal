"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import HqStorePicker, { type HqOptions } from "@/components/hq/HqStorePicker";
import HqLoginFields, { generateHqPassword, hqLoginError } from "@/components/hq/HqLoginFields";
import HqOwnBusinessField, { type OwnBusinessChoice } from "@/components/hq/HqOwnBusinessField";
import {
  ActionButton,
  Container,
  ContentHeaderFlex,
  EmptyState,
  EmptySubtext,
  EmptyText,
  FormGroup,
  FormInput,
  FormLabel,
  FormSelect,
  HeaderLeft,
  LoadingText,
  MainContent,
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

/* ─── Types ─── */

interface Hq {
  hq_id: string;
  name: string;
  customer_id: string | null;
  customer_name: string;
  username: string;
  team_id: string | null;
  team_name: string;
  attributed_to_name: string;
  store_count: number;
  store_names: string[];
  own_business: { business_id: string; name: string; warehouse_only: boolean } | null;
  created_by: string;
  created_at: string | null;
}

interface CustomerRow {
  _id: string;
  name: string;
  email: string;
}

/* ─── Styles ─── */

const Count = styled.span<{ $muted?: boolean }>`
  font-weight: ${p => p.$muted ? 400 : 600};
  color: ${p => p.$muted ? "#9ca3af" : "#0a3655"};
`;

const Sub = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
`;

/* Cards - same look as Store Management's */
const HqGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const HqCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  > div:first-child { flex: 1; min-width: 0; }
`;

const CardName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
  overflow-wrap: anywhere;
`;

const StoreList = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  line-height: 1.45;
`;

const StoreCount = styled.span<{ $empty: boolean }>`
  flex-shrink: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  ${p => p.$empty ? "background: #e5e7eb; color: #374151;" : "background: #dbeafe; color: #1e40af;"}
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  min-width: 92px;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  color: #0a3655;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardActions = styled.div`
  display: flex;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const CardButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  &:hover { background: #e5e7eb; }
`;

/* Grid / table toggle - same control as Store, Customer and Team Management */
const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
  flex-shrink: 0;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: ${p => p.$active ? '#3b82f6' : 'transparent'};
  color: ${p => p.$active ? 'white' : '#5c6b7a'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  &:hover { background: ${p => p.$active ? '#2563eb' : '#e5e7eb'}; }
`;

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ClickableRow = styled(Tr)`
  cursor: pointer;
`;

const Hint = styled.p`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: -0.25rem 0 1rem;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #991b1b;
  background: #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0 0 1rem;
`;

/* ─── Page ─── */

export default function HqManagementPage() {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hqs, setHqs] = useState<Hq[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [showCreate, setShowCreate] = useState(false);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [customerFilter, setCustomerFilter] = useState("");
  const [name, setName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [options, setOptions] = useState<HqOptions | null>(null);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [selected, setSelected] = useState<string[]>([]);
  const [ownBusiness, setOwnBusiness] = useState<OwnBusinessChoice>("");
  // A store picked as the head office must stay among the stores attached
  useEffect(() => {
    if (ownBusiness && ownBusiness !== "new" && !selected.includes(ownBusiness)) setOwnBusiness("");
  }, [selected, ownBusiness]);
  const [createError, setCreateError] = useState("");
  const [saving, setSaving] = useState(false);

  const canView = hasPermission(adminProfile, "view_businesses") || hasPermission(adminProfile, "manage_businesses");

  useEffect(() => {
    if (isLoading) return;
    if (!token || !isPortalUser(role)) { router.push("/login"); return; }
    if (adminProfile && !canView) router.push("/admin");
  }, [isLoading, token, role, adminProfile, canView, router]);

  const fetchHqs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/hq/list", { token });
      setHqs(res.data?.hqs || []);
      setCanManage(Boolean(res.data?.can?.manage));
    } catch (err: any) {
      showToast(err?.response?.data?.message || (zh ? "获取总部失败" : "Failed to load HQ accounts"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, zh, showToast]);

  useEffect(() => {
    if (token && canView) fetchHqs();
  }, [token, canView, fetchHqs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hqs;
    return hqs.filter(h => [h.name, h.customer_name, h.username, h.team_name].some(v => (v || "").toLowerCase().includes(q)));
  }, [hqs, search]);

  /* ─── Create ─── */

  const openCreate = async () => {
    setName(""); setCustomerId(""); setCustomerFilter(""); setOptions(null);
    setLogin({ username: "", password: generateHqPassword() }); setSelected([]); setCreateError("");
    setOwnBusiness("");
    setShowCreate(true);
    if (customers.length) return;
    try {
      const res = await axios.post("/api/customer/list", { token });
      setCustomers(res.data?.customers || []);
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || (zh ? "获取客户失败" : "Failed to load customers"));
    }
  };

  // Everything below the customer depends on it: which stores may join and
  // which VendPOS logins may own the HQ.
  const chooseCustomer = async (id: string) => {
    setCustomerId(id); setOptions(null); setSelected([]); setOwnBusiness(""); setCreateError("");
    if (!id) return;
    try {
      const res = await axios.post("/api/hq/options", { token, customer_id: id });
      const opts: HqOptions = res.data;
      setOptions(opts);
      setSelected(opts.businesses.filter(b => !b.blocked_reason).map(b => b.business_id));
      if (!name.trim()) {
        const customer = customers.find(c => c._id === id);
        if (customer?.name) setName(customer.name);
      }
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || (zh ? "获取店铺失败" : "Failed to load this customer's stores"));
    }
  };

  const shownCustomers = useMemo(() => {
    const q = customerFilter.trim().toLowerCase();
    const rows = q ? customers.filter(c => [c.name, c.email].some(v => (v || "").toLowerCase().includes(q))) : customers;
    // Keep the chosen one in the list even when the filter no longer matches it
    const chosen = customers.find(c => c._id === customerId);
    return chosen && !rows.includes(chosen) ? [chosen, ...rows] : rows;
  }, [customers, customerFilter, customerId]);

  const handleCreate = async () => {
    if (!name.trim()) { setCreateError(zh ? "请输入总部名称" : "HQ name is required"); return; }
    if (!customerId) { setCreateError(zh ? "请选择客户" : "Choose a customer"); return; }
    const loginError = hqLoginError(login, { zh });
    if (loginError) { setCreateError(loginError); return; }
    setSaving(true);
    setCreateError("");
    try {
      const res = await axios.post("/api/hq/create", {
        token, name: name.trim(), customer_id: customerId,
        username: login.username.trim(), password: login.password, business_ids: selected,
        own_business: ownBusiness || undefined,
      });
      showToast(zh ? "总部已创建" : "HQ created", "success");
      setShowCreate(false);
      const id = res.data?.hq?.hq_id;
      if (id) router.push(`/admin/hq/${id}`);
      else fetchHqs();
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || (zh ? "创建总部失败" : "Failed to create HQ"));
    } finally {
      setSaving(false);
    }
  };

  /* ─── Render ─── */

  if (isLoading || !token || !adminProfile || !canView) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  const title = zh ? "总部管理" : "HQ Management";
  const showTeam = canSeeAllTeams(adminProfile);

  return (
    <MainLayout currentPage={title} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeaderFlex>
            <HeaderLeft>
              <PageTitle>{title}</PageTitle>
              <PageDescription>
                {zh
                  ? "总部将同一客户的多家店铺归为一组，组内店铺可以在库存应用中相互申请和调拨库存。"
                  : "An HQ groups one customer's stores so they can request and transfer stock between each other in the inventory apps."}
              </PageDescription>
            </HeaderLeft>
            {canManage && (
              <PrimaryButton onClick={openCreate}>+ {zh ? "新建总部" : "New HQ"}</PrimaryButton>
            )}
          </ContentHeaderFlex>

          <SearchFilterContainer>
            <SearchInput
              placeholder={zh ? "按总部、客户、登录用户名或团队搜索" : "Search by HQ, customer, login or team"}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <ViewToggle>
              <ViewButton $active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                <GridIcon /> {zh ? "网格" : "Grid"}
              </ViewButton>
              <ViewButton $active={viewMode === "table"} onClick={() => setViewMode("table")}>
                <ListIcon /> {zh ? "表格" : "Table"}
              </ViewButton>
            </ViewToggle>
          </SearchFilterContainer>

          {!loading && filtered.length > 0 && viewMode === "grid" ? (
            <HqGrid>
              {filtered.map(hq => (
                <HqCard key={hq.hq_id} onClick={() => router.push(`/admin/hq/${hq.hq_id}`)}>
                  <CardHeader>
                    <div>
                      <CardName>{hq.name}</CardName>
                      <StoreList>
                        {hq.store_names.length
                          ? hq.store_names.join(" · ")
                          : (zh ? "尚未加入店铺" : "No stores attached yet")}
                      </StoreList>
                    </div>
                    <StoreCount $empty={!hq.store_count}>
                      {zh ? `${hq.store_count} 家店铺` : `${hq.store_count} ${hq.store_count === 1 ? "store" : "stores"}`}
                    </StoreCount>
                  </CardHeader>
                  <CardInfo>
                    <InfoRow>
                      <InfoLabel>{zh ? "总部仓库:" : "Head office:"}</InfoLabel>
                      <InfoValue>
                        {hq.own_business
                          ? `${hq.own_business.name}${hq.own_business.warehouse_only ? (zh ? "（仅仓库）" : " (warehouse)") : ""}`
                          : (zh ? "未设置" : "None")}
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>{zh ? "客户:" : "Customer:"}</InfoLabel>
                      <InfoValue>{hq.customer_name || "—"}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>{zh ? "总部登录:" : "HQ Login:"}</InfoLabel>
                      <InfoValue>{hq.username || "—"}</InfoValue>
                    </InfoRow>
                    {showTeam && (
                      <InfoRow>
                        <InfoLabel>{zh ? "团队:" : "Team:"}</InfoLabel>
                        <InfoValue>{hq.team_name || (zh ? "直营" : "House")}</InfoValue>
                      </InfoRow>
                    )}
                    <InfoRow>
                      <InfoLabel>{zh ? "创建:" : "Created:"}</InfoLabel>
                      <InfoValue>{hq.created_at ? new Date(hq.created_at).toLocaleDateString("en-AU") : "—"}</InfoValue>
                    </InfoRow>
                  </CardInfo>
                  <CardActions>
                    <CardButton onClick={e => { e.stopPropagation(); router.push(`/admin/hq/${hq.hq_id}`); }}>
                      <EyeIcon /> {zh ? "详情" : "Details"}
                    </CardButton>
                  </CardActions>
                </HqCard>
              ))}
            </HqGrid>
          ) : (
          <TableContainer>
            {loading ? (
              <LoadingText>Loading...</LoadingText>
            ) : filtered.length === 0 ? (
              <EmptyState>
                <EmptyText>{hqs.length ? (zh ? "没有匹配的总部" : "No matching HQ accounts") : (zh ? "还没有总部" : "No HQ accounts yet")}</EmptyText>
                <EmptySubtext>
                  {hqs.length
                    ? (zh ? "尝试调整搜索条件" : "Try adjusting your search")
                    : canManage
                      ? (zh ? "为拥有多家店铺的客户创建总部" : "Create one for a customer who runs more than one store")
                      : (zh ? "您的店铺尚未加入任何总部" : "None of your stores belong to an HQ yet")}
                </EmptySubtext>
              </EmptyState>
            ) : (
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th>{zh ? "总部" : "HQ"}</Th>
                      <Th>{zh ? "客户" : "Customer"}</Th>
                      <Th>{zh ? "总部登录" : "HQ login"}</Th>
                      <Th>{zh ? "店铺" : "Stores"}</Th>
                      {showTeam && <Th>{zh ? "团队" : "Team"}</Th>}
                      <Th>{zh ? "操作" : "Actions"}</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {filtered.map(hq => (
                      <ClickableRow key={hq.hq_id} onClick={() => router.push(`/admin/hq/${hq.hq_id}`)}>
                        <Td><div style={{ fontWeight: 600 }}>{hq.name}</div></Td>
                        <Td>{hq.customer_name || <Sub>—</Sub>}</Td>
                        <Td>
                          {hq.username || <Sub>—</Sub>}
                        </Td>
                        <Td><Count $muted={!hq.store_count}>{hq.store_count}</Count></Td>
                        {showTeam && <Td>{hq.team_name || <Sub>{zh ? "直营" : "House"}</Sub>}</Td>}
                        <Td>
                          <ActionButton $variant="view" onClick={e => { e.stopPropagation(); router.push(`/admin/hq/${hq.hq_id}`); }}>
                            {canManage ? (zh ? "管理" : "Manage") : (zh ? "查看" : "View")}
                          </ActionButton>
                        </Td>
                      </ClickableRow>
                    ))}
                  </Tbody>
                </Table>
              </TableWrapper>
            )}
          </TableContainer>
          )}
        </MainContent>
      </Container>

      <Modal $show={showCreate} onClick={() => !saving && setShowCreate(false)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
          <ModalTitle>{zh ? "新建总部" : "New HQ"}</ModalTitle>

          <FormGroup>
            <FormLabel>{zh ? "客户" : "Customer"} *</FormLabel>
            <FormInput
              value={customerFilter}
              onChange={e => setCustomerFilter(e.target.value)}
              placeholder={zh ? "按名称或邮箱筛选" : "Filter by name or email"}
              style={{ marginBottom: "0.5rem" }}
            />
            <FormSelect value={customerId} onChange={e => chooseCustomer(e.target.value)}>
              <option value="">{zh ? "选择客户…" : "Choose a customer…"}</option>
              {shownCustomers.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name || c.email || c._id}{c.email && c.name ? ` — ${c.email}` : ""}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          <Hint>
            {zh
              ? "总部内的每家店铺都必须属于该客户。加入总部后，组内其他店铺可以调入或调出其库存。"
              : "Every store in the HQ must belong to this customer. Joining lets the other stores in the group move its stock."}
          </Hint>

          <FormGroup>
            <FormLabel>{zh ? "总部名称" : "HQ name"} *</FormLabel>
            <FormInput value={name} onChange={e => setName(e.target.value)} placeholder={zh ? "例如：Joe 面馆集团" : "e.g. Joe's Noodles Group"} />
          </FormGroup>

          <FormLabel>{zh ? "总部登录" : "HQ login"}</FormLabel>
          <Hint style={{ marginTop: 0 }}>
            {zh
              ? "总部自己的登录账户，与各店铺的登录分开，用于以总部身份登录库存应用并切换店铺。"
              : "The HQ's own login, separate from its stores' logins. Used to sign in to the inventory apps as the HQ and switch between its stores."}
          </Hint>
          <HqLoginFields username={login.username} password={login.password} onChange={setLogin} disabled={saving} />

          {options && (
            <>

              <FormLabel>{zh ? "加入的店铺" : "Stores to attach"}</FormLabel>
              <HqStorePicker businesses={options.businesses} selected={selected} onChange={setSelected} />

              <FormLabel>{zh ? "总部" : "Head office"}</FormLabel>
              <Hint style={{ marginTop: 0 }}>
                {zh
                  ? "总部可持有库存，并通过调拨向各店铺供货。"
                  : "A head office can hold stock and supply the stores through stock transfers."}
              </Hint>
              <HqOwnBusinessField
                value={ownBusiness}
                onChange={setOwnBusiness}
                stores={options.businesses.filter(b => selected.includes(b.business_id))}
              />
            </>
          )}

          {createError && <ErrorText>{createError}</ErrorText>}

          <ModalActions>
            <ModalButton onClick={() => setShowCreate(false)} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $primary onClick={handleCreate} disabled={saving || !options}>
              {saving ? (zh ? "创建中..." : "Creating...") : (zh ? "创建总部" : "Create HQ")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
