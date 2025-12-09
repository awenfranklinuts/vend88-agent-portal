import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

// Create an axios instance that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, ...rest } = req.body;
    const authHeader = req.headers.authorization;

    console.log('[API Proxy] Fetching admin profile...');
    
    const response = await axios.post(
      'https://prod.vend88.com/admin/profile',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader || `Bearer ${token}`,
        },
        timeout: 15000,
        httpsAgent,
      }
    );

    console.log('[API Proxy] Profile response status:', response.status);
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[API Proxy] Profile error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data || { message: 'Backend error' }
      );
    }

    return res.status(503).json({
      message: 'Unable to connect to backend server',
      error: error.message,
    });
  }
}
