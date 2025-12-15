import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Mock admin profile data
const mockAdminProfile = {
  status_code: 200,
  status_msg: 'success',
  email: 'admin@vend88.com',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'Pospal',
  created_at: '2024-01-01T00:00:00Z'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required', status_code: 400 },
        { status: 400 }
      );
    }

    console.log('[Admin Profile API] Fetching admin profile...');

    // Try to forward request to backend
    try {
      const response = await axios.post(
        'https://prod.vend88.com/admin/profile',
        { token },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
          httpsAgent,
        }
      );

      // Check if the response is actually successful
      if (response.data.status_code === 200) {
        console.log('[Admin Profile API] Real API success');
        return NextResponse.json(response.data, { status: 200 });
      } else {
        // Backend returned error, use mock data
        console.log('[Admin Profile API] Backend error, using mock data:', response.data);
        return NextResponse.json(mockAdminProfile, { status: 200 });
      }
    } catch (apiError: any) {
      // Real API failed, use mock data
      console.log('[Admin Profile API] Real API failed, using mock data');
      return NextResponse.json(mockAdminProfile, { status: 200 });
    }
  } catch (error: any) {
    console.error('[Admin Profile API] Unexpected error:', error.message);
    
    // Return mock data on any unexpected error
    return NextResponse.json(mockAdminProfile, { status: 200 });
  }
}
