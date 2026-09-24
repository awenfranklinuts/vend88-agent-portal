"use client";



import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import styled from "styled-components";

import { useAuth, isPortalUser, hasPermission, canSeeAllTeams } from "@/context/AuthContext";

import { useLanguage } from "@/context/LanguageContext";

import { dict } from "@/i18n/translations";

import MainLayout from "@/components/layout/MainLayout";

import { downloadCsv } from "@/lib/csv";
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

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0a3655;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #0a3655;
  resize: vertical;
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

const FormSectionTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0a3655;
  margin: 1.5rem 0 0.875rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e7ef;

  &:first-of-type {
    margin-top: 0;
  }
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0;
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

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 2px solid ${p => p.$active ? '#1a237e' : '#e0e7ef'};
  background: ${p => p.$active ? '#1a237e' : 'white'};
  color: ${p => p.$active ? 'white' : '#5c6b7a'};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e0e7ef;
`;



const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
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
  grid-column: span 2;

  @media (max-width: 968px) {
    grid-column: auto;
    white-space: normal;
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

  width: 100%;

  

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



const NoShops = styled.div`

  font-size: 0.8125rem;

  color: #9ca3af;

  font-style: italic;

`;



const formatStatus = (status: string) => {
  if (!status) return 'N/A';
  // 'setup' is what provisioning stores; 'In Setup' is how it reads.
  const normalized = status.toLowerCase().replace(/[_\s]/g, '');
  if (normalized === 'setup' || normalized === 'insetup') return 'In Setup';
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

  // Attribution: which portal user brought the business in, and their team
  owner_user_id?: string | null;
  attributed_to_name?: string;
  attributed_to_email?: string;
  team_id?: string | null;
  team_name?: string;

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

  // 'all' | 'house' (no team) | a team id. Only shown to users who see every team.
  const [filterTeam, setFilterTeam] = useState<string>('all');

  const [includeNoStatus, setIncludeNoStatus] = useState(false);

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



  const [showStatusModal, setShowStatusModal] = useState(false);

  const [statusToChange, setStatusToChange] = useState<{businessId: string, newStatus: string} | null>(null);

  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  // Empty means a new contact is being typed; set means link that customer.
  const [newCustomerId, setNewCustomerId] = useState('');


  const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

  const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  // Fields mirror the registration form template (all mandatory except contact name and notes), plus the
  // owner's POS login credentials.
  const EMPTY_BUSINESS_ACCOUNT = {
    contact_email: '',
    contact_name: '',
    phone: '',
    business_name: '',
    abn: '',
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    notes: '',
  };

  const [newBusinessAccount, setNewBusinessAccount] = useState(EMPTY_BUSINESS_ACCOUNT);

  const updateNewBusinessAccount = (field: keyof typeof EMPTY_BUSINESS_ACCOUNT, value: string) => {
    setNewBusinessAccount((prev) => ({ ...prev, [field]: value }));
  };

  const [createAccountError, setCreateAccountError] = useState('');

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);




  const t = (key: keyof typeof dict) => dict[key][lang];



  useEffect(() => {

    if (!isLoading && !token) {

      router.push("/login");

    } else if (!isLoading && token && !isPortalUser(role)) {

      router.push("/login");

    }

  }, [token, role, isLoading, router]);



  useEffect(() => {

    if (token && isPortalUser(role)) {

      fetchBusinesses();

    }

  }, [token, role]);



  // axios rejects on any non-2xx, which would abort fetchBusinesses before it
  // renders anything. This hands the failed response back instead, so the
  // caller's own status_code checks decide what to do with it.
  const optionalPost = async (url: string): Promise<{ data: any }> => {
    try {
      return await axios.post(
        url,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      return { data: { status_code: error?.response?.status || 502 } };
    }
  };

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

      

      // Customers and shops only enrich the business rows - they aren't needed to
      // render the list. An admin granted businesses but not customers still sees
      // their businesses, so neither call is allowed to abort the fetch.
      const customerResponse = await optionalPost('/api/customer/list');

      const shopResponse = await optionalPost('/api/shops/list');



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

        searchableName(b).includes(query) ||

        b._id?.toLowerCase().includes(query) ||

        b.owner_id?.toLowerCase().includes(query) ||

        b.contactEmail?.toLowerCase().includes(query) ||

        b.contact_email?.toLowerCase().includes(query)

      );

    }

    

    if (searchByABN.trim() !== '') {

      const abnQuery = searchByABN.toLowerCase();

      filtered = filtered.filter(b => b.abn?.toLowerCase().includes(abnQuery));

    }

    

    if (searchByAddress.trim() !== '') {

      const addressQuery = searchByAddress.toLowerCase();

      filtered = filtered.filter(b => searchableAddress(b).includes(addressQuery));

    }

    

    if (searchByOwner.trim() !== '') {

      const ownerQuery = searchByOwner.toLowerCase();

      // Matches the resolved name, so searching by owner still works when the
      // customers list couldn't be loaded.
      filtered = filtered.filter(b =>

        getBusinessOwnerName(b).toLowerCase().includes(ownerQuery)

      );

    }

    

    // Status filter

    if (filterStatus !== 'all') {

      filtered = filtered.filter(b => getNormalizedStatus(b) === filterStatus);

    }



    // Businesses with no status set at all are hidden by default - they are
    // half-made records rather than a state anyone chose. Test accounts are a
    // real status and are filtered from the dropdown like any other.

    if (!includeNoStatus) {

      filtered = filtered.filter(b => (deriveBusinessStatus(b._id) || b.status || '') !== '');

    }



    // State filter

    if (filterState !== 'all') {

      // The state often exists only inside the store's address line, so it is
      // matched there too - as a whole word, so "NT" cannot hit "FRONT ST".
      const stateWord = new RegExp(`\\b${filterState}\\b`, 'i');
      filtered = filtered.filter(b => b.state === filterState || stateWord.test(searchableAddress(b)));

    }

    // Team filter
    if (filterTeam === 'house') {
      filtered = filtered.filter(b => !b.team_id);
    } else if (filterTeam !== 'all') {
      filtered = filtered.filter(b => b.team_id === filterTeam);
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

        compareValue = new Date(createdAtOf(a)).getTime() - new Date(createdAtOf(b)).getTime();

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

  }, [searchQuery, searchByABN, searchByAddress, searchByOwner, filterStatus, filterState, filterTeam, includeNoStatus, sortField, sortDirection, allBusinesses, customers, shops]);

  // Teams present in the loaded data, for the Team filter
  const teamOptions = Array.from(
    allBusinesses.reduce((map, b) => {
      if (b.team_id) map.set(b.team_id, b.team_name || b.team_id);
      return map;
    }, new Map<string, string>())
  ).sort((a, b) => a[1].localeCompare(b[1]));
  const showTeamColumn = canSeeAllTeams(adminProfile);
  const canManageBusinesses = hasPermission(adminProfile, 'manage_businesses');



  const handleClearFilters = () => {

    setSearchQuery('');

    setSearchByABN('');

    setSearchByAddress('');

    setSearchByOwner('');

    setFilterStatus('all');

    setFilterState('all');

    setFilterTeam('all');

    setIncludeNoStatus(false);

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
    setNewBusinessAccount(EMPTY_BUSINESS_ACCOUNT);
    setNewCustomerId('');
    setCreateAccountError('');
  };

  const handleCreateBusinessAccount = async () => {
    const trimmed = Object.fromEntries(
      Object.entries(newBusinessAccount).map(([key, value]) => [key, value.trim()])
    ) as typeof newBusinessAccount;

    // Only the business name is required. Anything else is checked for shape
    // only when it was actually filled in.
    if (!trimmed.business_name) {
      setCreateAccountError(lang === 'zh' ? '请输入店铺名称' : 'Store name is required');
      return;
    }

    const validationError =
      !newCustomerId && trimmed.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.contact_email)
        ? (lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address')
      : trimmed.phone && !PHONE_REGEX.test(trimmed.phone)
        ? (lang === 'zh' ? '请输入有效的电话号码（例如 +61400000000）' : 'Please enter a valid phone number (e.g. +61400000000)')
      : trimmed.abn && !/^\d{11}$/.test(trimmed.abn.replace(/\s+/g, ''))
        ? (lang === 'zh' ? 'ABN 必须为 11 位数字' : 'ABN must be 11 digits')
      : trimmed.postcode && !/^\d{4}$/.test(trimmed.postcode)
        ? (lang === 'zh' ? '邮编必须为 4 位数字' : 'Postcode must be 4 digits')
      : '';

    if (validationError) {
      setCreateAccountError(validationError);
      return;
    }

    // The login account needs a first/last name. Contact name is optional, so
    // fall back to the business name when it's left empty.
    const [first_name, ...rest] = (trimmed.contact_name || trimmed.business_name).split(/\s+/);
    // A single-word name has no surname - repeating it gave owners like "John John".
    const last_name = rest.join(' ') || 'Owner';

    setCreateAccountError('');
    setIsCreatingAccount(true);

    try {
      const response = await axios.post(
        '/api/businesses/create-account',
        {
          token,
          first_name,
          last_name,
          phone: trimmed.phone,
          business_name: trimmed.business_name,
          // Either an existing contact is linked, or the details below create one.
          customer_id: newCustomerId || undefined,
          contact_name: newCustomerId ? '' : trimmed.contact_name,
          contact_email: newCustomerId ? '' : trimmed.contact_email,
          abn: trimmed.abn,
          address: trimmed.address,
          suburb: trimmed.suburb,
          state: trimmed.state,
          postcode: trimmed.postcode,
          country: trimmed.country,
        },
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
      // Show the backend's own message - a 409 can be a duplicate email, a
      // duplicate phone, or a rejection passed through from the POS API.
      setCreateAccountError(
        error?.response?.data?.message ||
        (lang === 'zh' ? '创建账户失败，请重试' : 'Failed to create account, please try again')
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  

  const exportToCSV = (data: Business[]) => {

    const csvData = data.map(business => {

      const owner = linkedCustomer(business);

      return {

        'Business ID': business._id,

        'Name': business.name || 'N/A',

        'Owner': getBusinessOwnerName(business) || business.owner_id || 'N/A',

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

        'Created': formatDate(createdAtOf(business))

      };

    });

    

    downloadCsv(`businesses_${new Date().toISOString().split('T')[0]}.csv`, csvData);
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



  const shopDisplayName = (shop: any) => String(shop?.store_name || shop?.name || '').trim();

  // The POS writes a [lng, lat] placeholder on shops whose address was never
  // set. Showing "[0, 0]" where an address belongs is worse than showing nothing.
  const isPlaceholderLocation = (value: string) =>
    /^\[?\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\]?$/.test(value.trim());

  const storeAddress = (shop: any) => {
    const value = shop ? formatShopLocation(shop.location) : null;
    return value && !isPlaceholderLocation(value) ? value : '';
  };

  const businessAddress = (business: any) =>
    [business.suburb, business.state].map((v: any) => String(v || '').trim()).filter(Boolean).join(', ');

  // A card is titled and addressed from its store, so searching has to look
  // there too - matching the business record alone found nothing for the many
  // businesses whose address lives on the shop.
  const createdAtOf = (business: any) => business.created_at || business.createdAt || '';

  const searchableName = (business: any) => {
    const store = getShopsForBusiness(business._id)[0] || null;
    return [business.name, store ? shopDisplayName(store) : ''].filter(Boolean).join(' ').toLowerCase();
  };

  const searchableAddress = (business: any) => {
    const store = getShopsForBusiness(business._id)[0] || null;
    return [
      storeAddress(store),
      business.address, business.suburb, business.state, business.postcode,
    ].filter(Boolean).join(' ').toLowerCase();
  };

  const linkedCustomer = (business: any) =>
    business.customer_id ? customers.find((c: any) => c._id === business.customer_id) : undefined;

  const getBusinessOwnerEmail = (business: any) => {
    const customer = linkedCustomer(business);
    return customer?.email || business?.owner_email || '';
  };

  const getBusinessOwnerName = (business: any) => {
    // The store owner is the linked customer, and nothing else. owner_id is the
    // VendPOS login - for a store created with no contact details that account
    // is auto-generated ("ajk Owner"), which is not a person anyone dealt with,
    // so it must not stand in here. Matches the store's own page, which shows
    // N/A in the same situation.
    const customer = linkedCustomer(business);
    if (customer) return customer.name || customer.email || business.customer_id;

    return business.contact_name || 'N/A';
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



  if (!token || !isPortalUser(role)) {

    return null;

  }



  // Read access is enough to open the page; write actions check manage_businesses individually
  if (!hasPermission(adminProfile, 'view_businesses')) {

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

                  ? "管理所有店铺和地点。查看、添加、编辑和监控店铺信息。"

                  : "Manage all stores and locations. View, add, edit, and monitor store information."}

              </PageDescription>

            </HeaderLeft>

            {canManageBusinesses && (
            <CreateBusinessButton onClick={() => { resetCreateAccountForm(); setShowCreateAccountModal(true); }}>

              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                <line x1="12" y1="5" x2="12" y2="19"/>

                <line x1="5" y1="12" x2="19" y2="12"/>

              </svg>

              {lang === 'zh' ? '创建新店铺' : 'Create New Store'}

            </CreateBusinessButton>
            )}

          </ContentHeader>



          <StatsContainer>

            <StatCard $clickable $active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>

              <StatLabel>{lang === "zh" ? "总店铺数" : "Total Stores"}</StatLabel>

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

                placeholder={lang === "zh" ? "搜索店铺名称、ID、邮箱..." : "Search store name, ID, email..."}

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

            </AdvancedSearchPanel>

            

            <FilterRow>

              <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>

                <option value="all">{lang === "zh" ? "所有状态" : "All Status"}</option>

                <option value="active">{lang === "zh" ? "活跃" : "Active"}</option>

                <option value="setup">{lang === "zh" ? "设置中" : "In Setup"}</option>

                <option value="test">{lang === "zh" ? "测试" : "Test"}</option>

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

              {showTeamColumn && (
                <FilterSelect value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
                  <option value="all">{lang === "zh" ? "所有团队" : "All Teams"}</option>
                  <option value="house">{lang === "zh" ? "Vend88（内部账户）" : "Vend88 (house accounts)"}</option>
                  {teamOptions.map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </FilterSelect>
              )}

              <FilterCheckboxLabel>

                <Checkbox

                  checked={includeNoStatus}

                  onChange={(e) => setIncludeNoStatus(e.target.checked)}

                />

                {lang === "zh" ? "包含无状态账户" : "Include accounts with no status"}

              </FilterCheckboxLabel>

              {(searchQuery || searchByABN || searchByAddress || searchByOwner || filterStatus !== 'all' || filterState !== 'all' || filterTeam !== 'all' || includeNoStatus) && (

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

              <EmptyText>{lang === "zh" ? "未找到店铺" : "No stores found"}</EmptyText>

              <EmptySubtext>

                {lang === "zh" ? "批准注册表单后，店铺将自动创建。" : "Stores will be created automatically when registrations are approved."}

              </EmptySubtext>

            </EmptyState>

          ) : viewMode === 'table' ? (

            <TableContainer>

              <BulkActionBar $show={selectedRows.size > 0}>

                <BulkActionText>

                  {lang === 'zh' 

                    ? `已选择 ${selectedRows.size} 个店铺` 

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

                      {lang === 'zh' ? '店铺名称' : 'Store Name'} <SortIcon />

                    </Th>

                    <Th>{lang === 'zh' ? '所有者' : 'Owner'}</Th>

                    {showTeamColumn && <Th>{lang === 'zh' ? '团队' : 'Team'}</Th>}

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

                      <Td>{getBusinessOwnerName(business)}</Td>

                      {showTeamColumn && (
                        <Td>
                          <div>{business.team_name || <span style={{ color: '#9ca3af' }}>{lang === 'zh' ? 'Vend88' : 'Vend88'}</span>}</div>
                          {business.attributed_to_name && (
                            <div style={{ fontSize: '0.8125rem', color: '#5c6b7a' }}>{business.attributed_to_name}</div>
                          )}
                        </Td>
                      )}

                      <Td>

                        {(deriveBusinessStatus(business._id) || business.status) && (
                          <StatusBadge $status={deriveBusinessStatus(business._id) || business.status}>

                            {formatStatus(deriveBusinessStatus(business._id) || business.status)}

                          </StatusBadge>
                        )}

                      </Td>

                      <Td>{business.state ? `${business.suburb || ''}, ${business.state}` : 'N/A'}</Td>

                      <Td>{formatDate(createdAtOf(business))}</Td>

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

              {paginatedBusinesses.map(business => {

                // A business and its store are one entity, so a card shows one
                // record rather than a business with a shop list hanging off it,
                // under the store's own name - that is the name over the door.
                // Searching still matches the business name behind it.
                const businessShops = getShopsForBusiness(business._id);
                const store = businessShops[0] || null;
                const storeName = store ? shopDisplayName(store) : '';
                const businessName = business.name || '';
                const title = storeName && storeName !== businessName ? storeName : (businessName || 'N/A');
                const address = storeAddress(store) || businessAddress(business);

                return (
                <BusinessCard key={business._id}>

                  <CardHeader>

                    <div style={{ flex: 1 }}>

                      <BusinessName>{title}</BusinessName>

                      <InfoRow style={{ marginBottom: '0.5rem' }}>

                        <span style={{ color: '#5c6b7a', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>

                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>

                            <circle cx="12" cy="10" r="3"/>

                          </svg>

                          {address || 'N/A'}

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

                      <InfoLabel>{lang === "zh" ? "店主:" : "Store Owner:"}</InfoLabel>

                      <InfoValue>{getBusinessOwnerName(business)}</InfoValue>

                    </InfoRow>

                    <InfoRow>

                      <InfoLabel>{lang === "zh" ? "创建:" : "Created:"}</InfoLabel>

                      <InfoValue>{formatDate(business.created_at)}</InfoValue>

                    </InfoRow>

                    {/* Older businesses, made before a store came with one */}
                    {!store && (
                      <NoShops style={{ marginTop: '0.35rem' }}>
                        {lang === 'zh' ? '尚未创建店铺' : 'No store yet'}
                      </NoShops>
                    )}

                    {businessShops.length > 1 && (
                      <NoShops style={{ marginTop: '0.35rem' }}>
                        {lang === 'zh'
                          ? `另有 ${businessShops.length - 1} 个店铺`
                          : `+${businessShops.length - 1} more store${businessShops.length - 1 === 1 ? '' : 's'}`}
                      </NoShops>
                    )}

                  </BusinessInfo>

                  <CardActions>

                    <CardButton onClick={() => handleViewDetails(business)}>

                      <EyeIcon /> {lang === 'zh' ? '详情' : 'Details'}

                    </CardButton>

                  </CardActions>

                </BusinessCard>
                );
              })}
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

              <DetailLabel>{lang === 'zh' ? '店铺ID' : 'Store ID'}</DetailLabel>

              <DetailValue>{selectedBusiness?._id}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '店主' : 'Store Owner'}</DetailLabel>

              <DetailValue>{selectedBusiness ? getBusinessOwnerName(selectedBusiness) : 'N/A'}</DetailValue>

            </DetailItem>

            <DetailItem>

              <DetailLabel>{lang === 'zh' ? '所有者邮箱' : 'Owner Email'}</DetailLabel>

              <DetailValue>{(selectedBusiness ? getBusinessOwnerEmail(selectedBusiness) : '') || 'N/A'}</DetailValue>

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

            {selectedBusiness && getBusinessOwnerEmail(selectedBusiness) && (

              <ActionButton onClick={() => window.location.href = `mailto:${getBusinessOwnerEmail(selectedBusiness)}`}>

                {lang === 'zh' ? '发送邮件' : 'Send Email'}

              </ActionButton>

            )}

            <ActionButton $variant="primary" onClick={() => {

              if (selectedBusiness) {

                handleBusinessClick(selectedBusiness._id);

                handleCloseModal();

              }

            }}>

              <EditIcon /> {lang === 'zh' ? '编辑店铺' : 'Edit Store'}

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

          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>

            <ModalHeader>

              <ModalTitle>{lang === 'zh' ? '创建店铺' : 'Create Store'}</ModalTitle>

              <CloseButton onClick={() => setShowCreateAccountModal(false)}>×</CloseButton>

            </ModalHeader>

            <FieldHint>

              {lang === 'zh'

                ? '创建店铺及其记录。仅店铺名称为必填项；VendPOS 登录账户将自动生成，可在详情页查看。'

                : "Creates the store and the record behind it. Only the store name is required \u2014 a VendPOS login is generated automatically and shown on the store's page."}

            </FieldHint>

            <FormSectionTitle>{lang === 'zh' ? '店主联系方式' : 'Store Owner Contact'}</FormSectionTitle>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <ToggleButton type="button" $active={!newCustomerId} onClick={() => setNewCustomerId('')}>
                {lang === 'zh' ? '新建客户' : 'New contact'}
              </ToggleButton>
              <ToggleButton
                type="button"
                $active={Boolean(newCustomerId)}
                onClick={() => setNewCustomerId(customers[0]?._id || '')}
                disabled={!customers.length}
                title={!customers.length ? (lang === 'zh' ? '暂无客户' : 'No customers yet') : undefined}
              >
                {lang === 'zh' ? '关联已有客户' : 'Link existing customer'}
              </ToggleButton>
            </div>

            {newCustomerId ? (
              <Section>
                <DetailLabel>{lang === 'zh' ? '客户' : 'Customer'}</DetailLabel>
                <FilterSelect
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {customers.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.name || c.email || c._id}{c.email && c.name ? ` — ${c.email}` : ''}
                    </option>
                  ))}
                </FilterSelect>
              </Section>
            ) : (
            <>

            <Section>
              <DetailLabel>{lang === 'zh' ? '邮箱地址' : 'Email Address'}</DetailLabel>
              <Input
                type="email"
                value={newBusinessAccount.contact_email}
                onChange={(e) => updateNewBusinessAccount('contact_email', e.target.value)}
                placeholder={lang === 'zh' ? '例如 john@example.com' : 'e.g. john@example.com'}
              />
            </Section>

            <FieldRow>
            <Section>
              <DetailLabel>{lang === 'zh' ? '联系人姓名（可选）' : 'Contact Name (Optional)'}</DetailLabel>
              <Input
                type="text"
                value={newBusinessAccount.contact_name}
                onChange={(e) => updateNewBusinessAccount('contact_name', e.target.value)}
                placeholder={lang === 'zh' ? '输入联系人全名' : 'Enter full name'}
              />
            </Section>

            <Section>
              <DetailLabel>{lang === 'zh' ? '电话号码' : 'Phone Number'}</DetailLabel>
              <Input
                type="tel"
                value={newBusinessAccount.phone}
                onChange={(e) => updateNewBusinessAccount('phone', e.target.value)}
                placeholder={lang === 'zh' ? '例如 +61400000000' : 'e.g. +61400000000'}
              />
            </Section>
            </FieldRow>

            </>
            )}

            <FormSectionTitle>{lang === 'zh' ? '店铺' : 'Store'}</FormSectionTitle>

            <FieldRow>
            <Section>
              <DetailLabel>{lang === 'zh' ? '店铺名称' : 'Store Name'} *</DetailLabel>
              <Input
                type="text"
                value={newBusinessAccount.business_name}
                onChange={(e) => updateNewBusinessAccount('business_name', e.target.value)}
                placeholder={lang === 'zh' ? '例如 Joe\'s Cafe' : 'e.g. Joe\'s Cafe'}
              />
            </Section>

            <Section>
              <DetailLabel>ABN</DetailLabel>
              <Input
                type="text"
                inputMode="numeric"
                value={newBusinessAccount.abn}
                onChange={(e) => updateNewBusinessAccount('abn', e.target.value)}
                placeholder={lang === 'zh' ? '例如 12 345 678 901' : 'e.g. 12 345 678 901'}
              />
            </Section>
            </FieldRow>

            <FormSectionTitle>{lang === 'zh' ? '地址' : 'Address'}</FormSectionTitle>

            <FieldRow>
            <Section>
              <DetailLabel>{lang === 'zh' ? '街道地址' : 'Street Address'}</DetailLabel>
              <Input
                type="text"
                value={newBusinessAccount.address}
                onChange={(e) => updateNewBusinessAccount('address', e.target.value)}
                placeholder={lang === 'zh' ? '例如 123 Main Street' : 'e.g. 123 Main Street'}
              />
            </Section>

            <Section>
              <DetailLabel>{lang === 'zh' ? '城市 / 区' : 'City / Suburb'}</DetailLabel>
              <Input
                type="text"
                value={newBusinessAccount.suburb}
                onChange={(e) => updateNewBusinessAccount('suburb', e.target.value)}
                placeholder={lang === 'zh' ? '例如 Sydney' : 'e.g. Sydney'}
              />
            </Section>
            </FieldRow>

            <FieldRow>
              <Section>
                <DetailLabel>{lang === 'zh' ? '邮编' : 'Postcode'}</DetailLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={newBusinessAccount.postcode}
                  onChange={(e) => updateNewBusinessAccount('postcode', e.target.value)}
                  placeholder={lang === 'zh' ? '例如 2000' : 'e.g. 2000'}
                />
              </Section>

              <Section>
                <DetailLabel>{lang === 'zh' ? '州' : 'State'}</DetailLabel>
                <FormSelect
                  value={newBusinessAccount.state}
                  onChange={(e) => updateNewBusinessAccount('state', e.target.value)}
                >
                  <option value="">{lang === 'zh' ? '选择州...' : 'Select state...'}</option>
                  {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </FormSelect>
              </Section>
            </FieldRow>

            <Section>
              <DetailLabel>{lang === 'zh' ? '国家' : 'Country'}</DetailLabel>
              <FormSelect
                value={newBusinessAccount.country}
                onChange={(e) => updateNewBusinessAccount('country', e.target.value)}
              >
                <option value="Australia">Australia</option>
              </FormSelect>
            </Section>



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

