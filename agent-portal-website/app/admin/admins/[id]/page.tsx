"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../../components/layout/AdminSidebar";

/* ─── Types ─── */
interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  permissions?: string[];
}

interface AdminFormData {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  password: string;
  confirm_password: string;
}

interface AuditLog {
  timestamp: string;
  action: string;
  target_email: string;
  actor_email: string;
  details: string;
}

interface Permission {
  id: string;
  name_en: string;
  name_zh: string;
  enabled: boolean;
}

interface PermissionCategory {
  category_en: string;
  category_zh: string;
  permissions: Permission[];
}

const ROLE_LABELS: Record<string, { en: string; zh: string }> = {
  admin: { en: 'Admin', zh: '管理员' },
  super_admin: { en: 'Super Admin', zh: '超级管理员' },
};

const AVAILABLE_PERMISSIONS: Record<string, PermissionCategory[]> = {
  admin: [
    {
      category_en: 'Business Management',
      category_zh: '业务管理',
      permissions: [
        { id: 'manage_businesses', name_en: 'Business Management', name_zh: '业务管理', enabled: true },
      ],
    },
    {
      category_en: 'Customer Management',
      category_zh: '客户管理',
      permissions: [
        { id: 'manage_customers', name_en: 'Customer Management', name_zh: '客户管理', enabled: true },
      ],
    },
    {
      category_en: 'Agent Management',
      category_zh: '代理管理',
      permissions: [
        { id: 'manage_agents', name_en: 'Agent Management', name_zh: '代理管理', enabled: true },
      ],
    },
    {
      category_en: 'Registration Management',
      category_zh: '注册管理',
      permissions: [
        { id: 'manage_registration_forms', name_en: 'Registration Forms', name_zh: '注册表单', enabled: true },
        { id: 'manage_form_templates', name_en: 'Form Templates', name_zh: '表单模板', enabled: true },
      ],
    },
    {
      category_en: 'Reports & Analytics',
      category_zh: '报告与分析',
      permissions: [
        { id: 'view_reports', name_en: 'Reports & Analytics', name_zh: '报告与分析', enabled: true },
      ],
    },
    {
      category_en: 'System Settings',
      category_zh: '系统设置',
      permissions: [
        { id: 'manage_system_settings', name_en: 'System Settings', name_zh: '系统设置', enabled: true },
      ],
    },
  ],
  super_admin: [
    {
      category_en: 'Business Management',
      category_zh: '业务管理',
      permissions: [
        { id: 'manage_businesses', name_en: 'Business Management', name_zh: '业务管理', enabled: true },
      ],
    },
    {
      category_en: 'Customer Management',
      category_zh: '客户管理',
      permissions: [
        { id: 'manage_customers', name_en: 'Customer Management', name_zh: '客户管理', enabled: true },
      ],
    },
    {
      category_en: 'Agent Management',
      category_zh: '代理管理',
      permissions: [
        { id: 'manage_agents', name_en: 'Agent Management', name_zh: '代理管理', enabled: true },
      ],
    },
    {
      category_en: 'Registration Management',
      category_zh: '注册管理',
      permissions: [
        { id: 'manage_registration_forms', name_en: 'Registration Forms', name_zh: '注册表单', enabled: true },
        { id: 'manage_form_templates', name_en: 'Form Templates', name_zh: '表单模板', enabled: true },
      ],
    },
    {
      category_en: 'Admin Management',
      category_zh: '管理员管理',
      permissions: [
        { id: 'manage_admins', name_en: 'Admin Management', name_zh: '管理员管理', enabled: true },
      ],
    },
    {
      category_en: 'Reports & Analytics',
      category_zh: '报告与分析',
      permissions: [
        { id: 'view_reports', name_en: 'Reports & Analytics', name_zh: '报告与分析', enabled: true },
      ],
    },
    {
      category_en: 'System Settings',
      category_zh: '系统设置',
      permissions: [
        { id: 'manage_system_settings', name_en: 'System Settings', name_zh: '系统设置', enabled: true },
      ],
    },
  ]
};

/* ─── Styled Components ─── */

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

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(30, 64, 175, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: #0a3655;
  font-weight: 500;
  word-break: break-all;
`;

const RoleBadge = styled.span<{ $role: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
  ${p => {
    switch (p.$role) {
      case 'super_admin':
        return 'background: linear-gradient(135deg, rgba(126,34,206,0.12) 0%, rgba(168,85,247,0.12) 100%); color: #7e22ce;';
      case 'admin':
        return 'background: rgba(26, 35, 126, 0.1); color: #1a237e;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
  ${p => {
    switch (p.$status) {
      case 'active':
        return 'background: rgba(34, 197, 94, 0.12); color: #15803d;';
      case 'inactive':
        return 'background: rgba(239, 68, 68, 0.12); color: #991b1b;';
      case 'suspended':
        return 'background: rgba(244, 164, 96, 0.12); color: #b45309;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: #1a237e;
  color: white;
  &:hover { background: #0d1547; }
`;

const DangerButton = styled(ActionButton)`
  background: #ef4444;
  &:hover { background: #dc2626; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

/* ─── Modal Styled Components ─── */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 54, 85, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  width: min(560px, 95vw);
  max-height: 85vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #f0f4f8;
`;

const ModalTitle = styled.h3`
  font-size: 1.1875rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0 0.25rem;
  &:hover { color: #374151; }
`;

const ModalBody = styled.div`
  padding: 1.5rem 2rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid #f0f4f8;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.375rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26,35,126,0.1); }
  &:disabled { background: #f3f4f6; cursor: not-allowed; }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26,35,126,0.1); }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.75rem;
  &:hover { color: #374151; }
`;

const ErrorText = styled.span`
  font-size: 0.8125rem;
  color: #dc2626;
  margin-top: 0.25rem;
  display: block;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: #d1d5db; }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #1a237e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: #0d1547; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ModalDangerButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: #dc2626; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ConfirmText = styled.p`
  font-size: 1rem;
  color: #0a3655;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const ConfirmWarning = styled.p`
  font-size: 0.875rem;
  color: #991b1b;
  background: #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const AuditLogSection = styled.div`
  margin-top: 0.5rem;
`;

const AuditLogTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0 0 1rem 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuditTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const AuditThead = styled.thead`
  background: #f7faff;
`;

const AuditTh = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #0a3655;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 0.75rem;
  border-bottom: 2px solid #e0e7ef;
`;

const AuditTbody = styled.tbody``;

const AuditTr = styled.tr`
  border-bottom: 1px solid #e0e7ef;
  transition: background 0.2s ease;
  &:hover {
    background: #f7faff;
  }
`;

const AuditTd = styled.td`
  padding: 1rem;
  color: #0a3655;
  word-break: break-word;
`;

const ActionBadge = styled.span<{ $action: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  ${p => {
    switch (p.$action) {
      case 'CREATE':
        return 'background: rgba(34, 197, 94, 0.12); color: #15803d;';
      case 'UPDATE':
        return 'background: rgba(59, 130, 246, 0.12); color: #1e40af;';
      case 'DELETE':
        return 'background: rgba(239, 68, 68, 0.12); color: #991b1b;';
      default:
        return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const AuditEmpty = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;

const DateRangeFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f7faff;
  border-radius: 8px;
  border: 1px solid #e0e7ef;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const DateInputGroup = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const DateLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
  }
`;

const PresetButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const PresetButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  ${p => p.$active ? `
    background: #1a237e;
    color: white;
    border-color: #1a237e;
  ` : `
    &:hover { border-color: #1a237e; color: #1a237e; }
  `}
`;

const ClearFilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: #dc2626; }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0a3655;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  ${p => p.$active ? `
    background: #1a237e;
    color: white;
    border-color: #1a237e;
  ` : `
    &:hover:not(:disabled) { border-color: #1a237e; color: #1a237e; }
  `}
`;

const PaginationInfo = styled.span`
  font-size: 0.8125rem;
  color: #5c6b7a;
  padding: 0.5rem 1rem;
  white-space: nowrap;
`;

const SkeletonBlock = styled.div`
  height: 1rem;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonLine = styled(SkeletonBlock)<{ width?: string }>`
  width: ${p => p.width || '100%'};
  margin-bottom: 0.75rem;
`;

const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PermissionCheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f7faff;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f4f8;
  }
`;

const PermissionCheckbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: #1a237e;
`;

const PermissionLabel = styled.label<{ $disabled?: boolean }>`
  font-size: 0.9375rem;
  color: #0a3655;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  margin: 0;
  opacity: ${p => p.$disabled ? 0.5 : 1};
  ${p => p.$disabled ? 'cursor: not-allowed;' : ''}
`;

const PermissionSection = styled.div`
  min-width: 0;
`;

const PermissionSectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PermissionSubtitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #5c6b7a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0 0 1rem 0;
  padding: 0;
`;

const SavePermissionsButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #1a237e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  &:hover { background: #0d1547; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

/* ─── Icons ─── */
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4H14M5.333 4V2.667C5.333 2.313 5.474 1.974 5.724 1.724C5.974 1.474 6.313 1.333 6.667 1.333H9.333C9.687 1.333 10.026 1.474 10.276 1.724C10.526 1.974 10.667 2.313 10.667 2.667V4M12.667 4V13.333C12.667 13.687 12.526 14.026 12.276 14.276C12.026 14.526 11.687 14.667 11.333 14.667H4.667C4.313 14.667 3.974 14.526 3.724 14.276C3.474 14.026 3.333 13.687 3.333 13.333V4H12.667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─── Page Component ─── */

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, role, isLoading: authLoading, adminProfile: myProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();

  const adminId = (params?.id as string) || '';

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [auditDateStart, setAuditDateStart] = useState<string>('');
  const [auditDateEnd, setAuditDateEnd] = useState<string>('');
  const [auditCurrentPage, setAuditCurrentPage] = useState(1);
  const auditItemsPerPage = 10;

  // Inline edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    email: '', first_name: '', last_name: '', role: 'admin', status: 'active', password: '', confirm_password: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Permission management (view mode)
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);

  // Permission management (edit mode)
  const [editModePermissions, setEditModePermissions] = useState<PermissionCategory[]>([]);

  /* ─── Fetch admin detail ─── */
  const fetchAdmin = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/detail', { token, user_id: adminId });
      const d = res.data;
      setAdmin({
        id: d.user_id,
        email: d.email,
        first_name: d.first_name,
        last_name: d.last_name,
        role: d.role || 'admin',
        status: d.status || 'active',
        created_at: d.created_at,
        updated_at: d.updated_at,
        last_login: d.last_login,
        permissions: d.permissions || [],
      });
    } catch {
      showToast(lang === 'zh' ? '获取管理员详情失败' : 'Failed to load admin details', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, adminId, lang, showToast]);

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (!authLoading && role !== 'admin' && (role as string) !== 'super_admin') { router.push('/admin'); return; }
    if (token) fetchAdmin();
  }, [authLoading, token, role, router, fetchAdmin]);

  /* ─── Date range helpers ─── */
  const getDateRangeForPreset = (preset: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    let startDate = new Date(today);

    switch (preset) {
      case 'today':
        startDate = new Date(today);
        break;
      case 'last7days':
        startDate.setDate(startDate.getDate() - 6);
        break;
      case 'last30days':
        startDate.setDate(startDate.getDate() - 29);
        break;
      case 'alltime':
        return { start: '', end: '' };
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return { start: formatDate(startDate), end: formatDate(endDate) };
  };

  const handlePresetClick = (preset: string) => {
    const range = getDateRangeForPreset(preset);
    setAuditDateStart(range.start);
    setAuditDateEnd(range.end);
    setAuditCurrentPage(1);
  };

  /* ─── Audit logs filtering & pagination ─── */
  const filteredAuditLogs = auditLogs.filter(log => {
    if (!auditDateStart && !auditDateEnd) return true;
    const logDate = new Date(log.timestamp);
    const startDate = auditDateStart ? new Date(auditDateStart) : new Date('1900-01-01');
    const endDate = auditDateEnd ? new Date(auditDateEnd) : new Date('2100-12-31');
    endDate.setHours(23, 59, 59, 999);
    return logDate >= startDate && logDate <= endDate;
  });

  const totalPages = Math.ceil(filteredAuditLogs.length / auditItemsPerPage);
  const paginatedAuditLogs = filteredAuditLogs.slice(
    (auditCurrentPage - 1) * auditItemsPerPage,
    auditCurrentPage * auditItemsPerPage
  );

  /* ─── Fetch audit logs ─── */
  const fetchAuditLogs = useCallback(async () => {
    if (!token || !adminId) return;
    setLoadingAuditLogs(true);
    try {
      const res = await axios.get(`/api/admin/audit-log/${adminId}?token=${token}`);
      setAuditLogs(res.data?.audit_log || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoadingAuditLogs(false);
    }
  }, [token, adminId]);

  useEffect(() => {
    if (token && admin) {
      fetchAuditLogs();
      // Initialize permissions based on admin role
      const roleCategories = AVAILABLE_PERMISSIONS[admin.role] || [];
      const enabledPermIds = admin.permissions || [];
      const categoriesWithStatus = roleCategories.map(category => ({
        ...category,
        permissions: category.permissions.map(p => ({
          ...p,
          enabled: enabledPermIds.includes(p.id)
        }))
      }));
      setPermissionCategories(categoriesWithStatus);
    }
  }, [token, admin, fetchAuditLogs]);

  /* ─── Edit helpers ─── */
  const enterEditMode = () => {
    if (!admin) return;
    setFormData({
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
      role: admin.role,
      status: admin.status || 'active',
      password: '',
      confirm_password: '',
    });
    // Initialize edit mode permissions based on current admin permissions
    const roleCategories = AVAILABLE_PERMISSIONS[admin.role] || [];
    const enabledPermIds = admin.permissions || [];
    const categoriesWithStatus = roleCategories.map(category => ({
      ...category,
      permissions: category.permissions.map(p => ({
        ...p,
        enabled: enabledPermIds.includes(p.id)
      }))
    }));
    setEditModePermissions(categoriesWithStatus);
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setIsEditing(false);
    setFormErrors({});
    setSaving(false);
  };

  const handleInputChange = (field: keyof AdminFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: undefined }));
    // When role changes, reinitialize edit mode permissions for the new role
    if (field === 'role' && admin) {
      const roleCategories = AVAILABLE_PERMISSIONS[value] || [];
      const enabledPermIds = admin.permissions || [];
      const categoriesWithStatus = roleCategories.map(category => ({
        ...category,
        permissions: category.permissions.map(p => ({
          ...p,
          enabled: enabledPermIds.includes(p.id)
        }))
      }));
      setEditModePermissions(categoriesWithStatus);
    }
  };

  const handleEditModePermissionToggle = (permissionId: string) => {
    setEditModePermissions(prev => prev.map(category => ({
      ...category,
      permissions: category.permissions.map(p =>
        p.id === permissionId ? { ...p, enabled: !p.enabled } : p
      )
    })));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AdminFormData, string>> = {};
    if (!formData.email.trim()) {
      errors.email = lang === 'zh' ? '请输入邮箱' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = lang === 'zh' ? '邮箱格式无效' : 'Invalid email format';
    }
    if (!formData.first_name.trim()) errors.first_name = lang === 'zh' ? '请输入名字' : 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = lang === 'zh' ? '请输入姓氏' : 'Last name is required';
    if (!formData.role) errors.role = lang === 'zh' ? '请选择角色' : 'Role is required';

    // Password optional for edit — only validate if provided
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = lang === 'zh' ? '密码至少8个字符' : 'Password must be at least 8 characters';
      }
    }
    if (formData.password && formData.password !== formData.confirm_password) {
      errors.confirm_password = lang === 'zh' ? '密码不匹配' : 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm() || !admin) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        token: token!,
        user_id: admin.id,
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
        status: formData.status,
      };
      if (formData.password) payload.password = formData.password;

      await axios.post('/api/admin/update', payload);
      
      // Save permissions if edit mode permissions exist
      if (editModePermissions.length > 0) {
        const enabledPermissions = editModePermissions
          .flatMap(cat => cat.permissions)
          .filter(p => p.enabled)
          .map(p => p.id);
        await axios.post('/api/admin/permissions', {
          token,
          user_id: admin.id,
          permissions: enabledPermissions
        });
      }

      showToast(lang === 'zh' ? '管理员更新成功' : 'Admin updated successfully', 'success');
      setIsEditing(false);
      fetchAdmin();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.status_msg;
      showToast(msg || (lang === 'zh' ? '更新管理员失败' : 'Failed to update admin'), 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete helpers ─── */
  const handleDelete = async () => {
    if (!admin) return;
    setDeleting(true);
    try {
      await axios.post('/api/admin/delete', { token, user_id: admin.id });
      showToast(lang === 'zh' ? '管理员已删除' : 'Admin deleted successfully', 'success');
      router.push('/admin/admins');
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.status_msg;
      showToast(msg || (lang === 'zh' ? '删除管理员失败' : 'Failed to delete admin'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Render helpers ─── */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU');
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <BackButton onClick={() => router.push('/admin/admins')}>
              <BackIcon /> {lang === 'zh' ? '返回' : 'Back'}
            </BackButton>
            <Card>
              <SkeletonLine width="40%" />
              <SkeletonLine width="100%" />
              <SkeletonLine width="60%" />
              <SkeletonLine width="80%" />
              <SkeletonLine width="50%" />
              <SkeletonLine width="70%" />
            </Card>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!admin) {
    return (
      <MainLayout>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <BackButton onClick={() => router.push('/admin/admins')}>
              <BackIcon /> {lang === 'zh' ? '返回' : 'Back'}
            </BackButton>
            <Card>
              <CardTitle>{lang === 'zh' ? '管理员未找到' : 'Admin Not Found'}</CardTitle>
              <p style={{ color: '#5c6b7a' }}>
                {lang === 'zh' ? '未找到该管理员信息。' : 'The requested admin could not be found.'}
              </p>
            </Card>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!myProfile?.permissions?.includes('manage_admins')) {
    router.push('/admin');
    return null;
  }

  return (
    <MainLayout>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push('/admin/admins')}>
            <BackIcon /> {lang === 'zh' ? '返回管理员列表' : 'Back to Admins'}
          </BackButton>

          {/* Actions */}
          <ActionsBar>
            {isEditing ? (
              <>
                <SaveButton onClick={handleUpdate} disabled={saving}>
                  {saving ? (lang === 'zh' ? '保存中...' : 'Saving...') : (lang === 'zh' ? '保存' : 'Save')}
                </SaveButton>
                <CancelButton onClick={cancelEditMode}>
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </CancelButton>
              </>
            ) : (
              <>
                <ActionButton onClick={enterEditMode}>
                  <EditIcon /> {lang === 'zh' ? '编辑' : 'Edit'}
                </ActionButton>
                <DangerButton onClick={() => setShowDeleteModal(true)}>
                  <DeleteIcon /> {lang === 'zh' ? '删除' : 'Delete'}
                </DangerButton>
              </>
            )}
          </ActionsBar>

          {/* Details Card */}
          <Card>
            <CardTitle>
              {isEditing
                ? (lang === 'zh' ? '编辑管理员' : 'Edit Admin')
                : `${admin.first_name} ${admin.last_name}`}
            </CardTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '邮箱' : 'Email'}</DetailLabel>
                {isEditing ? (
                  <FormInput value={formData.email} disabled />
                ) : (
                  <DetailValue>{admin.email}</DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '名字' : 'First Name'} {isEditing && '*'}</DetailLabel>
                {isEditing ? (
                  <>
                    <FormInput
                      placeholder={lang === 'zh' ? '输入名字' : 'Enter first name'}
                      value={formData.first_name}
                      onChange={e => handleInputChange('first_name', e.target.value)}
                    />
                    {formErrors.first_name && <ErrorText>{formErrors.first_name}</ErrorText>}
                  </>
                ) : (
                  <DetailValue>{admin.first_name}</DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '姓氏' : 'Last Name'} {isEditing && '*'}</DetailLabel>
                {isEditing ? (
                  <>
                    <FormInput
                      placeholder={lang === 'zh' ? '输入姓氏' : 'Enter last name'}
                      value={formData.last_name}
                      onChange={e => handleInputChange('last_name', e.target.value)}
                    />
                    {formErrors.last_name && <ErrorText>{formErrors.last_name}</ErrorText>}
                  </>
                ) : (
                  <DetailValue>{admin.last_name}</DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '角色' : 'Role'} {isEditing && '*'}</DetailLabel>
                {isEditing ? (
                  <>
                    <FormSelect
                      value={formData.role}
                      onChange={e => handleInputChange('role', e.target.value)}
                    >
                      <option value="admin">{lang === 'zh' ? '管理员' : 'Admin'}</option>
                      <option value="super_admin">{lang === 'zh' ? '超级管理员' : 'Super Admin'}</option>
                    </FormSelect>
                    {formErrors.role && <ErrorText>{formErrors.role}</ErrorText>}
                  </>
                ) : (
                  <DetailValue>
                    <RoleBadge $role={admin.role}>
                      {ROLE_LABELS[admin.role]?.[lang] || admin.role}
                    </RoleBadge>
                  </DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '状态' : 'Status'}</DetailLabel>
                {isEditing ? (
                  <FormSelect
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                  >
                    <option value="active">{lang === 'zh' ? '活跃' : 'Active'}</option>
                    <option value="suspended">{lang === 'zh' ? '挂起' : 'Suspended'}</option>
                  </FormSelect>
                ) : (
                  <DetailValue>
                    <StatusBadge $status={admin.status || 'active'}>
                      {lang === 'zh' 
                        ? (admin.status === 'active' ? '活跃' : admin.status === 'inactive' ? '隐闭' : admin.status === 'suspended' ? '挂起' : admin.status || 'Active')
                        : (admin.status ? admin.status.charAt(0).toUpperCase() + admin.status.slice(1) : 'Active')}
                    </StatusBadge>
                  </DetailValue>
                )}
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '创建时间' : 'Created At'}</DetailLabel>
                <DetailValue>{formatDate(admin.created_at)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '更新时间' : 'Updated At'}</DetailLabel>
                <DetailValue>{formatDate(admin.updated_at)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '最后登录' : 'Last Login'}</DetailLabel>
                <DetailValue>{formatDate(admin.last_login)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{lang === 'zh' ? '用户ID' : 'User ID'}</DetailLabel>
                <DetailValue>{admin.id}</DetailValue>
              </DetailItem>
              {isEditing && (
                <>
                  <DetailItem>
                    <DetailLabel>
                      {lang === 'zh' ? '密码' : 'Password'}
                      <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: '0.5rem', textTransform: 'none', letterSpacing: 0 }}>
                        ({lang === 'zh' ? '留空则不修改' : 'Leave blank to keep unchanged'})
                      </span>
                    </DetailLabel>
                    <PasswordWrapper>
                      <FormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder={lang === 'zh' ? '输入新密码（可选）' : 'Enter new password (optional)'}
                        value={formData.password}
                        onChange={e => handleInputChange('password', e.target.value)}
                      />
                      <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show')}
                      </PasswordToggle>
                    </PasswordWrapper>
                    {formErrors.password && <ErrorText>{formErrors.password}</ErrorText>}
                  </DetailItem>
                  {formData.password && (
                    <DetailItem>
                      <DetailLabel>{lang === 'zh' ? '确认密码' : 'Confirm Password'} *</DetailLabel>
                      <PasswordWrapper>
                        <FormInput
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={lang === 'zh' ? '确认密码' : 'Confirm password'}
                          value={formData.confirm_password}
                          onChange={e => handleInputChange('confirm_password', e.target.value)}
                        />
                        <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show')}
                        </PasswordToggle>
                      </PasswordWrapper>
                      {formErrors.confirm_password && <ErrorText>{formErrors.confirm_password}</ErrorText>}
                    </DetailItem>
                  )}
                </>
              )}
            </DetailGrid>
          </Card>

          {/* Permission Management Card */}
          <Card>
            <CardTitle>
              {lang === 'zh' ? '权限管理' : 'Permission Management'}
            </CardTitle>
            <PermissionSectionsGrid>
              {(isEditing ? editModePermissions : permissionCategories).map((category, catIdx) => (
                <PermissionSection key={catIdx}>
                  <PermissionSubtitle>
                    {lang === 'zh' ? category.category_zh : category.category_en}
                  </PermissionSubtitle>
                  <PermissionGrid>
                    {category.permissions.map(perm => (
                      <PermissionCheckboxItem key={perm.id}>
                        <PermissionCheckbox
                          type="checkbox"
                          id={`perm-${perm.id}`}
                          checked={perm.enabled}
                          onChange={() => isEditing ? handleEditModePermissionToggle(perm.id) : undefined}
                          disabled={!isEditing}
                        />
                        <PermissionLabel htmlFor={`perm-${perm.id}`} $disabled={!isEditing}>
                          {lang === 'zh' ? perm.name_zh : perm.name_en}
                        </PermissionLabel>
                      </PermissionCheckboxItem>
                    ))}
                  </PermissionGrid>
                </PermissionSection>
              ))}
            </PermissionSectionsGrid>
          </Card>

          {/* Audit Logs Section */}
          <Card>
            <AuditLogSection>
              <AuditLogTitle>
                {lang === 'zh' ? '活动历史' : 'Activity History'}
              </AuditLogTitle>
              
              {loadingAuditLogs ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  {lang === 'zh' ? '加载中...' : 'Loading...'}
                </div>
              ) : auditLogs.length === 0 ? (
                <AuditEmpty>
                  {lang === 'zh' ? '暂无活动记录' : 'No activity recorded'}
                </AuditEmpty>
              ) : (
                <>
                  {/* Date Range Filter */}
                  <DateRangeFilter>
                    <FilterRow>
                      <DateInputGroup>
                        <DateLabel>{lang === 'zh' ? '开始日期' : 'Start Date'}</DateLabel>
                        <DateInput
                          type="date"
                          value={auditDateStart}
                          onChange={(e) => {
                            setAuditDateStart(e.target.value);
                            setAuditCurrentPage(1);
                          }}
                        />
                      </DateInputGroup>
                      <DateInputGroup>
                        <DateLabel>{lang === 'zh' ? '结束日期' : 'End Date'}</DateLabel>
                        <DateInput
                          type="date"
                          value={auditDateEnd}
                          onChange={(e) => {
                            setAuditDateEnd(e.target.value);
                            setAuditCurrentPage(1);
                          }}
                        />
                      </DateInputGroup>
                      {(auditDateStart || auditDateEnd) && (
                        <ClearFilterButton
                          onClick={() => {
                            setAuditDateStart('');
                            setAuditDateEnd('');
                            setAuditCurrentPage(1);
                          }}
                        >
                          {lang === 'zh' ? '清除' : 'Clear'}
                        </ClearFilterButton>
                      )}
                    </FilterRow>
                    <PresetButtonGroup>
                      <PresetButton onClick={() => handlePresetClick('today')}>
                        {lang === 'zh' ? '今天' : 'Today'}
                      </PresetButton>
                      <PresetButton onClick={() => handlePresetClick('last7days')}>
                        {lang === 'zh' ? '最近7天' : 'Last 7 Days'}
                      </PresetButton>
                      <PresetButton onClick={() => handlePresetClick('last30days')}>
                        {lang === 'zh' ? '最近30天' : 'Last 30 Days'}
                      </PresetButton>
                      <PresetButton onClick={() => handlePresetClick('alltime')}>
                        {lang === 'zh' ? '全部' : 'All Time'}
                      </PresetButton>
                    </PresetButtonGroup>
                  </DateRangeFilter>

                  {/* Results Count */}
                  <PaginationInfo>
                    {filteredAuditLogs.length === 0
                      ? (lang === 'zh' ? '没有匹配的记录' : 'No matching records')
                      : `${(auditCurrentPage - 1) * auditItemsPerPage + 1} - ${Math.min(auditCurrentPage * auditItemsPerPage, filteredAuditLogs.length)} ${lang === 'zh' ? '共' : 'of'} ${filteredAuditLogs.length}`}
                  </PaginationInfo>

                  {filteredAuditLogs.length === 0 ? (
                    <AuditEmpty>
                      {lang === 'zh' ? '该日期范围内无活动记录' : 'No activity recorded for this date range'}
                    </AuditEmpty>
                  ) : (
                    <>
                      <AuditTable>
                        <AuditThead>
                          <tr>
                            <AuditTh>{lang === 'zh' ? '时间' : 'Timestamp'}</AuditTh>
                            <AuditTh>{lang === 'zh' ? '操作' : 'Action'}</AuditTh>
                            <AuditTh>{lang === 'zh' ? '操作者' : 'Actor'}</AuditTh>
                            <AuditTh>{lang === 'zh' ? '详情' : 'Details'}</AuditTh>
                          </tr>
                        </AuditThead>
                        <AuditTbody>
                          {paginatedAuditLogs.map((log, idx) => (
                            <AuditTr key={idx}>
                              <AuditTd style={{ fontSize: '0.8125rem' }}>
                                {new Date(log.timestamp).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-AU')}
                              </AuditTd>
                              <AuditTd>
                                <ActionBadge $action={log.action}>{log.action}</ActionBadge>
                              </AuditTd>
                              <AuditTd style={{ fontSize: '0.8125rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {log.actor_email}
                              </AuditTd>
                              <AuditTd style={{ fontSize: '0.8125rem', maxWidth: '300px' }}>
                                {log.details}
                              </AuditTd>
                            </AuditTr>
                          ))}
                        </AuditTbody>
                      </AuditTable>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <PaginationContainer>
                          <PaginationButton
                            $disabled={auditCurrentPage === 1}
                            onClick={() => setAuditCurrentPage(1)}
                            disabled={auditCurrentPage === 1}
                          >
                            {lang === 'zh' ? '首页' : 'First'}
                          </PaginationButton>
                          <PaginationButton
                            $disabled={auditCurrentPage === 1}
                            onClick={() => setAuditCurrentPage(p => Math.max(1, p - 1))}
                            disabled={auditCurrentPage === 1}
                          >
                            {lang === 'zh' ? '上一页' : 'Prev'}
                          </PaginationButton>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 5) {
                              if (auditCurrentPage <= 3) {
                                pageNum = i + 1;
                              } else if (auditCurrentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = auditCurrentPage - 2 + i;
                              }
                            }
                            return (
                              <PaginationButton
                                key={pageNum}
                                $active={auditCurrentPage === pageNum}
                                onClick={() => setAuditCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </PaginationButton>
                            );
                          })}

                          <PaginationButton
                            $disabled={auditCurrentPage === totalPages}
                            onClick={() => setAuditCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={auditCurrentPage === totalPages}
                          >
                            {lang === 'zh' ? '下一页' : 'Next'}
                          </PaginationButton>
                          <PaginationButton
                            $disabled={auditCurrentPage === totalPages}
                            onClick={() => setAuditCurrentPage(totalPages)}
                            disabled={auditCurrentPage === totalPages}
                          >
                            {lang === 'zh' ? '末页' : 'Last'}
                          </PaginationButton>
                        </PaginationContainer>
                      )}
                    </>
                  )}
                </>
              )}
            </AuditLogSection>
          </Card>

          {/* ─── Delete Confirmation Modal ─── */}
          {showDeleteModal && (
            <ModalOverlay onClick={() => setShowDeleteModal(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>{lang === 'zh' ? '确认删除' : 'Confirm Delete'}</ModalTitle>
                  <ModalCloseButton onClick={() => setShowDeleteModal(false)}>&times;</ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                  <ConfirmText>
                    {lang === 'zh'
                      ? `确定要删除管理员 "${admin.first_name} ${admin.last_name}" (${admin.email}) 吗？`
                      : `Are you sure you want to delete admin "${admin.first_name} ${admin.last_name}" (${admin.email})?`}
                  </ConfirmText>
                  <ConfirmWarning>
                    {lang === 'zh'
                      ? '此操作不可撤销。该管理员将无法再登录系统。'
                      : 'This action cannot be undone. The admin will no longer be able to log in.'}
                  </ConfirmWarning>
                </ModalBody>
                <ModalFooter>
                  <CancelButton onClick={() => setShowDeleteModal(false)}>
                    {lang === 'zh' ? '取消' : 'Cancel'}
                  </CancelButton>
                  <ModalDangerButton onClick={handleDelete} disabled={deleting}>
                    {deleting ? (lang === 'zh' ? '删除中...' : 'Deleting...') : (lang === 'zh' ? '删除' : 'Delete')}
                  </ModalDangerButton>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}
        </MainContent>
      </Container>
    </MainLayout>
  );
}
