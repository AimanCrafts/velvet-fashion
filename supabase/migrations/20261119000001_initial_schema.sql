-- ==============================================================================
-- Velvet Fashion — Production PostgreSQL Schema (Migration 001)
-- Target Platform: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Staff Profiles & Role-Based Access Control (RBAC)
-- Synchronized with Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('superadmin', 'admin', 'staff', 'manager')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Delivery Zones & Authoritative Shipping Fees (Bangladesh)
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    fee_bdt NUMERIC(10, 2) NOT NULL CHECK (fee_bdt >= 0),
    free_above_bdt NUMERIC(10, 2) NOT NULL CHECK (free_above_bdt >= 0),
    eta_en TEXT NOT NULL,
    eta_bn TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Catalog: Products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    category TEXT NOT NULL,
    audience TEXT NOT NULL CHECK (audience IN ('women', 'men', 'kids', 'unisex')),
    description_en TEXT,
    description_bn TEXT,
    fabric TEXT NOT NULL,
    origin TEXT NOT NULL DEFAULT 'Dhaka, Bangladesh',
    badge TEXT,
    image_url TEXT NOT NULL,
    additional_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    care_instructions_en TEXT,
    care_instructions_bn TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Catalog: Product Variants (Authoritative Price & Inventory)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    color_code TEXT,
    price_bdt NUMERIC(10, 2) NOT NULL CHECK (price_bdt >= 0),
    cost_price_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost_price_bdt >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Inventory: Inbound Stock Lots & Cost Tracking
CREATE TABLE IF NOT EXISTS public.inventory_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_number TEXT NOT NULL UNIQUE,
    variant_id TEXT NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity_received INTEGER NOT NULL CHECK (quantity_received > 0),
    quantity_remaining INTEGER NOT NULL CHECK (quantity_remaining >= 0),
    unit_cost_bdt NUMERIC(10, 2) NOT NULL CHECK (unit_cost_bdt >= 0),
    supplier_name TEXT NOT NULL,
    received_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Orders (Unguessable UUID + Tokenized Anonymous Access)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- Human-readable identifier: VF-BD-XXXX
    lookup_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'), -- Unguessable 128-bit access token
    idempotency_key TEXT UNIQUE, -- Prevents duplicate order placement on network retry
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL, -- Normalized: +880 1XXXXXXXXX
    customer_alt_phone TEXT, -- Optional secondary contact
    customer_email TEXT,
    zone_id TEXT NOT NULL REFERENCES public.delivery_zones(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    time_slot TEXT NOT NULL DEFAULT 'Evening (3:00 PM - 8:00 PM)',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bkash', 'nagad')),
    payment_trx_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed', 'refunded')),
    subtotal_bdt NUMERIC(10, 2) NOT NULL CHECK (subtotal_bdt >= 0),
    delivery_fee_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee_bdt >= 0),
    discount_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_bdt >= 0),
    total_bdt NUMERIC(10, 2) NOT NULL CHECK (total_bdt >= 0),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
    order_notes TEXT,
    client_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Order Line Items (Locked Snapshot of Purchase)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id TEXT NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 20),
    unit_price_bdt NUMERIC(10, 2) NOT NULL CHECK (unit_price_bdt >= 0),
    total_price_bdt NUMERIC(10, 2) NOT NULL CHECK (total_price_bdt >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Authoritative Security Audit Trail
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- e.g., 'UPDATE_ORDER_STATUS', 'RECEIVE_INVENTORY_LOT', 'PRICE_CHANGE'
    entity_type TEXT NOT NULL, -- 'order', 'product_variant', 'inventory_lot', 'setting'
    entity_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    client_ip TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Official Site Settings & Regulatory Information
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- 11. Performance & Security Indexes
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_available ON public.product_variants(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_lookup_token ON public.orders(lookup_token);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON public.orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

