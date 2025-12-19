import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import { API_CONFIG } from '@/config/api';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
      const url = `${API_CONFIG.REGISTRATION_BASE_URL}/registration/${registrationId}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        timeout: 5000,
        httpsAgent,
      });

      return res.status(response.status).json(response.data);
    } catch (apiErr: any) {
      console.error('[API Proxy] Registration detail failed:', apiErr?.message || apiErr);
      // Return 404-like payload matching backend shape when not found
      return res.status(200).json({ status_code: 404, status_msg: 'not found', data: null });
    }
  } catch (err: any) {
    console.error('[API Proxy] Registration detail error:', err?.message || err);
    return res.status(500).json({ status_code: 500, status_msg: 'error' });
  }
}
