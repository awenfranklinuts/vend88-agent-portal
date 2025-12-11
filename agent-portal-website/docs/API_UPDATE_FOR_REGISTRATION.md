# API Update Requirements — Registration & Customer Linking

Purpose
- Capture the backend API changes required to support the current frontend flows in `app/admin/registrations/page.tsx`.
- Provide clear request/response examples, validation rules, and a testing checklist for backend developers.

Summary of current backend (from screenshots / workspace)
- Implemented endpoints:
  - POST `/registration/generate` — accepts `{ admin_email }`, returns token/link
  - GET `/registration/validate-token/:token` — validates token
- Frontend added customer-linking UI and a `temp_` temporary-customer workflow; backend must support linking and creation flows.

Required API additions / changes

1) New endpoint — Link / create customer for a registration
- Method: PUT
- Path: `/registration/:id/link-customer`
- Purpose: Link an existing customer to a registration, or create a new customer record for a registration (used for temp_ flow). Must be callable by admin.

Request examples:
- Link existing customer
  {
    "customer_id": "cust_123456"
  }

- Create new customer from registration data
  {
    "create_new": true,
    "customer_data": {
      "name": "John Smith",
      "email": "owner@coffeeshop.com",
      "phone": "0412 345 678"
    }
  }

Response (200 OK) - existing link
  {
    "success": true,
    "data": {
      "registration_id": "reg_123456",
      "linked_customer_id": "cust_123456",
      "customer_name": "John Smith",
      "linked_at": "2025-11-20T15:30:00Z"
    }
  }

Response (200 OK) - created then linked
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

Error responses
- 400 Bad Request — missing required fields
- 401 Unauthorized — invalid admin token
- 404 Not Found — registration id not found

Behavior notes
- When `create_new: true` is used, create the customer record first, return the new `linked_customer_id`, and persist it on the registration record.
- This endpoint must be idempotent for the same payload (i.e., repeated `create_new` should not create duplicate customers; return existing pending/created customer if already handled).

2) Update Approve Registration behavior/validation
- Endpoint: POST `/registration/approve/:id` (existing)
- New requirement: The registration MUST have a `linked_customer_id` before approval. If not present, return 400 with a clear error.

New server-side flow (recommended):
- If `linked_customer_id` is present: proceed to approve and create business account as usual.
- If frontend sends an approval request where selected customer is `temp_...`, frontend will call `PUT /registration/:id/link-customer` first (create customer), then call `POST /registration/approve/:id`.
- Approve endpoint should return the updated registration including `linked_customer_id` and `approved_at`, `approved_by` fields.

Approve success response (200):
  {
    "success": true,
    "data": {
      "registration_id": "reg_123456",
      "business_id": "biz_789012",
      "linked_customer_id": "cust_789012",
      "status": "approved",
      "approved_at": "2025-11-20T16:00:00Z",
      "approved_by": "admin@vend88.com"
    }
  }

Error responses
- 400 Bad Request - "Customer must be linked before approval"
- 400 Bad Request - "Registration is not in submitted status"
- 401 Unauthorized

3) Registration GET /list /:id responses
- Include `linked_customer_id` in the returned fields for both list and detail endpoints so frontend can display linked customer state.
- Example: `"linked_customer_id": "cust_123456"` or `null`.

4) Database changes
- Add `linked_customer_id VARCHAR(50)` (nullable) to `registration_submissions` table.
- When approving with a newly created customer, ensure `linked_customer_id` populated and persisted.

5) Temporary (frontend) `temp_` flow and session handling
- Frontend may set `linked_customerId` to a temporary id with prefix `temp_{timestamp}` and store pending customer info in sessionStorage.
- Backend should not receive `temp_` ids as final persisted values; the frontend must call `PUT /registration/:id/link-customer` to create the real customer and return the real id prior to approval.
- Backend can optionally accept a `temp_token` for a pending creation flow, but it's optional — recommended approach is frontend-driven create via link-customer endpoint.

6) Idempotency & concurrency
- `PUT /registration/:id/link-customer` should be idempotent: repeated calls with same `create_new` payload should not create duplicates (use unique index on email or tracking table for pending creations).
- Approve operation should be idempotent (approving an already approved registration should return a suitable 4xx or the current approved state).

7) Security and validation
- All admin endpoints require `Authorization: Bearer <admin_token>` and admin role check
- Validate email formats, phone formats, and that `customer_id` exists and is active before linking.

8) Frontend expectations & helper notes
- `POST /registration/generate` expects `{ admin_email }` as request body.
- Frontend will call `PUT /registration/:id/link-customer` when admin selects/creates a customer before approval.
- After successful link (or create+link), frontend will call `POST /registration/approve/:id`.
- Approval must persist `linked_customer_id` so reopening the registration details shows the linked customer (no longer a `temp_` state).

9) Testing checklist (manual)
- Generate token: POST `/registration/generate` with valid `admin_email` → returns token and link
- Submit registration via public flow (or mock): ensure status becomes `submitted`
- Attempt to call POST `/registration/approve/:id` without linking customer → expect 400 with message "Customer must be linked before approval"
- Link existing customer: PUT `/registration/:id/link-customer` with `customer_id` → expect `linked_customer_id` in response and persisted
- Create new customer then link: PUT `/registration/:id/link-customer` with `create_new: true` and `customer_data` → expect new `linked_customer_id` returned and persisted
- Approve registration after link: POST `/registration/approve/:id` → registration becomes `approved`, response includes `linked_customer_id`, `approved_at`, `approved_by`
- Re-open registration detail (GET `/registration/:id`) → shows `linked_customer_id` and customer info
- Idempotency: repeat `PUT /registration/:id/link-customer` with same data → no duplicate customers created

10) Example error messages (consistent format)
- { "success": false, "error": "Customer must be linked before approval" }
- { "success": false, "error": "Invalid customer_id" }
- { "success": false, "error": "Registration not found" }

Migration notes
- Add `linked_customer_id` to existing records (nullable). For previously approved registrations, backfill if you have mapping between registrations and customers.

Implementation priority
1. Add `linked_customer_id` column and ensure `GET` endpoints return it
2. Implement `PUT /registration/:id/link-customer` (idempotent)
3. Update `POST /registration/approve/:id` to require/verify `linked_customer_id` and include `linked_customer_id` in response
4. Ensure frontend uses `{ admin_email }` for generate token endpoint

Contact / Questions for frontend
- If the backend prefers a different payload shape for link/create, tell me the exact JSON shape and I will update `app/admin/registrations/page.tsx` accordingly.

---

Last updated: 2025-12-11
Created by: frontend integration (notes from `app/admin/registrations/page.tsx`)
