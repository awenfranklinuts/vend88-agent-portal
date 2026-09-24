"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isPortalUser, canSeeAllTeams } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import axios from "axios";
import {
  getBusinessDevices,
  getBusinessNotes,
  getBusinessActivityLog
} from "@/lib/mockBusinessData";

const ShopName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const ShopLocationLine = styled.div`
  font-size: 1rem;
  color: #5c6b7a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1080px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InfoLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 1rem;
  color: #0a3655;
  font-weight: 500;
`;

const AddressEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const AddressInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 1rem;
  color: #0a3655;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const AddressButton = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;
  background: ${p => p.$primary ? '#3b82f6' : '#eef2f7'};
  color: ${p => p.$primary ? 'white' : '#374151'};

  &:hover:not(:disabled) {
    background: ${p => p.$primary ? '#2563eb' : '#e0e7ef'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Card = styled.div`
  scroll-margin-top: 85px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ef;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;

  ${p => {
    switch (p.$status) {
      case 'active':
        return 'background: #d1fae5; color: #065f46;';
      case 'inactive':
        return 'background: #e5e7eb; color: #374151;';
      case 'test':
      case 'maintenance':
        return 'background: #fef3c7; color: #92400e;';
      case 'suspended':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const StatusSelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: fit-content;
`;

const StatusSelect = styled.select<{ $status: string }>`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.5rem 2.25rem 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  cursor: pointer;
  outline: none;
  transition: filter 0.15s ease, box-shadow 0.15s ease;

  ${p => {
    switch (p.$status) {
      case 'active':
        return 'background: #d1fae5; color: #065f46;';
      case 'inactive':
        return 'background: #e5e7eb; color: #374151;';
      case 'test':
        return 'background: #fef3c7; color: #92400e;';
      case 'suspended':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}

  &:hover {
    filter: brightness(0.96);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background: white;
    color: #0a3655;
    text-transform: none;
    font-weight: 500;
  }
`;

const StatusSelectArrow = styled.span`
  position: absolute;
  right: 0.85rem;
  font-size: 0.625rem;
  color: #0a3655;
  opacity: 0.5;
  pointer-events: none;
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

const TabContainer = styled.div`
  scroll-margin-top: 85px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e7ef;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 2px;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 120px;
  padding: 1rem 1.5rem;
  border: none;
  background: ${p => p.$active ? 'rgba(59, 130, 246, 0.05)' : 'transparent'};
  color: ${p => p.$active ? '#3b82f6' : '#5c6b7a'};
  font-size: 0.9375rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  &:hover {
    background: rgba(59, 130, 246, 0.05);
    color: #3b82f6;
  }

  ${p => p.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #3b82f6;
    }
  `}
`;

const TabContent = styled.div`
  padding: 2rem;

  @media (max-width: 968px) {
    padding: 1.5rem;
  }
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

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

// A store login is the only one of these cards with a trailing action, so it
// gets its own row layout rather than reshaping the shared card - Devices and
// Permissions stack a name above their details and must keep doing so.
const CredentialCard = styled(PermissionCard)`
  display: flex;
  align-items: center;
  gap: 1rem;

  > *:first-child {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
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

const PermissionDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PermissionLabel = styled.span`
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
`;

const PermissionValue = styled.span`
  color: #0a3655;
  font-weight: 500;
`;

const PermissionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${p => p.$variant === 'edit' ? `
    background: #dbeafe;
    color: #1e40af;
    &:hover { background: #bfdbfe; }
  ` : `
    background: #fee2e2;
    color: #991b1b;
    &:hover { background: #fecaca; }
  `}
`;

const EditCredentialButton = styled.button`
  flex-shrink: 0;
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: white;
  color: #1a237e;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #1d4ed8;
  }

  @media (max-width: 640px) {
    align-self: flex-start;
  }
`;

const AddPermissionButton = styled.button`
  padding: 1rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
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

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  margin-bottom: 0.5rem;
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

const NotesSection = styled.div`
  margin-top: 1.5rem;
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const NoteCard = styled.div`
  background: #f7faff;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  padding: 1rem;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const NoteAuthor = styled.span`
  font-weight: 600;
  color: #0a3655;
  font-size: 0.875rem;
`;

const NoteDate = styled.span`
  font-size: 0.75rem;
  color: #5c6b7a;
`;

const NoteContent = styled.p`
  color: #0a3655;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f7faff;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
`;

const ActivityIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${p => {
    switch (p.$type) {
      case 'status':
        return 'background: #dbeafe; color: #1e40af;';
      case 'device':
        return 'background: #d1fae5; color: #065f46;';
      case 'permission':
        return 'background: #fef3c7; color: #92400e;';
      case 'edit':
        return 'background: #e0e7ff; color: #4338ca;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.25rem;
`;

const ActivityDescription = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

interface Shop {
  _id: string;
  business_id: string;
  name?: string;
  store_name?: string;
  location?: any;
  phone?: string;
  shop_key?: string;
  status?: string;
}

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ef;

  ${CardTitle} {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

// Sized to match the row-level Edit buttons, so the two read as one family.
const AddLoginButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #2563eb;
    border-color: #2563eb;
  }
`;

// Store logins read as a list of the same three fields, so a table compares
// them far better than one card each.
const LoginTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const LoginTh = styled.th`
  text-align: left;
  padding: 0.625rem 1rem 0.625rem 0;
  border-bottom: 1px solid #e0e7ef;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #5c6b7a;
  white-space: nowrap;
`;

const LoginTd = styled.td`
  padding: 0.75rem 1rem 0.75rem 0;
  border-bottom: 1px solid #eef2f7;
  color: #0a3655;
  vertical-align: middle;

  &:last-child {
    padding-right: 0;
    text-align: right;
  }

  tr:last-child & {
    border-bottom: none;
  }
`;

const TabIntro = styled.p`
  font-size: 0.875rem;
  color: #5c6b7a;
  margin: -0.75rem 0 1.25rem;
`;

const CredentialValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
`;

const CredentialText = styled.span`
  font-family: monospace;
  font-size: 0.9375rem;
  color: #0a3655;
  overflow-wrap: anywhere;
`;

const SmallIconButton = styled.button`
  flex-shrink: 0;
  padding: 0.3rem 0.45rem;
  background: white;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #f3f4f6;
  }
`;

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

interface ShopCredential {
  _id: string;
  username: string;
  password: string;
  created_at: string | null;
}

const SHOP_STATUSES = ['active', 'inactive', 'test', 'suspended'] as const;

const SHOP_STATUS_LABELS: Record<string, { en: string; zh: string }> = {
  active: { en: 'Active', zh: '活跃' },
  inactive: { en: 'Inactive', zh: '非活跃' },
  test: { en: 'Test', zh: '测试' },
  suspended: { en: 'Suspended', zh: '已暂停' },
};

interface ShopDetailPanelProps {
  businessId: string;
  shopId: string;
  // Embedded in the business page, which already carries the name, the address
  // and the actions in its own header - so the panel drops its own copies of
  // them rather than saying everything twice.
  embedded?: boolean;
  // Called after the store's address or status changes, so a host page showing
  // them in its own header can reload rather than go stale.
  onShopChanged?: () => void;
  // A business and its store are one record, so the business page hands its own
  // fields in to be shown in the same card rather than repeating a second one
  // beside it. `leadingFields` go at the top of the field grid; `trailingContent`
  // follows the grid, inside the same card.
  leadingFields?: ReactNode;
  trailingContent?: ReactNode;
  // Anchors, so a host page's section nav can scroll to the store card and to
  // the tab strip.
  cardId?: string;
  tabsId?: string;
  credentialsId?: string;
}

// The store's own detail view, lifted out of the shop page so it can also be
// shown inline on the business page. A business and its store are one entity,
// so the store is what the business's Details button opens onto - the separate
// shop route stays for the older businesses that have more than one.
export default function ShopDetailPanel({ businessId, shopId, embedded = false, onShopChanged, leadingFields, trailingContent, cardId, tabsId, credentialsId }: ShopDetailPanelProps) {
  const router = useRouter();
  const { token, role, isLoading: authLoading, adminProfile } = useAuth();
  // Shop ids, keys and store logins are Vend88 internals, hidden from team users
  const isInternal = canSeeAllTeams(adminProfile);
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [shop, setShop] = useState<Shop | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'devices' | 'permissions' | 'activity' | 'notes'>('devices');

  // Store logins (shop_admin rows) - loaded the first time the Credentials tab opens,
  // which is on page load since it's the default tab.
  const [credentials, setCredentials] = useState<ShopCredential[] | null>(null);
  const [credentialsLoadError, setCredentialsLoadError] = useState('');
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<Set<string>>(new Set());
  const [showAddCredentialModal, setShowAddCredentialModal] = useState(false);
  // null when adding; the login being changed when editing. One modal serves
  // both - the fields and rules are identical, only the verb differs.
  const [editingCredential, setEditingCredential] = useState<ShopCredential | null>(null);
  const [credentialForm, setCredentialForm] = useState({ username: '', password: '' });
  const [credentialFormError, setCredentialFormError] = useState('');
  const [isSavingCredential, setIsSavingCredential] = useState(false);

  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  const [showDeleteDeviceModal, setShowDeleteDeviceModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const [addDeviceForm, setAddDeviceForm] = useState({
    serialNumber: '',
    deviceType: '',
    deviceName: '',
    deviceBrand: '',
    status: 'active',
    otherDeviceType: ''
  });
  const [editDeviceForm, setEditDeviceForm] = useState({
    serialNumber: '',
    deviceType: '',
    deviceName: '',
    deviceBrand: '',
    status: 'active',
    otherDeviceType: ''
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (!authLoading && token && !isPortalUser(role)) {
      router.push("/login");
    }
  }, [token, role, authLoading, router]);

  useEffect(() => {
    if (token && shopId) {
      fetchShopDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, shopId]);

  const fetchShopDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const shopResponse = await axios.post(
        `/api/shops/${shopId}`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (shopResponse.data.status_code === 200) {
        setShop(shopResponse.data.data || null);
      } else {
        setError(lang === "zh" ? "未找到店铺" : "Shop not found");
      }

      // Permissions - shares the same mock-backed proxy the business page used.
      try {
        const permissionResponse = await axios.post(
          `/api/admin/businesses/${shopId}/permissions`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (permissionResponse.data.status_code === 200) {
          setPermissions(permissionResponse.data.permissions || []);
        }
      } catch (err) {
        console.error('Failed to fetch permissions:', err);
      }

      // TODO: Fetch real devices/notes/activity when API is available
      setDevices(getBusinessDevices(shopId));
      setNotes(getBusinessNotes(shopId));
      setActivityLog(getBusinessActivityLog(shopId));
    } catch (err) {
      console.error("Failed to fetch shop details:", err);
      setError(lang === "zh" ? "加载失败" : "Failed to load shop details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInternal && credentials === null && token && shopId) {
      fetchCredentials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInternal, token, shopId]);

  const fetchCredentials = async () => {
    setCredentialsLoadError('');
    try {
      const response = await axios.post(
        `/api/shops/${shopId}/credentials`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status_code === 200) {
        setCredentials(response.data.data || []);
      } else {
        setCredentialsLoadError(response.data.message || (lang === "zh" ? "加载失败" : "Failed to load credentials"));
      }
    } catch (err: any) {
      console.error('Failed to fetch shop credentials:', err);
      setCredentialsLoadError(err?.response?.data?.message || (lang === "zh" ? "加载失败" : "Failed to load credentials"));
    }
  };

  const togglePasswordVisible = (id: string) => {
    setVisiblePasswordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(lang === "zh" ? `${label}已复制` : `${label} copied to clipboard`, 'success');
    } catch {
      showToast(lang === "zh" ? "复制失败" : "Failed to copy", 'error');
    }
  };

  const openAddCredentialModal = () => {
    setEditingCredential(null);
    setCredentialForm({ username: '', password: '' });
    setCredentialFormError('');
    setShowAddCredentialModal(true);
  };

  // The password box starts empty when editing: leaving it that way keeps the
  // current password, so an admin changing only a username never has to retype
  // - or accidentally overwrite - a working one.
  const openEditCredentialModal = (cred: ShopCredential) => {
    setEditingCredential(cred);
    setCredentialForm({ username: cred.username || '', password: '' });
    setCredentialFormError('');
    setShowAddCredentialModal(true);
  };

  const handleGenerateCredentialPassword = () => {
    const digits = Math.floor(1000 + Math.random() * 9000);
    setCredentialForm((prev) => ({ ...prev, password: `Vend${digits}` }));
  };

  const handleAddCredential = async () => {
    const username = credentialForm.username.trim();
    const { password } = credentialForm;
    const isEdit = !!editingCredential;

    // Same rules the backend enforces, checked here for a faster error.
    if (!/^\S{3,50}$/.test(username)) {
      setCredentialFormError(lang === "zh" ? "用户名需为 3-50 个字符，且不能包含空格" : "Username must be 3-50 characters with no spaces");
      return;
    }
    // On an edit an empty password means "leave it as it is"; on a create it is
    // simply missing.
    if ((!isEdit || password.length > 0) && password.length < 6) {
      setCredentialFormError(lang === "zh" ? "密码至少需要 6 个字符" : "Password must be at least 6 characters");
      return;
    }
    if (isEdit && username === editingCredential.username && password.length === 0) {
      setCredentialFormError(lang === "zh" ? "没有需要保存的更改" : "Nothing to save");
      return;
    }

    setCredentialFormError('');
    setIsSavingCredential(true);
    try {
      const response = isEdit
        ? await axios.patch(
            `/api/shops/${shopId}/credentials`,
            {
              token,
              credential_id: editingCredential._id,
              username,
              // Omitted entirely when blank, so the backend leaves it alone.
              ...(password.length > 0 ? { password } : {}),
            },
            { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
          )
        : await axios.put(
            `/api/shops/${shopId}/credentials`,
            { token, username, password },
            { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
          );

      if (response.data.status_code === 200 && response.data.data) {
        const saved = response.data.data;
        setCredentials((prev) => isEdit
          ? (prev || []).map((c) => (c._id === saved._id ? saved : c))
          : [...(prev || []), saved]);
        setShowAddCredentialModal(false);
        setEditingCredential(null);
        showToast(
          isEdit
            ? (lang === "zh" ? "登录账户已更新" : "Login updated successfully")
            : (lang === "zh" ? "登录账户已添加" : "Login added successfully"),
          'success',
        );
      } else {
        setCredentialFormError(response.data.message || (lang === "zh" ? "保存失败" : "Failed to save login"));
      }
    } catch (err: any) {
      setCredentialFormError(err?.response?.data?.message || (lang === "zh" ? "保存失败" : "Failed to save login"));
    } finally {
      setIsSavingCredential(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!shop || newStatus === (shop.status || 'active')) return;
    const previousStatus = shop.status;
    setShop({ ...shop, status: newStatus });
    setIsSavingStatus(true);
    try {
      const response = await axios.post(
        `/api/shops/update`,
        { token, id: shop._id, status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        setShop(response.data.data || { ...shop, status: newStatus });
        onShopChanged?.();
        showToast(lang === "zh" ? "状态已更新" : "Status updated successfully", 'success');
      } else {
        setShop((prev) => (prev ? { ...prev, status: previousStatus } : prev));
        showToast(response.data.message || (lang === "zh" ? "更新失败" : "Failed to update status"), 'error');
      }
    } catch (err: any) {
      console.error('Failed to update shop status:', err);
      setShop((prev) => (prev ? { ...prev, status: previousStatus } : prev));
      showToast(err?.response?.data?.message || (lang === "zh" ? "更新失败" : "Failed to update status"), 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Address lives in `location` on the shop. The collection also holds [lng, lat]
  // pairs the POS writes when no address was given, so an array counts as unset.
  const addressOf = (location: any) => (typeof location === 'string' ? location : '');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const startEditAddress = () => {
    setAddressDraft(addressOf(shop?.location));
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    if (!shop) return;
    const next = addressDraft.trim();
    if (next === addressOf(shop.location)) { setIsEditingAddress(false); return; }
    setIsSavingAddress(true);
    try {
      const response = await axios.post(
        `/api/shops/update`,
        { token, id: shop._id, location: next },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        setShop(response.data.data || { ...shop, location: next });
        setIsEditingAddress(false);
        onShopChanged?.();
        showToast(lang === "zh" ? "地址已更新" : "Address updated", 'success');
      } else {
        showToast(response.data.message || (lang === "zh" ? "更新失败" : "Failed to update address"), 'error');
      }
    } catch (err: any) {
      console.error('Failed to update shop address:', err);
      showToast(err?.response?.data?.message || (lang === "zh" ? "更新失败" : "Failed to update address"), 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleEditClick = (permission: string) => {
    setSelectedPermission(permission);
    showToast(lang === "zh" ? "权限为只读" : "Permissions are read-only", 'info');
  };

  const handleDeleteClick = (permission: string) => {
    setSelectedPermission(permission);
    showToast(lang === "zh" ? "权限无法删除" : "Permissions cannot be deleted", 'info');
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddDeviceClick = () => {
    setAddDeviceForm({
      serialNumber: '',
      deviceType: '',
      deviceName: '',
      deviceBrand: '',
      status: 'active',
      otherDeviceType: ''
    });
    setShowAddDeviceModal(true);
  };

  const handleEditDeviceClick = (device: any) => {
    setSelectedDevice(device);
    setEditDeviceForm({
      serialNumber: device.serialNumber,
      deviceType: device.deviceType,
      deviceName: device.deviceName,
      deviceBrand: device.deviceBrand,
      status: device.status,
      otherDeviceType: device.deviceType === 'Other' ? device.deviceType : ''
    });
    setShowEditDeviceModal(true);
  };

  const handleDeleteDeviceClick = (device: any) => {
    setSelectedDevice(device);
    setShowDeleteDeviceModal(true);
  };

  const handleAddDeviceSubmit = async () => {
    if (!addDeviceForm.deviceName || !addDeviceForm.deviceType) {
      showToast(lang === "zh" ? "请填写所有必填字段" : "Please fill all required fields", 'error');
      return;
    }
    if (addDeviceForm.deviceType === 'Other' && !addDeviceForm.otherDeviceType) {
      showToast(lang === "zh" ? "请指定设备类型" : "Please specify device type", 'error');
      return;
    }
    // TODO: Replace with actual API endpoint when available
    showToast(lang === "zh" ? "设备已添加" : "Device added successfully", 'success');
    setShowAddDeviceModal(false);
  };

  const handleEditDeviceSubmit = async () => {
    if (!editDeviceForm.deviceName || !editDeviceForm.deviceType) {
      showToast(lang === "zh" ? "请填写所有必填字段" : "Please fill all required fields", 'error');
      return;
    }
    if (editDeviceForm.deviceType === 'Other' && !editDeviceForm.otherDeviceType) {
      showToast(lang === "zh" ? "请指定设备类型" : "Please specify device type", 'error');
      return;
    }
    // TODO: Replace with actual API endpoint when available
    showToast(lang === "zh" ? "设备已更新" : "Device updated successfully", 'success');
    setShowEditDeviceModal(false);
  };

  const handleDeleteDeviceSubmit = async () => {
    // TODO: Replace with actual API endpoint when available
    showToast(lang === "zh" ? "设备已删除" : "Device deleted successfully", 'success');
    setShowDeleteDeviceModal(false);
  };

  const handleEditSubmit = async () => {
    showToast(lang === "zh" ? "权限由后端API管理，无法在此编辑" : "Permissions are managed by backend API and cannot be edited here", 'info');
    setShowEditModal(false);
  };

  const handleDeleteSubmit = async () => {
    showToast(lang === "zh" ? "权限由后端API管理，无法在此删除" : "Permissions are managed by backend API and cannot be deleted here", 'info');
    setShowDeleteModal(false);
  };

  const handleAddSubmit = async () => {
    showToast(lang === "zh" ? "权限由后端API管理" : "Permissions are managed by backend API", 'info');
    setShowAddModal(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Admin',
      createdAt: new Date().toISOString()
    };
    setNotes([note, ...notes]);
    setNewNote('');
    showToast(lang === 'zh' ? '笔记已添加' : 'Note added', 'success');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status': return '🔄';
      case 'device': return '📱';
      case 'permission': return '🔑';
      case 'edit': return '✏️';
      default: return '📝';
    }
  };

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return lang === 'zh' ? '今天' : 'Today';
    if (days === 1) return lang === 'zh' ? '昨天' : 'Yesterday';
    if (days < 7) return lang === 'zh' ? `${days} 天前` : `${days} days ago`;
    return date.toLocaleDateString();
  };

  // shop_admin.created_at is a naive UTC timestamp with microseconds
  // ("2026-09-15T10:00:00.000000"), so mark it as UTC before parsing.
  const formatCredentialDate = (value: string | null) => {
    if (!value) return 'N/A';
    const date = new Date(`${value.slice(0, 23)}Z`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

  const formatShopLocation = (location: any) => {
    if (typeof location === 'string' && location.trim()) return location;
    return lang === "zh" ? "未设置地址" : "No address set";
  };

  if (authLoading) {
    return <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>;
  }

  if (!token || !isPortalUser(role)) {
    return null;
  }

  return (
    <>
          {isLoading ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : shop ? (
            <>
              {!embedded && (
                <>
                  <ShopName>{shop.store_name || shop.name || 'N/A'}</ShopName>
                  <ShopLocationLine>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {formatShopLocation(shop.location)}
                    {shop.phone ? ` · ${shop.phone}` : ''}
                  </ShopLocationLine>
                </>
              )}

              <Card id={cardId}>
                <CardTitle>
                  {embedded
                    ? (lang === "zh" ? "店铺" : "Store")
                    : (lang === "zh" ? "店铺信息" : "Store Information")}
                </CardTitle>
                <InfoGrid>
                  {leadingFields}
                  {!embedded && (
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "店铺名称" : "Shop Name"}</InfoLabel>
                      <InfoValue>{shop.store_name || shop.name || 'N/A'}</InfoValue>
                    </InfoItem>
                  )}
                  {!embedded && (
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "店铺电话" : "Store Phone"}</InfoLabel>
                      <InfoValue>{shop.phone || 'N/A'}</InfoValue>
                    </InfoItem>
                  )}
                  <InfoItem style={embedded ? { display: 'none' } : { gridColumn: '1 / -1' }}>
                    <InfoLabel>{lang === "zh" ? "地址" : "Address"}</InfoLabel>
                    {isEditingAddress ? (
                      <AddressEditRow>
                        <AddressInput
                          value={addressDraft}
                          onChange={(e) => setAddressDraft(e.target.value)}
                          placeholder={lang === "zh" ? "例如：191 Parramatta Rd, Auburn, NSW" : "e.g. 191 Parramatta Rd, Auburn, NSW"}
                          disabled={isSavingAddress}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveAddress();
                            if (e.key === 'Escape') setIsEditingAddress(false);
                          }}
                        />
                        <AddressButton $primary onClick={handleSaveAddress} disabled={isSavingAddress}>
                          {isSavingAddress ? (lang === "zh" ? "保存中..." : "Saving...") : (lang === "zh" ? "保存" : "Save")}
                        </AddressButton>
                        <AddressButton onClick={() => setIsEditingAddress(false)} disabled={isSavingAddress}>
                          {lang === "zh" ? "取消" : "Cancel"}
                        </AddressButton>
                      </AddressEditRow>
                    ) : (
                      <AddressEditRow>
                        <InfoValue style={{ flex: 1, minWidth: 0 }}>
                          {addressOf(shop.location) || (
                            <span style={{ color: '#9ca3af' }}>{lang === "zh" ? "未设置地址" : "No address set"}</span>
                          )}
                        </InfoValue>
                        <AddressButton onClick={startEditAddress}>
                          {addressOf(shop.location) ? (lang === "zh" ? "编辑" : "Edit") : (lang === "zh" ? "添加地址" : "Add address")}
                        </AddressButton>
                      </AddressEditRow>
                    )}
                  </InfoItem>
                  <InfoItem style={embedded ? { display: 'none' } : undefined}>
                    <InfoLabel>{lang === "zh" ? "状态" : "Status"}</InfoLabel>
                    <StatusSelectWrapper>
                      <StatusSelect
                        $status={shop.status || 'active'}
                        value={shop.status || 'active'}
                        disabled={isSavingStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                      >
                        {SHOP_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {SHOP_STATUS_LABELS[s][lang === "zh" ? "zh" : "en"]}
                          </option>
                        ))}
                      </StatusSelect>
                      <StatusSelectArrow>▾</StatusSelectArrow>
                    </StatusSelectWrapper>
                  </InfoItem>
                  {isInternal && !embedded && (
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "店铺 ID" : "Shop ID"}</InfoLabel>
                      <InfoValue>{shop._id}</InfoValue>
                    </InfoItem>
                  )}
                  {isInternal && !embedded && (
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "店铺密钥" : "Shop Key"}</InfoLabel>
                      <InfoValue>{shop.shop_key || 'N/A'}</InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </Card>

              {trailingContent}

              {isInternal && (
              <Card id={credentialsId}>
                <CardTitleRow>
                  <CardTitle>{lang === "zh" ? "店铺登录凭据" : "Store Logins"}</CardTitle>
                  {credentials !== null && !credentialsLoadError && (
                    <AddLoginButton onClick={openAddCredentialModal}>
                      + {lang === "zh" ? "添加登录账户" : "Add Login"}
                    </AddLoginButton>
                  )}
                </CardTitleRow>
                <TabIntro>
                  {lang === "zh"
                    ? "用于在此店铺登录 VendPOS 的账户。"
                    : "Accounts used to sign in to VendPOS at this shop."}
                </TabIntro>

                {credentialsLoadError ? (
                  <InfoValue style={{ textAlign: 'center', padding: '2rem', color: '#991b1b' }}>
                    {credentialsLoadError}
                  </InfoValue>
                ) : credentials === null ? (
                  <InfoValue style={{ textAlign: 'center', padding: '2rem' }}>
                    {lang === "zh" ? "加载中..." : "Loading..."}
                  </InfoValue>
                ) : credentials.length > 0 ? (
                  <LoginTable>
                    <thead>
                      <tr>
                        <LoginTh>{lang === "zh" ? "用户名" : "Username"}</LoginTh>
                        <LoginTh>{lang === "zh" ? "密码" : "Password"}</LoginTh>
                        <LoginTh>{lang === "zh" ? "创建时间" : "Created"}</LoginTh>
                        <LoginTh />
                      </tr>
                    </thead>
                    <tbody>
                      {credentials.map((cred) => {
                        const passwordVisible = visiblePasswordIds.has(cred._id);
                        return (
                          <tr key={cred._id}>
                            <LoginTd>
                              <CredentialValueRow>
                                <CredentialText>{cred.username || 'N/A'}</CredentialText>
                                {cred.username && (
                                  <SmallIconButton
                                    onClick={() => handleCopy(cred.username, lang === "zh" ? "用户名" : "Username")}
                                    title={lang === "zh" ? "复制用户名" : "Copy username"}
                                    aria-label={lang === "zh" ? "复制用户名" : "Copy username"}
                                  >
                                    <CopyIcon />
                                  </SmallIconButton>
                                )}
                              </CredentialValueRow>
                            </LoginTd>
                            <LoginTd>
                              <CredentialValueRow>
                                <CredentialText>
                                  {!cred.password ? 'N/A' : passwordVisible ? cred.password : '••••••••••••'}
                                </CredentialText>
                                {cred.password && (
                                  <>
                                    <SmallIconButton
                                      onClick={() => togglePasswordVisible(cred._id)}
                                      title={passwordVisible ? (lang === "zh" ? "隐藏密码" : "Hide password") : (lang === "zh" ? "显示密码" : "Show password")}
                                      aria-label={passwordVisible ? (lang === "zh" ? "隐藏密码" : "Hide password") : (lang === "zh" ? "显示密码" : "Show password")}
                                    >
                                      {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                    </SmallIconButton>
                                    <SmallIconButton
                                      onClick={() => handleCopy(cred.password, lang === "zh" ? "密码" : "Password")}
                                      title={lang === "zh" ? "复制密码" : "Copy password"}
                                      aria-label={lang === "zh" ? "复制密码" : "Copy password"}
                                    >
                                      <CopyIcon />
                                    </SmallIconButton>
                                  </>
                                )}
                              </CredentialValueRow>
                            </LoginTd>
                            <LoginTd style={{ whiteSpace: 'nowrap' }}>
                              {formatCredentialDate(cred.created_at)}
                            </LoginTd>
                            <LoginTd>
                              <EditCredentialButton
                                onClick={() => openEditCredentialModal(cred)}
                                title={lang === "zh" ? "编辑登录账户" : "Edit login"}
                              >
                                <PencilIcon />
                                {lang === "zh" ? "编辑" : "Edit"}
                              </EditCredentialButton>
                            </LoginTd>
                          </tr>
                        );
                      })}
                    </tbody>
                  </LoginTable>
                ) : (
                  <InfoValue style={{ textAlign: 'center', padding: '2rem' }}>
                    {lang === "zh" ? "暂无登录账户" : "No logins for this shop yet"}
                  </InfoValue>
                )}

              </Card>
              )}

              <TabContainer id={tabsId}>
                <TabButtons>
                  <TabButton $active={activeTab === 'devices'} onClick={() => setActiveTab('devices')}>
                    {lang === "zh" ? "设备" : "Devices"}
                  </TabButton>
                  <TabButton $active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')}>
                    {lang === "zh" ? "权限" : "Permissions"}
                  </TabButton>
                  <TabButton $active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
                    {lang === "zh" ? "活动日志" : "Activity Log"}
                  </TabButton>
                  <TabButton $active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
                    {lang === "zh" ? "备注" : "Notes"}
                  </TabButton>
                </TabButtons>

                <TabContent>
                  {activeTab === 'devices' && (
                    <>
                      <CardTitle>{lang === "zh" ? "注册设备" : "Registered Devices"}</CardTitle>
                      {devices.length > 0 ? (
                        <PermissionList>
                          {devices.map((device) => (
                            <PermissionCard key={device.id}>
                              <PermissionName>{device.deviceName || 'N/A'}</PermissionName>
                              <PermissionDetails>
                                <PermissionDetailItem>
                                  <PermissionLabel>{lang === "zh" ? "品牌" : "Brand"}</PermissionLabel>
                                  <PermissionValue>{device.deviceBrand || 'N/A'}</PermissionValue>
                                </PermissionDetailItem>
                                <PermissionDetailItem>
                                  <PermissionLabel>{lang === "zh" ? "序列号" : "Serial Number"}</PermissionLabel>
                                  <PermissionValue>{device.serialNumber || 'N/A'}</PermissionValue>
                                </PermissionDetailItem>
                                <PermissionDetailItem>
                                  <PermissionLabel>{lang === "zh" ? "设备类型" : "Device Type"}</PermissionLabel>
                                  <PermissionValue>{device.deviceType || 'N/A'}</PermissionValue>
                                </PermissionDetailItem>
                                <PermissionDetailItem>
                                  <PermissionLabel>{lang === "zh" ? "状态" : "Status"}</PermissionLabel>
                                  <PermissionValue>
                                    <StatusBadge $status={device.status}>
                                      {device.status === 'active'
                                        ? (lang === "zh" ? "活跃" : "Active")
                                        : (lang === "zh" ? "非活跃" : "Inactive")}
                                    </StatusBadge>
                                  </PermissionValue>
                                </PermissionDetailItem>
                                <PermissionDetailItem>
                                  <PermissionLabel>{lang === "zh" ? "注册日期" : "Registered"}</PermissionLabel>
                                  <PermissionValue>{device.registeredAt || 'N/A'}</PermissionValue>
                                </PermissionDetailItem>
                              </PermissionDetails>
                              <PermissionActions>
                                <ActionButton $variant="edit" onClick={() => handleEditDeviceClick(device)}>
                                  {lang === "zh" ? "编辑" : "Edit"}
                                </ActionButton>
                                <ActionButton $variant="delete" onClick={() => handleDeleteDeviceClick(device)}>
                                  {lang === "zh" ? "删除" : "Delete"}
                                </ActionButton>
                              </PermissionActions>
                            </PermissionCard>
                          ))}
                        </PermissionList>
                      ) : (
                        <InfoValue style={{ textAlign: 'center', padding: '2rem' }}>
                          {lang === "zh" ? "暂无设备" : "No devices found"}
                        </InfoValue>
                      )}
                      <AddPermissionButton onClick={handleAddDeviceClick}>
                        {lang === "zh" ? "添加设备" : "Add Device"}
                      </AddPermissionButton>
                    </>
                  )}

                  {activeTab === 'permissions' && (
                    <>
                      <CardTitle>{lang === "zh" ? "权限管理" : "Permissions Management"}</CardTitle>
                      {permissions.length > 0 ? (
                        <PermissionList>
                          {permissions.map((permission) => (
                            <PermissionCard key={permission}>
                              <PermissionName>{permission || 'N/A'}</PermissionName>
                              <PermissionDetails>
                                <PermissionDetailItem>
                                  <PermissionLabel>{lang === "zh" ? "权限名称" : "Permission Name"}</PermissionLabel>
                                  <PermissionValue>{permission}</PermissionValue>
                                </PermissionDetailItem>
                              </PermissionDetails>
                            </PermissionCard>
                          ))}
                        </PermissionList>
                      ) : (
                        <InfoValue style={{ textAlign: 'center', padding: '2rem' }}>
                          {lang === "zh" ? "暂无权限" : "No permissions found"}
                        </InfoValue>
                      )}
                      <AddPermissionButton onClick={handleAddClick}>
                        {lang === "zh" ? "添加权限" : "Add Permission"}
                      </AddPermissionButton>
                    </>
                  )}

                  {activeTab === 'activity' && (
                    <>
                      <CardTitle>{lang === "zh" ? "活动日志" : "Activity Log"}</CardTitle>
                      {activityLog.length > 0 ? (
                        <ActivityList>
                          {activityLog.map((activity, index) => (
                            <ActivityItem key={index}>
                              <ActivityIcon $type={activity.type}>
                                {getActivityIcon(activity.type)}
                              </ActivityIcon>
                              <ActivityContent>
                                <ActivityTitle>{activity.title}</ActivityTitle>
                                <ActivityDescription>{activity.description}</ActivityDescription>
                                <ActivityTime>{formatActivityTime(activity.timestamp)}</ActivityTime>
                              </ActivityContent>
                            </ActivityItem>
                          ))}
                        </ActivityList>
                      ) : (
                        <InfoValue style={{ textAlign: 'center', padding: '2rem' }}>
                          {lang === "zh" ? "暂无活动记录" : "No activity found"}
                        </InfoValue>
                      )}
                    </>
                  )}

                  {activeTab === 'notes' && (
                    <>
                      <CardTitle>{lang === "zh" ? "备注" : "Notes"}</CardTitle>
                      <NotesSection>
                        <FormGroup>
                          <Label>{lang === "zh" ? "添加新备注" : "Add New Note"}</Label>
                          <Textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder={lang === "zh" ? "输入备注内容..." : "Enter note content..."}
                          />
                          <AddPermissionButton onClick={handleAddNote} style={{ marginTop: '0.75rem' }}>
                            {lang === "zh" ? "添加备注" : "Add Note"}
                          </AddPermissionButton>
                        </FormGroup>

                        {notes.length > 0 && (
                          <>
                            <CardTitle style={{ marginTop: '2rem', fontSize: '1.125rem' }}>
                              {lang === "zh" ? "历史备注" : "Previous Notes"}
                            </CardTitle>
                            <NotesList>
                              {notes.map((note) => (
                                <NoteCard key={note.id}>
                                  <NoteHeader>
                                    <NoteAuthor>{note.author}</NoteAuthor>
                                    <NoteDate>{new Date(note.createdAt).toLocaleString()}</NoteDate>
                                  </NoteHeader>
                                  <NoteContent>{note.content}</NoteContent>
                                </NoteCard>
                              ))}
                            </NotesList>
                          </>
                        )}
                      </NotesSection>
                    </>
                  )}

                </TabContent>
              </TabContainer>
            </>
          ) : (
            <ErrorText>{lang === "zh" ? "未找到店铺" : "Shop not found"}</ErrorText>
          )}
      {/* Edit Permission Modal */}
      <Modal $show={showEditModal} onClick={() => setShowEditModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "权限详情" : "Permission Details"}</ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "权限名称" : "Permission Name"}</Label>
            <Input value={selectedPermission || ''} disabled />
          </FormGroup>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a', fontSize: '0.875rem' }}>
            {lang === "zh"
              ? '权限由后端API管理，在此无法编辑。'
              : 'Permissions are managed by the backend API and cannot be edited here.'}
          </p>
          <ModalActions>
            <ModalButton $primary onClick={() => setShowEditModal(false)}>
              {lang === "zh" ? "关闭" : "Close"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete Permission Modal */}
      <Modal $show={showDeleteModal} onClick={() => setShowDeleteModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "删除权限" : "Delete Permission"}</ModalTitle>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a' }}>
            {lang === "zh"
              ? `确定要删除权限 "${selectedPermission}" 吗？此操作无法撤销。`
              : `Are you sure you want to delete permission "${selectedPermission}"? This action cannot be undone.`}
          </p>
          <ModalActions>
            <ModalButton onClick={() => setShowDeleteModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleDeleteSubmit}>
              {lang === "zh" ? "删除" : "Delete"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Add Permission Modal */}
      <Modal $show={showAddModal} onClick={() => setShowAddModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "关于权限" : "About Permissions"}</ModalTitle>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a', fontSize: '0.875rem' }}>
            {lang === "zh"
              ? '权限由后端API管理。业务权限从后端自动获取，并在权限选项卡中显示。无法在此添加或修改权限。'
              : 'Permissions are managed by the backend API. Business permissions are automatically retrieved from the backend and displayed in the Permissions tab. You cannot add or modify permissions here.'}
          </p>
          <ModalActions>
            <ModalButton $primary onClick={() => setShowAddModal(false)}>
              {lang === "zh" ? "关闭" : "Close"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Edit Device Modal */}
      <Modal $show={showEditDeviceModal} onClick={() => setShowEditDeviceModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "编辑设备" : "Edit Device"}</ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "设备名称" : "Device Name"}</Label>
            <Input
              value={editDeviceForm.deviceName}
              onChange={(e) => setEditDeviceForm({ ...editDeviceForm, deviceName: e.target.value })}
              placeholder={lang === "zh" ? "输入设备名称" : "Enter device name"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "设备品牌 (可选)" : "Device Brand (Optional)"}</Label>
            <Input
              value={editDeviceForm.deviceBrand}
              onChange={(e) => setEditDeviceForm({ ...editDeviceForm, deviceBrand: e.target.value })}
              placeholder={lang === "zh" ? "输入设备品牌" : "Enter device brand"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "序列号 (可选)" : "Serial Number (Optional)"}</Label>
            <Input
              value={editDeviceForm.serialNumber}
              onChange={(e) => setEditDeviceForm({ ...editDeviceForm, serialNumber: e.target.value })}
              placeholder={lang === "zh" ? "输入序列号" : "Enter serial number"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "设备类型" : "Device Type"}</Label>
            <Select
              value={editDeviceForm.deviceType}
              onChange={(e) => setEditDeviceForm({ ...editDeviceForm, deviceType: e.target.value, otherDeviceType: '' })}
            >
              <option value="">{lang === "zh" ? "选择类型" : "Select Type"}</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Payment Gateway">Payment Gateway</option>
              <option value="Card Reader">Card Reader</option>
              <option value="Mobile Device">Mobile Device</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>
          {editDeviceForm.deviceType === 'Other' && (
            <FormGroup>
              <Label>{lang === "zh" ? "请指定设备类型" : "Specify Device Type"}</Label>
              <Input
                value={editDeviceForm.otherDeviceType}
                onChange={(e) => setEditDeviceForm({ ...editDeviceForm, otherDeviceType: e.target.value })}
                placeholder={lang === "zh" ? "输入设备类型" : "Enter device type"}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label>{lang === "zh" ? "状态" : "Status"}</Label>
            <Select
              value={editDeviceForm.status}
              onChange={(e) => setEditDeviceForm({ ...editDeviceForm, status: e.target.value })}
            >
              <option value="active">{lang === "zh" ? "活跃" : "Active"}</option>
              <option value="inactive">{lang === "zh" ? "非活跃" : "Inactive"}</option>
            </Select>
          </FormGroup>
          <ModalActions>
            <ModalButton onClick={() => setShowEditDeviceModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleEditDeviceSubmit}>
              {lang === "zh" ? "保存" : "Save"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete Device Modal */}
      <Modal $show={showDeleteDeviceModal} onClick={() => setShowDeleteDeviceModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "删除设备" : "Delete Device"}</ModalTitle>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a' }}>
            {lang === "zh"
              ? `确定要删除设备 "${selectedDevice?.deviceName}" 吗？此操作无法撤销。`
              : `Are you sure you want to delete device "${selectedDevice?.deviceName}"? This action cannot be undone.`}
          </p>
          <ModalActions>
            <ModalButton onClick={() => setShowDeleteDeviceModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleDeleteDeviceSubmit}>
              {lang === "zh" ? "删除" : "Delete"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Add Store Login Modal */}
      <Modal $show={showAddCredentialModal} onClick={() => { if (!isSavingCredential) { setShowAddCredentialModal(false); setEditingCredential(null); } }}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>
            {editingCredential
              ? (lang === "zh" ? "编辑登录账户" : "Edit Login")
              : (lang === "zh" ? "添加登录账户" : "Add Login")}
          </ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "用户名" : "Username"} *</Label>
            <Input
              value={credentialForm.username}
              autoComplete="off"
              disabled={isSavingCredential}
              onChange={(e) => setCredentialForm({ ...credentialForm, username: e.target.value })}
              placeholder={lang === "zh" ? "3-50 个字符，不含空格" : "3-50 characters, no spaces"}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              {lang === "zh" ? "密码" : "Password"}{editingCredential ? '' : ' *'}
            </Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                value={credentialForm.password}
                autoComplete="new-password"
                disabled={isSavingCredential}
                onChange={(e) => setCredentialForm({ ...credentialForm, password: e.target.value })}
                placeholder={editingCredential
                  ? (lang === "zh" ? "留空则保持不变" : "Leave blank to keep the current password")
                  : (lang === "zh" ? "至少 6 个字符" : "At least 6 characters")}
              />
              <ModalButton type="button" onClick={handleGenerateCredentialPassword} disabled={isSavingCredential}>
                {lang === "zh" ? "生成" : "Generate"}
              </ModalButton>
            </div>
          </FormGroup>
          {editingCredential && (
            <p style={{ color: '#92400e', background: '#fef3c7', padding: '0.625rem 0.75rem', borderRadius: 8, fontSize: '0.8125rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              {lang === "zh"
                ? "该账户正用于门店 POS 登录。修改后，店员需使用新的凭据重新登录。"
                : "This login is in use on the shop's POS. After saving, staff will need to sign in again with the new details."}
            </p>
          )}
          {credentialFormError && (
            <p style={{ color: '#dc2626', fontSize: '0.8125rem', marginBottom: '1rem' }}>{credentialFormError}</p>
          )}
          <ModalActions>
            <ModalButton onClick={() => { setShowAddCredentialModal(false); setEditingCredential(null); }} disabled={isSavingCredential}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleAddCredential} disabled={isSavingCredential}>
              {isSavingCredential
                ? (lang === "zh" ? "保存中..." : "Saving...")
                : editingCredential
                  ? (lang === "zh" ? "保存更改" : "Save changes")
                  : (lang === "zh" ? "添加" : "Add")}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Add Device Modal */}
      <Modal $show={showAddDeviceModal} onClick={() => setShowAddDeviceModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "添加设备" : "Add Device"}</ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "设备名称" : "Device Name"}</Label>
            <Input
              value={addDeviceForm.deviceName}
              onChange={(e) => setAddDeviceForm({ ...addDeviceForm, deviceName: e.target.value })}
              placeholder={lang === "zh" ? "输入设备名称" : "Enter device name"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "设备品牌 (可选)" : "Device Brand (Optional)"}</Label>
            <Input
              value={addDeviceForm.deviceBrand}
              onChange={(e) => setAddDeviceForm({ ...addDeviceForm, deviceBrand: e.target.value })}
              placeholder={lang === "zh" ? "输入设备品牌" : "Enter device brand"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "序列号 (可选)" : "Serial Number (Optional)"}</Label>
            <Input
              value={addDeviceForm.serialNumber}
              onChange={(e) => setAddDeviceForm({ ...addDeviceForm, serialNumber: e.target.value })}
              placeholder={lang === "zh" ? "输入序列号" : "Enter serial number"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "设备类型" : "Device Type"}</Label>
            <Select
              value={addDeviceForm.deviceType}
              onChange={(e) => setAddDeviceForm({ ...addDeviceForm, deviceType: e.target.value, otherDeviceType: '' })}
            >
              <option value="">{lang === "zh" ? "选择类型" : "Select Type"}</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Payment Gateway">Payment Gateway</option>
              <option value="Card Reader">Card Reader</option>
              <option value="Mobile Device">Mobile Device</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>
          {addDeviceForm.deviceType === 'Other' && (
            <FormGroup>
              <Label>{lang === "zh" ? "请指定设备类型" : "Specify Device Type"}</Label>
              <Input
                value={addDeviceForm.otherDeviceType}
                onChange={(e) => setAddDeviceForm({ ...addDeviceForm, otherDeviceType: e.target.value })}
                placeholder={lang === "zh" ? "输入设备类型" : "Enter device type"}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label>{lang === "zh" ? "状态" : "Status"}</Label>
            <Select
              value={addDeviceForm.status}
              onChange={(e) => setAddDeviceForm({ ...addDeviceForm, status: e.target.value })}
            >
              <option value="active">{lang === "zh" ? "活跃" : "Active"}</option>
              <option value="inactive">{lang === "zh" ? "非活跃" : "Inactive"}</option>
            </Select>
          </FormGroup>
          <ModalActions>
            <ModalButton onClick={() => setShowAddDeviceModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleAddDeviceSubmit}>
              {lang === "zh" ? "添加" : "Add"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
}
