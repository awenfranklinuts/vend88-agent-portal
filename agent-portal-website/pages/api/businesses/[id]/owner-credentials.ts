import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '../../../../config/server';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST reads the credentials, PUT changes them.
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const suffix = req.method === 'PUT' ? '/update' : '';
    const fullUrl = `${getBackendBaseUrl()}/portal/businesses/${id}/owner-credentials${suffix}`;
    console.log('[Business Owner Credentials API] Forwarding to:', fullUrl);

    const response = await axios.post(fullUrl, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      httpsAgent,
    });

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Business Owner Credentials API] Error:', error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      status_code: 500,
      message: 'Internal server error',
    });
  }
}
