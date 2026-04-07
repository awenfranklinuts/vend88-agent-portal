"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { API_CONFIG, getApiUrl } from "@/config/api";
import AdminSidebar from "../../../../components/layout/AdminSidebar";

interface Registration {
  _id?: string;
  id: string;
  form_id?: string;
  status: "pending" | "submitted" | "approved" | "rejected" | "expired" | "cancelled";
  linked_customer_id?: string;
  linkedCustomerId?: string;
  generatedBy?: string;
  generated_at?: string;
  generatedAt?: string;
  submitted_at?: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  quoteNumber?: string;
  business_name?: string;
  businessName?: string;
  abn?: string;
  contact_email?: string;
  contactEmail?: string;
  contact_name?: string;
  owner_name?: string;
  ownerName?: string;
  contact_phone?: string;
  contactPhone?: string;
  messagingAppType?: string;
  messagingAppId?: string;
  registeredAddress?: string;
  registeredSuburb?: string;
  registeredPostcode?: string;
  registeredState?: string;
  registeredCountry?: string;
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  readyBy?: string;
  heardAbout?: string;
  heardOther?: string;
  notes?: string;
  menuFiles?: (string | { filename: string; url: string; size?: number; uploadedAt?: string })[];
  menuSendLater?: boolean;
  customFields?: Record<string, any>;
  formFields?: { id: string; label?: string; type?: string }[];
}

interface Customer {
  _id: string;
  name: string;
  email?: string;
}

const spinning = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
  ${spinning}
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
  margin: 0rem 0 1.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #f7faff 0%, #ffffff 100%);
  color: #000000;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &::before {
    content: "←";
    margin-top: -0.15rem;
    font-size: 1rem;
    font-weight: 800;
    color: #000000;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    height: 1.5rem;
  }

  &:hover {
    background: linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 100%);
    color: #1a1a1a;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    
    &::before {
      transform: translateX(-2px);
      color: #1a1a1a;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DetailsCard = styled.section`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 968px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  line-height: 1.2;
  color: #0a3655;
`;

const Subtitle = styled.p`
  margin: 0.35rem 0 0;
  color: #5c6b7a;
  font-size: 0.9375rem;
`;

const StatusBadge = styled.span<{ $status: Registration["status"] }>`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;

  ${p => {
    switch (p.$status) {
      case "approved":
        return "background: #dcfce7; color: #166534;";
      case "submitted":
        return "background: #dbeafe; color: #1d4ed8;";
      case "rejected":
        return "background: #fee2e2; color: #991b1b;";
      case "pending":
        return "background: #fef3c7; color: #92400e;";
      default:
        return "background: #e5e7eb; color: #374151;";
    }
  }}
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #e5edf5;
  margin: 1rem 0 1.25rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.75rem;
  color: #0a3655;
  font-size: 1.125rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 0.9rem 1rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonField = styled.div`
  background: linear-gradient(90deg, #e5edf5 0%, #f0f4f9 50%, #e5edf5 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 10px;
  height: 60px;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 0.9rem 1rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const UnsavedIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Timeline = styled.div`
  position: relative;
  padding: 1rem 0;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TimelineMarker = styled.div<{ $status: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${p => {
    switch(p.$status) {
      case 'approved': return '#dcfce7';
      case 'rejected': return '#fee2e2';
      case 'submitted': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  border: 2px solid ${p => {
    switch(p.$status) {
      case 'approved': return '#16a34a';
      case 'rejected': return '#dc2626';
      case 'submitted': return '#2563eb';
      default: return '#d1d5db';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => {
    switch(p.$status) {
      case 'approved': return '#166534';
      case 'rejected': return '#991b1b';
      case 'submitted': return '#1d4ed8';
      default: return '#6b7280';
    }
  }};
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
  padding-top: 0.25rem;
`;

const TimelineStatus = styled.div`
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.25rem;
`;

const TimelineTime = styled.div`
  font-size: 0.8125rem;
  color: #6a7c90;
`;

const FileTable = styled.div`
  border: 1px solid #e8f0f8;
  border-radius: 10px;
  overflow: hidden;
  
  @media (max-width: 968px) {
    border: none;
  }
`;

const FileTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 80px 120px;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8fbff;
  border-bottom: 1px solid #e8f0f8;
  font-weight: 600;
  font-size: 0.8125rem;
  color: #6a7c90;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const FileTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 80px 120px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e8f0f8;
  align-items: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8fbff;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid #e8f0f8;
    border-radius: 10px;
    margin-bottom: 0.75rem;
  }
`;

const FileRowLabel = styled.span`
  display: none;
  font-weight: 600;
  color: #6a7c90;
  font-size: 0.75rem;
  text-transform: uppercase;
  
  @media (max-width: 968px) {
    display: block;
  }
`;

const Modal = styled.div<{ $show: boolean }>`
  display: ${p => p.$show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a3655;
`;

const ModalText = styled.p`
  margin: 0 0 1rem;
  color: #5c6b7a;
  font-size: 0.95rem;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #d1e0f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9375rem;
  color: #0a3655;
  background: #f8fbfe;
  resize: vertical;
  margin-bottom: 1.5rem;
  transition: all 200ms ease;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
  
  &::placeholder {
    color: #8b9aaf;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 0.7rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;

  ${p => p.$primary ? `
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
      transform: translateY(-2px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  ` : `
    background: #eef3f9;
    color: #0a3655;
    border: 1px solid #d8e3ef;
    
    &:hover:not(:disabled) {
      background: #e5edf5;
      border-color: #2b7be3;
      transform: translateY(-2px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 968px) {
    width: 100%;
    min-width: unset;
  }
`;

const Field = styled.div`
  background: #f8fbff;
  border: 1px solid #e8f0f8;
  border-radius: 10px;
  padding: 0.75rem 0.875rem;
  transition: all 300ms ease;
`;

const Label = styled.div`
  color: #6a7c90;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 0.3rem;
  transition: all 300ms ease;
`;

const Value = styled.div`
  color: #0f2740;
  font-size: 0.9375rem;
  line-height: 1.45;
  word-break: break-word;
  transition: all 300ms ease;
`;

const EditFieldInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1.5px solid #d1e0f0;
  border-radius: 10px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: #f8fbfe;
  transition: all 200ms ease;
  font-weight: 500;
  
  &:hover {
    border-color: #a8c5e0;
    background: #f3f9fe;
  }
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12), 
                0 2px 8px rgba(37, 99, 235, 0.15);
  }
  
  &::placeholder {
    color: #8b9aaf;
    font-weight: 400;
  }
  
  &:disabled {
    background: #f0f4f9;
    border-color: #e5edf5;
    color: #8b9aaf;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  padding: 2rem;
  text-align: center;
  color: #5c6b7a;
`;

const ErrorBox = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 10px;
`;

const DetailLabel = styled.div`
  color: #991b1b;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: flex-start;
`;

const EditInput = styled.input`
  padding: 0.75rem 0.9rem;
  border: 1.5px solid #d1e0f0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #0a3655;
  background: #f8fbfe;
  transition: all 200ms ease;
  width: 100%;
  font-weight: 500;

  &:hover {
    border-color: #a8c5e0;
    background: #f3f9fe;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12), 
                0 2px 8px rgba(37, 99, 235, 0.15);
  }

  &::placeholder {
    color: #8b9aaf;
    font-weight: 400;
  }

  &:disabled {
    background: #f0f4f9;
    border-color: #e5edf5;
    color: #8b9aaf;
    cursor: not-allowed;
  }
`;

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const BottomActions = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5edf5;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button<{ $variant?: "primary" | "danger" | "neutral" }>`
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;

  ${p => {
    switch (p.$variant) {
      case "primary":
        return `
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case "danger":
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
            box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4);
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      default:
        return `
          background: #eef3f9;
          color: #0a3655;
          border: 1px solid #d8e3ef;
          
          &:hover:not(:disabled) {
            background: #e5edf5;
            border-color: #2b7be3;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 968px) {
    width: 100%;
    min-width: unset;
  }
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  background: #f0f4f9;
  border-radius: 8px;
  padding: 0.25rem;
  gap: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${p => p.$active ? "#2563eb" : "transparent"};
  color: ${p => p.$active ? "#fff" : "#5c6b7a"};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$active ? "#1d4ed8" : "#e5edf5"};
    transform: translateY(-1px);
  }
`;

const formatDate = (value?: string, lang: "en" | "zh" = "en") => {
  if (!value) return "-";
  return new Date(value).toLocaleString(lang === "zh" ? "zh-CN" : "en-AU");
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const normalizeRegistration = (r: any): Registration => {
  // Don't spread raw object - build clean camelCase object instead
  // This prevents snake_case fields from the API response from being mixed in
  return {
    id: r.id || r._id || r.form_id,
    status: r.status || "pending",
    linkedCustomerId: r.linkedCustomerId || r.linked_customer_id,
    generatedBy: r.generatedBy || r.generated_by,
    generatedAt: r.generatedAt || r.generated_at,
    submittedAt: r.submittedAt || r.submitted_at,
    approvedAt: r.approvedAt || r.approved_at,
    approvedBy: r.approvedBy || r.approved_by,
    rejectedAt: r.rejectedAt || r.rejected_at,
    rejectedBy: r.rejectedBy || r.rejected_by,
    rejectionReason: r.rejectionReason || r.rejection_reason,
    contactEmail: r.contactEmail || r.contact_email,
    ownerName: r.ownerName || r.owner_name || r.contact_name,
    contactPhone: r.contactPhone || r.contact_phone,
    businessName: r.businessName || r.business_name,
    quoteNumber: r.quoteNumber || r.quote_number,
    abn: r.abn || r.abn,
    registeredAddress: r.registeredAddress || r.registered_address,
    registeredSuburb: r.registeredSuburb || r.registered_suburb,
    registeredPostcode: r.registeredPostcode || r.registered_postcode,
    registeredState: r.registeredState || r.registered_state,
    registeredCountry: r.registeredCountry || r.registered_country,
    messagingAppId: r.messagingAppId || r.messaging_app_id,
    messagingAppType: r.messagingAppType || r.messaging_app_type,
    eftposIntegration: r.eftposIntegration || r.eftpos_integration,
    alipayOption: r.alipayOption || r.alipay_option,
    alipayOther: r.alipayOther || r.alipay_other,
    readyBy: r.readyBy || r.ready_by,
    heardAbout: r.heardAbout || r.heard_about,
    heardOther: r.heardOther || r.heard_other,
    menuFiles: r.menuFiles || r.menu_files,
    menuSendLater: r.menuSendLater || r.menu_send_later,
    notes: r.notes || r.notes,
    _id: r._id,
    form_id: r.form_id,
    customFields: r.customFields || r.custom_fields,
    formFields: r.formFields || r.form_fields,
  };
};

export default function RegistrationDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Registration>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [customerBusinesses, setCustomerBusinesses] = useState<any[]>([]);
  const [approvalMode, setApprovalMode] = useState<'new_customer' | 'existing_customer'>('new_customer');
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  const registrationId = useMemo(() => params?.id || "", [params]);

  const hasUnsavedChanges = useMemo(
    () => Object.keys(editedData).length > 0,
    [editedData]
  );

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
      return;
    }

    if (!isLoading && token && !isAdminRole(role)) {
      router.push("/agent");
    }
  }, [isLoading, token, role, router]);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && isEditMode) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isEditMode]);

  const fetchDetails = async () => {
    if (!token || !registrationId) return;

    setLoading(true);
    setError("");

    try {
      console.log("[DEBUG] Fetching registration details");
      console.log("[DEBUG] Registration ID:", registrationId);
      console.log("[DEBUG] API URL:", `/api/registration/${registrationId}`);
      console.log("[DEBUG] Token exists:", !!token);
      
      const resp = await axios.get(`/api/registration/${registrationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("[DEBUG] Fetch Response Status:", resp.status);
      console.log("[DEBUG] Fetch Response Data:", resp.data);
      
      const payload = resp.data?.data || resp.data;
      console.log("[DEBUG] Normalized Payload:", payload);
      
      setRegistration(normalizeRegistration(payload));
      console.log("[DEBUG] Registration set successfully");
    } catch (err: any) {
      console.error("[DEBUG] Fetch Details Error:", err);
      console.error("[DEBUG] Error Response:", err.response?.data);
      console.error("[DEBUG] Error Status:", err.response?.status);
      setError(lang === "zh" ? "无法加载注册详情" : "Failed to load registration details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [token, registrationId, lang]);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/customer/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            page: 1,
            limit: 1000,
          }),
        });

        const data = await response.json();
        if (data.status_code === 200 && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else if (data.status_code === 200 && Array.isArray(data.data)) {
          // Handle case where customers are in data array
          setCustomers(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };

    fetchCustomers();
  }, [token]);

  const getBusinessName = (reg: Registration) => reg.businessName || reg.business_name || "-";
  const getContactEmail = (reg: Registration) => reg.contactEmail || reg.contact_email || "-";
  const getContactName = (reg: Registration) => reg.ownerName || reg.owner_name || reg.contact_name || "-";
  const getContactPhone = (reg: Registration) => reg.contactPhone || reg.contact_phone || "-";

  useEffect(() => {
    if (!registration) return;

    if (registration.linkedCustomerId) {
      setSelectedCustomerId(registration.linkedCustomerId);
      return;
    }

    const email = getContactEmail(registration);
    if (!email || customers.length === 0) return;

    const matched = customers.find(c => c.email?.toLowerCase() === email.toLowerCase());
    if (matched) {
      setSelectedCustomerId(matched._id);
    }
  }, [registration, customers]);

  const selectedCustomer = useMemo(
    () => customers.find(c => c._id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const fetchCustomerBusinesses = async (customerId: string) => {
    if (!token) return;

    try {
      const endpoint = getApiUrl(`/customers/${customerId}/businesses`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerBusinesses(data.businesses || data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch customer businesses", err);
      setCustomerBusinesses([]);
    }
  };

  const handleApproveClick = async () => {
    if (!registration || !token) return;

    // Set initial mode based on whether a customer was auto-matched
    if (selectedCustomerId) {
      setApprovalMode('existing_customer');
      await fetchCustomerBusinesses(selectedCustomerId);
    } else {
      setApprovalMode('new_customer');
      setCustomerBusinesses([]);
    }
    setCustomerSearchQuery("");
    setShowApprovalModal(true);
  };

  const handleApprovalModeChange = async (mode: 'new_customer' | 'existing_customer') => {
    setApprovalMode(mode);
    if (mode === 'new_customer') {
      setSelectedCustomerId("");
      setCustomerBusinesses([]);
    }
  };

  const handleSelectCustomerForApproval = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    await fetchCustomerBusinesses(customerId);
  };

  const filteredCustomersForApproval = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, customerSearchQuery]);

  const actuallyApprove = async () => {
    if (!registration || !token) return;

    setIsActing(true);
    let linkedCustomerId: string | null = null;

    try {
      const linkEndpoint = getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_LINK.replace(":id", registration.id));

      // Step 1: Link or create customer
      if (approvalMode === 'existing_customer' && selectedCustomerId) {
        console.log("[DEBUG] Approve - Linking to existing customer");
        linkedCustomerId = selectedCustomerId;

        const linkResponse = await fetch(linkEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            customer_id: selectedCustomerId,
          }),
        });

        console.log("[DEBUG] Link Response Status:", linkResponse.status);

        if (!linkResponse.ok) {
          const errorData = await linkResponse.text();
          console.error("[DEBUG] Link Error:", errorData);
          throw new Error("Failed to link customer");
        }

        const linkResponseData = await linkResponse.json();
        console.log("[DEBUG] Link Response Body:", linkResponseData);
      } else {
        // Create new customer
        console.log("[DEBUG] Approve - Creating new customer");

        const linkResponse = await fetch(linkEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            create_new: true,
            customer_data: {
              name: registration ? getContactName(registration) : '',
              email: registration ? getContactEmail(registration) : '',
              phone: registration ? getContactPhone(registration) : '',
            },
          }),
        });

        console.log("[DEBUG] New Customer Response Status:", linkResponse.status);

        if (!linkResponse.ok) {
          const errorData = await linkResponse.text();
          console.error("[DEBUG] New Customer Error:", errorData);
          throw new Error("Failed to create customer");
        }

        const linkResponseData = await linkResponse.json();
        linkedCustomerId = linkResponseData.customer?._id;
        console.log("[DEBUG] New Customer Response Body:", linkResponseData);
      }

      // Step 2: Create business/store for the customer
      if (linkedCustomerId) {
        console.log("[DEBUG] Creating business for customer:", linkedCustomerId);

        const businessEndpoint = getApiUrl("/businesses/create");
        const businessResponse = await fetch(businessEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            customer_id: linkedCustomerId,
            name: getBusinessName(registration),
            address: registration?.registeredAddress || "",
            suburb: registration?.registeredSuburb || "",
            state: registration?.registeredState || "",
            postcode: registration?.registeredPostcode || "",
            abn: registration?.abn || "",
            owner_name: getContactName(registration),
            owner_email: getContactEmail(registration),
            contact_email: getContactEmail(registration),
            contact_phone: getContactPhone(registration),
            registration_id: registration?.id,
          }),
        });

        console.log("[DEBUG] Business Response Status:", businessResponse.status);

        if (!businessResponse.ok) {
          const errorData = await businessResponse.text();
          console.error("[DEBUG] Business Error:", errorData);
          throw new Error("Failed to create business");
        }

        const businessResponseData = await businessResponse.json();
        console.log("[DEBUG] Business Response Body:", businessResponseData);
      }

      // Step 3: Approve the registration
      const approveEndpoint = getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_APPROVE.replace(":id", registration.id));
      
      console.log("[DEBUG] Approve Endpoint:", approveEndpoint);
      
      const approveResponse = await fetch(approveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          token,
          approval_notes: "",
          approval_action: approvalMode === 'existing_customer' ? 'add_store' : 'new_customer_and_store',
        }),
      });

      console.log("[DEBUG] Approve Response Status:", approveResponse.status);

      if (!approveResponse.ok) {
        const errorData = await approveResponse.text();
        console.error("[DEBUG] Approve Error:", errorData);
        throw new Error("Failed to approve");
      }

      const approveResponseData = await approveResponse.json();
      console.log("[DEBUG] Approve Response Body:", approveResponseData);

      showToast(lang === "zh" ? "批准成功" : "Approved successfully", "success");
      setShowApprovalModal(false);
      await fetchDetails();
    } catch (err: any) {
      console.error("[DEBUG] Approve Error:", err);
      showToast(lang === "zh" ? "批准失败" : "Failed to approve", "error");
    } finally {
      setIsActing(false);
    }
  };

  const handleReject = () => {
    if (!registration) return;
    setShowRejectModal(true);
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    if (!registration || !token) return;
    
    setIsActing(true);
    try {
      const endpoint = getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REJECT.replace(":id", registration.id));
      
      console.log("[DEBUG] Reject Started");
      console.log("[DEBUG] Registration ID:", registration.id);
      console.log("[DEBUG] Endpoint:", endpoint);
      console.log("[DEBUG] Reason:", rejectionReason);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          token: token,
          reason: rejectionReason || "Rejected by admin" 
        }),
      });

      console.log("[DEBUG] Reject Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("[DEBUG] Reject Error:", errorData);
        throw new Error("Reject failed");
      }

      const responseData = await response.json();
      console.log("[DEBUG] Reject Response Body:", responseData);

      setShowRejectModal(false);
      setRejectionReason("");
      showToast(lang === "zh" ? "已拒绝" : "Rejected successfully", "success");
      await fetchDetails();
    } catch (err: any) {
      console.error("[DEBUG] Reject Error:", err);
      showToast(lang === "zh" ? "拒绝失败" : "Failed to reject", "error");
    } finally {
      setIsActing(false);
    }
  };

  const handleRevoke = async () => {
    if (!registration || !token) return;

    setIsActing(true);
    try {
      const endpoint = getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_REVOKE.replace(":id", registration.id));
      
      console.log("[DEBUG] Revoke Started");
      console.log("[DEBUG] Endpoint:", endpoint);
      
      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            token: token,
            reason: "" 
          }),
        }
      );

      console.log("[DEBUG] Revoke Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("[DEBUG] Revoke Error:", errorData);
        throw new Error("Failed to revoke");
      }

      const responseData = await response.json();
      console.log("[DEBUG] Revoke Response Body:", responseData);

      showToast(lang === "zh" ? "已撤销" : "Revoked successfully", "success");
      await fetchDetails();
    } catch (err: any) {
      console.error("[DEBUG] Revoke Error:", err);
      showToast(lang === "zh" ? "撤销失败" : "Failed to revoke", "error");
    } finally {
      setIsActing(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!registration || !token) return;

    setIsSaving(true);
    try {
      // Use local API route instead of calling external API directly
      const endpoint = `/api/registration/${registration.id}`;
      
      console.log("[DEBUG] Save Changes Started");
      console.log("[DEBUG] Registration ID:", registration.id);
      console.log("[DEBUG] Endpoint:", endpoint);
      console.log("[DEBUG] Edited Data (original):", editedData);
      console.log("[DEBUG] Token exists:", !!token);
      console.log("[DEBUG] Token value (first 20 chars):", token?.substring(0, 20));
      console.log("[DEBUG] Token length:", token?.length);
      console.log("[DEBUG] Authorization Header:", `Bearer ${token?.substring(0, 20)}...`);
      
      // Convert camelCase to snake_case for API
      const apiData: any = {};
      Object.keys(editedData).forEach(key => {
        // Map camelCase to snake_case - COMPLETE MAPPING
        if (key === "contactEmail") apiData.contact_email = editedData[key as keyof Registration];
        else if (key === "contactName") apiData.contact_name = editedData[key as keyof Registration]; // ← FIXED: was missing
        else if (key === "ownerName") apiData.owner_name = editedData[key as keyof Registration];
        else if (key === "contactPhone") apiData.contact_phone = editedData[key as keyof Registration];
        else if (key === "messagingAppId") apiData.messaging_app_id = editedData[key as keyof Registration];
        else if (key === "messagingAppType") apiData.messaging_app_type = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "businessName") apiData.business_name = editedData[key as keyof Registration];
        else if (key === "quoteNumber") apiData.quote_number = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "abn") apiData.abn = editedData[key as keyof Registration]; // ← ADDED (already lowercase)
        else if (key === "registeredAddress") apiData.registered_address = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "registeredSuburb") apiData.registered_suburb = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "registeredPostcode") apiData.registered_postcode = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "registeredState") apiData.registered_state = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "registeredCountry") apiData.registered_country = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "eftposIntegration") apiData.eftpos_integration = editedData[key as keyof Registration];
        else if (key === "alipayOption") apiData.alipay_option = editedData[key as keyof Registration];
        else if (key === "alipayOther") apiData.alipay_other = editedData[key as keyof Registration];
        else if (key === "readyBy") apiData.ready_by = editedData[key as keyof Registration]; // ← ADDED
        else if (key === "heardAbout") apiData.heard_about = editedData[key as keyof Registration];
        else if (key === "heardOther") apiData.heard_other = editedData[key as keyof Registration];
        else if (key === "menuFiles") apiData.menu_files = editedData[key as keyof Registration];
        else if (key === "menuSendLater") apiData.menu_send_later = editedData[key as keyof Registration];
        else if (key === "linkedCustomerId") apiData.linked_customer_id = editedData[key as keyof Registration];
        else if (key === "notes") apiData.notes = editedData[key as keyof Registration]; // ← ADDED (already lowercase)
        else apiData[key] = editedData[key as keyof Registration]; // Fallback for any field not explicitly mapped
      });
      
      console.log("[DEBUG] Edited Data (converted to snake_case):", apiData);
      console.log("[DEBUG] Request Body:", JSON.stringify(apiData));

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: token,
            ...apiData,
          }),
        }
      );

      console.log("[DEBUG] Response Status:", response.status);
      console.log("[DEBUG] Response OK:", response.ok);
      console.log("[DEBUG] Response Headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("[DEBUG] Error Response Body:", errorData);
        console.error("[DEBUG] Error Status Code:", response.status);
        throw new Error(`Update failed with status ${response.status}: ${errorData}`);
      }

      const responseData = await response.json();
      console.log("[DEBUG] Success Response:", responseData);
      console.log("[DEBUG] Response Data Type:", typeof responseData);
      console.log("[DEBUG] Response Data Keys:", Object.keys(responseData));
      
      // Check if the response body contains an error (even if HTTP 200)
      if (responseData.message === "invalid token" || responseData.status_code === 400) {
        console.error("[DEBUG] Invalid token error in response body:", responseData);
        throw new Error(`Invalid token: ${responseData.message}`);
      }
      
      if (responseData.error || (responseData.message?.toLowerCase().includes("error") && !responseData.success)) {
        console.error("[DEBUG] Error in response body:", responseData);
        throw new Error(responseData.error || responseData.message);
      }
      
      // Check if response contains updated registration data
      const updatedReg = responseData?.data || responseData?.registration || responseData;
      console.log("[DEBUG] Updated Registration from Response:", updatedReg);
      console.log("[DEBUG] Updated Registration Keys:", Object.keys(updatedReg || {}));
      
      // Check if response is a complete registration object or just a partial update confirmation
      // A complete registration should have at least some contact/business info beyond just id/timestamps
      const hasContactInfo = updatedReg && (updatedReg.contact_name || updatedReg.contactName || updatedReg.business_name || updatedReg.businessName || updatedReg.contact_email || updatedReg.contactEmail);
      const hasOnlyTimestamps = updatedReg && updatedReg.id && !hasContactInfo;
      
      console.log("[DEBUG] Has contact info:", hasContactInfo);
      console.log("[DEBUG] Has only timestamps:", hasOnlyTimestamps);
      
      if (hasOnlyTimestamps) {
        // API returned only timestamps, refetch full registration data instead
        console.log("[DEBUG] API returned partial response (timestamps only), refetching full data from server");
        await fetchDetails();
      } else if (updatedReg && updatedReg.id && hasContactInfo) {
        // API returned complete data, use it immediately
        console.log("[DEBUG] Using response data to update state");
        setRegistration(normalizeRegistration(updatedReg));
      } else {
        // Response doesn't have valid data, refetch
        console.log("[DEBUG] Response doesn't contain valid registration data, refetching...");
        await fetchDetails();
      }
      
      // Now clear the edit state after successful update
      setEditedData({});
      setIsEditMode(false);
      showToast(lang === "zh" ? "更新成功" : "Updated successfully", "success");
    } catch (err: any) {
      console.error("[DEBUG] Complete Error Object:", err);
      console.error("[DEBUG] Error Message:", err.message);
      console.error("[DEBUG] Error Stack:", err.stack);
      showToast(lang === "zh" ? "更新失败" : "Failed to update", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData({});
    setIsEditMode(false);
  };

  const updateEditedField = (key: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getFieldValue = (key: string, defaultValue: any) => {
    return editedData[key as keyof Registration] !== undefined ? editedData[key as keyof Registration] : defaultValue;
  };

  const SkeletonLoader = () => (
    <SkeletonGrid>
      {[...Array(6)].map((_, i) => <SkeletonField key={i} />)}
    </SkeletonGrid>
  );

  const FileIcon = ({ filename }: { filename: string }) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return <span style={{ fontSize: '1.25rem' }}>📄</span>;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <span style={{ fontSize: '1.25rem' }}>🖼️</span>;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <span style={{ fontSize: '1.25rem' }}>📊</span>;
    if (['doc', 'docx'].includes(ext)) return <span style={{ fontSize: '1.25rem' }}>📝</span>;
    return <span style={{ fontSize: '1.25rem' }}>📎</span>;
  };

  const buildAuditTrail = () => {
    const events = [];
    
    if (registration?.generatedAt) {
      events.push({
        status: 'generated',
        label: lang === "zh" ? "表单生成" : "Form Generated",
        time: registration.generatedAt,
        extraInfo: registration.generatedBy || undefined
      });
    }
    
    if (registration?.submittedAt) {
      events.push({
        status: 'submitted',
        label: lang === "zh" ? "已提交" : "Submitted",
        time: registration.submittedAt,
      });
    }
    
    if (registration?.approvedAt) {
      events.push({
        status: 'approved',
        label: lang === "zh" ? "已批准" : "Approved",
        time: registration.approvedAt,
        extraInfo: registration.approvedBy || undefined
      });
    }
    
    if (registration?.rejectedAt) {
      events.push({
        status: 'rejected',
        label: lang === "zh" ? "已拒绝" : "Rejected",
        time: registration.rejectedAt,
        extraInfo: registration.rejectedBy || undefined
      });
    }
    
    return events;
  };

  const renderField = (label: string, key: string, value: string | undefined, isEditable: boolean = true) => {
    if (!isEditMode || !isEditable) {
      return (
        <Field>
          <Label>{label}</Label>
          <Value>{value || "-"}</Value>
        </Field>
      );
    }
    return (
      <Field>
        <Label>{label}</Label>
        <EditFieldInput
          type="text"
          value={getFieldValue(key, value || "")}
          onChange={(e) => updateEditedField(key, e.target.value)}
        />
      </Field>
    );
  };

  if (!adminProfile?.permissions?.includes('manage_registration_forms')) {
    router.push('/admin');
    return null;
  }

  return (
    <MainLayout currentPage={`Registrations › ${loading ? 'Loading...' : registration?.form_id || 'Details'}`}>
      <Container>
        <AdminSidebar
          mobileOpen={false}
          onClose={() => {}}
        />

        <MainContent>
          <BackButton
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
                return;
              }
              router.push("/admin/registrations");
            }}
          >
            {lang === "zh" ? "返回注册列表" : "Back to Registration List"}
          </BackButton>

          <DetailsCard>
            {loading && (
              <>
                <HeaderRow style={{ marginBottom: "1rem" }}>
                  <div>
                    <Title style={{ opacity: 0.5 }}>{lang === "zh" ? "加载中..." : "Loading..."}</Title>
                  </div>
                </HeaderRow>
                <Divider />
                <SkeletonLoader />
              </>
            )}

            {!loading && error && <ErrorBox>{error}</ErrorBox>}

            {!loading && !error && registration && (
              <>
                <HeaderRow>
                  <div>
                    <Title>{lang === "zh" ? "注册详情" : "Registration Details"}</Title>
                    <Subtitle>
                      {registration.form_id || registration.id}
                    </Subtitle>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    {hasUnsavedChanges && isEditMode && (
                      <UnsavedIndicator>
                        <span style={{ fontSize: "1rem" }}>●</span>
                        {lang === "zh" ? "有未保存的更改" : "Unsaved changes"}
                      </UnsavedIndicator>
                    )}
                    <StatusBadge $status={registration.status}>{registration.status}</StatusBadge>
                    <ToggleGroup>
                      <ToggleButton
                        $active={!isEditMode}
                        onClick={() => setIsEditMode(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        {lang === "zh" ? "查看" : "View"}
                      </ToggleButton>
                      <ToggleButton
                        $active={isEditMode}
                        onClick={() => setIsEditMode(true)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        {lang === "zh" ? "编辑" : "Edit"}
                      </ToggleButton>
                    </ToggleGroup>
                  </div>
                </HeaderRow>

                <Divider />

                <SectionTitle>{lang === "zh" ? "联系信息" : "Contact Information"}</SectionTitle>
                <Grid>
                  {renderField(
                    lang === "zh" ? "联系邮箱" : "Contact Email",
                    "contactEmail",
                    getContactEmail(registration),
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "全名" : "Full Name",
                    "ownerName",
                    getContactName(registration),
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "联系电话" : "Contact Phone",
                    "contactPhone",
                    getContactPhone(registration),
                    true
                  )}
                  {!isEditMode ? (
                    <Field>
                      <Label>{lang === "zh" ? "即时通讯" : "Messaging App"}</Label>
                      <Value>{registration.messagingAppType ? `${registration.messagingAppType}: ${registration.messagingAppId || "-"}` : "-"}</Value>
                    </Field>
                  ) : (
                    <Field>
                      <Label>{lang === "zh" ? "即时通讯" : "Messaging App"}</Label>
                      <EditFieldInput
                        type="text"
                        value={getFieldValue("messagingAppType", registration.messagingAppType || "")}
                        onChange={(e) => updateEditedField("messagingAppType", e.target.value)}
                      />
                    </Field>
                  )}
                </Grid>

                <Divider />

                <SectionTitle>{lang === "zh" ? "商业信息" : "Business Information"}</SectionTitle>
                <Grid>
                  {renderField(
                    lang === "zh" ? "报价单/发票号码" : "Quote/Invoice Number",
                    "quoteNumber",
                    registration.quoteNumber,
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "公司交易名称" : "Business Trading Name",
                    "businessName",
                    getBusinessName(registration),
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "ABN" : "ABN",
                    "abn",
                    registration.abn,
                    true
                  )}
                </Grid>

                <Divider />

                <SectionTitle>{lang === "zh" ? "注册地址" : "Registered Address"}</SectionTitle>
                <Grid>
                  {renderField(
                    lang === "zh" ? "街道地址" : "Street Address",
                    "registeredAddress",
                    registration.registeredAddress,
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "城市/郊区" : "City/Suburb",
                    "registeredSuburb",
                    registration.registeredSuburb,
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "邮政编码" : "Postcode",
                    "registeredPostcode",
                    registration.registeredPostcode,
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "州/领地" : "State/Territory",
                    "registeredState",
                    registration.registeredState,
                    true
                  )}
                  {renderField(
                    lang === "zh" ? "国家" : "Country",
                    "registeredCountry",
                    registration.registeredCountry,
                    true
                  )}
                </Grid>

                {(registration.eftposIntegration || registration.alipayOption) && (
                  <>
                    <Divider />
                    <SectionTitle>{lang === "zh" ? "支付与集成" : "Payment and Integration"}</SectionTitle>
                    <Grid>
                      {registration.eftposIntegration && renderField(
                        lang === "zh" ? "EFTPOS 集成" : "EFTPOS Integration",
                        "eftposIntegration",
                        registration.eftposIntegration,
                        true
                      )}
                      {registration.alipayOption && renderField(
                        lang === "zh" ? "支付宝/微信支付" : "Alipay/WeChat Pay",
                        "alipayOption",
                        registration.alipayOption === "other" ? `Other: ${registration.alipayOther || ""}` : registration.alipayOption,
                        true
                      )}
                    </Grid>
                  </>
                )}

                {registration.customFields && Object.keys(registration.customFields).length > 0 && (
                  <>
                    <Divider />
                    <SectionTitle>{lang === "zh" ? "自定义字段" : "Custom Fields"}</SectionTitle>
                    <Grid>
                      {Object.entries(registration.customFields).map(([key, value]) => {
                        const fieldMeta = registration.formFields?.find((f: any) => f.id === key);
                        const label = fieldMeta?.label || key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
                        const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '-');
                        return (
                          <Field key={key}>
                            <Label>{label}</Label>
                            <Value>{displayValue}</Value>
                          </Field>
                        );
                      })}
                    </Grid>
                  </>
                )}

                {(registration.readyBy || registration.heardAbout) && (
                  <>
                    <Divider />
                    <SectionTitle>{lang === "zh" ? "附加信息" : "Additional Information"}</SectionTitle>
                    <Grid>
                      {registration.readyBy && renderField(
                        lang === "zh" ? "预期部署时间" : "Expected Deployment",
                        "readyBy",
                        registration.readyBy,
                        true
                      )}
                      {registration.heardAbout && renderField(
                        lang === "zh" ? "如何了解我们" : "How Did You Hear About Us",
                        "heardAbout",
                        registration.heardAbout === "other" ? `Other: ${registration.heardOther || ""}` : registration.heardAbout,
                        true
                      )}
                    </Grid>
                  </>
                )}

                <Divider />
                <SectionTitle>{lang === "zh" ? "时间线" : "Timeline"}</SectionTitle>
                <Grid>
                  {registration.menuSendLater && renderField(
                    lang === "zh" ? "菜单稍后发送" : "Send Menu Later",
                    "menuSendLater",
                    lang === "zh" ? "是" : "Yes",
                    false
                  )}
                  {renderField(
                    lang === "zh" ? "提交时间" : "Submitted At",
                    "submittedAt",
                    formatDate(registration.submittedAt, lang),
                    false
                  )}
                  {renderField(
                    lang === "zh" ? "生成时间" : "Generated At",
                    "generatedAt",
                    formatDate(registration.generatedAt, lang),
                    false
                  )}
                  {renderField(
                    lang === "zh" ? "生成者" : "Generated By",
                    "generatedBy",
                    registration.generatedBy,
                    false
                  )}
                  {registration.approvedAt && renderField(
                    lang === "zh" ? "批准时间" : "Approved At",
                    "approvedAt",
                    formatDate(registration.approvedAt, lang),
                    false
                  )}
                  {registration.approvedBy && renderField(
                    lang === "zh" ? "批准者" : "Approved By",
                    "approvedBy",
                    registration.approvedBy,
                    false
                  )}
                  {registration.rejectedAt && renderField(
                    lang === "zh" ? "拒绝时间" : "Rejected At",
                    "rejectedAt",
                    formatDate(registration.rejectedAt, lang),
                    false
                  )}
                  {registration.rejectedBy && renderField(
                    lang === "zh" ? "拒绝者" : "Rejected By",
                    "rejectedBy",
                    registration.rejectedBy,
                    false
                  )}
                </Grid>

                <>
                  <Divider />
                  <SectionTitle>{lang === "zh" ? "备注" : "Notes"}</SectionTitle>
                  {!isEditMode ? (
                    registration.notes ? (
                      <Field>
                        <Value>{registration.notes}</Value>
                      </Field>
                    ) : (
                      <Field style={{ textAlign: "center", padding: "2rem 0.75rem" }}>
                        <Value style={{ color: "#9ca3af", marginBottom: "1rem" }}>
                          {lang === "zh" ? "暂无备注" : "No notes yet"}
                        </Value>
                        <ActionButton
                          $variant="primary"
                          onClick={() => setIsEditMode(true)}
                          style={{ marginTop: "0.5rem" }}
                        >
                          {lang === "zh" ? "添加备注" : "Add Notes"}
                        </ActionButton>
                      </Field>
                    )
                  ) : (
                    <Field>
                      <textarea
                        value={getFieldValue("notes", registration.notes || "")}
                        onChange={(e) => updateEditedField("notes", e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          padding: "0.75rem",
                          border: "1.5px solid #d1e0f0",
                          borderRadius: "8px",
                          fontFamily: "inherit",
                          fontSize: "0.9375rem",
                          color: "#0a3655",
                          backgroundColor: "#f8fbfe",
                          resize: "vertical",
                        }}
                        placeholder={lang === "zh" ? "添加备注..." : "Add notes..."}
                      />
                    </Field>
                  )}
                </>

                {registration.menuFiles && registration.menuFiles.length > 0 && (
                  <>
                    <Divider />
                    <SectionTitle>{lang === "zh" ? "菜单文件" : "Menu Files"}</SectionTitle>
                    <FileTable>
                      <FileTableHeader>
                        <div>{lang === "zh" ? "文件名" : "Filename"}</div>
                        <div>{lang === "zh" ? "大小" : "Size"}</div>
                        <div>{lang === "zh" ? "日期" : "Date"}</div>
                        <div>{lang === "zh" ? "操作" : "Action"}</div>
                      </FileTableHeader>
                      {registration.menuFiles.map((file: any, idx: number) => {
                        const fileName = typeof file === "string" ? file : file.filename || "File";
                        const fileSize = typeof file === "string" ? undefined : file.size;
                        const fileUrl = typeof file === "string" ? file : file.url;
                        const uploadedAt = typeof file === "string" ? undefined : file.uploadedAt;
                        return (
                          <FileTableRow key={idx}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <FileIcon filename={fileName} />
                              <div style={{ flex: 1 }}>
                                <div style={{ color: "#0a3655", fontWeight: 500, wordBreak: "break-word" }}>
                                  {fileName}
                                </div>
                              </div>
                            </div>
                            <div>
                              <FileRowLabel>{lang === "zh" ? "大小" : "Size"}</FileRowLabel>
                              <span style={{ color: "#5c6b7a", fontWeight: 500 }}>{formatFileSize(fileSize)}</span>
                            </div>
                            <div>
                              <FileRowLabel>{lang === "zh" ? "日期" : "Date"}</FileRowLabel>
                              <span style={{ color: "#5c6b7a", fontSize: "0.85rem" }}>
                                {uploadedAt ? formatDate(uploadedAt, lang).split(",")[0] : "-"}
                              </span>
                            </div>\n                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <FileRowLabel>{lang === "zh" ? "操作" : "Action"}</FileRowLabel>
                              {fileUrl && (
                                <ActionButton
                                  $variant="neutral"
                                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", minWidth: "auto" }}
                                  onClick={() => window.open(fileUrl, "_blank")}
                                  title={lang === "zh" ? "下载文件" : "Download file"}
                                >
                                  📥
                                </ActionButton>
                              )}
                              {!fileUrl && (
                                <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>-</span>
                              )}
                            </div>
                          </FileTableRow>
                        );
                      })}
                    </FileTable>
                  </>
                )}

                {registration.rejectionReason && (
                  <>
                    <Divider />
                    <SectionTitle>{lang === "zh" ? "拒绝原因" : "Rejection Reason"}</SectionTitle>
                    <ErrorBox>{registration.rejectionReason}</ErrorBox>
                  </>
                )}

                {buildAuditTrail().length > 0 && (
                  <>
                    <Divider />
                    <SectionTitle>{lang === "zh" ? "处理历史" : "Approval Status Timeline"}</SectionTitle>
                    <Timeline>
                      {buildAuditTrail().map((event, idx) => (
                        <TimelineItem key={idx}>
                          <TimelineMarker $status={event.status}>
                            {event.status === 'approved' && '✓'}
                            {event.status === 'rejected' && '✕'}
                            {event.status === 'submitted' && '→'}
                            {event.status === 'generated' && '◆'}
                          </TimelineMarker>
                          <TimelineContent>
                            <TimelineStatus>{event.label}</TimelineStatus>
                            <TimelineTime>
                              {formatDate(event.time, lang)}
                              {event.extraInfo && ` • ${event.extraInfo}`}
                            </TimelineTime>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </>
                )}

                <BottomActions>
                  {isEditMode ? (
                    <>
                      <ActionButton
                        $variant="neutral"
                        disabled={isSaving}
                        onClick={handleCancelEdit}
                      >
                        {lang === "zh" ? "取消" : "Cancel"}
                      </ActionButton>
                      <ActionButton
                        $variant="primary"
                        disabled={isSaving}
                        onClick={handleSaveChanges}
                      >
                        {isSaving ? (lang === "zh" ? "保存中..." : "Saving...") : (lang === "zh" ? "保存更改" : "Save Changes")}
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      {registration.status === "submitted" && (
                        <>
                          <ActionButton $variant="danger" disabled={isActing} onClick={handleReject}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M15 9l-6 6M9 9l6 6"/>
                            </svg>
                            {lang === "zh" ? "拒绝" : "Reject"}
                          </ActionButton>
                          <ActionButton $variant="primary" disabled={isActing} onClick={handleApproveClick}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {lang === "zh" ? "批准" : "Approve"}
                          </ActionButton>
                        </>
                      )}

                      {registration.status === "rejected" && (
                        <ActionButton $variant="primary" disabled={isActing} onClick={handleApproveClick}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {lang === "zh" ? "改为批准" : "Change to Approve"}
                        </ActionButton>
                      )}

                      {registration.status === "pending" && (
                        <ActionButton $variant="danger" disabled={isActing} onClick={handleRevoke}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M3 8v5h5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m18-8v5h-5"/>
                          </svg>
                          {lang === "zh" ? "撤销链接" : "Revoke Link"}
                        </ActionButton>
                      )}
                    </>
                  )}
                </BottomActions>
              </>
            )}
          </DetailsCard>
        </MainContent>
      </Container>

      {showRejectModal && (
        <Modal $show={showRejectModal} onClick={() => setShowRejectModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>
              {lang === 'zh' ? '拒绝注册' : 'Reject Registration'}
            </ModalTitle>
            <ModalText>
              {lang === 'zh' ? '请输入拒绝原因（可选）：' : 'Enter rejection reason (optional):'}
            </ModalText>
            <ModalTextarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={lang === 'zh' ? '拒绝原因...' : 'Rejection reason...'}
              rows={3}
            />
            <ModalActions>
              <ModalButton 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                {lang === 'zh' ? '取消' : 'Cancel'}
              </ModalButton>
              <ModalButton 
                $primary 
                onClick={handleConfirmReject} 
                disabled={isActing}
                style={{ background: '#dc2626' }}
              >
                {lang === 'zh' ? '确认拒绝' : 'Confirm Reject'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {showApprovalModal && (
        <Modal $show={showApprovalModal} onClick={() => setShowApprovalModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', padding: '2rem' }}>
            <ModalTitle style={{ marginBottom: '1.5rem' }}>
              {lang === 'zh' ? '审批注册' : 'Approve Registration'}
            </ModalTitle>
            
            {/* ─── Step 1: Choose Approval Mode ─── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a3655', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'zh' ? '选择操作' : 'Choose Action'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Option A: New Customer + Store */}
                <div
                  onClick={() => handleApprovalModeChange('new_customer')}
                  style={{
                    padding: '1.25rem',
                    border: `2px solid ${approvalMode === 'new_customer' ? '#3b82f6' : '#e0e7ef'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: approvalMode === 'new_customer' ? 'rgba(59,130,246,0.04)' : 'white',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${approvalMode === 'new_customer' ? '#3b82f6' : '#cbd5e1'}`,
                      background: approvalMode === 'new_customer' ? '#3b82f6' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {approvalMode === 'new_customer' && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: '#0a3655', fontSize: '0.95rem' }}>
                      {lang === 'zh' ? '创建新客户与门店' : 'Create New Customer & Store'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, paddingLeft: '2.75rem' }}>
                    {lang === 'zh'
                      ? '基于此注册信息创建一个全新的客户记录和门店'
                      : 'Create a brand new customer record and store from this registration'}
                  </div>
                </div>

                {/* Option B: Add Store to Existing Customer */}
                <div
                  onClick={() => handleApprovalModeChange('existing_customer')}
                  style={{
                    padding: '1.25rem',
                    border: `2px solid ${approvalMode === 'existing_customer' ? '#3b82f6' : '#e0e7ef'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: approvalMode === 'existing_customer' ? 'rgba(59,130,246,0.04)' : 'white',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${approvalMode === 'existing_customer' ? '#3b82f6' : '#cbd5e1'}`,
                      background: approvalMode === 'existing_customer' ? '#3b82f6' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {approvalMode === 'existing_customer' && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: '#0a3655', fontSize: '0.95rem' }}>
                      {lang === 'zh' ? '添加门店到已有客户' : 'Add Store to Existing Customer'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, paddingLeft: '2.75rem' }}>
                    {lang === 'zh'
                      ? '将此注册的门店添加到系统中已有的客户账户下'
                      : 'Add this registration\'s store to an existing customer in the system'}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Step 2: Customer Details (conditional on mode) ─── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a3655', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'zh' ? '客户信息' : 'Customer Information'}
              </div>

              {approvalMode === 'new_customer' ? (
                /* New customer card */
                <div style={{
                  padding: '1.25rem',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0a3655', marginBottom: '0.35rem', fontSize: '1rem' }}>
                        {registration ? getContactName(registration) : '-'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {registration ? getContactEmail(registration) : '-'}
                      </div>
                      {registration && getContactPhone(registration) !== '-' && (
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>
                          {getContactPhone(registration)}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '0.5rem 0.85rem', borderRadius: '6px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {lang === 'zh' ? '新建客户' : 'New'}
                    </div>
                  </div>
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#b45309' }}>
                    {lang === 'zh' ? '新客户和门店将在批准时自动创建' : 'A new customer and store will be created upon approval'}
                  </div>
                </div>
              ) : (
                /* Existing customer search & select */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Search bar */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder={lang === 'zh' ? '搜索客户姓名或邮箱...' : 'Search customer by name or email...'}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e0e7ef',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e7ef'}
                    />
                  </div>

                  {/* Customer list */}
                  <div style={{
                    maxHeight: '240px',
                    overflowY: 'auto',
                    border: '1px solid #e0e7ef',
                    borderRadius: '10px',
                    background: '#f8fafc',
                  }}>
                    {filteredCustomersForApproval.length === 0 ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                        {lang === 'zh' ? '未找到匹配的客户' : 'No matching customers found'}
                      </div>
                    ) : (
                      filteredCustomersForApproval.map((c) => (
                        <div
                          key={c._id}
                          onClick={() => handleSelectCustomerForApproval(c._id)}
                          style={{
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f4f8',
                            background: selectedCustomerId === c._id ? 'rgba(59,130,246,0.06)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: '#0a3655', fontSize: '0.9rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.email}</div>
                          </div>
                          {selectedCustomerId === c._id && (
                            <div style={{
                              width: '22px', height: '22px', borderRadius: '50%',
                              background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Selected customer detail with existing stores */}
                  {selectedCustomer && (
                    <div style={{
                      padding: '1.25rem',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0a3655', marginBottom: '0.35rem', fontSize: '1rem' }}>
                            {selectedCustomer.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {selectedCustomer.email}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '0.5rem 0.85rem', borderRadius: '6px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {lang === 'zh' ? '现有客户' : 'Existing'}
                        </div>
                      </div>

                      {/* Existing stores */}
                      {customerBusinesses.length > 0 && (
                        <div style={{ paddingTop: '1rem', borderTop: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>
                            {lang === 'zh' ? '现有门店' : 'Existing Stores'} ({customerBusinesses.length})
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                            {customerBusinesses.map((business, idx) => (
                              <div key={idx} style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.4' }}>
                                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 600 }}>•</span>
                                {business.name}
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem', marginLeft: '1rem' }}>
                                  {business.suburb}, {business.state} {business.postcode}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ paddingTop: '1rem', borderTop: customerBusinesses.length > 0 ? 'none' : '1px solid #cbd5e1', marginTop: customerBusinesses.length > 0 ? '0.75rem' : '0', fontSize: '0.85rem', color: '#0369a1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.95rem' }}>+</span>
                        <span>
                          {lang === 'zh'
                            ? `一个新门店将被添加到 "${selectedCustomer.name}" 的账户下`
                            : `A new store will be added to "${selectedCustomer.name}"`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ─── Step 3: New Store/Business Information ─── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a3655', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'zh' ? '新门店信息' : 'New Store Information'}
              </div>
              
              <div style={{
                padding: '1.25rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.6rem' }}>
                      {lang === 'zh' ? '商户名称' : 'Business Name'}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#0a3655', fontWeight: 600 }}>
                      {registration ? getBusinessName(registration) : '-'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.6rem' }}>
                      {lang === 'zh' ? '注册地址' : 'Registered Address'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#0a3655', lineHeight: '1.6' }}>
                      {registration ? `${registration.registeredAddress || '-'}` : '-'}<br/>
                      {registration ? `${registration.registeredSuburb || '-'} ${registration.registeredState || ''} ${registration.registeredPostcode || '-'}` : '-'}
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0369a1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem' }}>✓</span>
                  <span>
                    {approvalMode === 'existing_customer' && selectedCustomer
                      ? (lang === 'zh' ? `此门店将作为新门店添加到 "${selectedCustomer.name}" 的账户下` : `This store will be added as a new store under "${selectedCustomer.name}"`)
                      : (lang === 'zh' ? '将与新客户一起创建' : 'Will be created along with the new customer')
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Validation Warning ─── */}
            {approvalMode === 'existing_customer' && !selectedCustomerId && (
              <div style={{
                padding: '1rem 1.25rem',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>⚠</span>
                {lang === 'zh' ? '请选择一个已有客户后再确认批准' : 'Please select an existing customer before confirming approval'}
              </div>
            )}

            {/* Actions */}
            <ModalActions>
              <ModalButton 
                onClick={() => setShowApprovalModal(false)}
              >
                {lang === 'zh' ? '取消' : 'Cancel'}
              </ModalButton>
              <ModalButton 
                $primary 
                onClick={actuallyApprove} 
                disabled={isActing || (approvalMode === 'existing_customer' && !selectedCustomerId)}
              >
                {isActing
                  ? (lang === 'zh' ? '处理中...' : 'Processing...')
                  : approvalMode === 'new_customer'
                    ? (lang === 'zh' ? '确认 — 创建新客户与门店' : 'Confirm — Create New Customer & Store')
                    : (lang === 'zh' ? '确认 — 添加门店到已有客户' : 'Confirm — Add Store to Existing Customer')
                }
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </MainLayout>
  );
}
