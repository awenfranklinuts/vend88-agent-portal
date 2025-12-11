import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    console.log('[Admin Profile API] Fetching admin profile...');

    // Forward request to backend
    const response = await axios.post(
      'https://prod.vend88.com/admin/profile',
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
        httpsAgent,
      }
    );

    console.log('[Admin Profile API] Success:', response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('[Admin Profile API] Error:', error.response?.data || error.message);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data || { message: 'Backend error' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Unable to connect to backend server', error: error.message },
      { status: 503 }
    );
  }
}
