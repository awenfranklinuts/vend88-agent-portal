import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Body: { token, id } - the registration's _id or form_id
export async function POST(request: NextRequest) {
  try {
    const { token, id } = await request.json();
    if (!token || !id) {
      return NextResponse.json({ status_code: 400, status_msg: 'error', message: 'token and id are required' }, { status: 400 });
    }
    const response = await axios.post(
      `${getBackendBaseUrl()}/registration/delete/${encodeURIComponent(id)}`,
      { token },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, timeout: 15000, httpsAgent }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json({ status_code: 502, status_msg: 'error', message: 'Failed to reach backend service' }, { status: 502 });
  }
}
