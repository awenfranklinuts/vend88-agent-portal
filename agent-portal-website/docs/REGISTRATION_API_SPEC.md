# Registration Management API Specification

## Base URL
```
https://prod.vend88.com
```

## Authentication
All admin endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <admin_token>
```

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
  "admin_id": "string",
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
    "link": "https://form.vend88.com/register?token=abc123xyz456",
    "generated_by": "admin@vend88.com",
    "generated_at": "2025-11-20T10:30:00Z",
    "expires_at": "2025-12-20T10:30:00Z",
    "status": "pending"
  }
}
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

## 8. Submit Registration Form (Public Endpoint)

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

## 9. Validate Registration Token (Public Endpoint)

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

## Implementation Priority

### Phase 1 (MVP):
1. ✅ Generate Token (`POST /registration/generate`)
2. ✅ Submit Form (`POST /registration/submit`)
3. ✅ Validate Token (`GET /registration/validate-token/:token`)
4. ✅ List Registrations (`GET /registration/list`)
5. ⚠️ **Link Customer** (`PUT /registration/:id/link-customer`) - **REQUIRED BEFORE APPROVAL**
6. ✅ Approve/Reject (`POST /registration/approve/:id`, `POST /registration/reject/:id`)

### Phase 2 (Enhanced):
6. Get Details (`GET /registration/:id`)
7. Update Details (`PUT /registration/:id`)
8. Email notifications on approval/rejection
9. File upload handling for menu files

---

## Notes for Backend Development

1. **Token Generation**: Use cryptographically secure random strings (at least 32 characters)
2. **Token Expiry**: Recommend 30-day expiry from generation
3. **⚠️ One-Time Use Enforcement**: Once a form is submitted (status changes to 'submitted'), the token MUST reject any subsequent submission attempts. Validation should return `used: true` for any token with status 'submitted', 'approved', or 'rejected'.
4. **⚠️ Customer Linking (MANDATORY)**: 
   - Admin MUST link a customer before approving any registration
   - Frontend validates customer linking before allowing approval
   - Two workflows:
     a) **Link Existing Customer**: Admin selects from existing customer dropdown
     b) **Create New Customer**: System generates temporary customer ID (prefix: `temp_`) and stores pending customer data. Upon approval, create real customer account and replace temp ID with actual customer ID
   - `linked_customer_id` field must be populated before status changes to 'approved'
   - Temporary customer format: `temp_{timestamp}` (e.g., `temp_1700000000000`)
   - When approving registration with temp customer ID:
     - Create new customer account using registration contact info
     - Update `linked_customer_id` with real customer ID
     - Clear pending customer data from session storage
5. **File Upload**: 
   - Use S3, Azure Blob Storage, or similar for menu files
   - Store files in path: `registrations/{registration_id}/{filename}`
   - Return downloadable URLs with expiry tokens for security
   - Support formats: PDF, PNG, JPG, JPEG (max 10MB per file)
   - Store metadata: filename, URL, size, upload timestamp
4. **Email Notifications**: Send email to customer when approved/rejected
5. **Business Account Creation**: On approval, automatically create business account with data from registration
6. **Audit Trail**: Log all admin actions (approve, reject, edit)
7. **Rate Limiting**: Apply rate limiting on public endpoints to prevent abuse
8. **Input Validation**: Validate ABN format, Australian phone numbers, email addresses
