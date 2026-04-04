# Backend API Requirements — New & Updated Endpoints

> **For:** Backend Development Team  
> **From:** Frontend (Agent Portal)  
> **Date:** April 5, 2026  
> **Priority:** High  

This document lists all **new** and **updated** API endpoints required by the frontend. All endpoints listed below are currently mocked on the frontend side and need real backend implementations.

---

## Table of Contents

1. [Authentication & Login](#1-authentication--login)
2. [Admin Management (CRUD)](#2-admin-management-crud)
3. [Form Templates (CRUD)](#3-form-templates-crud)
4. [Registration Approval — Updated Flow](#4-registration-approval--updated-flow)
5. [Customer Multi-Store Support](#5-customer-multi-store-support)

---

## 1. Authentication & Login

> **Status:** New endpoint needed. Do NOT reuse existing `/admin/login`.

### `POST /portal/auth/login`

Unified login for all portal roles (admin, agent, super_admin).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email |
| `password` | string | Yes | User password |
| `role` | string | Yes | One of: `"admin"`, `"agent"`, `"super_admin"` |

**Response (200 — Success):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_001",
    "email": "user@example.com",
    "role": "admin",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active"
  },
  "session_timeout": 3600,
  "permissions": ["view_registrations", "manage_customers", "manage_admins"]
}
```

**Response (401 — Invalid Credentials):**
```json
{
  "status_code": 401,
  "status_msg": "unauthorized",
  "message": "Invalid credentials or role not assigned to this user"
}
```

### Role Permission Matrix

| Role | Scope |
|------|-------|
| **Agent** | Own registrations, own customers, own businesses only |
| **Admin** | All registrations, customers, businesses, approvals, reports, form templates |
| **Super Admin** | Everything above + admin CRUD, system settings, audit logs |

---

## 2. Admin Management (CRUD)

> **Status:** All new endpoints. Currently 100% mocked.

All admin management endpoints require `Authorization: Bearer {token}` header.  
Only `super_admin` role should have access.

### 2.1 `POST /admin/list_user`

List all admin user IDs.

**Request:**
```json
{
  "token": "{auth_token}"
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "user_IDs": ["admin_001", "admin_002", "admin_003"]
}
```

---

### 2.2 `POST /admin/user_detail`

Get a single admin's full profile.

**Request:**
```json
{
  "token": "{auth_token}",
  "user_id": "admin_001"
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "user_id": "admin_001",
  "email": "superadmin@vend88.com",
  "first_name": "Super",
  "last_name": "Admin",
  "role": "super_admin",
  "created_at": "2024-01-15T09:00:00Z",
  "updated_at": "2025-11-20T14:30:00Z",
  "last_login": "2026-04-04T08:15:00Z"
}
```

**Response (404):**
```json
{
  "status_code": 404,
  "status_msg": "User not found"
}
```

**Role values:** `"admin"` or `"super_admin"` (not `"agent"` — agents are managed separately).

---

### 2.3 `POST /admin/create_user`

Create a new admin user.

**Request:**
```json
{
  "token": "{auth_token}",
  "email": "newadmin@vend88.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+61412345678",
  "username": "johndoe",
  "password": "secure_password",
  "role": "admin"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Must be unique |
| `first_name` | string | Yes | |
| `last_name` | string | Yes | |
| `phone_number` | string | No | |
| `username` | string | No | |
| `password` | string | Yes | Backend should hash this |
| `role` | string | Yes | `"admin"` or `"super_admin"` |

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "User created successfully",
  "user_id": "admin_new_001",
  "email": "newadmin@vend88.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin",
  "created_at": "2026-04-05T10:30:00Z"
}
```

**Response (400 — Duplicate):**
```json
{
  "status_code": 400,
  "status_msg": "Email already exists"
}
```

---

### 2.4 `POST /admin/update_user`

Update an existing admin's details.

**Request:**
```json
{
  "token": "{auth_token}",
  "user_id": "admin_001",
  "first_name": "Updated",
  "last_name": "Name",
  "phone_number": "+61498765432",
  "username": "updateduser",
  "role": "super_admin",
  "password": "new_password_optional"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user_id` | string | Yes | Target admin to update |
| `first_name` | string | No | Only send fields to update |
| `last_name` | string | No | |
| `phone_number` | string | No | |
| `username` | string | No | |
| `role` | string | No | `"admin"` or `"super_admin"` |
| `password` | string | No | If provided, update password (hash it) |

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "User updated successfully",
  "user_id": "admin_001",
  "updated_at": "2026-04-05T11:15:00Z"
}
```

---

### 2.5 `POST /admin/delete_user`

Delete an admin user.

**Request:**
```json
{
  "token": "{auth_token}",
  "user_id": "admin_005"
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "User deleted successfully",
  "user_id": "admin_005"
}
```

**Business Rule:** A super_admin cannot delete themselves. Return `400` if attempted.

---

## 3. Form Templates (CRUD)

> **Status:** All new endpoints. Currently 100% mocked.  
> **Purpose:** Reusable form templates for registration forms with visibility controls and version tracking.

### 3.1 `GET /form-templates/list?status={status}`

List all form templates, optionally filtered by status.

**Query Parameters:**

| Param | Type | Required | Values |
|-------|------|----------|--------|
| `status` | string | No | `"active"`, `"draft"`, `"archived"`, or omit for all |

**Response (200):**
```json
{
  "status_code": 200,
  "data": [
    {
      "id": "tpl_001",
      "name": "Standard Onboarding",
      "description": "Full onboarding form with all required business details",
      "version": 3,
      "visibility": "all",
      "visible_roles": [],
      "status": "active",
      "created_by": "superadmin@vend88.com",
      "created_at": "2025-08-15T09:00:00Z",
      "updated_at": "2026-02-10T14:30:00Z",
      "fields": [
        {
          "id": "contact_email",
          "label": "Email Address",
          "type": "email",
          "required": true,
          "order": 1
        },
        {
          "id": "business_name",
          "label": "Business Name",
          "type": "text",
          "required": true,
          "order": 2
        }
      ]
    }
  ]
}
```

---

### 3.2 `POST /form-templates/detail`

Get a single template with version history and usage stats.

**Request:**
```json
{
  "id": "tpl_001"
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "data": {
    "id": "tpl_001",
    "name": "Standard Onboarding",
    "description": "Full onboarding form",
    "version": 3,
    "visibility": "all",
    "visible_roles": [],
    "status": "active",
    "created_by": "superadmin@vend88.com",
    "created_at": "2025-08-15T09:00:00Z",
    "updated_at": "2026-02-10T14:30:00Z",
    "usage_count": 24,
    "version_history": [
      {
        "version": 1,
        "updated_at": "2025-08-15T09:00:00Z",
        "updated_by": "superadmin@vend88.com",
        "change_note": "Initial version"
      },
      {
        "version": 2,
        "updated_at": "2025-11-20T10:00:00Z",
        "updated_by": "superadmin@vend88.com",
        "change_note": "Added EFTPOS field"
      }
    ],
    "fields": [...]
  }
}
```

---

### 3.3 `POST /form-templates/create`

Create a new form template.

**Request:**
```json
{
  "name": "New Template",
  "description": "Template description",
  "fields": [
    {
      "id": "contact_email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "order": 1
    },
    {
      "id": "business_name",
      "label": "Business Name",
      "type": "text",
      "required": true,
      "order": 2
    }
  ],
  "visibility": "all",
  "visible_roles": [],
  "status": "active",
  "admin_email": "admin@vend88.com"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Template name |
| `description` | string | No | Purpose description |
| `fields` | array | Yes | Must include at least 1 field. `contact_email` field is **mandatory**. |
| `visibility` | string | Yes | `"all"`, `"admin_only"`, or `"specific_roles"` |
| `visible_roles` | string[] | Conditional | Required when visibility is `"specific_roles"` |
| `status` | string | Yes | `"active"`, `"draft"`, or `"archived"` |
| `admin_email` | string | Yes | Creator's email for audit trail |

**Field Object Shape:**
```json
{
  "id": "field_id",
  "label": "Display Label",
  "type": "text | email | tel | select | textarea | file | number",
  "required": true,
  "order": 1,
  "description": "Helper text shown below the field",
  "options": ["Option A", "Option B"],
  "group": "Optional group name"
}
```

**Validation Rules:**
- `contact_email` field must always be present in the fields array
- At least one field is required
- Template name must not be empty

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "data": {
    "id": "tpl_new_001",
    "name": "New Template",
    "version": 1,
    "created_at": "2026-04-05T10:30:00Z",
    "fields": [...]
  }
}
```

---

### 3.4 `POST /form-templates/update`

Update an existing template. **Version auto-increments on each update.**

**Request:**
```json
{
  "id": "tpl_001",
  "name": "Updated Name",
  "description": "Updated description",
  "fields": [...],
  "visibility": "specific_roles",
  "visible_roles": ["super_admin"],
  "status": "active",
  "current_version": 3
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | Template to update |
| `current_version` | number | Yes | For optimistic concurrency; reject if stale |
| All other fields | - | No | Only send fields that changed |

**Business Rules:**
- Backend must increment version: `new_version = current_version + 1`
- If `current_version` doesn't match DB, return `409 Conflict` (stale data)
- `contact_email` field must remain present if `fields` is updated

**Response (200):**
```json
{
  "status_code": 200,
  "data": {
    "id": "tpl_001",
    "version": 4,
    "updated_at": "2026-04-05T11:20:00Z"
  }
}
```

**Response (409 — Conflict):**
```json
{
  "status_code": 409,
  "status_msg": "Version conflict. Template was modified by another user."
}
```

---

### 3.5 `POST /form-templates/delete`

Delete a form template.

**Request:**
```json
{
  "id": "tpl_001"
}
```

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "message": "Template deleted successfully"
}
```

**Business Rule:** Consider soft-delete (set status to `"archived"`) if the template has been used in existing registrations (`usage_count > 0`).

---

## 4. Registration Approval — Updated Flow

> **Status:** Existing endpoints, **updated request/response shapes**.  
> **Key Change:** Approval now supports two explicit paths: creating a new customer or adding a store to an existing customer.

### 4.1 `PUT /registration/:id/link-customer` — UPDATED

This endpoint now handles two scenarios:

#### Scenario A: Link to Existing Customer (Add New Store)

```json
{
  "token": "{auth_token}",
  "customer_id": "cust_001",
  "create_new_store": true
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `customer_id` | string | Yes | Existing customer ID |
| `create_new_store` | boolean | Yes | Must be `true` — a new store/business will be created from the registration data and linked to this customer |

**Expected Backend Behavior:**
1. Validate customer exists
2. Create a new business record from registration data (business_name, ABN, address, etc.)
3. Link the new business to the customer (add to their `business_ids` array)
4. Set `linked_customer_id` on the registration

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "linked_customer_id": "cust_001",
  "new_business_id": "bus_new_001",
  "total_stores": 3
}
```

#### Scenario B: Create New Customer + Store

```json
{
  "token": "{auth_token}",
  "create_new": true,
  "customer_data": {
    "name": "John Smith",
    "email": "john.smith@coffeeshop.com",
    "phone": "+61412345678"
  }
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `create_new` | boolean | Yes | Must be `true` |
| `customer_data.name` | string | Yes | Customer name |
| `customer_data.email` | string | Yes | Customer email (should be unique) |
| `customer_data.phone` | string | No | Customer phone |

**Expected Backend Behavior:**
1. Create a new customer record from `customer_data`
2. Create a new business record from registration data
3. Link the business to the new customer
4. Set `linked_customer_id` on the registration

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "linked_customer_id": "cust_new_001",
  "new_business_id": "bus_new_001",
  "customer_created": true
}
```

**Response (400 — Email Already Exists):**
```json
{
  "status_code": 400,
  "status_msg": "Customer with this email already exists",
  "existing_customer_id": "cust_005"
}
```

---

### 4.2 `POST /registration/approve/:id` — UPDATED

**Request (updated shape):**
```json
{
  "token": "{auth_token}",
  "approval_notes": "Optional notes about this approval",
  "approval_action": "new_customer_and_store"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `approval_notes` | string | No | Admin's notes |
| `approval_action` | string | Yes | `"new_customer_and_store"` or `"add_store"` |

**Expected Backend Behavior:**
1. Verify that `linked_customer_id` is set (link-customer must be called first)
2. Change registration status to `"approved"`
3. Set `approvedAt` and `approvedBy` fields
4. If the business/store wasn't already created in the link step, create it now
5. Return confirmation with IDs

**Response (200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "registration_id": "V88-REG-001",
  "status": "approved",
  "approved_at": "2026-04-05T15:00:00Z",
  "approved_by": "admin@vend88.com",
  "customer_id": "cust_001",
  "business_id": "bus_new_001",
  "approval_action": "add_store"
}
```

**Response (400 — Missing Customer Link):**
```json
{
  "status_code": 400,
  "status_msg": "Cannot approve: no customer linked to this registration"
}
```

---

## 5. Customer Multi-Store Support

> **Status:** Data model update needed.

### Updated Customer Schema

The `Customer` model must support **multiple stores/businesses** per customer.

**Previous Schema:**
```json
{
  "_id": "cust_001",
  "name": "John Smith",
  "email": "john.smith@coffeeshop.com",
  "phone": "+61412345678",
  "business_id": "bus_001"
}
```

**New Schema:**
```json
{
  "_id": "cust_001",
  "name": "John Smith",
  "email": "john.smith@coffeeshop.com",
  "phone": "+61412345678",
  "business_id": "bus_001",
  "business_ids": ["bus_001", "bus_002", "bus_003"],
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `business_id` | string | **Keep for backward compatibility.** Primary/first business. |
| `business_ids` | string[] | **New.** All businesses/stores owned by this customer. |

### Updated `GET /customers/:id` Response

Should include the full list of businesses:

```json
{
  "status_code": 200,
  "_id": "cust_001",
  "name": "John Smith",
  "email": "john.smith@coffeeshop.com",
  "phone": "+61412345678",
  "business_id": "bus_001",
  "business_ids": ["bus_001", "bus_002"],
  "status": "active",
  "businesses": [
    {
      "_id": "bus_001",
      "name": "Smith's Coffee Shop",
      "status": "active",
      "abn": "12345678901",
      "address": "123 Main St, Sydney NSW 2000"
    },
    {
      "_id": "bus_002",
      "name": "Smith's Second Location",
      "status": "active",
      "abn": "12345678902",
      "address": "456 George St, Sydney NSW 2000"
    }
  ]
}
```

### New Endpoint: Get Businesses by Customer

The frontend fetches a customer's businesses during the approval flow.

**`GET /search/business?customer_id={customer_id}`**

**Response (200):**
```json
{
  "status_code": 200,
  "businesses": [
    {
      "_id": "bus_001",
      "name": "Smith's Coffee Shop",
      "suburb": "Sydney",
      "state": "NSW",
      "postcode": "2000"
    },
    {
      "_id": "bus_002",
      "name": "Smith's Second Location",
      "suburb": "Parramatta",
      "state": "NSW",
      "postcode": "2150"
    }
  ]
}
```

---

## Summary of All New/Updated Endpoints

| # | Method | Endpoint | Status | Category |
|---|--------|----------|--------|----------|
| 1 | POST | `/portal/auth/login` | **NEW** | Auth |
| 2 | POST | `/admin/list_user` | **NEW** | Admin CRUD |
| 3 | POST | `/admin/user_detail` | **NEW** | Admin CRUD |
| 4 | POST | `/admin/create_user` | **NEW** | Admin CRUD |
| 5 | POST | `/admin/update_user` | **NEW** | Admin CRUD |
| 6 | POST | `/admin/delete_user` | **NEW** | Admin CRUD |
| 7 | GET | `/form-templates/list` | **NEW** | Form Templates |
| 8 | POST | `/form-templates/detail` | **NEW** | Form Templates |
| 9 | POST | `/form-templates/create` | **NEW** | Form Templates |
| 10 | POST | `/form-templates/update` | **NEW** | Form Templates |
| 11 | POST | `/form-templates/delete` | **NEW** | Form Templates |
| 12 | PUT | `/registration/:id/link-customer` | **UPDATED** | Registration |
| 13 | POST | `/registration/approve/:id` | **UPDATED** | Registration |
| 14 | GET | `/customers/:id` | **UPDATED** | Customer |
| 15 | GET | `/search/business?customer_id=` | **NEW** | Customer |

**Total: 11 new endpoints, 3 updated endpoints, 1 schema change.**
