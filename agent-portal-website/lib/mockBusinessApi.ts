/**
 * Mock API handlers for Business Management
 * Based on the API structure from vend88-agent-portal-2
 * Replace these with real API calls once backend is ready
 */

export interface Permission {
  _id: string;
  business_id: string;
  business_name: string;
  owner_id: string;
  expire: string;
  level: string;
  name: string;
}

export interface Business {
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
  createdAt: string;
  updatedAt: string;
  registrationId?: string; // Link back to registration
  permissions?: Permission[];
}

// Mock data store
let mockBusinesses: Business[] = [
  {
    _id: 'bus_001',
    owner_id: 'owner_001',
    name: 'Coffee Shop Downtown',
    abn: '12345678901',
    address: '123 Main Street',
    suburb: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    country: 'Australia',
    contactEmail: 'owner@coffeeshop.com',
    contactPhone: '0412 345 678',
    status: 'active',
    eftposIntegration: 'yes',
    alipayOption: 'superpay',
    createdAt: '2025-11-20T15:00:00Z',
    updatedAt: '2025-11-20T15:00:00Z',
    registrationId: '1',
  },
  {
    _id: 'bus_002',
    owner_id: 'owner_002',
    name: 'Sushi Express Bar',
    abn: '23456789012',
    address: '78 Crown Street',
    suburb: 'Brisbane',
    postcode: '4000',
    state: 'QLD',
    country: 'Australia',
    contactEmail: 'manager@sushiexpress.com.au',
    contactPhone: '0434 567 890',
    status: 'active',
    eftposIntegration: 'yes',
    alipayOption: 'open',
    createdAt: '2025-11-19T16:30:00Z',
    updatedAt: '2025-11-19T16:30:00Z',
    registrationId: '2',
  },
  {
    _id: 'bus_003',
    owner_id: 'owner_003',
    name: 'Thai Basil Restaurant',
    abn: '34567890123',
    address: '92 Lygon Street',
    suburb: 'Melbourne',
    postcode: '3053',
    state: 'VIC',
    country: 'Australia',
    contactEmail: 'contact@thaibasil.net',
    contactPhone: '0445 678 901',
    status: 'active',
    eftposIntegration: 'no',
    alipayOption: 'superpay',
    createdAt: '2025-11-18T12:00:00Z',
    updatedAt: '2025-11-18T12:00:00Z',
    registrationId: '3',
  },
];

/**
 * Fetch all businesses (Admin view)
 */
export const fetchBusinesses = async (filters?: {
  status?: string;
  state?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: {
    businesses: Business[];
    total: number;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockBusinesses];

  // Apply filters
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(b => b.status === filters.status);
  }

  if (filters?.state && filters.state !== 'all') {
    filtered = filtered.filter(b => b.state === filters.state);
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(b => 
      b.name?.toLowerCase().includes(query) ||
      b.abn?.toLowerCase().includes(query) ||
      b.contactEmail?.toLowerCase().includes(query) ||
      b.suburb?.toLowerCase().includes(query)
    );
  }

  return {
    success: true,
    data: {
      businesses: filtered,
      total: filtered.length,
    },
  };
};

/**
 * Get single business details
 */
export const getBusinessById = async (id: string): Promise<{
  success: boolean;
  data?: Business;
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const business = mockBusinesses.find(b => b._id === id);

  if (!business) {
    return {
      success: false,
      error: 'Business not found',
    };
  }

  return {
    success: true,
    data: business,
  };
};

/**
 * Create business from approved registration
 */
export const createBusinessFromRegistration = async (
  registrationData: {
    registrationId: string;
    businessName: string;
    abn?: string;
    address?: string;
    suburb?: string;
    postcode?: string;
    state?: string;
    country?: string;
    contactEmail?: string;
    contactPhone?: string;
    eftposIntegration?: string;
    alipayOption?: string;
  }
): Promise<{
  success: boolean;
  data?: Business;
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // Check if business already exists for this registration
  const existing = mockBusinesses.find(b => b.registrationId === registrationData.registrationId);
  if (existing) {
    return {
      success: false,
      error: 'Business already created for this registration',
    };
  }

  const newBusiness: Business = {
    _id: `bus_${Date.now()}`,
    owner_id: `owner_${Date.now()}`,
    name: registrationData.businessName,
    abn: registrationData.abn,
    address: registrationData.address,
    suburb: registrationData.suburb,
    postcode: registrationData.postcode,
    state: registrationData.state,
    country: registrationData.country,
    contactEmail: registrationData.contactEmail,
    contactPhone: registrationData.contactPhone,
    status: 'setup',
    eftposIntegration: registrationData.eftposIntegration,
    alipayOption: registrationData.alipayOption,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    registrationId: registrationData.registrationId,
  };

  mockBusinesses.push(newBusiness);

  return {
    success: true,
    data: newBusiness,
  };
};

/**
 * Update business details
 */
export const updateBusiness = async (
  id: string,
  updates: Partial<Business>
): Promise<{
  success: boolean;
  data?: Business;
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockBusinesses.findIndex(b => b._id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Business not found',
    };
  }

  mockBusinesses[index] = {
    ...mockBusinesses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: mockBusinesses[index],
  };
};

/**
 * Update business status
 */
export const updateBusinessStatus = async (
  id: string,
  status: 'active' | 'inactive' | 'setup' | 'suspended'
): Promise<{
  success: boolean;
  data?: Business;
  error?: string;
}> => {
  return updateBusiness(id, { status });
};

/**
 * Delete/Deactivate business
 */
export const deactivateBusiness = async (id: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  const result = await updateBusinessStatus(id, 'inactive');
  return {
    success: result.success,
    error: result.error,
  };
};
