# Registration Management API

How a new merchant goes from a registration link to a live customer account and
business, and the endpoints behind each step.

The source of truth is `backend/src/routes/registration.js` in the
`vend88-dashboard-app` repo. If this document and the code disagree, the code wins.

## Where things run

| What | Host | Notes |
| --- | --- | --- |
| Backend API | `https://dbapi.vend88.com` | The only API. Every endpoint below lives here. |
| Admin portal | `https://portal.vend88.com` | Web UI only. It calls `dbapi.vend88.com`; it has no API of its own. |
| Registration form | `https://form.vend88.com` | Customer-facing form. Calls the public endpoints on `dbapi.vend88.com`. |

Both front ends read the backend host from `NEXT_PUBLIC_API_BASE_URL`, which
should be `https://dbapi.vend88.com` in production.

---

## The flow at a glance

```
 Admin portal                    Customer                      Admin portal
 ────────────                    ────────                      ────────────
 POST /registration/generate ──► opens form.vend88.com?token=… 
   status: pending               GET  /registration/validate-token/:token
                                 POST /registration/submit
                                   status: submitted ─────────► POST /registration/approve/:id
                                                                  creates customer account + business
                                                                  status: approved
                                                                or POST /registration/reject/:id
                                                                  status: rejected
 POST /registration/revoke/:id  (only while pending)
   status: cancelled
```

| Status | Meaning | Can move to |
| --- | --- | --- |
| `pending` | Link generated, form not yet submitted | `submitted`, `cancelled` |
| `submitted` | Customer submitted the form, waiting for review | `approved`, `rejected` |
| `approved` | Customer account and business created | — |
| `rejected` | Admin turned the registration down | — |
| `cancelled` | Admin revoked the link before it was used | — |

There is no stored `expired` status. A `pending` link whose `expires_at` has
passed is reported as expired by `validate-token` and refused by `submit`, but
its status stays `pending`.

---

## Approval creates the business

Approving a registration is what provisions the merchant. There is no separate
"link customer" or "create business" step. The approve call does it in one
request, and only flips the registration to `approved` once everything it
creates exists. If provisioning fails, the registration stays `submitted` and
can be approved again.

The admin picks one of two modes in the approve dialog:

### New customer (default)

The admin sets the login email and password. The backend then:

1. Normalises the email to the `@vend88.com` domain (`jane@cafe.com` becomes
   `jane@vend88.com`) and checks no account already uses that email or the
   registration's phone number.
2. Creates the owner login account through the production account API
   (`/admin/create_admin_direct`).
3. Creates a **Business** named after the registration's `business_name`
   (falling back to `contact_name`, then `New Business`), owned by that account,
   with status `setup`.
4. Stores the business on the account (`business_id`) and selects it as the
   account's active business, so the owner doesn't have to pick one on first
   login.
5. Records `linked_customer_id` and `linked_business_id` on the registration and
   marks it `approved`.

The owner's name is split from `contact_name` (first word becomes
`first_name`, the rest `last_name`). The registration's `contact_phone` must be
in international format (for example `+61400000000`), or approval fails with a
400. Correct it with `POST /registration/:id` first if needed.

### Add store to an existing customer

`approval_action: "add_store"` with a `customer_id`. The backend creates a new
**Business** (status `setup`) owned by that customer, then records the IDs on the
registration and marks it `approved`. No login account is created.

### After approval

The business has no shops yet. Create the first shop from the portal's business
page (`POST /portal/shops/create`), which also sets up the warehouse and a default
staff PIN.

---

## Conventions

**Authentication.** Admin endpoints take the portal JWT from `POST /portal/auth/login`,
either as `Authorization: Bearer <token>` or as `token` in the JSON body. Each
endpoint checks one portal permission (listed per endpoint). The `admin` and
`super_admin` roles have all of them by default.

**Public endpoints.** `validate-token` and `submit` need no login; the single-use
link token is the authorisation.

**IDs.** Anywhere an endpoint takes `:id`, either the registration `_id` or its
`form_id` (for example `V88-REG-482`) works.

**Timestamps.** Stored and returned as strings in the form
`"2026-09-14 01:30:00 +0000"`, not ISO 8601.

**Errors.** Every error response has this shape:

```json
{ "status_code": 409, "status_msg": "error", "message": "Only a submitted registration can be approved (this one is pending)" }
```

---

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| `POST` | [`/registration/generate`](#post-registrationgenerate) | `manage_registration_forms` |
| `GET` | [`/registration/validate-token/:token`](#get-registrationvalidate-tokentoken) | Public |
| `POST` | [`/registration/submit`](#post-registrationsubmit) | Public (link token) |
| `GET` | [`/registration/list`](#get-registrationlist) | `view_registrations` |
| `GET` | [`/registration/:id`](#get-registrationid) | `view_registrations` |
| `POST` | [`/registration/:id`](#post-registrationid) | `manage_registrations` |
| `POST` | [`/registration/approve/:id`](#post-registrationapproveid) | `manage_registrations` |
| `POST` | [`/registration/reject/:id`](#post-registrationrejectid) | `manage_registrations` |
| `POST` | [`/registration/revoke/:id`](#post-registrationrevokeid) | `manage_registrations` |
| `GET` | `/registration/form-templates/list` | `manage_form_templates` |
| `POST` | `/registration/form-templates/detail` | `manage_form_templates` |
| `POST` | `/registration/form-templates/create` | `manage_form_templates` |
| `POST` | `/registration/form-templates/update` | `manage_form_templates` |
| `POST` | `/registration/form-templates/delete` | `manage_form_templates` |

Interactive docs for every endpoint are at `https://dbapi.vend88.com/api-docs`.

---

### `POST /registration/generate`

Creates a single-use registration link, valid for 30 days. The link snapshots the
form fields at generation time, so editing the template later doesn't change a
link that was already sent.

**Request**

```json
{
  "template_id": "66e4f0c2a1b2c3d4e5f60718"
}
```

| Field | Required | Description |
| --- | --- | --- |
| `template_id` | One of the two | Template whose fields the form will show. |
| `form_fields` | One of the two | Explicit field list. Overrides the template's fields. |

**Response 200**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Registration token generated successfully",
  "data": {
    "id": "66e5a1b2c3d4e5f607182930",
    "form_id": "V88-REG-482",
    "token": "9f1c2e7a4b8d3f60a1e2c3d4b5a69788",
    "link": "https://form.vend88.com?token=9f1c2e7a4b8d3f60a1e2c3d4b5a69788",
    "generated_by": "admin@vend88.com",
    "generated_at": "2026-09-14 01:30:00 +0000",
    "expires_at": "2026-10-14 01:30:00 +0000",
    "status": "pending"
  }
}
```

**Errors:** 400 no fields supplied · 404 template not found

---

### `GET /registration/validate-token/:token`

Called by the registration form on load. Always answers 200. When the link
can't be used, `valid` is `false` and `reason` holds a message to show the
customer.

**Response 200, usable link**

```json
{
  "status_code": 200,
  "success": true,
  "valid": true,
  "used": false,
  "expired": false,
  "form_id": "V88-REG-482",
  "template_id": "66e4f0c2a1b2c3d4e5f60718",
  "expires_at": "2026-10-14 01:30:00 +0000",
  "form_fields": [ /* fields to render */ ]
}
```

**Response 200, unusable link**

| Case | Extra flag | `reason` |
| --- | --- | --- |
| Unknown token | — | This registration link is invalid. |
| Revoked or rejected | `revoked: true` | This registration link is no longer active. Please contact the admin for a new link. |
| Already submitted | `used: true` | This registration form has already been submitted. Each link can only be used once. |
| Past `expires_at` | `expired: true` | This registration link has expired. Please contact the admin for a new link. |

---

### `POST /registration/submit`

Saves the customer's answers and burns the link. A second submit with the same
token is rejected.

**Request**

```json
{
  "token": "9f1c2e7a4b8d3f60a1e2c3d4b5a69788",
  "contact_name": "Jane Citizen",
  "contact_email": "jane@cafe.com",
  "contact_phone": "+61400000000",
  "business_name": "Jane's Cafe",
  "abn": "12345678901",
  "registered_address": "123 Main Street",
  "registered_suburb": "Sydney",
  "registered_postcode": "2000",
  "registered_state": "NSW",
  "registered_country": "Australia",
  "menu_files": [],
  "menu_send_later": true,
  "custom_fields": { "seating_capacity": "40" }
}
```

Only these named fields are stored as columns: `contact_email`, `contact_name`,
`contact_phone`, `messaging_app_type`, `messaging_app_id`, `quote_number`,
`business_name`, `abn`, `registered_address`, `registered_suburb`,
`registered_postcode`, `registered_state`, `registered_country`,
`eftpos_integration`, `alipay_option`, `alipay_other`, `ready_by`,
`heard_about`, `heard_other`, `notes`. Anything else the template collects
belongs in `custom_fields`. `contact_name` is also stored as `owner_name`.

Collect `contact_phone` in international format; approval needs it that way.

**Response 200**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "registration_id": "66e5a1b2c3d4e5f607182930",
    "form_id": "V88-REG-482",
    "status": "submitted"
  }
}
```

**Errors:** 401 missing or unknown token · 409 link already used · 410 link revoked, rejected, or expired

---

### `GET /registration/list`

Returns every registration, newest first (by `submitted_at`, falling back to
`generated_at`). Pending links and submitted forms come back in the same list;
filter by `status` on the client. No pagination.

**Query:** `form_id` (optional) to fetch one form's row.

**Response 200**

```json
{
  "status_code": 200,
  "status_msg": "success",
  "data": [ /* registration objects, see below */ ]
}
```

---

### `GET /registration/:id`

**Response 200**

```json
{
  "status_code": 200,
  "status_msg": "success",
  "data": {
    "_id": "66e5a1b2c3d4e5f607182930",
    "id": "66e5a1b2c3d4e5f607182930",
    "form_id": "V88-REG-482",
    "token": "9f1c2e7a4b8d3f60a1e2c3d4b5a69788",
    "status": "approved",
    "template_id": "66e4f0c2a1b2c3d4e5f60718",
    "form_fields": [],
    "custom_fields": { "seating_capacity": "40" },

    "contact_name": "Jane Citizen",
    "owner_name": "Jane Citizen",
    "contact_email": "jane@cafe.com",
    "contact_phone": "+61400000000",
    "messaging_app_type": null,
    "messaging_app_id": null,

    "business_name": "Jane's Cafe",
    "abn": "12345678901",
    "quote_number": null,
    "registered_address": "123 Main Street",
    "registered_suburb": "Sydney",
    "registered_postcode": "2000",
    "registered_state": "NSW",
    "registered_country": "Australia",

    "eftpos_integration": null,
    "alipay_option": null,
    "alipay_other": null,
    "ready_by": null,
    "heard_about": null,
    "heard_other": null,
    "menu_files": [],
    "menu_send_later": true,
    "notes": null,

    "generated_by": "admin@vend88.com",
    "generated_at": "2026-09-14 01:30:00 +0000",
    "expires_at": "2026-10-14 01:30:00 +0000",
    "submitted_at": "2026-09-15 03:12:45 +0000",

    "approved_at": "2026-09-15 05:00:00 +0000",
    "approved_by": "admin@vend88.com",
    "linked_customer_id": "66e6b2c3d4e5f60718293041",
    "linked_business_id": "66e6b2c3d4e5f60718293052",

    "rejected_at": null,
    "rejected_by": null,
    "rejection_reason": null,
    "cancelled_at": null,
    "cancelled_by": null,
    "cancellation_reason": null
  }
}
```

**Errors:** 404 not found

---

### `POST /registration/:id`

Corrects details on a registration, for example fixing a phone number before
approving. Send only the fields to change.

Editable: all the submittable fields listed under `submit`, plus `owner_name`,
`menu_files`, `menu_send_later`, and `linked_customer_id`. `status` and the
approval, rejection, and cancellation fields can't be set here; use the
approve, reject, and revoke endpoints so each change records who made it.

**Request**

```json
{ "contact_phone": "+61400000000" }
```

**Response 200:** `{ "status_code": 200, "status_msg": "success", "success": true, "message": "Registration updated successfully", "data": { /* registration */ } }`

**Errors:** 400 no editable fields supplied · 404 not found

---

### `POST /registration/approve/:id`

Approves a `submitted` registration and creates the customer account and
business (see [Approval creates the business](#approval-creates-the-business)).

**Request, new customer**

```json
{
  "approval_action": "new_customer_and_store",
  "account_email": "jane@cafe.com",
  "account_password": "chosen-by-admin",
  "approval_notes": ""
}
```

**Request, existing customer**

```json
{
  "approval_action": "add_store",
  "customer_id": "66e6b2c3d4e5f60718293041",
  "approval_notes": ""
}
```

| Field | Required | Description |
| --- | --- | --- |
| `approval_action` | No | `add_store` to attach a business to an existing customer. Any other value, or none, creates a new customer. |
| `customer_id` | With `add_store` | The existing customer (owner account) `_id`. |
| `account_email` | For a new customer | Login email. The domain is replaced with `@vend88.com`. |
| `account_password` | For a new customer | At least 6 characters. |
| `approval_notes` | No | Stored on the registration. |

**Response 200**

```json
{
  "status_code": 200,
  "status_msg": "success",
  "success": true,
  "message": "Registration approved successfully",
  "data": { /* registration, now status "approved" with linked_customer_id and linked_business_id */ },
  "customer_id": "66e6b2c3d4e5f60718293041",
  "customer_email": "jane@vend88.com",
  "business": {
    "_id": "66e6b2c3d4e5f60718293052",
    "name": "Jane's Cafe",
    "owner_id": "66e6b2c3d4e5f60718293041",
    "status": "setup",
    "created_at": "2026-09-15T05:00:00.000Z"
  }
}
```

`customer_email` is the normalised login address for a new customer, and `null`
for `add_store`. Show it to the admin so they hand over the right login.

**Errors**

| Status | When |
| --- | --- |
| 400 | `customer_id` missing for `add_store`; `account_email` or `account_password` missing; password under 6 characters; registration phone not in international format |
| 404 | Registration not found |
| 409 | Registration isn't `submitted`; email or phone already used by another account |
| 502 | The production account API failed or couldn't be reached |

On any error the registration is left `submitted`.

---

### `POST /registration/reject/:id`

Rejects a `submitted` registration. Nothing is created.

**Request**

```json
{ "reason": "Duplicate of V88-REG-311" }
```

**Response 200:** registration in `data`, with `status: "rejected"`, `rejected_at`, `rejected_by`, and `rejection_reason` set.

**Errors:** 404 not found · 409 registration isn't `submitted`

---

### `POST /registration/revoke/:id`

Cancels a `pending` link so it can no longer be opened. Use reject for a form
that was already submitted.

**Request**

```json
{ "reason": "Sent to the wrong email" }
```

**Response 200:** registration in `data`, with `status: "cancelled"`, `cancelled_at`, `cancelled_by`, and `cancellation_reason` set.

**Errors:** 404 not found · 409 link isn't `pending`

---

## Form templates

Templates hold reusable field lists for `generate`. Every template must include
an email field (`id: "contact_email"` or `type: "email"`). Updating a template
bumps its `version` and appends to `version_history`; pass `current_version` on
update to get a 409 instead of overwriting someone else's edit. Templates don't
affect links that were already generated.

Full request and response details are in the Swagger docs at
`https://dbapi.vend88.com/api-docs` under **Registration**.

---

## Storage

Registrations live in the MongoDB `registration` collection, one document per
registration covering its whole lifecycle (link and submission are the same
document). Owner login accounts are in the `admin` collection, and businesses
created on approval go in the `business` collection with `owner_id` pointing at
the owner account.
