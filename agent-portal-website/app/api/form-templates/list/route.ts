import { NextRequest, NextResponse } from 'next/server';

const mockTemplates = [
  {
    id: 'tpl_001',
    name: 'Standard Onboarding',
    description: 'Full onboarding form with all required business details',
    version: 3,
    visibility: 'all',
    visible_roles: [],
    status: 'active',
    created_by: 'superadmin@vend88.com',
    created_at: '2025-08-15T09:00:00Z',
    updated_at: '2026-02-10T14:30:00Z',
    fields: [
      { id: 'contact_email', label: 'Email Address', type: 'email', required: true, order: 1 },
      { id: 'contact_name', label: 'Contact Name', type: 'text', required: true, order: 2 },
      { id: 'contact_phone', label: 'Phone Number', type: 'phone', required: true, order: 3 },
      { id: 'business_name', label: 'Business Name', type: 'text', required: true, order: 4 },
      { id: 'abn', label: 'ABN', type: 'text', required: true, order: 5 },
      { id: 'registered_address', label: 'Registered Address', type: 'text', required: true, order: 6, group: 'Address' },
      { id: 'registered_suburb', label: 'Suburb', type: 'text', required: true, order: 7, group: 'Address' },
      { id: 'registered_state', label: 'State', type: 'select', required: true, order: 8, group: 'Address' },
      { id: 'registered_postcode', label: 'Postcode', type: 'text', required: true, order: 9, group: 'Address' },
      { id: 'eftpos_integration', label: 'EFTPOS Integration', type: 'select', required: true, order: 10 },
      { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false, order: 11 },
    ],
  },
  {
    id: 'tpl_002',
    name: 'Quick Registration',
    description: 'Minimal form for fast signups — email and basic contact info only',
    version: 1,
    visibility: 'all',
    visible_roles: [],
    status: 'active',
    created_by: 'sarah.chen@vend88.com',
    created_at: '2026-01-20T10:30:00Z',
    updated_at: '2026-01-20T10:30:00Z',
    fields: [
      { id: 'contact_email', label: 'Email Address', type: 'email', required: true, order: 1 },
      { id: 'contact_name', label: 'Contact Name', type: 'text', required: true, order: 2 },
      { id: 'contact_phone', label: 'Phone Number', type: 'phone', required: false, order: 3 },
      { id: 'business_name', label: 'Business Name', type: 'text', required: true, order: 4 },
    ],
  },
  {
    id: 'tpl_003',
    name: 'Full Business Profile',
    description: 'Comprehensive form including payment integrations, menu upload, and referral tracking',
    version: 2,
    visibility: 'specific_roles',
    visible_roles: ['super_admin'],
    status: 'active',
    created_by: 'superadmin@vend88.com',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-03-15T16:20:00Z',
    fields: [
      { id: 'contact_email', label: 'Email Address', type: 'email', required: true, order: 1 },
      { id: 'contact_name', label: 'Contact Name', type: 'text', required: true, order: 2 },
      { id: 'contact_phone', label: 'Phone Number', type: 'phone', required: true, order: 3 },
      { id: 'messaging_app_type', label: 'Messaging App', type: 'select', required: true, order: 4 },
      { id: 'quote_number', label: 'Quote Number', type: 'text', required: true, order: 5 },
      { id: 'business_name', label: 'Business Name', type: 'text', required: true, order: 6 },
      { id: 'abn', label: 'ABN', type: 'text', required: true, order: 7 },
      { id: 'registered_address', label: 'Registered Address', type: 'text', required: true, order: 8, group: 'Address' },
      { id: 'registered_suburb', label: 'Suburb', type: 'text', required: true, order: 9, group: 'Address' },
      { id: 'registered_state', label: 'State', type: 'select', required: true, order: 10, group: 'Address' },
      { id: 'registered_postcode', label: 'Postcode', type: 'text', required: true, order: 11, group: 'Address' },
      { id: 'registered_country', label: 'Country', type: 'select', required: true, order: 12, group: 'Address' },
      { id: 'eftpos_integration', label: 'EFTPOS Integration', type: 'select', required: true, order: 13 },
      { id: 'alipay_option', label: 'Alipay', type: 'select', required: true, order: 14 },
      { id: 'ready_by', label: 'Ready By', type: 'textarea', required: true, order: 15 },
      { id: 'heard_about', label: 'How You Heard About Us', type: 'select', required: true, order: 16, group: 'How You Heard About Us' },
      { id: 'menu_files', label: 'Menu Files', type: 'text', required: true, order: 17, group: 'Menu Files' },
      { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false, order: 18 },
    ],
  },
  {
    id: 'tpl_004',
    name: 'Archived Legacy Form',
    description: 'Old version kept for reference — no longer in use',
    version: 1,
    visibility: 'admin_only',
    visible_roles: [],
    status: 'archived',
    created_by: 'superadmin@vend88.com',
    created_at: '2025-03-01T09:00:00Z',
    updated_at: '2025-06-15T11:00:00Z',
    fields: [
      { id: 'contact_email', label: 'Email Address', type: 'email', required: true, order: 1 },
      { id: 'contact_name', label: 'Contact Name', type: 'text', required: true, order: 2 },
      { id: 'business_name', label: 'Business Name', type: 'text', required: true, order: 3 },
    ],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let filtered = [...mockTemplates];
  if (status && status !== 'all') {
    filtered = filtered.filter(t => t.status === status);
  }

  return NextResponse.json({
    status_code: 200,
    status_msg: 'success',
    data: filtered,
  });
}
