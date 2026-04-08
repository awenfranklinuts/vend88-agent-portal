# Portal Admin Management API Documentation

## Overview

This document outlines the API endpoints used by the Portal Admin Management system. All endpoints follow REST conventions and use JSON for request/response bodies.

**Base URL:** `/portal`

**Authentication:** Most endpoints require a `token` parameter (obtained from login endpoint)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Management](#admin-management)
3. [Audit & Logging](#audit--logging)
4. [Permissions](#permissions)
   - [Update Admin Permissions](#update-admin-permissions)
   - [Get Business Permissions](#get-business-permissions)

---

## Authentication

### Login
**Endpoint:** `POST /portal/auth/login`

**Description:** Authenticate user and obtain access token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "admin@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin",
    "permissions": ["manage_admins", "manage_customers", "view_reports"]
  }
}
```

**Error Response (401):**
```json
{
  "status_code": 401,
  "message": "Invalid email or password"
}
```

---

## Admin Management

### Get Admin Profile
**Endpoint:** `POST /portal/admin/profile`

**Description:** Retrieve the current authenticated admin's profile information

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "user_id": "user_123",
  "email": "admin@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-03-08T14:22:00Z",
  "last_login": "2024-03-08T14:22:00Z",
  "permissions": ["manage_admins", "manage_customers"]
}
```

**Error Response (401):**
```json
{
  "status_code": 401,
  "message": "Unauthorized"
}
```

---

### List All Admins
**Endpoint:** `POST /portal/admin/list`

**Description:** Retrieve a list of all admin user IDs in the system

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "user_IDs": [
    "user_123",
    "user_456",
    "user_789"
  ],
  "total_count": 3
}
```

**Error Response (401):**
```json
{
  "status_code": 401,
  "message": "Unauthorized"
}
```

---

### Get Admin Detail
**Endpoint:** `POST /portal/admin/detail`

**Description:** Retrieve detailed information about a specific admin user

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user_123"
}
```

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "user_id": "user_123",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-03-08T14:22:00Z",
  "last_login": "2024-03-08T14:22:00Z",
  "permissions": [
    "manage_customers",
    "manage_registration_forms",
    "view_reports"
  ]
}
```

**Error Response (404):**
```json
{
  "status_code": 404,
  "message": "Admin user not found"
}
```

---

### Create Admin
**Endpoint:** `POST /portal/admin/create`

**Description:** Create a new admin user

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "newadmin@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "admin",
  "password": "SecurePassword123!"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Authentication token |
| email | string | Yes | Unique email address |
| first_name | string | Yes | Admin's first name |
| last_name | string | Yes | Admin's last name |
| role | string | Yes | Role: `admin` or `super_admin` |
| password | string | Yes | Password (minimum 8 characters) |

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "User created successfully",
  "user_id": "user_789",
  "email": "newadmin@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "username": "",
  "phone_number": "",
  "created_at": "2024-03-08T15:45:00Z"
}
```

**Error Response (400):**
```json
{
  "status_code": 400,
  "status_msg": "Email already exists"
}
```

---

### Update Admin
**Endpoint:** `POST /portal/admin/update`

**Description:** Update an existing admin user's information

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user_123",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin",
  "status": "active",
  "password": "NewPassword123!"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Authentication token |
| user_id | string | Yes | ID of admin to update |
| email | string | Yes | Email address |
| first_name | string | Yes | Admin's first name |
| last_name | string | Yes | Admin's last name |
| role | string | Yes | Role: `admin` or `super_admin` |
| status | string | Yes | Status: `active`, `inactive`, or `suspended` |
| password | string | No | New password (if updating) |

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "User updated successfully",
  "user_id": "user_123",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "username": "",
  "phone_number": "",
  "updated_at": "2024-03-08T16:00:00Z"
}
```

**Error Response (404):**
```json
{
  "status_code": 404,
  "status_msg": "User not found"
}
```

---

### Delete Admin
**Endpoint:** `POST /portal/admin/delete`

**Description:** Delete an admin user from the system

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user_123"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Authentication token |
| user_id | string | Yes | ID of admin to delete |

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "User deleted successfully",
  "user_id": "user_123"
}
```

**Error Response (404):**
```json
{
  "status_code": 404,
  "status_msg": "User not found"
}
```

---

## Audit & Logging

### Get Audit Logs
**Endpoint:** `GET /portal/admin/audit-log`

**Description:** Retrieve all audit logs in the system

**Request Parameters (Query String):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Authentication token |

**Request Example:**
```
GET /portal/admin/audit-log?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "audit_log": [
    {
      "timestamp": "2024-03-08T14:22:00Z",
      "action": "UPDATE",
      "target_email": "john.doe@example.com",
      "actor_email": "super_admin@example.com",
      "details": "first_name=John, last_name=Doe, role=admin"
    },
    {
      "timestamp": "2024-03-07T10:15:00Z",
      "action": "CREATE",
      "target_email": "jane.smith@example.com",
      "actor_email": "super_admin@example.com",
      "details": "Created admin"
    },
    {
      "timestamp": "2024-03-06T09:30:00Z",
      "action": "DELETE",
      "target_email": "old.admin@example.com",
      "actor_email": "super_admin@example.com",
      "details": "Deleted super_admin"
    }
  ],
  "total": 150
}
```

**Note:** Returns the last 100 audit log entries. Use the user-specific endpoint to filter by user.

**Error Response (401):**
```json
{
  "status_code": 401,
  "message": "Unauthorized"
}
```

---

### Get User Audit Log
**Endpoint:** `GET /portal/admin/audit-log/{user_id}`

**Description:** Retrieve audit logs for a specific user

**Request Parameters:**

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| user_id | string | URL Path | Yes | ID of the user |
| token | string | Query String | Yes | Authentication token |

**Request Example:**
```
GET /portal/admin/audit-log/user_123?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "user_id": "user_123",
  "email": "john.doe@example.com",
  "audit_log": [
    {
      "timestamp": "2024-03-08T14:22:00Z",
      "action": "UPDATE",
      "target_email": "john.doe@example.com",
      "actor_email": "super_admin@example.com",
      "details": "first_name=John, last_name=Doe"
    },
    {
      "timestamp": "2024-03-06T09:30:00Z",
      "action": "CREATE",
      "target_email": "john.doe@example.com",
      "actor_email": "super_admin@example.com",
      "details": "Created admin"
    }
  ],
  "total": 25
}
```

**Note:** Returns the last 50 audit log entries for the specified user.

**Error Response (404):**
```json
{
  "status_code": 404,
  "status_msg": "User not found"
}
```

---

## Permissions

### Update Admin Permissions
**Endpoint:** `POST /portal/admin/permissions`

**Description:** Update the permissions assigned to an admin user

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "user_123",
  "permissions": [
    "manage_customers",
    "manage_registration_forms",
    "view_reports"
  ]
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Authentication token |
| user_id | string | Yes | ID of admin to update |
| permissions | array | Yes | Array of permission IDs to assign |

**Available Permissions:**

#### Admin Permissions:
- `manage_businesses` - Business Management
- `manage_customers` - Customer Management
- `manage_agents` - Agent Management
- `manage_registration_forms` - Registration Forms
- `manage_form_templates` - Form Templates
- `view_reports` - Reports & Analytics
- `manage_system_settings` - System Settings

#### Super Admin Permissions:
All admin permissions plus:
- `manage_admins` - Admin Management

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "Permissions updated successfully",
  "user_id": "user_123",
  "permissions": [
    "manage_customers",
    "manage_registration_forms",
    "view_reports"
  ]
}
```

**Error Response (404):**
```json
{
  "status_code": 404,
  "status_msg": "User not found"
}
```



### Get Business Permissions
**Endpoint:** `POST /portal/admin/businesses/{business_id}/permissions`

**Description:** Get the permissions assigned to a business for admin access

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Authentication token |
| business_id | string | Yes | ID of the business |

**Available Business Permissions:**
- `manage_devices` - Device Management
- `manage_staff` - Staff Management
- `view_reports` - Reports & Analytics
- `manage_settings` - Business Settings
- `manage_menu` - Menu Management
- `manage_orders` - Order Management
- `manage_customers` - Customer Management
- `manage_integrations` - Integration Management

**Response (Success - 200):**
```json
{
  "status_code": 200,
  "status_msg": "success",
  "business_id": "bus_002",
  "permissions": [
    "view_reports",
    "manage_menu",
    "manage_orders"
  ]
}
```

**Error Response (401):**
```json
{
  "status_code": 401,
  "status_msg": "Unauthorized"
}
```

**Error Response (403):**
```json
{
  "status_code": 403,
  "status_msg": "Access denied"
}
```

---

---

## Implementation Notes

### Audit Logging
- All admin operations (CREATE, UPDATE, DELETE, PERMISSIONS_UPDATED) are automatically logged
- Audit logs include timestamp, action type, target user email, actor (who performed the action), and details
- The main audit log endpoint returns up to the last 100 entries
- The user-specific endpoint returns up to the last 50 entries for that user

### Response Format
- All successful responses include `status_code` and `status_msg` fields
- Error responses include `status_code` and `status_msg` with error details
- Timestamps are in ISO 8601 format (UTC timezone)

### Admin Roles
- **admin**: Can manage customers, businesses, agents, and registration forms
- **super_admin**: Can manage everything including admins, system settings, and view all audit logs

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2024-03-08 | Updated to match main.py implementation |
| 1.0 | 2024-03-08 | Initial API documentation |

---

## Contact

For questions regarding this API specification, please contact the development team.
