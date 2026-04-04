import { NextRequest, NextResponse } from 'next/server';

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

    console.log(`[Admin Delete API] Mock deleting admin: ${user_id}`);

    return NextResponse.json({
      status_code: 200,
      status_msg: 'User deleted successfully',
      user_id,
    });
  } catch (error: any) {
    console.error('[Admin Delete API] Error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
}
