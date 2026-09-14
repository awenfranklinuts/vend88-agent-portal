# Registration Management API

This document used to be the planning spec written before the backend existed.
Registration management is now fully implemented, and the endpoints, request
shapes, and IDs differ from that plan.

**The current reference is
[agent-portal-website/docs/REGISTRATION_API_SPEC.md](../agent-portal-website/docs/REGISTRATION_API_SPEC.md).**

## Summary

- **API host:** `https://dbapi.vend88.com`. The admin portal
  (`portal.vend88.com`) and registration form (`form.vend88.com`) are front
  ends only; neither has its own API.
- **Registration link:** `https://form.vend88.com?token=<token>`, valid for 30
  days and usable once.
- **Lifecycle:** `pending` → `submitted` → `approved` or `rejected`. A pending
  link can be revoked, which sets it to `cancelled`.

## Approval creates the business

`POST /registration/approve/:id` provisions the merchant in the same request.
There is no separate step to link a customer or create a business first.

- **New customer:** the admin supplies `account_email` and `account_password`.
  The backend creates the owner login account (email normalised to
  `@vend88.com`), creates a business named after the registration's
  `business_name` with status `setup`, and selects it as the account's active
  business.
- **Existing customer:** `approval_action: "add_store"` with `customer_id`
  creates a new business (status `setup`) owned by that customer.

In both cases the registration records `linked_customer_id` and
`linked_business_id` and becomes `approved`. If anything fails, it stays
`submitted`. The new business has no shops until one is added from the portal.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/registration/generate` | Create a single-use link |
| `GET` | `/registration/validate-token/:token` | Check a link before showing the form (public) |
| `POST` | `/registration/submit` | Submit the form (public) |
| `GET` | `/registration/list` | List all registrations |
| `GET` | `/registration/:id` | Get one registration |
| `POST` | `/registration/:id` | Correct registration details |
| `POST` | `/registration/approve/:id` | Approve and create the customer and business |
| `POST` | `/registration/reject/:id` | Reject a submitted registration |
| `POST` | `/registration/revoke/:id` | Cancel a pending link |
