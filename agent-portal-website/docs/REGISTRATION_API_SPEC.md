# Registration Management API Specification

## Deployment URLs
- **Backend API**: `https://dev.vend88.com` (Development Environment)
- **Admin Portal**: `https://portal.vend88.com`
- **Registration Form**: `https://form.vend88.com`

**Note**: Currently using development environment (dev.vend88.com) for all backend API calls.

## Authentication
All admin endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <admin_token>
```

## Frontend API Proxy
The admin portal uses Next.js API routes as a proxy to avoid CORS issues:
- Frontend calls: `/api/registration/*`
- Proxied to: `https://dev.vend88.com/registration/*`

**Current Configuration**: All API endpoints route through dev.vend88.com for testing and development.

---

## 1. Generate Registration Token

**Endpoint:** `POST /registration/generate`

**Description:** Admin generates a unique **one-time-use** registration token/link to send to a customer. **Once submitted, the token cannot be used again.**

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
  "admin_email": "admin@vend88.com",
  "notes": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "reg_123456",
    "token": "abc123xyz456",
    "link": "https://form.vend88.com?token=abc123xyz456",
    "generated_by": "admin@vend88.com",
    "generated_at": "2025-11-20T10:30:00Z",
    "expires_at": "2025-12-20T10:30:00Z",
    "status": "pending"
  }
}
```

**Note:** The link format is `https://form.vend88.com?token=xxx` (no `/register` path) to avoid redirect issues.
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

---

## 2. List Registration Submissions

**Endpoint:** `GET /registration/list`

**Description:** Retrieve all registration submissions with filtering options.

**Query Parameters:**
- `status` (optional): `pending|submitted|approved|rejected|expired|all`
- `state` (optional): Filter by Australian state (NSW, VIC, QLD, WA, SA, TAS, ACT, NT)
- `search` (optional): Search by business name, email, contact name, phone, or ABN
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): `created_asc|created_desc` (default: created_desc)

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "id": "reg_123456",
        "token": "abc123xyz456",
        "generated_by": "admin@vend88.com",
        "generated_at": "2025-11-20T10:30:00Z",
        "status": "submitted",
        "contact_email": "owner@coffeeshop.com",
        "business_name": "Coffee Shop Downtown",
        "submitted_at": "2025-11-20T14:45:00Z",
        "linked_customer_id": "cust_123456"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "total_pages": 5
    }
  }
}
```

---

## 3. Get Registration Details

**Endpoint:** `GET /registration/:id`

**Description:** Retrieve full details of a specific registration submission.

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "reg_123456",
    "token": "abc123xyz456",
    "generated_by": "admin@vend88.com",
    "generated_at": "2025-11-20T10:30:00Z",
    "status": "submitted",
    "linked_customer_id": "cust_123456",
    
    "contact_email": "owner@coffeeshop.com",
    "owner_name": "John Smith",
    "contact_phone": "0412 345 678",
    "messaging_app_type": "wechat",
    "messaging_app_id": "johnsmith88",
    
    "quote_number": "INV-2024-001234",
    "business_name": "Coffee Shop Downtown",
    "abn": "12345678901",
    
    "registered_address": "123 Main Street",
    "registered_suburb": "Sydney",
    "registered_postcode": "2000",
    "registered_state": "NSW",
    "registered_country": "Australia",
    
    "eftpos_integration": "yes",
    "alipay_option": "superpay",
    "alipay_other": null,
    
    "ready_by": "End of December 2025",
    "heard_about": "friend",
    "heard_other": null,
    "menu_files": [
      {
        "filename": "menu-english.pdf",
        "url": "https://storage.vend88.com/registrations/reg_123456/menu-english.pdf",
        "size": 245000,
        "uploaded_at": "2025-11-20T14:30:00Z"
      },
      {
        "filename": "menu-chinese.pdf",
        "url": "https://storage.vend88.com/registrations/reg_123456/menu-chinese.pdf",
        "size": 312000,
        "uploaded_at": "2025-11-20T14:31:00Z"
      }
    ],
    "menu_send_later": false,
    "notes": "Looking to expand POS system to handle peak hours better.",
    
    "submitted_at": "2025-11-20T14:45:00Z",
    "approved_at": null,
    "approved_by": null,
    "rejected_at": null,
    "rejected_by": null,
    "rejection_reason": null
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Registration not found"
}
```

---

## 4. Update Registration Details

**Endpoint:** `PUT /registration/:id`

**Description:** Update registration details (admin can edit submitted information).

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
  "contact_email": "updated@email.com",
  "owner_name": "Updated Name",
  "contact_phone": "0412 999 888",
  "business_name": "Updated Business Name",
  "notes": "Updated notes",
  "linked_customer_id": "cust_123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "reg_123456",
    "updated_at": "2025-11-20T15:00:00Z",
    "updated_by": "admin@vend88.com"
  }
}
```

---

## 5. Link Customer to Registration

**Endpoint:** `PUT /registration/:id/link-customer`

**Description:** Link an existing customer or create a new customer for a registration. This must be done before approval.

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body (Link Existing Customer):**
```json
{
  "customer_id": "cust_123456"
}
```

**Request Body (Create New Customer):**
```json
{
  "create_new": true,
  "customer_data": {
    "name": "John Smith",
    "email": "owner@coffeeshop.com",
    "phone": "0412 345 678"
  }
}
```

**Response (200 OK - Existing Customer):**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "linked_customer_id": "cust_123456",
    "customer_name": "John Smith",
    "linked_at": "2025-11-20T15:30:00Z"
  }
}
```

**Response (200 OK - New Customer Created):**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "linked_customer_id": "cust_789012",
    "customer_name": "John Smith",
    "customer_created": true,
    "linked_at": "2025-11-20T15:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Customer ID is required when create_new is false"
}
```

---

## 6. Approve Registration

**Endpoint:** `POST /registration/approve/:id`

**Description:** Approve a submitted registration and create business account. **Customer must be linked before approval.**

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body (optional):**
```json
{
  "approval_notes": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "business_id": "biz_789012",
    "status": "approved",
    "approved_at": "2025-11-20T16:00:00Z",
    "approved_by": "admin@vend88.com"
  }
}
```

**Error Response (400 Bad Request - Not Submitted):**
```json
{
  "success": false,
  "error": "Registration is not in submitted status"
}
```

**Error Response (400 Bad Request - No Customer Linked):**
```json
{
  "success": false,
  "error": "Customer must be linked before approval"
}
```

---

## 7. Reject Registration

**Endpoint:** `POST /registration/reject/:id`

**Description:** Reject a submitted registration with optional reason.

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
  "reason": "Incomplete documentation" 
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "status": "rejected",
    "rejected_at": "2025-11-20T16:00:00Z",
    "rejected_by": "admin@vend88.com",
    "rejection_reason": "Incomplete documentation"
  }
}
```

---

## 8. Revoke Registration

**Endpoint:** `POST /registration/revoke/:id`

**Description:** Revoke a pending registration link that hasn't been submitted yet. This invalidates the token and changes status to 'cancelled' or 'expired'. Only applies to registrations with status 'pending'.

**Request Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body (optional):**
```json
{
  "reason": "Customer no longer interested (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "status": "cancelled",
    "revoked_at": "2025-11-20T16:30:00Z",
    "revoked_by": "admin@vend88.com",
    "revoke_reason": "Customer no longer interested"
  }
}
```

**Error Response (400 Bad Request - Not Pending):**
```json
{
  "success": false,
  "error": "Can only revoke registrations with pending status"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Registration not found"
}
```

---

## 9. Submit Registration Form (Public Endpoint)

**Endpoint:** `POST /registration/submit`

**Description:** Customer submits registration form using the token provided by admin.

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "abc123xyz456",
  
  "contact_email": "owner@coffeeshop.com",
  "owner_name": "John Smith",
  "contact_phone": "0412 345 678",
  "messaging_app_type": "wechat",
  "messaging_app_id": "johnsmith88",
  
  "quote_number": "INV-2024-001234",
  "business_name": "Coffee Shop Downtown",
  "abn": "12345678901",
  
  "registered_address": "123 Main Street",
  "registered_suburb": "Sydney",
  "registered_postcode": "2000",
  "registered_state": "NSW",
  "registered_country": "Australia",
  
  "eftpos_integration": "yes",
  "alipay_option": "superpay",
  "alipay_other": null,
  
  "ready_by": "End of December 2025",
  "heard_about": "friend",
  "heard_other": null,
  "menu_files": [
    {
      "filename": "menu-english.pdf",
      "content": "base64_encoded_file_content",
      "mime_type": "application/pdf"
    }
  ],
  "menu_send_later": false,
  "notes": "Additional notes"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_id": "reg_123456",
    "status": "submitted",
    "submitted_at": "2025-11-20T14:45:00Z",
    "message": "Your registration has been submitted successfully. We will review and contact you soon."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": "Token has already been used"
}
```

---

## 10. Validate Registration Token (Public Endpoint)

**Endpoint:** `GET /registration/validate-token/:token`

**Description:** Check if a registration token is valid and **not already used** before showing the form. This prevents duplicate submissions with the same token.

**Response (200 OK - Valid Token):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "expired": false,
    "used": false,
    "expires_at": "2025-12-20T10:30:00Z"
  }
}
```

**Response (200 OK - Invalid Token):**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "expired": true,
    "used": false,
    "reason": "Token has expired"
  }
}
```

**Response (200 OK - Used Token):**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "expired": false,
    "used": true,
    "reason": "This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes."
  }
}
```

---

## Status Flow

```
pending → submitted → approved/rejected
   ↓          ↓
expired    expired
```

### Status Definitions:
- **pending**: Token generated, form not yet filled
- **submitted**: Customer submitted the form, awaiting admin review
- **approved**: Admin approved, business account created
- **rejected**: Admin rejected the application
- **expired**: Token expired before submission

---

## Database Schema Recommendation

### Table: `registration_tokens`
```sql
CREATE TABLE registration_tokens (
  id VARCHAR(50) PRIMARY KEY,
  token VARCHAR(100) UNIQUE NOT NULL,
  generated_by VARCHAR(255) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status ENUM('pending', 'submitted', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  linked_customer_id VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: `registration_submissions`
```sql
CREATE TABLE registration_submissions (
  id VARCHAR(50) PRIMARY KEY,
  token_id VARCHAR(50) NOT NULL,
  
  -- Contact Information
  contact_email VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  messaging_app_type VARCHAR(20),
  messaging_app_id VARCHAR(100),
  
  -- Business Information
  quote_number VARCHAR(100),
  business_name VARCHAR(255) NOT NULL,
  abn VARCHAR(11),
  
  -- Address
  registered_address VARCHAR(500),
  registered_suburb VARCHAR(100),
  registered_postcode VARCHAR(10),
  registered_state VARCHAR(50),
  registered_country VARCHAR(100),
  
  -- Payment & Integration
  eftpos_integration ENUM('yes', 'no'),
  alipay_option VARCHAR(50),
  alipay_other VARCHAR(255),
  
  -- Additional Information
  ready_by TEXT,
  heard_about VARCHAR(50),
  heard_other VARCHAR(255),
  menu_files JSON,
  menu_send_later BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Timestamps and Audit
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by VARCHAR(255),
  rejected_at TIMESTAMP,
  rejected_by VARCHAR(255),
  rejection_reason TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (token_id) REFERENCES registration_tokens(id)
);
```

---

## Implementation Status

### Phase 1 (MVP) - ✅ COMPLETED:
1. ✅ Generate Token (`POST /registration/generate`)
2. ✅ Submit Form (`POST /registration/submit`)
3. ✅ Validate Token (`GET /registration/validate-token/:token`)
4. ✅ List Registrations (`GET /registration/list`)
5. ✅ **Link Customer** (`PUT /registration/:id/link-customer`)
6. ✅ Approve/Reject (`POST /registration/approve/:id`, `POST /registration/reject/:id`)
7. ✅ Get Details (`GET /registration/:id`)
8. ✅ Update Details (`PUT /registration/:id`)
9. ✅ Revoke Link (`POST /registration/revoke/:id`) - Frontend implemented, awaiting backend

### Phase 2 (Enhanced) - ✅ COMPLETED:
1. ✅ Inline error handling (no alert popups)
2. ✅ Modal overlays for rejection/revoke confirmations
3. ✅ File upload handling for menu files
4. ✅ Admin portal UI with customer linking workflow
5. ✅ Registration form with file upload
6. ✅ Status filtering (all, pending, submitted, approved, rejected, expired, revoked)
7. ✅ Date range filtering
8. ✅ Search by business name, owner, email, ABN
9. ✅ Sorting (by date, status, business name)
10. ✅ Pagination with smart page controls
11. ✅ Statistics cards (total, pending, submitted, approved, rejected, expired)
12. ✅ Copy link to clipboard with success feedback
13. ✅ View full form details in modal
14. ✅ Revoke link with modal confirmation (no browser alerts)
15. ✅ Dark/Light theme system with persistence
16. ✅ Theme toggle in header with moon/sun icons
17. ✅ Auto-refresh table (30s interval, smart update on changes only)
18. ✅ Generated column shows date and admin full name
19. ✅ Admin name extraction from email profile (first_name + last_name)
20. ✅ Messaging app fields (WhatsApp/WeChat) in customer management
21. ✅ Field compatibility layer (snake_case backend ↔ camelCase frontend)
22. ✅ Comprehensive console logging for debugging
23. ✅ Skeleton loading states for better UX

### Phase 3 (TODO) - PENDING:
1. ⚠️ Email notifications on approval/rejection
2. 🔴 Resend email notification (`POST /registration/resend-email/:id`)
3. 🔴 Backend implementation of Revoke API endpoint (`POST /registration/revoke/:id`) - Spec ready, frontend implemented

---

## Customer Management Integration

### Current Implementation
The admin portal includes comprehensive customer management features integrated with the registration system:

**API Endpoints Used:**
- `POST /customer/list` - List all customers with business counts
- `POST /api/search/business` - Get businesses to calculate per-customer counts

**Features Implemented:**
- ✅ View toggle (grid/table)
- ✅ Statistics cards (total customers, total businesses, recent additions)
- ✅ Advanced search (name, ABN, address, email)
- ✅ Sorting (by name, date, business count)
- ✅ Pagination (12 items per page)
- ✅ Export to CSV (all or filtered data)
- ✅ Customer details modal with action buttons
- ✅ Email customer action
- ✅ Inline edit customer (frontend ready, API needed)
- ✅ Messaging app integration (WhatsApp/WeChat ID display)
- ✅ Messaging app icon with conditional rendering
- ✅ Theme support (dark/light mode)

**Missing API Endpoints:**
- 🔴 `PUT /customer/:id` - Update customer information
- 🔴 `DELETE /customer/:id` - Delete customer (soft delete recommended)
- 🔴 `POST /customer/search` - Advanced search with filters
- 🔴 `GET /customer/:id/businesses` - Get all businesses for a customer

---

## Business Management Integration

### Current Implementation
The admin portal includes comprehensive business management features:

**API Endpoints Used:**
- `POST /api/search/business` - List all businesses with details
- `POST /customer/list` - Get customer names for owner display
- `POST /api/shop/get-permission` - Get business permissions
- `POST /api/shop/add-permission` - Add permission
- `POST /api/shop/update-permission` - Update permission
- `POST /api/shop/delete-permission` - Delete permission

**Features Implemented:**

**Business List Page:**
- ✅ View toggle (grid/table)
- ✅ Statistics cards (total, active, setup, inactive)
- ✅ Advanced search (ABN, address, owner name, date range)
- ✅ Sorting (by name, date, status)
- ✅ Pagination (12 items per page)
- ✅ Bulk selection and export
- ✅ Business details modal
- ✅ Status change with confirmation modal
- ✅ Export to CSV with owner information
- ✅ Display business name and suburb prominently

**Business Details Page:**
- ✅ Business name and location prominently displayed at top
- ✅ Statistics cards (active devices, permissions, days active, status)
- ✅ Tab-based organization (Overview, Devices, Permissions, Activity, Notes)
- ✅ Quick actions bar (Edit, Export CSV/PDF, Contact Owner)
- ✅ Edit mode for business information with inline editing
- ✅ Owner information card with customer details
- ✅ Complete business information display (editable)
- ✅ Address and contact information sections
- ✅ Device management UI (display, add, edit, delete)
- ✅ Permission management (full CRUD operations)
- ✅ Activity log timeline with icons
- ✅ Notes section (add and view notes)
- ✅ Registration details link
- ✅ Export functionality (CSV with all data)

**Missing API Endpoints:**
- 🔴 `PUT /api/business/:id` - Update business information
- 🔴 `PUT /api/business/:id/status` - Update business status
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

## Implementation Notes

### Backend Requirements

1. **Token Generation**: 
   - Use cryptographically secure random strings (at least 32 characters)
   - Format: Alphanumeric string (e.g., `XF5JzQVN5PLcecRhOQLqg6u4t7omb2Mq`)

2. **Token Expiry**: 
   - Default: 30-day expiry from generation
   - Check expiry on both validation and submission

3. **⚠️ One-Time Use Enforcement**: 
   - Once a form is submitted (status changes to 'submitted'), the token MUST reject any subsequent submission attempts
   - Validation endpoint should return `used: true` for any token with status 'submitted', 'approved', or 'rejected'
   - Frontend redirects to main website when token is already used

4. **⚠️ Customer Linking (MANDATORY)**: 
   - Admin MUST link a customer before approving any registration
   - Frontend validates customer linking before allowing approval
   - Two workflows implemented:
     
     **a) Link Existing Customer**:
     - Admin searches customer by name or email in dropdown
     - Selects from existing customer list
     - `linked_customer_id` is set to actual customer ID
     
     **b) Create New Customer**:
     - Admin clicks "Create New" button
     - System generates temporary customer ID with prefix `temp_` (e.g., `temp_1700000000000`)
     - Pending customer data stored in session storage
     - Upon approval:
       * Create new customer account using registration contact info
       * Update `linked_customer_id` with real customer ID
       * Clear pending customer data from session storage
   
   - Frontend behavior:
     * Shows inline error message if approve clicked without customer link
     * Error automatically clears when customer is linked
     * No alert popups - all errors shown inline at bottom of form

5. **File Upload**: 
   - Storage: S3, Azure Blob Storage, or similar cloud storage
   - Path structure: `registrations/{registration_id}/{filename}`
   - Return downloadable URLs with expiry tokens for security
   - Supported formats: PDF, PNG, JPG, JPEG
   - Max file size: 10MB per file
   - Multiple files supported
   - Store metadata: 
     * filename
     * url (downloadable with authentication)
     * size (in bytes)
     * uploaded_at timestamp

6. **Email Notifications**: 
   - Send email to customer when registration is approved/rejected
   - Include reason if rejected
   - Email template should match vend88 branding

7. **Business Account Creation**: 
   - On approval, automatically create business account with data from registration
   - Link to the customer account
   - Copy all relevant business information

8. **Audit Trail**: 
   - Log all admin actions with timestamps:
     * Token generation (generated_by, generated_at)
     * Customer linking (linked_at, linked_by)
     * Approval (approved_by, approved_at)
     * Rejection (rejected_by, rejected_at, rejection_reason)
     * Updates (updated_by, updated_at)

9. **Rate Limiting**: 
   - Apply rate limiting on public endpoints to prevent abuse
   - Suggested limits:
     * Token validation: 10 requests/minute per IP
     * Form submission: 3 requests/hour per token

10. **Input Validation**: 
    - ABN format: 11 digits
    - Australian phone numbers: Format 04XX XXX XXX
    - Email addresses: RFC 5322 compliant
    - State: NSW, VIC, QLD, WA, SA, TAS, ACT, NT
    - Postcode: 4 digits (Australian)

### Frontend Implementation Notes

1. **Admin Portal (portal.vend88.com)**:
   - Built with Next.js 15, React 19, TypeScript
   - Uses Next.js API routes as CORS proxy
   - All API calls go through `/api/registration/*` routes
   - No alert() popups - all feedback via inline messages or modals
   - Copy link button shows success state (checkmark + green background)
   - Rejection reason via modal overlay (not popup)
   - Error messages appear inline at bottom of form
   - Customer search with real-time filtering
   - Generated by admin displayed as formatted name (not email)

2. **Registration Form (form.vend88.com)**:
   - Built with Next.js 16, deployed on S3+CloudFront
   - Static export with client-side routing
   - Token validation on page load
   - Redirects to vend88.com.au if token invalid/used
   - Gradient background loads immediately (no flash)
   - File upload with preview
   - Form validation before submission
   - Thank you page after successful submission

3. **UI/UX Guidelines**:
   - No `alert()`, `confirm()`, or `prompt()` dialogs
   - Use inline error messages with warning icon
   - Modal overlays for destructive actions (reject, revoke, status change)
   - Success states on buttons (e.g., "Copied!" with checkmark)
   - Auto-clear errors when user fixes the issue
   - Loading states on async operations
   - Responsive design for mobile/tablet
   - Theme persistence across sessions
   - Smooth color transitions on theme changes

4. **Registration Table Auto-Refresh**:
   - Polls backend every 30 seconds for updates
   - Smart update logic: only refreshes UI if submitted or pending counts change
   - Prevents unnecessary re-renders when no data changes
   - Console logging for debugging auto-refresh behavior
   - Tracks previous counts to detect changes
   - Manual refresh always updates (bypasses smart logic)

5. **Admin Display Features**:
   - Generated column shows formatted date and admin full name
   - Admin names extracted from email profile (first_name + last_name)
   - Fallback to formatted email if profile not available
   - Format: "By John Smith" instead of email address
   - Name caching for performance optimization
   - Business name and suburb displayed prominently in all views
   - Professional card layouts with hover effects
   - Smooth transitions and animations
   - Icon integration for better visual hierarchy
   - Toast notifications for success/error feedback
   - Skeleton loading states for better perceived performance
   - Advanced search panels with collapsible sections
   - Bulk action bars for multi-select operations
   - Export buttons with download icons
   - Pagination with smart ellipsis (1, 2, 3, ..., 10)
   - View toggles (grid/table) with persistent state
   - Sortable table headers with direction indicators
   - Status badges with color coding
   - Action buttons grouped logically
   - Modal close on backdrop click
   - Form validation with inline error display
   - Theme-aware component styling
   - Dark mode with carefully selected color palette
   - Light mode with clean, professional appearance

---

## Deployment Information

## Admin Portal Features Summary

### Pages Implemented

1. **Dashboard** - Overview statistics and quick actions
2. **Customers** - Full customer management with search, filter, export
3. **Businesses** - Comprehensive business management
4. **Business Details** - Detailed view with tabs (Overview, Devices, Permissions, Activity, Notes)
5. **Registrations** - Registration form management with approval workflow
6. **Admins** - Admin user management
7. **Agents** - Agent management (future feature)
8. **Settings** - System settings and preferences

### Common Features Across All Pages

- ✅ Bilingual support (English/Chinese)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional UI with styled-components
- ✅ Toast notifications for user feedback
- ✅ Loading states and skeleton screens
- ✅ Error handling with inline messages
- ✅ Authentication with role-based access
- ✅ Sidebar navigation with active state
- ✅ Header with language toggle and user menu
- ✅ Dark/Light theme system with localStorage persistence
- ✅ Theme toggle button with animated icons (moon/sun)
- ✅ CSS variables for consistent theming across app
- ✅ Smooth transitions on theme changes
- ✅ Modal patterns for confirmations
- ✅ Export functionality (CSV)
- ✅ Search and filter capabilities
- ✅ Pagination with smart controls
- ✅ Sorting with direction toggle
- ✅ View modes (grid/table where applicable)
- ✅ Statistics cards with real-time data
- ✅ Action buttons with icons
- ✅ Status badges with color coding
- ✅ Copy to clipboard functionality
- ✅ Email integration (mailto links)
- ✅ Date formatting (relative and absolute)
- ✅ Empty states with helpful messages
- ✅ Form validation

---

## Deployment Information

### Current Deployment

**Admin Portal (portal.vend88.com)**:
- Platform: Vercel (Free tier)
- Auto-deploy: GitHub push to main branch
- Repository: `awenfranklinuts/vend88-agent-portal`
- Root directory: `agent-portal-website/`
- Build time: 1-3 minutes
- Environment variables configured in Vercel dashboard:
  * `NEXT_PUBLIC_API_BASE_URL=https://prod.vend88.com`
  * `NEXT_PUBLIC_APP_NAME`
  * `NEXT_PUBLIC_DEFAULT_LANGUAGE`

**Registration Form (form.vend88.com)**:
- Platform: AWS S3 + CloudFront
- Distribution ID: E3UHMUQXQ9GH4M
- Deployment: Manual via AWS CLI
- Build command: `npm run build` (creates `out/` folder)
- Deploy command: 
  ```bash
  aws s3 sync out/ s3://onboarding-registration-form --delete
  aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
  ```
- Cache invalidation time: 2-5 minutes

### Update Workflow

**Admin Portal Updates**:
```bash
cd d:\Github\vend88-agent-portal\agent-portal-website
git add .
git commit -m "Update description"
git push origin main
# Vercel auto-deploys in 1-3 minutes
```

**Registration Form Updates**:
```bash
cd d:\Github\vend88-agent-portal\onboarding-registration-form
npm run build
aws s3 sync out/ s3://onboarding-registration-form --delete
aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
# Wait 2-5 minutes for cache invalidation
```

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## API Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**Error Response with Details:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "abn": "ABN must be 11 digits",
    "contact_phone": "Invalid phone number format"
  }
}
```
