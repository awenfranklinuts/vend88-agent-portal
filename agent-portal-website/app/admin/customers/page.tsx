"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { dict } from "@/i18n/translations";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
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
  margin-left: 280px;
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
  margin-bottom: 2rem;
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

const SearchBar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 4px rgba(26, 35, 126, 0.12);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: #1a237e;
    box-shadow: 0 2px 8px rgba(26, 35, 126, 0.08);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const CustomerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CustomerCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: fadeIn 0.4s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
  }
`;

const CustomerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const CustomerDetail = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BusinessSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const BusinessTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BusinessList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BusinessItem = styled.div`
  font-size: 0.875rem;
  color: #1e40af;
  padding: 0.5rem;
  background: #f7faff;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BusinessName = styled.span`
  font-weight: 500;
`;

const BusinessStatus = styled.span<{ $status: string }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
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

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #5c6b7a;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  @media (max-width: 968px) {
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #5c6b7a;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #0a3655;
    transform: scale(1.1);
  }
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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e7ef;
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

// Icon Components
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

const UsersIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  messagingAppType?: string;
  messagingAppId?: string;
  created_at?: string;
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

export default function CustomerManagementPage() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const t = (key: keyof typeof dict) => dict[key][lang];

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  useEffect(() => {
    if (token && role === "admin") {
      fetchCustomers();
    }
  }, [token, role]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.businesses.some(business => 
          business.name.toLowerCase().includes(query)
        )
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    setIsLoadingData(true);
    try {
      // Fetch customers
      const customersResponse = await axios.post(
        '/api/customer/list',
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch all businesses
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

      if (customersResponse.data.status_code === 200 && businessesResponse.data.status_code === 200) {
        const customersList = customersResponse.data.customers || [];
        const businessesList = businessesResponse.data.business || [];

        // Map businesses to their owners
        const customersWithBusinesses = customersList.map((customer: any) => ({
          ...customer,
          businesses: businessesList.filter((business: any) => business.owner_id === customer._id)
        }));

        setCustomers(customersWithBusinesses);
        setFilteredCustomers(customersWithBusinesses);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      showToast(
        lang === "zh" ? "加载客户失败" : "Failed to load customers",
        'error'
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCustomer(null);
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

  return (
    <MainLayout currentPage={t("customerManagement")} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <PageTitle>{t("customerManagement")}</PageTitle>
            <PageDescription>
              {lang === "zh"
                ? "管理所有POS客户。查看、添加、编辑和监控客户信息。"
                : "Manage all POS customers. View, add, edit, and monitor customer information."}
            </PageDescription>
          </ContentHeader>

          <SearchBar>
            <SearchInput
              type="text"
              placeholder={lang === "zh" ? "搜索客户姓名、邮箱、电话或业务..." : "Search by customer name, email, phone, or business..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          {isLoadingData ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : filteredCustomers.length === 0 ? (
            <EmptyState>
              <EmptyIcon><UsersIcon /></EmptyIcon>
              <EmptyText>
                {searchQuery 
                  ? (lang === "zh" ? "未找到客户" : "No customers found")
                  : (lang === "zh" ? "暂无客户" : "No customers yet")}
              </EmptyText>
            </EmptyState>
          ) : (
            <CustomerGrid>
              {filteredCustomers.map((customer) => (
                <CustomerCard key={customer._id} onClick={() => handleCustomerClick(customer)}>
                  <CustomerName>{customer.name}</CustomerName>
                  <CustomerDetail>
                    <EmailIcon /> {customer.email}
                  </CustomerDetail>
                  {customer.phone && (
                    <CustomerDetail>
                      <PhoneIcon /> {customer.phone}
                    </CustomerDetail>
                  )}
                  {customer.messagingAppType && customer.messagingAppId && (
                    <CustomerDetail>
                      <MessagingIcon /> {customer.messagingAppType === 'wechat' ? 'WeChat' : 'WhatsApp'}: {customer.messagingAppId}
                    </CustomerDetail>
                  )}
                  
                  <BusinessSection>
                    <BusinessTitle>
                      {lang === "zh" ? "业务" : "Businesses"} ({customer.businesses.length})
                    </BusinessTitle>
                    {customer.businesses.length > 0 ? (
                      <BusinessList>
                        {customer.businesses.slice(0, 3).map((business) => (
                          <BusinessItem key={business._id}>
                            <BusinessName>{business.name}</BusinessName>
                            <BusinessStatus $status={business.status || 'N/A'}>
                              {business.status || 'N/A'}
                            </BusinessStatus>
                          </BusinessItem>
                        ))}
                        {customer.businesses.length > 3 && (
                          <CustomerDetail style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                            {lang === "zh" 
                              ? `+ ${customer.businesses.length - 3} 更多业务` 
                              : `+ ${customer.businesses.length - 3} more business${customer.businesses.length - 3 > 1 ? 'es' : ''}`}
                          </CustomerDetail>
                        )}
                      </BusinessList>
                    ) : (
                      <CustomerDetail style={{ fontStyle: 'italic', opacity: 0.7 }}>
                        {lang === "zh" ? "无业务" : "No businesses"}
                      </CustomerDetail>
                    )}
                  </BusinessSection>
                </CustomerCard>
              ))}
            </CustomerGrid>
          )}
        </MainContent>
      </Container>

      {/* Customer Details Modal */}
      <Modal $show={showDetailsModal} onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{selectedCustomer?.name}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          <Section>
            <SectionTitle>{lang === "zh" ? "客户信息" : "Customer Information"}</SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "客户 ID" : "Customer ID"}</DetailLabel>
                <DetailValue>{selectedCustomer?._id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "邮箱" : "Email"}</DetailLabel>
                <DetailValue>{selectedCustomer?.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "电话" : "Phone"}</DetailLabel>
                <DetailValue>{selectedCustomer?.phone || 'N/A'}</DetailValue>
              </DetailItem>
              {selectedCustomer?.messagingAppType && selectedCustomer?.messagingAppId && (
                <DetailItem>
                  <DetailLabel>{lang === "zh" ? "消息应用" : "Messaging App"}</DetailLabel>
                  <DetailValue>
                    {selectedCustomer.messagingAppType === 'wechat' ? 'WeChat' : 'WhatsApp'}: {selectedCustomer.messagingAppId}
                  </DetailValue>
                </DetailItem>
              )}
              <DetailItem>
                <DetailLabel>{lang === "zh" ? "创建日期" : "Created Date"}</DetailLabel>
                <DetailValue>
                  {selectedCustomer?.created_at 
                    ? new Date(selectedCustomer.created_at).toLocaleDateString()
                    : 'N/A'}
                </DetailValue>
              </DetailItem>
            </DetailGrid>
          </Section>

          <Section>
            <SectionTitle>
              {lang === "zh" ? "业务" : "Businesses"} ({selectedCustomer?.businesses.length || 0})
            </SectionTitle>
            {selectedCustomer?.businesses && selectedCustomer.businesses.length > 0 ? (
              selectedCustomer.businesses.map((business) => (
                <BusinessDetailCard key={business._id}>
                  <BusinessHeader>
                    <BusinessDetailName>{business.name}</BusinessDetailName>
                    <BusinessStatus $status={business.status || 'N/A'}>
                      {business.status || 'N/A'}
                    </BusinessStatus>
                  </BusinessHeader>
                  <BusinessInfo>
                    <BusinessInfoItem>
                      <InfoLabel>{lang === "zh" ? "业务 ID" : "Business ID"}</InfoLabel>
                      <InfoValue>{business._id}</InfoValue>
                    </BusinessInfoItem>
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
                {lang === "zh" ? "此客户没有业务" : "This customer has no businesses"}
              </DetailValue>
            )}
          </Section>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
