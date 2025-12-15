"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import MainLayout from "@/components/layout/MainLayout";
import AdminSidebar from "../../../../components/layout/AdminSidebar";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "@/config/api";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
  display: flex;
  padding-top: 65px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
  margin-left: 280px;
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
  margin-bottom: 1rem;
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
    switch(p.$status) {
      case 'active':
        return 'background: #d1fae5; color: #065f46;';
      case 'setup':
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

interface Business {
  _id: string;
  owner_id: string;
  name: string;
  status?: string;
}

interface Permission {
  _id: string;
  business_id: string;
  business_name: string;
  owner_id: string;
  expire: string;
  level: string;
  name: string;
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
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  const [showDeleteDeviceModal, setShowDeleteDeviceModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
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

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (!authLoading && token && role !== "admin") {
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
      // Fetch business info
      const businessResponse = await axios.post(
        '/api/search/business',
        { detail: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (businessResponse.data.status_code === 200) {
        const foundBusiness = businessResponse.data.business.find(
          (b: Business) => b._id === businessId
        );
        
        if (foundBusiness) {
          setBusiness(foundBusiness);
        } else {
          setError(lang === "zh" ? "未找到业务" : "Business not found");
        }
      }

      // Fetch permissions
      const permissionResponse = await axios.post(
        '/api/shop/get-permission',
        { business_id: businessId },
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
      console.error("Failed to fetch business details:", err);
      setError(lang === "zh" ? "加载失败" : "Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditForm({
      level: permission.level,
      expire: permission.expire ? new Date(permission.expire).toISOString().split('T')[0] : '',
      unlimited: !permission.expire || permission.expire === '9999-12-31'
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowDeleteModal(true);
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
    if (!selectedPermission) return;
    
    try {
      const expireDate = editForm.unlimited ? '9999-12-31' : editForm.expire;
      
      const response = await axios.post(
        '/api/shop/update-permission',
        {
          _id: selectedPermission._id,
          level: editForm.level,
          expire: expireDate
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        showToast(lang === "zh" ? "权限已更新" : "Permission updated", 'success');
        setShowEditModal(false);
        fetchBusinessDetails();
      } else {
        showToast(response.data.status_msg || (lang === "zh" ? "更新失败" : "Update failed"), 'error');
      }
    } catch (err) {
      console.error("Failed to update permission:", err);
      showToast(lang === "zh" ? "更新失败" : "Update failed", 'error');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedPermission) return;
    
    try {
      const response = await axios.post(
        '/api/shop/delete-permission',
        { _id: selectedPermission._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        showToast(lang === "zh" ? "权限已删除" : "Permission deleted", 'success');
        setShowDeleteModal(false);
        fetchBusinessDetails();
      } else {
        showToast(response.data.status_msg || (lang === "zh" ? "删除失败" : "Delete failed"), 'error');
      }
    } catch (err) {
      console.error("Failed to delete permission:", err);
      showToast(lang === "zh" ? "删除失败" : "Delete failed", 'error');
    }
  };

  const handleAddSubmit = async () => {
    if (!business || !addForm.name || !addForm.level) {
      showToast(lang === "zh" ? "请填写所有必填字段" : "Please fill all required fields", 'error');
      return;
    }
    
    try {
      const expireDate = addForm.unlimited ? '9999-12-31' : addForm.expire;
      
      const response = await axios.post(
        '/api/shop/add-permission',
        {
          business_id: businessId,
          business_name: business.name,
          owner_id: business.owner_id,
          name: addForm.name,
          level: addForm.level,
          expire: expireDate
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status_code === 200) {
        showToast(lang === "zh" ? "权限已添加" : "Permission added", 'success');
        setShowAddModal(false);
        fetchBusinessDetails();
      } else {
        showToast(response.data.status_msg || (lang === "zh" ? "添加失败" : "Add failed"), 'error');
      }
    } catch (err) {
      console.error("Failed to add permission:", err);
      showToast(lang === "zh" ? "添加失败" : "Add failed", 'error');
    }
  };

  if (authLoading) {
    return (
      <Container>
        <LoadingText>{lang === "zh" ? "加载中..." : "Loading..."}</LoadingText>
      </Container>
    );
  }

  if (!token || role !== "admin") {
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
              <Card>
                <BusinessName>{business.name || 'N/A'}</BusinessName>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "业务 ID" : "Business ID"}</InfoLabel>
                    <InfoValue>{business._id}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "所有者 ID" : "Owner ID"}</InfoLabel>
                    <InfoValue>{business.owner_id || 'N/A'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>{lang === "zh" ? "状态" : "Status"}</InfoLabel>
                    <StatusBadge $status={business.status || 'N/A'}>
                      {business.status || 'N/A'}
                    </StatusBadge>
                  </InfoItem>
                </InfoGrid>
              </Card>

              <Card>
                <CardTitle>{lang === "zh" ? "注册设备" : "Registered Devices"}</CardTitle>
                <PermissionList>
                  <PermissionCard>
                    <PermissionName>Device 1</PermissionName>
                    <PermissionDetails>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "品牌" : "Brand"}</PermissionLabel>
                        <PermissionValue>Verifone</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "序列号" : "Serial Number"}</PermissionLabel>
                        <PermissionValue>SN12345678</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "设备类型" : "Device Type"}</PermissionLabel>
                        <PermissionValue>POS Terminal</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "状态" : "Status"}</PermissionLabel>
                        <PermissionValue>Active</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "注册日期" : "Registered"}</PermissionLabel>
                        <PermissionValue>2024-01-15</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "操作" : "Actions"}</PermissionLabel>
                        <PermissionValue style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton $variant="edit" onClick={() => handleEditDeviceClick({ id: '1', deviceName: 'Device 1', deviceBrand: 'Verifone', serialNumber: 'SN12345678', deviceType: 'POS Terminal', status: 'active' })}>
                            {lang === "zh" ? "编辑" : "Edit"}
                          </ActionButton>
                          <ActionButton $variant="delete" onClick={() => handleDeleteDeviceClick({ id: '1', deviceName: 'Device 1' })}>
                            {lang === "zh" ? "删除" : "Delete"}
                          </ActionButton>
                        </PermissionValue>
                      </PermissionDetailItem>
                    </PermissionDetails>
                  </PermissionCard>
                  <PermissionCard>
                    <PermissionName>Device 2</PermissionName>
                    <PermissionDetails>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "品牌" : "Brand"}</PermissionLabel>
                        <PermissionValue>PAX</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "序列号" : "Serial Number"}</PermissionLabel>
                        <PermissionValue>SN87654321</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "设备类型" : "Device Type"}</PermissionLabel>
                        <PermissionValue>Payment Gateway</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "状态" : "Status"}</PermissionLabel>
                        <PermissionValue>Active</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "注册日期" : "Registered"}</PermissionLabel>
                        <PermissionValue>2024-02-20</PermissionValue>
                      </PermissionDetailItem>
                      <PermissionDetailItem>
                        <PermissionLabel>{lang === "zh" ? "操作" : "Actions"}</PermissionLabel>
                        <PermissionValue style={{ display: 'flex', gap: '0.5rem' }}>
                          <ActionButton $variant="edit" onClick={() => handleEditDeviceClick({ id: '2', deviceName: 'Device 2', deviceBrand: 'PAX', serialNumber: 'SN87654321', deviceType: 'Payment Gateway', status: 'active' })}>
                            {lang === "zh" ? "编辑" : "Edit"}
                          </ActionButton>
                          <ActionButton $variant="delete" onClick={() => handleDeleteDeviceClick({ id: '2', deviceName: 'Device 2' })}>
                            {lang === "zh" ? "删除" : "Delete"}
                          </ActionButton>
                        </PermissionValue>
                      </PermissionDetailItem>
                    </PermissionDetails>
                  </PermissionCard>
                </PermissionList>
                <AddPermissionButton onClick={handleAddDeviceClick}>
                  {lang === "zh" ? "添加设备" : "Add Device"}
                </AddPermissionButton>
              </Card>

              <Card>
                <CardTitle>{lang === "zh" ? "权限" : "Permissions"}</CardTitle>
                {permissions.length > 0 ? (
                  <>
                    <PermissionList>
                      {permissions.map((permission) => (
                        <PermissionCard key={permission._id}>
                          <PermissionName>{permission.name || 'N/A'}</PermissionName>
                          <PermissionDetails>
                            <PermissionDetailItem>
                              <PermissionLabel>{lang === "zh" ? "级别" : "Level"}</PermissionLabel>
                              <PermissionValue>{permission.level || 'N/A'}</PermissionValue>
                            </PermissionDetailItem>
                            <PermissionDetailItem>
                              <PermissionLabel>{lang === "zh" ? "到期" : "Expires"}</PermissionLabel>
                              <PermissionValue>
                                {permission.expire === '99' || permission.expire === '9999-12-31'
                                  ? (lang === "zh" ? "永不" : "Never")
                                  : permission.expire || 'N/A'}
                              </PermissionValue>
                            </PermissionDetailItem>
                            <PermissionDetailItem>
                              <PermissionLabel>{lang === "zh" ? "权限 ID" : "Permission ID"}</PermissionLabel>
                              <PermissionValue>{permission._id}</PermissionValue>
                            </PermissionDetailItem>
                          </PermissionDetails>
                          <PermissionActions>
                            <ActionButton $variant="edit" onClick={() => handleEditClick(permission)}>
                              {lang === "zh" ? "编辑" : "Edit"}
                            </ActionButton>
                            <ActionButton $variant="delete" onClick={() => handleDeleteClick(permission)}>
                              {lang === "zh" ? "删除" : "Delete"}
                            </ActionButton>
                          </PermissionActions>
                        </PermissionCard>
                      ))}
                    </PermissionList>
                    <AddPermissionButton onClick={handleAddClick}>
                      {lang === "zh" ? "添加权限" : "Add Permission"}
                    </AddPermissionButton>
                  </>
                ) : (
                  <>
                    <InfoValue>{lang === "zh" ? "无权限" : "No permissions found"}</InfoValue>
                    <AddPermissionButton onClick={handleAddClick}>
                      {lang === "zh" ? "添加权限" : "Add Permission"}
                    </AddPermissionButton>
                  </>
                )}
              </Card>
            </>
          ) : (
            <ErrorText>{lang === "zh" ? "未找到业务" : "Business not found"}</ErrorText>
          )}
        </MainContent>
      </Container>
      
      {/* Edit Permission Modal */}
      <Modal $show={showEditModal} onClick={() => setShowEditModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>{lang === "zh" ? "编辑权限" : "Edit Permission"}</ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "权限名称" : "Permission Name"}</Label>
            <Input 
              value={selectedPermission?.name || ''} 
              disabled 
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "级别" : "Level"}</Label>
            <Select 
              value={editForm.level}
              onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
            >
              <option value="">Select Level</option>
              <option value="read">Read</option>
              <option value="write">Write</option>
              <option value="admin">Admin</option>
            </Select>
          </FormGroup>
          {!editForm.unlimited && (
            <FormGroup>
              <Label>{lang === "zh" ? "到期日期" : "Expire Date"}</Label>
              <Input 
                type="date"
                value={editForm.expire}
                onChange={(e) => setEditForm({ ...editForm, expire: e.target.value })}
              />
            </FormGroup>
          )}
          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={editForm.unlimited}
                onChange={(e) => setEditForm({ ...editForm, unlimited: e.target.checked })}
              />
              {lang === "zh" ? "无限期" : "Unlimited"}
            </CheckboxLabel>
          </FormGroup>
          <ModalActions>
            <ModalButton onClick={() => setShowEditModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleEditSubmit}>
              {lang === "zh" ? "保存" : "Save"}
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
              ? `确定要删除权限 "${selectedPermission?.name}" 吗？此操作无法撤销。`
              : `Are you sure you want to delete permission "${selectedPermission?.name}"? This action cannot be undone.`}
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
          <ModalTitle>{lang === "zh" ? "添加权限" : "Add Permission"}</ModalTitle>
          <FormGroup>
            <Label>{lang === "zh" ? "权限名称" : "Permission Name"}</Label>
            <Input 
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              placeholder={lang === "zh" ? "输入权限名称" : "Enter permission name"}
            />
          </FormGroup>
          <FormGroup>
            <Label>{lang === "zh" ? "级别" : "Level"}</Label>
            <Select 
              value={addForm.level}
              onChange={(e) => setAddForm({ ...addForm, level: e.target.value })}
            >
              <option value="">Select Level</option>
              <option value="read">Read</option>
              <option value="write">Write</option>
              <option value="admin">Admin</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={addForm.unlimited}
                onChange={(e) => setAddForm({ ...addForm, unlimited: e.target.checked })}
              />
              {lang === "zh" ? "无限期" : "Unlimited"}
            </CheckboxLabel>
          </FormGroup>
          {!addForm.unlimited && (
            <FormGroup>
              <Label>{lang === "zh" ? "到期日期" : "Expire Date"}</Label>
              <Input 
                type="date"
                value={addForm.expire}
                onChange={(e) => setAddForm({ ...addForm, expire: e.target.value })}
              />
            </FormGroup>
          )}
          <ModalActions>
            <ModalButton onClick={() => setShowAddModal(false)}>
              {lang === "zh" ? "取消" : "Cancel"}
            </ModalButton>
            <ModalButton $primary onClick={handleAddSubmit}>
              {lang === "zh" ? "添加" : "Add"}
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
