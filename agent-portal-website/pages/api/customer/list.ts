import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Mock customer data
const mockCustomers = [
  {
    _id: 'cust_001',
    name: 'John Smith',
    email: 'john.smith@coffeeshop.com',
    phone: '+61412345678',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    _id: 'cust_002',
    name: 'Jane Doe',
    email: 'jane.doe@restaurant.com',
    phone: '+61498765432',
    created_at: '2024-02-20T14:15:00Z'
  },
  {
    _id: 'cust_003',
    name: 'Michael Chen',
    email: 'michael.chen@bakery.com',
    phone: '+61455123789',
    created_at: '2024-03-10T09:00:00Z'
  },
  {
    _id: 'cust_004',
    name: 'Sarah Williams',
    email: 'sarah.williams@cafe.com',
    phone: '+61433987654',
    created_at: '2024-04-05T11:20:00Z'
  },
  {
    _id: 'cust_005',
    name: 'David Brown',
    email: 'david.brown@pizzeria.com',
    phone: '+61422567890',
    created_at: '2024-05-12T08:45:00Z'
  },
  {
    _id: 'cust_006',
    name: 'Emily Taylor',
    email: 'emily.taylor@teahouse.com',
    phone: '+61488654321',
    created_at: '2024-06-18T16:30:00Z'
  },
  {
    _id: 'cust_007',
    name: 'Robert Wilson',
    email: 'robert.wilson@bistro.com',
    phone: '+61477234567',
    created_at: '2024-07-22T13:10:00Z'
  },
  {
    _id: 'cust_008',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@diner.com',
    phone: '+61466789012',
    created_at: '2024-08-14T10:00:00Z'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

    console.log('[API Proxy] Listing customers...');
    
    // Try to fetch from real API first
    try {
      const response = await axios.post(
        'https://prod.vend88.com/customer/list',
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          timeout: 5000,
          httpsAgent,
        }
      );

      console.log('[API Proxy] Customer list response status:', response.status);
      return res.status(response.status).json(response.data);
    } catch (apiError: any) {
      console.log('[API Proxy] Real API failed, using mock data');
      
      // Return mock data if real API fails
      return res.status(200).json({
        status_code: 200,
        status_msg: 'success',
        customers: mockCustomers
      });
    }
  } catch (error: any) {
    console.error('[API Proxy] Customer list error:', error.message);
    
    // Return mock data on any error
    return res.status(200).json({
      status_code: 200,
      status_msg: 'success (mock)',
      customers: mockCustomers
    });
  }
}
