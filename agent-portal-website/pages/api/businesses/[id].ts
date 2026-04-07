import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import { API_CONFIG } from '../../../config/api';

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
    const { id } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status_code: 401,
        message: 'Unauthorized'
      });
    }

    console.log('[API Proxy] Getting business:', id);
    
    try {
      const externalUrl = `${API_CONFIG.BASE_URL}/businesses/${id}`;
      const response = await axios.post(
        externalUrl,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          timeout: 5000,
          httpsAgent,
        }
      );

      console.log('[API Proxy] Business get response status:', response.status);
      return res.status(response.status).json(response.data);
    } catch (apiError: any) {
      console.log('[API Proxy] Real API failed, error:', apiError?.message);
      throw apiError;
    }
  } catch (error: any) {
    console.error('[API Proxy] Business get error:', error.message);
    
    return res.status(error?.response?.status || 500).json({
      status_code: error?.response?.status || 500,
      message: error?.response?.data?.message || error.message || 'Failed to get business'
    });
  }
}
