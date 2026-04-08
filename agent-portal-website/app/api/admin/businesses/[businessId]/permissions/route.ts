import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Business permissions mapping
const businessPermissions: Record<string, string[]> = {
  'business_001': [
    'manage_devices',
    'manage_staff',
    'view_reports',
    'manage_settings',
    'manage_menu',
    'manage_orders',
  ],
  'business_002': [
    'view_reports',
    'manage_menu',
    'manage_orders',
  ],
  'business_003': [
    'manage_devices',
    'manage_staff',
    'view_reports',
    'manage_settings',
    'manage_menu',
    'manage_orders',
    'manage_customers',
    'manage_integrations',
  ],
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const body = await request.json();
    const { token } = body;
    const { businessId } = await params;

    if (!businessId) {
      return NextResponse.json(
        { message: 'businessId is required', status_code: 400 },
        { status: 400 }
      );
    }

    console.log('[Business Permissions API] Fetching permissions for:', businessId);

    // Try to forward request to backend
    try {
      const response = await axios.post(
        `${getBackendBaseUrl()}/portal/admin/businesses/${businessId}/permissions`,
        { token, business_id: businessId },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          timeout: 5000,
          httpsAgent,
        }
      );

      return NextResponse.json(response.data, { status: response.status });
    } catch (backendError: any) {
      // If backend is not available or returns error, use mock data
      console.log('[Business Permissions API] Error from backend:', backendError.message);

      const mockData = {
        status_code: 200,
        status_msg: 'success',
        business_id: businessId,
        permissions: businessPermissions[businessId] || [
          'view_reports',
          'manage_menu',
          'manage_orders',
        ],
      };

      return NextResponse.json(mockData, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error in business permissions API:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        status_code: 500,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
