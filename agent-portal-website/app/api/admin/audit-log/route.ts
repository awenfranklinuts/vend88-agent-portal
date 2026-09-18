import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getBackendBaseUrl } from '@/config/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, user_id } = body;

    if (!token || !user_id) {
      return NextResponse.json(
        { message: 'token and user_id are required', status_code: 400 },
        { status: 400 }
      );
    }

    try {
      const response = await axios.post(
        `${getBackendBaseUrl()}/portal/admin/audit-log`,
        body,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
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
