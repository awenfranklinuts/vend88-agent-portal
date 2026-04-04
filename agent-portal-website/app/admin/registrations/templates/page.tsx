"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../../components/layout/AdminSidebar";
import { FormFieldSelector, type FormField } from "@/components/FormFieldSelector";

/* ─── Types ─── */
interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  version: number;
  visibility: 'all' | 'admin_only' | 'specific_roles';
  visible_roles: string[];
  status: 'active' | 'draft' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

type ModalMode = null | 'create' | 'edit' | 'delete';

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
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #5c6b7a;
  font-size: 0.9375rem;
  margin: 0;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:hover { background: #2563eb; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3); }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${p => p.$active ? '#3b82f6' : '#e0e7ef'};
  background: ${p => p.$active ? '#3b82f6' : 'white'};
  color: ${p => p.$active ? 'white' : '#5c6b7a'};
  &:hover { border-color: #3b82f6; }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
`;

const TemplateCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
  padding: 1.5rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(30, 64, 175, 0.12); }
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const TemplateName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a3655;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.2rem 0.625rem;
  border-radius: 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  ${p => {
    switch (p.$status) {
      case 'active': return 'background: rgba(5,150,105,0.1); color: #059669;';
      case 'draft': return 'background: rgba(234,179,8,0.12); color: #b45309;';
      case 'archived': return 'background: #e5e7eb; color: #6b7280;';
      default: return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const TemplateDesc = styled.p`
  color: #5c6b7a;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  flex: 1;
`;

const TemplateMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f4f8;
  margin-bottom: 1rem;
`;

const MetaItem = styled.span`
  font-size: 0.75rem;
  color: #5c6b7a;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MetaValue = styled.span`
  font-weight: 600;
  color: #0a3655;
`;

const VisibilityBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  ${p => {
    switch (p.$type) {
      case 'all': return 'background: rgba(59,130,246,0.1); color: #2563eb;';
      case 'admin_only': return 'background: rgba(126,34,206,0.1); color: #7e22ce;';
      case 'specific_roles': return 'background: rgba(234,88,12,0.1); color: #ea580c;';
      default: return 'background: #e5e7eb; color: #374151;';
    }
  }}
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CardButton = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  ${p => {
    switch (p.$variant) {
      case 'primary': return 'background: #3b82f6; color: white; &:hover { background: #2563eb; }';
      case 'danger': return 'background: rgba(239,68,68,0.1); color: #dc2626; &:hover { background: rgba(239,68,68,0.2); }';
      default: return 'background: #f3f4f6; color: #374151; &:hover { background: #e5e7eb; }';
    }
  }}
`;

/* ─── Modal Components ─── */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 54, 85, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  width: min(600px, 95vw);
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
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #0a3655;
  transition: all 0.2s ease;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
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
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #0a3655;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  transition: all 0.2s ease;
  &:hover { border-color: #3b82f6; }
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

const DangerModalButton = styled.button`
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

const ErrorText = styled.span`
  font-size: 0.8125rem;
  color: #dc2626;
  margin-top: 0.25rem;
  display: block;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #5c6b7a;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  color: #0a3655;
  margin-bottom: 0.5rem;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.08);
`;

const SkeletonLine = styled.div<{ width?: string }>`
  height: 1rem;
  width: ${p => p.width || '100%'};
  background: linear-gradient(90deg, #e0e7ef 25%, #f0f4f8 50%, #e0e7ef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/* ─── Icons ─── */
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const VISIBILITY_LABELS: Record<string, { en: string; zh: string }> = {
  all: { en: 'Everyone', zh: '所有人' },
  admin_only: { en: 'Admin Only', zh: '仅管理员' },
  specific_roles: { en: 'Specific Roles', zh: '指定角色' },
};

const STATUS_LABELS: Record<string, { en: string; zh: string }> = {
  active: { en: 'Active', zh: '活跃' },
  draft: { en: 'Draft', zh: '草稿' },
  archived: { en: 'Archived', zh: '已归档' },
};

const ROLE_OPTIONS = [
  { value: 'admin', labelEn: 'Admin', labelZh: '管理员' },
  { value: 'super_admin', labelEn: 'Super Admin', labelZh: '超级管理员' },
];

/* ─── Page Component ─── */

export default function FormTemplatesPage() {
  const router = useRouter();
  const { token, role, isLoading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();

  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create/Edit modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVisibility, setFormVisibility] = useState<FormTemplate['visibility']>('all');
  const [formVisibleRoles, setFormVisibleRoles] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<FormTemplate['status']>('active');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Field selector
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [pendingFields, setPendingFields] = useState<FormField[]>([]);

  /* ─── Fetch templates ─── */
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/form-templates/list', {
        params: { status: filterStatus },
      });
      setTemplates(res.data.data || []);
    } catch {
      showToast(lang === 'zh' ? '获取模板列表失败' : 'Failed to load templates', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, lang, showToast]);

  useEffect(() => {
    if (!authLoading && !token) { router.push('/login'); return; }
    if (!authLoading && role !== 'admin' && (role as string) !== 'super_admin') { router.push('/admin'); return; }
    if (token) fetchTemplates();
  }, [authLoading, token, role, router, fetchTemplates]);

  /* ─── Modal helpers ─── */
  const openCreateModal = () => {
    setFormName('');
    setFormDescription('');
    setFormVisibility('all');
    setFormVisibleRoles([]);
    setFormStatus('active');
    setPendingFields([]);
    setFormErrors({});
    setSelectedTemplate(null);
    setModalMode('create');
  };

  const openEditModal = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setFormName(template.name);
    setFormDescription(template.description);
    setFormVisibility(template.visibility);
    setFormVisibleRoles(template.visible_roles || []);
    setFormStatus(template.status);
    setPendingFields(template.fields);
    setFormErrors({});
    setModalMode('edit');
  };

  const openDeleteModal = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedTemplate(null);
    setFormErrors({});
    setSaving(false);
  };

  /* ─── Field selector callbacks ─── */
  const openFieldSelector = () => {
    setShowFieldSelector(true);
  };

  const handleFieldsConfirm = (fields: FormField[]) => {
    setPendingFields(fields);
    setShowFieldSelector(false);
  };

  /* ─── Validate ─── */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) {
      errors.name = lang === 'zh' ? '请输入模板名称' : 'Template name is required';
    }
    if (pendingFields.length === 0) {
      errors.fields = lang === 'zh' ? '请至少选择一个表单字段' : 'At least one form field is required';
    }
    if (formVisibility === 'specific_roles' && formVisibleRoles.length === 0) {
      errors.roles = lang === 'zh' ? '请至少选择一个角色' : 'At least one role must be selected';
    }
    // Validate email field is present
    const hasEmail = pendingFields.some(f => f.id === 'contact_email' || f.type === 'email');
    if (pendingFields.length > 0 && !hasEmail) {
      errors.fields = lang === 'zh' ? '邮箱字段是必须的' : 'Email field is mandatory';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ─── Create ─── */
  const handleCreate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await axios.post('/api/form-templates/create', {
        name: formName.trim(),
        description: formDescription.trim(),
        fields: pendingFields,
        visibility: formVisibility,
        visible_roles: formVisibility === 'specific_roles' ? formVisibleRoles : [],
        status: formStatus,
        admin_email: 'admin@vend88.com',
      });
      showToast(lang === 'zh' ? '模板创建成功' : 'Template created successfully', 'success');
      closeModal();
      fetchTemplates();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      showToast(msg || (lang === 'zh' ? '创建模板失败' : 'Failed to create template'), 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Update ─── */
  const handleUpdate = async () => {
    if (!validateForm() || !selectedTemplate) return;
    setSaving(true);
    try {
      await axios.post('/api/form-templates/update', {
        id: selectedTemplate.id,
        name: formName.trim(),
        description: formDescription.trim(),
        fields: pendingFields,
        visibility: formVisibility,
        visible_roles: formVisibility === 'specific_roles' ? formVisibleRoles : [],
        status: formStatus,
        current_version: selectedTemplate.version,
      });
      showToast(
        lang === 'zh'
          ? `模板已更新至版本 ${selectedTemplate.version + 1}`
          : `Template updated to version ${selectedTemplate.version + 1}`,
        'success'
      );
      closeModal();
      fetchTemplates();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      showToast(msg || (lang === 'zh' ? '更新模板失败' : 'Failed to update template'), 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async () => {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      await axios.post('/api/form-templates/delete', { id: selectedTemplate.id });
      showToast(lang === 'zh' ? '模板已删除' : 'Template deleted successfully', 'success');
      closeModal();
      fetchTemplates();
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      showToast(msg || (lang === 'zh' ? '删除模板失败' : 'Failed to delete template'), 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Role checkbox toggle ─── */
  const toggleRole = (role: string) => {
    setFormVisibleRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
    if (formErrors.roles) setFormErrors(prev => ({ ...prev, roles: '' }));
  };

  /* ─── Render ─── */
  const filteredTemplates = filterStatus === 'all'
    ? templates
    : templates.filter(t => t.status === filterStatus);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-AU', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  if (authLoading || (!token && !authLoading)) {
    return (
      <MainLayout>
        <Container>
          <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <MainContent>
            <ContentHeader>
              <HeaderLeft>
                <SkeletonLine width="40%" />
                <SkeletonLine width="70%" />
              </HeaderLeft>
            </ContentHeader>
            <TemplateGrid>
              {[1,2,3].map(i => (
                <SkeletonCard key={i}>
                  <SkeletonLine width="60%" />
                  <SkeletonLine width="100%" />
                  <SkeletonLine width="40%" />
                </SkeletonCard>
              ))}
            </TemplateGrid>
          </MainContent>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPage={lang === 'zh' ? '表单模板' : 'Form Templates'} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <ContentHeader>
            <HeaderLeft>
              <PageTitle>{lang === 'zh' ? '表单模板' : 'Form Templates'}</PageTitle>
              <PageDescription>
                {lang === 'zh'
                  ? '创建和管理可重用的注册表单模板，设置可见性和版本控制'
                  : 'Create and manage reusable registration form templates with visibility and versioning'}
              </PageDescription>
            </HeaderLeft>
            <CreateButton onClick={openCreateModal}>
              <PlusIcon />
              {lang === 'zh' ? '创建模板' : 'Create Template'}
            </CreateButton>
          </ContentHeader>

          <FilterBar>
            {['all', 'active', 'draft', 'archived'].map(status => (
              <FilterChip
                key={status}
                $active={filterStatus === status}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all'
                  ? (lang === 'zh' ? '全部' : 'All')
                  : (STATUS_LABELS[status]?.[lang] || status)}
              </FilterChip>
            ))}
          </FilterBar>

          {loading ? (
            <TemplateGrid>
              {[1,2,3].map(i => (
                <SkeletonCard key={i}>
                  <SkeletonLine width="60%" />
                  <SkeletonLine width="100%" />
                  <SkeletonLine width="40%" />
                  <SkeletonLine width="80%" />
                </SkeletonCard>
              ))}
            </TemplateGrid>
          ) : filteredTemplates.length === 0 ? (
            <EmptyState>
              <EmptyTitle>{lang === 'zh' ? '暂无模板' : 'No Templates Found'}</EmptyTitle>
              <p>{lang === 'zh' ? '创建第一个表单模板以开始使用' : 'Create your first form template to get started'}</p>
            </EmptyState>
          ) : (
            <TemplateGrid>
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id}>
                  <TemplateHeader>
                    <TemplateName>{template.name}</TemplateName>
                    <StatusBadge $status={template.status}>
                      {STATUS_LABELS[template.status]?.[lang] || template.status}
                    </StatusBadge>
                  </TemplateHeader>

                  <TemplateDesc>{template.description || (lang === 'zh' ? '无描述' : 'No description')}</TemplateDesc>

                  <TemplateMeta>
                    <MetaItem>
                      {lang === 'zh' ? '字段' : 'Fields'}: <MetaValue>{template.fields.length}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      {lang === 'zh' ? '版本' : 'Version'}: <MetaValue>v{template.version}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      {lang === 'zh' ? '可见性' : 'Visibility'}:{' '}
                      <VisibilityBadge $type={template.visibility}>
                        {VISIBILITY_LABELS[template.visibility]?.[lang] || template.visibility}
                        {template.visibility === 'specific_roles' && template.visible_roles.length > 0 && (
                          <> ({template.visible_roles.join(', ')})</>
                        )}
                      </VisibilityBadge>
                    </MetaItem>
                    <MetaItem>
                      {lang === 'zh' ? '更新' : 'Updated'}: <MetaValue>{formatDate(template.updated_at)}</MetaValue>
                    </MetaItem>
                  </TemplateMeta>

                  <CardActions>
                    <CardButton $variant="primary" onClick={() => openEditModal(template)}>
                      {lang === 'zh' ? '编辑' : 'Edit'}
                    </CardButton>
                    <CardButton onClick={() => {
                      // Duplicate — open create modal pre-filled with this template's data
                      setSelectedTemplate(null);
                      setFormName(`${template.name} (Copy)`);
                      setFormDescription(template.description);
                      setFormVisibility(template.visibility);
                      setFormVisibleRoles(template.visible_roles || []);
                      setFormStatus('draft');
                      setPendingFields(template.fields);
                      setFormErrors({});
                      setModalMode('create');
                    }}>
                      {lang === 'zh' ? '复制' : 'Duplicate'}
                    </CardButton>
                    <CardButton $variant="danger" onClick={() => openDeleteModal(template)}>
                      {lang === 'zh' ? '删除' : 'Delete'}
                    </CardButton>
                  </CardActions>
                </TemplateCard>
              ))}
            </TemplateGrid>
          )}

          {/* ─── Create / Edit Modal ─── */}
          {(modalMode === 'create' || modalMode === 'edit') && (
            <ModalOverlay onClick={closeModal}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>
                    {modalMode === 'create'
                      ? (lang === 'zh' ? '创建表单模板' : 'Create Form Template')
                      : (lang === 'zh' ? '编辑表单模板' : 'Edit Form Template')}
                  </ModalTitle>
                  <ModalCloseButton onClick={closeModal}>&times;</ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <FormLabel>{lang === 'zh' ? '模板名称' : 'Template Name'} *</FormLabel>
                    <FormInput
                      placeholder={lang === 'zh' ? '例如：标准注册表单' : 'e.g. Standard Onboarding Form'}
                      value={formName}
                      onChange={e => {
                        setFormName(e.target.value);
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                      }}
                    />
                    {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>{lang === 'zh' ? '描述' : 'Description'}</FormLabel>
                    <FormTextarea
                      placeholder={lang === 'zh' ? '模板用途说明...' : 'Describe the purpose of this template...'}
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>{lang === 'zh' ? '状态' : 'Status'} *</FormLabel>
                    <FormSelect value={formStatus} onChange={e => setFormStatus(e.target.value as FormTemplate['status'])}>
                      <option value="active">{lang === 'zh' ? '活跃' : 'Active'}</option>
                      <option value="draft">{lang === 'zh' ? '草稿' : 'Draft'}</option>
                      <option value="archived">{lang === 'zh' ? '已归档' : 'Archived'}</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>{lang === 'zh' ? '可见性' : 'Visibility'} *</FormLabel>
                    <FormSelect
                      value={formVisibility}
                      onChange={e => {
                        setFormVisibility(e.target.value as FormTemplate['visibility']);
                        if (formErrors.roles) setFormErrors(prev => ({ ...prev, roles: '' }));
                      }}
                    >
                      <option value="all">{lang === 'zh' ? '所有人' : 'Everyone'}</option>
                      <option value="admin_only">{lang === 'zh' ? '仅管理员' : 'Admin Only'}</option>
                      <option value="specific_roles">{lang === 'zh' ? '指定角色' : 'Specific Roles'}</option>
                    </FormSelect>
                  </FormGroup>

                  {formVisibility === 'specific_roles' && (
                    <FormGroup>
                      <FormLabel>{lang === 'zh' ? '选择角色' : 'Select Roles'} *</FormLabel>
                      <CheckboxGroup>
                        {ROLE_OPTIONS.map(opt => (
                          <CheckboxLabel key={opt.value}>
                            <input
                              type="checkbox"
                              checked={formVisibleRoles.includes(opt.value)}
                              onChange={() => toggleRole(opt.value)}
                            />
                            {lang === 'zh' ? opt.labelZh : opt.labelEn}
                          </CheckboxLabel>
                        ))}
                      </CheckboxGroup>
                      {formErrors.roles && <ErrorText>{formErrors.roles}</ErrorText>}
                    </FormGroup>
                  )}

                  <FormGroup>
                    <FormLabel>{lang === 'zh' ? '表单字段' : 'Form Fields'} *</FormLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <SaveButton
                        type="button"
                        onClick={openFieldSelector}
                        style={{ background: pendingFields.length > 0 ? '#059669' : '#3b82f6' }}
                      >
                        {pendingFields.length > 0
                          ? (lang === 'zh' ? `已选 ${pendingFields.length} 个字段 — 点击修改` : `${pendingFields.length} Fields Selected — Click to Edit`)
                          : (lang === 'zh' ? '选择表单字段' : 'Select Form Fields')}
                      </SaveButton>
                    </div>
                    {formErrors.fields && <ErrorText>{formErrors.fields}</ErrorText>}
                    {pendingFields.length > 0 && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {pendingFields.map(f => (
                          <span
                            key={f.id}
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.5rem',
                              background: f.required ? 'rgba(59,130,246,0.08)' : '#f3f4f6',
                              color: f.required ? '#3b82f6' : '#6b7280',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {f.label}{f.required ? ' *' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </FormGroup>

                  {modalMode === 'edit' && selectedTemplate && (
                    <div style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.8125rem',
                      color: '#92400e',
                    }}>
                      {lang === 'zh'
                        ? `保存后版本将从 v${selectedTemplate.version} 更新至 v${selectedTemplate.version + 1}`
                        : `Saving will update the version from v${selectedTemplate.version} to v${selectedTemplate.version + 1}`}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <CancelButton onClick={closeModal}>
                    {lang === 'zh' ? '取消' : 'Cancel'}
                  </CancelButton>
                  <SaveButton
                    onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                    disabled={saving}
                  >
                    {saving
                      ? (lang === 'zh' ? '保存中...' : 'Saving...')
                      : (lang === 'zh' ? '保存' : 'Save')}
                  </SaveButton>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}

          {/* ─── Delete Confirmation ─── */}
          {modalMode === 'delete' && selectedTemplate && (
            <ModalOverlay onClick={closeModal}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>{lang === 'zh' ? '确认删除' : 'Confirm Delete'}</ModalTitle>
                  <ModalCloseButton onClick={closeModal}>&times;</ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                  <ConfirmText>
                    {lang === 'zh'
                      ? `确定要删除模板 "${selectedTemplate.name}" (v${selectedTemplate.version}) 吗？`
                      : `Are you sure you want to delete "${selectedTemplate.name}" (v${selectedTemplate.version})?`}
                  </ConfirmText>
                  <ConfirmWarning>
                    {lang === 'zh'
                      ? '此操作不可撤销。已使用此模板生成的链接不受影响。'
                      : 'This action cannot be undone. Links already generated with this template will not be affected.'}
                  </ConfirmWarning>
                </ModalBody>
                <ModalFooter>
                  <CancelButton onClick={closeModal}>
                    {lang === 'zh' ? '取消' : 'Cancel'}
                  </CancelButton>
                  <DangerModalButton onClick={handleDelete} disabled={saving}>
                    {saving ? (lang === 'zh' ? '删除中...' : 'Deleting...') : (lang === 'zh' ? '删除' : 'Delete')}
                  </DangerModalButton>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          )}

          {/* ─── Form Field Selector ─── */}
          <FormFieldSelector
            isOpen={showFieldSelector}
            onClose={() => setShowFieldSelector(false)}
            onConfirm={handleFieldsConfirm}
            initialFields={pendingFields.length > 0 ? pendingFields : undefined}
            submitLabel={lang === 'zh' ? '保存字段' : 'Save Fields'}
            loadingLabel={lang === 'zh' ? '保存中...' : 'Saving...'}
          />
        </MainContent>
      </Container>
    </MainLayout>
  );
}
