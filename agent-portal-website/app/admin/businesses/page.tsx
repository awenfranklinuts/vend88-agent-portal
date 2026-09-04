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

const HeaderLeft = styled.div`

  flex: 1;

`;

const CreateBusinessButton = styled.button`

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

  white-space: nowrap;

  &:hover {

    background: #2563eb;

    transform: translateY(-2px);

    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  }

`;

const Section = styled.div`
  margin-bottom: 1.25rem;
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

const EmailInputGroup = styled.div`
  display: flex;
  align-items: stretch;
`;

const EmailSuffix = styled.span`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e0e7ef;
  border-left: none;
  border-radius: 0 8px 8px 0;
  color: #5c6b7a;
  font-size: 0.875rem;
  white-space: nowrap;
`;

const PasswordFieldRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const ToggleVisibilityButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #5c6b7a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;

  &:hover {
    color: #0a3655;
  }
`;

const GeneratePasswordButton = styled.button`
  padding: 0 1rem;
  background: #f3f4f6;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const FieldHint = styled.p`
  font-size: 0.75rem;
  color: #5c6b7a;
  margin-top: 1rem;
  margin-bottom: 1.25rem;
`;

const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: #dc2626;
  margin: -0.75rem 0 1rem;
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



const FilterCheckboxLabel = styled.label`

  display: flex;

  align-items: center;

  gap: 0.5rem;

  font-size: 0.875rem;

  color: #374151;

  cursor: pointer;

  white-space: nowrap;

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



const ShopSection = styled.div`

  margin-top: 0.75rem;

  padding-top: 0.75rem;

  border-top: 1px solid #e0e7ef;

`;



const ShopSectionTitle = styled.div`

  font-size: 0.75rem;

  font-weight: 600;

  color: #5c6b7a;

  text-transform: uppercase;

  letter-spacing: 0.5px;

  margin-bottom: 0.5rem;

`;



const ShopItem = styled.div`

  display: flex;

  flex-direction: column;

  padding: 0.5rem 0.75rem;

  background: #f7faff;

  border-radius: 8px;

  margin-bottom: 0.5rem;

  font-size: 0.8125rem;



  &:last-child {

    margin-bottom: 0;

  }

`;



const ShopName = styled.span`

  font-weight: 600;

  color: #0a3655;

`;



const ShopLocation = styled.span`

  color: #5c6b7a;

  font-size: 0.75rem;

`;



const NoShops = styled.div`

  font-size: 0.8125rem;

  color: #9ca3af;

  font-style: italic;

`;



const formatStatus = (status: string) => {
  if (!status) return 'N/A';
  return status
    .replace(/_/g, ' ')
    .toUpperCase();
};

const StatusBadge = styled.span<{ $status: string }>`

  display: inline-block;

  padding: 0.25rem 0.75rem;

  border-radius: 4px;

  font-size: 0.75rem;

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

        return 'background: #fee2e2; color: #991b1b;';

      case 'suspended':

        return 'background: #fecaca; color: #7f1d1d;';

      case 'test':

        return 'background: #fef3c7; color: #92400e;';

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



const StatCard = styled.div<{ $active?: boolean; $clickable?: boolean }>`

  background: white;

  border-radius: 12px;

  padding: 1.25rem;

  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);

  ${p => p.$clickable && `
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.15);
    }
  `}

  ${p => p.$active && `
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  `}

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

  contact_email?: string;

  contactEmail?: string;

  contact_phone?: string;

  contactPhone?: string;

  owner_name?: string;

  owner_email?: string;

  status: 'active' | 'inactive' | 'setup' | 'suspended';

  created_at?: string;

  createdAt: string;

  updated_at?: string;

  updatedAt: string;

  eftposIntegration?: string;

  alipayOption?: string;

  alipayOther?: string;

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

  const [shops, setShops] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [filterState, setFilterState] = useState<string>('all');

  const [includeTestAndNoStatus, setIncludeTestAndNoStatus] = useState(false);

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

  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

  const BUSINESS_EMAIL_DOMAIN = '@vend88.com';

  const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

  const [newBusinessAccount, setNewBusinessAccount] = useState({
    first_name: '',
    last_name: '',
    business_name: '',
    emailPrefix: '',
    phone: '',
    password: '',
  });

  const [createAccountError, setCreateAccountError] = useState('');

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [showPassword, setShowPassword] = useState(false);



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

      // Fetch businesses from real API
      const businessResponse = await axios.post(

        '/api/businesses/list',

        { token },

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

        { token },

        {

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

          },

        }

      );



      // Fetch shops from API

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



      if (businessResponse.data.status_code === 200) {

        const apiBusinessList = businessResponse.data.data || businessResponse.data.business || [];

        setAllBusinesses(apiBusinessList);



        if (customerResponse.data.status_code === 200) {

          const apiCustomers = customerResponse.data.customers || customerResponse.data.data || [];

          setCustomers(apiCustomers);

        } else {

          // If customer API fails, use empty array
          setCustomers([]);

        }

        if (shopResponse.data.status_code === 200) {

          const apiShops = shopResponse.data.data || [];

          setShops(apiShops);

        } else {

          setShops([]);

        }

      } else {

        // If business API fails, use empty array
        setAllBusinesses([]);

        setCustomers([]);

        setShops([]);

      }

    } catch (error) {

      console.error('Failed to fetch data:', error);

      setAllBusinesses([]);

      setCustomers([]);

      setShops([]);

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

      filtered = filtered.filter(b => getNormalizedStatus(b) === filterStatus);

    }



    // Test accounts and businesses with no status set are hidden by default -
    // only show them when the admin explicitly opts in.

    if (!includeTestAndNoStatus) {

      filtered = filtered.filter(b => {

        const status = (deriveBusinessStatus(b._id) || b.status || '').toLowerCase();

        return status !== '' && status !== 'test';

      });

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

      // Group by whether the business has a resolved status at all, regardless
      // of sort field/direction: active/inactive/suspended first, 'test' next,
      // and businesses with no status (derived or manual) set at all last.
      const statusGroupRank = (business: any) => {
        const status = deriveBusinessStatus(business._id) || business.status;
        if (!status) return 2;
        if (status === 'test') return 1;
        return 0;
      };

      const statusGroupDiff = statusGroupRank(a) - statusGroupRank(b);

      if (statusGroupDiff !== 0) return statusGroupDiff;

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

  }, [searchQuery, searchByABN, searchByAddress, searchByOwner, filterStatus, filterState, includeTestAndNoStatus, dateFilterFrom, dateFilterTo, sortField, sortDirection, allBusinesses, customers, shops]);



  const handleClearFilters = () => {

    setSearchQuery('');

    setSearchByABN('');

    setSearchByAddress('');

    setSearchByOwner('');

    setFilterStatus('all');

    setFilterState('all');

    setIncludeTestAndNoStatus(false);

    setDateFilterFrom('');

    setDateFilterTo('');

  };



  const handleBusinessClick = (businessId: string) => {

    router.push(`/admin/businesses/${businessId}`);

  };

  

  const handleViewDetails = (business: Business) => {

    router.push(`/admin/businesses/${business._id}`);

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

  const resetCreateAccountForm = () => {
    setNewBusinessAccount({ first_name: '', last_name: '', business_name: '', emailPrefix: '', phone: '', password: '' });
    setCreateAccountError('');
    setShowPassword(false);
  };

  const handleGeneratePassword = () => {
    const digits = Math.floor(1000 + Math.random() * 9000);
    setNewBusinessAccount((prev) => ({ ...prev, password: `Vend${digits}` }));
    setShowPassword(true);
  };

  const handleCreateBusinessAccount = async () => {
    const { first_name, last_name, business_name, emailPrefix, phone, password } = newBusinessAccount;

    if (!first_name || !last_name || !business_name || !emailPrefix || !phone || !password) {
      setCreateAccountError(
        lang === 'zh' ? '请填写所有必填字段' : 'Please fill in all required fields'
      );
      return;
    }

    if (!PHONE_REGEX.test(phone.trim())) {
      setCreateAccountError(
        lang === 'zh' ? '请输入有效的电话号码（例如 +61400000000）' : 'Please enter a valid phone number (e.g. +61400000000)'
      );
      return;
    }

    const email = `${emailPrefix.trim().toLowerCase()}${BUSINESS_EMAIL_DOMAIN}`;

    setCreateAccountError('');
    setIsCreatingAccount(true);

    try {
      const response = await axios.post(
        '/api/businesses/create-account',
        { token, first_name, last_name, business_name, email, phone, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 201 || response.data.status_code === 200) {
        const newBusinessId = response.data.business?._id;
        setShowCreateAccountModal(false);
        resetCreateAccountForm();
        if (newBusinessId) {
          router.push(`/admin/businesses/${newBusinessId}`);
        } else {
          await fetchBusinesses();
        }
      } else {
        throw new Error(response.data.message || 'Create failed');
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setCreateAccountError(lang === 'zh' ? '邮箱已存在' : 'Email already exists');
      } else {
        setCreateAccountError(
          error?.response?.data?.message ||
          (lang === 'zh' ? '创建账户失败，请重试' : 'Failed to create account, please try again')
        );
      }
    } finally {
      setIsCreatingAccount(false);
    }
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



  const getShopsForBusiness = (businessId: string) => {

    return shops.filter(s => s.business_id === businessId);

  };

  // Same derivation as the business detail page: once a business has shops
  // that have an explicit status set, it's computed from them rather than the
  // manually-set field - any active shop wins outright, else the most severe
  // remaining condition (suspended, then inactive) wins, and only reads 'test'
  // if every status-bearing shop is. Shops that have never had a status set
  // are ignored entirely (not treated as 'active') - if none of a business's
  // shops have a status yet, this returns null so no badge is shown.
  const deriveBusinessStatus = (businessId: string): string | null => {
    const statuses = getShopsForBusiness(businessId).map(s => s.status).filter(Boolean);
    if (statuses.length === 0) return null;
    if (statuses.includes('active')) return 'active';
    if (statuses.includes('suspended')) return 'suspended';
    if (statuses.includes('inactive')) return 'inactive';
    return 'test';
  };

  // The single source of truth for "what status is this business" - matches
  // what's actually shown on its card/badge (shop-derived status first, else
  // its own manually-set status), normalized into the same bucket used by
  // both the stat cards and the status filter/dropdown so they never disagree
  // with what's on screen.
  const getNormalizedStatus = (business: Business): string => {
    const raw = deriveBusinessStatus(business._id) || business.status || '';
    const normalized = raw.toLowerCase().replace(/_/g, ' ').replace(/ /g, '');
    return normalized === 'insetup' ? 'setup' : normalized;
  };



  const formatShopLocation = (location: any) => {

    if (typeof location === 'string' && location.trim()) return location;

    return null;

  };



  const getBusinessOwnerName = (business: any) => {

    // Check owner_name first (set when creating new business)

    if (business.owner_name) return business.owner_name;

    // Fall back to looking up by owner_id

    if (business.owner_id) return getOwnerName(business.owner_id);

    return '';

  };

  

  const formatDate = (dateString: string | null | undefined) => {

    if (!dateString) return 'N/A';

    try {

      const date = new Date(dateString);

      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString();

    } catch {

      return 'N/A';

    }

  };



  // Calculate stats

  const stats = {

    total: allBusinesses.length,

    active: allBusinesses.filter(b => getNormalizedStatus(b) === 'active').length,

    setup: allBusinesses.filter(b => getNormalizedStatus(b) === 'setup').length,

    inactive: allBusinesses.filter(b => getNormalizedStatus(b) === 'inactive').length,

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

            <HeaderLeft>

              <PageTitle>{t("businessManagement")}</PageTitle>

              <PageDescription>

                {lang === "zh"

                  ? "管理所有业务和地点。查看、添加、编辑和监控业务信息。"

                  : "Manage all businesses and locations. View, add, edit, and monitor business information."}

              </PageDescription>

            </HeaderLeft>

            <CreateBusinessButton onClick={() => { resetCreateAccountForm(); setShowCreateAccountModal(true); }}>

              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                <line x1="12" y1="5" x2="12" y2="19"/>

                <line x1="5" y1="12" x2="19" y2="12"/>

              </svg>

              {lang === 'zh' ? '创建新业务' : 'Create New Business'}

            </CreateBusinessButton>

          </ContentHeader>



          <StatsContainer>

            <StatCard $clickable $active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>

              <StatLabel>{lang === "zh" ? "总业务数" : "Total Businesses"}</StatLabel>

              <StatValue>{stats.total}</StatValue>

            </StatCard>

            <StatCard $clickable $active={filterStatus === 'active'} onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')}>

              <StatLabel>{lang === "zh" ? "活跃" : "Active"}</StatLabel>

              <StatValue style={{ color: '#065f46' }}>{stats.active}</StatValue>

            </StatCard>

            <StatCard $clickable $active={filterStatus === 'setup'} onClick={() => setFilterStatus(filterStatus === 'setup' ? 'all' : 'setup')}>

              <StatLabel>{lang === "zh" ? "设置中" : "In Setup"}</StatLabel>

              <StatValue style={{ color: '#1e40af' }}>{stats.setup}</StatValue>

            </StatCard>

            <StatCard $clickable $active={filterStatus === 'inactive'} onClick={() => setFilterStatus(filterStatus === 'inactive' ? 'all' : 'inactive')}>

              <StatLabel>{lang === "zh" ? "非活跃" : "Inactive"}</StatLabel>

              <StatValue style={{ color: '#6b7280' }}>{stats.inactive}</StatValue>

            </StatCard>

          </StatsContainer>



          <SearchFilterContainer>

            <SearchRow>

              <SearchInput

                type="text"

                placeholder={lang === "zh" ? "搜索业务名称、ID、邮箱..." : "Search business name, ID, email..."}

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

              <SearchInput

                type="text"

                placeholder={lang === "zh" ? "按所有者搜索..." : "Search by owner..."}

                value={searchByOwner}

                onChange={(e) => setSearchByOwner(e.target.value)}

              />

              <SearchInput

                type="date"

                placeholder={lang === "zh" ? "从日期" : "From date"}

                value={dateFilterFrom}

                onChange={(e) => setDateFilterFrom(e.target.value)}

              />

              <SearchInput

                type="date"

                placeholder={lang === "zh" ? "到日期" : "To date"}

                value={dateFilterTo}

                onChange={(e) => setDateFilterTo(e.target.value)}

              />

            </AdvancedSearchPanel>

            

            <FilterRow>

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

              <FilterCheckboxLabel>

                <Checkbox

                  checked={includeTestAndNoStatus}

                  onChange={(e) => setIncludeTestAndNoStatus(e.target.checked)}

                />

                {lang === "zh" ? "包含测试和无状态账户" : "Include test & no-status accounts"}

              </FilterCheckboxLabel>

              {(searchQuery || searchByABN || searchByAddress || searchByOwner || filterStatus !== 'all' || filterState !== 'all' || includeTestAndNoStatus || dateFilterFrom || dateFilterTo) && (

                <ClearButton onClick={handleClearFilters}>

                  {lang === "zh" ? "清除" : "Clear"}

                </ClearButton>

              )}

            </FilterRow>

          </SearchFilterContainer>

          

          <ControlBar>

            <ControlGroup>

              <Select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>

                <option value="name">{lang === 'zh' ? '按名称排序' : 'Sort by Name'}</option>

                <option value="createdAt">{lang === 'zh' ? '按日期排序' : 'Sort by Date'}</option>

                <option value="status">{lang === 'zh' ? '按状态排序' : 'Sort by Status'}</option>

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

              <EmptyIcon>🏢</EmptyIcon>

              <EmptyText>{lang === "zh" ? "未找到业务" : "No businesses found"}</EmptyText>

              <EmptySubtext>

                {lang === "zh" ? "批准注册表单后，业务将自动创建。" : "Businesses will be created automatically when registrations are approved."}

              </EmptySubtext>

            </EmptyState>

          ) : viewMode === 'table' ? (

            <TableContainer>

              <BulkActionBar $show={selectedRows.size > 0}>

                <BulkActionText>

                  {lang === 'zh' 

                    ? `已选择 ${selectedRows.size} 个业务` 

                    : `${selectedRows.size} business${selectedRows.size > 1 ? 'es' : ''} selected`}

                </BulkActionText>

                <BulkActionButtons>

                  <ActionButton onClick={handleBulkExport}>

                    <DownloadIcon /> {lang === 'zh' ? '导出选中' : 'Export Selected'}

                  </ActionButton>

                  <ActionButton onClick={() => setSelectedRows(new Set())}>

                    {lang === 'zh' ? '取消选择' : 'Deselect All'}

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

                      {lang === 'zh' ? '业务名称' : 'Business Name'} <SortIcon />

                    </Th>

                    <Th>{lang === 'zh' ? '所有者' : 'Owner'}</Th>

                    <Th onClick={() => handleSort('status')}>

                      {lang === 'zh' ? '状态' : 'Status'} <SortIcon />

                    </Th>

                    <Th>{lang === 'zh' ? '地点' : 'Location'}</Th>

                    <Th onClick={() => handleSort('createdAt')}>

                      {lang === 'zh' ? '创建日期' : 'Created'} <SortIcon />

                    </Th>

                    <Th>{lang === 'zh' ? '操作' : 'Actions'}</Th>

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

                        {(deriveBusinessStatus(business._id) || business.status) && (
                          <StatusBadge $status={deriveBusinessStatus(business._id) || business.status}>

                            {formatStatus(deriveBusinessStatus(business._id) || business.status)}

                          </StatusBadge>
                        )}

                      </Td>

                      <Td>{business.state ? `${business.suburb || ''}, ${business.state}` : 'N/A'}</Td>

                      <Td>{new Date(business.createdAt).toLocaleDateString()}</Td>

                      <Td>

                        <ActionButtons>

                          <IconButton onClick={() => handleViewDetails(business)} title={lang === 'zh' ? '查看详情' : 'View Details'}>

                            <EyeIcon />

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

                      <InfoRow style={{ marginBottom: '0.5rem' }}>

                        <span style={{ color: '#5c6b7a', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>

                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>

                            <circle cx="12" cy="10" r="3"/>

                          </svg>

                          {(business.suburb || business.state) ? `${business.suburb}${business.state && `, ${business.state}`}` : 'N/A'}

                        </span>

                      </InfoRow>

                    </div>

                    {(deriveBusinessStatus(business._id) || business.status) && (
                      <StatusBadge $status={deriveBusinessStatus(business._id) || business.status}>

                        {formatStatus(deriveBusinessStatus(business._id) || business.status)}

                      </StatusBadge>
                    )}

                  </CardHeader>

                  <BusinessInfo>

                    <InfoRow>

                      <InfoLabel>{lang === "zh" ? "所有者:" : "Owner:"}</InfoLabel>

                      <InfoValue>{getBusinessOwnerName(business)}</InfoValue>

                    </InfoRow>

                    <InfoRow>

                      <InfoLabel>{lang === "zh" ? "创建:" : "Created:"}</InfoLabel>

                      <InfoValue>{formatDate(business.created_at)}</InfoValue>

                    </InfoRow>

                  </BusinessInfo>

                  <ShopSection>

                    <ShopSectionTitle>
                      {lang === 'zh' ? `店铺 (${getShopsForBusiness(business._id).length})` : `Shops (${getShopsForBusiness(business._id).length})`}
                    </ShopSectionTitle>

                    {getShopsForBusiness(business._id).length === 0 ? (
                      <NoShops>{lang === 'zh' ? '暂无店铺' : 'No shops yet'}</NoShops>
                    ) : (
                      getShopsForBusiness(business._id).map(shop => (
                        <ShopItem key={shop._id}>
                          <ShopName>{shop.store_name || shop.name || 'N/A'}</ShopName>
                          {formatShopLocation(shop.location) && (
                            <ShopLocation>{formatShopLocation(shop.location)}</ShopLocation>
                          )}
                        </ShopItem>
                      ))
                    )}

                  </ShopSection>

                  <CardActions>

                    <CardButton onClick={() => handleViewDetails(business)}>

                      <EyeIcon /> {lang === 'zh' ? '详情' : 'Details'}

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

                  ? `显示 ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, businesses.length)} / 共 ${businesses.length}` 

                  : `Showing ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, businesses.length)} of ${businesses.length}`}

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

                  {lang === 'zh' ? '下一页' : 'Next'}

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

            <CloseButton onClick={handleCloseModal}>×</CloseButton>

          </ModalHeader>

          

          <DetailGrid>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '业务ID' : 'Business ID'}</DetailLabel>

              <DetailValue>{selectedBusiness?._id}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '所有者' : 'Owner'}</DetailLabel>

              <DetailValue>{selectedBusiness?.owner_name || (selectedBusiness ? getOwnerName(selectedBusiness.owner_id) : 'N/A') || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '所有者邮箱' : 'Owner Email'}</DetailLabel>

              <DetailValue>{selectedBusiness?.owner_email || (selectedBusiness ? getOwnerEmail(selectedBusiness.owner_id) : 'N/A') || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '状态' : 'Status'}</DetailLabel>

              <DetailValue>

                {(() => {
                  const resolvedStatus = (selectedBusiness && deriveBusinessStatus(selectedBusiness._id)) || selectedBusiness?.status;
                  return resolvedStatus ? (
                    <StatusBadge $status={resolvedStatus}>
                      {formatStatus(resolvedStatus)}
                    </StatusBadge>
                  ) : 'N/A';
                })()}

              </DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? 'ABN' : 'ABN'}</DetailLabel>

              <DetailValue>{selectedBusiness?.abn || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '地址' : 'Address'}</DetailLabel>

              <DetailValue>{selectedBusiness?.address || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '郊区' : 'Suburb'}</DetailLabel>

              <DetailValue>{selectedBusiness?.suburb || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '州' : 'State'}</DetailLabel>

              <DetailValue>{selectedBusiness?.state || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '邮编' : 'Postcode'}</DetailLabel>

              <DetailValue>{selectedBusiness?.postcode || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '联系邮箱' : 'Contact Email'}</DetailLabel>

              <DetailValue>{selectedBusiness?.contact_email || selectedBusiness?.contactEmail || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '联系电话' : 'Contact Phone'}</DetailLabel>

              <DetailValue>{selectedBusiness?.contact_phone || selectedBusiness?.contactPhone || 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '创建日期' : 'Created Date'}</DetailLabel>

              <DetailValue>

                {formatDate(selectedBusiness?.created_at || selectedBusiness?.createdAt)}

              </DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '更新日期' : 'Updated Date'}</DetailLabel>

              <DetailValue>

                {formatDate(selectedBusiness?.updated_at || selectedBusiness?.updatedAt)}

              </DetailValue>

            </DetailItem>

          </DetailGrid>

          

          <ModalActions>

            <ActionButton onClick={handleCloseModal}>

              {lang === 'zh' ? '关闭' : 'Close'}

            </ActionButton>

            {selectedBusiness && getOwnerEmail(selectedBusiness.owner_id) && (

              <ActionButton onClick={() => window.location.href = `mailto:${getOwnerEmail(selectedBusiness.owner_id)}`}>

                {lang === 'zh' ? '发送邮件' : 'Send Email'}

              </ActionButton>

            )}

            <ActionButton $variant="primary" onClick={() => {

              if (selectedBusiness) {

                handleBusinessClick(selectedBusiness._id);

                handleCloseModal();

              }

            }}>

              <EditIcon /> {lang === 'zh' ? '编辑业务' : 'Edit Business'}

            </ActionButton>

          </ModalActions>

        </ModalContent>

      </Modal>

      

      {/* Status Change Confirmation Modal */}

      {showStatusModal && (

        <Modal $show={showStatusModal} onClick={() => setShowStatusModal(false)}>

          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>

            <ModalTitle>{lang === 'zh' ? '更改状态' : 'Change Status'}</ModalTitle>

            <DetailValue style={{ margin: '1.5rem 0' }}>

              {lang === 'zh' 

                ? `确定要将状态更改为 "${statusToChange?.newStatus}" 吗？`

                : `Are you sure you want to change the status to "${statusToChange?.newStatus}"?`}

            </DetailValue>

            <ModalActions>

              <ActionButton onClick={() => {

                setShowStatusModal(false);

                setStatusToChange(null);

              }}>

                {lang === 'zh' ? '取消' : 'Cancel'}

              </ActionButton>

              <ActionButton $variant="primary" onClick={handleConfirmStatusChange}>

                {lang === 'zh' ? '确认更改' : 'Confirm Change'}

              </ActionButton>

            </ModalActions>

          </ModalContent>

        </Modal>

      )}

      {/* Create Business Account Modal */}

      {showCreateAccountModal && (

        <Modal $show={showCreateAccountModal} onClick={() => setShowCreateAccountModal(false)}>

          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>

            <ModalHeader>

              <ModalTitle>{lang === 'zh' ? '创建业务账户' : 'Create Business Account'}</ModalTitle>

              <CloseButton onClick={() => setShowCreateAccountModal(false)}>×</CloseButton>

            </ModalHeader>

            <FieldHint>

              {lang === 'zh'

                ? '创建业务及其所有者的登录账户。'

                : 'Creates the business along with a login account for its owner.'}

            </FieldHint>

            <Section>

              <DetailLabel>{lang === 'zh' ? '业务名称' : 'Business Name'} *</DetailLabel>

              <Input

                type="text"

                value={newBusinessAccount.business_name}

                onChange={(e) => setNewBusinessAccount({ ...newBusinessAccount, business_name: e.target.value })}

                placeholder={lang === 'zh' ? '输入业务名称' : 'Enter business name'}

              />

            </Section>

            <Section>

              <DetailLabel>{lang === 'zh' ? '名字' : 'First Name'} *</DetailLabel>

              <Input

                type="text"

                value={newBusinessAccount.first_name}

                onChange={(e) => setNewBusinessAccount({ ...newBusinessAccount, first_name: e.target.value })}

                placeholder={lang === 'zh' ? '输入名字' : 'Enter first name'}

              />

            </Section>

            <Section>

              <DetailLabel>{lang === 'zh' ? '姓氏' : 'Last Name'} *</DetailLabel>

              <Input

                type="text"

                value={newBusinessAccount.last_name}

                onChange={(e) => setNewBusinessAccount({ ...newBusinessAccount, last_name: e.target.value })}

                placeholder={lang === 'zh' ? '输入姓氏' : 'Enter last name'}

              />

            </Section>

            <Section>

              <DetailLabel>{lang === 'zh' ? '邮箱' : 'Email'} *</DetailLabel>

              <EmailInputGroup>

                <Input

                  type="text"

                  style={{ borderRadius: '8px 0 0 8px' }}

                  value={newBusinessAccount.emailPrefix}

                  onChange={(e) => setNewBusinessAccount({ ...newBusinessAccount, emailPrefix: e.target.value.toLowerCase() })}

                  placeholder={lang === 'zh' ? '输入邮箱前缀' : 'Enter email prefix'}

                />

                <EmailSuffix>{BUSINESS_EMAIL_DOMAIN}</EmailSuffix>

              </EmailInputGroup>

            </Section>

            <Section>

              <DetailLabel>{lang === 'zh' ? '电话' : 'Phone'} *</DetailLabel>

              <Input

                type="tel"

                value={newBusinessAccount.phone}

                onChange={(e) => setNewBusinessAccount({ ...newBusinessAccount, phone: e.target.value })}

                placeholder={lang === 'zh' ? '例如 +61400000000' : 'e.g. +61400000000'}

              />

            </Section>

            <Section>

              <DetailLabel>{lang === 'zh' ? '密码' : 'Password'} *</DetailLabel>

              <PasswordFieldRow>

                <PasswordInputWrapper>

                  <Input

                    type={showPassword ? 'text' : 'password'}

                    style={{ paddingRight: '2.5rem' }}

                    value={newBusinessAccount.password}

                    onChange={(e) => setNewBusinessAccount({ ...newBusinessAccount, password: e.target.value })}

                    placeholder={lang === 'zh' ? '输入密码' : 'Enter password'}

                  />

                  <ToggleVisibilityButton

                    type="button"

                    onClick={() => setShowPassword((prev) => !prev)}

                    aria-label={showPassword ? (lang === 'zh' ? '隐藏密码' : 'Hide password') : (lang === 'zh' ? '显示密码' : 'Show password')}

                  >

                    {showPassword ? (

                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />

                        <line x1="1" y1="1" x2="23" y2="23" />

                      </svg>

                    ) : (

                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />

                        <circle cx="12" cy="12" r="3" />

                      </svg>

                    )}

                  </ToggleVisibilityButton>

                </PasswordInputWrapper>

                <GeneratePasswordButton type="button" onClick={handleGeneratePassword}>

                  {lang === 'zh' ? '生成密码' : 'Generate'}

                </GeneratePasswordButton>

              </PasswordFieldRow>

            </Section>

            {createAccountError && <ErrorText>{createAccountError}</ErrorText>}

            <ModalActions>

              <ActionButton onClick={() => setShowCreateAccountModal(false)} disabled={isCreatingAccount}>

                {lang === 'zh' ? '取消' : 'Cancel'}

              </ActionButton>

              <ActionButton $variant="primary" onClick={handleCreateBusinessAccount} disabled={isCreatingAccount}>

                {isCreatingAccount

                  ? (lang === 'zh' ? '创建中...' : 'Creating...')

                  : (lang === 'zh' ? '创建账户' : 'Create Account')}

              </ActionButton>

            </ModalActions>

          </ModalContent>

        </Modal>

      )}

    </MainLayout>

  );

}

