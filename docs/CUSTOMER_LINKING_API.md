# Customer Linking API Documentation

## Overview
This document describes the API endpoints required for linking customers to registration forms and creating new customers during the approval process.

## Base URL
```
https://api.vend88.com/v1
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {token}
```

---

## 1. Link Customer to Registration

### Endpoint
```
PUT /registration/{registration_id}/link-customer
```

### Description
Links an existing customer OR creates a new customer and links them to a registration form.

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body

#### Option A: Link Existing Customer
```json
{
  "customer_id": "cust_123456789"
}
```

#### Option B: Create New Customer and Link
```json
{
  "create_new": true,
  "customer_data": {
    "name": "John Smith",
    "email": "john@coffeeshop.com",
    "phone": "+61412345678"
  }
}
```

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "message": "Customer linked successfully",
  "data": {
    "registration_id": "reg_123456",
    "customer_id": "cust_987654",
    "linked_at": "2025-12-14T10:30:00Z",
    "customer": {
      "id": "cust_987654",
      "name": "John Smith",
      "email": "john@coffeeshop.com",
      "phone": "+61412345678",
      "created_at": "2025-12-14T10:30:00Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "error": "customer_id or create_new flag is required",
  "status_code": 400
}
```

**404 Not Found** - Registration not found
```json
{
  "success": false,
  "error": "Registration not found",
  "status_code": 404
}
```

**409 Conflict** - Customer already linked
```json
{
  "success": false,
  "error": "Registration already linked to a customer",
  "status_code": 409
}
```

**422 Unprocessable Entity** - Invalid customer data
```json
{
  "success": false,
  "error": "Invalid email format",
  "status_code": 422
}
```

---

## 2. Approve Registration

### Endpoint
```
POST /registration/{registration_id}/approve
```

### Description
Approves a registration form. **Customer must be linked before approval.**

### Request Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{
  "approval_notes": "All documents verified and approved"
}
```

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "message": "Registration approved successfully",
  "status_code": 200,
  "data": {
    "registration_id": "reg_123456",
    "status": "approved",
    "approved_by": "admin@vend88.com",
    "approved_at": "2025-12-14T10:35:00Z",
    "customer_id": "cust_987654",
    "business_id": "biz_456789"
  }
}
```

#### Error Responses

**400 Bad Request** - Customer not linked
```json
{
  "success": false,
  "error": "Customer must be linked before approval",
  "status_code": 400
}
```

**404 Not Found** - Registration not found
```json
{
  "success": false,
  "error": "Registration not found",
  "status_code": 404
}
```

**409 Conflict** - Already approved
```json
{
  "success": false,
  "error": "Registration already approved",
  "status_code": 409
}
```

---

## 3. Get Customer Details

### Endpoint
```
GET /customer/{customer_id}
```

### Description
Retrieves details of a specific customer.

### Request Headers
```
Authorization: Bearer {token}
```

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "cust_987654",
    "name": "John Smith",
    "email": "john@coffeeshop.com",
    "phone": "+61412345678",
    "businesses": [
      {
        "id": "biz_456789",
        "name": "Coffee Shop Downtown",
        "status": "active"
      }
    ],
    "created_at": "2025-12-14T10:30:00Z",
    "updated_at": "2025-12-14T10:30:00Z"
  }
}
```

---

## 4. List All Customers

### Endpoint
```
GET /customers
```

### Description
Retrieves a list of all customers for the authenticated admin.

### Request Headers
```
Authorization: Bearer {token}
```

### Query Parameters
- `search` (optional): Search by name, email, or phone
- `status` (optional): Filter by status (active, inactive)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

### Response

#### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "cust_987654",
        "name": "John Smith",
        "email": "john@coffeeshop.com",
        "phone": "+61412345678",
        "status": "active",
        "business_count": 2,
        "created_at": "2025-12-14T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 250,
      "items_per_page": 50
    }
  }
}
```

---

## Workflow: Approve Registration with New Customer

### Step 1: Create New Customer and Link
```http
PUT /registration/reg_123456/link-customer
Content-Type: application/json
Authorization: Bearer {token}

{
  "create_new": true,
  "customer_data": {
    "name": "John Smith",
    "email": "john@coffeeshop.com",
    "phone": "+61412345678"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "customer_id": "cust_987654",
    "customer": {
      "id": "cust_987654",
      "name": "John Smith",
      "email": "john@coffeeshop.com"
    }
  }
}
```

### Step 2: Approve Registration
```http
POST /registration/reg_123456/approve
Content-Type: application/json
Authorization: Bearer {token}

{
  "approval_notes": ""
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration approved successfully",
  "data": {
    "registration_id": "reg_123456",
    "status": "approved",
    "customer_id": "cust_987654",
    "business_id": "biz_456789"
  }
}
```

---

## Workflow: Approve Registration with Existing Customer

### Step 1: Link Existing Customer
```http
PUT /registration/reg_123456/link-customer
Content-Type: application/json
Authorization: Bearer {token}

{
  "customer_id": "cust_987654"
}
```

### Step 2: Approve Registration
```http
POST /registration/reg_123456/approve
Content-Type: application/json
Authorization: Bearer {token}

{
  "approval_notes": ""
}
```

---

## Business Logic Requirements

### Customer Creation Rules
1. **Email Validation**: Must be valid email format
2. **Phone Validation**: Must be valid phone number format (E.164 recommended)
3. **Duplicate Check**: Check if customer with same email already exists
4. **Auto-generate ID**: Customer ID should be auto-generated with prefix `cust_`

### Registration Approval Rules
1. **Customer Link Required**: Registration must have a linked customer before approval
2. **Business Creation**: Create a business entity when registration is approved
3. **Status Update**: Update registration status from "submitted" to "approved"
4. **Audit Trail**: Record who approved and when
5. **Notification**: Send approval notification email to customer

### Error Handling
1. **Atomic Operations**: Customer creation and linking should be atomic (all or nothing)
2. **Rollback**: If approval fails, maintain customer link but keep registration as "submitted"
3. **Logging**: Log all operations for audit purposes

---

## Database Schema Recommendations

### Customers Table
```sql
CREATE TABLE customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
);
```

### Registration_Customer_Links Table
```sql
CREATE TABLE registration_customer_links (
  registration_id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL,
  linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  linked_by VARCHAR(255),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (registration_id) REFERENCES registrations(id),
  INDEX idx_customer_id (customer_id)
);
```

---

## Testing Checklist

### Unit Tests
- [ ] Create new customer with valid data
- [ ] Reject customer creation with invalid email
- [ ] Reject customer creation with missing required fields
- [ ] Link existing customer to registration
- [ ] Prevent linking customer to already-linked registration
- [ ] Approve registration with linked customer
- [ ] Reject approval without linked customer

### Integration Tests
- [ ] Complete workflow: Create customer → Link → Approve
- [ ] Complete workflow: Link existing customer → Approve
- [ ] Rollback scenario: Customer creation fails
- [ ] Duplicate customer email handling

### Load Tests
- [ ] Concurrent customer creation requests
- [ ] Bulk registration approvals

---

## Current Frontend Implementation

The frontend expects these endpoints and will:

1. **When "Create New" customer is selected:**
   - Send `PUT /registration/{id}/link-customer` with `create_new: true`
   - Wait for `customer_id` in response
   - Then call `POST /registration/{id}/approve`

2. **When existing customer is selected:**
   - Send `PUT /registration/{id}/link-customer` with `customer_id`
   - Then call `POST /registration/{id}/approve`

3. **Error Display:**
   - Shows toast notification for errors
   - Keeps modal open on failure
   - Closes modal on success

---

## Contact

For questions about this API specification, contact the frontend team or refer to the frontend code at:
- `app/admin/registrations/page.tsx` (Customer linking logic in `handleConfirmApprove`)

**Frontend API Config:**
- File: `config/api.ts`
- Endpoints defined: `REGISTRATION_LINK`, `REGISTRATION_APPROVE`
