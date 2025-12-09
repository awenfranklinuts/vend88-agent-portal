"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";

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

const SearchFilterContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 968px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
  }
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #d1d5db;
  }
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const BusinessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BusinessCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
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

const BusinessName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
`;

const BusinessInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: #0a3655;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${p => {
    switch(p.$status) {
      case 'active':
        return 'background: #d1fae5; color: #065f46;';
      case 'setup':
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

const EmptyState = styled.div`
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  color: #5c6b7a;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
`;

interface Business {
  _id: string;
  owner_id: string;
  name: string;
  abn?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'active' | 'inactive' | 'setup' | 'suspended';
  eftposIntegration?: string;
  alipayOption?: string;
  createdAt: string;
  updatedAt: string;
  registrationId?: string;
}

export default function BusinessManagementPage() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [isLoadingData, setIsLoadingData] = useState(false);

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
      fetchBusinesses();
    }
  }, [token, role]);

  const fetchBusinesses = async () => {
    if (!token) return;
    
    setIsLoadingData(true);
    try {
      const response = await axios.post(
        '/api/search/business',
        { detail: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status_code === 200) {
        let businessList = response.data.business || [];
        
        // Apply client-side filters
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          businessList = businessList.filter((b: any) =>
            b.name?.toLowerCase().includes(query) ||
            b._id?.toLowerCase().includes(query) ||
            b.owner_id?.toLowerCase().includes(query)
          );
        }
        
        if (filterStatus !== 'all') {
          businessList = businessList.filter((b: any) => b.status === filterStatus);
        }
        
        if (filterState !== 'all') {
          businessList = businessList.filter((b: any) => b.state === filterState);
        }
        
        setBusinesses(businessList);
      }
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token && role === "admin") {
      const timeoutId = setTimeout(() => {
        fetchBusinesses();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, filterStatus, filterState]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterState('all');
  };

  const handleBusinessClick = (businessId: string) => {
    router.push(`/admin/businesses/${businessId}`);
  };

  // Calculate stats
  const stats = {
    total: businesses.length,
    active: businesses.filter(b => b.status === 'active').length,
    setup: businesses.filter(b => b.status === 'setup').length,
    inactive: businesses.filter(b => b.status === 'inactive').length,
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
    <MainLayout currentPage={t("businessManagement")} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <PageTitle>{t("businessManagement")}</PageTitle>
            <PageDescription>
              {lang === "zh"
                ? "管理所有业务和地点。查看、添加、编辑和监控业务信息。"
                : "Manage all businesses and locations. View, add, edit, and monitor business information."}
            </PageDescription>
          </ContentHeader>

          <StatsContainer>
            <StatCard>
              <StatLabel>{lang === "zh" ? "总业务数" : "Total Businesses"}</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{lang === "zh" ? "活跃" : "Active"}</StatLabel>
              <StatValue style={{ color: '#065f46' }}>{stats.active}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{lang === "zh" ? "设置中" : "In Setup"}</StatLabel>
              <StatValue style={{ color: '#1e40af' }}>{stats.setup}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{lang === "zh" ? "非活跃" : "Inactive"}</StatLabel>
              <StatValue style={{ color: '#6b7280' }}>{stats.inactive}</StatValue>
            </StatCard>
          </StatsContainer>

          <SearchFilterContainer>
            <SearchInput
              type="text"
              placeholder={lang === "zh" ? "搜索业务名称、ABN、邮箱..." : "Search business name, ABN, email..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">{lang === "zh" ? "所有状态" : "All Status"}</option>
              <option value="active">{lang === "zh" ? "活跃" : "Active"}</option>
              <option value="setup">{lang === "zh" ? "设置中" : "Setup"}</option>
              <option value="inactive">{lang === "zh" ? "非活跃" : "Inactive"}</option>
              <option value="suspended">{lang === "zh" ? "暂停" : "Suspended"}</option>
            </FilterSelect>
            <FilterSelect value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="all">{lang === "zh" ? "所有州" : "All States"}</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
            </FilterSelect>
            {(searchQuery || filterStatus !== 'all' || filterState !== 'all') && (
              <ClearButton onClick={handleClearFilters}>
                {lang === "zh" ? "清除" : "Clear"}
              </ClearButton>
            )}
          </SearchFilterContainer>

          {isLoadingData ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : businesses.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🏢</EmptyIcon>
              <EmptyText>{lang === "zh" ? "暂无业务" : "No businesses found"}</EmptyText>
              <EmptySubtext>
                {lang === "zh" ? "批准注册表单后，业务将自动创建。" : "Businesses will be created automatically when registrations are approved."}
              </EmptySubtext>
            </EmptyState>
          ) : (
            <BusinessGrid>
              {businesses.map(business => (
                <BusinessCard key={business._id} onClick={() => handleBusinessClick(business._id)}>
                  <BusinessName>{business.name || 'N/A'}</BusinessName>
                  <BusinessInfo>
                    <InfoRow>
                      <InfoLabel>{lang === "zh" ? "所有者:" : "Owner:"}</InfoLabel>
                      <InfoValue>{business.owner_id || 'N/A'}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>{lang === "zh" ? "状态:" : "Status:"}</InfoLabel>
                      <StatusBadge $status={business.status}>
                        {business.status || 'N/A'}
                      </StatusBadge>
                    </InfoRow>
                  </BusinessInfo>
                </BusinessCard>
              ))}
            </BusinessGrid>
          )}
        </MainContent>
      </Container>
    </MainLayout>
  );
}
