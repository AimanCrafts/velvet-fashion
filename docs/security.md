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

- Edge response headers (`public/_headers`) enforce HSTS preload, frame denial (`X-Frame-Options: DENY`), and content type sniffing prevention.
- WAF rate limiting rules throttle high-frequency order placement attempts.
