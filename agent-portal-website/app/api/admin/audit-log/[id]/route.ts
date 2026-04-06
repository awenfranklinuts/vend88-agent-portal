import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!id || !token) {
      return NextResponse.json({ error: 'ID and token required' }, { status: 400 });
    }

    const response = await axios.get(
      `${API_BASE}/portal/admin/audit-log/${id}?token=${token}`
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { error: 'Internal server error' };
    return NextResponse.json(data, { status });
  }
}
