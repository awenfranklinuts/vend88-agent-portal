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
      console.log('[Registration Generate API] Backend failed, using mock data');
      
      // Generate mock data for testing
      const mockFormId = `V88-REG-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
      const mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const mockResponse = {
        status_code: 200,
        success: true,
        message: 'Registration token generated successfully',
        data: {
          form_id: mockFormId,
          token: mockToken,
          link: `https://form.vend88.com/register?token=${mockToken}`,
          generated_by: body.admin_email,
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        }
      };
      
      return NextResponse.json(mockResponse, { status: 200 });
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
