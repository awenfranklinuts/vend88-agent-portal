import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API_CONFIG } from '../../../config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS_LIST}`;
    const response = await axios.post(url, { token: req.body?.token || 'debug' }, { timeout: 5000 });
    return res.status(200).json({ ok: true, url, status: response.status, data: response.data });
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: 'external call failed', error: err?.message, status: err?.response?.status, response: err?.response?.data, url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS_LIST}` });
  }
}
