import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { status_code: 400, message: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Mock detail — in production this would query the database
    const mockDetails: Record<string, any> = {
      tpl_001: {
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
        version_history: [
          { version: 1, updated_at: '2025-08-15T09:00:00Z', updated_by: 'superadmin@vend88.com', change_note: 'Initial version' },
          { version: 2, updated_at: '2025-11-20T10:00:00Z', updated_by: 'superadmin@vend88.com', change_note: 'Added EFTPOS field' },
          { version: 3, updated_at: '2026-02-10T14:30:00Z', updated_by: 'sarah.chen@vend88.com', change_note: 'Made notes optional' },
        ],
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
        usage_count: 24,
      },
    };

    const detail = mockDetails[id];
    if (!detail) {
      return NextResponse.json({
        status_code: 404,
        message: 'Template not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      status_code: 200,
      status_msg: 'success',
      data: detail,
    });
  } catch {
    return NextResponse.json(
      { status_code: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
