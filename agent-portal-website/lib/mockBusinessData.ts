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
  },
  {
    _id: 'cust_002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phoneNumber: '+61423456789',
    abn: '23456789012',
    address: '456 Collins Street',
    suburb: 'Melbourne',
    postcode: '3000',
    state: 'VIC',
    country: 'Australia',
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z'
  },
  {
    _id: 'cust_003',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phoneNumber: '+61434567890',
    abn: '34567890123',
    address: '789 Queen Street',
    suburb: 'Brisbane',
    postcode: '4000',
    state: 'QLD',
    country: 'Australia',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z'
  },
  {
    _id: 'cust_004',
    name: 'Emily Wong',
    email: 'emily.wong@example.com',
    phoneNumber: '+61445678901',
    abn: '45678901234',
    address: '321 St Georges Terrace',
    suburb: 'Perth',
    postcode: '6000',
    state: 'WA',
    country: 'Australia',
    createdAt: '2024-04-05T11:20:00Z',
    updatedAt: '2024-04-05T11:20:00Z'
  },
  {
    _id: 'cust_005',
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    phoneNumber: '+61456789012',
    abn: '56789012345',
    address: '654 King William Street',
    suburb: 'Adelaide',
    postcode: '5000',
    state: 'SA',
    country: 'Australia',
    createdAt: '2024-05-12T16:45:00Z',
    updatedAt: '2024-05-12T16:45:00Z'
  },
  {
    _id: 'cust_006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phoneNumber: '+61467890123',
    abn: '67890123456',
    address: '987 Elizabeth Street',
    suburb: 'Hobart',
    postcode: '7000',
    state: 'TAS',
    country: 'Australia',
    createdAt: '2024-06-18T13:30:00Z',
    updatedAt: '2024-06-18T13:30:00Z'
  },
  {
    _id: 'cust_007',
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    phoneNumber: '+61478901234',
    abn: '78901234567',
    address: '159 Northbourne Avenue',
    suburb: 'Canberra',
    postcode: '2600',
    state: 'ACT',
    country: 'Australia',
    createdAt: '2024-07-22T10:15:00Z',
    updatedAt: '2024-07-22T10:15:00Z'
  },
  {
    _id: 'cust_008',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    phoneNumber: '+61489012345',
    abn: '89012345678',
    address: '753 Mitchell Street',
    suburb: 'Darwin',
    postcode: '0800',
    state: 'NT',
    country: 'Australia',
    createdAt: '2024-08-30T15:00:00Z',
    updatedAt: '2024-08-30T15:00:00Z'
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
  {
    _id: 'biz_002',
    owner_id: 'cust_001',
    name: 'Coffee Shop Westfield',
    abn: '98765432102',
    address: '500 George Street',
    suburb: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    country: 'Australia',
    contactEmail: 'westfield@coffeeshop.com',
    contactPhone: '+61298765433',
    status: 'active',
    eftposIntegration: 'Yes',
    alipayOption: 'SuperPay',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    registrationId: 'reg_005'
  },
  {
    _id: 'biz_003',
    owner_id: 'cust_002',
    name: 'Authentic Chinese Restaurant',
    abn: '87654321012',
    address: '456 Collins Street',
    suburb: 'Melbourne',
    postcode: '3000',
    state: 'VIC',
    country: 'Australia',
    contactEmail: 'info@chineserestaurant.com',
    contactPhone: '+61387654321',
    status: 'active',
    eftposIntegration: 'Yes',
    alipayOption: 'WeChat Pay',
    alipayOther: '',
    createdAt: '2024-02-25T11:00:00Z',
    updatedAt: '2024-02-25T11:00:00Z',
    registrationId: 'reg_002'
  },
  {
    _id: 'biz_004',
    owner_id: 'cust_003',
    name: 'Sushi Train Express',
    abn: '76543210123',
    address: '789 Queen Street',
    suburb: 'Brisbane',
    postcode: '4000',
    state: 'QLD',
    country: 'Australia',
    contactEmail: 'contact@sushitrain.com',
    contactPhone: '+61776543210',
    status: 'setup',
    eftposIntegration: 'Yes',
    alipayOption: 'Alipay',
    createdAt: '2024-03-15T14:30:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    registrationId: 'reg_003'
  },
  {
    _id: 'biz_005',
    owner_id: 'cust_004',
    name: 'Bubble Tea Corner',
    abn: '65432101234',
    address: '321 St Georges Terrace',
    suburb: 'Perth',
    postcode: '6000',
    state: 'WA',
    country: 'Australia',
    contactEmail: 'hello@bubbletea.com',
    contactPhone: '+61865432101',
    status: 'active',
    eftposIntegration: 'No',
    alipayOption: 'SuperPay',
    createdAt: '2024-04-10T12:00:00Z',
    updatedAt: '2024-04-10T12:00:00Z',
    registrationId: 'reg_004'
  },
  {
    _id: 'biz_006',
    owner_id: 'cust_005',
    name: 'Thai Street Food',
    abn: '54321012345',
    address: '654 King William Street',
    suburb: 'Adelaide',
    postcode: '5000',
    state: 'SA',
    country: 'Australia',
    contactEmail: 'orders@thaistreet.com',
    contactPhone: '+61854321012',
    status: 'active',
    eftposIntegration: 'Yes',
    alipayOption: 'WeChat Pay',
    createdAt: '2024-05-18T13:20:00Z',
    updatedAt: '2024-05-18T13:20:00Z',
    registrationId: 'reg_006'
  },
  {
    _id: 'biz_007',
    owner_id: 'cust_006',
    name: 'Korean BBQ House',
    abn: '43210123456',
    address: '987 Elizabeth Street',
    suburb: 'Hobart',
    postcode: '7000',
    state: 'TAS',
    country: 'Australia',
    contactEmail: 'booking@koreanbbq.com',
    contactPhone: '+61643210123',
    status: 'inactive',
    eftposIntegration: 'Yes',
    alipayOption: 'Alipay',
    createdAt: '2024-06-22T15:40:00Z',
    updatedAt: '2024-06-22T15:40:00Z',
    registrationId: 'reg_007'
  },
  {
    _id: 'biz_008',
    owner_id: 'cust_007',
    name: 'Vietnamese Pho Restaurant',
    abn: '32101234567',
    address: '159 Northbourne Avenue',
    suburb: 'Canberra',
    postcode: '2600',
    state: 'ACT',
    country: 'Australia',
    contactEmail: 'info@vietpho.com',
    contactPhone: '+61232101234',
    status: 'active',
    eftposIntegration: 'Yes',
    alipayOption: 'SuperPay',
    createdAt: '2024-07-28T10:50:00Z',
    updatedAt: '2024-07-28T10:50:00Z',
    registrationId: 'reg_008'
  },
  {
    _id: 'biz_009',
    owner_id: 'cust_008',
    name: 'Japanese Ramen Bar',
    abn: '21012345678',
    address: '753 Mitchell Street',
    suburb: 'Darwin',
    postcode: '0800',
    state: 'NT',
    country: 'Australia',
    contactEmail: 'orders@ramenbar.com',
    contactPhone: '+61821012345',
    status: 'setup',
    eftposIntegration: 'Yes',
    alipayOption: 'WeChat Pay',
    createdAt: '2024-09-05T16:30:00Z',
    updatedAt: '2024-09-05T16:30:00Z',
    registrationId: 'reg_009'
  },
  {
    _id: 'biz_010',
    owner_id: 'cust_002',
    name: 'Dim Sum Palace',
    abn: '10123456789',
    address: '888 Bourke Street',
    suburb: 'Melbourne',
    postcode: '3000',
    state: 'VIC',
    country: 'Australia',
    contactEmail: 'reservations@dimsumpalace.com',
    contactPhone: '+61310123456',
    status: 'suspended',
    eftposIntegration: 'Yes',
    alipayOption: 'Alipay',
    createdAt: '2024-10-12T11:15:00Z',
    updatedAt: '2024-10-12T11:15:00Z',
    registrationId: 'reg_010'
  },
  {
    _id: 'biz_011',
    owner_id: 'cust_003',
    name: 'Asian Fusion Cafe',
    abn: '01234567890',
    address: '222 Adelaide Street',
    suburb: 'Brisbane',
    postcode: '4000',
    state: 'QLD',
    country: 'Australia',
    contactEmail: 'hello@asianfusion.com',
    contactPhone: '+61701234567',
    status: 'active',
    eftposIntegration: 'No',
    alipayOption: 'Other',
    alipayOther: 'Custom Payment Gateway',
    createdAt: '2024-11-20T14:00:00Z',
    updatedAt: '2024-11-20T14:00:00Z',
    registrationId: 'reg_011'
  },
  {
    _id: 'biz_012',
    owner_id: 'cust_004',
    name: 'Boba Tea & Desserts',
    abn: '90123456781',
    address: '555 Murray Street',
    suburb: 'Perth',
    postcode: '6000',
    state: 'WA',
    country: 'Australia',
    contactEmail: 'orders@bobatea.com',
    contactPhone: '+61890123456',
    status: 'active',
    eftposIntegration: 'Yes',
    alipayOption: 'SuperPay',
    createdAt: '2024-12-01T09:30:00Z',
    updatedAt: '2024-12-01T09:30:00Z',
    registrationId: 'reg_012'
  }
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
  ],
  biz_003: [
    {
      id: 'dev_004',
      deviceName: 'Restaurant Terminal 1',
      deviceBrand: 'Ingenico',
      serialNumber: 'IN55667788',
      deviceType: 'POS Terminal',
      status: 'active',
      registeredAt: '2024-02-25T12:00:00Z'
    },
    {
      id: 'dev_005',
      deviceName: 'Restaurant Terminal 2',
      deviceBrand: 'Ingenico',
      serialNumber: 'IN99887766',
      deviceType: 'POS Terminal',
      status: 'maintenance',
      registeredAt: '2024-02-25T12:30:00Z'
    }
  ],
  biz_005: [
    {
      id: 'dev_006',
      deviceName: 'Store Terminal',
      deviceBrand: 'Verifone',
      serialNumber: 'VF33445566',
      deviceType: 'POS Terminal',
      status: 'active',
      registeredAt: '2024-04-10T13:00:00Z'
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
  ],
  biz_003: [
    {
      _id: 'perm_004',
      business_id: 'biz_003',
      business_name: 'Authentic Chinese Restaurant',
      owner_id: 'cust_002',
      name: 'POS Access',
      level: 'admin',
      expire: '9999-12-31'
    },
    {
      _id: 'perm_005',
      business_id: 'biz_003',
      business_name: 'Authentic Chinese Restaurant',
      owner_id: 'cust_002',
      name: 'Menu Management',
      level: 'write',
      expire: '2025-12-31'
    }
  ],
  biz_005: [
    {
      _id: 'perm_006',
      business_id: 'biz_005',
      business_name: 'Bubble Tea Corner',
      owner_id: 'cust_004',
      name: 'POS Access',
      level: 'admin',
      expire: '9999-12-31'
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
  ],
  biz_003: [
    {
      id: 'note_004',
      content: 'Restaurant owner needs bilingual support (English/Chinese) for menu management system.',
      author: 'Admin User',
      createdAt: '2024-02-24T10:00:00Z'
    },
    {
      id: 'note_005',
      content: 'Terminal 2 experiencing occasional connectivity issues. Monitoring for 48 hours before replacement.',
      author: 'Technical Support',
      createdAt: '2024-12-12T13:20:00Z'
    }
  ],
  biz_007: [
    {
      id: 'note_006',
      content: 'Business temporarily closed for renovations. Status set to inactive. Expected reopening: January 2025.',
      author: 'Admin User',
      createdAt: '2024-11-28T09:15:00Z'
    }
  ],
  biz_010: [
    {
      id: 'note_007',
      content: 'Account suspended due to payment dispute. Awaiting resolution from finance team.',
      author: 'Finance Team',
      createdAt: '2024-11-15T14:00:00Z'
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
  ],
  biz_003: [
    {
      type: 'status',
      title: 'Status Changed',
      description: 'Business status changed from "setup" to "active"',
      timestamp: '2024-02-25T11:30:00Z',
      user: 'Admin User'
    },
    {
      type: 'device',
      title: 'Device Status Changed',
      description: 'Device "Restaurant Terminal 2" status changed to "maintenance"',
      timestamp: '2024-12-12T13:25:00Z',
      user: 'Technical Support'
    },
    {
      type: 'permission',
      title: 'Permission Updated',
      description: 'Permission "Menu Management" level changed to "write"',
      timestamp: '2024-03-10T16:00:00Z',
      user: 'Admin User'
    }
  ],
  biz_007: [
    {
      type: 'status',
      title: 'Status Changed',
      description: 'Business status changed from "active" to "inactive"',
      timestamp: '2024-11-28T09:15:00Z',
      user: 'Admin User'
    },
    {
      type: 'edit',
      title: 'Business Info Updated',
      description: 'Added note about temporary closure for renovations',
      timestamp: '2024-11-28T09:20:00Z',
      user: 'Admin User'
    }
  ],
  biz_010: [
    {
      type: 'status',
      title: 'Status Changed',
      description: 'Business status changed from "active" to "suspended"',
      timestamp: '2024-11-15T14:00:00Z',
      user: 'Finance Team'
    },
    {
      type: 'edit',
      title: 'Business Info Updated',
      description: 'Added suspension reason and contact information',
      timestamp: '2024-11-15T14:05:00Z',
      user: 'Finance Team'
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
