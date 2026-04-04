import { NextRequest, NextResponse } from 'next/server';

// Mock admin user IDs
const mockUserIDs = [
  'admin_001',
  'admin_002',
  'admin_003',
  'admin_004',
  'admin_005',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required', status_code: 400 },
        { status: 400 }
      );
    }

    console.log('[Admin List API] Returning mock admin list');
    return NextResponse.json({
      status_code: 200,
      status_msg: 'success',
      user_IDs: mockUserIDs,
    });
  } catch (error: any) {
    console.error('[Admin List API] Error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
}
