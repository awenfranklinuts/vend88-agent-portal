"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "@/components/layout/AdminSidebar";
import axios from "axios";
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

const SHOP_STATUSES = ['active', 'inactive', 'test', 'suspended'] as const;

const SHOP_STATUS_LABELS: Record<string, { en: string; zh: string }> = {
  active: { en: 'Active', zh: '活跃' },
  inactive: { en: 'Inactive', zh: '非活跃' },
  test: { en: 'Test', zh: '测试' },
  suspended: { en: 'Suspended', zh: '已暂停' },
};

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;
  const shopId = params?.shopId as string;
  const { token, role, isLoading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'devices' | 'permissions' | 'activity' | 'notes'>('devices');

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
    } else if (!authLoading && token && !isAdminRole(role)) {
      router.push("/agent");
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

  const formatShopLocation = (location: any) => {
    if (typeof location === 'string' && location.trim()) return location;
    return lang === "zh" ? "未设置地址" : "No address set";
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
      currentPage={lang === "zh" ? "店铺详情" : "Shop Details"}
      onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <Container>
        <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <MainContent>
          <BackButton onClick={() => router.push(`/admin/businesses/${businessId}`)}>
            <span>←</span>
            {lang === "zh" ? "返回业务详情" : "Back to Business"}
          </BackButton>

          {isLoading ? (
            <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : shop ? (
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

              <Card>
                <CardTitle>{lang === "zh" ? "店铺信息" : "Shop Information"}</CardTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "店铺 ID" : "Shop ID"}</InfoLabel>
                    <InfoValue>{shop._id}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "店铺名称" : "Shop Name"}</InfoLabel>
                    <InfoValue>{shop.store_name || shop.name || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "电话" : "Phone"}</InfoLabel>
                    <InfoValue>{shop.phone || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "店铺密钥" : "Shop Key"}</InfoLabel>
                    <InfoValue>{shop.shop_key || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
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
                </InfoGrid>
              </Card>

              <TabContainer>
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
        </MainContent>
      </Container>

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
    </MainLayout>
  );
}
