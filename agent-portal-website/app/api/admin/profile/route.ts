import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

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
        { message: 'Token is required', status_code: 400 },
        { status: 400 }
      );
    }

    console.log('[Admin Profile API] Fetching admin profile...');

    try {
      const response = await axios.post(
        `${getBackendBaseUrl()}/portal/auth/profile`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
          httpsAgent,
        }
      );

      return NextResponse.json(response.data, { status: response.status });
    } catch (apiError: any) {
      console.error('[Admin Profile API] Backend request failed:', apiError.message);
      const status = apiError.response?.status || 502;
      const data = apiError.response?.data || {
        status_code: status,
        status_msg: 'error',
        message: 'Failed to reach backend service',
      };
      return NextResponse.json(data, { status });
    }
  } catch (error: any) {
    console.error('[Admin Profile API] Unexpected error:', error.message);
    return NextResponse.json(
      { status_code: 500, status_msg: 'error', message: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
