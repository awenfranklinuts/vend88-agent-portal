"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import { getApiUrl, API_CONFIG } from "@/config/api";
import * as MockAPI from "@/lib/mockRegistrationApi";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0rem 2rem 2rem 2rem;
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

const GenerateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
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
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
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

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e7ef;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: ${p => p.$active ? 'rgba(26, 35, 126, 0.05)' : 'transparent'};
  color: ${p => p.$active ? '#1a237e' : '#5c6b7a'};
  font-size: 1rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background: rgba(26, 35, 126, 0.05);
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
  
  @media (max-width: 968px) {
    padding: 0.875rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const TabContent = styled.div`
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
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'submitted':
        return 'background: #dbeafe; color: #1e40af;';
      case 'approved':
        return 'background: #d1fae5; color: #065f46;';
      case 'rejected':
        return 'background: #fee2e2; color: #991b1b;';
      case 'expired':
        return 'background: #e5e7eb; color: #374151;';
      case 'cancelled':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const ActionButton = styled.button<{ $variant?: 'approve' | 'reject' | 'view' }>`
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
      case 'approve':
        return `
          background: #d1fae5;
          color: #065f46;
          &:hover { background: #a7f3d0; }
        `;
      case 'reject':
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
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  @media (max-width: 968px) {
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
    max-height: 95vh;
    border-radius: 12px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
  
  @media (max-width: 968px) {
    font-size: 1.25rem;
  }
`;

const ModalText = styled.p`
  color: #5c6b7a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const LinkBox = styled.div`
  background: #f7faff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
  margin-bottom: 1rem;
  word-break: break-all;
  font-family: monospace;
  font-size: 0.875rem;
  color: #1a237e;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
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
    &:hover {
      background: #d1d5db;
    }
  `}
  
  @media (max-width: 968px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #5c6b7a;
  padding: 4rem;
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 968px) {
    font-size: 1rem;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  
  @media (max-width: 968px) {
    font-size: 0.75rem;
  }
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #0a3655;
  line-height: 1.6;
  word-break: break-word;
  
  @media (max-width: 968px) {
    font-size: 0.9375rem;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e7ef;
  margin: 1.5rem 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  @media (max-width: 968px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
`;

const EditInput = styled.input`
  padding: 0.75rem;
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0a3655;
  background: white;
  transition: all 200ms ease;

  &:focus {
    outline: none;
    border-color: #2b7be3;
    box-shadow: 0 0 0 3px rgba(43,123,227,0.1);
  }
`;

const EditTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0a3655;
  background: white;
  resize: vertical;
  font-family: inherit;
  transition: all 200ms ease;

  &:focus {
    outline: none;
    border-color: #2b7be3;
    box-shadow: 0 0 0 3px rgba(43,123,227,0.1);
  }
`;

const EditSelect = styled.select`
  padding: 0.75rem;
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 200ms ease;

  &:focus {
    outline: none;
    border-color: #2b7be3;
    box-shadow: 0 0 0 3px rgba(43,123,227,0.1);
  }
`;

const FileDownloadLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(43,123,227,0.05);
  border: 1px solid rgba(43,123,227,0.15);
  border-radius: 8px;
  margin-top: 0.5rem;
  color: #1e40af;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background: rgba(43,123,227,0.1);
    border-color: rgba(43,123,227,0.25);
    transform: translateX(2px);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const FileName = styled.span`
  font-weight: 500;
  font-size: 0.9375rem;
`;

const FileMetadata = styled.span`
  font-size: 0.75rem;
  color: #5c6b7a;
  margin-left: 0.5rem;
`;

const DownloadButton = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(43,123,227,0.1);
  }
`;

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

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

interface Registration {
  id: string;
  token: string;
  generatedBy: string;
  generatedAt: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  linkedCustomerId?: string;
  // Contact Information
  contactEmail?: string;
  ownerName?: string;
  contactPhone?: string;
  messagingAppType?: string;
  messagingAppId?: string;
  // Business Information
  quoteNumber?: string;
  businessName?: string;
  abn?: string;
  // Registered Address
  registeredAddress?: string;
  registeredSuburb?: string;
  registeredPostcode?: string;
  registeredState?: string;
  registeredCountry?: string;
  // Payment & Integration
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  // Additional Information
  readyBy?: string;
  heardAbout?: string;
  heardOther?: string;
  menuFiles?: (string | { filename: string; url: string; size?: number; uploadedAt?: string })[];
  menuSendLater?: boolean;
  notes?: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export default function RegistrationsPage() {
  const router = useRouter();
  const { token, role, isLoading, customers: authCustomers, fetchCustomers: fetchCustomersFromAuth, userEmail, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'all'>('submitted');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRegistration, setEditedRegistration] = useState<Registration | null>(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  // Track whether the registrations data is currently being fetched
  const [isDataLoading, setIsDataLoading] = useState(false);
  // Track whether we've completed the initial registrations fetch
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('all'); // all, NSW, VIC, QLD, etc.
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  // Fetch registrations from API (currently using mock data)
  useEffect(() => {
    if (token) {
      fetchRegistrationData();
      fetchCustomers();
    }
  }, [token]);

  // Sync customers from auth context
  useEffect(() => {
    if (authCustomers) {
      setCustomers(authCustomers);
    }
  }, [authCustomers]);

  // Check if returning from customer creation
  useEffect(() => {
    const returnToRegId = sessionStorage.getItem('returnToRegistration');
    const newCustomerId = sessionStorage.getItem('newCustomerId');
    
    if (returnToRegId && newCustomerId && selectedRegistration?.id === returnToRegId) {
      // Auto-select the newly created customer
      setSelectedCustomerId(newCustomerId);
      handleLinkCustomer();
      // Clear session storage
      sessionStorage.removeItem('returnToRegistration');
      sessionStorage.removeItem('newCustomerId');
      sessionStorage.removeItem('registrationData');
    }
  }, [selectedRegistration, customers]);

  const fetchRegistrationData = async () => {
    setIsDataLoading(true);
    try {
      // Always fetch all registrations, filter in UI
      const response = await MockAPI.fetchRegistrations({
        status: 'all',
      });

      if (response.success && response.data) {
        setAllRegistrations(response.data.registrations);
        setRegistrations(response.data.registrations);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setIsDataLoading(false);
      setHasFetched(true);
    }
  };

  const fetchCustomers = async () => {
    try {
      if (fetchCustomersFromAuth) {
        await fetchCustomersFromAuth();
      }
      setCustomers(authCustomers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleLinkCustomer = async () => {
    if (!selectedCustomerId) {
      alert(lang === 'zh' ? '请选择一个客户' : 'Please select a customer');
      return;
    }
    
    if (editedRegistration) {
      handleEditChange('linkedCustomerId', selectedCustomerId);
      alert(lang === 'zh' ? '客户已关联' : 'Customer linked successfully');
    }
  };

  const handleCreateAndLinkCustomer = () => {
    if (!selectedRegistration) return;
    
    // Create a temporary customer entry in the search field
    const tempCustomerDisplay = `${selectedRegistration.ownerName || 'New Customer'} - ${selectedRegistration.contactEmail || ''}`;
    setCustomerSearchQuery(tempCustomerDisplay);
    
    // Generate a temporary customer ID (will be replaced with real ID after API call)
    const tempCustomerId = `temp_${Date.now()}`;
    
    // Store pending customer data
    sessionStorage.setItem('pendingCustomer', JSON.stringify({
      tempId: tempCustomerId,
      registrationId: selectedRegistration.id,
      name: selectedRegistration.ownerName,
      email: selectedRegistration.contactEmail,
      phone: selectedRegistration.contactPhone
    }));
    
    // Show the customer as "pending creation"
    alert(lang === 'zh' 
      ? `将为 ${selectedRegistration.ownerName || 'New Customer'} 创建新客户账号\n邮箱: ${selectedRegistration.contactEmail}\n\n批准后将自动创建客户账号。`
      : `New customer will be created for ${selectedRegistration.ownerName || 'New Customer'}\nEmail: ${selectedRegistration.contactEmail}\n\nCustomer account will be created automatically upon approval.`
    );
    
    // Set as selected (temporary)
    setSelectedCustomerId(tempCustomerId);
    handleEditChange('linkedCustomerId', tempCustomerId);
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setEditedRegistration(registration);
    setIsEditMode(false);
    setSelectedCustomerId(registration.linkedCustomerId || '');
    setCustomerSearchQuery('');
    setShowDetailsModal(true);
  };

  const handleEditChange = (field: keyof Registration, value: any) => {
    if (editedRegistration) {
      setEditedRegistration({
        ...editedRegistration,
        [field]: value
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editedRegistration) {
      try {
        // TODO: Replace with real API call when ready
        // const response = await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_UPDATE.replace(':id', editedRegistration.id)), editedRegistration);
        const response = await MockAPI.updateRegistration(editedRegistration.id, editedRegistration);
        
        if (response.success && response.data) {
          setSelectedRegistration(response.data);
          setIsEditMode(false);
          // Refresh the list
          fetchRegistrationData();
          alert(lang === 'zh' ? '保存成功！' : 'Saved successfully!');
        } else {
          alert(response.error || 'Failed to save');
        }
      } catch (error) {
        console.error('Failed to save registration:', error);
        alert('Failed to save. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedRegistration(selectedRegistration);
    setIsEditMode(false);
  };

  const handleGenerateForm = async () => {
    setIsGenerating(true);
    try {
      // Real API integration
      const adminEmail = adminProfile?.email || userEmail || 'admin@vend88.com';
      // Use API proxy to avoid CORS issues
      const apiUrl = '/api/registration/generate';
      
      console.log('=== Generate Form Request ===');
      console.log('API URL:', apiUrl);
      console.log('Admin Email:', adminEmail);
      console.log('Token exists:', !!token);
      console.log('Token preview:', token?.substring(0, 20) + '...');

      const response = await axios.post(
        apiUrl,
        { 
          admin_email: adminEmail
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      console.log('=== Generate Form Response ===');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data.success && response.data.data) {
        setGeneratedLink(response.data.data.link);
        setShowGenerateModal(true);
        // Refresh the list
        fetchRegistrationData();
        console.log('✅ Registration form generated successfully');
      } else {
        console.error('❌ Response indicates failure:', response.data);
        const errorMessage = response.data.error || response.data.message || 'Failed to generate form';
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('=== Generate Form Error ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message
        || 'Failed to generate form. Please try again.';
      
      alert(`Failed to generate form: ${errorMessage}\n\nCheck browser console (F12) for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    // TODO: Show success toast
    alert('Link copied to clipboard!');
  };

  const handleApprove = async (id: string) => {
    // Check if customer is linked when approving from details modal (only when viewing in modal)
    if (selectedRegistration?.id === id && showDetailsModal && !selectedCustomerId) {
      alert(lang === 'zh' ? '请先关联客户后再批准' : 'Please link a customer before approving');
      return;
    }
    
    if (confirm(lang === 'zh' ? '确定要批准此注册吗？' : 'Are you sure you want to approve this registration?')) {
      try {
        // Save the linked customer ID before approving
        const linkedCustomer = selectedCustomerId;

        if (token) {
          // Use real API: ensure customer is linked first
          const adminEmail = adminProfile?.email || userEmail || 'admin@vend88.com';

          if (linkedCustomer) {
            try {
              if (linkedCustomer.startsWith('temp_')) {
                // Create new customer via link-customer endpoint
                await axios.put(
                  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_LINK.replace(':id', id)),
                  {
                    create_new: true,
                    customer_data: {
                      name: selectedRegistration?.ownerName,
                      email: selectedRegistration?.contactEmail,
                      phone: selectedRegistration?.contactPhone,
                    }
                  },
                  { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
                );
              } else {
                // Link existing customer
                await axios.put(
                  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_LINK.replace(':id', id)),
                  { customer_id: linkedCustomer },
                  { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
                );
              }
            } catch (err) {
              console.error('Failed to link customer before approval:', err);
              alert('Failed to link customer. Please try again.');
              return;
            }
          }

          // Call approve endpoint
          try {
            const response = await axios.post(
              getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_APPROVE.replace(':id', id)),
              { approval_notes: '' },
              { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
            );

            if (response.data && response.data.success) {
              // Refresh the list
              fetchRegistrationData();
              alert(lang === 'zh' ? '批准成功！' : 'Approved successfully!');
              if (selectedRegistration?.id === id) setShowDetailsModal(false);
            } else {
              alert(response.data?.error || 'Failed to approve');
            }
          } catch (err) {
            console.error('Failed to approve via API:', err);
            alert('Failed to approve. Please try again.');
          }
        } else {
          // Fallback to mock API for local dev
          const response = await MockAPI.approveRegistration(id, adminProfile?.email || userEmail || 'admin@vend88.com');

          if (response.success) {
            // Update the registration with linked customer ID
            if (linkedCustomer && response.data) {
              const updateResponse = await MockAPI.updateRegistration(id, { 
                linkedCustomerId: linkedCustomer 
              } as Partial<Registration>);
              if (updateResponse.success && updateResponse.data) {
                setSelectedRegistration(updateResponse.data);
                setEditedRegistration(updateResponse.data);
              }
            }

            // Refresh the list
            fetchRegistrationData();
            alert(lang === 'zh' ? '批准成功！' : 'Approved successfully!');
            // Close details modal if open
            if (selectedRegistration?.id === id) {
              setShowDetailsModal(false);
            }
          } else {
            alert(response.error || 'Failed to approve');
          }
        }
      } catch (error) {
        console.error('Failed to approve registration:', error);
        alert('Failed to approve. Please try again.');
      }
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt(lang === 'zh' ? '请输入拒绝原因（可选）：' : 'Enter rejection reason (optional):');
    
    if (reason !== null) { // User didn't cancel
      try {
        // TODO: Replace with real API call when ready
        // const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REJECT.replace(':id', id)), { reason });
        const response = await MockAPI.rejectRegistration(id, reason || undefined, 'admin@vend88.com');
        
        if (response.success) {
          // Refresh the list
          fetchRegistrationData();
          alert(lang === 'zh' ? '已拒绝！' : 'Rejected successfully!');
          // Close details modal if open
          if (selectedRegistration?.id === id) {
            setShowDetailsModal(false);
          }
        } else {
          alert(response.error || 'Failed to reject');
        }
      } catch (error) {
        console.error('Failed to reject registration:', error);
        alert('Failed to reject. Please try again.');
      }
    }
  };

  const handleRevoke = async (id: string) => {
    if (confirm(lang === 'zh' ? '确定要撤销此注册链接吗？撤销后该链接将无法使用。' : 'Are you sure you want to revoke this registration link? Once revoked, the link cannot be used.')) {
      try {
        // TODO: Replace with real API call when ready
        // const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REVOKE.replace(':id', id)));
        const response = await MockAPI.revokeRegistration(id, 'admin@vend88.com');
        
        if (response.success) {
          // Refresh the list
          fetchRegistrationData();
          alert(lang === 'zh' ? '已撤销！' : 'Revoked successfully!');
          // Close details modal if open
          if (selectedRegistration?.id === id) {
            setShowDetailsModal(false);
          }
        } else {
          alert(response.error || 'Failed to revoke');
        }
      } catch (error) {
        console.error('Failed to revoke registration:', error);
        alert('Failed to revoke. Please try again.');
      }
    }
  };

  const filteredRegistrations = allRegistrations.filter(reg => {
    // Filter by tab status
    if (activeTab === 'pending' && reg.status !== 'pending') return false;
    if (activeTab === 'submitted' && reg.status !== 'submitted') return false;
    
    // Filter by state
    if (filterState !== 'all' && reg.registeredState !== filterState) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesBusinessName = reg.businessName?.toLowerCase().includes(query);
      const matchesEmail = reg.contactEmail?.toLowerCase().includes(query);
      const matchesOwner = reg.ownerName?.toLowerCase().includes(query);
      const matchesPhone = reg.contactPhone?.toLowerCase().includes(query);
      const matchesABN = reg.abn?.toLowerCase().includes(query);
      
      if (!matchesBusinessName && !matchesEmail && !matchesOwner && !matchesPhone && !matchesABN) {
        return false;
      }
    }
    
    return true;
  });

  // If auth is loading show a full-page loader to avoid flashing before redirect.
  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (!token || role !== "admin") {
    return null;
  }

  return (
    <MainLayout currentPage={lang === "zh" ? "注册管理" : "Registration Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <HeaderLeft>
              <PageTitle>{lang === "zh" ? "注册管理" : "Registration Management"}</PageTitle>
              <PageDescription>
                {lang === "zh"
                  ? "生成注册表单并管理客户注册审批"
                  : "Generate registration forms and manage customer approvals"}
              </PageDescription>
            </HeaderLeft>
            <GenerateButton onClick={handleGenerateForm} disabled={isGenerating}>
              <PlusIcon />
              {isGenerating 
                ? (lang === "zh" ? "生成中..." : "Generating...") 
                : (lang === "zh" ? "生成新表单" : "Generate New Form")}
            </GenerateButton>
          </ContentHeader>

          <SearchFilterContainer>
            <SearchInput
              type="text"
              placeholder={lang === "zh" ? "搜索业务名称、邮箱、联系人、电话或ABN..." : "Search business name, email, contact, phone or ABN..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            {(searchQuery || filterState !== 'all') && (
              <ClearButton onClick={() => { setSearchQuery(''); setFilterState('all'); }}>
                {lang === "zh" ? "清除" : "Clear"}
              </ClearButton>
            )}
          </SearchFilterContainer>

          <TabContainer>
            <TabButtons>
              <TabButton $active={activeTab === 'submitted'} onClick={() => setActiveTab('submitted')}>
                {lang === "zh" ? "待审批" : "Pending Approval"} ({allRegistrations.filter(r => r.status === 'submitted').length})
              </TabButton>
              <TabButton $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                {lang === "zh" ? "未填写" : "Not Filled"} ({allRegistrations.filter(r => r.status === 'pending').length})
              </TabButton>
              <TabButton $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                {lang === "zh" ? "全部" : "All"} ({allRegistrations.length})
              </TabButton>
            </TabButtons>

            <TabContent>
              {(!hasFetched || isDataLoading) ? (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{lang === "zh" ? "业务名称" : "Business Name"}</Th>
                      <Th>{lang === "zh" ? "联系邮箱" : "Contact Email"}</Th>
                      <Th>{lang === "zh" ? "生成时间" : "Generated"}</Th>
                      <Th>{lang === "zh" ? "状态" : "Status"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Tr key={`skeleton-${i}`}>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 16, width: '60%', borderRadius: 8 }} />
                        </Td>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 16, width: '75%', borderRadius: 8 }} />
                        </Td>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 16, width: '40%', borderRadius: 8 }} />
                        </Td>
                        <Td>
                          <div style={{ background: '#e9eef6', height: 24, width: 96, borderRadius: 12 }} />
                        </Td>
                        <Td>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ background: '#e9eef6', height: 32, width: 72, borderRadius: 8 }} />
                            <div style={{ background: '#e9eef6', height: 32, width: 72, borderRadius: 8 }} />
                            <div style={{ background: '#e9eef6', height: 32, width: 72, borderRadius: 8 }} />
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : filteredRegistrations.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>📋</EmptyIcon>
                  <EmptyText>{lang === "zh" ? "暂无记录" : "No records found"}</EmptyText>
                  <EmptySubtext>
                    {activeTab === 'submitted' && (lang === "zh" ? "没有待审批的注册" : "No registrations pending approval")}
                    {activeTab === 'pending' && (lang === "zh" ? "没有未填写的表单" : "No unfilled forms")}
                    {activeTab === 'all' && (lang === "zh" ? "点击上方按钮生成新表单" : "Click the button above to generate a new form")}
                  </EmptySubtext>
                </EmptyState>
              ) : (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{lang === "zh" ? "业务名称" : "Business Name"}</Th>
                      <Th>{lang === "zh" ? "联系邮箱" : "Contact Email"}</Th>
                      <Th>{lang === "zh" ? "生成时间" : "Generated"}</Th>
                      <Th>{lang === "zh" ? "状态" : "Status"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRegistrations.map(reg => (
                      <Tr key={reg.id}>
                        <Td>{reg.businessName || '-'}</Td>
                        <Td>{reg.contactEmail || '-'}</Td>
                        <Td>{new Date(reg.generatedAt).toLocaleDateString()}</Td>
                        <Td>
                          <StatusBadge $status={reg.status}>
                            {reg.status}
                          </StatusBadge>
                        </Td>
                        <Td>
                          {reg.status === 'submitted' && (
                            <>
                              <ActionButton $variant="view" onClick={() => handleViewDetails(reg)}>
                                {lang === "zh" ? "查看" : "View"}
                              </ActionButton>
                              <ActionButton $variant="approve" onClick={() => handleApprove(reg.id)}>
                                {lang === "zh" ? "批准" : "Approve"}
                              </ActionButton>
                              <ActionButton $variant="reject" onClick={() => handleReject(reg.id)}>
                                {lang === "zh" ? "拒绝" : "Reject"}
                              </ActionButton>
                            </>
                          )}
                          {reg.status === 'pending' && (
                            <>
                              <ActionButton $variant="view">
                                {lang === "zh" ? "复制链接" : "Copy Link"}
                              </ActionButton>
                              <ActionButton $variant="reject" onClick={() => handleRevoke(reg.id)}>
                                {lang === "zh" ? "撤销链接" : "Revoke Link"}
                              </ActionButton>
                            </>
                          )}
                          {reg.status === 'approved' && (
                            <ActionButton $variant="view" onClick={() => handleViewDetails(reg)}>
                              {lang === "zh" ? "查看" : "View"}
                            </ActionButton>
                          )}
                          {reg.status === 'rejected' && (
                            <>
                              <ActionButton $variant="view" onClick={() => handleViewDetails(reg)}>
                                {lang === "zh" ? "查看" : "View"}
                              </ActionButton>
                              <ActionButton $variant="approve" onClick={() => handleApprove(reg.id)}>
                                {lang === "zh" ? "批准" : "Approve"}
                              </ActionButton>
                            </>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabContent>
          </TabContainer>
        </MainContent>
      </Container>

      <Modal $show={showGenerateModal} onClick={() => setShowGenerateModal(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "表单生成成功" : "Form Generated Successfully"}</ModalTitle>
          <ModalText>
            {lang === "zh" 
              ? "请将以下链接发送给客户。此链接仅可使用一次。"
              : "Send the following link to your customer. This link can only be used once."}
          </ModalText>
          <LinkBox>{generatedLink}</LinkBox>
          <ModalActions>
            <ModalButton onClick={() => setShowGenerateModal(false)}>
              {lang === "zh" ? "关闭" : "Close"}
            </ModalButton>
            <ModalButton $primary onClick={handleCopyLink}>
              <CopyIcon />
              {lang === "zh" ? "复制链接" : "Copy Link"}
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      <Modal $show={showDetailsModal} onClick={() => setShowDetailsModal(false)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <ModalTitle style={{ margin: 0 }}>{lang === "zh" ? "注册详情" : "Registration Details"}</ModalTitle>
            {!isEditMode && (
              <EditButton onClick={() => setIsEditMode(true)}>
                <EditIcon />
                {lang === "zh" ? "编辑" : "Edit"}
              </EditButton>
            )}
          </div>
          
          {selectedRegistration && editedRegistration && (
            <>
              <SectionTitle>{lang === "zh" ? "📧 联系信息" : "📧 Contact Information"}</SectionTitle>
              
              <DetailSection>
                <DetailLabel>{lang === "zh" ? "联系邮箱" : "Contact Email"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    type="email"
                    value={editedRegistration.contactEmail || ''}
                    onChange={(e) => handleEditChange('contactEmail', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.contactEmail || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "全名" : "Full Name"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.ownerName || ''}
                    onChange={(e) => handleEditChange('ownerName', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.ownerName || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "联系电话" : "Contact Phone"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    type="tel"
                    value={editedRegistration.contactPhone || ''}
                    onChange={(e) => handleEditChange('contactPhone', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.contactPhone || '-'}</DetailValue>
                )}
              </DetailSection>

              {(selectedRegistration.messagingAppType || isEditMode) && (
                <DetailSection>
                  <DetailLabel>
                    {lang === "zh" ? "即时通讯" : "Messaging App"}
                  </DetailLabel>
                  {isEditMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <EditSelect 
                        value={editedRegistration.messagingAppType || ''}
                        onChange={(e) => handleEditChange('messagingAppType', e.target.value)}
                      >
                        <option value="">{lang === "zh" ? "-- 选择应用 --" : "-- Select app --"}</option>
                        <option value="wechat">{lang === "zh" ? "微信号" : "WeChat ID"}</option>
                        <option value="whatsapp">{lang === "zh" ? "WhatsApp 号码" : "WhatsApp Number"}</option>
                      </EditSelect>
                      {editedRegistration.messagingAppType && (
                        <EditInput 
                          value={editedRegistration.messagingAppId || ''}
                          onChange={(e) => handleEditChange('messagingAppId', e.target.value)}
                          placeholder={editedRegistration.messagingAppType === 'wechat' 
                            ? (lang === "zh" ? "输入微信号" : "Enter WeChat ID")
                            : (lang === "zh" ? "输入 WhatsApp 号码" : "Enter WhatsApp number")
                          }
                        />
                      )}
                    </div>
                  ) : (
                    <DetailValue>
                      {selectedRegistration.messagingAppType === 'wechat' ? 'WeChat' : 'WhatsApp'}: {selectedRegistration.messagingAppId}
                    </DetailValue>
                  )}
                </DetailSection>
              )}

              <DetailSection>
                <DetailLabel style={{ color: '#991b1b', display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>*</span>
                    {lang === "zh" ? "关联客户（必填）" : "Link to Customer (Required)"}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    fontWeight: 500,
                    textTransform: 'none',
                    letterSpacing: '0',
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    {lang === "zh" ? "仅供内部使用 - 不会显示给客户" : "Internal Use Only - Not visible to customer"}
                  </div>
                </DetailLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {selectedCustomerId ? (
                    // Show selected customer with option to change
                    <div style={{ 
                      padding: '0.75rem',
                      border: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '1.5px solid #fbbf24' : '1.5px solid #d1fae5',
                      borderRadius: '8px',
                      background: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '#fffbeb' : '#f0fdf4',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          color: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '#92400e' : '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {selectedCustomerId.startsWith('temp_') ? (
                            <>
                              {selectedRegistration?.status !== 'approved' && <span>⚠️</span>}
                              <span>{selectedRegistration?.ownerName || 'New Customer'}</span>
                              {selectedRegistration?.status !== 'approved' && (
                                <span style={{ 
                                  fontSize: '0.75rem', 
                                  fontWeight: 500,
                                  background: '#f59e0b',
                                  color: 'white',
                                  padding: '0.125rem 0.5rem',
                                  borderRadius: '4px'
                                }}>
                                  {lang === "zh" ? "待创建" : "Pending"}
                                </span>
                              )}
                            </>
                          ) : (
                            customers.find((c: any) => c._id === selectedCustomerId)?.name || 'Selected Customer'
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: selectedCustomerId.startsWith('temp_') && selectedRegistration?.status !== 'approved' ? '#b45309' : '#059669'
                        }}>
                          {selectedCustomerId.startsWith('temp_') 
                            ? selectedRegistration?.contactEmail || ''
                            : customers.find((c: any) => c._id === selectedCustomerId)?.email || ''
                          }
                        </div>
                        {selectedCustomerId.startsWith('temp_') ? (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: selectedRegistration?.status === 'approved' ? '#065f46' : '#92400e',
                            marginTop: '0.25rem',
                            fontStyle: 'italic'
                          }}>
                            {selectedRegistration?.status === 'approved' 
                              ? (lang === "zh" ? "✓ 新客户账号已创建" : "✓ New customer account created")
                              : (lang === "zh" ? "批准后将自动创建此客户账号" : "Customer account will be created upon approval")
                            }
                          </div>
                        ) : selectedRegistration?.status === 'approved' && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#065f46',
                            marginTop: '0.25rem',
                            fontStyle: 'italic'
                          }}>
                            {lang === "zh" ? "✓ 已关联到现有客户" : "✓ Linked to existing customer"}
                          </div>
                        )}
                      </div>
                      <ActionButton onClick={() => {
                        setSelectedCustomerId('');
                        setCustomerSearchQuery('');
                        if (selectedCustomerId.startsWith('temp_')) {
                          sessionStorage.removeItem('pendingCustomer');
                        }
                      }} style={{ margin: 0 }}>
                        {lang === "zh" ? "更改" : "Change"}
                      </ActionButton>
                    </div>
                  ) : (
                    <>
                      {/* Search bar with button on the right */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <EditInput
                            type="text"
                            placeholder={lang === "zh" ? "搜索客户名称或邮箱..." : "Search customer name or email..."}
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            style={{ 
                              borderColor: !selectedCustomerId ? '#fca5a5' : undefined,
                              paddingRight: '2.5rem',
                              width: '100%'
                            }}
                          />
                          <svg 
                            style={{ 
                              position: 'absolute', 
                              right: '0.75rem', 
                              top: '0.75rem',
                              pointerEvents: 'none',
                              opacity: 0.5
                            }} 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                          </svg>
                          {customerSearchQuery && (
                            <div style={{
                              position: 'absolute',
                              top: 'calc(100% + 0.25rem)',
                              left: 0,
                              right: 0,
                              background: 'white',
                              border: '1.5px solid #e0e7ef',
                              borderRadius: '8px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              zIndex: 10
                            }}>
                              {customers
                                .filter((customer: any) => {
                                  const searchLower = customerSearchQuery.toLowerCase();
                                  return customer.name?.toLowerCase().includes(searchLower) ||
                                         customer.email?.toLowerCase().includes(searchLower);
                                })
                                .slice(0, 10)
                                .map((customer: any) => (
                                  <div
                                    key={customer._id}
                                    onClick={() => {
                                      setSelectedCustomerId(customer._id);
                                      setCustomerSearchQuery('');
                                      handleLinkCustomer();
                                    }}
                                    style={{
                                      padding: '0.75rem',
                                      cursor: 'pointer',
                                      borderBottom: '1px solid #f0f0f0',
                                      transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7faff'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                  >
                                    <div style={{ fontWeight: 600, color: '#0a3655' }}>{customer.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#5c6b7a' }}>{customer.email}</div>
                                  </div>
                                ))}
                              {customers.filter((customer: any) => {
                                const searchLower = customerSearchQuery.toLowerCase();
                                return customer.name?.toLowerCase().includes(searchLower) ||
                                       customer.email?.toLowerCase().includes(searchLower);
                              }).length === 0 && (
                                <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
                                  {lang === "zh" ? "未找到客户" : "No customers found"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <ActionButton 
                          onClick={handleCreateAndLinkCustomer} 
                          style={{ 
                            margin: 0,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem'
                          }}
                        >
                          <PlusIcon />
                          {lang === "zh" ? "创建新客户" : "Create New"}
                        </ActionButton>
                      </div>
                      {!selectedCustomerId && (
                        <div style={{ fontSize: '0.8125rem', color: '#991b1b', marginTop: '-0.5rem' }}>
                          {lang === "zh" ? "* 批准前必须关联客户" : "* Must link customer before approval"}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "🏢 商业信息" : "🏢 Business Information"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "报价单/发票号码" : "Quote/Invoice Number"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.quoteNumber || ''}
                    onChange={(e) => handleEditChange('quoteNumber', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.quoteNumber || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "公司交易名称" : "Business Trading Name"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.businessName || ''}
                    onChange={(e) => handleEditChange('businessName', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.businessName || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "ABN" : "ABN"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.abn || ''}
                    onChange={(e) => handleEditChange('abn', e.target.value)}
                    maxLength={11}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.abn || '-'}</DetailValue>
                )}
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "📍 注册地址" : "📍 Registered Address"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "街道地址" : "Street Address"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.registeredAddress || ''}
                    onChange={(e) => handleEditChange('registeredAddress', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.registeredAddress || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "城市/郊区" : "City/Suburb"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.registeredSuburb || ''}
                    onChange={(e) => handleEditChange('registeredSuburb', e.target.value)}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.registeredSuburb || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "邮政编码" : "Postcode"}</DetailLabel>
                {isEditMode ? (
                  <EditInput 
                    value={editedRegistration.registeredPostcode || ''}
                    onChange={(e) => handleEditChange('registeredPostcode', e.target.value)}
                    maxLength={4}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.registeredPostcode || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "州/领地" : "State/Territory"}</DetailLabel>
                {isEditMode ? (
                  <EditSelect 
                    value={editedRegistration.registeredState || ''}
                    onChange={(e) => handleEditChange('registeredState', e.target.value)}
                  >
                    <option value="">{lang === "zh" ? "-- 选择 --" : "-- Select --"}</option>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="WA">WA</option>
                    <option value="SA">SA</option>
                    <option value="TAS">TAS</option>
                    <option value="ACT">ACT</option>
                    <option value="NT">NT</option>
                  </EditSelect>
                ) : (
                  <DetailValue>{selectedRegistration.registeredState || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "国家" : "Country"}</DetailLabel>
                {isEditMode ? (
                  <EditSelect 
                    value={editedRegistration.registeredCountry || 'Australia'}
                    onChange={(e) => handleEditChange('registeredCountry', e.target.value)}
                  >
                    <option value="Australia">Australia</option>
                  </EditSelect>
                ) : (
                  <DetailValue>{selectedRegistration.registeredCountry || '-'}</DetailValue>
                )}
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "💳 支付与集成" : "💳 Payment & Integration"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "EFTPOS 集成" : "EFTPOS Integration"}</DetailLabel>
                {isEditMode ? (
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input 
                        type="radio"
                        checked={editedRegistration.eftposIntegration === 'yes'}
                        onChange={() => handleEditChange('eftposIntegration', 'yes')}
                      />
                      {lang === "zh" ? "是" : "Yes"}
                    </label>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input 
                        type="radio"
                        checked={editedRegistration.eftposIntegration === 'no'}
                        onChange={() => handleEditChange('eftposIntegration', 'no')}
                      />
                      {lang === "zh" ? "否" : "No"}
                    </label>
                  </div>
                ) : (
                  <DetailValue>
                    {selectedRegistration.eftposIntegration === 'yes' 
                      ? (lang === "zh" ? "是" : "Yes") 
                      : selectedRegistration.eftposIntegration === 'no'
                      ? (lang === "zh" ? "否" : "No")
                      : '-'}
                  </DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "支付宝/微信支付" : "Alipay/WeChat Pay"}</DetailLabel>
                {isEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <EditSelect 
                      value={editedRegistration.alipayOption || ''}
                      onChange={(e) => handleEditChange('alipayOption', e.target.value)}
                    >
                      <option value="">{lang === "zh" ? "-- 选择 --" : "-- Select --"}</option>
                      <option value="open">{lang === "zh" ? "开通" : "Open Account"}</option>
                      <option value="not-interested">{lang === "zh" ? "不感兴趣" : "Not Interested"}</option>
                      <option value="superpay">Superpay</option>
                      <option value="royalpay">Royalpay</option>
                      <option value="other">{lang === "zh" ? "其他" : "Other"}</option>
                    </EditSelect>
                    {editedRegistration.alipayOption === 'other' && (
                      <EditInput 
                        value={editedRegistration.alipayOther || ''}
                        onChange={(e) => handleEditChange('alipayOther', e.target.value)}
                        placeholder={lang === "zh" ? "请描述" : "Please describe"}
                      />
                    )}
                  </div>
                ) : (
                  <DetailValue>
                    {selectedRegistration.alipayOption === 'open' && (lang === "zh" ? "开通" : "Open Account")}
                    {selectedRegistration.alipayOption === 'not-interested' && (lang === "zh" ? "不感兴趣" : "Not Interested")}
                    {selectedRegistration.alipayOption === 'superpay' && "Superpay"}
                    {selectedRegistration.alipayOption === 'royalpay' && "Royalpay"}
                    {selectedRegistration.alipayOption === 'other' && `${lang === "zh" ? "其他" : "Other"}: ${selectedRegistration.alipayOther || ''}`}
                    {!selectedRegistration.alipayOption && '-'}
                  </DetailValue>
                )}
              </DetailSection>

              <Divider />

              <SectionTitle>{lang === "zh" ? "📋 附加信息" : "📋 Additional Information"}</SectionTitle>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "预期部署时间" : "Expected Deployment"}</DetailLabel>
                {isEditMode ? (
                  <EditTextarea 
                    value={editedRegistration.readyBy || ''}
                    onChange={(e) => handleEditChange('readyBy', e.target.value)}
                    rows={2}
                  />
                ) : (
                  <DetailValue>{selectedRegistration.readyBy || '-'}</DetailValue>
                )}
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "如何了解我们" : "How Did You Hear About Us"}</DetailLabel>
                {isEditMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <EditSelect 
                      value={editedRegistration.heardAbout || ''}
                      onChange={(e) => handleEditChange('heardAbout', e.target.value)}
                    >
                      <option value="">{lang === "zh" ? "-- 选择 --" : "-- Select --"}</option>
                      <option value="friend">{lang === "zh" ? "朋友推荐" : "Friend Referral"}</option>
                      <option value="google">Google</option>
                      <option value="wechat">{lang === "zh" ? "微信" : "WeChat"}</option>
                      <option value="saw">{lang === "zh" ? "看到使用" : "Saw in Use"}</option>
                      <option value="other">{lang === "zh" ? "其他" : "Other"}</option>
                    </EditSelect>
                    {editedRegistration.heardAbout === 'other' && (
                      <EditInput 
                        value={editedRegistration.heardOther || ''}
                        onChange={(e) => handleEditChange('heardOther', e.target.value)}
                        placeholder={lang === "zh" ? "请描述" : "Please describe"}
                      />
                    )}
                  </div>
                ) : (
                  <DetailValue>
                    {selectedRegistration.heardAbout === 'friend' && (lang === "zh" ? "朋友推荐" : "Friend Referral")}
                    {selectedRegistration.heardAbout === 'google' && "Google"}
                    {selectedRegistration.heardAbout === 'wechat' && (lang === "zh" ? "微信" : "WeChat")}
                    {selectedRegistration.heardAbout === 'saw' && (lang === "zh" ? "看到使用" : "Saw in Use")}
                    {selectedRegistration.heardAbout === 'other' && `${lang === "zh" ? "其他" : "Other"}: ${selectedRegistration.heardOther || ''}`}
                    {!selectedRegistration.heardAbout && '-'}
                  </DetailValue>
                )}
              </DetailSection>

              {selectedRegistration.menuFiles && selectedRegistration.menuFiles.length > 0 && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "菜单文件" : "Menu Files"}</DetailLabel>
                  <DetailValue>
                    {selectedRegistration.menuFiles.map((file, idx) => {
                      // Handle both old string format and new object format
                      if (typeof file === 'string') {
                        return (
                          <div key={idx} style={{ padding: '0.5rem', background: 'rgba(43,123,227,0.05)', borderRadius: '4px', marginTop: idx > 0 ? '0.5rem' : 0 }}>
                            📄 {file}
                          </div>
                        );
                      }
                      
                      // New downloadable file format
                      return (
                        <FileDownloadLink
                          key={idx}
                          href={file.url}
                          download={file.filename}
                          onClick={(e) => {
                            // For mock files, prevent default and show alert
                            if (file.url.startsWith('/mock-files/')) {
                              e.preventDefault();
                              alert(lang === 'zh' 
                                ? `模拟下载: ${file.filename}\n实际应用中，这将从服务器下载真实文件。` 
                                : `Mock download: ${file.filename}\nIn production, this would download the actual file from the server.`);
                            }
                          }}
                        >
                          <FileInfo>
                            <span>📄</span>
                            <div>
                              <FileName>{file.filename}</FileName>
                              {(file.size || file.uploadedAt) && (
                                <FileMetadata>
                                  {file.size && formatFileSize(file.size)}
                                  {file.size && file.uploadedAt && ' • '}
                                  {file.uploadedAt && new Date(file.uploadedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                                </FileMetadata>
                              )}
                            </div>
                          </FileInfo>
                          <DownloadButton>
                            <DownloadIcon />
                            {lang === "zh" ? "下载" : "Download"}
                          </DownloadButton>
                        </FileDownloadLink>
                      );
                    })}
                  </DetailValue>
                </DetailSection>
              )}

              {selectedRegistration.menuSendLater && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "菜单" : "Menu"}</DetailLabel>
                  <DetailValue>{lang === "zh" ? "稍后发送" : "Will send later"}</DetailValue>
                </DetailSection>
              )}

              {(selectedRegistration.notes || isEditMode) && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "备注" : "Notes"}</DetailLabel>
                  {isEditMode ? (
                    <EditTextarea 
                      value={editedRegistration.notes || ''}
                      onChange={(e) => handleEditChange('notes', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <DetailValue style={{ whiteSpace: 'pre-wrap' }}>{selectedRegistration.notes}</DetailValue>
                  )}
                </DetailSection>
              )}

              <Divider />

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "提交时间" : "Submitted At"}</DetailLabel>
                <DetailValue>
                  {selectedRegistration.submittedAt 
                    ? new Date(selectedRegistration.submittedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')
                    : '-'}
                </DetailValue>
              </DetailSection>

              <DetailSection>
                <DetailLabel>{lang === "zh" ? "状态" : "Status"}</DetailLabel>
                <DetailValue>
                  <StatusBadge $status={selectedRegistration.status}>
                    {selectedRegistration.status}
                  </StatusBadge>
                  <div style={{ fontSize: '0.875rem', color: '#5c6b7a', marginTop: '0.75rem' }}>
                    {selectedRegistration.status === 'pending' && (
                      <>
                        {lang === "zh" ? "生成时间：" : "Generated at: "}
                        {new Date(selectedRegistration.generatedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                      </>
                    )}
                    {selectedRegistration.status === 'submitted' && selectedRegistration.submittedAt && (
                      <>
                        {lang === "zh" ? "提交时间：" : "Submitted at: "}
                        {new Date(selectedRegistration.submittedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                      </>
                    )}
                    {selectedRegistration.status === 'approved' && selectedRegistration.approvedAt && (
                      <>
                        {lang === "zh" ? "批准时间：" : "Approved at: "}
                        {new Date(selectedRegistration.approvedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                        {selectedRegistration.approvedBy && (
                          <>
                            <br />
                            {lang === "zh" ? "批准人：" : "Approved by: "}
                            {selectedRegistration.approvedBy}
                          </>
                        )}
                      </>
                    )}
                    {selectedRegistration.status === 'rejected' && selectedRegistration.rejectedAt && (
                      <>
                        {lang === "zh" ? "拒绝时间：" : "Rejected at: "}
                        {new Date(selectedRegistration.rejectedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                        {selectedRegistration.rejectedBy && (
                          <>
                            <br />
                            {lang === "zh" ? "拒绝人：" : "Rejected by: "}
                            {selectedRegistration.rejectedBy}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </DetailValue>
              </DetailSection>

              {selectedRegistration.status === 'rejected' && selectedRegistration.rejectionReason && (
                <DetailSection>
                  <DetailLabel>{lang === "zh" ? "拒绝原因" : "Rejection Reason"}</DetailLabel>
                  <DetailValue style={{ color: '#991b1b', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>
                    {selectedRegistration.rejectionReason}
                  </DetailValue>
                </DetailSection>
              )}
            </>
          )}

          <ModalActions>
            {isEditMode ? (
              <>
                <ModalButton onClick={handleCancelEdit}>
                  {lang === "zh" ? "取消" : "Cancel"}
                </ModalButton>
                <ModalButton $primary onClick={handleSaveEdit}>
                  <SaveIcon />
                  {lang === "zh" ? "保存" : "Save"}
                </ModalButton>
              </>
            ) : (
              <>
                {selectedRegistration?.status === 'submitted' && (
                  <>
                    <ModalButton onClick={() => {
                      handleReject(selectedRegistration.id);
                      setShowDetailsModal(false);
                    }}>
                      {lang === "zh" ? "拒绝" : "Reject"}
                    </ModalButton>
                    <ModalButton $primary onClick={() => {
                      handleApprove(selectedRegistration.id);
                    }}>
                      {lang === "zh" ? "批准" : "Approve"}
                    </ModalButton>
                  </>
                )}
                {selectedRegistration?.status !== 'submitted' && (
                  <ModalButton onClick={() => setShowDetailsModal(false)}>
                    {lang === "zh" ? "关闭" : "Close"}
                  </ModalButton>
                )}
              </>
            )}
          </ModalActions>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
