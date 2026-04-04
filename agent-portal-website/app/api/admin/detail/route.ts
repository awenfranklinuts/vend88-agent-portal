import { NextRequest, NextResponse } from 'next/server';

// Mock admin details keyed by user ID
const mockAdmins: Record<string, any> = {
  admin_001: {
    status_code: 200,
    status_msg: 'success',
    user_id: 'admin_001',
    email: 'superadmin@vend88.com',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'super_admin',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2025-11-20T14:30:00Z',
    last_login: '2026-04-04T08:15:00Z',
  },
  admin_002: {
    status_code: 200,
    status_msg: 'success',
    user_id: 'admin_002',
    email: 'sarah.chen@vend88.com',
    first_name: 'Sarah',
    last_name: 'Chen',
    role: 'admin',
    created_at: '2024-03-22T10:30:00Z',
    updated_at: '2025-12-01T09:00:00Z',
    last_login: '2026-04-03T16:45:00Z',
  },
  admin_003: {
    status_code: 200,
    status_msg: 'success',
    user_id: 'admin_003',
    email: 'james.wang@vend88.com',
    first_name: 'James',
    last_name: 'Wang',
    role: 'admin',
    created_at: '2024-06-10T14:00:00Z',
    updated_at: '2026-01-15T11:20:00Z',
    last_login: '2026-04-02T10:00:00Z',
  },
  admin_004: {
    status_code: 200,
    status_msg: 'success',
    user_id: 'admin_004',
    email: 'emily.liu@vend88.com',
    first_name: 'Emily',
    last_name: 'Liu',
    role: 'admin',
    created_at: '2024-09-05T08:45:00Z',
    updated_at: '2026-02-28T16:10:00Z',
    last_login: '2026-03-30T09:30:00Z',
  },
  admin_005: {
    status_code: 200,
    status_msg: 'success',
    user_id: 'admin_005',
    email: 'michael.zhang@vend88.com',
    first_name: 'Michael',
    last_name: 'Zhang',
    role: 'super_admin',
    created_at: '2025-01-20T11:15:00Z',
    updated_at: '2026-03-10T13:45:00Z',
    last_login: '2026-04-01T14:20:00Z',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, user_id } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required', status_code: 400 },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { message: 'user_id is required', status_code: 400 },
        { status: 400 }
      );
    }

    console.log(`[Admin Detail API] Returning mock detail for: ${user_id}`);

    const mock = mockAdmins[user_id];
    if (mock) {
      return NextResponse.json(mock, { status: 200 });
    }

    return NextResponse.json(
      { status_code: 404, status_msg: 'User not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('[Admin Detail API] Unexpected error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
}
