# Generate Registration Form API Specification

## Overview
This document specifies the API endpoint needed for the "Generate New Form" functionality in the Vend88 Agent Portal Registration Management system.

---

## Base URL
```
https://prod.vend88.com
```

---

## Authentication
All requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <admin_token>
```

---

## API Endpoint

### Generate Registration Token

**Endpoint:** `POST /registration/generate`

**Description:** 
Admin generates a unique one-time registration token and link to send to a customer. This token will be used by the customer to fill out the onboarding registration form.

**Purpose:**
- Create a secure, unique token for each new registration
- Generate a shareable link that customers can use to access the registration form
- Track which admin created the token
- Set expiration for the token (optional)

---

### Request

**HTTP Method:** `POST`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "admin_email": "admin@vend88.com"
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `admin_email` | string | Yes | Email address of the admin generating the token |

**Example Request:**
```bash
curl -X POST https://prod.vend88.com/registration/generate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "admin_email": "admin@vend88.com"
  }'
```

---

### Response

**Success Response (200 OK):**
```json
{
  "status_code": 200,
  "success": true,
  "message": "Registration token generated successfully",
  "data": {
    "id": "reg_123456789",
    "token": "abc123xyz456def789ghi012jkl345mno678",
    "link": "https://form.vend88.com/register?token=abc123xyz456def789ghi012jkl345mno678",
    "generated_by": "admin@vend88.com",
    "generated_at": "2025-11-21T03:30:00Z",
    "expires_at": "2025-12-21T03:30:00Z",
    "status": "pending"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status_code` | number | HTTP status code (200 for success) |
| `success` | boolean | Whether the operation was successful |
| `message` | string | Human-readable success message |
| `data` | object | Registration token data |
| `data.id` | string | Unique registration ID (for internal tracking) |
| `data.token` | string | Unique registration token (32-40 characters) |
| `data.link` | string | Complete shareable URL for the registration form |
| `data.generated_by` | string | Email of the admin who generated the token |
| `data.generated_at` | string | ISO 8601 timestamp when token was created |
| `data.expires_at` | string | ISO 8601 timestamp when token expires (30 days from creation) |
| `data.status` | string | Current status of the registration (always "pending" when first generated) |

---

### Error Responses

**Unauthorized (401):**
```json
{
  "status_code": 401,
  "success": false,
  "error": "Unauthorized access",
  "message": "Invalid or missing authentication token"
}
```

**Forbidden (403):**
```json
{
  "status_code": 403,
  "success": false,
  "error": "Forbidden",
  "message": "You do not have permission to generate registration tokens"
}
```

**Bad Request (400):**
```json
{
  "status_code": 400,
  "success": false,
  "error": "Invalid request",
  "message": "admin_email is required"
}
```

**Internal Server Error (500):**
```json
{
  "status_code": 500,
  "success": false,
  "error": "Internal server error",
  "message": "Failed to generate registration token. Please try again."
}
```

---

## Business Logic Requirements

### Token Generation
1. **Unique Token:** Each token must be globally unique across all registrations
2. **Token Format:** 
   - Length: 32-40 characters
   - Characters: Alphanumeric (a-z, A-Z, 0-9)
   - Should be cryptographically secure (use secure random generation)
   - Example: `abc123xyz456def789ghi012jkl345mno678`

3. **Token Expiration:**
   - Default expiration: 30 days from generation
   - After expiration, token should not be valid for form submission
   - Status should change to "expired" automatically

### Database Storage
When a token is generated, store the following in the database:

```sql
CREATE TABLE registrations (
  id VARCHAR(50) PRIMARY KEY,
  token VARCHAR(50) UNIQUE NOT NULL,
  generated_by VARCHAR(255) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  
  -- Customer filled data (initially NULL)
  contact_email VARCHAR(255),
  owner_name VARCHAR(255),
  contact_phone VARCHAR(50),
  messaging_app_type VARCHAR(20),
  messaging_app_id VARCHAR(100),
  quote_number VARCHAR(100),
  business_name VARCHAR(255),
  abn VARCHAR(20),
  registered_address TEXT,
  registered_suburb VARCHAR(100),
  registered_postcode VARCHAR(20),
  registered_state VARCHAR(20),
  registered_country VARCHAR(100),
  eftpos_integration VARCHAR(10),
  alipay_option VARCHAR(50),
  alipay_other TEXT,
  ready_by VARCHAR(100),
  heard_about VARCHAR(50),
  heard_other TEXT,
  menu_files JSON,
  menu_send_later BOOLEAN,
  notes TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Audit trail
  approved_by VARCHAR(255),
  rejected_by VARCHAR(255),
  rejection_reason TEXT,
  cancelled_by VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_token (token),
  INDEX idx_status (status),
  INDEX idx_generated_by (generated_by),
  INDEX idx_generated_at (generated_at)
);
```

### Initial Record
When a token is generated, create a database record with:
- `id`: Auto-generated unique ID
- `token`: Generated secure random token
- `generated_by`: Admin email from request
- `generated_at`: Current timestamp
- `expires_at`: Current timestamp + 30 days
- `status`: "pending"
- All other fields: NULL (will be filled when customer submits the form)

---

## Frontend Integration

### Current Implementation Location
**File:** `agent-portal-website/app/admin/registrations/page.tsx`

**Function:** `handleGenerateForm()` (line ~867)

### Integration Steps

1. **Import axios and API config:**
```typescript
import axios from 'axios';
import { getApiUrl, API_CONFIG } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
```

2. **Update the handleGenerateForm function:**
```typescript
const handleGenerateForm = async () => {
  setIsGenerating(true);
  try {
    const response = await axios.post(
      getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_GENERATE),
      { 
        admin_email: userEmail  // From AuthContext
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // From AuthContext
        },
      }
    );
    
    if (response.data.success && response.data.data) {
      setGeneratedLink(response.data.data.link);
      setShowGenerateModal(true);
      // Refresh the registration list
      fetchRegistrationData();
    } else {
      alert(response.data.error || 'Failed to generate form');
    }
  } catch (error: any) {
    console.error('Failed to generate form:', error);
    const errorMessage = error.response?.data?.message || 'Failed to generate form. Please try again.';
    alert(errorMessage);
  } finally {
    setIsGenerating(false);
  }
};
```

3. **Expected Frontend Behavior:**
   - Admin clicks "Generate New Form" button
   - Loading state shows (button disabled with spinner)
   - API call made with admin's email and auth token
   - On success: Modal displays with the generated link
   - Modal includes "Copy Link" button for easy sharing
   - Registration list refreshes to show new pending registration
   - On error: Alert shown with error message

---

## Testing

### Manual Testing Steps

1. **Test successful generation:**
   ```bash
   POST /registration/generate
   Body: { "admin_email": "test@vend88.com" }
   Headers: Valid Bearer token
   
   Expected: 200 OK with token and link
   ```

2. **Test unauthorized access:**
   ```bash
   POST /registration/generate
   Body: { "admin_email": "test@vend88.com" }
   Headers: No Authorization header
   
   Expected: 401 Unauthorized
   ```

3. **Test missing admin_email:**
   ```bash
   POST /registration/generate
   Body: {}
   Headers: Valid Bearer token
   
   Expected: 400 Bad Request
   ```

4. **Test token uniqueness:**
   - Generate multiple tokens
   - Verify each token is unique
   - Check database for no duplicate tokens

5. **Test expiration date:**
   - Generate token
   - Verify expires_at is exactly 30 days after generated_at

### Frontend Testing Checklist

- [ ] Button shows loading state when clicked
- [ ] Button is disabled during API call
- [ ] Modal displays with generated link on success
- [ ] Copy button copies link to clipboard
- [ ] Registration list refreshes after generation
- [ ] New pending registration appears at top of list
- [ ] Error messages display properly
- [ ] Network errors handled gracefully

---

## Security Considerations

1. **Token Security:**
   - Use cryptographically secure random generation (e.g., `crypto.randomBytes()` in Node.js)
   - Tokens should be unpredictable and not sequential
   - Store tokens hashed in database (optional but recommended)

2. **Authorization:**
   - Verify Bearer token is valid and not expired
   - Verify user has admin role
   - Log all token generation attempts for audit trail

3. **Rate Limiting:**
   - Implement rate limiting to prevent abuse (e.g., max 100 tokens per admin per day)
   - Return 429 Too Many Requests if limit exceeded

4. **Expiration:**
   - Automatically mark tokens as expired after 30 days
   - Reject any form submissions with expired tokens

---

## Implementation Priority

**Priority:** HIGH (Core functionality blocking customer onboarding)

**Estimated Backend Development Time:** 2-4 hours

**Dependencies:**
- Database table `registrations` must be created
- Admin authentication middleware must be in place
- Token generation utility function needed

---

## Support & Questions

For questions or clarifications about this API specification, contact:
- Frontend Team: [Your Email]
- Backend Team: [Backend Developer Email]

**Last Updated:** November 21, 2025
