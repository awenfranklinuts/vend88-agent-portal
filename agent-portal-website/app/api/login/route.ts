import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // WARNING: This disables SSL verification - only use in development
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API Proxy] Forwarding login request to backend...');
    console.log('[API Proxy] Request body:', body);
    
    // Try multiple possible login endpoints
    const loginEndpoints = [
      '/admin/login',  // Original endpoint
      '/login',        // Alternative without /admin prefix
      '/auth/login',   // Alternative with /auth prefix
      '/user/login',   // Alternative with /user prefix
    ];

    let lastError: any = null;

    // Try each endpoint until one works
    for (const endpoint of loginEndpoints) {
      try {
        const fullUrl = `https://dev.vend88.com${endpoint}`;
        console.log(`[API Proxy] Trying login endpoint: ${fullUrl}`);
        
        // Forward the request to the actual backend with SSL verification disabled
        const response = await axios.post(
          fullUrl,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000,
            httpsAgent, // Use the agent that ignores SSL errors
          }
        );

        console.log('[API Proxy] ✅ Success with endpoint:', endpoint);
        console.log('[API Proxy] Backend response status:', response.status);
        console.log('[API Proxy] Backend response data:', response.data);
        
        // Forward the response back to the client
        return NextResponse.json(response.data, { status: response.status });
      } catch (error: any) {
        console.log(`[API Proxy] ❌ Failed with endpoint ${endpoint}:`, error.response?.status || error.code);
        lastError = error;
        
        // If it's not a 404, don't try other endpoints
        if (error.response?.status && error.response.status !== 404) {
          break;
        }
      }
    }

    // All endpoints failed
    console.error('[API Proxy] All login endpoints failed');
    console.error('[API Proxy] Last error:', lastError?.message);
    console.error('[API Proxy] Last error details:', {
      status: lastError?.response?.status,
      data: lastError?.response?.data,
      code: lastError?.code,
    });

    // Forward error response from backend
    if (lastError?.response) {
      return NextResponse.json(
        lastError.response.data || { 
          message: `Backend error: All login endpoints (${loginEndpoints.join(', ')}) failed. Please contact backend team.` 
        },
        { status: lastError.response.status }
      );
    }

    // Network or timeout error
    return NextResponse.json(
      {
        message: 'Unable to connect to backend server. All login endpoints failed.',
        error: lastError?.message,
        code: lastError?.code,
        attemptedEndpoints: loginEndpoints,
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('[API Proxy] Request parsing error:', error);
    return NextResponse.json(
      { message: 'Invalid request', error: error.message },
      { status: 400 }
    );
  }
}
