"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import { getApiUrl } from "@/config/api";
import { API_CONFIG } from "@/config/api";

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 968px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1.5rem;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
  
  @media (max-width: 968px) {
    font-size: 1.5rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #5c6b7a;
  
  @media (max-width: 968px) {
    font-size: 0.875rem;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1a237e 0%, #00eaff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(26, 35, 126, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 968px) {
    width: 100%;
    padding: 1rem;
    font-size: 0.9375rem;
  }
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

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  padding: 2rem;
  
  @media (max-width: 968px) {
    padding: 1rem;
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 968px) {
    min-width: 800px;
  }
`;

const Thead = styled.thead`
  background: #f7faff;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e0e7ef;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f7faff;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: #0a3655;
  font-size: 0.9375rem;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8125rem;
  }
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
      case 'inactive':
        return 'background: #fee2e2; color: #991b1b;';
      case 'suspended':
        return 'background: #fef3c7; color: #92400e;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(26, 35, 126, 0.1);
  color: #1a237e;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'view' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  white-space: nowrap;
  
  ${p => {
    switch(p.$variant) {
      case 'edit':
        return `
          background: #dbeafe;
          color: #1e40af;
          &:hover { background: #bfdbfe; }
        `;
      case 'delete':
        return `
          background: #fee2e2;
          color: #991b1b;
          &:hover { background: #fecaca; }
        `;
      default:
        return `
          background: #dbeafe;
          color: #1e40af;
          &:hover { background: #bfdbfe; }
        `;
    }
  }}
  
  @media (max-width: 968px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }
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
  font-weight: 500;
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

const SkeletonRow = styled.tr`
  border-bottom: 1px solid #e0e7ef;
`;

const SkeletonCell = styled.td`
  padding: 1rem;
  
  @media (max-width: 968px) {
    padding: 0.75rem 0.5rem;
  }
`;

const SkeletonBox = styled.div<{ width?: string; height?: string }>`
  height: ${p => p.height || '16px'};
  width: ${p => p.width || '100%'};
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonButton = styled.div`
  display: inline-block;
  height: 32px;
  width: 60px;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-right: 0.5rem;
`;

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  username?: string;
  token?: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export default function AdminManagementPage() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  // Fetch admins from API
  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token]);

  const fetchAdmins = async () => {
    try {
      // First, get list of user IDs
      const listResponse = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.LIST_USER),
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (listResponse.data && listResponse.data.user_IDs) {
        // Fetch details for each user
        const userDetailsPromises = listResponse.data.user_IDs.map((userId: string) =>
          axios.post(
            getApiUrl(API_CONFIG.ENDPOINTS.USER_DETAIL),
            { 
              token,
              user_id: userId 
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
        );

        const detailsResponses = await Promise.all(userDetailsPromises);
        
        // Map responses to admin objects
        const adminList = detailsResponses
          .filter(res => res.data && res.data.status_code === 200)
          .map(res => ({
            id: res.data.user_id || res.data.id,
            email: res.data.email || '',
            first_name: res.data.first_name || '',
            last_name: res.data.last_name || '',
            username: res.data.username || '',
            phone_number: res.data.phone_number || '',
            created_at: res.data.created_at || new Date().toISOString(),
            updated_at: res.data.updated_at,
            last_login: res.data.last_login
          }));
        
        setAdmins(adminList);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      // Optionally show error message to user
    }
  };

  const filteredAdmins = admins.filter(admin => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesEmail = admin.email?.toLowerCase().includes(query);
      const matchesName = `${admin.first_name || ''} ${admin.last_name || ''}`.toLowerCase().includes(query);
      const matchesUsername = admin.username?.toLowerCase().includes(query);
      
      if (!matchesEmail && !matchesName && !matchesUsername) {
        return false;
      }
    }
    
    return true;
  });



  if (isLoading) {
    return (
      <MainLayout currentPage={lang === "zh" ? "管理员管理" : "Admin Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <ContentHeader>
              <HeaderLeft>
                <SkeletonBox width="200px" height="32px" style={{ marginBottom: '0.5rem' }} />
                <SkeletonBox width="350px" height="16px" />
              </HeaderLeft>
              <SkeletonBox width="140px" height="48px" />
            </ContentHeader>

            <SearchFilterContainer>
              <SkeletonBox width="100%" height="42px" />
            </SearchFilterContainer>

            <TableContainer>
              <TableWrapper>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{lang === "zh" ? "姓名" : "Name"}</Th>
                      <Th>{lang === "zh" ? "邮箱" : "Email"}</Th>
                      <Th>{lang === "zh" ? "用户名" : "Username"}</Th>
                      <Th>{lang === "zh" ? "电话" : "Phone"}</Th>
                      <Th>{lang === "zh" ? "创建时间" : "Created At"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <SkeletonRow key={i}>
                        <SkeletonCell><SkeletonBox width="120px" /></SkeletonCell>
                        <SkeletonCell><SkeletonBox width="180px" /></SkeletonCell>
                        <SkeletonCell><SkeletonBox width="100px" /></SkeletonCell>
                        <SkeletonCell><SkeletonBox width="110px" /></SkeletonCell>
                        <SkeletonCell><SkeletonBox width="90px" /></SkeletonCell>
                        <SkeletonCell>
                          <SkeletonButton />
                          <SkeletonButton />
                        </SkeletonCell>
                      </SkeletonRow>
                    ))}
                  </Tbody>
                </Table>
              </TableWrapper>
            </TableContainer>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!token || role !== "admin") {
    return null;
  }

  return (
    <MainLayout currentPage={lang === "zh" ? "管理员管理" : "Admin Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <HeaderLeft>
              <PageTitle>{lang === "zh" ? "管理员管理" : "Admin Management"}</PageTitle>
              <PageDescription>
                {lang === "zh"
                  ? "管理系统管理员账户和权限"
                  : "Manage system administrator accounts and permissions"}
              </PageDescription>
            </HeaderLeft>
            <AddButton disabled>
              <PlusIcon />
              {lang === "zh" ? "添加管理员" : "Add Admin"}
            </AddButton>
          </ContentHeader>

          <SearchFilterContainer>
            <SearchInput
              type="text"
              placeholder={lang === "zh" ? "搜索邮箱、姓名或用户名..." : "Search email, name or username..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <ClearButton onClick={() => setSearchQuery('')}>
                {lang === "zh" ? "清除" : "Clear"}
              </ClearButton>
            )}
          </SearchFilterContainer>

          <TableContainer>
            <TableWrapper>
              {filteredAdmins.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>👤</EmptyIcon>
                  <EmptyText>{lang === "zh" ? "暂无管理员" : "No admins found"}</EmptyText>
                  <EmptySubtext>
                    {lang === "zh" ? "点击上方按钮添加新管理员" : "Click the button above to add a new admin"}
                  </EmptySubtext>
                </EmptyState>
              ) : (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{lang === "zh" ? "姓名" : "Name"}</Th>
                      <Th>{lang === "zh" ? "邮箱" : "Email"}</Th>
                      <Th>{lang === "zh" ? "用户名" : "Username"}</Th>
                      <Th>{lang === "zh" ? "电话" : "Phone"}</Th>
                      <Th>{lang === "zh" ? "创建时间" : "Created At"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredAdmins.map(admin => (
                      <Tr key={admin.id}>
                        <Td>{admin.first_name} {admin.last_name}</Td>
                        <Td>{admin.email}</Td>
                        <Td>{admin.username || '-'}</Td>
                        <Td>{admin.phone_number || '-'}</Td>
                        <Td>
                          {admin.created_at 
                            ? new Date(admin.created_at).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-AU')
                            : '-'}
                        </Td>
                        <Td>
                          <ActionButton $variant="view" disabled>
                            {lang === "zh" ? "查看" : "View"}
                          </ActionButton>
                          <ActionButton $variant="edit" disabled>
                            {lang === "zh" ? "编辑" : "Edit"}
                          </ActionButton>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TableWrapper>
          </TableContainer>
        </MainContent>
      </Container>
    </MainLayout>
  );
}
