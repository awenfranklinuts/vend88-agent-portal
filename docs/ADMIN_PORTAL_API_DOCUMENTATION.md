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

Registration endpoints are served by `https://dbapi.vend88.com`, not by the portal.
The full, current reference is
[agent-portal-website/docs/REGISTRATION_API_SPEC.md](../agent-portal-website/docs/REGISTRATION_API_SPEC.md).

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/registration/generate` | Create a single-use link (`https://form.vend88.com?token=<token>`, valid 30 days) |
| `GET` | `/registration/list` | List all registrations |
| `GET` | `/registration/:id` | Get one registration |
| `POST` | `/registration/:id` | Correct registration details |
| `POST` | `/registration/approve/:id` | Approve and create the customer and business |
| `POST` | `/registration/reject/:id` | Reject a submitted registration |
| `POST` | `/registration/revoke/:id` | Cancel a pending link |

### Approval creates the business

Approving a `submitted` registration provisions the merchant in the same request:

- **New customer:** send `account_email` and `account_password`. The backend creates
  the owner login account (email normalised to `@vend88.com`), creates a business named
  after the registration's `business_name` with status `setup`, and selects it as the
  account's active business.
- **Existing customer:** send `approval_action: "add_store"` and `customer_id`. The
  backend creates a new business (status `setup`) owned by that customer.

The response includes `customer_id`, `customer_email`, and the created `business`. The
registration stores `linked_customer_id` and `linked_business_id` and becomes
`approved`. If provisioning fails, it stays `submitted`.

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

### 🟡 Optional - Nice to Have

- `POST /api/customer/search` - Advanced customer search
- `POST /api/business/search` - Advanced business search
- `GET /api/customer/:id/statistics` - Customer statistics
- `GET /api/business/:id/statistics` - Business statistics
- `POST /api/business/:id/export` - Export business data as PDF

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
