"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
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
  border-radius: 8px;
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

const QuickActionsBar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const QuickActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  flex: 1;
  min-width: 150px;
  padding: 0.75rem 1rem;
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
    switch(p.$variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover { background: #2563eb; transform: translateY(-2px); }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; transform: translateY(-2px); }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; transform: translateY(-2px); }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover { background: #e5e7eb; }
        `;
    }
  }}
`;

const AddShopButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
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
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const TabContent = styled.div`
  padding: 2rem;

  @media (max-width: 968px) {
    padding: 1.5rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ef;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ef;

  ${CardTitle} {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const BusinessName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const BusinessLocation = styled.div`
  font-size: 1rem;
  color: #5c6b7a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
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

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
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

const PermissionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

const OwnerCard = styled.div`
  background: #f7faff;
  border: 1px solid #e0e7ef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const OwnerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
`;

const OwnerActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const CredentialsBox = styled.div`
  background: white;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CredentialsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const CredentialsTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  border-radius: 6px;
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
  border-radius: 6px;
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
  border-radius: 6px;
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
  border-radius: 6px;
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
  overflow-wrap: break-word;
`;

const CopyButton = styled.button`
  flex-shrink: 0;
  padding: 0.4rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e0e7ef;
  border-radius: 6px;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e7ef;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const EditButton = styled.button<{ $variant?: 'save' | 'cancel' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${p => p.$variant === 'save' ? `
    background: #10b981;
    color: white;
    &:hover {
      background: #059669;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    &:hover { background: #d1d5db; }
  `}
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
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  registrationId?: string;
  registration_id?: string;
}

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;
  const { token, role, isLoading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [originalBusiness, setOriginalBusiness] = useState<Business | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [ownerCredentials, setOwnerCredentials] = useState<{ email: string; password: string } | null>(null);
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
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [credentialsDraft, setCredentialsDraft] = useState({ email: '', password: '' });
  const [credentialsError, setCredentialsError] = useState('');
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (!authLoading && token && !isAdminRole(role)) {
      router.push("/agent");
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

          // Fetch owner details using customer_id
          const customerId = foundBusiness.customer_id || foundBusiness.owner_id;
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
          try {
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
          } catch (err) {
            console.error('Failed to fetch owner credentials:', err);
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
          setError(lang === "zh" ? "未找到业务" : "Business not found");
        }
      }
    } catch (err) {
      console.error("Failed to fetch business details:", err);
      setError(lang === "zh" ? "加载失败" : "Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBusiness = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setBusiness(originalBusiness);
    setIsEditMode(false);
  };

  const handleSaveBusiness = async () => {
    if (!business) return;

    try {
      if (business.status !== originalBusiness?.status) {
        await axios.post(
          '/api/businesses/update',
          { token, id: business._id, status: business.status },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // TODO: persist the remaining editable fields (name, abn, etc.) - only
      // status is wired up to a real endpoint so far.
      setOriginalBusiness(business);
      setIsEditMode(false);
      showToast(
        lang === 'zh' ? '业务信息已更新' : 'Business information updated',
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

  const resetAddShopForm = () => {
    setNewShop({ name: '', location: '' });
    setAddShopError('');
  };

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
        // The owner card reads its email from the customer record, so keep it in
        // step - otherwise "Send Email" would still target the old address.
        setOwner((prev: any) => (prev ? { ...prev, email: response.data.data.email } : prev));
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
      router.push(`/admin/customers`);
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
    return status
      .replace(/_/g, ' ')
      .toUpperCase();
  };

  const formatShopLocation = (location: any) => {
    if (typeof location === 'string' && location.trim()) return location;
    return null;
  };

  if (authLoading) {
    return (
      <Container>
        <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
      </Container>
    );
  }

  if (!token || !isAdminRole(role)) {
    return null;
  }

  return (
    <MainLayout
      currentPage={lang === "zh" ? "业务详情" : "Business Details"}
      onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push('/admin/businesses')}>
            <span>←</span>
            {lang === "zh" ? "返回业务列表" : "Back to Businesses"}
          </BackButton>

          {isLoading ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : business ? (
            <>
              {/* Business Name Header */}
              <BusinessName>{business.name || 'N/A'}</BusinessName>
              {(business.suburb || business.state || business.address) && (
                <BusinessLocation>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {business.address && `${business.address}, `}
                  {business.suburb && `${business.suburb}`}
                  {business.state && `, ${business.state}`}
                  {business.postcode && ` ${business.postcode}`}
                </BusinessLocation>
              )}

              {/* Quick Actions Bar */}
              <QuickActionsBar>
                {!isEditMode ? (
                  <QuickActionButton $variant="primary" onClick={handleEditBusiness}>
                    <EditIcon />
                    {lang === "zh" ? "编辑业务" : "Edit Business"}
                  </QuickActionButton>
                ) : (
                  <QuickActionButton $variant="success" onClick={handleSaveBusiness}>
                    <SaveIcon />
                    {lang === "zh" ? "保存更改" : "Save Changes"}
                  </QuickActionButton>
                )}
                {owner && (
                  <QuickActionButton onClick={handleEmailOwner}>
                    <MailIcon />
                    {lang === "zh" ? "联系所有者" : "Contact Owner"}
                  </QuickActionButton>
                )}
              </QuickActionsBar>

              <TabContainer>
                <TabContent>
                  {/* Owner Information Card */}
                  {owner && (
                    <OwnerCard>
                      <OwnerName>
                        <UserIcon /> {lang === "zh" ? "业务所有者" : "Business Owner"}
                      </OwnerName>
                      <InfoGrid>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "姓名" : "Name"}</InfoLabel>
                          <InfoValue>{owner.name || 'N/A'}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "电话" : "Phone"}</InfoLabel>
                          <InfoValue>{owner.phone || 'N/A'}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "客户 ID" : "Customer ID"}</InfoLabel>
                          <InfoValue>{owner._id || 'N/A'}</InfoValue>
                        </InfoItem>
                      </InfoGrid>

                      {ownerCredentials && (
                        <CredentialsBox>
                          <CredentialsHeader>
                            <CredentialsTitle>
                              {lang === "zh" ? "登录信息" : "Login Credentials"}
                            </CredentialsTitle>
                            {!isEditingCredentials && (
                              <SmallButton onClick={handleStartEditCredentials}>
                                <EditIcon /> {lang === "zh" ? "编辑" : "Edit"}
                              </SmallButton>
                            )}
                          </CredentialsHeader>

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
                                <CredentialValue>
                                  {!ownerCredentials.email
                                    ? 'N/A'
                                    : showEmail
                                      ? ownerCredentials.email
                                      : MASKED_VALUE}
                                </CredentialValue>
                              )}
                            </CredentialInfo>
                            {!isEditingCredentials && (
                              <CredentialButtons>
                                <IconButton
                                  onClick={() => setShowEmail(!showEmail)}
                                  title={
                                    showEmail
                                      ? (lang === "zh" ? "隐藏邮箱" : "Hide email")
                                      : (lang === "zh" ? "显示邮箱" : "Show email")
                                  }
                                  aria-label={
                                    showEmail
                                      ? (lang === "zh" ? "隐藏邮箱" : "Hide email")
                                      : (lang === "zh" ? "显示邮箱" : "Show email")
                                  }
                                >
                                  {showEmail ? <EyeOffIcon /> : <EyeIcon />}
                                </IconButton>
                                <CopyButton onClick={() => handleCopyToClipboard(ownerCredentials.email, lang === "zh" ? "邮箱" : "Email")}>
                                  <CopyIcon /> {lang === "zh" ? "复制" : "Copy"}
                                </CopyButton>
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
                                <CopyButton onClick={() => handleCopyToClipboard(ownerCredentials.password, lang === "zh" ? "密码" : "Password")}>
                                  <CopyIcon /> {lang === "zh" ? "复制" : "Copy"}
                                </CopyButton>
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
                        </CredentialsBox>
                      )}

                      <OwnerActions>
                        <QuickActionButton onClick={handleEmailOwner}>
                          <MailIcon />
                          {lang === "zh" ? "发送邮件" : "Send Email"}
                        </QuickActionButton>
                        <QuickActionButton onClick={handleViewOwner}>
                          <UserIcon />
                          {lang === "zh" ? "查看客户资料" : "View Profile"}
                        </QuickActionButton>
                      </OwnerActions>
                    </OwnerCard>
                  )}

                  {/* Business Information Section */}
                  <CardTitle>{lang === "zh" ? "业务信息" : "Business Information"}</CardTitle>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "业务 ID" : "Business ID"}</InfoLabel>
                      <InfoValue>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span>{business._id}</span>
                          {(business.registrationId || business.registration_id) && (
                            <button
                              onClick={handleViewRegistration}
                              style={{
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.75rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              📋 {lang === "zh" ? "查看注册表单" : "View Form"}
                            </button>
                          )}
                        </div>
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "业务名称" : "Business Name"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.name || ''}
                          onChange={(e) => handleBusinessChange('name', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.name || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "ABN" : "ABN"}</InfoLabel>
                      {isEditMode ? (
                        <Input
                          value={business.abn || ''}
                          onChange={(e) => handleBusinessChange('abn', e.target.value)}
                        />
                      ) : (
                        <InfoValue>{business.abn || 'N/A'}</InfoValue>
                      )}
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>{lang === "zh" ? "状态" : "Status"}</InfoLabel>
                      {isEditMode ? (
                        <Select
                          value={business.status || ''}
                          onChange={(e) => handleBusinessChange('status', e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="setup">Setup</option>
                          <option value="in_setup">In Setup</option>
                          <option value="test">Test</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </Select>
                      ) : (
                        <StatusBadge $status={business.status || 'N/A'}>
                          {formatStatus(business.status || 'inactive')}
                        </StatusBadge>
                      )}
                    </InfoItem>
                  </InfoGrid>

                  {/* Shops Section */}
                  <SectionHeaderRow style={{ marginTop: '2rem' }}>
                    <CardTitle>
                      {lang === "zh" ? `店铺 (${shops.length})` : `Shops (${shops.length})`}
                    </CardTitle>
                    <AddShopButton onClick={() => { resetAddShopForm(); setShowAddShopModal(true); }}>
                      + {lang === "zh" ? "添加店铺" : "Add Shop"}
                    </AddShopButton>
                  </SectionHeaderRow>
                  {shops.length > 0 ? (
                    <PermissionList>
                      {shops.map((shop) => (
                        <PermissionCard
                          key={shop._id}
                          onClick={() => router.push(`/admin/businesses/${business._id}/shops/${shop._id}`)}
                        >
                          <ShopCardHeader>
                            <PermissionName style={{ marginBottom: 0 }}>{shop.store_name || shop.name || 'N/A'}</PermissionName>
                            {shop.status && (
                              <StatusBadge $status={shop.status}>
                                {formatStatus(shop.status)}
                              </StatusBadge>
                            )}
                          </ShopCardHeader>
                          <PermissionDetails>
                            {formatShopLocation(shop.location)
                              ? formatShopLocation(shop.location)
                              : (lang === "zh" ? "未设置地址" : "No address set")}
                            {shop.phone ? ` · ${shop.phone}` : ''}
                          </PermissionDetails>
                        </PermissionCard>
                      ))}
                    </PermissionList>
                  ) : (
                    <InfoValue>{lang === "zh" ? "暂无店铺" : "No shops linked to this business"}</InfoValue>
                  )}

                  {/* Edit Mode Actions */}
                  {isEditMode && (
                    <EditActions>
                      <EditButton $variant="save" onClick={handleSaveBusiness}>
                        <SaveIcon />
                        {lang === "zh" ? "保存更改" : "Save Changes"}
                      </EditButton>
                      <EditButton onClick={handleCancelEdit}>
                        {lang === "zh" ? "取消" : "Cancel"}
                      </EditButton>
                    </EditActions>
                  )}
                </TabContent>
              </TabContainer>
            </>
          ) : (
            <ErrorText>{lang === "zh" ? "未找到业务" : "Business not found"}</ErrorText>
          )}
        </MainContent>
      </Container>

      {/* Status Change Confirmation Modal */}
      <Modal $show={showStatusModal} onClick={() => setShowStatusModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "确认状态更改" : "Confirm Status Change"}</ModalTitle>
          <p style={{ marginBottom: '1.5rem', color: '#5c6b7a' }}>
            {lang === "zh"
              ? `确定要将业务状态更改为 "${newStatus}" 吗？`
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

      {/* Add Shop Modal */}
      <Modal $show={showAddShopModal} onClick={() => setShowAddShopModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "添加店铺" : "Add Shop"}</ModalTitle>

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
