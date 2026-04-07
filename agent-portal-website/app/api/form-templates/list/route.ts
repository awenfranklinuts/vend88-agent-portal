import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/config/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const target = new URL(`${getBackendBaseUrl()}/registration/form-templates/list`);
    if (status) {
      target.searchParams.set('status', status);
    }

    const authHeader = request.headers.get('authorization');
    const response = await fetch(target.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { status_code: 500, message: 'Failed to fetch form templates' },
      { status: 500 }
    );
  }
}
