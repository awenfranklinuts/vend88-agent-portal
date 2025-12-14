# Registration Management API Specification

## Overview
This document outlines all required API endpoints for the Registration Management system to be fully functional.

**Status Legend:**
- ✅ **Implemented** - Already exists in backend
- 🔴 **Required** - Needs to be implemented for core functionality
- 🟡 **Optional** - Nice to have, can be implemented later

---

## Current Implementation Status

### ✅ Already Implemented (4 endpoints)

#### 1. Generate Registration Token
```
POST /registration/generate
```
**Purpose:** Generate a unique registration link for a new business
**Status:** ✅ Implemented

**Request Body:**
```json
{
  "generatedBy": "admin@vend88.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reg_abc123",  // ⚠️ CRITICAL: Must generate and return unique registration ID
    "token": "unique-token-string",
    "registrationUrl": "https://portal.vend88.com/register/unique-token-string",
    "expiresAt": "2025-12-21T10:00:00Z",
    "generatedAt": "2025-12-14T10:00:00Z",
    "generatedBy": "admin@vend88.com",
    "status": "pending"
  }
}
```

**⚠️ BACKEND IMPLEMENTATION CRITICAL:**
The `id` field is **REQUIRED** and must be:
1. A unique identifier generated when creating the registration record
2. Stored in the database (this is the primary key)
3. Returned in the response immediately
4. Used for all subsequent operations (revoke, approve, reject, etc.)

**Current Issue:** Backend is returning `null` or missing the `id` field, making it impossible to manage the registration later.

---

#### 2. Validate Registration Token
```
GET /registration/validate-token/{token}
```
**Purpose:** Validate if registration token is still valid
**Status:** ✅ Implemented

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "registrationId": "reg_abc123",
    "expiresAt": "2025-12-21T10:00:00Z"
  }
}
```

---

#### 3. Submit Registration Form
```
POST /registration/submit
```
**Purpose:** Public endpoint for businesses to submit registration form
**Status:** ✅ Implemented

**Request Body:**
```json
{
  "token": "unique-token-string",
  "businessName": "Coffee Shop Downtown",
  "contactEmail": "owner@coffeeshop.com",
  "contactPhone": "+61412345678",
  "ownerName": "John Smith",
  "abn": "12345678901",
  "registeredAddress": "123 Main St",
  "registeredSuburb": "Sydney",
  "registeredPostcode": "2000",
  "registeredState": "NSW",
  "registeredCountry": "Australia",
  // ... other fields
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg_abc123",
    "status": "submitted",
    "submittedAt": "2025-12-14T14:30:00Z"
  }
}
```

---

#### 4. Get Registration Details
```
GET /registration/{registration_id}
```
**Purpose:** Retrieve full details of a specific registration
**Status:** ✅ Implemented

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reg_abc123",
    "status": "submitted",
    "businessName": "Coffee Shop Downtown",
    "contactEmail": "owner@coffeeshop.com",
    // ... all registration fields
    "generatedAt": "2025-12-14T10:00:00Z",
    "submittedAt": "2025-12-14T14:30:00Z"
  }
}
```

---

## ⚠️ CRITICAL BACKEND BUG - MUST FIX IMMEDIATELY

### Issue: POST /registration/generate returns null `id`

**Current Behavior:**
```json
{
  "data": {
    "id": null,  // ← BUG: This is null or missing!
    "token": "u6_BbqMuigtmLxFC5v76F_pQmSjW1Z2U",
    "link": "https://form.vend88.com/register?token=...",
    "status": "pending"
  }
}
```

**Required Behavior:**
```json
{
  "data": {
    "id": "reg_abc123",  // ← MUST be a unique registration ID!
    "token": "u6_BbqMuigtmLxFC5v76F_pQmSjW1Z2U",
    "link": "https://form.vend88.com/register?token=...",
    "status": "pending"
  }
}
```

**Backend Fix Required:**
```python
# When generating registration, backend must:
1. Generate unique registration ID (e.g., "reg_" + uuid)
2. Create database record with this ID
3. Return the ID in response

# Example pseudo-code:
registration_id = "reg_" + generate_uuid()
registration = Registration.create({
    id: registration_id,  # ← Store this!
    token: generated_token,
    status: "pending",
    generated_at: current_timestamp(),
    generated_by: admin_email
})
return {
    "id": registration_id,  # ← Return this!
    "token": generated_token,
    ...
}
```

**Impact if not fixed:**
- ❌ "Not Filled" table cannot display registrations
- ❌ Cannot revoke/cancel links
- ❌ Cannot track registrations in frontend
- ❌ System completely broken

---

## 🔴 Critical APIs Needed

### 5. List All Registrations (CRITICAL)
```
GET /registrations
```
**Purpose:** Fetch all registrations with filtering, sorting, and pagination
**Priority:** 🔴 **REQUIRED** - Core functionality for the management table

**Authentication:** Requires Bearer token in header (`Authorization: Bearer {admin_jwt_token}`)

**Note:** This endpoint lists ALL registrations. It does NOT take registration ID or token in the URL path. For a single registration, use `GET /registration/{registration_id}` (already implemented).

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `submitted`, `approved`, `rejected`, `all`)
- `state` (string, optional): Filter by state (`NSW`, `VIC`, `QLD`, etc.)
- `search` (string, optional): Search across business name, email, phone, ABN
- `sortBy` (string, optional): Field to sort by (`submittedAt`, `businessName`, `contactEmail`, `status`)
- `sortOrder` (string, optional): Sort direction (`asc`, `desc`)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```
GET /registrations?status=submitted&state=NSW&sortBy=submittedAt&sortOrder=desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "reg_abc123",
        "status": "submitted",
        "businessName": "Coffee Shop Downtown",
        "contactEmail": "owner@coffeeshop.com",
        "contactPhone": "+61412345678",
        "ownerName": "John Smith",
        "abn": "12345678901",
        "registeredState": "NSW",
        "generatedAt": "2025-12-14T10:00:00Z",
        "generatedBy": "admin@vend88.com",
        "submittedAt": "2025-12-14T14:30:00Z",
        "linkedCustomerId": null
      },
      // ... more registrations
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

**Implementation Notes:**
- Should support multiple filters simultaneously
- Search should be case-insensitive and search across multiple fields
- Default sort should be by `submittedAt` descending (newest first)
- Must return consistent results for pagination

---

### 6. Approve Registration
```
POST /registration/{registration_id}/approve
```
**Purpose:** Approve a submitted registration and link to customer
**Priority:** 🔴 **REQUIRED** - Core approval workflow

**Request Body:**

**Scenario 1: Create New Customer (Most Common)**
```json
{
  "approvedBy": "admin@vend88.com",
  "createNewCustomer": true,
  "customerData": {
    "businessName": "Coffee Shop Downtown",
    "contactEmail": "owner@coffeeshop.com",
    "contactPhone": "+61412345678",
    "abn": "12345678901",
    "address": {
      "street": "123 Main St",
      "suburb": "Sydney",
      "postcode": "2000",
      "state": "NSW",
      "country": "Australia"
    }
  }
}
```
**Backend Action:** Create new customer record, generate customer ID, link to registration

---

**Scenario 2: Link to Existing Customer (If customer already exists)**
```json
{
  "approvedBy": "admin@vend88.com",
  "linkedCustomerId": "cust_xyz789"
}
```
**Backend Action:** Link registration to existing customer ID

---

**Scenario 3: Auto-Create from Registration Data (Simplest)**
```json
{
  "approvedBy": "admin@vend88.com",
  "createNewCustomer": true
  // customerData is optional - backend uses registration data if not provided
}
```
**Backend Action:** Create customer using all data from the registration itself

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg_abc123",
    "status": "approved",
    "approvedAt": "2025-12-14T15:00:00Z",
    "approvedBy": "admin@vend88.com",
    "linkedCustomerId": "cust_xyz789",
    "customerCreated": true  // true if new customer was created
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Registration must be in 'submitted' status to be approved",
    "currentStatus": "pending"
  }
}
```

**Business Logic:**
- Registration must be in `submitted` status
- Either `linkedCustomerId` or `createNewCustomer` must be provided
- Update registration status to `approved`
- Set `approvedAt` timestamp and `approvedBy` admin email

**If `createNewCustomer: true`:**
1. Generate unique customer ID (e.g., "cust_" + uuid())
2. Create customer record with data from `customerData` OR from registration fields
3. Store customer in `customers` table
4. Set `registration.linked_customer_id = new_customer_id`
5. Set `customer.created_from_registration_id = registration_id`
6. Return new customer ID in response

**If `linkedCustomerId` provided:**
1. Verify customer exists
2. Set `registration.linked_customer_id = provided_customer_id`
3. Return provided customer ID in response

**Customer Data Mapping (if using registration data):**
```
registration.businessName → customer.business_name
registration.contactEmail → customer.contact_email
registration.contactPhone → customer.contact_phone
registration.abn → customer.abn
registration.registeredAddress → customer.address_street
registration.registeredSuburb → customer.address_suburb
registration.registeredPostcode → customer.address_postcode
registration.registeredState → customer.address_state
registration.registeredCountry → customer.address_country
```

---

### 7. Reject Registration
```
POST /registration/{registration_id}/reject
```
**Purpose:** Reject a submitted registration with reason
**Priority:** 🔴 **REQUIRED** - Core approval workflow

**Request Body:**
```json
{
  "rejectedBy": "admin@vend88.com",
  "rejectionReason": "Incomplete business information provided. Please provide valid ABN and business address."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg_abc123",
    "status": "rejected",
    "rejectedAt": "2025-12-14T15:00:00Z",
    "rejectedBy": "admin@vend88.com",
    "rejectionReason": "Incomplete business information provided..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Registration must be in 'submitted' status to be rejected"
  }
}
```

**Business Logic:**
- Registration must be in `submitted` status
- `rejectionReason` is required and must be at least 10 characters
- Update registration status to `rejected`
- Set `rejectedAt` timestamp and `rejectedBy` admin email
- Optionally send email notification to business contact email

---

### 8. Revoke/Cancel Registration Link
```
POST /registration/{registration_id}/revoke
```
**Purpose:** Revoke an unused registration link (only for 'pending' status)
**Priority:** 🔴 **REQUIRED** - Admin control over generated links

**Request Body:**
```json
{
  "revokedBy": "admin@vend88.com",
  "reason": "Link sent to wrong email address"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg_abc123",
    "status": "cancelled",
    "cancelledAt": "2025-12-14T15:00:00Z",
    "cancelledBy": "admin@vend88.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_REVOKE",
    "message": "Only registrations with 'pending' status can be revoked",
    "currentStatus": "submitted"
  }
}
```

**Business Logic:**
- Can only revoke registrations with `pending` status
- Once submitted, use reject endpoint instead
- Update status to `cancelled`
- Token becomes invalid immediately

---

### 9. Update Registration
```
PUT /registration/{registration_id}
```
**Purpose:** Update registration details (before approval)
**Priority:** 🔴 **REQUIRED** - Allow admins to fix data errors

**Request Body:**
```json
{
  "updatedBy": "admin@vend88.com",
  "updates": {
    "businessName": "Coffee Shop Downtown - Updated",
    "contactEmail": "newemail@coffeeshop.com",
    "abn": "98765432101",
    // ... any other fields to update
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg_abc123",
    "updatedAt": "2025-12-14T15:30:00Z",
    "updatedBy": "admin@vend88.com",
    "updatedFields": ["businessName", "contactEmail", "abn"]
  }
}
```

**Business Logic:**
- Can update registrations with `submitted` or `pending` status
- Cannot update approved/rejected registrations
- Track which fields were updated
- Validate updated data (email format, phone format, ABN format, etc.)

---

## 🟡 Optional/Nice-to-Have APIs

### 10. Link Customer to Registration
```
POST /registration/{registration_id}/link-customer
```
**Purpose:** Link an existing customer to a registration (separate from approval)
**Priority:** 🟡 Optional - Can be handled in approve endpoint

**Request Body:**
```json
{
  "customerId": "cust_xyz789",
  "linkedBy": "admin@vend88.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg_abc123",
    "linkedCustomerId": "cust_xyz789",
    "linkedAt": "2025-12-14T15:00:00Z"
  }
}
```

---

### 11. Get Registration Statistics
```
GET /registrations/statistics
```
**Purpose:** Get overview statistics for dashboard
**Priority:** 🟡 Optional - Can calculate client-side initially

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": {
      "pending": 25,
      "submitted": 45,
      "approved": 70,
      "rejected": 8,
      "cancelled": 2
    },
    "byState": {
      "NSW": 60,
      "VIC": 45,
      "QLD": 30,
      "WA": 10,
      "SA": 5
    },
    "recentActivity": {
      "last24Hours": 5,
      "last7Days": 23,
      "last30Days": 78
    }
  }
}
```

---

### 12. Resend Registration Link
```
POST /registration/{registration_id}/resend
```
**Purpose:** Resend registration link email to business
**Priority:** 🟡 Optional - Manual copy-paste works for now

**Request Body:**
```json
{
  "email": "owner@coffeeshop.com",
  "resentBy": "admin@vend88.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "emailSent": true,
    "sentTo": "owner@coffeeshop.com",
    "sentAt": "2025-12-14T15:00:00Z"
  }
}
```

---

### 13. Bulk Approve Registrations
```
POST /registrations/bulk-approve
```
**Purpose:** Approve multiple registrations at once
**Priority:** 🟡 Optional - Current implementation handles one at a time

**Request Body:**
```json
{
  "registrationIds": ["reg_abc123", "reg_def456", "reg_ghi789"],
  "approvedBy": "admin@vend88.com",
  "createNewCustomers": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "successful": ["reg_abc123", "reg_def456"],
    "failed": [
      {
        "registrationId": "reg_ghi789",
        "error": "Registration already approved"
      }
    ],
    "successCount": 2,
    "failCount": 1
  }
}
```

---

## Implementation Priority

### Phase 1: Critical for Basic Functionality (Implement First)
1. ✅ POST /registration/generate (Done)
2. ✅ GET /registration/validate-token/{token} (Done)
3. ✅ POST /registration/submit (Done)
4. ✅ GET /registration/{registration_id} (Done)
5. 🔴 **GET /registrations** (List with filters)
6. 🔴 **POST /registration/{id}/approve**
7. 🔴 **POST /registration/{id}/reject**
8. 🔴 **POST /registration/{id}/revoke**

### Phase 2: Important for Admin Experience
9. 🔴 **PUT /registration/{id}** (Update registration)

### Phase 3: Nice to Have
10. 🟡 POST /registration/{id}/link-customer
11. 🟡 GET /registrations/statistics
12. 🟡 POST /registration/{id}/resend
13. 🟡 POST /registrations/bulk-approve

---

## Database Schema Recommendations

### Registration Table
```sql
CREATE TABLE registrations (
  id VARCHAR(50) PRIMARY KEY,
  token VARCHAR(255) UNIQUE,
  status ENUM('pending', 'submitted', 'approved', 'rejected', 'cancelled', 'expired'),
  
  -- Business Information
  business_name VARCHAR(255),
  abn VARCHAR(20),
  
  -- Contact Information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  owner_name VARCHAR(255),
  
  -- Address
  registered_address VARCHAR(500),
  registered_suburb VARCHAR(100),
  registered_postcode VARCHAR(10),
  registered_state VARCHAR(50),
  registered_country VARCHAR(100),
  
  -- Trading Address
  trading_address VARCHAR(500),
  trading_suburb VARCHAR(100),
  trading_postcode VARCHAR(10),
  trading_state VARCHAR(50),
  trading_country VARCHAR(100),
  same_as_registered BOOLEAN,
  
  -- Business Details
  business_type VARCHAR(100),
  business_type_other TEXT,
  current_setup VARCHAR(100),
  current_setup_other TEXT,
  
  -- Payment & Integration
  eftpos_integration VARCHAR(100),
  alipay_option VARCHAR(100),
  alipay_other TEXT,
  
  -- Additional
  ready_by DATE,
  heard_about VARCHAR(100),
  heard_other TEXT,
  menu_files JSON,
  menu_send_later BOOLEAN,
  notes TEXT,
  
  -- Tracking
  generated_at TIMESTAMP,
  generated_by VARCHAR(255),
  submitted_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  -- Approval/Rejection
  approved_at TIMESTAMP,
  approved_by VARCHAR(255),
  rejected_at TIMESTAMP,
  rejected_by VARCHAR(255),
  rejection_reason TEXT,
  
  -- Cancellation
  cancelled_at TIMESTAMP,
  cancelled_by VARCHAR(255),
  
  -- Customer Linking
  linked_customer_id VARCHAR(50),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  
  -- Indexes
  INDEX idx_status (status),
  INDEX idx_state (registered_state),
  INDEX idx_generated_at (generated_at),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_token (token),
  INDEX idx_customer (linked_customer_id)
);
```

---

## Error Response Format

All endpoints should follow this error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field validation error"
    }
  }
}
```

**Common Error Codes:**
- `INVALID_TOKEN` - Registration token is invalid or expired
- `INVALID_STATUS` - Operation not allowed for current registration status
- `NOT_FOUND` - Registration not found
- `VALIDATION_ERROR` - Request body validation failed
- `ALREADY_EXISTS` - Duplicate registration (by email or ABN)
- `MISSING_REQUIRED_FIELD` - Required field is missing
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `CUSTOMER_LINK_ERROR` - Error linking to customer

---

## Authentication & Authorization

All admin endpoints (except public submit endpoint) should require:

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Required Permissions:**
- `registrations:read` - View registrations
- `registrations:write` - Create registrations
- `registrations:approve` - Approve/reject registrations
- `registrations:delete` - Revoke registrations

---

## Testing Checklist

### For Each Endpoint:
- [ ] Success case with valid data
- [ ] Invalid authentication token
- [ ] Missing required fields
- [ ] Invalid data formats (email, phone, ABN)
- [ ] Invalid status transitions
- [ ] Non-existent registration ID
- [ ] Duplicate operations (e.g., approve twice)
- [ ] SQL injection attempts
- [ ] XSS attempts in text fields
- [ ] File upload validation (for menu files)
- [ ] Rate limiting

### Integration Tests:
- [ ] Complete flow: Generate → Submit → Approve
- [ ] Complete flow: Generate → Submit → Reject
- [ ] Complete flow: Generate → Revoke (before submission)
- [ ] Filter combinations work correctly
- [ ] Pagination works with different page sizes
- [ ] Search works across multiple fields
- [ ] Sorting works in both directions
- [ ] Customer linking creates/links correctly

---

## Frontend Integration Notes

### Current Frontend Implementation:
The frontend currently uses **MockAPI** for all operations. To integrate with real backend:

1. **Update API Configuration** (`config/api.ts`):
```typescript
export const API_ENDPOINTS = {
  // Registration endpoints
  generateRegistration: '/registration/generate',
  validateToken: '/registration/validate-token',
  submitRegistration: '/registration/submit',
  getRegistration: '/registration',  // + /{id}
  listRegistrations: '/registrations',
  approveRegistration: '/registration',  // + /{id}/approve
  rejectRegistration: '/registration',   // + /{id}/reject
  revokeRegistration: '/registration',   // + /{id}/revoke
  updateRegistration: '/registration',   // + /{id}
};
```

2. **Replace MockAPI calls** in `app/admin/registrations/page.tsx`:
```typescript
// Change from:
const response = await MockAPI.fetchRegistrations({ status: 'all' });

// To:
const response = await axios.get(`${API_URL}/registrations`, {
  params: { status: activeTab === 'all' ? undefined : activeTab },
  headers: { Authorization: `Bearer ${token}` }
});
```

3. **Handle Real Pagination**:
Current implementation loads all data and paginates client-side. With real API:
- Pass `page` and `limit` parameters to API
- Update pagination controls to use API's total pages
- Re-fetch data when changing pages

4. **Handle Real Filtering**:
- Pass filter parameters to API instead of filtering client-side
- Debounce search input to avoid excessive API calls
- Show loading state during API calls

---

## Next Steps

1. **Backend Team**: Implement endpoints in order of priority
2. **Frontend Team**: Prepare API integration layer (remove MockAPI)
3. **Both Teams**: Agree on exact request/response formats
4. **Testing**: Create Postman/Insomnia collection for API testing
5. **Documentation**: Update API docs as endpoints are implemented

---

## Customer Management Implementation

### ✅ CHOSEN APPROACH: Option 1 - Simple Customer Creation in Approve Endpoint

Customer creation/linking is handled **within the approve endpoint**. No separate customer APIs are required at this stage.

**Backend Requirements:**

1. **Customer Database Table** (if not exists):
```sql
CREATE TABLE customers (
  id VARCHAR(50) PRIMARY KEY,
  business_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  abn VARCHAR(20),
  address_street VARCHAR(500),
  address_suburb VARCHAR(100),
  address_postcode VARCHAR(10),
  address_state VARCHAR(50),
  address_country VARCHAR(100),
  created_at TIMESTAMP,
  created_from_registration_id VARCHAR(50),
  INDEX idx_email (contact_email),
  INDEX idx_abn (abn)
);
```

2. **Approve Endpoint Logic**:
   - If `createNewCustomer: true` → Create customer record in database
   - If `linkedCustomerId` provided → Link to existing customer
   - Return `linkedCustomerId` in response

3. **Customer Data Mapping**:
   - Copy registration data to customer record
   - Generate unique customer ID (e.g., "cust_" + uuid)
   - Track which registration created this customer

---

### Future Enhancement: Full Customer API (Phase 2)

When customer management features are needed, expand to full API:
```
GET /customers                    - List all customers
GET /customers/{id}               - Get customer details  
POST /customers                   - Create new customer
PUT /customers/{id}               - Update customer
GET /customers/search?query=...   - Search customers
```

**Not required for initial implementation.**

---

## Questions for Backend Team?

- What authentication method will be used? (JWT, OAuth, API Key?)
- What's the base URL for the API?
- Are there any rate limits we should be aware of?
- How are file uploads (menu files) handled?
- Is there a staging environment for testing?
- What's the expected response time for list endpoint with filters?
- **Does a customer table/system already exist, or needs to be created?**
- **Which customer approach will you implement: Option 1 (simple) or Option 2 (full API)?**

---

**Document Version:** 1.0  
**Last Updated:** December 14, 2025  
**Author:** Frontend Team  
**Status:** Awaiting Backend Implementation
