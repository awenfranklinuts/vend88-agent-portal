# Registration Management Integration Guide

## Overview
The registration management system is currently using **mock APIs** for development. This allows frontend development to proceed while backend APIs are being developed.

## Current Status

### ✅ Completed
- Registration management UI with tabs (Pending, Submitted, All)
- Details modal with full registration information (800px wide)
- Edit functionality for registration data
- Search functionality (business name, email, contact, phone, ABN)
- State/territory filter dropdown
- Status timestamps display (generated, submitted, approved, rejected)
- Audit trail (approved by, rejected by)
- Rejection reason capture and display
- Downloadable menu files with metadata (filename, size, upload date)
- Mobile-responsive design
- API specification document (`docs/REGISTRATION_API_SPEC.md`)
- Mock API handlers (`lib/mockRegistrationApi.ts`) with 8 mock registrations
- Integration of mock APIs into UI

### 🔄 Using Mock Data
All registration operations currently use mock APIs:
- **Generate Form**: `MockAPI.generateRegistrationToken()`
- **List Registrations**: `MockAPI.fetchRegistrations()`
- **View Details**: `MockAPI.getRegistrationById()`
- **Edit Registration**: `MockAPI.updateRegistration()`
- **Approve**: `MockAPI.approveRegistration()`
- **Reject**: `MockAPI.rejectRegistration()`

### 🎯 Next Steps (Backend Development Needed)
Create 8 new API endpoints as specified in `docs/REGISTRATION_API_SPEC.md`:

1. **POST** `/registration/generate` - Generate registration token
2. **GET** `/registration/list` - List all registrations with filters
3. **GET** `/registration/:id` - Get specific registration details
4. **PUT** `/registration/:id` - Update registration data
5. **POST** `/registration/approve/:id` - Approve registration
6. **POST** `/registration/reject/:id` - Reject registration
7. **POST** `/registration/submit` - Submit registration form (public)
8. **GET** `/registration/validate-token/:token` - Validate token (public)

## Switching from Mock to Real APIs

When backend APIs are ready, update `app/admin/registrations/page.tsx`:

### Step 1: Add API Configuration
Already done in `config/api.ts`:
```typescript
REGISTRATION_GENERATE: "/registration/generate",
REGISTRATION_LIST: "/registration/list",
REGISTRATION_GET: "/registration/:id",
REGISTRATION_UPDATE: "/registration/:id",
REGISTRATION_APPROVE: "/registration/approve/:id",
REGISTRATION_REJECT: "/registration/reject/:id",
```

### Step 2: Replace Mock API Calls

**Example - Generate Form:**
```typescript
// BEFORE (Mock API)
const response = await MockAPI.generateRegistrationToken('admin@vend88.com');

// AFTER (Real API)
import axios from 'axios';
import { getApiUrl } from '@/config/tokens';
import { API_CONFIG } from '@/config/api';

const response = await axios.post(
  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_GENERATE),
  { admin_email: adminProfile?.email },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

**Example - Fetch Registrations:**
```typescript
// BEFORE (Mock API)
const response = await MockAPI.fetchRegistrations({ status: activeTab });

// AFTER (Real API)
const response = await axios.get(
  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_LIST),
  {
    params: { status: activeTab, page: 1, limit: 50 },
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

**Example - Approve:**
```typescript
// BEFORE (Mock API)
const response = await MockAPI.approveRegistration(id);

// AFTER (Real API)
const response = await axios.post(
  getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_APPROVE.replace(':id', id)),
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Step 3: Handle Response Structure
Real APIs should match the response structure in the spec:
```typescript
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Important Response Fields:**
- `approved_by` / `rejected_by`: Admin email who performed the action
- `approved_at` / `rejected_at`: ISO timestamp of action
- `rejection_reason`: Text reason for rejection
- `menu_files`: Array of file objects with `filename`, `url`, `size`, `uploaded_at`
- `submitted_at`: Timestamp when customer submitted form

Error responses:
```typescript
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Mock Data Details

The mock API currently has 8 sample registrations:
1. **Submitted** - Coffee Shop Downtown (NSW)
2. **Submitted** - Sushi Express Bar (QLD)
3. **Submitted** - Thai Basil Restaurant (VIC)
4. **Submitted** - Pizza Roma (NSW)
5. **Submitted** - Golden Dumpling House (WA)
6. **Submitted** - Bubble Tea Paradise (VIC)
7. **Pending** - Token generated, not filled
8. **Approved** - Seoul BBQ House (VIC)

Mock delays simulate real network latency:
- Generate token: 500-800ms
- Fetch list: 300-600ms
- Get details: 200-400ms
- Update/Approve/Reject: 400-700ms

## Testing the Integration

### Test Generate Form
1. Click "Generate New Form" button
2. Modal should appear with a registration link
3. Copy the link (format: `http://localhost:3000/register?token=XXXXX`)
4. Check console for mock API call

### Test Filtering & Search
1. Switch between tabs: Pending, Submitted, All
2. Registration list should update automatically
3. Each tab shows only relevant registrations
4. Use search bar to filter by business name, email, contact, phone, or ABN
5. Use state dropdown to filter by Australian state/territory
6. Click "Clear" to reset search and filters
7. All filters work together (tab + search + state)

### Test Details & Edit
1. Click "View Details" on any submitted registration
2. Modal shows all registration information
3. Click "Edit" button to enable edit mode
4. Modify any field and click "Save"
5. Changes should persist in the list

### Test Approve/Reject
1. Open details for a submitted registration
2. Click "Approve" or "Reject"
3. For reject: Enter rejection reason in prompt
4. Confirm the action
5. Registration status should update with timestamp and admin email
6. Rejected registrations show rejection reason
7. Rejected registrations can be approved later
8. List should refresh automatically

### Test Menu File Downloads
1. Open details for a registration with menu files
2. Each file shows: icon, filename, size, upload date
3. Click download button or file card
4. In mock mode: Alert shows (real API will download file)
5. Files are styled as clickable cards with hover effects

## Database Schema

When creating the backend, use the schema in `docs/REGISTRATION_API_SPEC.md`:

### registration_tokens table
- id, token, generated_by, generated_at
- expires_at, used, used_at, status

### registration_submissions table
- 25+ fields covering contact info, business details, address, payment, etc.
- See full schema in the API spec document

## Security Considerations

⚠️ **Important for Backend Development:**
- All admin endpoints require authentication (Bearer token)
- Public endpoints (submit, validate-token) don't require auth
- Implement rate limiting on public endpoints
- Validate token expiry (30 days recommended)
- Sanitize all user inputs
- Implement file upload security for menu files
- Use HTTPS in production

## Environment Configuration

Add to `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://prod.vend88.com

# Feature Flags
USE_MOCK_REGISTRATION_API=true  # Set to false when real APIs are ready
```

Then use in code:
```typescript
const useMockAPI = process.env.USE_MOCK_REGISTRATION_API === 'true';

if (useMockAPI) {
  const response = await MockAPI.generateRegistrationToken(email);
} else {
  const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATION_GENERATE), data);
}
```

## Support

For questions about:
- **Frontend Integration**: Check this guide and `app/admin/registrations/page.tsx`
- **API Specification**: See `docs/REGISTRATION_API_SPEC.md`
- **Mock Implementation**: Review `lib/mockRegistrationApi.ts`
- **UI Components**: Check `components/` directory

## Next Features (Future Enhancements)

Phase 2 features from API spec:
- Email notifications on approval/rejection
- Bulk operations (approve/reject multiple)
- Export registrations to CSV/Excel
- Advanced filtering and search
- Registration analytics dashboard
- File preview for uploaded menus
- Comment/note system for registrations
