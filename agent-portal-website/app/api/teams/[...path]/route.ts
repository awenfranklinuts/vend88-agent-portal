import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Forwards /api/teams/<anything> to the backend's /portal/teams/<anything>.
// One proxy for the whole Team Management API rather than a file per endpoint.
export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const fullUrl = `${getBackendBaseUrl()}/portal/teams/${path.join('/')}`;
  try {
    const body = await request.json();
    const response = await axios.post(fullUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      httpsAgent,
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    console.error('[Teams API] Error reaching', fullUrl, error.message);
    return NextResponse.json(
      { status_code: 502, status_msg: 'error', message: 'Failed to reach backend service' },
      { status: 502 }
    );
  }
}
