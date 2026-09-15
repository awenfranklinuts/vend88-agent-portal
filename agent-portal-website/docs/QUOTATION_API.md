# Quotation API

Quotation Management stores its data in the portal backend's MongoDB database (`vend88-dashboard-app/backend`).

- **Routes:** `backend/src/routes/quotation.js`, mounted under `/portal`. Full request and response details are in Swagger at `/api-docs`, under **Portal Quotations**.
- **Portal client:** `lib/quotationApi.ts` calls these routes and converts the backend's snake_case fields to the camelCase types in `lib/quotations.ts`.

## Collections

| Collection | Model | Contents |
|---|---|---|
| `quotation` | `models/Quotation.js` | One document per quote **version**. Versions share `number`; `(number, version)` is unique |
| `quotation_catalogue` | `models/QuotationCatalogueItem.js` | Price list |
| `counter` | `models/Counter.js` | `{ _id: "quotation", seq }` — source of `V88-QUO-0001` numbers. Numbers are never reused, even after a draft is deleted |

All prices are stored **excluding GST**. `prices_include_gst` only records how the admin entered prices. The server recalculates `totals` (per billing period: `once`, `monthly`, `yearly`) on every save, so reports can query amounts directly.

## Permissions

Every endpoint needs `manage_quotations`. It is in the default permission set for `admin`. Super admins always pass every portal permission check (`utils/portalAuth.js`).

## Endpoints

All are `POST` with `token` in the body.

| Path | Purpose |
|---|---|
| `/portal/quotations/list` | `search`, `status`, `include_superseded`, `page`, `limit`. Superseded versions are hidden unless requested |
| `/portal/quotations/detail` | `id` → `{ quotation, versions }` |
| `/portal/quotations/create` | New draft. Server sets number, version 1, status, creator and totals |
| `/portal/quotations/update` | `id` + content. Drafts only |
| `/portal/quotations/status` | `id`, `status`. Allowed: draft → sent, sent → accepted / declined. Can't send a quote whose valid-until date has passed |
| `/portal/quotations/revise` | `id`. Creates version n+1 as a draft and marks the original superseded |
| `/portal/quotations/duplicate` | `id`. Copy with a new number |
| `/portal/quotations/delete` | `id`. Drafts only |
| `/portal/quotation-catalogue/list` | `include_inactive` |
| `/portal/quotation-catalogue/save` | Create (no `id`) or update |
| `/portal/quotation-catalogue/delete` | `id` (not used by the UI; items are hidden instead) |

## Rules

- A `sent` quote becomes `expired` once its `valid_until` date (Australia/Sydney) has passed. The server applies this whenever quotations are read.
- Status changes and edits are conditional on the status the server last saw, so two admins acting at once can't both succeed.
- Totals formula, kept identical in `utils/quotationPricing.js` and `lib/quotations.ts`:
  - `subtotal = Σ quantity × unit_price × (1 − line discount %)`
  - `ex_gst = round2(subtotal × (1 − quote discount %))`
  - `gst = round2(ex_gst × 10%)`, `total = ex_gst + gst`

## Planned next

- Public customer link with Accept / Decline, and a `viewed` status.
- Email sending.
- On acceptance, generate a registration link prefilled with the customer details and `quoteNumber`.
