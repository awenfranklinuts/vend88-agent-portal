import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status_code: 401, status_msg: 'Unauthorized' });
    }

    const { id } = req.query;
    const registrationId = Array.isArray(id) ? id[0] : id;

    // Call the real registration API
    try {
      const url = `${getBackendBaseUrl()}/registration/${registrationId}`;
      
      if (req.method === 'GET') {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          timeout: 5000,
          httpsAgent,
        });

        return res.status(response.status).json(response.data);
      } else if (req.method === 'POST') {
        // Handle POST for updates
        const response = await axios.post(url, req.body, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          timeout: 5000,
          httpsAgent,
        });

        return res.status(response.status).json(response.data);
      }
    } catch (apiErr: any) {
      console.error('[API Proxy] Registration operation failed:', apiErr?.message || apiErr);
      console.error('[API Proxy] Error response status:', apiErr?.response?.status);
      console.error('[API Proxy] Error response data:', apiErr?.response?.data);
      
      // If backend returned an error response, forward it
      if (apiErr?.response?.status) {
        return res.status(apiErr.response.status).json(apiErr.response.data || { 
          status_code: apiErr.response.status, 
          status_msg: 'Backend error' 
        });
      }
      
      // Return generic error
      return res.status(500).json({ status_code: 500, status_msg: 'Registration operation failed', error: apiErr?.message });
    }
  } catch (err: any) {
    console.error('[API Proxy] Registration error:', err?.message || err);
    return res.status(500).json({ status_code: 500, status_msg: 'error' });
  }
}
