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
    const authHeader = request.headers.get('authorization');

    console.log('[Registration Generate API] Forwarding request...');
    console.log('[Registration Generate API] Body:', body);

    // Use the direct backend server for registration endpoints
    const backendUrl = 'http://52.63.11.1:5000/registration/generate';
    
    console.log(`[Registration Generate API] Calling: ${backendUrl}`);

    const response = await axios.post(
      backendUrl,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        timeout: 15000,
      }
    );

    console.log('[Registration Generate API] ✅ Success');
    console.log('[Registration Generate API] Response:', response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('[Registration Generate API] Error:', error.response?.data || error.message);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data || { message: 'Backend error' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Unable to connect to backend server', error: error.message },
      { status: 503 }
    );
  }
}
