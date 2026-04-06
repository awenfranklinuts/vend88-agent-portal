import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullUrl = `${getBackendBaseUrl()}/portal/admin/list`;
    console.log('[Admin List API] Forwarding to:', fullUrl);

    const response = await axios.post(fullUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      httpsAgent,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('[Admin List API] Error:', error.response?.data || error.message);
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json(
      { message: 'Internal server error', status_code: 500 },
      { status: 500 }
    );
  }
}
