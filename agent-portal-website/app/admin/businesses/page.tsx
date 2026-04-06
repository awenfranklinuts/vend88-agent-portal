"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { dict } from "@/i18n/translations";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";
import { mockBusinesses, mockCustomers, getBusinessOwner } from "@/lib/mockBusinessData";

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
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const AdvancedSearchToggle = styled.button`
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const AdvancedSearchPanel = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'grid' : 'none'};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const ControlBar = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  
  @media (max-width: 968px) {
    width: 100%;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
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
  
  &:hover {
    background: ${p => p.$active ? '#2563eb' : '#e5e7eb'};
  }
`;

const ExportButton = styled.button`
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  
  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
  
  &:hover {
    background: #e0e7ef;
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
  font-size: 0.875rem;
`;

const CheckboxTh = styled.th`
  padding: 1rem;
  width: 50px;
`;

const CheckboxTd = styled.td`
  padding: 1rem;
  width: 50px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #3b82f6;
    color: white;
    transform: scale(1.1);
  }
`;

const BulkActionBar = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #f7faff;
  border-bottom: 1px solid #e0e7ef;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const BulkActionText = styled.span`
  color: #0a3655;
  font-size: 0.875rem;
  font-weight: 500;
`;

const BulkActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
`;

const CardButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  ${p => p.$variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
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

const SkeletonBox = styled.div<{ width?: string; height?: string; margin?: string }>`
  height: ${p => p.height || '16px'};
  width: ${p => p.width || '100%'};
  margin: ${p => p.margin || '0'};
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

const SkeletonStatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
`;

const SkeletonBusinessCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.06);
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
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
  max-width: 800px;
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
  
  @media (max-width: 968px) {
    padding: 1.5rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-size: 0.9375rem;
  color: #0a3655;
  font-weight: 500;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ef;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
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
    } else if (p.$variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-top: 1.5rem;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PaginationInfo = styled.div`
  color: #5c6b7a;
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  background: ${p => p.$active ? '#3b82f6' : 'white'};
  color: ${p => p.$active ? 'white' : '#0a3655'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.$disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${p => p.$active ? '#2563eb' : '#f7faff'};
    border-color: ${p => p.$active ? '#2563eb' : '#3b82f6'};
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

// Icon Components
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

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 11 12 6 7 11"/>
    <polyline points="7 13 12 18 17 13"/>
  </svg>
);

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
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Enhanced features
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<'name' | 'createdAt' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [searchByABN, setSearchByABN] = useState('');
  const [searchByAddress, setSearchByAddress] = useState('');
  const [searchByOwner, setSearchByOwner] = useState('');
  const [dateFilterFrom, setDateFilterFrom] = useState('');
  const [dateFilterTo, setDateFilterTo] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusToChange, setStatusToChange] = useState<{businessId: string, newStatus: string} | null>(null);

  const t = (key: keyof typeof dict) => dict[key][lang];

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && !isAdminRole(role)) {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  useEffect(() => {
    if (token && isAdminRole(role)) {
      fetchBusinesses();
    }
  }, [token, role]);

  const fetchBusinesses = async () => {
    if (!token) return;
    
    setIsLoadingData(true);
    try {
      // Fetch businesses from API
      const businessResponse = await axios.post(
        '/api/search/business',
        { detail: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Fetch customers from API
      const customerResponse = await axios.post(
        '/api/customer/list',
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (businessResponse.data.status_code === 200) {
        const apiBusinessList = businessResponse.data.business || [];
        // Combine API data with comprehensive mock data
        // API data first, then mock data for demonstration
        setAllBusinesses([...apiBusinessList, ...mockBusinesses]);
        
        if (customerResponse.data.status_code === 200) {
          const apiCustomers = customerResponse.data.customers || [];
          // Combine API customers with mock customers
          setCustomers([...apiCustomers, ...mockCustomers]);
        } else {
          // If customer API fails, still use mock customers
          setCustomers(mockCustomers);
        }
      } else {
        // If business API fails, fallback to mock data only
        setAllBusinesses(mockBusinesses);
        setCustomers(mockCustomers);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // On error, fallback to mock data
      setAllBusinesses(mockBusinesses);
      setCustomers(mockCustomers);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Apply all filters and sorting
  useEffect(() => {
    let filtered = [...allBusinesses];
    
    // Search filters
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name?.toLowerCase().includes(query) ||
        b._id?.toLowerCase().includes(query) ||
        b.owner_id?.toLowerCase().includes(query) ||
        b.contactEmail?.toLowerCase().includes(query)
      );
    }
    
    if (searchByABN.trim() !== '') {
      const abnQuery = searchByABN.toLowerCase();
      filtered = filtered.filter(b => b.abn?.toLowerCase().includes(abnQuery));
    }
    
    if (searchByAddress.trim() !== '') {
      const addressQuery = searchByAddress.toLowerCase();
      filtered = filtered.filter(b => 
        b.address?.toLowerCase().includes(addressQuery) ||
        b.suburb?.toLowerCase().includes(addressQuery)
      );
    }
    
    if (searchByOwner.trim() !== '') {
      const ownerQuery = searchByOwner.toLowerCase();
      filtered = filtered.filter(b => {
        const owner = customers.find(c => c._id === b.owner_id);
        return owner?.name?.toLowerCase().includes(ownerQuery);
      });
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }
    
    // State filter
    if (filterState !== 'all') {
      filtered = filtered.filter(b => b.state === filterState);
    }
    
    // Date filters
    if (dateFilterFrom) {
      filtered = filtered.filter(b => new Date(b.createdAt) >= new Date(dateFilterFrom));
    }
    if (dateFilterTo) {
      filtered = filtered.filter(b => new Date(b.createdAt) <= new Date(dateFilterTo));
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortField === 'name') {
        compareValue = (a.name || '').localeCompare(b.name || '');
      } else if (sortField === 'createdAt') {
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'status') {
        // Sort by status priority: active > setup > inactive > suspended
        const statusOrder = { active: 1, setup: 2, inactive: 3, suspended: 4 };
        const statusA = statusOrder[a.status] || 999;
        const statusB = statusOrder[b.status] || 999;
        compareValue = statusA - statusB;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
    
    setBusinesses(filtered);
    setCurrentPage(1);
  }, [searchQuery, searchByABN, searchByAddress, searchByOwner, filterStatus, filterState, dateFilterFrom, dateFilterTo, sortField, sortDirection, allBusinesses, customers]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchByABN('');
    setSearchByAddress('');
    setSearchByOwner('');
    setFilterStatus('all');
    setFilterState('all');
    setDateFilterFrom('');
    setDateFilterTo('');
  };

  const handleBusinessClick = (businessId: string) => {
    router.push(`/admin/businesses/${businessId}`);
  };
  
  const handleViewDetails = (business: Business) => {
    setSelectedBusiness(business);
    setShowDetailsModal(true);
  };
  
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedBusiness(null);
  };
  
  const handleSort = (field: 'name' | 'createdAt' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedBusinesses.map(b => b._id)));
    } else {
      setSelectedRows(new Set());
    }
  };
  
  const handleBulkExport = () => {
    const selectedBusinesses = businesses.filter(b => selectedRows.has(b._id));
    exportToCSV(selectedBusinesses);
    setSelectedRows(new Set());
  };
  
  const handleExportCSV = () => {
    exportToCSV(businesses);
  };
  
  const exportToCSV = (data: Business[]) => {
    const csvData = data.map(business => {
      const owner = customers.find(c => c._id === business.owner_id);
      return {
        'Business ID': business._id,
        'Name': business.name || 'N/A',
        'Owner': owner?.name || business.owner_id || 'N/A',
        'Owner Email': owner?.email || 'N/A',
        'Status': business.status,
        'ABN': business.abn || 'N/A',
        'Address': business.address || 'N/A',
        'Suburb': business.suburb || 'N/A',
        'State': business.state || 'N/A',
        'Postcode': business.postcode || 'N/A',
        'Contact Email': business.contactEmail || 'N/A',
        'Contact Phone': business.contactPhone || 'N/A',
        'EFTPOS Integration': business.eftposIntegration || 'N/A',
        'Created': new Date(business.createdAt).toLocaleDateString()
      };
    });
    
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `businesses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleStatusChange = (businessId: string, newStatus: string) => {
    setStatusToChange({ businessId, newStatus });
    setShowStatusModal(true);
  };
  
  const handleConfirmStatusChange = async () => {
    if (!statusToChange) return;
    
    try {
      // TODO: Replace with real API call
      // await axios.put(
      //   `/api/business/${statusToChange.businessId}/status`,
      //   { status: statusToChange.newStatus },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      
      // Update local state
      setAllBusinesses(allBusinesses.map(b => 
        b._id === statusToChange.businessId 
          ? { ...b, status: statusToChange.newStatus as any }
          : b
      ));
      
      if (selectedBusiness?._id === statusToChange.businessId) {
        setSelectedBusiness({ ...selectedBusiness, status: statusToChange.newStatus as any });
      }
      
      setShowStatusModal(false);
      setStatusToChange(null);
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  };
  
  const getOwnerName = (ownerId: string) => {
    const owner = customers.find(c => c._id === ownerId);
    return owner?.name || ownerId;
  };
  
  const getOwnerEmail = (ownerId: string) => {
    const owner = customers.find(c => c._id === ownerId);
    return owner?.email || '';
  };

  // Calculate stats
  const stats = {
    total: allBusinesses.length,
    active: allBusinesses.filter(b => b.status === 'active').length,
    setup: allBusinesses.filter(b => b.status === 'setup').length,
    inactive: allBusinesses.filter(b => b.status === 'inactive').length,
  };
  
  // Pagination
  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage);
  const allSelected = paginatedBusinesses.length > 0 && paginatedBusinesses.every(b => selectedRows.has(b._id));
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <MainLayout currentPage={t("businessManagement")} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <ContentHeader>
              <SkeletonBox width="250px" height="32px" margin="0 0 0.5rem 0" />
              <SkeletonBox width="450px" height="16px" />
            </ContentHeader>

            <StatsContainer>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonStatCard key={i}>
                  <SkeletonBox width="100px" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="60px" height="32px" />
                </SkeletonStatCard>
              ))}
            </StatsContainer>

            <SearchFilterContainer>
              <SkeletonBox height="42px" />
              <SkeletonBox width="150px" height="42px" />
              <SkeletonBox width="150px" height="42px" />
            </SearchFilterContainer>

            <BusinessGrid>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonBusinessCard key={i}>
                  <SkeletonBox width="70%" height="24px" margin="0 0 1rem 0" />
                  <SkeletonBox width="100%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="100%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="80%" height="14px" margin="0 0 1rem 0" />
                  <SkeletonBox width="80px" height="24px" />
                </SkeletonBusinessCard>
              ))}
            </BusinessGrid>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!token || !isAdminRole(role)) {
    return null;
  }

  if (!adminProfile?.permissions?.includes('manage_businesses')) {
    router.push('/admin');
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
                ? "ç®¡ç†æ‰€æœ‰ä¸šåŠ¡å’Œåœ°ç‚¹ã€‚æŸ¥çœ‹ã€æ·»åŠ ã€ç¼–è¾‘å’Œç›‘æŽ§ä¸šåŠ¡ä¿¡æ¯ã€‚"
                : "Manage all businesses and locations. View, add, edit, and monitor business information."}
            </PageDescription>
          </ContentHeader>

          <StatsContainer>
            <StatCard>
              <StatLabel>{lang === "zh" ? "æ€»ä¸šåŠ¡æ•°" : "Total Businesses"}</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{lang === "zh" ? "æ´»è·ƒ" : "Active"}</StatLabel>
              <StatValue style={{ color: '#065f46' }}>{stats.active}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{lang === "zh" ? "è®¾ç½®ä¸­" : "In Setup"}</StatLabel>
              <StatValue style={{ color: '#1e40af' }}>{stats.setup}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>{lang === "zh" ? "éžæ´»è·ƒ" : "Inactive"}</StatLabel>
              <StatValue style={{ color: '#6b7280' }}>{stats.inactive}</StatValue>
            </StatCard>
          </StatsContainer>

          <SearchFilterContainer>
            <SearchRow>
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "æœç´¢ä¸šåŠ¡åç§°ã€IDã€é‚®ç®±..." : "Search business name, ID, email..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <AdvancedSearchToggle onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}>
                {advancedSearchVisible 
                  ? (lang === 'zh' ? 'éšè—é«˜çº§æœç´¢' : 'Hide Advanced') 
                  : (lang === 'zh' ? 'é«˜çº§æœç´¢' : 'Advanced Search')}
              </AdvancedSearchToggle>
            </SearchRow>
            
            <AdvancedSearchPanel $show={advancedSearchVisible}>
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "æŒ‰ ABN æœç´¢..." : "Search by ABN..."}
                value={searchByABN}
                onChange={(e) => setSearchByABN(e.target.value)}
              />
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "æŒ‰åœ°å€æœç´¢..." : "Search by address..."}
                value={searchByAddress}
                onChange={(e) => setSearchByAddress(e.target.value)}
              />
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "æŒ‰æ‰€æœ‰è€…æœç´¢..." : "Search by owner..."}
                value={searchByOwner}
                onChange={(e) => setSearchByOwner(e.target.value)}
              />
              <SearchInput
                type="date"
                placeholder={lang === "zh" ? "ä»Žæ—¥æœŸ" : "From date"}
                value={dateFilterFrom}
                onChange={(e) => setDateFilterFrom(e.target.value)}
              />
              <SearchInput
                type="date"
                placeholder={lang === "zh" ? "åˆ°æ—¥æœŸ" : "To date"}
                value={dateFilterTo}
                onChange={(e) => setDateFilterTo(e.target.value)}
              />
            </AdvancedSearchPanel>
            
            <FilterRow>
              <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">{lang === "zh" ? "æ‰€æœ‰çŠ¶æ€" : "All Status"}</option>
                <option value="active">{lang === "zh" ? "æ´»è·ƒ" : "Active"}</option>
                <option value="setup">{lang === "zh" ? "è®¾ç½®ä¸­" : "Setup"}</option>
                <option value="inactive">{lang === "zh" ? "éžæ´»è·ƒ" : "Inactive"}</option>
                <option value="suspended">{lang === "zh" ? "æš‚åœ" : "Suspended"}</option>
              </FilterSelect>
              <FilterSelect value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                <option value="all">{lang === "zh" ? "æ‰€æœ‰å·ž" : "All States"}</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </FilterSelect>
              {(searchQuery || searchByABN || searchByAddress || searchByOwner || filterStatus !== 'all' || filterState !== 'all' || dateFilterFrom || dateFilterTo) && (
                <ClearButton onClick={handleClearFilters}>
                  {lang === "zh" ? "æ¸…é™¤" : "Clear"}
                </ClearButton>
              )}
            </FilterRow>
          </SearchFilterContainer>
          
          <ControlBar>
            <ControlGroup>
              <Select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
                <option value="name">{lang === 'zh' ? 'æŒ‰åç§°æŽ’åº' : 'Sort by Name'}</option>
                <option value="createdAt">{lang === 'zh' ? 'æŒ‰æ—¥æœŸæŽ’åº' : 'Sort by Date'}</option>
                <option value="status">{lang === 'zh' ? 'æŒ‰çŠ¶æ€æŽ’åº' : 'Sort by Status'}</option>
              </Select>
              <Select value={sortDirection} onChange={(e) => setSortDirection(e.target.value as any)}>
                <option value="asc">{lang === 'zh' ? 'å‡åº' : 'Ascending'}</option>
                <option value="desc">{lang === 'zh' ? 'é™åº' : 'Descending'}</option>
              </Select>
            </ControlGroup>
            <ControlGroup>
              <ViewToggle>
                <ViewButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                  <GridIcon /> {lang === 'zh' ? 'ç½‘æ ¼' : 'Grid'}
                </ViewButton>
                <ViewButton $active={viewMode === 'table'} onClick={() => setViewMode('table')}>
                  <ListIcon /> {lang === 'zh' ? 'è¡¨æ ¼' : 'Table'}
                </ViewButton>
              </ViewToggle>
              <ExportButton onClick={handleExportCSV}>
                <DownloadIcon /> {lang === 'zh' ? 'å¯¼å‡º CSV' : 'Export CSV'}
              </ExportButton>
            </ControlGroup>
          </ControlBar>

          {isLoadingData ? (
            <BusinessGrid>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonBusinessCard key={i}>
                  <SkeletonBox width="70%" height="24px" margin="0 0 1rem 0" />
                  <SkeletonBox width="100%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="100%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="80%" height="14px" margin="0 0 1rem 0" />
                  <SkeletonBox width="80px" height="24px" />
                </SkeletonBusinessCard>
              ))}
            </BusinessGrid>
          ) : businesses.length === 0 ? (
            <EmptyState>
              <EmptyIcon>ðŸ¢</EmptyIcon>
              <EmptyText>{lang === "zh" ? "æš‚æ— ä¸šåŠ¡" : "No businesses found"}</EmptyText>
              <EmptySubtext>
                {lang === "zh" ? "æ‰¹å‡†æ³¨å†Œè¡¨å•åŽï¼Œä¸šåŠ¡å°†è‡ªåŠ¨åˆ›å»ºã€‚" : "Businesses will be created automatically when registrations are approved."}
              </EmptySubtext>
            </EmptyState>
          ) : viewMode === 'table' ? (
            <TableContainer>
              <BulkActionBar $show={selectedRows.size > 0}>
                <BulkActionText>
                  {lang === 'zh' 
                    ? `å·²é€‰æ‹© ${selectedRows.size} ä¸ªä¸šåŠ¡` 
                    : `${selectedRows.size} business${selectedRows.size > 1 ? 'es' : ''} selected`}
                </BulkActionText>
                <BulkActionButtons>
                  <ActionButton onClick={handleBulkExport}>
                    <DownloadIcon /> {lang === 'zh' ? 'å¯¼å‡ºé€‰ä¸­' : 'Export Selected'}
                  </ActionButton>
                  <ActionButton onClick={() => setSelectedRows(new Set())}>
                    {lang === 'zh' ? 'å–æ¶ˆé€‰æ‹©' : 'Deselect All'}
                  </ActionButton>
                </BulkActionButtons>
              </BulkActionBar>
              <Table>
                <Thead>
                  <Tr>
                    <CheckboxTh>
                      <Checkbox 
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </CheckboxTh>
                    <Th onClick={() => handleSort('name')}>
                      {lang === 'zh' ? 'ä¸šåŠ¡åç§°' : 'Business Name'} <SortIcon />
                    </Th>
                    <Th>{lang === 'zh' ? 'æ‰€æœ‰è€…' : 'Owner'}</Th>
                    <Th onClick={() => handleSort('status')}>
                      {lang === 'zh' ? 'çŠ¶æ€' : 'Status'} <SortIcon />
                    </Th>
                    <Th>{lang === 'zh' ? 'åœ°ç‚¹' : 'Location'}</Th>
                    <Th onClick={() => handleSort('createdAt')}>
                      {lang === 'zh' ? 'åˆ›å»ºæ—¥æœŸ' : 'Created'} <SortIcon />
                    </Th>
                    <Th>{lang === 'zh' ? 'æ“ä½œ' : 'Actions'}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedBusinesses.map(business => (
                    <Tr key={business._id}>
                      <CheckboxTd>
                        <Checkbox 
                          checked={selectedRows.has(business._id)}
                          onChange={() => handleSelectRow(business._id)}
                        />
                      </CheckboxTd>
                      <Td style={{ fontWeight: 600 }}>{business.name || 'N/A'}</Td>
                      <Td>{getOwnerName(business.owner_id)}</Td>
                      <Td>
                        <StatusBadge $status={business.status}>
                          {business.status}
                        </StatusBadge>
                      </Td>
                      <Td>{business.state ? `${business.suburb || ''}, ${business.state}` : 'N/A'}</Td>
                      <Td>{new Date(business.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <ActionButtons>
                          <IconButton onClick={() => handleViewDetails(business)} title={lang === 'zh' ? 'æŸ¥çœ‹è¯¦æƒ…' : 'View Details'}>
                            <EyeIcon />
                          </IconButton>
                          <IconButton onClick={() => handleBusinessClick(business._id)} title={lang === 'zh' ? 'ç¼–è¾‘' : 'Edit'}>
                            <EditIcon />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <BusinessGrid>
              {paginatedBusinesses.map(business => (
                <BusinessCard key={business._id}>
                  <CardHeader>
                    <div style={{ flex: 1 }}>
                      <BusinessName>{business.name || 'N/A'}</BusinessName>
                      {(business.suburb || business.state) && (
                        <InfoRow style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#5c6b7a', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {business.suburb}{business.state && `, ${business.state}`}
                          </span>
                        </InfoRow>
                      )}
                    </div>
                    <StatusBadge $status={business.status}>
                      {business.status}
                    </StatusBadge>
                  </CardHeader>
                  <BusinessInfo>
                    <InfoRow>
                      <InfoLabel>{lang === "zh" ? "æ‰€æœ‰è€…:" : "Owner:"}</InfoLabel>
                      <InfoValue>{getOwnerName(business.owner_id)}</InfoValue>
                    </InfoRow>
                    {business.abn && (
                      <InfoRow>
                        <InfoLabel>{lang === "zh" ? "ABN:" : "ABN:"}</InfoLabel>
                        <InfoValue>{business.abn}</InfoValue>
                      </InfoRow>
                    )}
                    {business.contactEmail && (
                      <InfoRow>
                        <InfoLabel>{lang === "zh" ? "é‚®ç®±:" : "Email:"}</InfoLabel>
                        <InfoValue>{business.contactEmail}</InfoValue>
                      </InfoRow>
                    )}
                    <InfoRow>
                      <InfoLabel>{lang === "zh" ? "åˆ›å»º:" : "Created:"}</InfoLabel>
                      <InfoValue>{new Date(business.createdAt).toLocaleDateString()}</InfoValue>
                    </InfoRow>
                  </BusinessInfo>
                  <CardActions>
                    <CardButton onClick={() => handleViewDetails(business)}>
                      <EyeIcon /> {lang === 'zh' ? 'è¯¦æƒ…' : 'Details'}
                    </CardButton>
                    <CardButton $variant="primary" onClick={() => handleBusinessClick(business._id)}>
                      <EditIcon /> {lang === 'zh' ? 'ç¼–è¾‘' : 'Edit'}
                    </CardButton>
                  </CardActions>
                </BusinessCard>
              ))}
            </BusinessGrid>
          )}
          
          {businesses.length > 0 && (
            <PaginationContainer>
              <PaginationInfo>
                {lang === 'zh' 
                  ? `æ˜¾ç¤º ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, businesses.length)} / å…± ${businesses.length}` 
                  : `Showing ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, businesses.length)} of ${businesses.length}`}
              </PaginationInfo>
              <PaginationControls>
                <PageButton 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  $disabled={currentPage === 1}
                  disabled={currentPage === 1}
                >
                  {lang === 'zh' ? 'ä¸Šä¸€é¡µ' : 'Previous'}
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => {
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                    return (
                      <span key={`page-${page}`} style={{ display: 'contents' }}>
                        {showEllipsisBefore && <span key={`ellipsis-${page}`} style={{ padding: '0 0.5rem' }}>...</span>}
                        <PageButton
                          key={`btn-${page}`}
                          $active={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PageButton>
                      </span>
                    );
                  })}
                <PageButton 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  $disabled={currentPage === totalPages}
                  disabled={currentPage === totalPages}
                >
                  {lang === 'zh' ? 'ä¸‹ä¸€é¡µ' : 'Next'}
                </PageButton>
              </PaginationControls>
            </PaginationContainer>
          )}
        </MainContent>
      </Container>
      
      {/* Business Details Modal */}
      <Modal $show={showDetailsModal} onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{selectedBusiness?.name}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>Ã—</CloseButton>
          </ModalHeader>
          
          <DetailGrid>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'ä¸šåŠ¡ ID' : 'Business ID'}</DetailLabel>
              <DetailValue>{selectedBusiness?._id}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'æ‰€æœ‰è€…' : 'Owner'}</DetailLabel>
              <DetailValue>{selectedBusiness ? getOwnerName(selectedBusiness.owner_id) : 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'æ‰€æœ‰è€…é‚®ç®±' : 'Owner Email'}</DetailLabel>
              <DetailValue>{selectedBusiness ? getOwnerEmail(selectedBusiness.owner_id) || 'N/A' : 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'çŠ¶æ€' : 'Status'}</DetailLabel>
              <DetailValue>
                <StatusBadge $status={selectedBusiness?.status || 'inactive'}>
                  {selectedBusiness?.status}
                </StatusBadge>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'ABN' : 'ABN'}</DetailLabel>
              <DetailValue>{selectedBusiness?.abn || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'åœ°å€' : 'Address'}</DetailLabel>
              <DetailValue>{selectedBusiness?.address || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'éƒŠåŒº' : 'Suburb'}</DetailLabel>
              <DetailValue>{selectedBusiness?.suburb || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'å·ž' : 'State'}</DetailLabel>
              <DetailValue>{selectedBusiness?.state || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'é‚®ç¼–' : 'Postcode'}</DetailLabel>
              <DetailValue>{selectedBusiness?.postcode || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'è”ç³»é‚®ç®±' : 'Contact Email'}</DetailLabel>
              <DetailValue>{selectedBusiness?.contactEmail || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'è”ç³»ç”µè¯' : 'Contact Phone'}</DetailLabel>
              <DetailValue>{selectedBusiness?.contactPhone || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'EFTPOS é›†æˆ' : 'EFTPOS Integration'}</DetailLabel>
              <DetailValue>{selectedBusiness?.eftposIntegration || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'æ”¯ä»˜å®é€‰é¡¹' : 'Alipay Option'}</DetailLabel>
              <DetailValue>{selectedBusiness?.alipayOption || 'N/A'}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'åˆ›å»ºæ—¥æœŸ' : 'Created Date'}</DetailLabel>
              <DetailValue>
                {selectedBusiness?.createdAt 
                  ? new Date(selectedBusiness.createdAt).toLocaleDateString()
                  : 'N/A'}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{lang === 'zh' ? 'æ›´æ–°æ—¥æœŸ' : 'Updated Date'}</DetailLabel>
              <DetailValue>
                {selectedBusiness?.updatedAt 
                  ? new Date(selectedBusiness.updatedAt).toLocaleDateString()
                  : 'N/A'}
              </DetailValue>
            </DetailItem>
          </DetailGrid>
          
          <ModalActions>
            <ActionButton onClick={handleCloseModal}>
              {lang === 'zh' ? 'å…³é—­' : 'Close'}
            </ActionButton>
            {selectedBusiness && getOwnerEmail(selectedBusiness.owner_id) && (
              <ActionButton onClick={() => window.location.href = `mailto:${getOwnerEmail(selectedBusiness.owner_id)}`}>
                {lang === 'zh' ? 'å‘é€é‚®ä»¶' : 'Send Email'}
              </ActionButton>
            )}
            <ActionButton $variant="primary" onClick={() => {
              if (selectedBusiness) {
                handleBusinessClick(selectedBusiness._id);
                handleCloseModal();
              }
            }}>
              <EditIcon /> {lang === 'zh' ? 'ç¼–è¾‘ä¸šåŠ¡' : 'Edit Business'}
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>
      
      {/* Status Change Confirmation Modal */}
      {showStatusModal && (
        <Modal $show={showStatusModal} onClick={() => setShowStatusModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <ModalTitle>{lang === 'zh' ? 'æ›´æ”¹çŠ¶æ€' : 'Change Status'}</ModalTitle>
            <DetailValue style={{ margin: '1.5rem 0' }}>
              {lang === 'zh' 
                ? `ç¡®å®šè¦å°†çŠ¶æ€æ›´æ”¹ä¸º "${statusToChange?.newStatus}" å—ï¼Ÿ`
                : `Are you sure you want to change the status to "${statusToChange?.newStatus}"?`}
            </DetailValue>
            <ModalActions>
              <ActionButton onClick={() => {
                setShowStatusModal(false);
                setStatusToChange(null);
              }}>
                {lang === 'zh' ? 'å–æ¶ˆ' : 'Cancel'}
              </ActionButton>
              <ActionButton $variant="primary" onClick={handleConfirmStatusChange}>
                {lang === 'zh' ? 'ç¡®è®¤æ›´æ”¹' : 'Confirm Change'}
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </MainLayout>
  );
}
