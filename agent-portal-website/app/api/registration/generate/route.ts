import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // WARNING: This disables SSL verification - only use in development
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    console.log('[Registration Generate API] Forwarding request...');
    console.log('[Registration Generate API] Body:', body);

    // Use development backend URL
    const backendUrl = `${getBackendBaseUrl()}/registration/generate`;
    
    console.log(`[Registration Generate API] Calling: ${backendUrl}`);

    try {
      const response = await axios.post(
        backendUrl,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader }),
          },
          timeout: 15000,
          httpsAgent,
        }
      );

      console.log('[Registration Generate API] ✅ Success');
      console.log('[Registration Generate API] Response:', response.data);
      return NextResponse.json(response.data, { status: response.status });
    } catch (backendError: any) {
      // No silent mock fallback here: fabricating a token would hand the admin a
      // link that no backend can ever validate, which reads as a working link
      // until the customer opens it.
      const status = backendError.response?.status || 502;
      const data = backendError.response?.data || {
        status_code: status,
        success: false,
        message: 'Failed to generate registration link',
      };
      console.error('[Registration Generate API] Backend error:', data);
      return NextResponse.json(data, { status });
    }
  } catch (error: any) {
    console.error('[Registration Generate API] Error:', error.message);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Unable to process request', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
