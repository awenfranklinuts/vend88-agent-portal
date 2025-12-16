# Customer Management API Specification

## Overview
This document describes the Customer Management API endpoints used in the Vend88 Admin Portal. Customer management is integrated with the registration approval workflow, where admins must link customers to registrations before approval.

---

## Deployment URLs
- **Backend API**: `https://dev.vend88.com` (Development Environment)
- **Production API**: `https://prod.vend88.com` (Not yet in use)
- **Admin Portal**: `https://portal.vend88.com`

**Note**: Currently using development environment (dev.vend88.com) for all backend API calls.

---

## Authentication
All customer endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <admin_token>
```

---

## Frontend API Proxy
The admin portal uses Next.js API routes as a proxy to avoid CORS issues:
- Frontend calls: `/api/customer/*`
- Proxied to: `https://dev.vend88.com/customer/*`

---

## 1. List Customers

**Endpoint:** `POST /customer/list`

**Description:** Retrieve all customers with optional pagination. Used in customer management page and customer search dropdown during registration approval.

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "<admin_token>",
  "page": 1,
  "limit": 50
}
```

**Request Body Fields:**
- `token` (string, required): Admin authentication token
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 50)

**Response (200 OK):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customers": [
    {
      "_id": "cust_001",
      "name": "John Smith",
      "email": "john.smith@coffeeshop.com",
      "phone": "+61412345678",
      "messagingAppType": "whatsapp",
      "messagingAppId": "+61412345678",
      "created_at": "2024-01-15T10:30:00Z",
      "status": "active"
    },
    {
      "_id": "cust_002",
      "name": "Jane Doe",
      "email": "jane.doe@restaurant.com",
      "phone": "+61498765432",
      "messagingAppType": "wechat",
      "messagingAppId": "janedoe_wechat",
      "created_at": "2024-02-20T14:15:00Z",
      "status": "active"
    }
  ],
  "total": 45,
  "page": 1,
  "total_pages": 1
}
```

**Response Fields:**
- `status_code` (number): HTTP status code
- `status_msg` (string): Status message
- `customers` (array): Array of customer objects
- `total` (number, optional): Total number of customers
- `page` (number, optional): Current page number
- `total_pages` (number, optional): Total number of pages

**Customer Object Fields:**
- `_id` (string): Unique customer identifier
- `name` (string): Customer full name
- `email` (string): Customer email address
- `phone` (string, optional): Customer phone number
- `messagingAppType` (string, optional): Messaging app type ('whatsapp' or 'wechat')
- `messagingAppId` (string, optional): Messaging app identifier (phone for WhatsApp, username for WeChat)
- `created_at` (string): ISO 8601 timestamp of customer creation
- `status` (string, optional): Customer status ('active', 'inactive')

**Error Response (401 Unauthorized):**
```json
{
  "status_code": 401,
  "status_msg": "Unauthorized"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "status_code": 500,
  "status_msg": "Internal server error",
  "error": "Error message details"
}
```

---

## 2. Create Customer

**Endpoint:** `POST /customer/create`

**Description:** Create a new customer account. This is used during registration approval when admin chooses to create a new customer instead of linking to an existing one.

**Status:** ⚠️ **Currently Handled by Registration API** - Should be moved to dedicated customer endpoint

**Current Implementation:**
The customer creation is currently handled by the Registration API endpoint `PUT /registration/:id/link-customer` with `create_new: true`. This should be refactored to use a dedicated customer creation endpoint.

**Proposed Implementation:**

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@coffeeshop.com",
  "phone": "+61412345678",
  "messagingAppType": "whatsapp",
  "messagingAppId": "+61412345678",
  "source": "registration",
  "source_id": "reg_123456"
}
```

**Request Body Fields:**
- `name` (string, required): Customer full name
- `email` (string, required): Customer email address (must be unique)
- `phone` (string, optional): Customer phone number
- `messagingAppType` (string, optional): 'whatsapp' or 'wechat'
- `messagingAppId` (string, optional): Messaging app identifier
- `source` (string, optional): Source of customer creation ('registration', 'manual', 'import')
- `source_id` (string, optional): ID of the source (e.g., registration ID)

**Expected Response (201 Created):**
```json
{
  "status_code": 201,
  "status_msg": "success",
  "customer": {
    "_id": "cust_789012",
    "name": "John Smith",
    "email": "john.smith@coffeeshop.com",
    "phone": "+61412345678",
    "messagingAppType": "whatsapp",
    "messagingAppId": "+61412345678",
    "status": "active",
    "created_at": "2025-11-20T15:30:00Z",
    "created_by": "admin@vend88.com"
  }
}
```

**Error Response (409 Conflict - Email Already Exists):**
```json
{
  "status_code": 409,
  "status_msg": "Conflict",
  "error": "Customer with this email already exists",
  "existing_customer_id": "cust_001"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status_code": 400,
  "status_msg": "Bad request",
  "error": "Validation failed",
  "details": {
    "email": "Email is required",
    "name": "Name must be at least 2 characters"
  }
}
```

**Frontend Implementation Flow:**

1. **Admin clicks "Create New Customer":**
   ```typescript
   const tempCustomerId = `temp_${Date.now()}`;
   sessionStorage.setItem('pendingCustomer', JSON.stringify({
     tempId: tempCustomerId,
     name: getContactName(registration),
     email: getContactEmail(registration),
     phone: getContactPhone(registration)
   }));
   setSelectedCustomerId(tempCustomerId);
   ```

2. **Admin clicks "Approve":**
   ```typescript
   if (selectedCustomerId.startsWith('temp_')) {
     // Create customer first
     const customerResponse = await axios.post(
       '/api/customer/create',
       {
         name: getContactName(selectedRegistration),
         email: getContactEmail(selectedRegistration),
         phone: getContactPhone(selectedRegistration),
         messagingAppType: selectedRegistration.messagingAppType,
         messagingAppId: selectedRegistration.messagingAppId,
         source: 'registration',
         source_id: registrationId
       },
       { headers: { Authorization: `Bearer ${token}` } }
     );
     
     const newCustomerId = customerResponse.data.customer._id;
     
     // Link customer to registration
     await axios.put(
       `/api/registration/${registrationId}/link-customer`,
       { customer_id: newCustomerId },
       { headers: { Authorization: `Bearer ${token}` } }
     );
   }
   ```

**Current Workaround:**
Until a dedicated customer creation endpoint is implemented, the frontend uses the registration link-customer endpoint with `create_new: true`:

```typescript
await axios.put(
  `/api/registration/${id}/link-customer`,
  {
    create_new: true,
    customer_data: {
      name: getContactName(selectedRegistration),
      email: getContactEmail(selectedRegistration),
      phone: getContactPhone(selectedRegistration)
    }
  }
);
```

---

## 3. Get Customer Details

**Endpoint:** `POST /customer/detail`

**Description:** Retrieve detailed information about a specific customer, including all businesses they own.

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "<admin_token>",
  "customer_id": "cust_001"
}
```

**Request Body Fields:**
- `token` (string, required): Admin authentication token
- `customer_id` (string, required): Unique customer identifier

**Response (200 OK):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customer": {
    "_id": "cust_001",
    "name": "John Smith",
    "email": "john.smith@coffeeshop.com",
    "phone": "+61412345678",
    "messagingAppType": "whatsapp",
    "messagingAppId": "+61412345678",
    "created_at": "2024-01-15T10:30:00Z",
    "status": "active",
    "businesses": [
      {
        "_id": "bus_001",
        "name": "Smith's Coffee Shop",
        "owner_id": "cust_001",
        "status": "active",
        "abn": "12345678901",
        "address": "123 Main St, Sydney NSW 2000",
        "suburb": "Sydney",
        "state": "NSW",
        "postcode": "2000",
        "created_at": "2024-01-20T10:00:00Z"
      },
      {
        "_id": "bus_002",
        "name": "Smith's Second Location",
        "owner_id": "cust_001",
        "status": "active",
        "abn": "12345678902",
        "address": "456 George St, Sydney NSW 2000",
        "suburb": "Sydney",
        "state": "NSW",
        "postcode": "2000",
        "created_at": "2024-02-10T11:00:00Z"
      }
    ]
  }
}
```

**Business Object Fields:**
- `_id` (string): Unique business identifier
- `name` (string): Business name
- `owner_id` (string): Customer ID who owns the business
- `status` (string): Business status ('active', 'setup', 'inactive')
- `abn` (string, optional): Australian Business Number (11 digits)
- `address` (string, optional): Full business address
- `suburb` (string, optional): Suburb/City
- `state` (string, optional): Australian state (NSW, VIC, QLD, WA, SA, TAS, ACT, NT)
- `postcode` (string, optional): Postal code
- `created_at` (string): ISO 8601 timestamp of business creation

**Error Response (404 Not Found):**
```json
{
  "status_code": 404,
  "status_msg": "Customer not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status_code": 400,
  "status_msg": "Bad request",
  "error": "customer_id is required"
}
```

---

## 4. Update Customer (Pending Implementation)

**Endpoint:** `PUT /customer/:id`

**Description:** Update customer information. This endpoint is planned but not yet implemented in the backend.

**Status:** 🔴 **Backend Implementation Pending** (Frontend ready)

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@newdomain.com",
  "phone": "+61412345678",
  "messagingAppType": "whatsapp",
  "messagingAppId": "+61412345678",
  "status": "active"
}
```

**Expected Response (200 OK):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customer": {
    "_id": "cust_001",
    "name": "John Smith",
    "email": "john.smith@newdomain.com",
    "phone": "+61412345678",
    "messagingAppType": "whatsapp",
    "messagingAppId": "+61412345678",
    "updated_at": "2025-11-20T15:00:00Z",
    "updated_by": "admin@vend88.com"
  }
}
```

---

## 5. Delete Customer (Pending Implementation)

**Endpoint:** `DELETE /customer/:id`

**Description:** Delete (soft delete recommended) a customer. This endpoint is planned but not yet implemented in the backend.

**Status:** 🔴 **Backend Implementation Pending**

**Note:** Should implement soft delete (mark as inactive) rather than hard delete to maintain data integrity and audit trail.

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Expected Response (200 OK):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "message": "Customer marked as inactive",
  "customer_id": "cust_001"
}
```

---

## 6. Advanced Customer Search (Pending Implementation)

**Endpoint:** `POST /customer/search`

**Description:** Advanced search with multiple filters. This endpoint is planned but not yet implemented in the backend.

**Status:** 🔴 **Backend Implementation Pending** (Frontend implements client-side search)

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "<admin_token>",
  "query": "John",
  "filters": {
    "status": "active",
    "created_after": "2024-01-01T00:00:00Z",
    "created_before": "2024-12-31T23:59:59Z",
    "has_messaging_app": true
  },
  "sort": "created_desc",
  "page": 1,
  "limit": 20
}
```

**Expected Response (200 OK):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customers": [],
  "total": 5,
  "page": 1,
  "total_pages": 1
}
```

---

## 7. Get Customer Businesses (Pending Implementation)

**Endpoint:** `GET /customer/:id/businesses`

**Description:** Get all businesses owned by a specific customer. Currently this data is included in the customer detail endpoint, but a dedicated endpoint would improve performance.

**Status:** 🔴 **Backend Implementation Pending**

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Expected Response (200 OK):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customer_id": "cust_001",
  "businesses": [
    {
      "_id": "bus_001",
      "name": "Smith's Coffee Shop",
      "owner_id": "cust_001",
      "status": "active",
      "abn": "12345678901",
      "address": "123 Main St, Sydney NSW 2000"
    }
  ],
  "total": 2
}
```

---

## Integration with Registration Management

### Customer Linking Workflow

When approving a registration, an admin must first link a customer:

#### Option 1: Link Existing Customer
1. Admin opens registration details modal
2. Clicks "Link to Customer" dropdown
3. Searches for customer using `/api/customer/list`
4. Selects customer from dropdown
5. Clicks "Link Customer" button
6. Frontend calls `PUT /registration/:id/link-customer` with `customer_id`

#### Option 2: Create New Customer
1. Admin opens registration details modal
2. Clicks "Create New Customer" button
3. System generates temporary ID: `temp_1234567890`
4. Customer data stored in session storage
5. Admin clicks "Approve"
6. Backend creates new customer account
7. Backend links new customer to registration
8. Returns real `customer_id`

### Frontend Implementation Details

**Customer Search Component:**
- Uses `/api/customer/list` to fetch all customers
- Client-side filtering by name or email
- Real-time search as user types
- Displays customer name, email, and business count
- Shows messaging app icon if available

**Customer Linking:**
```typescript
// Link existing customer
const handleLinkCustomer = async () => {
  const response = await axios.put(
    `/api/registration/${registrationId}/link-customer`,
    { customer_id: selectedCustomerId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Create new customer on approval
const handleApprove = async () => {
  if (selectedCustomerId.startsWith('temp_')) {
    // Backend will create customer from registration data
    const response = await axios.post(
      `/api/registration/approve/${registrationId}`,
      { create_customer: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
};
```

---

## Frontend Features

### Customer Management Page

**Implemented Features:**
- ✅ View toggle (grid/table layout)
- ✅ Statistics cards (total customers, total businesses, recent additions)
- ✅ Advanced client-side search (name, email, phone, ABN)
- ✅ Sorting (by name, date, business count)
- ✅ Pagination (12 items per page)
- ✅ Export to CSV (all or filtered data)
- ✅ Customer details modal with business list
- ✅ Email customer action (mailto: link)
- ✅ Messaging app integration (WhatsApp/WeChat display)
- ✅ Theme support (dark/light mode)
- ✅ Skeleton loading states
- ✅ Responsive design

**Pending Backend APIs:**
- 🔴 Update customer information
- 🔴 Delete customer
- 🔴 Advanced server-side search

---

## Data Models

### Customer Object (Complete)
```typescript
interface Customer {
  _id: string;                           // Unique identifier
  name: string;                          // Full name
  email: string;                         // Email address
  phone?: string;                        // Phone number
  messagingAppType?: 'whatsapp' | 'wechat';  // Messaging app type
  messagingAppId?: string;               // Messaging app identifier
  created_at: string;                    // ISO 8601 timestamp
  status?: 'active' | 'inactive';        // Customer status
  updated_at?: string;                   // Last update timestamp
  updated_by?: string;                   // Admin who updated
}
```

### Business Object (As returned in customer details)
```typescript
interface Business {
  _id: string;                           // Unique identifier
  name: string;                          // Business name
  owner_id: string;                      // Customer ID
  status: 'active' | 'setup' | 'inactive';  // Business status
  abn?: string;                          // Australian Business Number (11 digits)
  address?: string;                      // Full address
  suburb?: string;                       // Suburb/City
  state?: string;                        // NSW, VIC, QLD, WA, SA, TAS, ACT, NT
  postcode?: string;                     // Postal code
  created_at: string;                    // ISO 8601 timestamp
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "status_code": 401,
  "status_msg": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "status_code": 403,
  "status_msg": "Forbidden",
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "status_code": 404,
  "status_msg": "Customer not found"
}
```

**400 Bad Request:**
```json
{
  "status_code": 400,
  "status_msg": "Bad request",
  "error": "Validation error message",
  "details": {
    "email": "Invalid email format",
    "phone": "Phone number must start with +61"
  }
}
```

**500 Internal Server Error:**
```json
{
  "status_code": 500,
  "status_msg": "Internal server error",
  "error": "Error details"
}
```

---

## Validation Rules

### Customer Data Validation

**Name:**
- Required
- Minimum 2 characters
- Maximum 255 characters
- Unicode support for international names

**Email:**
- Required
- RFC 5322 compliant
- Maximum 255 characters
- Must be unique in system

**Phone:**
- Optional
- Australian format: +61XXXXXXXXX
- International format supported: +XX XXXXXXXXXXX
- Stored with country code

**Messaging App:**
- `messagingAppType`: 'whatsapp' or 'wechat'
- `messagingAppId`: Required if messagingAppType is set
  - WhatsApp: Must be valid phone number
  - WeChat: Username/ID (max 50 characters)

---

## Rate Limiting

**Suggested Limits:**
- List customers: 60 requests/minute per admin
- Get customer details: 120 requests/minute per admin
- Update customer: 30 requests/minute per admin
- Delete customer: 10 requests/minute per admin

---

## Performance Considerations

### Pagination
- Default page size: 50 customers
- Maximum page size: 100 customers
- Total count should be cached for 5 minutes

### Caching Strategy
- Customer list: Cache for 2 minutes
- Customer details: Cache for 5 minutes
- Invalidate cache on update/delete operations

### Database Indexes
Recommended indexes for optimal performance:
- `_id` (primary key)
- `email` (unique)
- `created_at` (for sorting)
- `status` (for filtering)
- `name` (text index for search)

---

## API Response Format

All customer API responses follow this format:

**Success Response:**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customer": { /* customer data */ },
  "customers": [ /* array of customers */ ]
}
```

**Error Response:**
```json
{
  "status_code": 400,
  "status_msg": "error message",
  "error": "detailed error description"
}
```

---

## Mock Data

The frontend includes comprehensive mock data for development when backend is unavailable:

**Mock Customers:** 8 sample customers with various configurations
- 5 with messaging apps (3 WhatsApp, 2 WeChat)
- 3 without messaging apps
- All with realistic Australian phone numbers
- Created dates spread across 2024

**Mock Businesses:** Multiple businesses per customer
- Various statuses (active, setup, inactive)
- Australian ABNs
- Addresses across different Australian cities

**Mock Data Location:**
- `pages/api/customer/list.ts` - Mock customer list
- `pages/api/customer/detail.ts` - Mock customer details with businesses

---

## Testing

### Manual Testing Checklist

**List Customers:**
- ✅ Verify all customers returned
- ✅ Check pagination works correctly
- ✅ Verify customer fields are complete
- ✅ Test with invalid token (should return 401)

**Get Customer Details:**
- ✅ Verify customer details returned
- ✅ Check businesses array is populated
- ✅ Test with non-existent customer_id (should return 404)
- ✅ Test with missing customer_id (should return 400)

**Customer Search:**
- ✅ Search by name (partial match)
- ✅ Search by email
- ✅ Search by phone number
- ✅ Filter by status
- ✅ Sort by different fields

### Integration Testing

**With Registration Management:**
- ✅ Link existing customer to registration
- ✅ Create new customer from registration
- ✅ Verify customer required before approval
- ✅ Check temporary customer ID workflow

---

## Future Enhancements

### Phase 1 (Priority)
1. 🔴 Implement PUT /customer/:id for updating customer information
2. 🔴 Implement DELETE /customer/:id with soft delete
3. 🔴 Add server-side search with filters

### Phase 2 (Nice to Have)
1. ⚠️ Customer activity log/audit trail
2. ⚠️ Customer notes/comments
3. ⚠️ Bulk operations (import/export)
4. ⚠️ Customer tags/categories
5. ⚠️ Customer lifecycle status tracking

### Phase 3 (Long Term)
1. 📅 Customer analytics dashboard
2. 📅 Customer segmentation
3. 📅 Automated customer communications
4. 📅 Customer portal access
5. 📅 Customer document management

---

## Changelog

### 2025-12-16
- ✅ Initial API specification created
- ✅ Documented existing endpoints (List, Detail)
- ✅ Added pending endpoint specifications
- ✅ Integrated with Registration API documentation
- ✅ Added messaging app fields (WhatsApp/WeChat)
- ✅ Updated to use dev.vend88.com environment

---

## Support & Contact

For API questions or issues:
- **Documentation:** This file
- **Related Docs:** `REGISTRATION_API_SPEC.md`
- **Frontend Code:** `app/admin/customers/page.tsx`
- **API Proxy:** `pages/api/customer/`

---

**Last Updated:** December 16, 2025  
**API Version:** 1.0  
**Status:** Active Development
