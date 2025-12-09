import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

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
    const authHeader = req.headers.authorization;

    console.log('[API Proxy] Searching businesses...');
    
    const response = await axios.post(
      'https://prod.vend88.com/search/business_search',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        timeout: 15000,
        httpsAgent,
      }
    );

    console.log('[API Proxy] Search response status:', response.status);
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[API Proxy] Search error:', error.message);
    
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
