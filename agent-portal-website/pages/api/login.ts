import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // WARNING: This disables SSL verification - only use in development
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('[API Proxy] Forwarding login request to backend...');
    console.log('[API Proxy] Request body:', req.body);
    
    // Forward the request to the actual backend with SSL verification disabled
    const response = await axios.post(
      'https://prod.vend88.com/admin/login',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
        httpsAgent, // Use the agent that ignores SSL errors
      }
    );

    console.log('[API Proxy] Backend response status:', response.status);
    console.log('[API Proxy] Backend response data:', response.data);
    
    // Forward the response back to the client
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[API Proxy] Error:', error.message);
    console.error('[API Proxy] Error code:', error.code);
    console.error('[API Proxy] Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    });

    // Forward error response from backend
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data || { message: 'Backend error' }
      );
    }

    // Network or timeout error
    return res.status(503).json({
      message: 'Unable to connect to backend server',
      error: error.message,
      code: error.code,
    });
  }
}
