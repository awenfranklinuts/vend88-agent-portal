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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SearchBar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
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
  
  &:hover {
    background: #e5e7eb;
  }
`;

const AdvancedSearchPanel = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'grid' : 'none'};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e7ef;
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
    justify-content: space-between;
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
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchInput = styled.input`
  flex: 1;
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
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
`;

const SkeletonCustomerCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
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
  margin-bottom: 0.75rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #0a3655;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0a3655;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const Section = styled.div`
  margin-bottom: 1.25rem;
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

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ef;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 11 12 6 7 11"/>
    <polyline points="7 13 12 18 17 13"/>
  </svg>
);

interface Customer {
  status: any;
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
  
  // Enhanced features state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<'name' | 'created_at' | 'businessCount'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterOption, setFilterOption] = useState<'all' | 'withBusiness' | 'withoutBusiness'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [searchByABN, setSearchByABN] = useState('');
  const [searchByAddress, setSearchByAddress] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    messagingAppType: '',
    messagingAppId: '',
    source_info: ''
  });

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
    let filtered = [...customers];
    
    // Apply search filters
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.businesses.some(business => 
          business.name.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply ABN search
    if (searchByABN.trim() !== '') {
      const abnQuery = searchByABN.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.businesses.some(business => 
          business.abn?.toLowerCase().includes(abnQuery)
        )
      );
    }
    
    // Apply address search
    if (searchByAddress.trim() !== '') {
      const addressQuery = searchByAddress.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.businesses.some(business => 
          business.address?.toLowerCase().includes(addressQuery)
        )
      );
    }
    
    // Apply filter option
    if (filterOption === 'withBusiness') {
      filtered = filtered.filter(customer => customer.businesses.length > 0);
    } else if (filterOption === 'withoutBusiness') {
      filtered = filtered.filter(customer => customer.businesses.length === 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortField === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortField === 'created_at') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        compareValue = dateA - dateB;
      } else if (sortField === 'businessCount') {
        compareValue = a.businesses.length - b.businesses.length;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
    
    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, searchByABN, searchByAddress, filterOption, sortField, sortDirection, customers]);

  const fetchCustomers = async () => {
    setIsLoadingData(true);
    try {
      // Fetch customers through local API proxy to avoid direct external path mismatches
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
            limit: 1000 // Get a large number to fetch all
          })
        }
      );

      const customersData = await customersResponse.json();

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

      if (customersData.status_code === 200 && businessesResponse.data.status_code === 200) {
        const customersList = customersData.customers || [];
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
    router.push(`/admin/customers/${customer._id}`);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      messagingAppType: '',
      messagingAppId: '',
      source_info: ''
    });
  };
  
  const handleCreateCustomer = async () => {
    try {
      // Validate required fields
      if (!newCustomer.name || !newCustomer.email) {
        showToast(
          lang === 'zh' ? '请填写必填字段' : 'Please fill in required fields',
          'error'
        );
        return;
      }

      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS_CREATE),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: token,
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone || undefined,
            messagingAppType: newCustomer.messagingAppType || undefined,
            messagingAppId: newCustomer.messagingAppId || undefined,
            source_info: newCustomer.source_info || undefined
          })
        }
      );

      const result = await response.json();
      
      if (result.status_code === 201 || result.status_code === 200) {
        showToast(
          lang === 'zh' ? '客户创建成功' : 'Customer created successfully',
          'success'
        );
        
        // Reset form and close modal
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          messagingAppType: '',
          messagingAppId: '',
          source_info: ''
        });
        setShowCreateModal(false);
        
        // Refresh customer list
        await fetchCustomers();
      } else if (result.status_code === 409) {
        showToast(
          lang === 'zh' ? '邮箱已存在' : 'Email already exists',
          'error'
        );
      } else {
        throw new Error(result.message || 'Create failed');
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
      showToast(
        lang === 'zh' ? '创建失败' : 'Failed to create customer',
        'error'
      );
    }
  };
  
  const handleExportCSV = () => {
    const csvData = filteredCustomers.map(customer => ({
      'Customer ID': customer._id,
      'Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone || 'N/A',
      'Messaging App': customer.messagingAppType ? `${customer.messagingAppType}: ${customer.messagingAppId}` : 'N/A',
      'Businesses Count': customer.businesses.length,
      'Business Names': customer.businesses.map(b => b.name).join('; '),
      'Created Date': customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'
    }));
    
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(
      lang === 'zh' ? '导出成功' : 'Export successful',
      'success'
    );
  };
  
  const handleEmailCustomer = (email: string) => {
    window.location.href = `mailto:${email}`;
  };
  
  const handleSort = (field: 'name' | 'created_at' | 'businessCount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Calculate statistics
  const stats = {
    total: customers.length,
    totalBusinesses: customers.reduce((sum, c) => sum + c.businesses.length, 0),
    withoutBusinesses: customers.filter(c => c.businesses.length === 0).length,
    recentAdditions: customers.filter(c => {
      if (!c.created_at) return false;
      const daysDiff = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div>
              <PageTitle>{t("customerManagement")}</PageTitle>
              <PageDescription>
                {lang === "zh"
                  ? "管理所有POS客户。查看、添加、编辑和监控客户信息。"
                  : "Manage all POS customers. View, add, edit, and monitor customer information."}
              </PageDescription>
            </div>
            <ExportButton onClick={() => setShowCreateModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {lang === 'zh' ? '新建客户' : 'Create Customer'}
            </ExportButton>
          </ContentHeader>

          <StatsGrid>
            <StatCard>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>{lang === 'zh' ? '总客户数' : 'Total Customers'}</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.totalBusinesses}</StatValue>
              <StatLabel>{lang === 'zh' ? '总业务数' : 'Total Businesses'}</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.recentAdditions}</StatValue>
              <StatLabel>{lang === 'zh' ? '近30天新增' : 'Added Last 30 Days'}</StatLabel>
            </StatCard>
          </StatsGrid>

          <SearchBar>
            <SearchRow>
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "搜索客户姓名、邮箱、电话或业务..." : "Search by customer name, email, phone, or business..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <AdvancedSearchToggle onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}>
                {advancedSearchVisible 
                  ? (lang === 'zh' ? '隐藏高级搜索' : 'Hide Advanced') 
                  : (lang === 'zh' ? '高级搜索' : 'Advanced Search')}
              </AdvancedSearchToggle>
            </SearchRow>
            <AdvancedSearchPanel $show={advancedSearchVisible}>
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "按 ABN 搜索..." : "Search by ABN..."}
                value={searchByABN}
                onChange={(e) => setSearchByABN(e.target.value)}
              />
              <SearchInput
                type="text"
                placeholder={lang === "zh" ? "按地址搜索..." : "Search by address..."}
                value={searchByAddress}
                onChange={(e) => setSearchByAddress(e.target.value)}
              />
            </AdvancedSearchPanel>
          </SearchBar>
          
          <ControlBar>
            <ControlGroup>
              <Select value={filterOption} onChange={(e) => setFilterOption(e.target.value as any)}>
                <option value="all">{lang === 'zh' ? '所有客户' : 'All Customers'}</option>
                <option value="withBusiness">{lang === 'zh' ? '有业务' : 'With Businesses'}</option>
                <option value="withoutBusiness">{lang === 'zh' ? '无业务' : 'Without Businesses'}</option>
              </Select>
              <Select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
                <option value="name">{lang === 'zh' ? '按名称排序' : 'Sort by Name'}</option>
                <option value="created_at">{lang === 'zh' ? '按日期排序' : 'Sort by Date'}</option>
                <option value="businessCount">{lang === 'zh' ? '按业务数排序' : 'Sort by Business Count'}</option>
              </Select>
              <Select value={sortDirection} onChange={(e) => setSortDirection(e.target.value as any)}>
                <option value="asc">{lang === 'zh' ? '升序' : 'Ascending'}</option>
                <option value="desc">{lang === 'zh' ? '降序' : 'Descending'}</option>
              </Select>
            </ControlGroup>
            <ControlGroup>
              <ViewToggle>
                <ViewButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                  <GridIcon /> {lang === 'zh' ? '网格' : 'Grid'}
                </ViewButton>
                <ViewButton $active={viewMode === 'table'} onClick={() => setViewMode('table')}>
                  <ListIcon /> {lang === 'zh' ? '表格' : 'Table'}
                </ViewButton>
              </ViewToggle>
              <ExportButton onClick={handleExportCSV}>
                <DownloadIcon /> {lang === 'zh' ? '导出 CSV' : 'Export CSV'}
              </ExportButton>
            </ControlGroup>
          </ControlBar>

          {isLoadingData ? (
            <CustomerGrid>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCustomerCard key={i}>
                  <SkeletonBox width="70%" height="24px" margin="0 0 1rem 0" />
                  <SkeletonBox width="100%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="100%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="80%" height="14px" margin="0 0 0.5rem 0" />
                  <SkeletonBox width="50%" height="14px" margin="0 0 1rem 0" />
                  <SkeletonBox width="80px" height="32px" />
                </SkeletonCustomerCard>
              ))}
            </CustomerGrid>
          ) : filteredCustomers.length === 0 ? (
            <EmptyState>
              <EmptyIcon><UsersIcon /></EmptyIcon>
              <EmptyText>
                {searchQuery || searchByABN || searchByAddress
                  ? (lang === "zh" ? "未找到客户" : "No customers found")
                  : (lang === "zh" ? "暂无客户" : "No customers yet")}
              </EmptyText>
            </EmptyState>
          ) : viewMode === 'table' ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th onClick={() => handleSort('name')}>
                      {lang === 'zh' ? '姓名' : 'Name'} <SortIcon />
                    </Th>
                    <Th>{lang === 'zh' ? '邮箱' : 'Email'}</Th>
                    <Th>{lang === 'zh' ? '电话' : 'Phone'}</Th>
                    <Th onClick={() => handleSort('businessCount')}>
                      {lang === 'zh' ? '业务数' : 'Businesses'} <SortIcon />
                    </Th>
                    <Th onClick={() => handleSort('created_at')}>
                      {lang === 'zh' ? '创建日期' : 'Created'} <SortIcon />
                    </Th>
                    <Th>{lang === 'zh' ? '操作' : 'Actions'}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedCustomers.map((customer) => (
                    <Tr key={customer._id}>
                      <Td style={{ fontWeight: 600 }}>{customer.name}</Td>
                      <Td>{customer.email}</Td>
                      <Td>{customer.phone || 'N/A'}</Td>
                      <Td>{customer.businesses.length}</Td>
                      <Td>
                        {customer.created_at 
                          ? new Date(customer.created_at).toLocaleDateString()
                          : 'N/A'}
                      </Td>
                      <Td>
                        <ActionButtons>
                          <IconButton onClick={() => handleCustomerClick(customer)} title={lang === 'zh' ? '查看详情' : 'View Details'}>
                            <EyeIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEmailCustomer(customer.email)} title={lang === 'zh' ? '发送邮件' : 'Send Email'}>
                            <MailIcon />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <CustomerGrid>
              {paginatedCustomers.map((customer) => (
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
          
          {filteredCustomers.length > 0 && (
            <PaginationContainer>
              <PaginationInfo>
                {lang === 'zh' 
                  ? `显示 ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredCustomers.length)} / 共 ${filteredCustomers.length}` 
                  : `Showing ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of ${filteredCustomers.length}`}
              </PaginationInfo>
              <PaginationControls>
                <PageButton 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  $disabled={currentPage === 1}
                  disabled={currentPage === 1}
                >
                  {lang === 'zh' ? '上一页' : 'Previous'}
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and adjacent pages
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    // Add ellipsis
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                    // return an array of elements with explicit keys to avoid fragment key warnings
                    return [
                      showEllipsisBefore ? (
                        <span key={`ellipsis-${page}`} style={{ padding: '0 0.5rem' }}>...</span>
                      ) : null,
                      (
                        <PageButton
                          key={page}
                          $active={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PageButton>
                      )
                    ];
                  })}
                <PageButton 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  $disabled={currentPage === totalPages}
                  disabled={currentPage === totalPages}
                >
                  {lang === 'zh' ? '下一页' : 'Next'}
                </PageButton>
              </PaginationControls>
            </PaginationContainer>
          )}
        </MainContent>
      </Container>

      {/* Create Customer Modal */}
      <Modal $show={showCreateModal} onClick={() => setShowCreateModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{lang === 'zh' ? '创建新客户' : 'Create New Customer'}</ModalTitle>
            <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
          </ModalHeader>
          
          <Section>
            <DetailLabel>{lang === "zh" ? "姓名" : "Name"} *</DetailLabel>
            <Input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              placeholder={lang === "zh" ? "输入客户姓名" : "Enter customer name"}
            />
          </Section>

          <Section>
            <DetailLabel>{lang === "zh" ? "电子邮件" : "Email"} *</DetailLabel>
            <Input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              placeholder={lang === "zh" ? "输入电子邮件地址" : "Enter email address"}
            />
          </Section>

          <Section>
            <DetailLabel>{lang === "zh" ? "电话" : "Phone"}</DetailLabel>
            <Input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              placeholder={lang === "zh" ? "输入电话号码" : "Enter phone number"}
            />
          </Section>

          <Section>
            <DetailLabel>{lang === "zh" ? "消息应用类型" : "Messaging App Type"}</DetailLabel>
            <Select
              value={newCustomer.messagingAppType || ''}
              onChange={(e) => setNewCustomer({ ...newCustomer, messagingAppType: e.target.value })}
            >
              <option value="">{lang === "zh" ? "选择消息应用类型" : "Select messaging app type"}</option>
              <option value="WeChat">WeChat</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Other">{lang === "zh" ? "其他" : "Other"}</option>
            </Select>
          </Section>

          {newCustomer.messagingAppType && (
            <Section>
              <DetailLabel>{lang === "zh" ? "消息应用 ID" : "Messaging App ID"}</DetailLabel>
              <Input
                type="text"
                value={newCustomer.messagingAppId}
                onChange={(e) => setNewCustomer({ ...newCustomer, messagingAppId: e.target.value })}
                placeholder={lang === "zh" ? "输入应用 ID" : "Enter app ID"}
              />
            </Section>
          )}

          <ModalActions>
            <ActionButton onClick={() => setShowCreateModal(false)}>
              {lang === 'zh' ? '取消' : 'Cancel'}
            </ActionButton>
            <ActionButton $variant="primary" onClick={handleCreateCustomer}>
              <SaveIcon /> {lang === 'zh' ? '创建客户' : 'Create Customer'}
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
