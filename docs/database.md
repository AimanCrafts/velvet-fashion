# Database Architecture & Setup Guide

Velvet Fashion utilizes Supabase (PostgreSQL 15+) with Row-Level Security (RLS), SECURITY DEFINER Remote Procedure Calls (RPCs), and automated database audit logging.

---

## 1. Schema Overview

The database schema is organized across seven sequential migrations located in `supabase/migrations/`:

| Migration | Purpose | Key Artifacts |
| :--- | :--- | :--- |
| `20261119000001_initial_schema.sql` | Core domain entities | `profiles`, `delivery_zones`, `products`, `product_variants`, `inventory_lots`, `orders`, `order_items`, `audit_logs`, `site_settings` |
| `20261119000002_rls_and_policies.sql` | Access control & isolation | Row-Level Security enabled on all tables; `is_staff()` function; `product_variants_public` view |
| `20261119000003_secure_order_rpc.sql` | Authoritative transactions | `create_order_secure`, `get_order_status_secure`, `update_order_status_admin`, `verify_order_payment_admin` |
| `20261119000004_seed_data.sql` | Core catalog & zones | Bangladesh delivery zones (`dhaka_metro`, `nationwide_express`, etc.), core catalog items, site settings |
| `20261119000005_storage_buckets.sql` | Media storage & policies | `catalog`, `brand`, and `order-documents` storage buckets with staff-only write policies |
| `20261126000006_secure_public_rpc_access.sql` | RPC privilege lockdown | Restricts `create_order_secure` & `get_order_status_secure` execution to `service_role` |
| `20261127000007_expand_catalog_products.sql` | Seasonal catalog expansion | Inserts `prod-07` through `prod-20` with full size/color variants |

---

## 2. Applying Migrations

### Using the Supabase CLI

```bash
# Link to your Supabase remote project
supabase link --project-ref your-project-id

# Push all migrations to the database
supabase db push

# Apply seed data
supabase db reset
```

### Using the Supabase SQL Editor

If managing migrations directly via the Supabase Web Dashboard:
1. Open the **SQL Editor** in your Supabase dashboard.
2. Run the migration scripts in numerical sequence:
   - `supabase/migrations/20261119000001_initial_schema.sql`
   - `supabase/migrations/20261119000002_rls_and_policies.sql`
   - `supabase/migrations/20261119000003_secure_order_rpc.sql`
   - `supabase/migrations/20261119000004_seed_data.sql`
   - `supabase/migrations/20261119000005_storage_buckets.sql`

---

## 3. Security Definer Procedures (RPC)

All customer orders and order status lookups operate through stored procedures rather than direct table permissions:

### `create_order_secure(...)`
- Validates Bangladesh mobile phone numbers (`01[3-9]XXXXXXXX`).
- Locks variant rows using pessimistic locking (`FOR UPDATE`) to prevent overselling.
- Authoritatively calculates subtotal, shipping fee, and order total directly from variant records. Client-provided prices are completely ignored.
- Generates collision-resistant human-readable order numbers (`VF-BD-XXXXXX`) and a cryptographic 128-bit lookup token.
- Deducts variant inventory atomically and creates line item entries.
- Records an immutable audit log entry.

### `get_order_status_secure(...)`
- Lookups require a valid 128-bit lookup token or order number.
- Masks customer mobile numbers and delivery addresses to protect customer privacy on public networks.

### `update_order_status_admin(...)`
- Restricts status changes to authenticated staff (`public.is_staff()`).
- Blocks dispatching or packing bKash/Nagad orders until transaction payment status is marked `verified`.
- Logs every status transition to `public.audit_logs`.

### `verify_order_payment_admin(...)`
- Allows authorized staff to reconcile and verify incoming bKash / Nagad mobile financial service payments.

---

## 4. Environment Variables

Configure your `.env` file at the root of the project:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SITE_URL=https://velvetfashion.com.bd
```
