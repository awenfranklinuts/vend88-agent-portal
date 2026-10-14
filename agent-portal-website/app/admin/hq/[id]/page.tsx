"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import HqStorePicker, { StoreMeta, type HqOptions } from "@/components/hq/HqStorePicker";
import HqLoginFields, { hqLoginError } from "@/components/hq/HqLoginFields";
import HqOwnBusinessField, { type OwnBusinessChoice } from "@/components/hq/HqOwnBusinessField";
import {
  ActionButton,
  Container,
  EmptyState,
  EmptyText,
  FormGroup,
  FormInput,
  FormLabel,
  LoadingText,
  MainContent,
  Modal,
  ModalActions,
  ModalButton,
  ModalContent,
  ModalText,
  ModalTitle,
  SecondaryButton,
  StatusBadge,
  Table,
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
  /** Present for administrators only */
  password?: string;
  team_name: string;
  attributed_to_name: string;
  store_count: number;
  own_business: { business_id: string; name: string; warehouse_only: boolean } | null;
  created_by: string;
  created_at: string | null;
}

interface Store {
  business_id: string;
  name: string;
  business_name: string;
  shop_count: number;
  status: string;
  team_name: string;
  transfers_in_flight: number;
  /** This HQ's head office */
  is_hq: boolean;
  /** Made for the HQ: no POS shop, can't be detached */
  warehouse_only: boolean;
  can_open: boolean;
}

interface ActivityRow {
  _id: string;
  action: string;
  details: string;
  actor_email: string;
  timestamp: string;
}

const ACTION_LABELS: Record<string, { en: string; zh: string }> = {
  hq_created: { en: "Created", zh: "创建" },
  hq_updated: { en: "Updated", zh: "更新" },
  hq_attached: { en: "Attached", zh: "加入" },
  hq_detached: { en: "Detached", zh: "移出" },
  hq_deleted: { en: "Deleted", zh: "删除" },
};

/* ─── Styles ─── */

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin: 1rem 0;
  border: none;
  background: none;
  color: #1a237e;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  @media (max-width: 968px) { padding: 1.25rem; }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0;
`;

const HqName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0 0 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.375rem;
`;

const DetailValue = styled.div`
  font-size: 0.9375rem;
  color: #0a3655;
  font-weight: 500;
  word-break: break-word;
`;

const Muted = styled.span`
  color: #9ca3af;
  font-weight: 400;
`;

const Sub = styled.div`
  font-size: 0.8125rem;
  color: #5c6b7a;
  font-weight: 400;
`;

const LinkText = styled.a`
  color: #1e40af;
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Note = styled.p`
  font-size: 0.875rem;
  color: #1e40af;
  background: #dbeafe;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0 0 1rem;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #991b1b;
  background: #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0 0 1rem;
`;

const HeadBadge = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: rgba(26, 35, 126, 0.1);
  color: #1a237e;
  vertical-align: middle;
`;

const Credential = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9375rem;
  color: #0a3655;
`;

const CopyButton = styled.button`
  border: none;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 6px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #bfdbfe; }
`;

const InFlight = styled.span<{ $count: number }>`
  font-weight: ${p => p.$count ? 600 : 400};
  color: ${p => p.$count ? "#92400e" : "#9ca3af"};
`;

const ActionBadge = styled.span<{ $action: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  ${p => p.$action === "hq_created" || p.$action === "hq_attached"
    ? "background: rgba(34, 197, 94, 0.12); color: #15803d;"
    : p.$action === "hq_detached" || p.$action === "hq_deleted"
      ? "background: rgba(239, 68, 68, 0.12); color: #991b1b;"
      : "background: rgba(59, 130, 246, 0.12); color: #1e40af;"}
`;

const formatDate = (value: string | null, lang: string) =>
  value ? new Date(value).toLocaleString(lang === "zh" ? "zh-CN" : "en-AU", { dateStyle: "medium", timeStyle: "short" }) : "";

/* ─── Page ─── */

export default function HqDetailPage() {
  const router = useRouter();
  const id = useParams<{ id: string }>()?.id;
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const zh = lang === "zh";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hq, setHq] = useState<Hq | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // One modal at a time; each carries its own error so a refusal (store in
  // flight, wrong customer) is shown where the admin acted, not as a toast.
  const [modal, setModal] = useState<"" | "edit" | "attach" | "detach" | "delete" | "head">("");
  const [headChoice, setHeadChoice] = useState<OwnBusinessChoice>("new");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<HqOptions | null>(null);
  const [editName, setEditName] = useState("");
  const [editLogin, setEditLogin] = useState({ username: "", password: "" });
  const [attachIds, setAttachIds] = useState<string[]>([]);
  const [detaching, setDetaching] = useState<Store | null>(null);

  const canView = hasPermission(adminProfile, "view_businesses") || hasPermission(adminProfile, "manage_businesses");

  useEffect(() => {
    if (isLoading) return;
    if (!token || !isPortalUser(role)) { router.push("/login"); return; }
    if (adminProfile && !canView) router.push("/admin");
  }, [isLoading, token, role, adminProfile, canView, router]);

  const fetchAll = useCallback(async () => {
    if (!token || !id) return;
    try {
      const [detail, log] = await Promise.all([
        axios.post("/api/hq/detail", { token, hq_id: id }),
        axios.post("/api/hq/activity", { token, hq_id: id }),
      ]);
      setHq(detail.data.hq);
      setStores(detail.data.stores || []);
      setCanManage(Boolean(detail.data.can?.manage));
      setActivity(log.data.activity || []);
    } catch (err: any) {
      if (err?.response?.status === 404) setNotFound(true);
      else showToast(err?.response?.data?.message || (zh ? "获取总部失败" : "Failed to load HQ"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, id, zh, showToast]);

  useEffect(() => {
    if (token && canView) fetchAll();
  }, [token, canView, fetchAll]);

  const loadOptions = async () => {
    setOptions(null);
    try {
      const res = await axios.post("/api/hq/options", { token, hq_id: id });
      setOptions(res.data);
      return res.data as HqOptions;
    } catch (err: any) {
      setModalError(err?.response?.data?.message || (zh ? "加载失败" : "Failed to load options"));
      return null;
    }
  };

  const openModal = async (which: typeof modal, store?: Store) => {
    setModalError("");
    setModal(which);
    if (which === "edit" && hq) {
      setEditName(hq.name);
      setEditLogin({ username: hq.username || "", password: "" });
    }
    if (which === "attach") {
      setAttachIds([]);
      const opts = await loadOptions();
      if (opts) setAttachIds(opts.businesses.filter(b => !b.blocked_reason).map(b => b.business_id));
    }
    if (which === "detach" && store) setDetaching(store);
    if (which === "head") setHeadChoice("new");
  };

  const closeModal = () => { if (!saving) setModal(""); };

  // Runs one change, then reloads the page's data. Errors stay in the modal.
  const run = async (path: string, body: Record<string, unknown>, success: string, after?: () => void) => {
    setSaving(true);
    setModalError("");
    try {
      await axios.post(`/api/hq/${path}`, { token, hq_id: id, ...body });
      showToast(success, "success");
      setModal("");
      if (after) after();
      else await fetchAll();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || (zh ? "操作失败" : "Something went wrong"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (!hq) return;
    const body: Record<string, unknown> = {};
    if (editName.trim() !== hq.name) body.name = editName.trim();
    // An HQ made before logins existed has no password yet, so it must be set
    const loginError = hqLoginError(editLogin, { passwordOptional: Boolean(hq.password), zh });
    if (loginError) { setModalError(loginError); return; }
    if (editLogin.username.trim() !== hq.username) body.username = editLogin.username.trim();
    if (editLogin.password) body.password = editLogin.password;
    if (!Object.keys(body).length) { setModal(""); return; }
    run("update", body, zh ? "总部已更新" : "HQ updated");
  };

  const copy = async (value: string, what: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(zh ? `${what}已复制` : `${what} copied`, "success");
    } catch {
      showToast(zh ? "复制失败" : "Could not copy", "error");
    }
  };

  /* ─── Render ─── */

  if (isLoading || !token || !adminProfile || !canView || loading) {
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
          <BackButton onClick={() => router.push("/admin/hq")}>← {zh ? "返回总部列表" : "Back to HQ accounts"}</BackButton>

          {notFound || !hq ? (
            <Card>
              <EmptyState><EmptyText>{zh ? "未找到该总部" : "HQ not found"}</EmptyText></EmptyState>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div>
                    <HqName>{hq.name}</HqName>
                    <Sub>{zh ? `${hq.store_count} 家店铺` : `${hq.store_count} ${hq.store_count === 1 ? "store" : "stores"}`}</Sub>
                  </div>
                  {canManage && (
                    <Actions>
                      <SecondaryButton onClick={() => openModal("edit")}>{zh ? "编辑" : "Edit"}</SecondaryButton>
                    </Actions>
                  )}
                </CardHeader>
                <DetailGrid>
                  <div>
                    <DetailLabel>{zh ? "客户" : "Customer"}</DetailLabel>
                    <DetailValue>
                      {hq.customer_id
                        ? <LinkText onClick={() => router.push(`/admin/customers/${hq.customer_id}`)}>{hq.customer_name || hq.customer_id}</LinkText>
                        : <Muted>—</Muted>}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailLabel>{zh ? "总部登录" : "HQ login"}</DetailLabel>
                    {hq.username ? (
                      <>
                        <Credential>
                          {hq.username}
                          <CopyButton onClick={() => copy(hq.username, zh ? "用户名" : "Username")}>{zh ? "复制" : "Copy"}</CopyButton>
                        </Credential>
                        {hq.password !== undefined && (
                          <Credential>
                            {hq.password || <Muted>{zh ? "未设置密码" : "No password set"}</Muted>}
                            {hq.password && (
                              <CopyButton onClick={() => copy(hq.password || "", zh ? "密码" : "Password")}>{zh ? "复制" : "Copy"}</CopyButton>
                            )}
                          </Credential>
                        )}
                      </>
                    ) : (
                      <DetailValue><Muted>{canManage ? (zh ? "尚未设置，请点击编辑添加" : "Not set yet. Use Edit to add one.") : (zh ? "尚未设置" : "Not set yet")}</Muted></DetailValue>
                    )}
                  </div>
                  {showTeam && (
                    <div>
                      <DetailLabel>{zh ? "团队" : "Team"}</DetailLabel>
                      <DetailValue>
                        {hq.team_name || <Muted>{zh ? "直营" : "House account"}</Muted>}
                        {hq.attributed_to_name && <Sub>{hq.attributed_to_name}</Sub>}
                      </DetailValue>
                    </div>
                  )}
                  <div>
                    <DetailLabel>{zh ? "总部仓库" : "Head office"}</DetailLabel>
                    <DetailValue>
                      {hq.own_business ? (
                        <>
                          {hq.own_business.name}
                          <Sub>
                            {hq.own_business.warehouse_only
                              ? (zh ? "仅仓库，不出现在 POS" : "Warehouse only, not in the POS")
                              : (zh ? "店铺兼作总部" : "A store acting as head office")}
                          </Sub>
                        </>
                      ) : (
                        <Muted>{zh ? "未设置" : "None"}</Muted>
                      )}
                      {canManage && !hq.own_business?.warehouse_only && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <ActionButton $variant="view" onClick={() => openModal("head")}>
                            {hq.own_business ? (zh ? "更改" : "Change") : (zh ? "设置总部" : "Set up head office")}
                          </ActionButton>
                        </div>
                      )}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailLabel>{zh ? "创建" : "Created"}</DetailLabel>
                    <DetailValue>
                      {formatDate(hq.created_at, lang) || <Muted>—</Muted>}
                      {hq.created_by && <Sub>{hq.created_by}</Sub>}
                    </DetailValue>
                  </div>
                </DetailGrid>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{zh ? "店铺" : "Stores"}</CardTitle>
                  {canManage && (
                    <Actions>
                      <SecondaryButton onClick={() => openModal("attach")}>+ {zh ? "加入店铺" : "Attach stores"}</SecondaryButton>
                    </Actions>
                  )}
                </CardHeader>
                {stores.length < 2 && (
                  <Note>
                    {zh
                      ? "至少需要两家店铺，组内才能相互申请和调拨库存。"
                      : "Stores can request and transfer stock between each other once the HQ has at least two."}
                  </Note>
                )}
                {stores.length === 0 ? (
                  <EmptyState><EmptyText>{zh ? "还没有店铺" : "No stores attached yet"}</EmptyText></EmptyState>
                ) : (
                  <TableScroll>
                    <Table>
                      <Thead>
                        <tr>
                          <Th>{zh ? "店铺" : "Store"}</Th>
                          <Th>{zh ? "状态" : "Status"}</Th>
                          {showTeam && <Th>{zh ? "团队" : "Team"}</Th>}
                          <Th>{zh ? "在途调拨" : "Transfers in flight"}</Th>
                          {canManage && <Th>{zh ? "操作" : "Actions"}</Th>}
                        </tr>
                      </Thead>
                      <Tbody>
                        {stores.map(s => (
                          <Tr key={s.business_id}>
                            <Td>
                              {s.can_open
                                ? <LinkText onClick={() => router.push(`/admin/businesses/${s.business_id}`)}>{s.name}</LinkText>
                                : <span style={{ fontWeight: 600 }}>{s.name}</span>}
                              {s.is_hq && <HeadBadge>{s.warehouse_only ? (zh ? "总部仓库" : "HQ warehouse") : (zh ? "总部" : "Head office")}</HeadBadge>}
                              <StoreMeta name={s.name} business_name={s.business_name} shop_count={s.shop_count} />
                            </Td>
                            <Td>{s.status ? <StatusBadge $status={s.status}>{s.status}</StatusBadge> : <Muted>—</Muted>}</Td>
                            {showTeam && <Td>{s.team_name || <Muted>{zh ? "直营" : "House"}</Muted>}</Td>}
                            <Td><InFlight $count={s.transfers_in_flight}>{s.transfers_in_flight}</InFlight></Td>
                            {canManage && (
                              <Td>
                                <ActionButton
                                  $variant="delete"
                                  disabled={s.transfers_in_flight > 0 || s.warehouse_only}
                                  title={s.warehouse_only
                                    ? (zh ? "总部仓库始终属于该总部" : "The HQ warehouse always stays with its HQ")
                                    : s.transfers_in_flight > 0
                                      ? (zh ? "有在途调拨，收货后才能移出" : "Has transfers in flight; they must be received first")
                                      : undefined}
                                  onClick={() => openModal("detach", s)}
                                >
                                  {zh ? "移出" : "Detach"}
                                </ActionButton>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableScroll>
                )}
              </Card>

              <Card>
                <CardHeader><CardTitle>{zh ? "活动历史" : "Activity History"}</CardTitle></CardHeader>
                {activity.length === 0 ? (
                  <EmptyState><EmptyText>{zh ? "暂无活动" : "No activity yet"}</EmptyText></EmptyState>
                ) : (
                  <TableScroll>
                    <Table>
                      <Thead>
                        <tr>
                          <Th>{zh ? "时间" : "When"}</Th>
                          <Th>{zh ? "操作" : "Action"}</Th>
                          <Th>{zh ? "详情" : "Details"}</Th>
                          <Th>{zh ? "操作人" : "By"}</Th>
                        </tr>
                      </Thead>
                      <Tbody>
                        {activity.map(a => (
                          <Tr key={a._id}>
                            <Td style={{ whiteSpace: "nowrap" }}>{formatDate(a.timestamp, lang)}</Td>
                            <Td><ActionBadge $action={a.action}>{ACTION_LABELS[a.action]?.[lang] || a.action}</ActionBadge></Td>
                            <Td>{a.details}</Td>
                            <Td>{a.actor_email || <Muted>—</Muted>}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableScroll>
                )}
              </Card>

              {canManage && (
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>{zh ? "删除总部" : "Delete HQ"}</CardTitle>
                      <Sub>
                        {stores.length
                          ? (zh ? "请先移出所有店铺。" : "Detach every store first.")
                          : (zh ? "该总部没有店铺，可以删除。" : "This HQ has no stores and can be deleted.")}
                      </Sub>
                    </div>
                    <ActionButton $variant="delete" disabled={stores.length > 0} onClick={() => openModal("delete")}>
                      {zh ? "删除" : "Delete"}
                    </ActionButton>
                  </CardHeader>
                </Card>
              )}
            </>
          )}
        </MainContent>
      </Container>

      {/* Edit */}
      <Modal $show={modal === "edit"} onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
          <ModalTitle>{zh ? "编辑总部" : "Edit HQ"}</ModalTitle>
          <FormGroup>
            <FormLabel>{zh ? "总部名称" : "HQ name"}</FormLabel>
            <FormInput value={editName} onChange={e => setEditName(e.target.value)} />
          </FormGroup>
          <FormLabel>{zh ? "总部登录" : "HQ login"}</FormLabel>
          <HqLoginFields
            username={editLogin.username}
            password={editLogin.password}
            onChange={setEditLogin}
            disabled={saving}
            editing={Boolean(hq?.password)}
          />
          {modalError && <ErrorText>{modalError}</ErrorText>}
          <ModalActions>
            <ModalButton onClick={closeModal} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton $primary onClick={handleEdit} disabled={saving || !editName.trim()}>
              {saving ? (zh ? "保存中..." : "Saving...") : (zh ? "保存" : "Save")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Attach */}
      <Modal $show={modal === "attach"} onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
          <ModalTitle>{zh ? "加入店铺" : "Attach stores"}</ModalTitle>
          <ModalText>
            {zh
              ? `只能加入属于 ${hq?.customer_name || "该客户"} 的店铺。加入后，组内其他店铺可以调入或调出其库存。`
              : `Only stores belonging to ${hq?.customer_name || "this HQ's customer"} can join. Once attached, the other stores in the group can move its stock.`}
          </ModalText>
          {options ? (
            <HqStorePicker businesses={options.businesses} selected={attachIds} onChange={setAttachIds} />
          ) : !modalError && <LoadingText>Loading...</LoadingText>}
          {modalError && <ErrorText>{modalError}</ErrorText>}
          <ModalActions>
            <ModalButton onClick={closeModal} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton
              $primary
              disabled={saving || !attachIds.length}
              onClick={() => run("attach", { business_ids: attachIds }, zh ? "店铺已加入" : "Stores attached")}
            >
              {saving ? (zh ? "加入中..." : "Attaching...") : (zh ? `加入 ${attachIds.length} 家` : `Attach ${attachIds.length}`)}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Head office */}
      <Modal $show={modal === "head"} onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
          <ModalTitle>{zh ? "设置总部" : "Set up head office"}</ModalTitle>
          <ModalText>
            {zh
              ? "总部可持有库存，并通过调拨向各店铺供货。新建的总部仓库会一直属于该总部。"
              : "A head office can hold stock and supply the stores through stock transfers. A new HQ warehouse stays with this HQ for good."}
          </ModalText>
          <HqOwnBusinessField
            value={headChoice}
            onChange={setHeadChoice}
            allowNone={false}
            stores={stores.filter(st => !st.warehouse_only && !st.is_hq).map(st => ({ business_id: st.business_id, name: st.name }))}
          />
          {modalError && <ErrorText>{modalError}</ErrorText>}
          <ModalActions>
            <ModalButton onClick={closeModal} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton
              $primary
              disabled={saving || !headChoice}
              onClick={() => run(
                "own-business",
                headChoice === "new" ? { mode: "new" } : { mode: "existing", business_id: headChoice },
                zh ? "总部已设置" : "Head office set",
              )}
            >
              {saving ? (zh ? "保存中..." : "Saving...") : (zh ? "保存" : "Save")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Detach */}
      <Modal $show={modal === "detach"} onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
          <ModalTitle>{zh ? "移出店铺" : "Detach store"}</ModalTitle>
          <ModalText>
            {zh
              ? `将 ${detaching?.name} 移出 ${hq?.name}？该店铺将不能再与组内其他店铺申请或调拨库存，尚未发出的调拨草稿将无法发出。`
              : `Detach ${detaching?.name} from ${hq?.name}? It will no longer be able to request or transfer stock with the other stores, and any draft transfers with it can no longer be dispatched.`}
          </ModalText>
          {modalError && <ErrorText>{modalError}</ErrorText>}
          <ModalActions>
            <ModalButton onClick={closeModal} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton
              $danger
              disabled={saving}
              onClick={() => detaching && run("detach", { business_id: detaching.business_id }, zh ? "店铺已移出" : "Store detached")}
            >
              {saving ? (zh ? "移出中..." : "Detaching...") : (zh ? "移出" : "Detach")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete */}
      <Modal $show={modal === "delete"} onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
          <ModalTitle>{zh ? "删除总部" : "Delete HQ"}</ModalTitle>
          <ModalText>{zh ? `确定删除 ${hq?.name}？此操作无法撤销。` : `Delete ${hq?.name}? This cannot be undone.`}</ModalText>
          {modalError && <ErrorText>{modalError}</ErrorText>}
          <ModalActions>
            <ModalButton onClick={closeModal} disabled={saving}>{zh ? "取消" : "Cancel"}</ModalButton>
            <ModalButton
              $danger
              disabled={saving}
              onClick={() => run("delete", {}, zh ? "总部已删除" : "HQ deleted", () => router.push("/admin/hq"))}
            >
              {saving ? (zh ? "删除中..." : "Deleting...") : (zh ? "删除" : "Delete")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
