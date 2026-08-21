// Mock Business Management Data
// This file contains comprehensive dummy data for testing business management features

export interface MockCustomer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  abn?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockBusiness {
  _id: string;
  owner_id: string;
  name: string;
  abn?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'active' | 'inactive' | 'setup' | 'suspended';
  eftposIntegration?: string;
  alipayOption?: string;
  alipayOther?: string;
  createdAt: string;
  updatedAt: string;
  registrationId?: string;
}

export interface MockDevice {
  id: string;
  deviceName: string;
  deviceBrand: string;
  serialNumber: string;
  deviceType: string;
  status: 'active' | 'inactive' | 'maintenance';
  registeredAt: string;
}

export interface MockPermission {
  _id: string;
  business_id: string;
  business_name: string;
  owner_id: string;
  name: string;
  level: string;
  expire: string;
}

export interface MockNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface MockActivity {
  type: 'status' | 'device' | 'permission' | 'edit';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

// Mock Customers (Business Owners)
// NOTE: trimmed to a single reference record — this file is no longer used
// as a runtime fallback (see app/admin/businesses/page.tsx), it's kept only
// to document the shape the real API should return.
export const mockCustomers: MockCustomer[] = [
  {
    _id: 'cust_001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phoneNumber: '+61412345678',
    abn: '12345678901',
    address: '123 Main Street',
    suburb: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    country: 'Australia',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

// Mock Businesses
export const mockBusinesses: MockBusiness[] = [
  {
    _id: 'biz_001',
    owner_id: 'cust_001',
    name: 'Coffee Shop Downtown',
    abn: '98765432101',
    address: '123 Main Street',
    suburb: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    country: 'Australia',
    contactEmail: 'contact@coffeeshop.com',
    contactPhone: '+61298765432',
    status: 'active',
    eftposIntegration: 'Yes',
    alipayOption: 'SuperPay',
    alipayOther: '',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    registrationId: 'reg_001'
  },
];

// Mock Devices
export const mockDevices: Record<string, MockDevice[]> = {
  biz_001: [
    {
      id: 'dev_001',
      deviceName: 'Main POS Terminal',
      deviceBrand: 'Verifone',
      serialNumber: 'VF12345678',
      deviceType: 'POS Terminal',
      status: 'active',
      registeredAt: '2024-01-20T09:30:00Z'
    },
    {
      id: 'dev_002',
      deviceName: 'Backup Terminal',
      deviceBrand: 'PAX',
      serialNumber: 'PX87654321',
      deviceType: 'POS Terminal',
      status: 'active',
      registeredAt: '2024-02-15T10:00:00Z'
    },
    {
      id: 'dev_003',
      deviceName: 'Mobile Payment Device',
      deviceBrand: 'Square',
      serialNumber: 'SQ11223344',
      deviceType: 'Mobile POS',
      status: 'active',
      registeredAt: '2024-03-01T11:00:00Z'
    }
  ]
};

// Mock Permissions
export const mockPermissions: Record<string, MockPermission[]> = {
  biz_001: [
    {
      _id: 'perm_001',
      business_id: 'biz_001',
      business_name: 'Coffee Shop Downtown',
      owner_id: 'cust_001',
      name: 'POS Access',
      level: 'admin',
      expire: '9999-12-31'
    },
    {
      _id: 'perm_002',
      business_id: 'biz_001',
      business_name: 'Coffee Shop Downtown',
      owner_id: 'cust_001',
      name: 'Staff Portal',
      level: 'read',
      expire: '2025-12-31'
    },
    {
      _id: 'perm_003',
      business_id: 'biz_001',
      business_name: 'Coffee Shop Downtown',
      owner_id: 'cust_001',
      name: 'Inventory Management',
      level: 'write',
      expire: '2025-06-30'
    }
  ]
};

// Mock Notes
export const mockNotes: Record<string, MockNote[]> = {
  biz_001: [
    {
      id: 'note_001',
      content: 'Customer requested priority support for weekend setup. All devices need to be ready by Friday 5 PM.',
      author: 'Admin User',
      createdAt: '2024-01-18T14:30:00Z'
    },
    {
      id: 'note_002',
      content: 'Successfully completed initial training session with staff. They are comfortable with the POS system.',
      author: 'Support Team',
      createdAt: '2024-01-22T11:00:00Z'
    },
    {
      id: 'note_003',
      content: 'Monthly maintenance scheduled for next week. Will update firmware on all devices.',
      author: 'Technical Team',
      createdAt: '2024-12-10T16:45:00Z'
    }
  ]
};

// Mock Activity Logs
export const mockActivityLogs: Record<string, MockActivity[]> = {
  biz_001: [
    {
      type: 'status',
      title: 'Status Changed',
      description: 'Business status changed from "setup" to "active"',
      timestamp: '2024-01-20T09:30:00Z',
      user: 'Admin User'
    },
    {
      type: 'device',
      title: 'Device Added',
      description: 'New device "Mobile Payment Device" was added',
      timestamp: '2024-03-01T11:00:00Z',
      user: 'Admin User'
    },
    {
      type: 'permission',
      title: 'Permission Added',
      description: 'Permission "Inventory Management" was granted',
      timestamp: '2024-03-15T14:20:00Z',
      user: 'Admin User'
    },
    {
      type: 'edit',
      title: 'Business Info Updated',
      description: 'Contact email was updated',
      timestamp: '2024-11-20T10:45:00Z',
      user: 'Admin User'
    },
    {
      type: 'device',
      title: 'Device Maintenance',
      description: 'Firmware update completed on "Main POS Terminal"',
      timestamp: '2024-12-05T15:30:00Z',
      user: 'Technical Team'
    }
  ]
};

// Helper function to get owner details for a business
export const getBusinessOwner = (ownerId: string): MockCustomer | undefined => {
  return mockCustomers.find(customer => customer._id === ownerId);
};

// Helper function to get all businesses for a customer
export const getCustomerBusinesses = (customerId: string): MockBusiness[] => {
  return mockBusinesses.filter(business => business.owner_id === customerId);
};

// Helper function to get devices for a business
export const getBusinessDevices = (businessId: string): MockDevice[] => {
  return mockDevices[businessId] || [];
};

// Helper function to get permissions for a business
export const getBusinessPermissions = (businessId: string): MockPermission[] => {
  return mockPermissions[businessId] || [];
};

// Helper function to get notes for a business
export const getBusinessNotes = (businessId: string): MockNote[] => {
  return mockNotes[businessId] || [];
};

// Helper function to get activity log for a business
export const getBusinessActivityLog = (businessId: string): MockActivity[] => {
  return mockActivityLogs[businessId] || [];
};

// Statistics
export const getBusinessStatistics = () => {
  return {
    total: mockBusinesses.length,
    active: mockBusinesses.filter(b => b.status === 'active').length,
    setup: mockBusinesses.filter(b => b.status === 'setup').length,
    inactive: mockBusinesses.filter(b => b.status === 'inactive').length,
    suspended: mockBusinesses.filter(b => b.status === 'suspended').length
  };
};

export const getCustomerStatistics = () => {
  const totalBusinesses = mockBusinesses.length;
  const recentAdditions = mockCustomers.filter(c => {
    const createdDate = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;

  return {
    totalCustomers: mockCustomers.length,
    totalBusinesses,
    recentAdditions
  };
};
