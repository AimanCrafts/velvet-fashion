-- Row-level security policies and public catalog view

-- 1. Enable RLS on All Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Staff Authentication Helper Function
-- Verifies whether current session belongs to an active staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND is_active = TRUE
      AND role IN ('superadmin', 'admin', 'staff', 'manager')
  );
$$;

-- 3. Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Admins can manage profiles"
    ON public.profiles FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_active = TRUE AND role IN ('superadmin', 'admin')
      )
    );

-- 4. Delivery Zones Policies
-- Public can view active delivery zones
CREATE POLICY "Public read active delivery zones"
    ON public.delivery_zones FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Staff manage delivery zones"
    ON public.delivery_zones FOR ALL
    USING (public.is_staff());

-- 5. Products Catalog Policies
-- Public can view published products
CREATE POLICY "Public read published products"
    ON public.products FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Staff manage products"
    ON public.products FOR ALL
    USING (public.is_staff());

-- 6. Product Variants Policies
CREATE POLICY "Staff manage variants"
    ON public.product_variants FOR ALL
    USING (public.is_staff());

-- Public view exposing customer-facing columns without cost price
CREATE OR REPLACE VIEW public.product_variants_public AS
SELECT 
    id,
    product_id,
    sku,
    size,
    color,
    color_code,
    price_bdt,
    stock,
    is_available,
    created_at,
    updated_at
FROM public.product_variants
WHERE is_available = TRUE;

GRANT SELECT ON public.product_variants_public TO anon, authenticated;

-- 7. Inventory Lots Policies
-- Strictly internal: only authorized staff can view and insert lots
CREATE POLICY "Staff view inventory lots"
    ON public.inventory_lots FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Staff insert inventory lots"
    ON public.inventory_lots FOR INSERT
    WITH CHECK (public.is_staff());

-- 8. Orders Policies
CREATE POLICY "Staff view orders"
    ON public.orders FOR SELECT
    USING (public.is_staff());

CREATE POLICY "Staff update order status"
    ON public.orders FOR UPDATE
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- 9. Order Items Policies
CREATE POLICY "Staff view order items"
    ON public.order_items FOR SELECT
    USING (public.is_staff());

-- 10. Audit Logs Policies
-- Staff can view audit logs; only database functions and triggers can write
CREATE POLICY "Staff view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_staff());

-- 11. Site Settings Policies
CREATE POLICY "Public read site settings"
    ON public.site_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Staff manage site settings"
    ON public.site_settings FOR ALL
    USING (public.is_staff());

