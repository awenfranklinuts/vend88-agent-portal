# API Integration Instructions: Dynamic Form Field Handling

**Date:** March 18, 2026  
**Purpose:** Update backend APIs to support dynamic, customizable registration form fields  
**Status:** Pending Backend Implementation

---

## Overview

Currently, the registration system uses hardcoded fields. We need to implement a dynamic form configuration system where:

1. **Admins** select which fields to include in each registration form via UI
2. **Selected field configuration** is saved when generating a registration token
3. **Onboarding form** dynamically renders only the selected fields
4. **Backend APIs** validate and store data based on the saved field configuration

---

## Current API Endpoints

```
GET    /registration/list                    List Registration Forms
POST   /registration/generate                Generate Registration Token
GET    /registration/validate-token/{token}  Validate Registration Token
POST   /registration/submit                  Submit Registration Form (Public)
POST   /registration/reject/{registration_id} Reject Submitted Registration
POST   /registration/revoke/{registration_id} Revoke Registration Link
POST   /registration/{registration_id}       Update Registration Details
GET    /registration/{registration_id}       Get Registration Details
```

---

## Required Changes

### 1. Database Schema Updates

#### New Collection: `registration_configs`

```javascript
{
  _id: ObjectId,
  form_id: "V88-REG-001",           // Unique form identifier
  token: "5Bn-TdH6nIqdlUvqws5rgN9", // Registration token
  
  // Dynamic field configuration
  selected_fields: [
    {
      id: "contact_email",
      label: "Email Address",
      type: "email",                // text, email, phone, number, date, textarea, select, multiple_choice, address
      required: true,
      order: 1,
      description: "Contact's email address for communication",
      group: null,                  // null, "Address", "How You Heard About Us", "Menu Files"
      options: [],                  // For select/multiple_choice types (e.g., ["yes", "no"])
      choice_mode: null             // null, "single", "multiple" (used only when type = "multiple_choice")
    },
    {
      id: "contact_name",
      label: "Contact Name",
      type: "text",
      required: true,
      order: 2,
      description: "Primary contact person's full name",
      group: null,
      options: [],
      choice_mode: null
    },
    // ... more fields
    {
      id: "registered_address",
      label: "Registered Address",
      type: "text",
      required: true,
      order: 8,
      description: "Street address of registration",
      group: "Address",
      options: [],
      choice_mode: null
    }
  ],
  
  selected_field_ids: [
    "contact_email",
    "contact_name",
    "quote_number",
    "business_name",
    "abn",
    "registered_address",
    "registered_suburb",
    "registered_state",
    "registered_postcode",
    "registered_country",
    // ... etc
  ],
  
  // Metadata
  generated_by: "admin@example.com",
  generated_at: ISODate("2026-02-16T01:29:40Z"),
  expires_at: ISODate("2026-03-16T01:29:40Z"),
  status: "active",                 // active, used, expired, revoked
  
  // Track one-time use
  used_at: null,                    // Set when token is used for submission
  
  created_at: ISODate("2026-02-16T01:29:40Z"),
  updated_at: ISODate("2026-02-16T01:29:40Z")
}
```

#### Updated Collection: `registrations`

```javascript
{
  _id: ObjectId,
  form_id: "V88-REG-001",
  token: "5Bn-TdH6nIqdlUvqws5rgN9",
  
  // Store submitted data in flexible structure
  field_data: {
    contact_email: "john@example.com",
    owner_name: "John Doe",
    contact_phone: "+61 404 088 927",
    quote_number: "INV-00123",
    business_name: "Pospal Australia Pty Ltd",
    abn: "56 635 489 664",
    registered_address: "Unit 10, 191 Parramatta Road",
    registered_suburb: "Auburn",
    registered_state: "NSW",
    registered_postcode: "2144",
    registered_country: "Australia",
    messaging_app_type: "wechat",
    messaging_app_id: "JohnathanWu",
    eftpos_integration: "yes",
    alipay_option: "open",
    alipay_other: null,             // Only present if alipay_option === "other"
    ready_by: "Next Month - March 2026",
    heard_about: "friend",
    heard_other: null,              // Only present if heard_about === "other"
    menu_files: [],
    menu_send_later: true,
    notes: "testing internal notes"
  },
  
  // Reference to configuration used
  form_config_id: ObjectId,
  selected_field_ids: [
    "contact_email",
    "contact_name",
    // ... fields that were selected
  ],
  
  // Status tracking
  status: "pending",                // pending, submitted, approved, rejected, expired, cancelled
  
  // Timestamps
  generated_at: ISODate("2026-02-16T01:29:40Z"),
  generated_by: "semutkecil679@gmail.com",
  submitted_at: ISODate("2026-02-16T01:40:15Z"),
  approved_at: null,
  approved_by: null,
  rejected_at: null,
  rejected_by: null,
  rejection_reason: null,
  
  // Linking
  linked_customer_id: ObjectId,
  
  created_at: ISODate("2026-02-16T01:29:40Z"),
  updated_at: ISODate("2026-02-16T01:29:40Z")
}
```

---

### 2. API Endpoint Updates

#### A. POST /registration/generate

**Current Implementation:** Already generates token with admin_email, returns form_id, token, link, timestamps  
**Update Needed:** Add `selected_fields` parameter to save field configuration

**Updated Request Body:**
```json
{
  "admin_email": "admin@example.com",
  "selected_fields": [
    {
      "id": "contact_email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "order": 1,
      "description": "Contact's email address for communication",
      "group": null,
      "options": [],
      "choice_mode": null
    },
    {
      "id": "contact_name",
      "label": "Contact Name",
      "type": "text",
      "required": true,
      "order": 2,
      "description": "Primary contact person's full name",
      "group": null,
      "options": [],
      "choice_mode": null
    },
    {
      "id": "quote_number",
      "label": "Quote Number",
      "type": "text",
      "required": true,
      "order": 5,
      "description": "Quote or invoice number from sales",
      "group": null,
      "options": [],
      "choice_mode": null
    },
    {
      "id": "service_preferences",
      "label": "Service Preferences",
      "type": "multiple_choice",
      "required": false,
      "order": 21,
      "description": "Select one or more preferred services",
      "group": null,
      "options": ["POS Setup", "Training", "Menu Digitization"],
      "choice_mode": "multiple"
    },
    // ... all other selected fields from FormFieldSelector
  ],
  "expires_in_days": 30
}
```

**Current Response (Keep As-Is):**
```json
{
  "status_code": 200,
  "success": true,
  "data": {
    "id": "ObjectId",
    "form_id": "V88-REG-001",
    "token": "5Bn-TdH6nIqdlUvqws5rgN9SYHXtAJoo",
    "link": "https://form.vend88.com/register?token=5Bn-TdH6nIqdlUvqws5rgN9SYHXtAJoo",
    "generated_by": "admin@example.com",
    "generated_at": "2026-02-16T01:29:40Z",
    "expires_at": "2026-03-16T01:29:40Z",
    "status": "pending"
  }
}
```

**Backend Logic - UPDATE:**
1. Extract `selected_fields` array from request (NEW)
2. Create entry in `registration_configs` collection with:
   - `selected_fields`: Store the full field config array (NEW)
   - `selected_field_ids`: Extract just the IDs for quick reference (NEW)
   - `token`: Generated token (existing)
   - `form_id`: Generated form ID (existing)
   - `generated_by`, `generated_at`, `expires_at`, `status` (existing, already implemented)
3. Return existing response structure (form_id, token, link, timestamps) - NO CHANGE to response

---

#### B. NEW: GET /registration/config/:token

**Purpose:** Onboarding form fetches field configuration to render dynamic form

**Request:**
```
GET /registration/config/5Bn-TdH6nIqdlUvqws5rgN9SYHXtAJoo
```

**Response:**
```json
{
  "success": true,
  "data": {
    "form_id": "V88-REG-001",
    "token": "5Bn-TdH6nIqdlUvqws5rgN9SYHXtAJoo",
    "selected_fields": [
      {
        "id": "contact_email",
        "label": "Email Address",
        "type": "email",
        "required": true,
        "order": 1,
        "description": "Contact's email address for communication",
        "group": null,
        "options": [],
        "choice_mode": null
      },
      {
        "id": "contact_name",
        "label": "Contact Name",
        "type": "text",
        "required": true,
        "order": 2,
        "description": "Primary contact person's full name",
        "group": null,
        "options": [],
        "choice_mode": null
      },
      // ... rest of selected fields
    ]
  }
}
```

**Backend Logic:**
1. Look up token in `registration_configs` collection
2. Verify token is `active` and not `expired`
3. Return the `selected_fields` array
4. If token invalid/expired, return error

---

#### C. POST /registration/submit (UPDATED)

**Current:** Expects hardcoded field names (contact_email, business_name, abn, etc.)  
**New:** Accept dynamic fields based on form configuration

**Request Body:**
```json
{
  "token": "5Bn-TdH6nIqdlUvqws5rgN9SYHXtAJoo",
  "contact_email": "john@example.com",
  "owner_name": "John Doe",
  "contact_phone": "+61 404 088 927",
  "quote_number": "INV-00123",
  "business_name": "Pospal Australia Pty Ltd",
  "abn": "56 635 489 664",
  "registered_address": "Unit 10, 191 Parramatta Road",
  "registered_suburb": "Auburn",
  "registered_state": "NSW",
  "registered_postcode": "2144",
  "registered_country": "Australia",
  "messaging_app_type": "wechat",
  "messaging_app_id": "JohnathanWu",
  "eftpos_integration": "yes",
  "alipay_option": "open",
  "alipay_other": null,
  "ready_by": "Next Month - March 2026",
  "heard_about": "friend",
  "heard_other": null,
  "menu_files": [],
  "menu_send_later": true,
  "notes": "testing internal notes"
}
```

**NOTE:** The request body structure matches the flattened field format (NOT nested under `field_data`). The backend should map this to `field_data` internally when storing.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "699273043d479dfb6aa89d98",
    "form_id": "V88-REG-001",
    "token": "5Bn-TdH6nIqdlUvqws5rgN9SYHXtAJoo",
    "status": "submitted",
    "submitted_at": "2026-02-16T01:40:15Z"
  }
}
```

**Backend Logic:**

1. **Validate token:**
   - Look up configuration in `registration_configs` by token
   - Check if token status is `active` (not expired, revoked, used)
   - Verify token has not been used (`used_at` is null)

2. **Transform and validate submitted data:**
   ```javascript
   const config = await registrationConfigs.findOne({ token });
   // Extract field_data from request (flattened format from frontend)
   const submittedData = {
     contact_email: req.body.contact_email,
     owner_name: req.body.owner_name,
     contact_phone: req.body.contact_phone,
     quote_number: req.body.quote_number,
     business_name: req.body.business_name,
     abn: req.body.abn,
     registered_address: req.body.registered_address,
     registered_suburb: req.body.registered_suburb,
     registered_state: req.body.registered_state,
     registered_postcode: req.body.registered_postcode,
     registered_country: req.body.registered_country,
     messaging_app_type: req.body.messaging_app_type || null,
     messaging_app_id: req.body.messaging_app_id || null,
     eftpos_integration: req.body.eftpos_integration,
     alipay_option: req.body.alipay_option,
     alipay_other: req.body.alipay_other || null,
     ready_by: req.body.ready_by,
     heard_about: req.body.heard_about,
     heard_other: req.body.heard_other || null,
     menu_files: req.body.menu_files || [],
     menu_send_later: req.body.menu_send_later,
     notes: req.body.notes || ""
   };
   
   const errors = [];
   
   // Validate specific field types (must match admin config)
   if (!isValidEmail(submittedData.contact_email)) {
     errors.push('contact_email must be a valid email');
   }
   
   if (!isValidABN(submittedData.abn)) {
     errors.push('abn must be exactly 11 digits');
   }
   
   if (!isValidAustralianPhone(submittedData.contact_phone)) {
     errors.push('contact_phone must be valid Australian mobile (04XX XXX XXX)');
   }
   
   if (!/^\d{4}$/.test(submittedData.registered_postcode)) {
     errors.push('registered_postcode must be exactly 4 digits');
   }
   
   // Validate required fields based on config
   for (const fieldConfig of config.selected_fields) {
     const fieldId = fieldConfig.id;
     const value = submittedData[fieldId];
     
     // Check required fields
     if (fieldConfig.required && (!value || value === "")) {
       errors.push(`${fieldId} is required`);
       continue;
     }
     
     // Skip validation if not required and empty
     if (!fieldConfig.required && (!value || value === "")) {
       continue;
     }
   }
   
   if (errors.length > 0) {
     return res.status(400).json({ 
       success: false, 
       errors 
     });
   }

   // Menu upload rule: must either upload files or choose send later (not both empty)
   // Menu validation: must either have files OR send_later flag
   const hasMenuFiles = Array.isArray(submittedData.menu_files) && submittedData.menu_files.length > 0;
   const sendLater = submittedData.menu_send_later === true;
   if (!hasMenuFiles && !sendLater) {
     errors.push("menu_files or menu_send_later is required");
   }
   
   // Alipay conditional: if selected "other", alipay_other must be provided
   if (submittedData.alipay_option === "other" && !submittedData.alipay_other) {
     errors.push("alipay_other is required when alipay_option is 'other'");
   }
   
   // Heard about conditional: if selected "other", heard_other must be provided
   if (submittedData.heard_about === "other" && !submittedData.heard_other) {
     errors.push("heard_other is required when heard_about is 'other'");
   }
   ```

3. **Store submission:**
   ```javascript
   // Create registration document
   const registration = await registrations.insertOne({
     form_id: config.form_id,
     token: token,
     field_data: submittedData,
     form_config_id: config._id,
     selected_field_ids: config.selected_field_ids,
     status: "submitted",
     generated_at: config.generated_at,
     submitted_at: new Date(),
     approved_at: null,
     approved_by: null,
     rejected_at: null,
     rejected_by: null,
     rejection_reason: null,
     linked_customer_id: null,
     created_at: new Date(),
     updated_at: new Date()
   });
   
   // Mark token as used (one-time use enforcement)
   await registrationConfigs.updateOne(
     { token },
     { 
       $set: { 
         status: "used",
         used_at: new Date() 
       } 
     }
   );
   ```

4. **Return success response:**
   - Return new registration ID
   - Return form_id and submission timestamp
   ```javascript
   return res.status(200).json({
     success: true,
     data: {
       id: registration.insertedId,
       form_id: config.form_id,
       token: token,
       status: "submitted",
       submitted_at: new Date().toISOString()
     }
   });
   ```

---

#### D. GET /registration/{registration_id} (UPDATED)

**Current:** Returns hardcoded field names  
**New:** Return flexible field_data object

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "699273043d479dfb6aa89d98",
    "form_id": "V88-REG-001",
    "status": "submitted",
    "field_data": {
      "contact_email": "john@example.com",
      "contact_name": "John Doe",
      "contact_phone": "+61 404 088 927",
      "quote_number": "INV-00123",
      // ... all submitted fields
    },
    "selected_field_ids": [
      "contact_email",
      "contact_name",
      // ... fields that were in the form
    ],
    "generated_at": "2026-02-16T01:29:40Z",
    "submitted_at": "2026-02-16T01:40:15Z",
    "approvedAt": null,
    "rejectedAt": null
  }
}
```

---

#### E. POST /registration/{registration_id} (UPDATED - Update Details)

**Current:** Updates hardcoded fields  
**New:** Update flexible field_data

**Request Body:**
```json
{
  "field_data": {
    "contact_email": "newemail@example.com",
    "business_name": "New Business Name",
    // ... only fields being updated
  }
}
```

**Backend Logic:**
1. Fetch registration's form_config_id
2. Validate that fields being updated are in the form configuration
3. Perform type-specific validation (same as submit)
4. Update the `field_data` object
5. Update `updated_at` timestamp

---

### 3. Validation Helper Functions

Create reusable validation utilities:

```javascript
// utils/fieldValidation.js

function validateABN(abn) {
  const cleanABN = abn.replace(/\s/g, '');
  return /^\d{11}$/.test(cleanABN);
}

function validateAustralianPhone(phone) {
  const cleanPhone = phone.replace(/\s/g, '').replace(/\+61/, '0');
  return /^04\d{8}$/.test(cleanPhone);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePostcode(postcode) {
  return /^\d{4}$/.test(postcode);
}

function validateFieldByType(fieldId, value, fieldType, options = [], choiceMode = null) {
  if (fieldType === "email") {
    return validateEmail(value) ? null : `${fieldId} must be a valid email`;
  }
  
  if (fieldType === "phone") {
    return validateAustralianPhone(value) ? null : `${fieldId} must be valid Australian mobile`;
  }
  
  if (fieldType === "number") {
    return !isNaN(Number(value)) ? null : `${fieldId} must be a number`;
  }
  
  if (fieldType === "date") {
    return !isNaN(Date.parse(value)) ? null : `${fieldId} must be a valid date`;
  }
  
  if (fieldType === "select" && options.length > 0) {
    return options.includes(value) ? null : `${fieldId} has invalid option`;
  }

  if (fieldType === "multiple_choice" && options.length > 0) {
    if (choiceMode === "single") {
      if (Array.isArray(value)) {
        return `${fieldId} must be a single selected option`;
      }
      return options.includes(value) ? null : `${fieldId} has invalid option`;
    }

    const values = Array.isArray(value) ? value : [value];
    const invalid = values.filter((v) => !options.includes(v));
    return invalid.length === 0 ? null : `${fieldId} has invalid option(s)`;
  }
  
  // text, textarea, address pass validation
  return null;
}

function validateFieldDataAgainstConfig(fieldData, selectedFields) {
  const errors = {};
  
  for (const fieldConfig of selectedFields) {
    const { id, required, type, options, choice_mode } = fieldConfig;
    const value = fieldData[id];
    
    if (required && (!value || value === "")) {
      errors[id] = `${id} is required`;
      continue;
    }
    
    if (!required && (!value || value === "")) {
      continue;
    }
    
    const error = validateFieldByType(id, value, type, options, choice_mode);
    if (error) {
      errors[id] = error;
    }
  }

  const hasMenuFiles = Array.isArray(fieldData.menu_files) && fieldData.menu_files.length > 0;
  const sendLater = fieldData.menu_send_later === true;
  if (!hasMenuFiles && !sendLater) {
    errors.menuUpload = "menu_files or menu_send_later is required";
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

module.exports = {
  validateABN,
  validateAustralianPhone,
  validateEmail,
  validatePostcode,
  validateFieldByType,
  validateFieldDataAgainstConfig
};
```

---

### 4. Special Field Handling

#### Address Fields

Address is stored as separate fields in `field_data`:
```javascript
{
  registered_address: "Unit 10, 191 Parramatta Road",
  registered_suburb: "Auburn",
  registered_state: "NSW",
  registered_postcode: "2144",
  registered_country: "Australia"
}
```

When all address fields are grouped, they appear under "Address" group in the form, but are still stored as individual fields in the database.

#### Select/Dropdown/Multiple Choice Fields

For fields like `heard_about`, `eftpos_integration`, `alipay_option`:
- Store the selected value directly
- If value is "other", there may be companion field `heard_other` with text explanation
- Validate that selected value matches options in field config

For `multiple_choice` fields:
- Use `choice_mode: "single"` for single-choice behavior (stored as a string)
- Use `choice_mode: "multiple"` for multiple-choice behavior (stored as an array of strings)
- Validate all selected options against the configured `options` list

#### Menu Files

```javascript
{
  menu_files: [
    {
      filename: "menu.pdf",
      url: "https://storage.example.com/...",
      size: 2048576,
      uploadedAt: "2026-02-16T01:40:15Z"
    }
  ],
  menu_send_later: true
}
```

Validation rule for menu section:
- Submission is valid if `menu_files.length > 0` OR `menu_send_later === true`
- Reject submission if both are empty/false

---

### 5. Migration Path

For existing registrations (those created before this update):

1. Create a "Legacy" form configuration containing the original 13 fields
2. Create a backfill job to:
   - Map existing registration documents to use `field_data` structure
   - Extract individual snake_case fields and combine into `field_data` object
   - Create corresponding `registration_configs` entry for legacy form
3. Update retrieval logic to handle both old snake_case fields and new `field_data` format

---

## Implementation Checklist

### Phase 1: Database & Schemas
- [ ] Create `registration_configs` collection
- [ ] Add indexes: `token`, `form_id`, `generated_by`, `expires_at`
- [ ] Update `registrations` collection schema
- [ ] Add indexes: `form_config_id`, `status`, `submitted_at`
- [ ] Create validation utilities

### Phase 2: API Endpoints
- [ ] Update POST `/registration/generate` to save field configuration
- [ ] Create GET `/registration/config/:token` endpoint
- [ ] Update POST `/registration/submit` to accept dynamic field_data
- [ ] Update GET `/registration/{id}` to return field_data
- [ ] Update POST `/registration/{id}` to accept field_data updates
- [ ] Implement dynamic validation logic

### Phase 3: Token Management
- [ ] Implement token status updates (active → used → expired)
- [ ] Add expiration checking logic
- [ ] Add token revocation logic

### Phase 4: Testing
- [ ] Unit tests for validation functions
- [ ] Integration tests for each endpoint
- [ ] Test with various field combinations
- [ ] Test edge cases (empty optional fields, special characters, etc.)

### Phase 5: Migration (if needed)
- [ ] Create migration script for existing registrations
- [ ] Test migration with production data sample
- [ ] Plan deployment strategy

---

## Frontend Integration Notes

### Admin Portal Changes (Already Done)
- FormFieldSelector component allows selecting and ordering fields
- When "Generate Link" clicked, sends `selected_fields` to POST `/registration/generate`

### Onboarding Form Changes (Needed)
1. On mount, fetch field configuration:
   ```javascript
   const response = await fetch(`/api/registration/config/${token}`);
   const { data } = await response.json();
   setSelectedFields(data.selected_fields);
   ```

2. Render form dynamically based on selected_fields:
   ```javascript
   {selectedFields.map(field => (
     <FormField key={field.id} config={field} value={formData[field.id]} />
   ))}
   ```

3. Submit with dynamic field_data:
   ```javascript
   await fetch('/api/registration/submit', {
     method: 'POST',
     body: JSON.stringify({
       token,
       field_data: formData
     })
   })
   ```

---

## Notes for Backend Team

1. **Token Lifecycle:**
   - Generated → active (waiting for submission)
   - active → used (after successful submission)
   - used/active → expired (after expiration date)
   - active → revoked (admin action)

2. **Field Data Storage:**
   - Store all fields present in the config, null if not provided
   - Optional fields can be null or empty strings
   - Never reject submission because unselected fields are missing

3. **Backward Compatibility:**
   - APIs should return both old format and new format during transition
   - At least handle registrations created before this update

4. **Performance:**
   - Index `registration_configs` by `token` (frequently queried)
   - Index `registrations` by `form_config_id` (for admin views)
   - Consider caching `registration_configs` (rarely changes)

5. **Security:**
   - Validate token authenticity
   - Verify field_data sent matches what's in configuration (prevent injection)
   - Rate limit `/registration/submit` to prevent spam

---

**Questions for Backend Team:**
- When should tokens expire? (current: 30 days suggested)
- Should we support field ordering changes for in-progress tokens?
- How should we handle file uploads for menu_files field?
- Do we need audit logging for field configuration changes?

