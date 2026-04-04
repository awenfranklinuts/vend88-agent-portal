"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { dict } from "@/i18n/translations";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../../components/layout/AdminSidebar";
import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api";

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
  margin: 0.5rem 0 1.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #f7faff 0%, #ffffff 100%);
  color: #000000;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  svg {
    stroke: #000000;
  }

  &:hover {
    background: linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%);
    color: #1a1a1a;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    
    svg {
      stroke: #1a1a1a;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ContentHeader = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 968px) {
    flex-direction: column;
    align-items: flex-start;
  }
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

const DetailSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 968px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ef;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #0a3655;
  font-weight: 500;
`;

const FormIDContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FormIDValue = styled.span`
  font-size: 1rem;
  color: #0a3655;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const FormIDButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const EditInput = styled.input`
  padding: 0.75rem;
  border: 1.5px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  transition: all 0.2s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const BusinessDetailCard = styled.div`
  background: #f7faff;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e0e7ef;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const BusinessHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const BusinessDetailName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a3655;
`;

const BusinessStatus = styled.span<{ $status?: string }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${p => {
    switch(p.$status) {
      case 'active':
        return 'background: #d1fae5; color: #065f46;';
      case 'inactive':
        return 'background: #e5e7eb; color: #374151;';
      case 'suspended':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const BusinessInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
`;

const BusinessInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #0a3655;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ef;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${p => {
    if (p.$variant === 'primary') {
      return `
        background: #3b82f6;
        color: white;
        &:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
      `;
    } else {
      return `
        background: #f3f4f6;
        color: #374151;
        &:hover {
          background: #e5e7eb;
        }
      `;
    }
  }}
`;

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MessagingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  messagingAppType?: string;
  messagingAppId?: string;
  registration_id?: string;
  created_at?: string;
  status?: string;
  businesses: Business[];
}

interface Business {
  _id: string;
  name: string;
  owner_id: string;
  status?: string;
  abn?: string;
  address?: string;
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token, role, isLoading } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  
  const customerId = params?.id as string;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  const t = (key: keyof typeof dict) => dict[key][lang];

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  useEffect(() => {
    if (token && role === "admin" && customerId) {
      fetchCustomerDetail();
    }
  }, [token, role, customerId]);

  const fetchCustomerDetail = async () => {
    setIsLoadingData(true);
    try {
      // Fetch customers list
      const customersResponse = await fetch(
        '/api/customer/list',
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: token,
            page: 1,
            limit: 1000
          })
        }
      );

      const customersData = await customersResponse.json();

      // Fetch businesses
      const businessesResponse = await axios.post(
        '/api/search/business',
        { detail: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (customersData.status_code === 200 && businessesResponse.data.status_code === 200) {
        const customersList = customersData.customers || [];
        const businessesList = businessesResponse.data.business || [];

        // Find the customer
        const foundCustomer = customersList.find((c: any) => c._id === customerId);
        
        if (foundCustomer) {
          const customerWithBusinesses = {
            ...foundCustomer,
            businesses: businessesList.filter((business: any) => business.owner_id === foundCustomer._id)
          };
          setCustomer(customerWithBusinesses);
          setEditedCustomer(customerWithBusinesses);
        } else {
          showToast(
            lang === "zh" ? "客户不存在" : "Customer not found",
            'error'
          );
          router.push("/admin/customers");
        }
      }
    } catch (error) {
      console.error("Failed to fetch customer detail:", error);
      showToast(
        lang === "zh" ? "加载客户信息失败" : "Failed to load customer information",
        'error'
      );
      router.push("/admin/customers");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedCustomer) return;
    
    try {
      const updateUrl = getApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS_UPDATE.replace(':id', editedCustomer._id));
      const response = await fetch(
        updateUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: token,
            name: editedCustomer.name,
            email: editedCustomer.email,
            phone: editedCustomer.phone,
            messagingAppType: editedCustomer.messagingAppType,
            messagingAppId: editedCustomer.messagingAppId,
            status: editedCustomer.status
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const result = await response.json();
      
      if (result.status_code === 200) {
        setCustomer(editedCustomer);
        setIsEditMode(false);
        showToast(
          lang === 'zh' ? '客户信息已更新' : 'Customer updated successfully',
          'success'
        );
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
      showToast(
        lang === 'zh' ? '更新失败' : 'Failed to update customer',
        'error'
      );
    }
  };

  const handleEditChange = (field: keyof Customer, value: any) => {
    if (editedCustomer) {
      setEditedCustomer({ ...editedCustomer, [field]: value });
    }
  };

  const handleEmailCustomer = () => {
    if (customer?.email) {
      window.location.href = `mailto:${customer.email}`;
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingText>{t("loading")}</LoadingText>
      </Container>
    );
  }

  if (!token || role !== "admin") {
    return null;
  }

  if (isLoadingData) {
    return (
      <MainLayout currentPage={t("customerManagement")} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <LoadingText>{t("loading")}</LoadingText>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <MainLayout currentPage={customer.name} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push("/admin/customers")}>
            <BackArrowIcon />
            {lang === 'zh' ? '返回客户管理' : 'Back to Customers'}
          </BackButton>

          <ContentHeader>
            <div>
              <PageTitle>{isEditMode ? (lang === 'zh' ? '编辑客户' : 'Edit Customer') : customer.name}</PageTitle>
              <PageDescription>
                {lang === "zh"
                  ? "查看和管理客户信息及其关联的业务"
                  : "View and manage customer information and associated businesses"}
              </PageDescription>
            </div>
          </ContentHeader>

          <DetailSection>
            <SectionTitle>{lang === "zh" ? "客户信息" : "Customer Information"}</SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "客户 ID" : "Customer ID"}</DetailLabel>
                <DetailValue>{customer._id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "姓名" : "Name"}</DetailLabel>
                {isEditMode ? (
                  <EditInput
                    value={editedCustomer?.name || ''}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                ) : (
                  <DetailValue>{customer.name}</DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "邮箱" : "Email"}</DetailLabel>
                {isEditMode ? (
                  <EditInput
                    type="email"
                    value={editedCustomer?.email || ''}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                  />
                ) : (
                  <DetailValue>{customer.email}</DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "电话" : "Phone"}</DetailLabel>
                {isEditMode ? (
                  <EditInput
                    value={editedCustomer?.phone || ''}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                  />
                ) : (
                  <DetailValue>{customer.phone || 'N/A'}</DetailValue>
                )}
              </DetailItem>
              {(customer.messagingAppType || isEditMode) && (
                <DetailItem>
                  <DetailLabel>{lang === "zh" ? "消息应用" : "Messaging App"}</DetailLabel>
                  {isEditMode ? (
                    <EditInput
                      value={editedCustomer?.messagingAppId || ''}
                      onChange={(e) => handleEditChange('messagingAppId', e.target.value)}
                      placeholder={lang === 'zh' ? '消息应用 ID' : 'Messaging App ID'}
                    />
                  ) : customer.messagingAppType && customer.messagingAppId ? (
                    <DetailValue>
                      {customer.messagingAppType === 'wechat' ? 'WeChat' : 'WhatsApp'}: {customer.messagingAppId}
                    </DetailValue>
                  ) : (
                    <DetailValue>N/A</DetailValue>
                  )}
                </DetailItem>
              )}
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "来源表单" : "Source Form"}</DetailLabel>
                {customer.registration_id ? (
                  <FormIDContainer>
                    <FormIDValue>{customer.registration_id}</FormIDValue>
                    <FormIDButton onClick={() => router.push(`/admin/registrations/${customer.registration_id}`)}>
                      {lang === "zh" ? "查看表单" : "View Form"}
                    </FormIDButton>
                  </FormIDContainer>
                ) : (
                  <DetailValue>N/A</DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "创建日期" : "Created Date"}</DetailLabel>
                <DetailValue>
                  {customer.created_at 
                    ? new Date(customer.created_at).toLocaleDateString()
                    : 'N/A'}
                </DetailValue>
              </DetailItem>
            </DetailGrid>
            <ActionButtons>
              {!isEditMode && (
                <>
                  <ActionButton $variant="primary" onClick={() => setIsEditMode(true)}>
                    {lang === 'zh' ? '编辑' : 'Edit'}
                  </ActionButton>
                  <ActionButton onClick={handleEmailCustomer}>
                    <EmailIcon />
                    {lang === 'zh' ? '发送邮件' : 'Send Email'}
                  </ActionButton>
                </>
              )}
              {isEditMode && (
                <>
                  <ActionButton $variant="primary" onClick={handleSaveEdit}>
                    {lang === 'zh' ? '保存' : 'Save'}
                  </ActionButton>
                  <ActionButton onClick={() => {
                    setIsEditMode(false);
                    setEditedCustomer(customer);
                  }}>
                    {lang === 'zh' ? '取消' : 'Cancel'}
                  </ActionButton>
                </>
              )}
            </ActionButtons>
          </DetailSection>

          <DetailSection>
            <SectionTitle>
              {lang === "zh" ? "业务" : "Businesses"} ({customer.businesses.length})
            </SectionTitle>
            {customer.businesses.length > 0 ? (
              customer.businesses.map((business) => (
                <BusinessDetailCard key={business._id}>
                  <BusinessHeader>
                    <BusinessDetailName>{business.name}</BusinessDetailName>
                    <BusinessStatus $status={business.status}>
                      {business.status || 'N/A'}
                    </BusinessStatus>
                  </BusinessHeader>
                  <BusinessInfo>
                    {business.abn && (
                      <BusinessInfoItem>
                        <InfoLabel>{lang === "zh" ? "ABN" : "ABN"}</InfoLabel>
                        <InfoValue>{business.abn}</InfoValue>
                      </BusinessInfoItem>
                    )}
                    {business.address && (
                      <BusinessInfoItem>
                        <InfoLabel>{lang === "zh" ? "地址" : "Address"}</InfoLabel>
                        <InfoValue>{business.address}</InfoValue>
                      </BusinessInfoItem>
                    )}
                  </BusinessInfo>
                </BusinessDetailCard>
              ))
            ) : (
              <DetailValue style={{ fontStyle: 'italic', opacity: 0.7 }}>
                {lang === "zh" ? "此客户没有关联的业务" : "This customer has no associated businesses"}
              </DetailValue>
            )}
          </DetailSection>
        </MainContent>
      </Container>
    </MainLayout>
  );
}
