# Admin Portal API Documentation

## Overview
This document provides comprehensive API documentation for all endpoints used in the Vend88 Admin Portal, including customer management, business management, and registration management features.

**Last Updated:** December 15, 2025

---

## Table of Contents
- [Authentication](#authentication)
- [Customer Management APIs](#customer-management-apis)
- [Business Management APIs](#business-management-apis)
- [Registration Management APIs](#registration-management-apis)
- [Permission Management APIs](#permission-management-apis)
- [Admin Management APIs](#admin-management-apis)

---

## Authentication

All API endpoints require Bearer token authentication.

### Request Headers
```http
Content-Type: application/json
Authorization: Bearer {token}
```

### Role-Based Access
- **Admin Role:** Full access to all endpoints
- **Agent Role:** Limited access (specific endpoints only)

---

## Customer Management APIs

### 1. List All Customers

**Endpoint:** `POST /customer/list`

**Description:** Retrieves a paginated list of all customers with their associated businesses count.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "customers": [
    {
      "_id": "customer_123456",
      "name": "John Smith",
      "email": "john@example.com",
      "phoneNumber": "+61412345678",
      "abn": "12345678901",
      "address": "123 Main Street",
      "suburb": "Sydney",
      "postcode": "2000",
      "state": "NSW",
      "country": "Australia",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Features Implemented:**
- ✅ View toggle (grid/table)
- ✅ Advanced search (by name, ABN, address, email)
- ✅ Sorting (by name, date, business count)
- ✅ Pagination (12 items per page)
- ✅ Statistics cards (total customers, businesses, recent additions)
- ✅ Export to CSV (all or filtered data)
- ✅ Customer details modal
- ✅ Email customer action
- ✅ Edit customer inline (TODO: API endpoint needed)

**Missing API Endpoints:**
- 🔴 `PUT /customer/:id` - Update customer information
- 🔴 `DELETE /customer/:id` - Delete customer (soft delete recommended)
- 🔴 `POST /customer/search` - Advanced search with filters
- 🔴 `GET /customer/:id/businesses` - Get all businesses for a customer

---

### 2. Search Businesses

**Endpoint:** `POST /api/search/business`

**Description:** Retrieves business information, used to count businesses per customer.

**Request Body:**
```json
{
  "detail": true
}
```

**Response:**
```json
{
  "status_code": 200,
  "business": [
    {
      "_id": "business_123456",
      "owner_id": "customer_123456",
      "name": "Coffee Shop Downtown",
      "abn": "98765432101",
      "address": "456 High Street",
      "suburb": "Melbourne",
      "postcode": "3000",
      "state": "VIC",
      "country": "Australia",
      "contactEmail": "contact@coffeeshop.com",
      "contactPhone": "+61398765432",
      "status": "active",
      "eftposIntegration": "Yes",
      "alipayOption": "Yes",
      "alipayOther": "",
      "createdAt": "2024-02-01T09:00:00Z",
      "updatedAt": "2024-02-01T09:00:00Z",
      "registrationId": "reg_abc123"
    }
  ]
}
```

---

## Business Management APIs

### 1. Search/List All Businesses

**Endpoint:** `POST /api/search/business`

**Description:** Retrieves all businesses with detailed information.

**Request Body:**
```json
{
  "detail": true
}
```

**Response:**
```json
{
  "status_code": 200,
  "business": [
    {
      "_id": "business_123456",
      "owner_id": "customer_123456",
      "name": "Coffee Shop Downtown",
      "abn": "98765432101",
      "address": "456 High Street",
      "suburb": "Melbourne",
      "postcode": "3000",
      "state": "VIC",
      "country": "Australia",
      "contactEmail": "contact@coffeeshop.com",
      "contactPhone": "+61398765432",
      "status": "active",
      "eftposIntegration": "Yes",
      "alipayOption": "Yes",
      "createdAt": "2024-02-01T09:00:00Z",
      "updatedAt": "2024-02-01T09:00:00Z",
      "registrationId": "reg_abc123"
    }
  ]
}
```

**Features Implemented:**
- ✅ View toggle (grid/table)
- ✅ Advanced search (ABN, address, owner name, date range)
- ✅ Sorting (by name, date, status)
- ✅ Pagination (12 items per page)
- ✅ Statistics cards (total, active, setup, inactive)
- ✅ Bulk selection and export
- ✅ Business details modal
- ✅ Status change with confirmation modal
- ✅ Export to CSV with owner information
- ✅ Display business name and suburb prominently

**Missing API Endpoints:**
- 🔴 `PUT /api/business/:id` - Update business information
- 🔴 `PUT /api/business/:id/status` - Update business status
- 🔴 `DELETE /api/business/:id` - Delete business
- 🔴 `POST /api/business/search` - Advanced search endpoint

---

### 2. Get Business Details

**Endpoint:** `POST /api/search/business` (with detail: true, filter by ID)

**Description:** Get detailed information about a specific business.

**Current Implementation:** Filters client-side from full business list.

**Recommended:** Create dedicated endpoint `GET /api/business/:id`

---

### 3. Business Details Page

**Features Implemented:**
- ✅ Comprehensive business information display
- ✅ Owner information card with customer details
- ✅ Statistics cards (active devices, permissions, days active)
- ✅ Tab-based organization (Overview, Devices, Permissions, Activity, Notes)
- ✅ Edit mode for business information
- ✅ Quick actions (Edit, Export CSV/PDF, Contact Owner)
- ✅ Device management (display, add, edit, delete)
- ✅ Permission management integration
- ✅ Activity log timeline
- ✅ Notes section
- ✅ Registration details link
- ✅ Business name and location prominently displayed

**Missing API Endpoints:**
- 🔴 `PUT /api/business/:id` - Update business details
- 🔴 `GET /api/business/:id/devices` - Get devices for business
- 🔴 `POST /api/business/:id/devices` - Add device
- 🔴 `PUT /api/business/:id/devices/:deviceId` - Update device
- 🔴 `DELETE /api/business/:id/devices/:deviceId` - Delete device
- 🔴 `GET /api/business/:id/activity` - Get activity log
- 🔴 `GET /api/business/:id/notes` - Get notes
- 🔴 `POST /api/business/:id/notes` - Add note
- 🔴 `PUT /api/business/:id/notes/:noteId` - Update note
- 🔴 `DELETE /api/business/:id/notes/:noteId` - Delete note

---

## Registration Management APIs

### 1. Generate Registration Link

**Endpoint:** `POST /api/registration/generate`

**Description:** Generate a unique registration link for a new business.

**Request Body:**
```json
{
  "generatedBy": "admin@vend88.com"
}
```

**Response:**
```json
{
  "status_code": 200,
  "data": {
    "id": "reg_abc123",
    "token": "unique-token-string",
    "registrationUrl": "https://portal.vend88.com/register/unique-token-string",
    "expiresAt": "2025-12-21T10:00:00Z",
    "generatedAt": "2025-12-14T10:00:00Z",
    "generatedBy": "admin@vend88.com",
    "status": "pending"
  }
}
```

**⚠️ CRITICAL:** The `id` field must be unique and returned immediately for subsequent operations.

---

### 2. Get All Registration Forms

**Endpoint:** `POST /api/registration/get-form`

**Description:** Retrieve all registration forms with filtering options.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "forms": [
    {
      "_id": "reg_123456",
      "status": "submitted",
      "businessName": "Coffee Shop Downtown",
      "ownerName": "John Smith",
      "contactEmail": "john@coffeeshop.com",
      "contactPhone": "+61412345678",
      "abn": "12345678901",
      "registeredAddress": "123 Main Street",
      "registeredSuburb": "Sydney",
      "registeredPostcode": "2000",
      "registeredState": "NSW",
      "registeredCountry": "Australia",
      "token": "unique-token-123",
      "generatedAt": "2024-01-10T10:00:00Z",
      "submittedAt": "2024-01-15T14:30:00Z",
      "expiresAt": "2024-01-17T10:00:00Z"
    }
  ]
}
```

**Features Implemented:**
- ✅ Status filtering (all, pending, submitted, approved, rejected, expired, revoked)
- ✅ Date range filtering
- ✅ Search by business name, owner, email, ABN
- ✅ Sorting (by date, status, business name)
- ✅ Pagination
- ✅ Statistics cards
- ✅ Generate new link button
- ✅ Copy link to clipboard
- ✅ Approve/Reject with modal confirmation
- ✅ Revoke link with modal confirmation
- ✅ View full form details in modal
- ✅ Email notification to applicant

---

### 3. Approve Registration

**Endpoint:** `POST /api/registration/approve`

**Description:** Approve a registration form and create customer/business records.

**Request Body:**
```json
{
  "id": "reg_123456"
}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "Registration approved successfully",
  "customer_id": "customer_789",
  "business_id": "business_456"
}
```

**Expected Behavior:**
1. Update registration status to "approved"
2. Create customer record from form data
3. Create business record linked to customer
4. Send approval email to applicant
5. Return created customer and business IDs

---

### 4. Reject Registration

**Endpoint:** `POST /api/registration/reject`

**Description:** Reject a registration form with reason.

**Request Body:**
```json
{
  "id": "reg_123456",
  "reason": "Incomplete business information"
}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "Registration rejected successfully"
}
```

**Expected Behavior:**
1. Update registration status to "rejected"
2. Store rejection reason
3. Send rejection email to applicant with reason
4. Keep form data for reference

**Missing API Endpoint:** Currently using TODO placeholder.

---

### 5. Revoke Registration Link

**Endpoint:** `POST /api/registration/revoke`

**Description:** Revoke a registration link before it's submitted.

**Request Body:**
```json
{
  "id": "reg_123456"
}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "Registration link revoked successfully"
}
```

**Expected Behavior:**
1. Update registration status to "revoked"
2. Invalidate the token
3. Prevent form submission with this token

**Missing API Endpoint:** Currently using TODO placeholder.

---

## Permission Management APIs

### 1. Get Permissions for Business

**Endpoint:** `POST /api/shop/get-permission`

**Description:** Retrieve all permissions for a specific business.

**Request Body:**
```json
{
  "business_id": "business_123456"
}
```

**Response:**
```json
{
  "status_code": 200,
  "permissions": [
    {
      "_id": "perm_123",
      "business_id": "business_123456",
      "business_name": "Coffee Shop Downtown",
      "owner_id": "customer_789",
      "name": "POS Access",
      "level": "admin",
      "expire": "2025-12-31"
    }
  ]
}
```

---

### 2. Add Permission

**Endpoint:** `POST /api/shop/add-permission`

**Description:** Add a new permission to a business.

**Request Body:**
```json
{
  "business_id": "business_123456",
  "business_name": "Coffee Shop Downtown",
  "owner_id": "customer_789",
  "name": "Staff Access",
  "level": "read",
  "expire": "2025-12-31"
}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "Permission added successfully"
}
```

---

### 3. Update Permission

**Endpoint:** `POST /api/shop/update-permission`

**Description:** Update an existing permission.

**Request Body:**
```json
{
  "_id": "perm_123",
  "level": "write",
  "expire": "2026-12-31"
}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "Permission updated successfully"
}
```

---

### 4. Delete Permission

**Endpoint:** `POST /api/shop/delete-permission`

**Description:** Delete a permission.

**Request Body:**
```json
{
  "_id": "perm_123"
}
```

**Response:**
```json
{
  "status_code": 200,
  "status_msg": "Permission deleted successfully"
}
```

---

## Admin Management APIs

### 1. List Admins

**Endpoint:** `POST /api/admin/list`

**Description:** Get list of all admin users.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "status_code": 200,
  "admins": [
    {
      "_id": "admin_123",
      "email": "admin@vend88.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Check Admin Existence

**Endpoint:** `POST /api/admin/check`

**Description:** Check if an admin email already exists.

**Request Body:**
```json
{
  "email": "newadmin@vend88.com"
}
```

**Response:**
```json
{
  "status_code": 200,
  "exists": false
}
```

---

## Summary of Required API Endpoints

### 🔴 Critical - Must Implement

#### Customer Management
- `PUT /customer/:id` - Update customer information
- `DELETE /customer/:id` - Delete customer

#### Business Management
- `PUT /api/business/:id` - Update business information
- `PUT /api/business/:id/status` - Update business status
- `GET /api/business/:id/devices` - Get business devices
- `POST /api/business/:id/devices` - Add device
- `PUT /api/business/:id/devices/:deviceId` - Update device
- `DELETE /api/business/:id/devices/:deviceId` - Delete device
- `GET /api/business/:id/activity` - Get activity log
- `GET /api/business/:id/notes` - Get notes
- `POST /api/business/:id/notes` - Add note

#### Registration Management
- `POST /api/registration/reject` - Reject registration with reason
- `POST /api/registration/revoke` - Revoke registration link

### 🟡 Optional - Nice to Have

- `POST /api/customer/search` - Advanced customer search
- `POST /api/business/search` - Advanced business search
- `GET /api/customer/:id/statistics` - Customer statistics
- `GET /api/business/:id/statistics` - Business statistics
- `POST /api/business/:id/export` - Export business data as PDF
- `POST /api/registration/resend-email` - Resend notification email

---

## Common Response Codes

### Success Responses
- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### Error Responses
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "status_code": 400,
  "status_msg": "Error message",
  "errors": {
    "field_name": "Field specific error message"
  }
}
```

---

## Notes

### Data Validation
All endpoints should validate:
- Required fields are present
- Email format is valid
- Phone number format is valid
- ABN is 11 digits
- Dates are in ISO 8601 format
- Status values are from allowed enum

### Security Considerations
- All endpoints require authentication
- Role-based access control (admin/agent)
- Sensitive operations (delete, status change) should require confirmation
- Rate limiting should be implemented
- Audit logging for all mutations

### Performance Optimizations
- Implement pagination for list endpoints
- Add caching for frequently accessed data
- Use database indexes for search fields
- Implement lazy loading for large datasets

---

**Document Version:** 1.0  
**Last Updated:** December 15, 2025  
**Maintained By:** Vend88 Development Team
