# Security Architecture & Operational Controls

Velvet Fashion implements a layered defense model across client runtime, edge CDN, and relational database layers.

---

## 1. Application Layer Controls

### Input Sanitization & Data Hygiene
- **HTML Entity Encoding:** All interpolated customer attributes in confirmation slips and print receipts pass through `escapeHtml()` converting `&`, `<`, `>`, `"`, `'`, `/`, and `` ` `` into safe HTML entities.
- **Syntax Validation:** Bangladesh mobile phone numbers are strictly validated against operator prefixes (`01[3-9]XXXXXXXX`) via `validateBdPhone()`.
- **Transaction ID Validation:** bKash and Nagad transaction identifiers are checked against alphanumeric patterns (`validateTrxId()`).
- **URL Safety:** Outbound links (such as WhatsApp concierge triggers) are verified via `isSafeUrl()` to reject dangerous pseudo-protocols like `javascript:` and `data:`.

### Reverse Tabnabbing Protection
All outbound external links (`target="_blank"`) enforce `rel="noopener noreferrer"`.

### Honeypot Defense
A hidden honeypot field is embedded into checkout flows to silently trap automated bot submissions.

---

## 2. Relational Database Layer (PostgreSQL)

### Authoritative Server Pricing & Stock
- **Zero Client Price Trust:** Order subtotal, delivery charges, and final payment sums are authoritatively derived by PostgreSQL during stored procedure execution.
- **Pessimistic Concurrency:** Inventory lines are acquired with `FOR UPDATE` locks during checkout to prevent race conditions and overselling.
- **Row-Level Security:** Anonymous users have zero direct `INSERT`, `UPDATE`, or `DELETE` access on orders or inventory tables.

### Data Privacy & PII Cloaking
- Public order status queries (`get_order_status_secure`) mask customer phone numbers (`+880 17****78`) and delivery addresses before transmission.
- Wholesale product cost margins (`cost_price_bdt`) are shielded via the `product_variants_public` view.

### Audit Trail
Administrative actions (status updates, payment reconciliations) record actor identifiers, timestamps, and previous vs. new values into `public.audit_logs`.

---

## 3. Edge Security (Cloudflare)

- `public/_headers` provides CSP, HSTS, frame denial, MIME sniffing prevention, and no-store rules when served by Cloudflare Pages or another host that supports this file.
- Checkout and order lookup use a shared PostgreSQL rate-limit counter, with a per-instance limit as an additional short-lived guard. The shared counter is keyed by a SHA-256 hash of the client IP and expires stale entries.
- Edge Function database calls have a 10-second timeout. Request bodies and checkout field sizes are bounded before database writes.
- Customer and staff data is not stored in cookies. Staff access tokens are kept in `sessionStorage`, which is readable by same-origin JavaScript; the strict script CSP reduces script injection exposure but does not make an XSS-compromised page safe.

### Deployment requirements and limits

- The checked-in deploy workflow publishes to GitHub Pages. GitHub Pages does not apply `public/_headers`, so the HTTP security headers in that file are not active on that deployment by themselves. Serve the site through Cloudflare (with the domain proxied) or deploy it to Cloudflare Pages to apply them.
- Browser CSP metadata in `index.html` provides a fallback on static hosts, but it cannot replace HTTP-only protections such as HSTS or `X-Frame-Options`.
- The website's WAF only protects API requests if those requests pass through the protected Cloudflare hostname. The frontend currently calls the Supabase project URL directly, so a WAF rule on the storefront hostname will not see those API requests. Put the API behind a proxied hostname/Worker to apply Cloudflare WAF rules to them.
- Shared application rate limits reduce repeated requests from one IP. Distributed denial-of-service protection still requires upstream CDN/WAF capacity and provider-side limits; application code cannot guarantee resistance to all traffic floods.
