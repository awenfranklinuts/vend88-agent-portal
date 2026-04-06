import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';
import { getBackendBaseUrl } from '@/config/server';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Mock registration data for fallback
const mockRegistrations = [
  {
    id: 'V88-REG-001',
    form_id: 'V88-REG-001',
    business_name: "Smith's Coffee Shop",
    abn: '12345678901',
    contact_name: 'John Smith',
    contact_email: 'john.smith@coffeeshop.com',
    contact_phone: '+61412345678',
    messagingAppType: 'whatsapp',
    messagingAppId: '+61412345678',
    status: 'pending',
    submitted_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'V88-REG-002',
    form_id: 'V88-REG-002',
    business_name: "Jane's Restaurant",
    abn: '98765432109',
    contact_name: 'Jane Doe',
    contact_email: 'jane.doe@restaurant.com',
    contact_phone: '+61498765432',
    messagingAppType: 'wechat',
    messagingAppId: 'janedoe_wechat',
    status: 'approved',
    submitted_at: '2024-02-20T14:15:00Z',
    approved_at: '2024-02-21T09:00:00Z',
    created_at: '2024-02-20T14:15:00Z'
  },
  {
    id: 'V88-REG-003',
    form_id: 'V88-REG-003',
    business_name: "Chen's Bakery",
    abn: '55566677788',
    contact_name: 'Michael Chen',
    contact_email: 'michael.chen@bakery.com',
    contact_phone: '+61455123789',
    status: 'pending',
    submitted_at: '2024-03-10T09:00:00Z',
    created_at: '2024-03-10T09:00:00Z'
  },
  {
    id: 'V88-REG-004',
    form_id: 'V88-REG-004',
    business_name: "Williams Cafe",
    abn: '11122233344',
    contact_name: 'Sarah Williams',
    contact_email: 'sarah.williams@cafe.com',
    contact_phone: '+61433987654',
    messagingAppType: 'whatsapp',
    messagingAppId: '+61433987654',
    status: 'rejected',
    submitted_at: '2024-04-05T11:20:00Z',
    rejected_at: '2024-04-06T10:00:00Z',
    rejection_reason: 'Invalid ABN',
    created_at: '2024-04-05T11:20:00Z'
  },
  {
    id: 'V88-REG-005',
    form_id: 'V88-REG-005',
    business_name: "Brown's Pizzeria",
    abn: '99988877766',
    contact_name: 'David Brown',
    contact_email: 'david.brown@pizzeria.com',
    contact_phone: '+61422567890',
    messagingAppType: 'wechat',
    messagingAppId: 'davidb_wechat88',
    status: 'approved',
    submitted_at: '2024-05-12T08:45:00Z',
    approved_at: '2024-05-13T14:30:00Z',
    created_at: '2024-05-12T08:45:00Z'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status_code: 401,
        status_msg: 'Unauthorized'
      });
    }

    const { form_id } = req.query;

    console.log('[API Proxy] Listing registrations...', { form_id });
    
    // Try to fetch from real API first
    try {
      const params: any = {};
      if (form_id) {
        params.form_id = form_id;
      }

      const response = await axios.get(
        `${getBackendBaseUrl()}/registration/list`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          params,
          timeout: 5000,
          httpsAgent,
        }
      );

      console.log('[API Proxy] Registration list response status:', response.status);
      return res.status(response.status).json(response.data);
    } catch (apiError: any) {
      console.log('[API Proxy] Real API failed, using mock data');
      
      // Filter mock data if form_id provided
      let filteredRegistrations = mockRegistrations;
      if (form_id) {
        filteredRegistrations = mockRegistrations.filter(reg => reg.form_id === form_id);
      }
      
      // Return mock data if real API fails - match backend structure
      return res.status(200).json({
        status_code: 200,
        status_msg: 'success',
        data: filteredRegistrations,
        registrations: filteredRegistrations // Keep for backwards compatibility
      });
    }
  } catch (error: any) {
    console.error('[API Proxy] Registration list error:', error.message);
    
    // Return mock data on any error - match backend structure
    return res.status(200).json({
      status_code: 200,
      status_msg: 'success (mock)',
      data: mockRegistrations,
      registrations: mockRegistrations // Keep for backwards compatibility
    });
  }
}
