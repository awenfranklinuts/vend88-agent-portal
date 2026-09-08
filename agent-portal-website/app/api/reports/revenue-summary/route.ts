import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, period } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required', status_code: 400 },
        { status: 400 }
      );
    }

    try {
      const response = await axios.post(
        `${getBackendBaseUrl()}/portal/revenue/summary`,
        { token, period },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
          httpsAgent,
        }
      );

      return NextResponse.json(response.data, { status: response.status });
    } catch (apiError: any) {
      const status = apiError.response?.status || 502;
      const data = apiError.response?.data || {
        status_code: status,
        status_msg: 'error',
        message: 'Failed to reach backend service',
      };
      return NextResponse.json(data, { status });
    }
  } catch (error: any) {
    return NextResponse.json(
      { status_code: 500, status_msg: 'error', message: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
