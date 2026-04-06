"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../components/layout/AdminSidebar";

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
  @media (max-width: 968px) { font-size: 1.5rem; }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #5c6b7a;
  @media (max-width: 968px) { font-size: 0.875rem; }
`;

const AddButton = styled.button`
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
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  @media (max-width: 968px) { width: 100%; padding: 1rem; font-size: 0.9375rem; }
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
  @media (max-width: 968px) { flex-direction: column; padding: 1rem; }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  &:focus { outline: none; border-color: #1a237e; box-shadow: 0 0 0 3px rgba(26,35,126,0.1); }
  &::placeholder { color: #9ca3af; }
  @media (max-width: 968px) { width: 100%; }
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
  &:hover { background: #d1d5db; }
  @media (max-width: 968px) { width: 100%; }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  padding: 2rem;
  @media (max-width: 968px) { padding: 1rem; overflow-x: auto; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  @media (max-width: 968px) { min-width: 800px; }
`;

const Thead = styled.thead`background: #f7faff;`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  @media (max-width: 968px) { padding: 0.75rem 0.5rem; font-size: 0.75rem; }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e0e7ef;
  transition: background 0.2s ease;
  &:hover { background: #f7faff; }
`;

const Td = styled.td`
  padding: 1rem;
  color: #0a3655;
  font-size: 0.9375rem;
  @media (max-width: 968px) { padding: 0.75rem 0.5rem; font-size: 0.8125rem; }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'view' }>`
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
      case 'edit':
        return `background: #dbeafe; color: #1e40af; &:hover { background: #bfdbfe; }`;
      case 'delete':
        return `background: #fee2e2; color: #991b1b; &:hover { background: #fecaca; }`;
      default:
        return `background: #dbeafe; color: #1e40af; &:hover { background: #bfdbfe; }`;
    }
  }}
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  @media (max-width: 968px) { padding: 0.4rem 0.6rem; font-size: 0.75rem; margin-right: 0.25rem; margin-bottom: 0.25rem; }
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

const RoleBadge = styled.span<{ $role: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
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
  &:disabled { background: #f3f4f6; cursor: not-allowed; }
`;

/* Skeleton */
const SkeletonRow = styled.tr`border-bottom: 1px solid #e0e7ef;`;
const SkeletonCell = styled.td`padding: 1rem; @media(max-width:968px){padding:0.75rem 0.5rem;}`;
const SkeletonBox = styled.div<{ width?: string; height?: string }>`
  height: ${p => p.height || '16px'};
  width: ${p => p.width || '100%'};
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;
const SkeletonButton = styled.div`
  display: inline-block; height: 32px; width: 60px;
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; margin-right: 0.5rem;
`;

/* ─── Modal ─── */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
  @keyframes modalSlideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e7ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a3655;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #5c6b7a;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s;
  &:hover { color: #0a3655; }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const ModalFooter = styled.div`
  padding: 1.25rem 2rem;
  border-top: 1px solid #e0e7ef;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a3655;
  margin-bottom: 0.5rem;
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
  &::placeholder { color: #9ca3af; }
  &:disabled { background: #f3f4f6; cursor: not-allowed; }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #5c6b7a;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.8125rem;
  &:hover { color: #0a3655; }
`;

const PasswordField = styled.div`
  position: relative;
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: #2563eb; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
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

const ErrorText = styled.span`
  font-size: 0.8125rem;
  color: #dc2626;
  margin-top: 0.25rem;
  display: block;
`;

/* ─── Icons ─── */

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/* ─── Types ─── */

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

interface AdminFormData {
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'super_admin';
  password: string;
  confirm_password: string;
}

type ModalMode = null | 'create';

const emptyForm: AdminFormData = {
  email: '',
  first_name: '',
  last_name: '',
  role: 'admin',
  password: '',
  confirm_password: '',
};

const ROLE_LABELS: Record<string, { en: string; zh: string }> = {
  admin: { en: 'Admin', zh: '管理员' },
  super_admin: { en: 'Super Admin', zh: '超级管理员' },
};

/* ─── Page Component ─── */

export default function AdminManagementPage() {
  const router = useRouter();
  const { token, role, isLoading, adminProfile } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [formData, setFormData] = useState<AdminFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ─── Auth guard ─── */
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    } else if (!isLoading && token && role !== "admin") {
      router.push("/agent");
    }
  }, [token, role, isLoading, router]);

  /* ─── Fetch admins ─── */
  const fetchAdmins = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const listResponse = await axios.post('/api/admin/list', { token });

      if (listResponse.data?.user_IDs) {
        const userDetailsPromises = listResponse.data.user_IDs.map((userId: string) =>
          axios.post('/api/admin/detail', { token, user_id: userId })
        );

        const detailsResponses = await Promise.all(userDetailsPromises);
        const adminList = detailsResponses
          .filter(res => res.data?.status_code === 200)
          .map(res => ({
            id: res.data.user_id || res.data.id,
            email: res.data.email || '',
            first_name: res.data.first_name || '',
            last_name: res.data.last_name || '',
            role: res.data.role || 'admin',
            created_at: res.data.created_at || new Date().toISOString(),
            updated_at: res.data.updated_at,
            last_login: res.data.last_login,
          }));
        setAdmins(adminList);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      showToast(
        lang === 'zh' ? '获取管理员列表失败' : 'Failed to fetch admin list',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [token, lang, showToast]);

  useEffect(() => {
    if (token) fetchAdmins();
  }, [token, fetchAdmins]);

  /* ─── Filter ─── */
  const filteredAdmins = admins.filter(admin => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      admin.email?.toLowerCase().includes(q) ||
      `${admin.first_name} ${admin.last_name}`.toLowerCase().includes(q) ||
      (ROLE_LABELS[admin.role]?.en.toLowerCase().includes(q) || ROLE_LABELS[admin.role]?.zh.includes(q))
    );
  });

  /* ─── Validation ─── */
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AdminFormData, string>> = {};

    if (!formData.email.trim()) {
      errors.email = lang === 'zh' ? '请输入邮箱' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = lang === 'zh' ? '邮箱格式无效' : 'Invalid email format';
    }

    if (!formData.first_name.trim()) {
      errors.first_name = lang === 'zh' ? '请输入名' : 'First name is required';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = lang === 'zh' ? '请输入姓' : 'Last name is required';
    }

    // Password required for create
    if (modalMode === 'create') {
      if (!formData.password) {
        errors.password = lang === 'zh' ? '请输入密码' : 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = lang === 'zh' ? '密码至少8个字符' : 'Password must be at least 8 characters';
      }
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      errors.confirm_password = lang === 'zh' ? '两次密码不一致' : 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ─── Modal helpers ─── */
  const openCreateModal = () => {
    setFormData(emptyForm);
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setModalMode('create');
  };

  const closeModal = () => {
    setModalMode(null);
    setFormData(emptyForm);
    setFormErrors({});
    setSaving(false);
  };

  const handleInputChange = (field: keyof AdminFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /* ─── Create ─── */
  const handleCreate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await axios.post('/api/admin/create', {
        token,
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
        password: formData.password,
      });
      showToast(lang === 'zh' ? '管理员创建成功' : 'Admin created successfully', 'success');
      closeModal();
      fetchAdmins();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.status_msg;
      showToast(
        msg || (lang === 'zh' ? '创建管理员失败' : 'Failed to create admin'),
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  /* ─── Render helpers ─── */
  const renderSkeletonTable = () => (
    <Table>
      <Thead>
        <Tr>
          <Th>{lang === "zh" ? "姓名" : "Name"}</Th>
          <Th>{lang === "zh" ? "邮箱" : "Email"}</Th>
          <Th>{lang === "zh" ? "角色" : "Role"}</Th>
          <Th>{lang === "zh" ? "创建时间" : "Created At"}</Th>
          <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[1, 2, 3, 4, 5].map(i => (
          <SkeletonRow key={i}>
            <SkeletonCell><SkeletonBox width="120px" /></SkeletonCell>
            <SkeletonCell><SkeletonBox width="180px" /></SkeletonCell>
            <SkeletonCell><SkeletonBox width="80px" /></SkeletonCell>
            <SkeletonCell><SkeletonBox width="90px" /></SkeletonCell>
            <SkeletonCell><SkeletonButton /><SkeletonButton /></SkeletonCell>
          </SkeletonRow>
        ))}
      </Tbody>
    </Table>
  );

  const renderFormFields = () => (
    <>
      <FormGroup>
        <FormLabel>{lang === 'zh' ? '邮箱' : 'Email'} *</FormLabel>
        <FormInput
          type="email"
          placeholder={lang === 'zh' ? '输入邮箱地址' : 'Enter email address'}
          value={formData.email}
          onChange={e => handleInputChange('email', e.target.value)}
        />
        {formErrors.email && <ErrorText>{formErrors.email}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <FormLabel>{lang === 'zh' ? '名' : 'First Name'} *</FormLabel>
        <FormInput
          type="text"
          placeholder={lang === 'zh' ? '输入名' : 'Enter first name'}
          value={formData.first_name}
          onChange={e => handleInputChange('first_name', e.target.value)}
        />
        {formErrors.first_name && <ErrorText>{formErrors.first_name}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <FormLabel>{lang === 'zh' ? '姓' : 'Last Name'} *</FormLabel>
        <FormInput
          type="text"
          placeholder={lang === 'zh' ? '输入姓' : 'Enter last name'}
          value={formData.last_name}
          onChange={e => handleInputChange('last_name', e.target.value)}
        />
        {formErrors.last_name && <ErrorText>{formErrors.last_name}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <FormLabel>{lang === 'zh' ? '角色' : 'Role'} *</FormLabel>
        <FormSelect
          value={formData.role}
          onChange={e => handleInputChange('role', e.target.value)}
        >
          <option value="admin">{lang === 'zh' ? '管理员' : 'Admin'}</option>
          <option value="super_admin">{lang === 'zh' ? '超级管理员' : 'Super Admin'}</option>
        </FormSelect>
      </FormGroup>

      <FormGroup>
        <FormLabel>
          {lang === 'zh' ? '密码' : 'Password'} *
        </FormLabel>
        <PasswordField>
          <FormInput
            type={showPassword ? 'text' : 'password'}
            placeholder={lang === 'zh' ? '输入密码' : 'Enter password'}
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            autoComplete="new-password"
          />
          <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show')}
          </PasswordToggle>
        </PasswordField>
        {formErrors.password && <ErrorText>{formErrors.password}</ErrorText>}
      </FormGroup>

      {formData.password && (
        <FormGroup>
          <FormLabel>{lang === 'zh' ? '确认密码' : 'Confirm Password'} *</FormLabel>
          <PasswordField>
            <FormInput
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={lang === 'zh' ? '再次输入密码' : 'Re-enter password'}
              value={formData.confirm_password}
              onChange={e => handleInputChange('confirm_password', e.target.value)}
              autoComplete="new-password"
            />
            <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show')}
            </PasswordToggle>
          </PasswordField>
          {formErrors.confirm_password && <ErrorText>{formErrors.confirm_password}</ErrorText>}
        </FormGroup>
      )}
    </>
  );

  const renderModal = () => {
    if (!modalMode) return null;

    /* ─ Create Modal ─ */
    return (
      <ModalOverlay onClick={closeModal}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{lang === 'zh' ? '添加管理员' : 'Add Admin'}</ModalTitle>
            <ModalCloseButton onClick={closeModal}>&times;</ModalCloseButton>
          </ModalHeader>
          <ModalBody>{renderFormFields()}</ModalBody>
          <ModalFooter>
            <CancelButton onClick={closeModal}>
              {lang === 'zh' ? '取消' : 'Cancel'}
            </CancelButton>
            <SaveButton onClick={handleCreate} disabled={saving}>
              {saving
                ? (lang === 'zh' ? '保存中...' : 'Saving...')
                : (lang === 'zh' ? '保存' : 'Save')}
            </SaveButton>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    );
  };

  /* ─── Loading state ─── */
  if (isLoading) {
    return (
      <MainLayout currentPage={lang === "zh" ? "管理员管理" : "Admin Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <ContentHeader>
              <HeaderLeft>
                <SkeletonBox width="200px" height="32px" style={{ marginBottom: '0.5rem' }} />
                <SkeletonBox width="350px" height="16px" />
              </HeaderLeft>
              <SkeletonBox width="140px" height="48px" />
            </ContentHeader>
            <SearchFilterContainer>
              <SkeletonBox width="100%" height="42px" />
            </SearchFilterContainer>
            <TableContainer>
              <TableWrapper>{renderSkeletonTable()}</TableWrapper>
            </TableContainer>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  if (!token || role !== "admin") return null;

  if (!adminProfile?.permissions?.includes('manage_admins')) {
    router.push('/admin');
    return null;
  }

  /* ─── Main render ─── */
  return (
    <MainLayout currentPage={lang === "zh" ? "管理员管理" : "Admin Management"} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <HeaderLeft>
              <PageTitle>{lang === "zh" ? "管理员管理" : "Admin Management"}</PageTitle>
              <PageDescription>
                {lang === "zh"
                  ? "管理系统管理员账户和权限"
                  : "Manage system administrator accounts and permissions"}
              </PageDescription>
            </HeaderLeft>
            <AddButton onClick={openCreateModal}>
              <PlusIcon />
              {lang === "zh" ? "添加管理员" : "Add Admin"}
            </AddButton>
          </ContentHeader>

          <SearchFilterContainer>
            <SearchInput
              type="text"
              placeholder={lang === "zh" ? "搜索邮箱、姓名或用户名..." : "Search email, name or username..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <ClearButton onClick={() => setSearchQuery('')}>
                {lang === "zh" ? "清除" : "Clear"}
              </ClearButton>
            )}
          </SearchFilterContainer>

          <TableContainer>
            <TableWrapper>
              {loading ? (
                renderSkeletonTable()
              ) : filteredAdmins.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>👤</EmptyIcon>
                  <EmptyText>{lang === "zh" ? "暂无管理员" : "No admins found"}</EmptyText>
                  <EmptySubtext>
                    {searchQuery
                      ? (lang === "zh" ? "尝试更改搜索条件" : "Try adjusting your search query")
                      : (lang === "zh" ? "点击上方按钮添加新管理员" : "Click the button above to add a new admin")}
                  </EmptySubtext>
                </EmptyState>
              ) : (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>{lang === "zh" ? "姓名" : "Name"}</Th>
                      <Th>{lang === "zh" ? "邮箱" : "Email"}</Th>
                      <Th>{lang === "zh" ? "角色" : "Role"}</Th>
                      <Th>{lang === "zh" ? "创建时间" : "Created At"}</Th>
                      <Th>{lang === "zh" ? "操作" : "Actions"}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredAdmins.map(admin => (
                      <Tr key={admin.id}>
                        <Td>{admin.first_name} {admin.last_name}</Td>
                        <Td>{admin.email}</Td>
                        <Td>
                          <RoleBadge $role={admin.role}>
                            {ROLE_LABELS[admin.role]?.[lang] || admin.role}
                          </RoleBadge>
                        </Td>
                        <Td>
                          {admin.created_at
                            ? new Date(admin.created_at).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-AU')
                            : '-'}
                        </Td>
                        <Td>
                          <ActionButton $variant="view" onClick={() => router.push(`/admin/admins/${admin.id}`)}>
                            {lang === "zh" ? "查看" : "View"}
                          </ActionButton>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TableWrapper>
          </TableContainer>
        </MainContent>
      </Container>

      {renderModal()}
    </MainLayout>
  );
}
