import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/config/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const response = await fetch(`${getBackendBaseUrl()}/registration/form-templates/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { status_code: 500, message: 'Failed to delete form template' },
      { status: 500 }
    );
  }
}
