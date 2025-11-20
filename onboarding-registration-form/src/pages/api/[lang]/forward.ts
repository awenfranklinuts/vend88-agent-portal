import { NextApiRequest, NextApiResponse } from 'next';
import { forwardRequest } from '../../../lib/proxy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lang } = req.query;

    if (!lang || typeof lang !== 'string') {
        return res.status(400).json({ error: 'Language parameter is required' });
    }

    try {
        const response = await forwardRequest(req, lang);
        res.status(response.status).json(await response.json());
    } catch (error) {
        res.status(500).json({ error: 'Error forwarding request', details: error.message });
    }
}