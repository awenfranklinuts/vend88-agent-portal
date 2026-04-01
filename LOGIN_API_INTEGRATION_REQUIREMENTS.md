## Overview

The Vend88 Agent Portal requires an enhanced authentication system supporting three user roles with different permission levels:

1. **Agent** - Limited access to their assigned businesses and customers
2. **Admin** - Full access to registration management, customer management, business management
3. **Super Admin** - Highest permission level with access to everything including admin management and system settings

---

## Current System Status

### Frontend Implementation
- Login page supports role switching (currently Admin/Agent toggle)
- Role stored in `sessionStorage` as `loginRole`
- Auth context manages token, role, and user email
- API proxy at `/api/login` forwards requests to backend

### Backend Integration Points
- **NEW Login Endpoint needed**: `POST /portal/auth/login` (role-based authentication)
- Previous endpoint (`/admin/login`) should NOT be used as it serves other purposes
- Frontend API proxy at `/api/login` will forward requests to backend
- This creates a separate auth module (`/portal/auth/`) to avoid conflicts with existing APIs

**Important:** Do NOT modify existing `/admin/*` endpoints as they are used for admin management functionality.

---

## Required API Changes

### 1. Login Endpoint Enhancement

**Endpoint:** `POST /portal/auth/login` (Create NEW endpoint - do NOT use existing `/admin/login`)

#### Request
```json
POST /portal/auth/login

{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"  // NEW: "admin", "agent", or "super_admin"
}
```

#### Response (Success - 200)
```json
{
  "status_code": 200,
  "status_msg": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_001",
    "email": "user@example.com",
    "role": "admin",  // IMPORTANT: Must return the role
    "first_name": "John",
    "last_name": "Doe",
    "status": "active"
  },
  "session_timeout": 3600,  // seconds
  "permissions": [           // NEW: Role-based permissions
    "view_registrations",
    "manage_customers",
    "manage_admins"
  ]
}
```

#### Response (Error - 401/403)
```json
{
  "status_code": 401,
  "status_msg": "unauthorized",
  "message": "Invalid credentials or role not assigned to this user"
}
```

---

## Role Definitions & Permissions

### Agent Role
**Permissions:**
- View own registrations
- View own customers
- View own businesses
- Submit registrations
- Update own profile

**API Access:**
- `/api/registrations` - List only own registrations
- `/api/customers` - List only own customers
- `/api/businesses` - List only own businesses
- `/api/profile` - Own profile management

---

### Admin Role
**Permissions:**
- View all registrations
- Manage all customers
- Manage all businesses
- Approve/reject registrations
- Create new agents
- Update customer information
- View reports
- Manage form configurations

**API Access:**
- `/api/registrations` - Full access
- `/api/customers` - Full access
- `/api/businesses` - Full access
- `/api/reports` - Full access
- `/api/forms/*` - Full access

---

### Super Admin Role (NEW)
**Permissions:**
- All Admin permissions PLUS:
- Manage admin accounts and assignments
- System configuration and settings
- User role management
- System audit logs
- Database administration
- API key management
- System health and monitoring

**API Access:**
- ALL endpoints - Full access
- `/api/admin/management` - Full access
- `/api/admin/settings` - Full access
- `/api/audit/logs` - Full access
- `/api/system/*` - Full access

---

## User Role Assignment

### Database Schema Requirement

```typescript
// Users/Admins table should include:
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  first_name: string,
  last_name: string,
  role: "agent" | "admin" | "super_admin",  // NEW: Three-tier system
  role_assigned_at: DateTime,
  role_assigned_by: ObjectId,  // Reference to admin who assigned
  assigned_businesses: ObjectId[],  // For agents only
  status: "active" | "inactive" | "suspended",
  created_at: DateTime,
  updated_at: DateTime,
  metadata: {
    last_login: DateTime,
    login_attempts: number,
    locked_until: DateTime (if applicable)
  }
}
```


## API Response Examples

### Successful Super Admin Login
```json
{
  "status_code": 200,
  "status_msg": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAwMSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbkB2ZW5kODguY29tIn0.signature",
  "user": {
    "_id": "user_001",
    "email": "superadmin@vend88.com",
    "role": "super_admin",
    "first_name": "Super",
    "last_name": "Admin",
    "status": "active"
  },
  "session_timeout": 3600,
  "permissions": [
    "view_registrations",
    "manage_registrations",
    "view_customers",
    "manage_customers",
    "view_businesses",
    "manage_businesses",
    "manage_admins",
    "manage_system_settings",
    "view_audit_logs",
    "manage_forms"
  ]
}
```

### Agent Login Without Role Access
```json
{
  "status_code": 401,
  "status_msg": "unauthorized",
  "message": "Agent role not assigned to this user. Contact administrator.",
  "user_email": "agent@example.com"
}
```


