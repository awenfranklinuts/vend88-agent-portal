# Token Validation Implementation

## ✅ Changes Made

### 1. **Added Dependencies**
- Added `axios` to `package.json` for API calls
- Added `useRouter` from Next.js for URL parameter extraction

### 2. **Token Validation Flow**

#### On Page Load:
1. **Extract Token** from URL query parameter (`?token=abc123`)
2. **Validate Token** via API: `GET /registration/validate-token/{token}`
3. **Check Response**:
   - ✅ **Valid** → Show registration form
   - ❌ **Invalid/Expired/Used** → Show error message
   - ⏳ **Loading** → Show loading spinner

#### Validation States:
```typescript
const [tokenValidating, setTokenValidating] = useState(true);
const [tokenValid, setTokenValid] = useState(false);
const [tokenError, setTokenError] = useState<string | null>(null);
```

### 3. **API Integration**

#### Token Validation:
```typescript
GET https://dev.vend88.com/registration/validate-token/{token}
```

**Success Response:**
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

#### Form Submission:
```typescript
POST https://dev.vend88.com/registration/submit
```

**Request Body includes:**
- `token`: Registration token
- All form fields (contact, business, address, payment, etc.)

### 4. **Error Handling**

#### Token Errors:
- **Missing Token**: "Missing registration token. Please use a valid registration link."
- **Expired Token**: "Registration token has expired. Please contact the admin for a new link."
- **Used Token**: "This registration form has already been submitted. Each link can only be used once."
- **Invalid Token**: "Invalid registration token."

#### Submission Errors:
- **409 Conflict**: Token already used during submission
- **400 Bad Request**: Invalid/expired token
- **Network Errors**: Generic error message

### 5. **User Experience**

#### Loading State:
```
🔄 Validating registration link...
   Please wait
```

#### Error State:
```
⚠️ Invalid Registration Link
   [Error message]
   
   If you believe this is an error, please contact 
   the admin for a new registration link.
```

#### Success State:
- Shows full registration form
- All sections functional
- Submits with token included

## 📋 Installation Steps

### 1. Install Dependencies
```bash
cd onboarding-registration-form
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Test with Token
```
http://localhost:3000?token=YOUR_TEST_TOKEN
```

## 🔐 Security Features

1. **One-Time Use Enforcement**
   - Token validated before showing form
   - Token checked again on submission
   - Returns 409 if token already used

2. **Expiration Checking**
   - Validates token expiry date
   - Shows appropriate error message

3. **Token Required**
   - Cannot access form without token
   - Cannot submit without valid token

## 🌐 Supported Languages

Both English and Chinese (中文) supported for:
- Loading messages
- Error messages
- Form validation
- Success confirmations

## ⚠️ Important Notes

### File Upload
Currently, the file upload sends file metadata only. To enable actual file uploads, you'll need to:

1. Convert files to base64:
```typescript
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
```

2. Update menu_files in submission:
```typescript
menu_files: await Promise.all(menuFiles.map(async file => ({
  filename: file.name,
  content: await fileToBase64(file),
  mime_type: file.type
})))
```

### Backend Requirements

Ensure your backend API supports:
- CORS for your frontend domain
- `GET /registration/validate-token/:token`
- `POST /registration/submit`
- Proper error responses (400, 409, etc.)

## 🧪 Testing Scenarios

### Test Cases:
1. ✅ Valid unused token → Shows form
2. ❌ No token → Shows error
3. ❌ Invalid token → Shows error
4. ❌ Expired token → Shows error
5. ❌ Already used token → Shows error
6. ✅ Valid submission → Shows thank you
7. ❌ Double submission → Shows error

## 📞 Support

For issues or questions:
- Check browser console for detailed error logs
- Verify backend API is running
- Confirm token is valid using Postman/curl
- Contact backend team for API issues
