import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, first_name, last_name, phone_number, username, password } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required', status_code: 400 },
        { status: 400 }
      );
    }

    if (!email || !first_name || !last_name || !password) {
      return NextResponse.json(
        { message: 'Email, first_name, last_name and password are required', status_code: 400 },
        { status: 400 }
      );
    }

    console.log(`[Admin Create API] Mock creating admin: ${email}`);

    const newId = `admin_${Date.now().toString(36)}`;
    return NextResponse.json({
      status_code: 200,
      status_msg: 'User created successfully',
      user_id: newId,
      email,
      first_name,
      last_name,
      username: username || '',
      phone_number: phone_number || '',
      created_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Admin Create API] Error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
}
