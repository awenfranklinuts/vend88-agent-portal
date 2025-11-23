/**
 * Mock API handlers for Registration Management
 * Replace these with real API calls once backend is ready
 */

// Define Registration type locally
export interface Registration {
  id: string;
  token: string;
  generatedBy: string;
  generatedAt: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  contactEmail?: string;
  ownerName?: string;
  contactPhone?: string;
  messagingAppType?: string;
  messagingAppId?: string;
  quoteNumber?: string;
  businessName?: string;
  abn?: string;
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
  menuFiles?: (string | { filename: string; url: string; size?: number; uploadedAt?: string })[];
  menuSendLater?: boolean;
  notes?: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

// Mock data store (simulates database)
let mockRegistrations: Registration[] = [
  {
    id: '1',
    token: 'abc123xyz456',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-20T10:30:00Z',
    status: 'submitted',
    contactEmail: 'owner@coffeeshop.com',
    ownerName: 'John Smith',
    contactPhone: '0412 345 678',
    messagingAppType: 'wechat',
    messagingAppId: 'johnsmith88',
    quoteNumber: 'INV-2024-001234',
    businessName: 'Coffee Shop Downtown',
    abn: '12345678901',
    registeredAddress: '123 Main Street',
    registeredSuburb: 'Sydney',
    registeredPostcode: '2000',
    registeredState: 'NSW',
    registeredCountry: 'Australia',
    eftposIntegration: 'yes',
    alipayOption: 'superpay',
    readyBy: 'End of December 2025',
    heardAbout: 'friend',
    menuFiles: [
      { filename: 'menu-english.pdf', url: '/mock-files/menu-english.pdf', size: 245000, uploadedAt: '2025-11-20T14:30:00Z' },
      { filename: 'menu-chinese.pdf', url: '/mock-files/menu-chinese.pdf', size: 312000, uploadedAt: '2025-11-20T14:31:00Z' }
    ],
    notes: 'Looking to expand POS system to handle peak hours better. Interested in loyalty program features.',
    submittedAt: '2025-11-20T14:45:00Z',
  },
  {
    id: '2',
    token: 'def456uvw789',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-19T15:20:00Z',
    status: 'submitted',
    contactEmail: 'manager@sushiexpress.com.au',
    ownerName: 'Kenji Tanaka',
    contactPhone: '0434 567 890',
    messagingAppType: 'whatsapp',
    messagingAppId: '0434567890',
    quoteNumber: 'INV-2024-001235',
    businessName: 'Sushi Express Bar',
    abn: '23456789012',
    registeredAddress: '78 Crown Street',
    registeredSuburb: 'Brisbane',
    registeredPostcode: '4000',
    registeredState: 'QLD',
    registeredCountry: 'Australia',
    eftposIntegration: 'yes',
    alipayOption: 'open',
    readyBy: 'Early January 2026',
    heardAbout: 'saw',
    menuFiles: [
      { filename: 'sushi-menu-en.pdf', url: '/mock-files/sushi-menu-en.pdf', size: 189000, uploadedAt: '2025-11-19T16:10:00Z' },
      { filename: 'sushi-menu-jp.pdf', url: '/mock-files/sushi-menu-jp.pdf', size: 203000, uploadedAt: '2025-11-19T16:11:00Z' }
    ],
    notes: 'Fast-paced restaurant, need quick service features',
    submittedAt: '2025-11-19T16:20:00Z',
  },
  {
    id: '3',
    token: 'ghi789rst012',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-18T09:15:00Z',
    status: 'submitted',
    contactEmail: 'contact@thaibasil.net',
    ownerName: 'Somchai Patel',
    contactPhone: '0445 678 901',
    messagingAppType: 'wechat',
    messagingAppId: 'somchai_thai',
    quoteNumber: 'INV-2024-001236',
    businessName: 'Thai Basil Restaurant',
    abn: '34567890123',
    registeredAddress: '92 Lygon Street',
    registeredSuburb: 'Melbourne',
    registeredPostcode: '3053',
    registeredState: 'VIC',
    registeredCountry: 'Australia',
    eftposIntegration: 'no',
    alipayOption: 'superpay',
    readyBy: 'Before Christmas 2025',
    heardAbout: 'wechat',
    menuFiles: [
      { filename: 'thai-menu.pdf', url: '/mock-files/thai-menu.pdf', size: 156000, uploadedAt: '2025-11-18T11:20:00Z' }
    ],
    notes: 'Family-owned restaurant, first time using digital POS',
    submittedAt: '2025-11-18T11:30:00Z',
  },
  {
    id: '4',
    token: 'jkl345mno678',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-17T14:45:00Z',
    status: 'submitted',
    contactEmail: 'info@pizzaroma.com.au',
    ownerName: 'Marco Rossi',
    contactPhone: '0456 789 012',
    messagingAppType: 'whatsapp',
    messagingAppId: '0456789012',
    quoteNumber: 'INV-2024-001237',
    businessName: 'Pizza Roma',
    abn: '45678901234',
    registeredAddress: '156 Oxford Street',
    registeredSuburb: 'Sydney',
    registeredPostcode: '2021',
    registeredState: 'NSW',
    registeredCountry: 'Australia',
    eftposIntegration: 'yes',
    alipayOption: 'royalpay',
    readyBy: 'February 2026',
    heardAbout: 'friend',
    menuFiles: [
      { filename: 'pizza-menu-english.pdf', url: '/mock-files/pizza-menu-english.pdf', size: 278000, uploadedAt: '2025-11-17T17:00:00Z' },
      { filename: 'pizza-menu-italian.pdf', url: '/mock-files/pizza-menu-italian.pdf', size: 289000, uploadedAt: '2025-11-17T17:01:00Z' }
    ],
    notes: 'Planning to open second location soon, want consistent system across both stores',
    submittedAt: '2025-11-17T17:10:00Z',
  },
  {
    id: '5',
    token: 'pqr901stu234',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-16T11:20:00Z',
    status: 'submitted',
    contactEmail: 'admin@dumplinghouse.com.au',
    ownerName: 'Wei Zhang',
    contactPhone: '0467 890 123',
    messagingAppType: 'wechat',
    messagingAppId: 'weizhang_dumplings',
    quoteNumber: 'INV-2024-001238',
    businessName: 'Golden Dumpling House',
    abn: '56789012345',
    registeredAddress: '234 Victoria Street',
    registeredSuburb: 'Perth',
    registeredPostcode: '6000',
    registeredState: 'WA',
    registeredCountry: 'Australia',
    eftposIntegration: 'yes',
    alipayOption: 'open',
    readyBy: 'Late December 2025',
    heardAbout: 'google',
    menuSendLater: true,
    notes: 'High volume restaurant, need table management and kitchen display features',
    submittedAt: '2025-11-16T13:45:00Z',
  },
  {
    id: '6',
    token: 'vwx567yza890',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-15T08:30:00Z',
    status: 'submitted',
    contactEmail: 'hello@bubbletea.net.au',
    ownerName: 'Amy Liu',
    contactPhone: '0478 901 234',
    messagingAppType: 'wechat',
    messagingAppId: 'amyliu_tea',
    quoteNumber: 'INV-2024-001239',
    businessName: 'Bubble Tea Paradise',
    abn: '67890123456',
    registeredAddress: '88 Swanston Street',
    registeredSuburb: 'Melbourne',
    registeredPostcode: '3000',
    registeredState: 'VIC',
    registeredCountry: 'Australia',
    eftposIntegration: 'no',
    alipayOption: 'not-interested',
    readyBy: 'Mid January 2026',
    heardAbout: 'saw',
    menuFiles: [
      { filename: 'drinks-menu.pdf', url: '/mock-files/drinks-menu.pdf', size: 98000, uploadedAt: '2025-11-15T10:05:00Z' }
    ],
    notes: 'Small store, simple setup preferred',
    submittedAt: '2025-11-15T10:15:00Z',
  },
  {
    id: '7',
    token: 'bcd123efg456',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-14T16:00:00Z',
    status: 'pending',
  },
  {
    id: '8',
    token: 'hij789klm012',
    generatedBy: 'admin@vend88.com',
    generatedAt: '2025-11-13T10:45:00Z',
    status: 'approved',
    contactEmail: 'info@koreanbbq.com.au',
    ownerName: 'Min-Ji Park',
    contactPhone: '0489 012 345',
    quoteNumber: 'INV-2024-001240',
    businessName: 'Seoul BBQ House',
    abn: '78901234567',
    registeredAddress: '45 Little Bourke Street',
    registeredSuburb: 'Melbourne',
    registeredPostcode: '3000',
    registeredState: 'VIC',
    registeredCountry: 'Australia',
    eftposIntegration: 'yes',
    alipayOption: 'royalpay',
    readyBy: 'Already ready',
    heardAbout: 'friend',
    menuFiles: [
      { filename: 'bbq-menu.pdf', url: '/mock-files/bbq-menu.pdf', size: 234000, uploadedAt: '2025-11-13T12:15:00Z' }
    ],
    notes: 'Approved and set up successfully',
    submittedAt: '2025-11-13T12:30:00Z',
    approvedAt: '2025-11-13T14:15:00Z',
    approvedBy: 'admin@vend88.com',
  },
];

let nextId = 9;

/**
 * Generate a new registration token
 */
export const generateRegistrationToken = async (adminEmail: string): Promise<{
  success: boolean;
  data?: {
    id: string;
    token: string;
    link: string;
    generatedBy: string;
    generatedAt: string;
    status: string;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const token = generateRandomToken();
  const id = String(nextId++);
  const generatedAt = new Date().toISOString();

  const newRegistration: Registration = {
    id,
    token,
    generatedBy: adminEmail,
    generatedAt,
    status: 'pending',
  };

  mockRegistrations.unshift(newRegistration);

  return {
    success: true,
    data: {
      id,
      token,
      link: `${window.location.origin}/register?token=${token}`,
      generatedBy: adminEmail,
      generatedAt,
      status: 'pending',
    },
  };
};

/**
 * Fetch all registrations with optional filtering
 */
export const fetchRegistrations = async (params?: {
  status?: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired' | 'all';
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  data?: {
    registrations: Registration[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const status = params?.status || 'all';
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  let filtered = [...mockRegistrations];

  if (status !== 'all') {
    filtered = filtered.filter(reg => reg.status === status);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    success: true,
    data: {
      registrations: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
  };
};

/**
 * Get registration details by ID
 */
export const getRegistrationById = async (id: string): Promise<{
  success: boolean;
  data?: Registration;
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const registration = mockRegistrations.find(reg => reg.id === id);

  if (!registration) {
    return {
      success: false,
      error: 'Registration not found',
    };
  }

  return {
    success: true,
    data: registration,
  };
};

/**
 * Update registration details
 */
export const updateRegistration = async (
  id: string,
  updates: Partial<Registration>
): Promise<{
  success: boolean;
  data?: Registration;
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = mockRegistrations.findIndex(reg => reg.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Registration not found',
    };
  }

  mockRegistrations[index] = {
    ...mockRegistrations[index],
    ...updates,
  };

  return {
    success: true,
    data: mockRegistrations[index],
  };
};

/**
 * Approve a registration
 */
export const approveRegistration = async (id: string, approvedBy?: string): Promise<{
  success: boolean;
  data?: {
    registrationId: string;
    businessId: string;
    status: string;
    approvedAt: string;
    approvedBy?: string;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const index = mockRegistrations.findIndex(reg => reg.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Registration not found',
    };
  }

  // Allow approving both submitted and rejected registrations
  if (mockRegistrations[index].status !== 'submitted' && mockRegistrations[index].status !== 'rejected') {
    return {
      success: false,
      error: 'Registration can only be approved from submitted or rejected status',
    };
  }

  mockRegistrations[index].status = 'approved';
  const approvedAt = new Date().toISOString();
  
  // Store approval timestamp and approver in the registration
  mockRegistrations[index].approvedAt = approvedAt;
  if (approvedBy) {
    mockRegistrations[index].approvedBy = approvedBy;
  }

  // Auto-create business from approved registration
  const registration = mockRegistrations[index];
  const { createBusinessFromRegistration } = await import('./mockBusinessApi');
  
  const businessResult = await createBusinessFromRegistration({
    registrationId: registration.id,
    businessName: registration.businessName || 'Unnamed Business',
    abn: registration.abn,
    address: registration.registeredAddress,
    suburb: registration.registeredSuburb,
    postcode: registration.registeredPostcode,
    state: registration.registeredState,
    country: registration.registeredCountry,
    contactEmail: registration.contactEmail,
    contactPhone: registration.contactPhone,
    eftposIntegration: registration.eftposIntegration,
    alipayOption: registration.alipayOption,
  });

  return {
    success: true,
    data: {
      registrationId: id,
      businessId: businessResult.data?._id || `biz_${Date.now()}`,
      status: 'approved',
      approvedAt,
      approvedBy,
    },
  };
};

/**
 * Reject a registration
 */
export const rejectRegistration = async (
  id: string,
  reason?: string,
  rejectedBy?: string
): Promise<{
  success: boolean;
  data?: {
    registrationId: string;
    status: string;
    rejectedAt: string;
    rejectedBy?: string;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const index = mockRegistrations.findIndex(reg => reg.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Registration not found',
    };
  }

  if (mockRegistrations[index].status !== 'submitted') {
    return {
      success: false,
      error: 'Registration is not in submitted status',
    };
  }

  mockRegistrations[index].status = 'rejected';
  const rejectedAt = new Date().toISOString();
  
  // Store rejection reason and rejector in the registration
  if (reason) {
    mockRegistrations[index].rejectionReason = reason;
  }
  mockRegistrations[index].rejectedAt = rejectedAt;
  if (rejectedBy) {
    mockRegistrations[index].rejectedBy = rejectedBy;
  }

  return {
    success: true,
    data: {
      registrationId: id,
      status: 'rejected',
      rejectedAt,
      rejectedBy,
    },
  };
};

/**
 * Validate registration token (for onboarding form)
 */
export const validateToken = async (token: string): Promise<{
  success: boolean;
  data?: {
    valid: boolean;
    expired: boolean;
    used: boolean;
    reason?: string;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const registration = mockRegistrations.find(reg => reg.token === token);

  if (!registration) {
    return {
      success: true,
      data: {
        valid: false,
        expired: false,
        used: false,
        reason: 'Invalid token',
      },
    };
  }

  if (registration.status === 'submitted' || registration.status === 'approved' || registration.status === 'rejected') {
    return {
      success: true,
      data: {
        valid: false,
        expired: false,
        used: true,
        reason: 'This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes.',
      },
    };
  }

  // Check expiry (30 days from generation)
  const generatedDate = new Date(registration.generatedAt);
  const expiryDate = new Date(generatedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  if (now > expiryDate) {
    return {
      success: true,
      data: {
        valid: false,
        expired: true,
        used: false,
        reason: 'Token has expired',
      },
    };
  }

  return {
    success: true,
    data: {
      valid: true,
      expired: false,
      used: false,
    },
  };
};

/**
 * Submit registration form (for onboarding form)
 */
export const submitRegistrationForm = async (
  token: string,
  formData: Omit<Registration, 'id' | 'token' | 'generatedBy' | 'generatedAt' | 'status' | 'submittedAt'>
): Promise<{
  success: boolean;
  data?: {
    registrationId: string;
    status: string;
    submittedAt: string;
    message: string;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validate token first
  const validation = await validateToken(token);
  if (!validation.data?.valid) {
    return {
      success: false,
      error: validation.data?.reason || 'Invalid token',
    };
  }

  const index = mockRegistrations.findIndex(reg => reg.token === token);

  if (index === -1) {
    return {
      success: false,
      error: 'Token not found',
    };
  }

  const submittedAt = new Date().toISOString();

  mockRegistrations[index] = {
    ...mockRegistrations[index],
    ...formData,
    status: 'submitted',
    submittedAt,
  };

  return {
    success: true,
    data: {
      registrationId: mockRegistrations[index].id,
      status: 'submitted',
      submittedAt,
      message: 'Your registration has been submitted successfully. We will review and contact you soon.',
    },
  };
};

/**
 * Revoke/Cancel a pending registration
 */
export const revokeRegistration = async (
  id: string,
  cancelledBy?: string
): Promise<{
  success: boolean;
  data?: {
    registrationId: string;
    status: string;
    cancelledAt: string;
    cancelledBy?: string;
  };
  error?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockRegistrations.findIndex(reg => reg.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Registration not found',
    };
  }

  if (mockRegistrations[index].status !== 'pending') {
    return {
      success: false,
      error: 'Only pending registrations can be revoked',
    };
  }

  mockRegistrations[index].status = 'cancelled';
  const cancelledAt = new Date().toISOString();
  
  mockRegistrations[index].cancelledAt = cancelledAt;
  if (cancelledBy) {
    mockRegistrations[index].cancelledBy = cancelledBy;
  }

  return {
    success: true,
    data: {
      registrationId: id,
      status: 'cancelled',
      cancelledAt,
      cancelledBy,
    },
  };
};

// Helper function to generate random token
function generateRandomToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
