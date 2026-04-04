import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, user_id, email, first_name, last_name, phone_number, username } = body;

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

    console.log(`[Admin Update API] Mock updating admin: ${user_id}`);

    return NextResponse.json({
      status_code: 200,
      status_msg: 'User updated successfully',
      user_id,
      email: email || '',
      first_name: first_name || '',
      last_name: last_name || '',
      username: username || '',
      phone_number: phone_number || '',
      updated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Admin Update API] Error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
}
