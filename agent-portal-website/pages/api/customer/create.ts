import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '../../../config/server';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const response = await axios.post(`${getBackendBaseUrl()}/portal/customers/create`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      httpsAgent,
    });
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(502).json({ status_code: 502, status_msg: 'error', message: 'Failed to reach backend service' });
  }
}
