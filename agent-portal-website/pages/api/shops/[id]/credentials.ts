import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getBackendBaseUrl } from '../../../../config/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST lists the shop's store logins, PUT adds one, PATCH edits one.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const suffix = req.method === 'PUT' ? '/create' : req.method === 'PATCH' ? '/update' : '';
    const fullUrl = `${getBackendBaseUrl()}/portal/shops/${id}/credentials${suffix}`;
    console.log('[Shop Credentials API] Forwarding to:', fullUrl);

    const response = await axios.post(fullUrl, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Shop Credentials API] Error:', error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      status_code: 500,
      message: 'Internal server error',
    });
  }
}
