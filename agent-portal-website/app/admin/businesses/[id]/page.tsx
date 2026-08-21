"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../../components/layout/AdminSidebar";
import axios from "axios";

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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  color: #0a3655;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: #f7faff;
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const QuickActionsBar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const QuickActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  flex: 1;
  min-width: 150px;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${p => {
    switch(p.$variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; transform: translateY(-2px); }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; transform: translateY(-2px); }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; transform: translateY(-2px); }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover { background: #e5e7eb; }
        `;
    }
  }}
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const TabContent = styled.div`
  padding: 2rem;

  @media (max-width: 968px) {
    padding: 1.5rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ef;
`;

const BusinessName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const BusinessLocation = styled.div`
  font-size: 1rem;
  color: #5c6b7a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #0a3655;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;

  ${p => {
    const normalizedStatus = p.$status?.toLowerCase().replace(/_/g, ' ').replace(/ /g, '');
    switch(normalizedStatus) {
      case 'active':
        return 'background: #d1fae5; color: #065f46;';
      case 'setup':
      case 'insetup':
        return 'background: #dbeafe; color: #1e40af;';
      case 'inactive':
        return 'background: #e5e7eb; color: #374151;';
      case 'suspended':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

const ErrorText = styled.div`
  text-align: center;
  font-size: 1.125rem;
  color: #991b1b;
  padding: 4rem;
  background: #fee2e2;
  border-radius: 12px;
  margin: 2rem 0;
`;

const PermissionList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PermissionCard = styled.div`
  background: #f7faff;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e0e7ef;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const PermissionName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.75rem;
`;

const PermissionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const Modal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${p => p.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f7faff;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${p => p.$primary ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    &:hover { background: #d1d5db; }
  `}
`;

const OwnerCard = styled.div`
  background: #f7faff;
  border: 1px solid #e0e7ef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const OwnerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
`;

const OwnerActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e7ef;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const EditButton = styled.button<{ $variant?: 'save' | 'cancel' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${p => p.$variant === 'save' ? `
    background: #10b981;
    color: white;
    &:hover {
      background: #059669;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    &:hover { background: #d1d5db; }
  `}
`;

// Icon Components
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

interface Business {
  _id: string;
  owner_id?: string;
  customer_id?: string;
  name: string;
  status: string;
  abn?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  contact_email?: string;
  contactPhone?: string;
  contact_phone?: string;
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  registrationId?: string;
  registration_id?: string;
}

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;
  const { token, role, isLoading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [originalBusiness, setOriginalBusiness] = useState<Business | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [isEditMode, setIsEditMode] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (!authLoading && token && !isAdminRole(role)) {
      router.push("/agent");
    }
  }, [token, role, authLoading, router]);

  useEffect(() => {
    if (token && businessId) {
      fetchBusinessDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, businessId]);

  const fetchBusinessDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch business info by ID
      const businessResponse = await axios.post(
        `/api/businesses/${businessId}`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (businessResponse.data.status_code === 200) {
        const foundBusiness = businessResponse.data.data;

        if (foundBusiness) {
          setBusiness(foundBusiness);
          setOriginalBusiness(foundBusiness);

          // Fetch owner details using customer_id
          const customerId = foundBusiness.customer_id || foundBusiness.owner_id;
          if (customerId) {
            try {
              const customerResponse = await axios.post(
                '/api/customer/list',
                { token },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (customerResponse.data.status_code === 200) {
                const customersList = customerResponse.data.customers || customerResponse.data.data || [];
                const ownerData = customersList.find(
                  (c: any) => c._id === customerId
                );
                setOwner(ownerData || null);
              }
            } catch (err) {
              console.error('Failed to fetch owner:', err);
            }
          }

          // Fetch shops linked to this business
          try {
            const shopResponse = await axios.post(
              '/api/shops/list',
              { token },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (shopResponse.data.status_code === 200) {
              const shopsList = shopResponse.data.data || [];
              setShops(shopsList.filter((s: any) => s.business_id === foundBusiness._id));
            }
          } catch (err) {
            console.error('Failed to fetch shops:', err);
          }
        } else {
          setError(lang === "zh" ? "未找到业务" : "Business not found");
        }
      }
    } catch (err) {
      console.error("Failed to fetch business details:", err);
      setError(lang === "zh" ? "加载失败" : "Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBusiness = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setBusiness(originalBusiness);
    setIsEditMode(false);
  };

  const handleSaveBusiness = async () => {
    if (!business) return;

    try {
      // TODO: Replace with real API call
      setOriginalBusiness(business);
      setIsEditMode(false);
      showToast(
        lang === 'zh' ? '业务信息已更新' : 'Business information updated',
        'success'
      );
    } catch (err) {
      console.error('Failed to update business:', err);
      showToast(
        lang === 'zh' ? '更新失败' : 'Update failed',
        'error'
      );
    }
  };

  const handleBusinessChange = (field: keyof Business, value: any) => {
    if (business) {
      setBusiness({ ...business, [field]: value });
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!business) return;

    try {
      // TODO: Replace with real API call
      setBusiness({ ...business, status: newStatus });
      setOriginalBusiness({ ...business, status: newStatus });
      setShowStatusModal(false);
      showToast(
        lang === 'zh' ? '状态已更改' : 'Status changed',
        'success'
      );
    } catch (err) {
      console.error('Failed to change status:', err);
      showToast(
        lang === 'zh' ? '状态更改失败' : 'Failed to change status',
        'error'
      );
    }
  };

  const handleEmailOwner = () => {
    if (owner?.email) {
      window.location.href = `mailto:${owner.email}`;
    }
  };

  const handleViewOwner = () => {
    if (owner?._id) {
      router.push(`/admin/customers`);
    }
  };

  const handleViewRegistration = () => {
    const registrationId = business?.registrationId || business?.registration_id;
    if (registrationId) {
      router.push(`/admin/registrations/${registrationId}`);
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return 'N/A';
    return status
      .replace(/_/g, ' ')
      .toUpperCase();
  };

  const formatShopLocation = (location: any) => {
    if (typeof location === 'string' && location.trim()) return location;
    return null;
  };

  if (authLoading) {
    return (
      <Container>
        <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
      </Container>
    );
  }

  if (!token || !isAdminRole(role)) {
    return null;
  }

  return (
    <MainLayout
      currentPage={lang === "zh" ? "业务详情" : "Business Details"}
      onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push('/admin/businesses')}>
            <span>←</span>
            {lang === "zh" ? "返回业务列表" : "Back to Businesses"}
          </BackButton>

          {isLoading ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : business ? (
            <>
              {/* Business Name Header */}
              <BusinessName>{business.name || 'N/A'}</BusinessName>
              {(business.suburb || business.state || business.address) && (
                <BusinessLocation>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {business.address && `${business.address}, `}
                  {business.suburb && `${business.suburb}`}
                  {business.state && `, ${business.state}`}
                  {business.postcode && ` ${business.postcode}`}
                </BusinessLocation>
              )}

              {/* Quick Actions Bar */}
              <QuickActionsBar>
                {!isEditMode ? (
                  <QuickActionButton $variant="primary" onClick={handleEditBusiness}>
                    <EditIcon />
                    {lang === "zh" ? "编辑业务" : "Edit Business"}
                  </QuickActionButton>
                ) : (
                  <QuickActionButton $variant="success" onClick={handleSaveBusiness}>
                    <SaveIcon />
                    {lang === "zh" ? "保存更改" : "Save Changes"}
                  </QuickActionButton>
                )}
                {owner && (
                  <QuickActionButton onClick={handleEmailOwner}>
                    <MailIcon />
                    {lang === "zh" ? "联系所有者" : "Contact Owner"}
                  </QuickActionButton>
                )}
              </QuickActionsBar>

              <TabContainer>
                <TabContent>
                  {/* Owner Information Card */}
                  {owner && (
                    <OwnerCard>
                      <OwnerName>
                        <UserIcon /> {lang === "zh" ? "业务所有者" : "Business Owner"}
                      </OwnerName>
                      <InfoGrid>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "姓名" : "Name"}</InfoLabel>
                          <InfoValue>{owner.name || 'N/A'}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "邮箱" : "Email"}</InfoLabel>
                          <InfoValue>{owner.email || 'N/A'}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "电话" : "Phone"}</InfoLabel>
                          <InfoValue>{owner.phone || 'N/A'}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "客户 ID" : "Customer ID"}</InfoLabel>
                          <InfoValue>{owner._id || 'N/A'}</InfoValue>
                        </InfoItem>
                      </InfoGrid>
                      <OwnerActions>
                        <QuickActionButton onClick={handleEmailOwner}>
                          <MailIcon />
                          {lang === "zh" ? "发送邮件" : "Send Email"}
                        </QuickActionButton>
                        <QuickActionButton onClick={handleViewOwner}>
                          <UserIcon />
                          {lang === "zh" ? "查看客户资料" : "View Profile"}
                        </QuickActionButton>
                      </OwnerActions>
                    </OwnerCard>
                  )}

                  {/* Business Information Section */}
                  <CardTitle>{lang === "zh" ? "业务信息" : "Business Information"}</CardTitle>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "业务 ID" : "Business ID"}</InfoLabel>
                      <InfoValue>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span>{business._id}</span>
                          {(business.registrationId || business.registration_id) && (
                            <button
                              onClick={handleViewRegistration}
                              style={{
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.75rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              📋 {lang === "zh" ? "查看注册表单" : "View Form"}
                            </button>
                          )}
                        </div>
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "业务名称" : "Business Name"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.name || ''}
                          onChange={(e) => handleBusinessChange('name', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.name || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "ABN" : "ABN"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.abn || ''}
                          onChange={(e) => handleBusinessChange('abn', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.abn || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "状态" : "Status"}</InfoLabel>
                      {isEditMode ? (
                        <Select
                          value={business.status || ''}
                          onChange={(e) => handleBusinessChange('status', e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="setup">Setup</option>
                          <option value="in_setup">In Setup</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </Select>
                      ) : (
                        <StatusBadge $status={business.status || 'N/A'}>
                          {formatStatus(business.status || 'inactive')}
                        </StatusBadge>
                      )}
                    </InfoItem>
                  </InfoGrid>

                  {/* Shops Section */}
                  <CardTitle style={{ marginTop: '2rem' }}>
                    {lang === "zh" ? `店铺 (${shops.length})` : `Shops (${shops.length})`}
                  </CardTitle>
                  {shops.length > 0 ? (
                    <PermissionList>
                      {shops.map((shop) => (
                        <PermissionCard
                          key={shop._id}
                          onClick={() => router.push(`/admin/businesses/${business._id}/shops/${shop._id}`)}
                        >
                          <PermissionName>{shop.store_name || shop.name || 'N/A'}</PermissionName>
                          <PermissionDetails>
                            {formatShopLocation(shop.location)
                              ? formatShopLocation(shop.location)
                              : (lang === "zh" ? "未设置地址" : "No address set")}
                            {shop.phone ? ` · ${shop.phone}` : ''}
                          </PermissionDetails>
                        </PermissionCard>
                      ))}
                    </PermissionList>
                  ) : (
                    <InfoValue>{lang === "zh" ? "暂无店铺" : "No shops linked to this business"}</InfoValue>
                  )}

                  {/* Address Information */}
                  <CardTitle style={{ marginTop: '2rem' }}>
                    {lang === "zh" ? "地址信息" : "Address Information"}
                  </CardTitle>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "街道地址" : "Street Address"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.address || ''}
                          onChange={(e) => handleBusinessChange('address', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.address || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "城市/郊区" : "Suburb/City"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.suburb || ''}
                          onChange={(e) => handleBusinessChange('suburb', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.suburb || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "州" : "State"}</InfoLabel>
                      {isEditMode ? (
                        <Select
                          value={business.state || ''}
                          onChange={(e) => handleBusinessChange('state', e.target.value)}
                        >
                          <option value="">Select State</option>
                          <option value="NSW">NSW</option>
                          <option value="VIC">VIC</option>
                          <option value="QLD">QLD</option>
                          <option value="WA">WA</option>
                          <option value="SA">SA</option>
                          <option value="TAS">TAS</option>
                          <option value="ACT">ACT</option>
                          <option value="NT">NT</option>
                        </Select>
                      ) : (
                        <InfoValue>{business.state || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "邮编" : "Postcode"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.postcode || ''}
                          onChange={(e) => handleBusinessChange('postcode', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.postcode || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "国家" : "Country"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.country || ''}
                          onChange={(e) => handleBusinessChange('country', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.country || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                  </InfoGrid>

                  {/* Contact Information */}
                  <CardTitle style={{ marginTop: '2rem' }}>
                    {lang === "zh" ? "联系信息" : "Contact Information"}
                  </CardTitle>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "联系邮箱" : "Contact Email"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          type="email"
                          value={business.contactEmail || business.contact_email || ''}
                          onChange={(e) => handleBusinessChange('contactEmail', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.contactEmail || business.contact_email || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "联系电话" : "Contact Phone"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          type="tel"
                          value={business.contactPhone || business.contact_phone || ''}
                          onChange={(e) => handleBusinessChange('contactPhone', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.contactPhone || business.contact_phone || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "EFTPOS 集成" : "EFTPOS Integration"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.eftposIntegration || ''}
                          onChange={(e) => handleBusinessChange('eftposIntegration', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.eftposIntegration || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "支付宝选项" : "Alipay Option"}</InfoLabel>
                      {isEditMode ? (
                        <Select
                          value={business.alipayOption || ''}
                          onChange={(e) => handleBusinessChange('alipayOption', e.target.value)}
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="other">Other</option>
                        </Select>
                      ) : (
                        <InfoValue>{business.alipayOption || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                  </InfoGrid>

                  {/* Additional Information */}
                  <CardTitle style={{ marginTop: '2rem' }}>
                    {lang === "zh" ? "其他信息" : "Additional Information"}
                  </CardTitle>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "创建日期" : "Created At"}</InfoLabel>
                      <InfoValue>{(business.createdAt || business.created_at) ? new Date(business.createdAt || business.created_at!).toLocaleDateString() : 'Invalid Date'}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "更新日期" : "Updated At"}</InfoLabel>
                      <InfoValue>{(business.updatedAt || business.updated_at) ? new Date(business.updatedAt || business.updated_at!).toLocaleDateString() : 'Invalid Date'}</InfoValue>
                    </InfoItem>
                  </InfoGrid>

                  {/* Edit Mode Actions */}
                  {isEditMode && (
                    <EditActions>
                      <EditButton $variant="save" onClick={handleSaveBusiness}>
                        <SaveIcon />
                        {lang === "zh" ? "保存更改" : "Save Changes"}
                      </EditButton>
                      <EditButton onClick={handleCancelEdit}>
                        {lang === "zh" ? "取消" : "Cancel"}
                      </EditButton>
                    </EditActions>
                  )}
                </TabContent>
              </TabContainer>
            </>
          ) : (
            <ErrorText>{lang === "zh" ? "未找到业务" : "Business not found"}</ErrorText>
          )}
        </MainContent>
      </Container>

      {/* Status Change Confirmation Modal */}
      <Modal $show={showStatusModal} onClick={() => setShowStatusModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "确认状态更改" : "Confirm Status Change"}</ModalTitle>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a' }}>
            {lang === "zh"
              ? `确定要将业务状态更改为 "${newStatus}" 吗？`
              : `Are you sure you want to change the business status to "${newStatus}"?`}
          </p>
          <ModalActions>
            <ModalButton onClick={() => setShowStatusModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleConfirmStatusChange}>
              {lang === "zh" ? "确认" : "Confirm"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
