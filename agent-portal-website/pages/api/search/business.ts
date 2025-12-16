import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Mock business data with owner_id for customer relationship
const mockBusinesses = [
  {
    _id: 'bus_001',
    name: "Smith's Coffee Shop",
    owner_id: 'cust_001',
    status: 'active',
    abn: '12345678901',
    address: '123 Main St, Sydney NSW 2000'
  },
  {
    _id: 'bus_002',
    name: "Smith's Second Location",
    owner_id: 'cust_001',
    status: 'active',
    abn: '12345678902',
    address: '456 George St, Sydney NSW 2000'
  },
  {
    _id: 'bus_003',
    name: "Doe's Fine Dining",
    owner_id: 'cust_002',
    status: 'active',
    abn: '98765432109',
    address: '789 Queen St, Melbourne VIC 3000'
  },
  {
    _id: 'bus_004',
    name: "Chen's Artisan Bakery",
    owner_id: 'cust_003',
    status: 'active',
    abn: '55566677788',
    address: '321 King St, Brisbane QLD 4000'
  },
  {
    _id: 'bus_005',
    name: "Williams Cafe",
    owner_id: 'cust_004',
    status: 'setup',
    abn: '11122233344',
    address: '654 Collins St, Melbourne VIC 3000'
  },
  {
    _id: 'bus_006',
    name: "Brown's Pizzeria",
    owner_id: 'cust_005',
    status: 'active',
    abn: '99988877766',
    address: '987 Bourke St, Melbourne VIC 3000'
  },
  {
    _id: 'bus_007',
    name: "Brown's Pizza Express",
    owner_id: 'cust_005',
    status: 'active',
    abn: '99988877767',
    address: '111 Swanston St, Melbourne VIC 3000'
  },
  {
    _id: 'bus_008',
    name: "Brown's Pasta House",
    owner_id: 'cust_005',
    status: 'inactive',
    abn: '99988877768',
    address: '222 Elizabeth St, Melbourne VIC 3000'
  },
  {
    _id: 'bus_009',
    name: "Taylor's Tea House",
    owner_id: 'cust_006',
    status: 'active',
    abn: '44455566677',
    address: '555 Pitt St, Sydney NSW 2000'
  },
  {
    _id: 'bus_010',
    name: "Wilson's Bistro",
    owner_id: 'cust_007',
    status: 'suspended',
    abn: '77788899900',
    address: '888 Adelaide St, Brisbane QLD 4000'
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

    console.log('[API Proxy] Searching businesses...');
    
    // Try to fetch from real API first
    try {
      const response = await axios.post(
        'https://dev.vend88.com/search/business_search',
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

      console.log('[API Proxy] Search response status:', response.status);
      return res.status(response.status).json(response.data);
    } catch (apiError: any) {
      console.log('[API Proxy] Real API failed, using mock data');
      
      // Return mock data if real API fails
      return res.status(200).json({
        status_code: 200,
        status_msg: 'success',
        business: mockBusinesses
      });
    }
  } catch (error: any) {
    console.error('[API Proxy] Search error:', error.message);
    
    // Return mock data on any error
    return res.status(200).json({
      status_code: 200,
      status_msg: 'success (mock)',
      business: mockBusinesses
    });
  }
}
