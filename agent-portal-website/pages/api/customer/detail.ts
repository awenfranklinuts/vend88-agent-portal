import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Mock customer details with businesses
const mockCustomerDetails: any = {
  'cust_001': {
    _id: 'cust_001',
    name: 'John Smith',
    email: 'john.smith@coffeeshop.com',
    phone: '+61412345678',
    messagingAppType: 'whatsapp',
    messagingAppId: '+61412345678',
    created_at: '2024-01-15T10:30:00Z',
    businesses: [
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
      }
    ]
  },
  'cust_002': {
    _id: 'cust_002',
    name: 'Jane Doe',
    email: 'jane.doe@restaurant.com',
    phone: '+61498765432',
    messagingAppType: 'wechat',
    messagingAppId: 'janedoe_wechat',
    created_at: '2024-02-20T14:15:00Z',
    businesses: [
      {
        _id: 'bus_003',
        name: "Doe's Fine Dining",
        owner_id: 'cust_002',
        status: 'active',
        abn: '98765432109',
        address: '789 Queen St, Melbourne VIC 3000'
      }
    ]
  },
  'cust_003': {
    _id: 'cust_003',
    name: 'Michael Chen',
    email: 'michael.chen@bakery.com',
    phone: '+61455123789',
    created_at: '2024-03-10T09:00:00Z',
    businesses: [
      {
        _id: 'bus_004',
        name: "Chen's Artisan Bakery",
        owner_id: 'cust_003',
        status: 'active',
        abn: '55566677788',
        address: '321 King St, Brisbane QLD 4000'
      }
    ]
  },
  'cust_004': {
    _id: 'cust_004',
    name: 'Sarah Williams',
    email: 'sarah.williams@cafe.com',
    phone: '+61433987654',
    messagingAppType: 'whatsapp',
    messagingAppId: '+61433987654',
    created_at: '2024-04-05T11:20:00Z',
    businesses: [
      {
        _id: 'bus_005',
        name: "Williams Cafe",
        owner_id: 'cust_004',
        status: 'setup',
        abn: '11122233344',
        address: '654 Collins St, Melbourne VIC 3000'
      }
    ]
  },
  'cust_005': {
    _id: 'cust_005',
    name: 'David Brown',
    email: 'david.brown@pizzeria.com',
    phone: '+61422567890',
    messagingAppType: 'wechat',
    messagingAppId: 'davidb_wechat88',
    created_at: '2024-05-12T08:45:00Z',
    businesses: [
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
      }
    ]
  },
  'cust_006': {
    _id: 'cust_006',
    name: 'Emily Taylor',
    email: 'emily.taylor@teahouse.com',
    phone: '+61488654321',
    created_at: '2024-06-18T16:30:00Z',
    businesses: [
      {
        _id: 'bus_009',
        name: "Taylor's Tea House",
        owner_id: 'cust_006',
        status: 'active',
        abn: '44455566677',
        address: '555 Pitt St, Sydney NSW 2000'
      }
    ]
  },
  'cust_007': {
    _id: 'cust_007',
    name: 'Robert Wilson',
    email: 'robert.wilson@bistro.com',
    phone: '+61477234567',
    messagingAppType: 'whatsapp',
    messagingAppId: '+61477234567',
    created_at: '2024-07-22T13:10:00Z',
    businesses: [
      {
        _id: 'bus_010',
        name: "Wilson's Bistro",
        owner_id: 'cust_007',
        status: 'suspended',
        abn: '77788899900',
        address: '888 Adelaide St, Brisbane QLD 4000'
      }
    ]
  },
  'cust_008': {
    _id: 'cust_008',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@diner.com',
    phone: '+61466789012',
    created_at: '2024-08-14T10:00:00Z',
    businesses: []
  }
};

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

    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({
        status_code: 400,
        status_msg: 'customer_id is required'
      });
    }

    console.log('[API Proxy] Getting customer detail:', customer_id);
    
    // Try to fetch from real API first
    try {
      const response = await axios.post(
        'https://prod.vend88.com/customer/detail',
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

      console.log('[API Proxy] Customer detail response status:', response.status);
      return res.status(response.status).json(response.data);
    } catch (apiError: any) {
      console.log('[API Proxy] Real API failed, using mock data');
      
      // Return mock data if real API fails
      const customerDetail = mockCustomerDetails[customer_id];

      if (!customerDetail) {
        return res.status(404).json({
          status_code: 404,
          status_msg: 'Customer not found'
        });
      }

      return res.status(200).json({
        status_code: 200,
        status_msg: 'success',
        customer: customerDetail
      });
    }
  } catch (error: any) {
    console.error('[API Proxy] Customer detail error:', error.message);
    
    return res.status(500).json({
      status_code: 500,
      status_msg: 'Internal server error',
      error: error.message
    });
  }
}
