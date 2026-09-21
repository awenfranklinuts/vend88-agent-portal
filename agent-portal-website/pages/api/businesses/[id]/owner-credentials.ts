import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getBackendBaseUrl } from '../../../../config/server';

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

    const response = await axios.post(fullUrl, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    // Status only - the body of this endpoint carries the POS login password.
    console.error('[Business Owner Credentials API] Error:', error.response?.status || error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      status_code: 500,
      message: 'Internal server error',
    });
  }
}
