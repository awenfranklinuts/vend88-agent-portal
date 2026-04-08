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
import { getApiUrl, API_CONFIG } from "@/config/api";
import { 
  getBusinessDevices, 
  getBusinessNotes, 
  getBusinessActivityLog 
} from "@/lib/mockBusinessData";

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

const StatsGrid = styled.div`
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
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.12);
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #5c6b7a;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0a3655;
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

const TabContainer = styled.div`
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

const Card = styled.div`
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
  border-radius: 12px;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: #0a3655;
  cursor: pointer;
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

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
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
    switch(p.$type) {
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
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

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

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

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
  const [permissions, setPermissions] = useState<string[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'permissions' | 'activity' | 'notes'>('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  const [showDeleteDeviceModal, setShowDeleteDeviceModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    level: '',
    expire: '',
    unlimited: false
  });
  const [addForm, setAddForm] = useState({
    name: '',
    level: '',
    expire: '',
    unlimited: false
  });
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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

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
        } else {
          setError(lang === "zh" ? "未找到业务" : "Business not found");
        }
      }

      // Fetch permissions
      const permissionResponse = await axios.post(
        `/api/admin/businesses/${businessId}/permissions`,
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
      
      // TODO: Fetch real devices when API is available
      // Using comprehensive mock data from mockBusinessData
      const mockDevices = getBusinessDevices(businessId);
      setDevices(mockDevices);
      
      // Mock activity log
      setActivityLog([
        {
          type: 'status',
          title: lang === 'zh' ? '状态更改' : 'Status Changed',
          description: lang === 'zh' ? '业务状态从 "setup" 更改为 "active"' : 'Business status changed from "setup" to "active"',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin'
        },
        {
          type: 'device',
          title: lang === 'zh' ? '添加设备' : 'Device Added',
          description: lang === 'zh' ? '新设备 "Device 2" 已添加' : 'New device "Device 2" was added',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin'
        },
        {
          type: 'permission',
          title: lang === 'zh' ? '权限已更新' : 'Permission Updated',
          description: lang === 'zh' ? '权限级别已更改' : 'Permission level was changed',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin'
        }
      ]);
      
      // Mock notes
      setNotes([
        {
          id: '1',
          content: lang === 'zh' ? '客户要求在下周一之前完成设置。' : 'Customer requested setup to be completed by next Monday.',
          author: 'Admin',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      
    } catch (err) {
      console.error("Failed to fetch business details:", err);
      setError(lang === "zh" ? "加载失败" : "Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (permission: string) => {
    setSelectedPermission(permission);
    // Permissions are now simple strings, no edit form needed
    showToast(lang === "zh" ? "权限为只读" : "Permissions are read-only", 'info');
  };

  const handleDeleteClick = (permission: string) => {
    setSelectedPermission(permission);
    // Permissions are now simple strings, no delete needed
    showToast(lang === "zh" ? "权限无法删除" : "Permissions cannot be deleted", 'info');
  };

  const handleAddClick = () => {
    setAddForm({
      name: '',
      level: '',
      expire: '',
      unlimited: false
    });
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
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await axios.post(
      //   '/api/shop/add-device',
      //   {
      //     business_id: businessId,
      //     serial_number: addDeviceForm.serialNumber,
      //     device_type: addDeviceForm.deviceType,
      //     device_name: addDeviceForm.deviceName,
      //     device_brand: addDeviceForm.deviceBrand,
      //     status: addDeviceForm.status
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // Temporary success message
      showToast(lang === "zh" ? "设备已添加" : "Device added successfully", 'success');
      setShowAddDeviceModal(false);
      
      // if (response.data.status_code === 200) {
      //   setMessage({ type: 'success', text: lang === "zh" ? "设备已添加" : "Device added" });
      //   setShowAddDeviceModal(false);
      //   fetchBusinessDetails();
      //   setTimeout(() => setMessage(null), 3000);
      // }
    } catch (err) {
      console.error("Failed to add device:", err);
      showToast(lang === "zh" ? "添加失败" : "Add failed", 'error');
    }
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
    
    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await axios.post(
      //   '/api/shop/update-device',
      //   {
      //     device_id: selectedDevice.id,
      //     serial_number: editDeviceForm.serialNumber,
      //     device_type: editDeviceForm.deviceType,
      //     device_name: editDeviceForm.deviceName,
      //     device_brand: editDeviceForm.deviceBrand,
      //     status: editDeviceForm.status
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      showToast(lang === "zh" ? "设备已更新" : "Device updated successfully", 'success');
      setShowEditDeviceModal(false);
    } catch (err) {
      console.error("Failed to update device:", err);
      showToast(lang === "zh" ? "更新失败" : "Update failed", 'error');
    }
  };

  const handleDeleteDeviceSubmit = async () => {
    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await axios.post(
      //   '/api/shop/delete-device',
      //   { device_id: selectedDevice.id },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      showToast(lang === "zh" ? "设备已删除" : "Device deleted successfully", 'success');
      setShowDeleteDeviceModal(false);
    } catch (err) {
      console.error("Failed to delete device:", err);
      showToast(lang === "zh" ? "删除失败" : "Delete failed", 'error');
    }
  };

  const handleEditSubmit = async () => {
    // Permissions are read-only, managed by backend API
    showToast(lang === "zh" ? "权限由后端API管理，无法在此编辑" : "Permissions are managed by backend API and cannot be edited here", 'info');
    setShowEditModal(false);
  };

  const handleDeleteSubmit = async () => {
    // Permissions are read-only, managed by backend API
    showToast(lang === "zh" ? "权限由后端API管理，无法在此删除" : "Permissions are managed by backend API and cannot be deleted here", 'info');
    setShowDeleteModal(false);
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
      // TODO: Replace with real API call
      // const response = await axios.put(
      //   `/api/business/${businessId}`,
      //   business,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      
      setOriginalBusiness(business);
      setIsEditMode(false);
      showToast(
        lang === 'zh' ? '业务信息已更新' : 'Business information updated',
        'success'
      );
      
      // Add to activity log
      setActivityLog([{
        type: 'edit',
        title: lang === 'zh' ? '业务信息已更新' : 'Business Info Updated',
        description: lang === 'zh' ? '业务详细信息已修改' : 'Business details were modified',
        timestamp: new Date().toISOString(),
        user: 'Admin'
      }, ...activityLog]);
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
  
  const handleStatusChange = (status: string) => {
    setNewStatus(status);
    setShowStatusModal(true);
  };
  
  const handleConfirmStatusChange = async () => {
    if (!business) return;
    
    try {
      // TODO: Replace with real API call
      // await axios.put(
      //   `/api/business/${businessId}/status`,
      //   { status: newStatus },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      
      const oldStatus = business.status;
      setBusiness({ ...business, status: newStatus });
      setOriginalBusiness({ ...business, status: newStatus });
      setShowStatusModal(false);
      showToast(
        lang === 'zh' ? '状态已更改' : 'Status changed',
        'success'
      );
      
      // Add to activity log
      setActivityLog([{
        type: 'status',
        title: lang === 'zh' ? '状态更改' : 'Status Changed',
        description: lang === 'zh' 
          ? `业务状态从 "${oldStatus}" 更改为 "${newStatus}"`
          : `Business status changed from "${oldStatus}" to "${newStatus}"`,
        timestamp: new Date().toISOString(),
        user: 'Admin'
      }, ...activityLog]);
    } catch (err) {
      console.error('Failed to change status:', err);
      showToast(
        lang === 'zh' ? '状态更改失败' : 'Failed to change status',
        'error'
      );
    }
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
    showToast(
      lang === 'zh' ? '笔记已添加' : 'Note added',
      'success'
    );
  };
  
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    showToast(
      lang === 'zh' ? '导出功能即将推出' : 'Export feature coming soon',
      'info'
    );
  };
  
  const handleExportCSV = () => {
    if (!business) return;
    
    const createdDate = business.createdAt || business.created_at;
    const updatedDate = business.updatedAt || business.updated_at;
    const contactEmail = business.contactEmail || business.contact_email;
    const contactPhone = business.contactPhone || business.contact_phone;
    
    const csvData = [
      ['Field', 'Value'],
      ['Business ID', business._id],
      ['Name', business.name],
      ['Owner', owner?.name || business.owner_id || business.customer_id || 'N/A'],
      ['Status', business.status],
      ['ABN', business.abn || 'N/A'],
      ['Address', business.address || 'N/A'],
      ['City', business.suburb || 'N/A'],
      ['State', business.state || 'N/A'],
      ['Postcode', business.postcode || 'N/A'],
      ['Contact Email', contactEmail || 'N/A'],
      ['Contact Phone', contactPhone || 'N/A'],
      ['EFTPOS Integration', business.eftposIntegration || 'N/A'],
      ['Created At', createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A'],
      ['Updated At', updatedDate ? new Date(updatedDate).toLocaleDateString() : 'N/A'],
    ];
    
    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `business_${businessId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(
      lang === 'zh' ? '导出成功' : 'Export successful',
      'success'
    );
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
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'status':
        return '🔄';
      case 'device':
        return '📱';
      case 'permission':
        return '🔑';
      case 'edit':
        return '✏️';
      default:
        return '📝';
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
  
  const calculateDaysSinceCreation = () => {
    if (!business) return 0;
    const createdDate = business.createdAt || business.created_at;
    if (!createdDate) return 0;
    const created = new Date(createdDate);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const handleAddSubmit = async () => {
    // Permissions are now read-only, fetched from API
    showToast(lang === "zh" ? "权限由后端API管理" : "Permissions are managed by backend API", 'info');
    setShowAddModal(false);
  };

  const formatStatus = (status: string) => {
    if (!status) return 'N/A';
    return status
      .replace(/_/g, ' ')
      .toUpperCase();
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

              {/* Stats Cards */}
              <StatsGrid>
                <StatCard>
                  <StatLabel>{lang === "zh" ? "活跃设备" : "Active Devices"}</StatLabel>
                  <StatValue>{devices.filter(d => d.status === 'active').length}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>{lang === "zh" ? "总权限" : "Total Permissions"}</StatLabel>
                  <StatValue>{permissions.length}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>{lang === "zh" ? "活跃天数" : "Days Active"}</StatLabel>
                  <StatValue>{calculateDaysSinceCreation()}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>{lang === "zh" ? "状态" : "Status"}</StatLabel>
                  <StatValue>
                    <StatusBadge $status={business.status || 'inactive'}>
                      {formatStatus(business.status || 'inactive')}
                    </StatusBadge>
                  </StatValue>
                </StatCard>
              </StatsGrid>

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

              {/* Tabbed Interface */}
              <TabContainer>
                <TabButtons>
                  <TabButton 
                    $active={activeTab === 'overview'} 
                    onClick={() => setActiveTab('overview')}
                  >
                    {lang === "zh" ? "概览" : "Overview"}
                  </TabButton>
                  <TabButton 
                    $active={activeTab === 'devices'} 
                    onClick={() => setActiveTab('devices')}
                  >
                    {lang === "zh" ? "设备" : "Devices"}
                  </TabButton>
                  <TabButton 
                    $active={activeTab === 'permissions'} 
                    onClick={() => setActiveTab('permissions')}
                  >
                    {lang === "zh" ? "权限" : "Permissions"}
                  </TabButton>
                  <TabButton 
                    $active={activeTab === 'activity'} 
                    onClick={() => setActiveTab('activity')}
                  >
                    {lang === "zh" ? "活动日志" : "Activity Log"}
                  </TabButton>
                  <TabButton 
                    $active={activeTab === 'notes'} 
                    onClick={() => setActiveTab('notes')}
                  >
                    {lang === "zh" ? "备注" : "Notes"}
                  </TabButton>
                </TabButtons>

                <TabContent>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <>
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
                              <InfoLabel>{lang === "zh" ? "邮箱" : "Email"}</InfoLabel>
                              <InfoValue>{owner.email || 'N/A'}</InfoValue>
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

                      {/* Address Information */}
                      <CardTitle style={{ marginTop: '2rem' }}>
                        {lang === "zh" ? "地址信息" : "Address Information"}
                      </CardTitle>
                      <InfoGrid>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "街道地址" : "Street Address"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              value={business.address || ''}
                              onChange={(e) => handleBusinessChange('address', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.address || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "城市/郊区" : "Suburb/City"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              value={business.suburb || ''}
                              onChange={(e) => handleBusinessChange('suburb', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.suburb || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "州" : "State"}</InfoLabel>
                          {isEditMode ? (
                            <Select 
                              value={business.state || ''}
                              onChange={(e) => handleBusinessChange('state', e.target.value)}
                            >
                              <option value="">Select State</option>
                              <option value="NSW">NSW</option>
                              <option value="VIC">VIC</option>
                              <option value="QLD">QLD</option>
                              <option value="WA">WA</option>
                              <option value="SA">SA</option>
                              <option value="TAS">TAS</option>
                              <option value="ACT">ACT</option>
                              <option value="NT">NT</option>
                            </Select>
                          ) : (
                            <InfoValue>{business.state || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "邮编" : "Postcode"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              value={business.postcode || ''}
                              onChange={(e) => handleBusinessChange('postcode', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.postcode || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "国家" : "Country"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              value={business.country || ''}
                              onChange={(e) => handleBusinessChange('country', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.country || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                      </InfoGrid>

                      {/* Contact Information */}
                      <CardTitle style={{ marginTop: '2rem' }}>
                        {lang === "zh" ? "联系信息" : "Contact Information"}
                      </CardTitle>
                      <InfoGrid>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "联系邮箱" : "Contact Email"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              type="email"
                              value={business.contactEmail || business.contact_email || ''}
                              onChange={(e) => handleBusinessChange('contactEmail', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.contactEmail || business.contact_email || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "联系电话" : "Contact Phone"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              type="tel"
                              value={business.contactPhone || business.contact_phone || ''}
                              onChange={(e) => handleBusinessChange('contactPhone', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.contactPhone || business.contact_phone || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "EFTPOS 集成" : "EFTPOS Integration"}</InfoLabel>
                          {isEditMode ? (
                            <Input 
                              value={business.eftposIntegration || ''}
                              onChange={(e) => handleBusinessChange('eftposIntegration', e.target.value)}
                            />
                          ) : (
                            <InfoValue>{business.eftposIntegration || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "支付宝选项" : "Alipay Option"}</InfoLabel>
                          {isEditMode ? (
                            <Select 
                              value={business.alipayOption || ''}
                              onChange={(e) => handleBusinessChange('alipayOption', e.target.value)}
                            >
                              <option value="">Select Option</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                              <option value="other">Other</option>
                            </Select>
                          ) : (
                            <InfoValue>{business.alipayOption || 'N/A'}</InfoValue>
                          )}
                        </InfoItem>
                      </InfoGrid>

                      {/* Additional Information */}
                      <CardTitle style={{ marginTop: '2rem' }}>
                        {lang === "zh" ? "其他信息" : "Additional Information"}
                      </CardTitle>
                      <InfoGrid>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "创建日期" : "Created At"}</InfoLabel>
                          <InfoValue>{(business.createdAt || business.created_at) ? new Date(business.createdAt || business.created_at!).toLocaleDateString() : 'Invalid Date'}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>{lang === "zh" ? "更新日期" : "Updated At"}</InfoLabel>
                          <InfoValue>{(business.updatedAt || business.updated_at) ? new Date(business.updatedAt || business.updated_at!).toLocaleDateString() : 'Invalid Date'}</InfoValue>
                        </InfoItem>
                      </InfoGrid>

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
                    </>
                  )}

                  {/* Devices Tab */}
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

                  {/* Permissions Tab */}
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

                  {/* Activity Log Tab */}
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

                  {/* Notes Tab */}
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
                          <AddPermissionButton 
                            onClick={handleAddNote}
                            style={{ marginTop: '0.75rem' }}
                          >
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
            <ErrorText>{lang === "zh" ? "未找到业务" : "Business not found"}</ErrorText>
          )}
        </MainContent>
      </Container>
      
      {/* Edit Permission Modal */}
      <Modal $show={showEditModal} onClick={() => setShowEditModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "权限详情" : "Permission Details"}</ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "权限名称" : "Permission Name"}</Label>
            <Input 
              value={selectedPermission || ''} 
              disabled 
            />
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
    </MainLayout>
  );
}
