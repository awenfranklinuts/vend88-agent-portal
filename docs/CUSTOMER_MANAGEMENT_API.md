# Customer Management API Documentation

## Overview
This document describes the API endpoints for customer management, including listing customers with their associated businesses.

## Base URL
```
https://dev.vend88.com
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {token}
```

---

## 1. List All Customers

### Endpoint
```
POST /customer/list
```

### Description
Retrieves a list of all customers in the system. This endpoint returns basic customer information without associated business details.

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{}
```

### Response

#### Success (200 OK)
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customers": [
    {
      "_id": "cust_123456789",
      "name": "John Smith",
      "email": "john@coffeeshop.com",
      "phone": "+61412345678",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "cust_987654321",
      "name": "Jane Doe",
      "email": "jane@restaurant.com",
      "phone": "+61498765432",
      "created_at": "2024-02-20T14:15:00Z"
    }
  ]
}
```

#### Error Responses

**401 Unauthorized** - Invalid or missing token
```json
{
  "status_code": 401,
  "status_msg": "Unauthorized"
}
```

**500 Internal Server Error**
```json
{
  "status_code": 500,
  "status_msg": "Internal server error"
}
```

---

## 2. Get Customer Details

### Endpoint
```
POST /customer/detail
```

### Description
Retrieves detailed information about a specific customer, including all associated businesses.

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{
  "customer_id": "cust_123456789"
}
```

### Response

#### Success (200 OK)
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customer": {
    "_id": "cust_123456789",
    "name": "John Smith",
    "email": "john@coffeeshop.com",
    "phone": "+61412345678",
    "created_at": "2024-01-15T10:30:00Z",
    "businesses": [
      {
        "_id": "bus_111111111",
        "name": "Smith's Coffee Shop",
        "owner_id": "cust_123456789",
        "status": "active",
        "abn": "12345678901",
        "address": "123 Main St, Sydney NSW 2000"
      },
      {
        "_id": "bus_222222222",
        "name": "Smith's Bakery",
        "owner_id": "cust_123456789",
        "status": "active",
        "abn": "98765432109",
        "address": "456 Queen St, Melbourne VIC 3000"
      }
    ]
  }
}
```

#### Error Responses

**400 Bad Request** - Missing customer_id
```json
{
  "status_code": 400,
  "status_msg": "customer_id is required"
}
```

**404 Not Found** - Customer not found
```json
{
  "status_code": 404,
  "status_msg": "Customer not found"
}
```

---

## 3. Search Businesses (Used to map businesses to customers)

### Endpoint
```
POST /search/business
```

### Description
Search and retrieve business information. Used in the customer management page to map businesses to their respective owners.

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{
  "detail": true
}
```

### Response

#### Success (200 OK)
```json
{
  "status_code": 200,
  "status_msg": "success",
  "business": [
    {
      "_id": "bus_111111111",
      "owner_id": "cust_123456789",
      "name": "Smith's Coffee Shop",
      "status": "active",
      "abn": "12345678901",
      "address": "123 Main St, Sydney NSW 2000"
    },
    {
      "_id": "bus_222222222",
      "owner_id": "cust_123456789",
      "name": "Smith's Bakery",
      "status": "active",
      "abn": "98765432109",
      "address": "456 Queen St, Melbourne VIC 3000"
    },
    {
      "_id": "bus_333333333",
      "owner_id": "cust_987654321",
      "name": "Doe's Restaurant",
      "status": "inactive",
      "abn": "11122233344",
      "address": "789 King St, Brisbane QLD 4000"
    }
  ]
}
```

---

## Integration with Registration Management

When linking a customer to a registration form, the customer data is used to populate the registration details and create the business relationship.

### Flow:
1. Admin selects or creates a customer during registration approval
2. Customer is linked via `/registration/{registration_id}/link-customer`
3. Upon approval, a new business is created with `owner_id` set to the customer's `_id`
4. The customer management page then displays this business under the customer's profile

### Example Business Creation on Registration Approval:
```json
{
  "business": {
    "_id": "bus_new123456",
    "owner_id": "cust_123456789",
    "name": "New Coffee Shop",
    "status": "setup",
    "abn": "55566677788",
    "address": "999 Park Ave, Perth WA 6000",
    "created_from_registration": "reg_789456123",
    "created_at": "2024-12-15T09:00:00Z"
  }
}
```

---

## Data Models

### Customer
```typescript
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  businesses?: Business[];
}
```

### Business
```typescript
interface Business {
  _id: string;
  name: string;
  owner_id: string;  // References Customer._id
  status?: 'active' | 'inactive' | 'suspended' | 'setup';
  abn?: string;
  address?: string;
  created_from_registration?: string;  // If created from registration
  created_at?: string;
}
```

---

## Notes

1. **Business Ownership**: Each business has an `owner_id` field that references the customer's `_id`. This establishes the one-to-many relationship between customers and businesses.

2. **Status Values**:
   - `active`: Business is fully operational
   - `setup`: Business is in setup phase (newly approved registration)
   - `inactive`: Business is temporarily inactive
   - `suspended`: Business has been suspended

3. **Search Functionality**: The customer management page supports searching across:
   - Customer name
   - Customer email
   - Customer phone
   - Associated business names

4. **Performance**: When displaying many customers with multiple businesses each, the frontend makes two API calls:
   - One to fetch all customers
   - One to fetch all businesses
   - Then maps businesses to customers client-side

5. **Future Enhancements**: Consider implementing:
   - Pagination for large customer lists
   - Server-side filtering and sorting
   - Direct customer detail endpoint that includes businesses
   - Customer creation/editing endpoints
