import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getBackendBaseUrl } from '@/config/server';

// Forwards /api/teams/<anything> to the backend's /portal/teams/<anything>.
// One proxy for the whole Team Management API rather than a file per endpoint.
// Path segments come straight from the URL, so they are checked before being
// pasted into the backend URL: a segment of ".." (or an encoded one) would walk
// the proxy out of this prefix and onto another backend route.
const SAFE_SEGMENT = /^[A-Za-z0-9_.-]+$/;
const isSafePath = (path: string[]) =>
  path.length > 0 && path.every((segment) => segment !== '.' && segment !== '..' && SAFE_SEGMENT.test(segment));

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (!isSafePath(path)) {
    return NextResponse.json(
      { status_code: 400, status_msg: 'error', message: 'Invalid path' },
      { status: 400 }
    );
  }
  const fullUrl = `${getBackendBaseUrl()}/portal/teams/${path.join('/')}`;
  try {
    const body = await request.json();
    const response = await axios.post(fullUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
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
