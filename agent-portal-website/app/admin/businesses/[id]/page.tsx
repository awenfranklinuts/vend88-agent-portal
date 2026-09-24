"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isPortalUser, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AttributionCard from "@/components/teams/AttributionCard";
import ShopDetailPanel, {
  InfoItem as PanelInfoItem,
  InfoLabel as PanelInfoLabel,
  InfoValue as PanelInfoValue,
} from "@/components/shops/ShopDetailPanel";
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
  border-radius: 2px;
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

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 0.65rem 1.1rem;
  border: none;
  border-radius: 2px;
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
          &:hover { background: #2563eb; }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      default:
        return `
          background: white;
          color: #374151;
          box-shadow: inset 0 0 0 1px #e0e7ef;
          &:hover { background: #f3f4f6; }
        `;
    }
  }}
`;

const AddShopButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 2px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
  }
`;

// Main column holds the business; the fixed-width side column holds owner,
// login and IDs. Collapses to one column once the sidebar squeezes it.
const StoreSwitcher = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const StoreSwitcherButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 2px solid ${p => p.$active ? '#3b82f6' : '#e0e7ef'};
  background: ${p => p.$active ? 'rgba(59, 130, 246, 0.08)' : 'white'};
  color: ${p => p.$active ? '#3b82f6' : '#5c6b7a'};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const Card = styled.section`
  scroll-margin-top: 85px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const CardHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1.25rem;
`;

const CardHeadingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;

  ${CardHeading} {
    margin-bottom: 0;
  }
`;

const SubHeading = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0a3655;
  margin: 1.5rem 0 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eef2f7;

  /* The card edge already separates the first section - a rule there reads as
     a stray line rather than a divider. */
  &:first-child,
  ${CardHeading} + & {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem 1.5rem;
  max-width: 1080px;
`;

const WarningCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 2px;
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #92400e;

  strong {
    font-size: 0.9375rem;
    color: #78350f;
  }
`;

const MutedText = styled.div`
  font-size: 0.9375rem;
  color: #94a3b8;
`;

const ValueLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  overflow-wrap: anywhere;

  &:hover {
    text-decoration: underline;
  }
`;

const BusinessName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
`;

const BusinessLocation = styled.div`
  font-size: 1rem;
  color: #5c6b7a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
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

const StatusBadge = styled.span<{ $status: string; $large?: boolean }>`
  display: inline-block;
  padding: ${p => (p.$large ? '0.4rem 0.85rem' : '0.3rem 0.75rem')};
  border-radius: 2px;
  font-size: ${p => (p.$large ? '0.8125rem' : '0.75rem')};
  font-weight: 700;
  letter-spacing: 0.5px;
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
  border-radius: 2px;
  margin: 2rem 0;
`;

const PermissionList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PermissionCard = styled.div`
  background: #f7faff;
  padding: 1.25rem;
  border-radius: 2px;
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

const ShopMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const ShopCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
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
  border-radius: 2px;
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
  border-radius: 2px;
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

// Sits next to the business name in edit mode, in place of the status badge.
const StatusSelect = styled.select`
  padding: 0.4rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 2px;
  font-size: 0.8125rem;
  font-weight: 600;
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
  border-radius: 2px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${p => p.$primary ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
     
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    &:hover { background: #d1d5db; }
  `}
`;

// A sub-section heading with an action beside it, for sections inside a card.
// Real records, but only wanted now and then - folded away so they don't
// compete with the things this page is usually opened for.
const SectionLayout = styled.div`
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 2rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

// Sticky so it stays with you down a long page; hidden on narrow screens,
// where the sections are already one on top of the other.
const SectionNav = styled.nav`
  position: sticky;
  top: 85px;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const SectionNavItem = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-left: 2px solid ${p => p.$active ? '#1273eb' : 'transparent'};
  background: ${p => p.$active ? 'rgba(18, 115, 235, 0.06)' : 'transparent'};
  color: ${p => p.$active ? '#1273eb' : '#5c6b7a'};
  font-size: 0.875rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  text-align: left;
  cursor: pointer;
  border-radius: 0 4px 4px 0;

  &:hover {
    color: #1273eb;
    background: rgba(18, 115, 235, 0.06);
  }
`;

const SHOP_STATUSES = ['active', 'inactive', 'test', 'suspended'];

const BUSINESS_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'setup', label: 'In Setup' },
  { value: 'test', label: 'Test' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

const InternalToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: #0a3655;
  text-align: left;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  &:hover {
    color: #1273eb;
  }
`;

const SubHeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1.5rem 0 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eef2f7;

  ${SubHeading} {
    margin: 0;
    padding-top: 0;
    border-top: none;
  }
`;

const IdGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem 2rem;
  max-width: 1080px;
`;

const ContactNameRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const OwnerPrimary = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.25rem;
`;

const OwnerLine = styled.div`
  font-size: 0.9375rem;
  color: #5c6b7a;
`;

const CredentialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 560px;
`;

const IdRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0;
`;

const IdText = styled.div`
  font-size: 0.875rem;
  font-family: monospace;
  color: #0a3655;
`;

const CredentialRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const CredentialInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: 2px solid #e0e7ef;
  border-radius: 2px;
  font-size: 0.9375rem;
  font-family: monospace;
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

const CredentialButtons = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const IconButton = styled.button`
  flex-shrink: 0;
  padding: 0.4rem 0.55rem;
  background: #f3f4f6;
  border: 1px solid #e0e7ef;
  border-radius: 2px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const CredentialFieldError = styled.div`
  font-size: 0.8125rem;
  color: #c0392b;
  background: #fdecea;
  border-radius: 2px;
  padding: 0.5rem 0.65rem;
`;

const CredentialEditActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const SmallButton = styled.button<{ $variant?: 'save' | 'cancel' }>`
  padding: 0.45rem 0.9rem;
  border: 1px solid ${p => (p.$variant === 'save' ? 'transparent' : '#e0e7ef')};
  border-radius: 2px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;

  ${p => p.$variant === 'save' ? `
    background: #10b981;
    color: white;
    &:hover:not(:disabled) { background: #059669; }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover:not(:disabled) { background: #e5e7eb; }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CredentialInfo = styled.div`
  min-width: 0;
`;

const CredentialLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

const CredentialValue = styled.div`
  font-size: 0.9375rem;
  font-family: monospace;
  color: #0a3655;
  overflow-wrap: anywhere;
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

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// Fixed-length mask so a hidden value doesn't leak its real length.
const MASKED_VALUE = '••••••••••••';

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
  contact_name?: string;
  notes?: string;
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  registrationId?: string;
  registration_id?: string;
  // Attribution: who brought the business in, and their team
  owner_user_id?: string | null;
  attributed_to_name?: string;
  attributed_to_email?: string;
  team_id?: string | null;
  team_name?: string;
}

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;
  const { token, role, isLoading: authLoading, adminProfile } = useAuth();
  // Database ids and POS credentials are Vend88 internals: partners and BDMs
  // see the business, not its plumbing.
  const isInternal = canSeeAllTeams(adminProfile);

  // Attach a customer while editing a business that has none: either a new
  // record from typed details, or an existing one from Customer Management
  const [customerMode, setCustomerMode] = useState<'new' | 'existing' | 'edit'>('new');
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '' });
  const [existingCustomers, setExistingCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isAttachingCustomer, setIsAttachingCustomer] = useState(false);
  const [attachCustomerError, setAttachCustomerError] = useState('');
  const loadExistingCustomers = async () => {
    try {
      const response = await axios.post('/api/customer/list', { token });
      if (response.data?.status_code === 200) setExistingCustomers(response.data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };
  const handleAttachCustomer = async () => {
    if (!business) return;
    setAttachCustomerError('');
    const payload: Record<string, string | undefined> = { token: token || undefined };
    if (customerMode === 'existing') {
      if (!selectedCustomerId) { setAttachCustomerError(lang === 'zh' ? '请选择客户' : 'Select a customer'); return; }
      payload.customer_id = selectedCustomerId;
    } else {
      const name = customerForm.name.trim(), email = customerForm.email.trim(), phone = customerForm.phone.trim();
      if (!name && !email && !phone) { setAttachCustomerError(lang === 'zh' ? '请至少填写姓名、邮箱或电话' : 'Enter at least a name, email or phone'); return; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setAttachCustomerError(lang === 'zh' ? '邮箱格式无效' : 'Invalid email address'); return; }
      payload.name = name; payload.email = email; payload.phone = phone;
    }
    setIsAttachingCustomer(true);
    try {
      const response = await axios.post(`/api/businesses/${business._id}/customer`, payload);
      if (response.data?.status_code === 200) {
        showToast(customerMode === 'existing' ? (lang === 'zh' ? '已关联客户' : 'Customer linked') : (lang === 'zh' ? '已创建并关联客户' : 'Customer created and linked'), 'success');
        setCustomerForm({ name: '', email: '', phone: '' });
        setSelectedCustomerId('');
        await fetchBusinessDetails();
      } else {
        setAttachCustomerError(response.data?.message || (lang === 'zh' ? '操作失败' : 'Failed to attach customer'));
      }
    } catch (err: any) {
      setAttachCustomerError(err?.response?.data?.message || (lang === 'zh' ? '操作失败' : 'Failed to attach customer'));
    } finally {
      setIsAttachingCustomer(false);
    }
  };

  // Create an owner login for a business that was created without one
  const [showCreateOwnerModal, setShowCreateOwnerModal] = useState(false);
  const [isCreatingOwner, setIsCreatingOwner] = useState(false);
  const [newOwner, setNewOwner] = useState({ emailPrefix: '', password: '', first_name: '', last_name: '' });
  const [createOwnerError, setCreateOwnerError] = useState('');
  const openCreateOwnerModal = () => {
    setNewOwner({ emailPrefix: '', password: '', first_name: '', last_name: '' });
    setCreateOwnerError('');
    setShowCreateOwnerModal(true);
  };
  const handleCreateOwner = async () => {
    if (!business) return;
    setIsCreatingOwner(true);
    setCreateOwnerError('');
    try {
      const response = await axios.post(`/api/businesses/${business._id}/create-owner`, {
        token,
        email: newOwner.emailPrefix.trim() ? `${newOwner.emailPrefix.trim().toLowerCase()}@vend88.com` : undefined,
        password: newOwner.password.trim() || undefined,
        first_name: newOwner.first_name.trim() || undefined,
        last_name: newOwner.last_name.trim() || undefined,
      });
      if (response.data?.status_code === 201) {
        const c = response.data.credentials;
        showToast(
          c ? (lang === 'zh' ? `已创建所有者登录：${c.email}` : `Owner login created: ${c.email}`) : (lang === 'zh' ? '已创建所有者登录' : 'Owner login created'),
          'success'
        );
        setShowCreateOwnerModal(false);
        await fetchBusinessDetails();
      } else {
        setCreateOwnerError(response.data?.message || (lang === 'zh' ? '创建失败' : 'Failed to create owner login'));
      }
    } catch (err: any) {
      setCreateOwnerError(err?.response?.data?.message || (lang === 'zh' ? '创建失败' : 'Failed to create owner login'));
    } finally {
      setIsCreatingOwner(false);
    }
  };

  // Permanent delete - administrators only, confirmed first
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // The business name must be retyped exactly before delete is enabled
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const openDeleteModal = () => { setDeleteConfirmText(''); setShowDeleteModal(true); };
  const handleDeleteBusiness = async () => {
    if (!business || !deleteConfirmed) return;
    setIsDeleting(true);
    try {
      const response = await axios.post('/api/businesses/delete', { token, id: business._id });
      if (response.data?.status_code === 200) {
        showToast(lang === 'zh' ? '店铺已删除' : 'Store deleted', 'success');
        router.push('/admin/businesses');
      } else {
        showToast(response.data?.message || (lang === 'zh' ? '删除失败' : 'Failed to delete store'), 'error');
        setIsDeleting(false);
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || (lang === 'zh' ? '删除失败' : 'Failed to delete store'), 'error');
      setIsDeleting(false);
    }
  };
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const hasOwner = !!business?.owner_id;
  const [originalBusiness, setOriginalBusiness] = useState<Business | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [ownerCredentials, setOwnerCredentials] = useState<{ email: string; password: string } | null>(null);
  const [ownerAccountMissing, setOwnerAccountMissing] = useState(false);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [isEditMode, setIsEditMode] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [newShop, setNewShop] = useState({ name: '', location: '' });
  const [addShopError, setAddShopError] = useState('');
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [credentialsDraft, setCredentialsDraft] = useState({ email: '', password: '' });
  const [credentialsError, setCredentialsError] = useState('');
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (!authLoading && token && !isPortalUser(role)) {
      router.push("/login");
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

          // The customer (human contact) is a separate record from the VendPOS
          // login; a business created without contact details has none.
          const customerId = foundBusiness.customer_id || null;
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

          // Fetch the owner's login credentials for display (separate endpoint -
          // every other business/customer response strips password on purpose).
          // A business created without an owner has nothing to fetch, and must
          // not be reported as a missing account.
          if (foundBusiness.owner_id) try {
            const credentialsResponse = await axios.post(
              `/api/businesses/${foundBusiness._id}/owner-credentials`,
              { token },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (credentialsResponse.data.status_code === 200) {
              setOwnerCredentials(credentialsResponse.data.data);
            }
          } catch (err: any) {
            // 404 = the business's owner_id has no matching admin account. That's
            // a data problem shown on the page, not an error worth logging.
            if (err?.response?.status === 404) {
              setOwnerAccountMissing(true);
            } else {
              console.error('Failed to fetch owner credentials:', err);
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
          setError(lang === "zh" ? "未找到店铺" : "Store not found");
        }
      }
    } catch (err) {
      console.error("Failed to fetch business details:", err);
      setError(lang === "zh" ? "加载失败" : "Failed to load store details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBusiness = () => {
    setAttachCustomerError('');
    loadExistingCustomers();
    // With a customer linked, the fields start as that customer's own details
    // and edit them in place; 'existing' swaps to picking a different one.
    setCustomerMode(owner ? 'edit' : 'new');
    setCustomerForm({
      name: owner?.name || '',
      email: owner?.email || '',
      phone: owner?.phone || '',
    });
    // The field shows the store's display name, so that is what the input opens
    // on - otherwise editing would start from a different name than was read.
    setBusiness((prev) => (prev && storeName ? { ...prev, name: storeName } : prev));
    setAddressDraft(storeLocation);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setBusiness(originalBusiness);
    setIsEditMode(false);
  };

  const handleSaveBusiness = async () => {
    if (!business) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const changes: { status?: string; notes?: string; name?: string; abn?: string } = {};
      if (business.status !== originalBusiness?.status) changes.status = business.status;
      const notes = (business.notes || '').trim();
      if (notes !== (originalBusiness?.notes || '')) changes.notes = notes;
      const name = (business.name || '').trim();
      if (name && name !== storeName) changes.name = name;
      const abn = (business.abn || '').trim();
      if (abn !== (originalBusiness?.abn || '').trim()) changes.abn = abn;

      if (Object.keys(changes).length) {
        await axios.post(
          '/api/businesses/update',
          { token, id: business._id, ...changes },
          { headers }
        );
      }

      // A business and its store are one record, so a rename or a status change
      // is written to both - the store's own store_name and status are what the
      // POS shows. 'setup' has no shop equivalent, so it stays on
      // the business alone rather than being mapped onto something they aren't.
      const shopUpdate: { store_name?: string; status?: string; location?: string } = {};
      if (changes.name) shopUpdate.store_name = changes.name;
      if (changes.status && SHOP_STATUSES.includes(changes.status)) shopUpdate.status = changes.status;
      if (addressDraft.trim() !== storeLocation) shopUpdate.location = addressDraft.trim();
      if (Object.keys(shopUpdate).length && shownShop?._id) {
        await axios.post(
          '/api/shops/update',
          { token, id: shownShop._id, ...shopUpdate },
          { headers }
        );
      }

      // The linked customer's own details, edited in place. Linking a different
      // customer is its own action and has already been applied by this point.
      if (owner?._id && customerMode === 'edit') {
        const contact = {
          name: customerForm.name.trim(),
          email: customerForm.email.trim(),
          phone: customerForm.phone.trim(),
        };
        const changed =
          contact.name !== (owner.name || '') ||
          contact.email !== (owner.email || '') ||
          contact.phone !== (owner.phone || '');
        if (changed) {
          if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
            showToast(lang === 'zh' ? '邮箱格式无效' : 'Invalid email address', 'error');
            return;
          }
          await axios.post('/api/customer/update', { token, id: owner._id, ...contact }, { headers });
          await fetchBusinessDetails();
        }
      }

      const saved = { ...business, notes, name: name || business.name, abn };
      setBusiness(saved);
      setOriginalBusiness(saved);
      setIsEditMode(false);
      if (Object.keys(shopUpdate).length || changes.name || changes.status) await fetchBusinessDetails();
      showToast(
        lang === 'zh' ? '店铺信息已更新' : 'Store information updated',
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

  // Prefilled from the business, because the store is the business: this is the
  // same name and address that creating a business now gives its store, so a
  // repaired older business ends up looking like a newly created one.
  const resetAddShopForm = () => {
    const addressLine = [
      business?.address,
      [business?.suburb, business?.state, business?.postcode].filter(Boolean).join(' '),
    ].filter(Boolean).join(', ');
    setNewShop({ name: business?.name || '', location: addressLine });
    setAddShopError('');
  };

  // A business and its store are the same thing, so this page is one record:
  // the store's own details and its logins, devices and permissions first,
  // then what belongs to the business behind it - its customer, its owner
  // login, its attribution. No business/store switch, because there is nothing
  // to switch between.
  // Only ever set on an older business that has more than one store.
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [showInternal, setShowInternal] = useState(false);
  const [addressDraft, setAddressDraft] = useState('');

  // In-page section nav. The ids are set on the cards below and on the store
  // panel's card and tab strip, which it takes as props.
  const sectionIds = ['store', 'customer', 'store-logins', 'attribution', 'internal', 'store-records'];
  const [activeSection, setActiveSection] = useState('store');

  useEffect(() => {
    if (isLoading || !business) return;
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        // The topmost section that is actually on screen wins, so the highlight
        // follows reading position rather than whichever fired last.
        const visible = sectionIds.filter((id) => (seen.get(id) || 0) > 0);
        if (visible.length) setActiveSection(visible[0]);
      },
      { rootMargin: '-85px 0px -55% 0px', threshold: [0, 0.01] }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isLoading, business, shops, showInternal]);

  const goToSection = (id: string) => {
    // The Internal section is collapsed by default - opening it from the nav
    // saves a click, and gives the scroll something to land on.
    if (id === 'internal') setShowInternal(true);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    setActiveSection(id);
  };
  const primaryShop = shops[0] || null;

  const handleCreateShop = async () => {
    if (!business) return;
    const { name, location } = newShop;

    if (!name.trim()) {
      setAddShopError(lang === 'zh' ? '请输入店铺名称' : 'Please enter a shop name');
      return;
    }

    setAddShopError('');
    setIsAddingShop(true);

    try {
      const response = await axios.post(
        '/api/shops/create',
        { token, business_id: business._id, name: name.trim(), location: location.trim() || undefined },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 201 && response.data.shop_id) {
        setShowAddShopModal(false);
        resetAddShopForm();
        showToast(lang === 'zh' ? '店铺创建成功' : 'Shop created successfully', 'success');
        await fetchBusinessDetails();
      } else {
        throw new Error(response.data.message || 'Create failed');
      }
    } catch (err: any) {
      setAddShopError(
        err?.response?.data?.message ||
        (lang === 'zh' ? '创建店铺失败，请重试' : 'Failed to create shop, please try again')
      );
    } finally {
      setIsAddingShop(false);
    }
  };

  const handleCopyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(
        lang === 'zh' ? `${label}已复制` : `${label} copied to clipboard`,
        'success'
      );
    } catch (err) {
      showToast(
        lang === 'zh' ? '复制失败' : 'Failed to copy',
        'error'
      );
    }
  };

  const handleStartEditCredentials = () => {
    setCredentialsDraft({
      email: ownerCredentials?.email || '',
      password: ownerCredentials?.password || '',
    });
    setCredentialsError('');
    setIsEditingCredentials(true);
  };

  const handleCancelEditCredentials = () => {
    setIsEditingCredentials(false);
    setCredentialsError('');
    setShowPassword(false);
  };

  const handleSaveCredentials = async () => {
    const email = credentialsDraft.email.trim();
    const password = credentialsDraft.password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCredentialsError(lang === 'zh' ? '请输入有效的邮箱地址' : 'Enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setCredentialsError(
        lang === 'zh' ? '密码至少需要 6 个字符' : 'Password must be at least 6 characters'
      );
      return;
    }

    setIsSavingCredentials(true);
    setCredentialsError('');

    try {
      const response = await axios.put(
        `/api/businesses/${businessId}/owner-credentials`,
        { token, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        setOwnerCredentials(response.data.data);
        setIsEditingCredentials(false);
        setShowPassword(false);
        showToast(
          lang === 'zh' ? '登录信息已更新' : 'Login credentials updated',
          'success'
        );
      } else {
        setCredentialsError(response.data.message || (lang === 'zh' ? '更新失败' : 'Update failed'));
      }
    } catch (err: any) {
      setCredentialsError(
        err.response?.data?.message || (lang === 'zh' ? '更新失败' : 'Update failed')
      );
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const handleEmailOwner = () => {
    if (owner?.email) {
      window.location.href = `mailto:${owner.email}`;
    }
  };

  const handleViewOwner = () => {
    if (owner?._id) {
      router.push(`/admin/customers/${owner._id}`);
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
    // 'setup' is what provisioning stores; 'In Setup' is how it reads.
    const normalized = status.toLowerCase().replace(/[_\s]/g, '');
    if (normalized === 'setup' || normalized === 'insetup') return 'In Setup';
    return status
      .replace(/_/g, ' ')
      .toUpperCase();
  };

  // Shops are created with a placeholder [0, 0] coordinate - that isn't an address.
  const formatShopLocation = (location: any) => {
    if (typeof location !== 'string' || !location.trim()) return null;
    if (/^\[\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\]$/.test(location.trim())) return null;
    return location;
  };

  const formatAddress = (b: Business) => {
    const locality = [b.suburb, [b.state, b.postcode].filter(Boolean).join(' ')].filter(Boolean).join(' ');
    return [b.address, locality, b.country].filter(Boolean).join(', ');
  };

  // The store's own address is what the POS shows, so it is the one the header
  // carries; the business record's address is the fallback for a business that
  // has no store yet.
  const shownShop = shops.find((sh) => sh._id === selectedShopId) || primaryShop;
  const headerAddress =
    (typeof shownShop?.location === 'string' && shownShop.location.trim())
      ? shownShop.location.trim()
      : (business ? formatAddress(business) : '');

  // The store's display name is what the POS and the portal both show, so it is
  // the name this page carries. The `name` beside it on the shop is the
  // sanitized shop_key slug ("abowlofnoodleshaymarket") and is never shown -
  // fall back to the business's own name when a store has no store_name set.
  const storeName =
    String(shownShop?.store_name || '').trim() || String(business?.name || '').trim();

  const storeLocation =
    typeof shownShop?.location === 'string' ? shownShop.location.trim() : '';

  // The page shows the store's name throughout, so that is what a confirmation
  // can reasonably ask for - the business name behind it may appear nowhere.
  const deleteConfirmed = !!business && !!storeName && deleteConfirmText.trim() === storeName;




  // 12345678901 -> 12 345 678 901
  const formatAbn = (abn?: string) => {
    const digits = (abn || '').replace(/\s+/g, '');
    return /^\d{11}$/.test(digits) ? digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4') : abn;
  };

  const shortenId = (id: string) => (id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id);

  if (authLoading) {
    return (
      <Container>
        <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
      </Container>
    );
  }

  if (!token || !isPortalUser(role)) {
    return null;
  }

  const contactEmail = business?.contact_email || business?.contactEmail;
  const contactPhone = business?.contact_phone || business?.contactPhone;

  // The customer linked to this business is who the contact details belong to.
  // The business's own contact_* fields are what a registration collected
  // before any customer record existed, so they stand in when there is no link.
  const customerName = owner?.name || business?.contact_name || '';
  const customerEmail = owner?.email || contactEmail || '';
  const customerPhone = owner?.phone || contactPhone || '';

  // A business and its store are one record, so these are shown inside the
  // store's own card rather than in a second card beside it. They are built
  // here so the same fields also stand alone for an older business that has no
  // store to fold them into.
  const customerId = business?.customer_id || null;
  const loginAccountId = business?.owner_id || null;

  const businessLeadingFields = business ? (
  <>
    <PanelInfoItem>
      <PanelInfoLabel>{lang === "zh" ? "名称" : "Name"}</PanelInfoLabel>
      {isEditMode ? (
        <Input
          value={business.name || ''}
          onChange={(e) => handleBusinessChange('name', e.target.value)}
        />
      ) : (
        <PanelInfoValue>{storeName || 'N/A'}</PanelInfoValue>
      )}
    </PanelInfoItem>
    <PanelInfoItem>
      <PanelInfoLabel>ABN</PanelInfoLabel>
      {isEditMode ? (
        <Input
          value={business.abn || ''}
          onChange={(e) => handleBusinessChange('abn', e.target.value)}
        />
      ) : (
        <PanelInfoValue>{formatAbn(business.abn) || 'N/A'}</PanelInfoValue>
      )}
    </PanelInfoItem>
    {primaryShop && (
      <PanelInfoItem style={{ gridColumn: '1 / -1' }}>
        <PanelInfoLabel>{lang === "zh" ? "地址" : "Address"}</PanelInfoLabel>
        {isEditMode ? (
          <Input
            value={addressDraft}
            onChange={(e) => setAddressDraft(e.target.value)}
            placeholder={lang === "zh" ? "例如：191 Parramatta Rd, Auburn, NSW" : "e.g. 191 Parramatta Rd, Auburn, NSW"}
          />
        ) : (
          <PanelInfoValue>
            {storeLocation || (
              <span style={{ color: '#9ca3af' }}>{lang === "zh" ? "未设置地址" : "No address set"}</span>
            )}
          </PanelInfoValue>
        )}
      </PanelInfoItem>
    )}
  </>
  ) : null;

  const businessTrailingContent = business ? (
  <>
    <Card id="customer">
      <CardHeading>{lang === "zh" ? "店主" : "Store Owner"}</CardHeading>
      {isEditMode && isInternal ? (
        // Editable: change this customer's own details, or point the business
        // at a different customer record.
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <SmallButton onClick={() => setCustomerMode(owner ? 'edit' : 'new')} style={customerMode !== 'existing' ? { background: '#1a237e', color: 'white', borderColor: '#1a237e' } : undefined}>
              {owner
                ? (lang === "zh" ? "编辑客户资料" : "Edit details")
                : (lang === "zh" ? "新建客户" : "New customer")}
            </SmallButton>
            <SmallButton onClick={() => setCustomerMode('existing')} style={customerMode === 'existing' ? { background: '#1a237e', color: 'white', borderColor: '#1a237e' } : undefined}>
              {owner
                ? (lang === "zh" ? "关联其他客户" : "Link a different customer")
                : (lang === "zh" ? "关联已有客户" : "Link existing")}
            </SmallButton>
          </div>
          {customerMode !== 'existing' ? (
            <FieldGrid>
              <Input value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} placeholder={lang === "zh" ? "姓名" : "Name"} />
              <Input value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} placeholder={lang === "zh" ? "邮箱" : "Email"} autoComplete="off" />
              <Input value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} placeholder={lang === "zh" ? "电话" : "Phone"} />
            </FieldGrid>
          ) : (
            <StatusSelect value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} style={{ width: '100%' }}>
              <option value="">{existingCustomers.length ? (lang === "zh" ? "选择客户..." : "Select a customer...") : (lang === "zh" ? "暂无客户" : "No customers yet")}</option>
              {existingCustomers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name || c.email || c._id}{c.email && c.name ? ` — ${c.email}` : ''}
                </option>
              ))}
            </StatusSelect>
          )}
          {attachCustomerError && (
            <p style={{ color: '#dc2626', fontSize: '0.8125rem', margin: '0.5rem 0 0' }}>{attachCustomerError}</p>
          )}
          {customerMode === 'edit' ? (
            <MutedText style={{ marginTop: '0.75rem' }}>
              {lang === "zh"
                ? "更改将随页面顶部的「保存更改」一并保存。"
                : "Changes are saved with Save Changes at the top of the page."}
            </MutedText>
          ) : (
            <SmallButton $variant="save" onClick={handleAttachCustomer} disabled={isAttachingCustomer} style={{ marginTop: '0.75rem' }}>
              {isAttachingCustomer
                ? (lang === "zh" ? "处理中..." : "Saving...")
                : customerMode === 'existing'
                  ? (lang === "zh" ? "关联客户" : "Link customer")
                  : (lang === "zh" ? "创建并关联" : "Create & link")}
            </SmallButton>
          )}
        </>
      ) : (
        <>
          <FieldGrid>
            <InfoItem>
              <InfoLabel>{lang === "zh" ? "姓名" : "Name"}</InfoLabel>
              <ContactNameRow>
                <InfoValue>{customerName || 'N/A'}</InfoValue>
                {owner && (
                  <SmallButton onClick={handleViewOwner}>
                    <UserIcon /> {lang === "zh" ? "查看客户资料" : "View Customer Record"}
                  </SmallButton>
                )}
              </ContactNameRow>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{lang === "zh" ? "邮箱" : "Email"}</InfoLabel>
              <InfoValue>
                {customerEmail ? <ValueLink href={`mailto:${customerEmail}`}>{customerEmail}</ValueLink> : 'N/A'}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>{lang === "zh" ? "电话" : "Phone"}</InfoLabel>
              <InfoValue>
                {customerPhone ? <ValueLink href={`tel:${customerPhone}`}>{customerPhone}</ValueLink> : 'N/A'}
              </InfoValue>
            </InfoItem>
          </FieldGrid>
          {!owner && isInternal && (
            <MutedText style={{ marginTop: '0.75rem' }}>
              {lang === "zh" ? "点击「编辑」以添加或关联客户记录。" : "Click Edit to add or link a customer record."}
            </MutedText>
          )}
        </>
      )}

    </Card>

  </>
  ) : null;

  const businessAfterCredentials = business ? (
  <>
    <AttributionCard
      id="attribution"
      entityType="business"
      entityId={business._id}
      entityLabel={business.name || business._id}
      teamName={business.team_name}
      attributedToName={business.attributed_to_name}
      attributedToEmail={business.attributed_to_email}
      ownerUserId={business.owner_user_id}
      onChanged={fetchBusinessDetails}
    />

    {isInternal && (
      <Card id="internal">
        <InternalToggle onClick={() => setShowInternal((v) => !v)} aria-expanded={showInternal}>
          <span>{showInternal ? "▾" : "▸"}</span>
          {lang === "zh" ? "内部信息" : "Internal"}
        </InternalToggle>
        {showInternal && (
          <>
            {isInternal && ownerAccountMissing && (
              <WarningCard role="status">
                <strong>{lang === "zh" ? "未找到所有者账户" : "Owner account not found"}</strong>
                {lang === "zh"
                  ? "此店铺关联的所有者账户在 admin 集合中不存在，因此无法显示 VendPOS 登录信息，也无法添加店铺登录账户。"
                  : "The owner account linked to this store doesn't exist in the admin collection, so VendPOS login details can't be shown and store logins can't be added."}
              </WarningCard>
            )}

            {!hasOwner && (
              <>
                <SubHeading>{lang === "zh" ? "VendPOS 登录" : "VendPOS Login"}</SubHeading>
                <OwnerPrimary>N/A</OwnerPrimary>
                <OwnerLine>{lang === "zh" ? "此店铺尚无登录账户。" : "This store has no login account yet."}</OwnerLine>
                {isInternal && (
                  <SmallButton onClick={openCreateOwnerModal} style={{ marginTop: '0.75rem' }}>
                    <UserIcon /> {lang === "zh" ? "创建登录账户" : "Create Login"}
                  </SmallButton>
                )}
              </>
            )}

            {isInternal && ownerCredentials && (
              <>
                <SubHeadingRow>
                  <SubHeading>{lang === "zh" ? "VendPOS 登录" : "VendPOS Login"}</SubHeading>
                  {!isEditingCredentials && (
                    <SmallButton onClick={handleStartEditCredentials}>
                      <EditIcon /> {lang === "zh" ? "编辑" : "Edit"}
                    </SmallButton>
                  )}
                </SubHeadingRow>

                <CredentialsList>
                  <CredentialRow>
                    <CredentialInfo style={{ flex: 1 }}>
                      <CredentialLabel>{lang === "zh" ? "邮箱" : "Email"}</CredentialLabel>
                      {isEditingCredentials ? (
                        <CredentialInput
                          type="email"
                          value={credentialsDraft.email}
                          disabled={isSavingCredentials}
                          autoComplete="off"
                          onChange={(e) =>
                            setCredentialsDraft({ ...credentialsDraft, email: e.target.value })
                          }
                        />
                      ) : (
                        <CredentialValue>{ownerCredentials.email || 'N/A'}</CredentialValue>
                      )}
                    </CredentialInfo>
                    {!isEditingCredentials && ownerCredentials.email && (
                      <CredentialButtons>
                        <IconButton
                          onClick={() => handleCopyToClipboard(ownerCredentials.email, lang === "zh" ? "邮箱" : "Email")}
                          title={lang === "zh" ? "复制邮箱" : "Copy email"}
                          aria-label={lang === "zh" ? "复制邮箱" : "Copy email"}
                        >
                          <CopyIcon />
                        </IconButton>
                      </CredentialButtons>
                    )}
                  </CredentialRow>

                  <CredentialRow>
                    <CredentialInfo style={{ flex: 1 }}>
                      <CredentialLabel>{lang === "zh" ? "密码" : "Password"}</CredentialLabel>
                      {isEditingCredentials ? (
                        <CredentialInput
                          type={showPassword ? "text" : "password"}
                          value={credentialsDraft.password}
                          disabled={isSavingCredentials}
                          autoComplete="new-password"
                          onChange={(e) =>
                            setCredentialsDraft({ ...credentialsDraft, password: e.target.value })
                          }
                        />
                      ) : (
                        <CredentialValue>
                          {!ownerCredentials.password
                            ? 'N/A'
                            : showPassword
                              ? ownerCredentials.password
                              : MASKED_VALUE}
                        </CredentialValue>
                      )}
                    </CredentialInfo>
                    <CredentialButtons>
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        title={
                          showPassword
                            ? (lang === "zh" ? "隐藏密码" : "Hide password")
                            : (lang === "zh" ? "显示密码" : "Show password")
                        }
                        aria-label={
                          showPassword
                            ? (lang === "zh" ? "隐藏密码" : "Hide password")
                            : (lang === "zh" ? "显示密码" : "Show password")
                        }
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </IconButton>
                      {!isEditingCredentials && (
                        <IconButton
                          onClick={() => handleCopyToClipboard(ownerCredentials.password, lang === "zh" ? "密码" : "Password")}
                          title={lang === "zh" ? "复制密码" : "Copy password"}
                          aria-label={lang === "zh" ? "复制密码" : "Copy password"}
                        >
                          <CopyIcon />
                        </IconButton>
                      )}
                    </CredentialButtons>
                  </CredentialRow>

                  {credentialsError && (
                    <CredentialFieldError>{credentialsError}</CredentialFieldError>
                  )}

                  {isEditingCredentials && (
                    <CredentialEditActions>
                      <SmallButton onClick={handleCancelEditCredentials} disabled={isSavingCredentials}>
                        {lang === "zh" ? "取消" : "Cancel"}
                      </SmallButton>
                      <SmallButton $variant="save" onClick={handleSaveCredentials} disabled={isSavingCredentials}>
                        <SaveIcon />
                        {isSavingCredentials
                          ? (lang === "zh" ? "保存中..." : "Saving...")
                          : (lang === "zh" ? "保存" : "Save")}
                      </SmallButton>
                    </CredentialEditActions>
                  )}
                </CredentialsList>
              </>
            )}
            <MutedText style={{ marginTop: '1.25rem' }}>
              {lang === "zh"
                ? "收银机上使用的店铺登录账户见上方「店铺登录」部分。"
                : "Store logins — what staff type into the till — are in the Store Logins section above."}
            </MutedText>


            {isInternal && (
              <>
                <SubHeading>{lang === "zh" ? "系统 ID" : "System IDs"}</SubHeading>
                <IdGrid>
                  <IdRow>
                    <CredentialInfo>
                      <CredentialLabel>{lang === "zh" ? "店铺记录 ID" : "Store Record ID"}</CredentialLabel>
                      <IdText title={business._id}>{shortenId(business._id)}</IdText>
                    </CredentialInfo>
                    <IconButton
                      onClick={() => handleCopyToClipboard(business._id, lang === "zh" ? "店铺记录 ID" : "Store Record ID")}
                      title={lang === "zh" ? "复制店铺记录 ID" : "Copy store record ID"}
                      aria-label={lang === "zh" ? "复制店铺记录 ID" : "Copy store record ID"}
                    >
                      <CopyIcon />
                    </IconButton>
                  </IdRow>
                  {shownShop?._id && (
                    <IdRow>
                      <CredentialInfo>
                        <CredentialLabel>{lang === "zh" ? "店铺 ID" : "Store ID"}</CredentialLabel>
                        <IdText title={shownShop._id}>{shortenId(shownShop._id)}</IdText>
                      </CredentialInfo>
                      <IconButton
                        onClick={() => handleCopyToClipboard(shownShop._id, lang === "zh" ? "店铺 ID" : "Store ID")}
                        title={lang === "zh" ? "复制店铺 ID" : "Copy store ID"}
                        aria-label={lang === "zh" ? "复制店铺 ID" : "Copy store ID"}
                      >
                        <CopyIcon />
                      </IconButton>
                    </IdRow>
                  )}
                  {shownShop?.shop_key && (
                    <IdRow>
                      <CredentialInfo>
                        <CredentialLabel>{lang === "zh" ? "店铺密钥" : "Shop Key"}</CredentialLabel>
                        <IdText title={shownShop.shop_key}>{shownShop.shop_key}</IdText>
                      </CredentialInfo>
                      <IconButton
                        onClick={() => handleCopyToClipboard(shownShop.shop_key, lang === "zh" ? "店铺密钥" : "Shop key")}
                        title={lang === "zh" ? "复制店铺密钥" : "Copy shop key"}
                        aria-label={lang === "zh" ? "复制店铺密钥" : "Copy shop key"}
                      >
                        <CopyIcon />
                      </IconButton>
                    </IdRow>
                  )}
                  {customerId && (
                    <IdRow>
                      <CredentialInfo>
                        <CredentialLabel>{lang === "zh" ? "客户 ID" : "Customer ID"}</CredentialLabel>
                        <IdText title={customerId}>{shortenId(customerId)}</IdText>
                      </CredentialInfo>
                      <IconButton
                        onClick={() => handleCopyToClipboard(customerId, lang === "zh" ? "客户 ID" : "Customer ID")}
                        title={lang === "zh" ? "复制客户 ID" : "Copy customer ID"}
                        aria-label={lang === "zh" ? "复制客户 ID" : "Copy customer ID"}
                      >
                        <CopyIcon />
                      </IconButton>
                    </IdRow>
                  )}
                  {loginAccountId && (
                    <IdRow>
                      <CredentialInfo>
                        <CredentialLabel>{lang === "zh" ? "登录账户 ID" : "Login Account ID"}</CredentialLabel>
                        <IdText title={loginAccountId}>{shortenId(loginAccountId)}</IdText>
                      </CredentialInfo>
                      <IconButton
                        onClick={() => handleCopyToClipboard(loginAccountId, lang === "zh" ? "登录账户 ID" : "Login account ID")}
                        title={lang === "zh" ? "复制登录账户 ID" : "Copy login account ID"}
                        aria-label={lang === "zh" ? "复制登录账户 ID" : "Copy login account ID"}
                      >
                        <CopyIcon />
                      </IconButton>
                    </IdRow>
                  )}
                </IdGrid>
                {(business.registrationId || business.registration_id) && (
                  <SmallButton onClick={handleViewRegistration} style={{ marginTop: '0.75rem' }}>
                    {lang === "zh" ? "查看注册表单" : "View Registration Form"}
                  </SmallButton>
                )}
              </>
            )}
          </>
        )}
      </Card>
    )}
  </>
  ) : null;

  return (
    <MainLayout
      currentPage={lang === "zh" ? "店铺详情" : "Store Details"}
      onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push('/admin/businesses')}>
            <span>←</span>
            {lang === "zh" ? "返回店铺列表" : "Back to Stores"}
          </BackButton>

          {isLoading ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : business ? (
            <>
              {/* Header: name, status, address and page-level actions */}
              <PageHeader>
                <div style={{ minWidth: 0 }}>
                  <TitleRow>
                    <BusinessName>{storeName || 'N/A'}</BusinessName>
                    {isEditMode ? (
                      <StatusSelect
                        value={business.status || ''}
                        onChange={(e) => handleBusinessChange('status', e.target.value)}
                        aria-label={lang === "zh" ? "状态" : "Status"}
                      >
                        {/* A business with no status, or one outside the known
                            set, gets an option of its own. Without it the
                            select matches nothing and the browser displays the
                            first option instead - so it would read "Active"
                            while the record was untouched, and saving would
                            look like it silently reverted. */}
                        {!BUSINESS_STATUS_OPTIONS.some((o) => o.value === (business.status || '')) && (
                          <option value={business.status || ''}>
                            {business.status
                              ? formatStatus(business.status)
                              : (lang === "zh" ? "未设置" : "Not set")}
                          </option>
                        )}
                        {BUSINESS_STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </StatusSelect>
                    ) : (
                      <StatusBadge $status={business.status || 'N/A'} $large>
                        {/* Never invent 'inactive' for a record that simply has
                            no status - that is what hid this in the first place. */}
                        {formatStatus(business.status)}
                      </StatusBadge>
                    )}
                  </TitleRow>
                  {headerAddress && (
                    <BusinessLocation>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {headerAddress}
                    </BusinessLocation>
                  )}
                </div>

                <HeaderActions>
                  {isEditMode ? (
                    <>
                      <QuickActionButton onClick={handleCancelEdit}>
                        {lang === "zh" ? "取消" : "Cancel"}
                      </QuickActionButton>
                      <QuickActionButton $variant="success" onClick={handleSaveBusiness}>
                        <SaveIcon />
                        {lang === "zh" ? "保存更改" : "Save Changes"}
                      </QuickActionButton>
                    </>
                  ) : (
                    <>
                      <QuickActionButton $variant="primary" onClick={handleEditBusiness}>
                        <EditIcon />
                        {lang === "zh" ? "编辑" : "Edit"}
                      </QuickActionButton>
                      {isInternal && (
                        <QuickActionButton $variant="danger" onClick={openDeleteModal}>
                          {lang === "zh" ? "删除" : "Delete"}
                        </QuickActionButton>
                      )}
                    </>
                  )}
                  {owner?.email && (
                    <QuickActionButton onClick={handleEmailOwner}>
                      <MailIcon />
                      {lang === "zh" ? "联系客户" : "Contact Customer"}
                    </QuickActionButton>
                  )}
                </HeaderActions>
              </PageHeader>

              <SectionLayout>
                <SectionNav aria-label={lang === "zh" ? "页面分区" : "Page sections"}>
                  {sectionIds.map((id) => {
                    // 'store-records' is the store's own tab strip - logins,
                    // devices and the rest - not another card.
                    const labels: Record<string, { en: string; zh: string }> = {
                      'store': { en: 'Store', zh: '店铺' },
                      'customer': { en: 'Store Owner', zh: '店主' },
                      'store-logins': { en: 'Store Logins', zh: '店铺登录' },
                      'attribution': { en: 'Attribution', zh: '归属' },
                      'internal': { en: 'Internal', zh: '内部信息' },
                      'store-records': { en: 'Devices & Activity', zh: '设备与活动' },
                    };
                    if ((id === 'internal' || id === 'store-logins') && !isInternal) return null;
                    if (id === 'store-logins' && !primaryShop) return null;
                    if ((id === 'store' || id === 'store-records') && !primaryShop) return null;
                    return (
                      <SectionNavItem
                        key={id}
                        $active={activeSection === id}
                        onClick={() => goToSection(id)}
                      >
                        {labels[id][lang === "zh" ? "zh" : "en"]}
                      </SectionNavItem>
                    );
                  })}
                </SectionNav>

                <div>
              {primaryShop ? (
                  <>
                    {/* Older businesses can have more than one store; the rest
                        of them are reachable from here, one at a time. */}
                    {shops.length > 1 && (
                      <StoreSwitcher>
                        {shops.map((shop) => (
                          <StoreSwitcherButton
                            key={shop._id}
                            $active={shop._id === selectedShopId}
                            onClick={() => setSelectedShopId(shop._id)}
                          >
                            {shop.store_name || shop.name || shop._id}
                          </StoreSwitcherButton>
                        ))}
                      </StoreSwitcher>
                    )}
                    <ShopDetailPanel
                      key={selectedShopId || primaryShop._id}
                      businessId={businessId}
                      shopId={selectedShopId || primaryShop._id}
                      embedded
                      onShopChanged={fetchBusinessDetails}
                      leadingFields={businessLeadingFields}
                      trailingContent={businessTrailingContent}
                      afterCredentials={businessAfterCredentials}
                      cardId="store"
                      tabsId="store-records"
                      credentialsId="store-logins"
                    />
                  </>
              ) : (
                <>
                  <Card id="store">
                    <CardHeading>{lang === "zh" ? "详情" : "Details"}</CardHeading>
                    <FieldGrid>{businessLeadingFields}</FieldGrid>
                    <SubHeading>{lang === "zh" ? "店铺" : "Store"}</SubHeading>
                    <MutedText>
                      {lang === "zh"
                        ? "此记录创建于店铺自动创建之前，尚无店铺。"
                        : "This record predates stores being created automatically and has none yet."}
                    </MutedText>
                    <AddShopButton
                      onClick={() => { resetAddShopForm(); setShowAddShopModal(true); }}
                      disabled={!hasOwner}
                      title={!hasOwner ? (lang === "zh" ? "请先创建所有者登录" : "Create an owner login first") : undefined}
                      style={{ marginTop: '1rem', ...(!hasOwner ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                    >
                      + {lang === "zh" ? "创建店铺" : "Create Store"}
                    </AddShopButton>
                  </Card>
                  {businessTrailingContent}
                  {businessAfterCredentials}
                </>
              )}
                </div>
              </SectionLayout>

            </>
          ) : (
            <ErrorText>{lang === "zh" ? "未找到店铺" : "Store not found"}</ErrorText>
          )}
        </MainContent>
      </Container>

      {/* Status Change Confirmation Modal */}
      <Modal $show={showStatusModal} onClick={() => setShowStatusModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "确认状态更改" : "Confirm Status Change"}</ModalTitle>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a' }}>
            {lang === "zh"
              ? `确定要将店铺状态更改为 "${newStatus}" 吗？`
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

      {/* Create owner login - for a business created without one */}
      <Modal $show={showCreateOwnerModal} onClick={() => !isCreatingOwner && setShowCreateOwnerModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "创建所有者登录" : "Create Owner Login"}</ModalTitle>
          <p style={{ fontSize: '0.875rem', color: '#5c6b7a', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            {lang === "zh"
              ? `为 "${business?.name}" 创建 VendPOS 登录账户。所有字段均可选：邮箱留空则按店铺名称生成，密码留空则自动生成。`
              : `Create the VendPOS login for "${business?.name}". Everything is optional: a blank email is derived from the store name and a blank password is generated.`}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>{lang === "zh" ? "名字" : "First name"}</label>
              <Input value={newOwner.first_name} onChange={(e) => setNewOwner({ ...newOwner, first_name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>{lang === "zh" ? "姓氏" : "Last name"}</label>
              <Input value={newOwner.last_name} onChange={(e) => setNewOwner({ ...newOwner, last_name: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>{lang === "zh" ? "VendPOS 邮箱" : "VendPOS email"}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Input value={newOwner.emailPrefix} onChange={(e) => setNewOwner({ ...newOwner, emailPrefix: e.target.value.replace(/@.*$/, '') })} placeholder={lang === "zh" ? "留空则自动生成" : "Leave blank to generate"} autoComplete="off" />
              <span style={{ color: '#5c6b7a', whiteSpace: 'nowrap' }}>@vend88.com</span>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>{lang === "zh" ? "密码" : "Password"}</label>
            <Input value={newOwner.password} onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })} placeholder={lang === "zh" ? "留空则自动生成" : "Leave blank to generate"} autoComplete="new-password" />
          </div>
          {createOwnerError && (
            <p style={{ color: '#dc2626', fontSize: '0.8125rem', marginBottom: '1rem' }}>{createOwnerError}</p>
          )}
          <ModalActions>
            <ModalButton onClick={() => setShowCreateOwnerModal(false)} disabled={isCreatingOwner}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleCreateOwner} disabled={isCreatingOwner}>
              {isCreatingOwner ? (lang === "zh" ? "创建中..." : "Creating...") : (lang === "zh" ? "创建登录" : "Create Login")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete business - administrators only */}
      <Modal $show={showDeleteModal} onClick={() => !isDeleting && setShowDeleteModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "删除店铺" : "Delete Store"}</ModalTitle>
          <p style={{ fontSize: '0.875rem', color: '#5c6b7a', marginBottom: '1rem', lineHeight: 1.6 }}>
            {lang === "zh"
              ? `确定要永久删除 "${storeName}" 吗？其 ${shops.length} 个店铺及店铺登录账户将一并删除。订单和交易记录会保留，所有者账户不受影响。`
              : `Permanently delete "${storeName}"? Its ${shops.length} store${shops.length === 1 ? '' : 's'} and their store logins are deleted with it. Orders and transactions are kept as history; the owner's account is not affected.`}
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#991b1b', background: '#fee2e2', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem' }}>
            {lang === "zh" ? "此操作无法撤销。" : "This cannot be undone."}
          </p>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>
              {lang === "zh" ? <>请输入 <strong style={{ color: '#0a3655' }}>{storeName}</strong> 以确认</> : <>Type <strong style={{ color: '#0a3655' }}>{storeName}</strong> to confirm</>}
            </label>
            <Input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={business?.name || ''}
              autoComplete="off"
              spellCheck={false}
              disabled={isDeleting}
              onKeyDown={(e) => { if (e.key === 'Enter' && deleteConfirmed && !isDeleting) handleDeleteBusiness(); }}
            />
          </div>
          <ModalActions>
            <ModalButton onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton
              onClick={handleDeleteBusiness}
              disabled={isDeleting || !deleteConfirmed}
              style={{ background: deleteConfirmed ? '#ef4444' : '#fca5a5', color: 'white', cursor: deleteConfirmed ? 'pointer' : 'not-allowed' }}
            >
              {isDeleting ? (lang === "zh" ? "删除中..." : "Deleting...") : (lang === "zh" ? "永久删除" : "Delete Permanently")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Create Store: the repair path for a business that has no store yet */}
      <Modal $show={showAddShopModal} onClick={() => setShowAddShopModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "创建店铺" : "Create Store"}</ModalTitle>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>
              {lang === "zh" ? "店铺名称" : "Shop Name"} *
            </label>
            <Input
              type="text"
              value={newShop.name}
              onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
              placeholder={lang === "zh" ? "输入店铺名称" : "Enter shop name"}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#5c6b7a', marginBottom: '0.5rem' }}>
              {lang === "zh" ? "地址" : "Location"}
            </label>
            <Input
              type="text"
              value={newShop.location}
              onChange={(e) => setNewShop({ ...newShop, location: e.target.value })}
              placeholder={lang === "zh" ? "输入店铺地址（可选）" : "Enter shop address (optional)"}
            />
          </div>

          {addShopError && (
            <p style={{ color: '#dc2626', fontSize: '0.8125rem', marginBottom: '1rem' }}>{addShopError}</p>
          )}

          <ModalActions>
            <ModalButton onClick={() => setShowAddShopModal(false)} disabled={isAddingShop}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleCreateShop} disabled={isAddingShop}>
              {isAddingShop
                ? (lang === "zh" ? "创建中..." : "Creating...")
                : (lang === "zh" ? "创建店铺" : "Create Shop")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
