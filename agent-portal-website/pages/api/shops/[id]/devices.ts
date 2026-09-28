import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getBackendBaseUrl } from '../../../../config/server';

// A store's registered POS devices: /portal/shops/:id/devices.
// POST lists them, PUT adds one, PATCH edits one, DELETE removes one - the same
// verb-to-suffix mapping as the store logins proxy next to this file.
const SUFFIX: Record<string, string> = { POST: '', PUT: '/create', PATCH: '/update', DELETE: '/delete' };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const suffix = SUFFIX[req.method || ''];
  if (suffix === undefined) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const fullUrl = `${getBackendBaseUrl()}/portal/shops/${encodeURIComponent(String(id))}/devices${suffix}`;
  try {
    const response = await axios.post(fullUrl, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    // The backend's status is passed through untouched: the panel reads a 404
    // or 501 as "this backend has no device API yet" rather than a failure.
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    console.error('[Shop Devices API] Error reaching', fullUrl, error.message);
    return res.status(502).json({ status_code: 502, status_msg: 'error', message: 'Failed to reach backend service' });
  }
}
