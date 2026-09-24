import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getBackendBaseUrl } from '../../../../config/server';

// A business's activity log: /portal/businesses/:id/activity
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { id } = req.query;
  try {
    const response = await axios.post(
      `${getBackendBaseUrl()}/portal/businesses/${encodeURIComponent(String(id))}/activity`,
      req.body,
      { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
    );
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(502).json({ status_code: 502, status_msg: 'error', message: 'Failed to reach backend service' });
  }
}
