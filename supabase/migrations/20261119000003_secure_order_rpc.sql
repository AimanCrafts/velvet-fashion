-- Order processing and administrative RPC procedures

-- 1. Order Creation Procedure
CREATE OR REPLACE FUNCTION public.create_order_secure(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_zone_id TEXT,
    p_address TEXT,
    p_time_slot TEXT,
    p_payment_method TEXT,
    p_payment_trx_id TEXT,
    p_order_notes TEXT,
    p_items JSONB,
    p_client_ip TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_customer_alt_phone TEXT DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_name TEXT;
    v_clean_phone TEXT;
    v_clean_alt_phone TEXT := NULL;
    v_clean_address TEXT;
    v_zone RECORD;
    v_item RECORD;
    v_variant RECORD;
    v_product RECORD;
    v_subtotal NUMERIC(10, 2) := 0;
    v_delivery_fee NUMERIC(10, 2) := 0;
    v_total NUMERIC(10, 2) := 0;
    v_order_id UUID := gen_random_uuid();
    v_lookup_token TEXT := encode(gen_random_bytes(16), 'hex');
    v_order_number TEXT;
    v_item_count INTEGER := 0;
    v_line_total NUMERIC(10, 2);
    v_existing_order RECORD;
BEGIN
    -- Check idempotency key
    IF p_idempotency_key IS NOT NULL AND length(trim(p_idempotency_key)) > 0 THEN
        SELECT * INTO v_existing_order 
        FROM public.orders 
        WHERE idempotency_key = trim(p_idempotency_key);
        
        IF FOUND THEN
            RETURN jsonb_build_object(
                'success', TRUE,
                'order_id', v_existing_order.id,
                'order_number', v_existing_order.order_number,
                'lookup_token', v_existing_order.lookup_token,
                'subtotal_bdt', v_existing_order.subtotal_bdt,
                'delivery_fee_bdt', v_existing_order.delivery_fee_bdt,
                'total_bdt', v_existing_order.total_bdt,
                'status', v_existing_order.status,
                'idempotent', TRUE
            );
        END IF;
    END IF;

    -- Validate customer details
    v_clean_name := trim(p_customer_name);
    IF length(v_clean_name) < 2 OR length(v_clean_name) > 100 THEN
        RAISE EXCEPTION 'INVALID_NAME: Full name must be between 2 and 100 characters';
    END IF;

    -- Validate Bangladesh Mobile Phone Syntax: (+88)?01[3-9]XXXXXXXX
    v_clean_phone := regexp_replace(p_customer_phone, '[\s\-()]', '', 'g');
    IF NOT v_clean_phone ~ '^(?:\+?88)?01[3-9][0-9]{8}$' THEN
        RAISE EXCEPTION 'INVALID_PHONE: Please provide a valid 11-digit Bangladesh mobile number';
    END IF;

    -- Standardize phone to +880 1XXXXXXXXX
    IF substring(v_clean_phone from 1 for 2) = '88' THEN
        v_clean_phone := '+' || v_clean_phone;
    ELSIF substring(v_clean_phone from 1 for 1) = '0' THEN
        v_clean_phone := '+88' || v_clean_phone;
    END IF;

    -- Clean optional alternate phone
    IF p_customer_alt_phone IS NOT NULL AND length(trim(p_customer_alt_phone)) > 0 THEN
        v_clean_alt_phone := regexp_replace(p_customer_alt_phone, '[\s\-()]', '', 'g');
        IF v_clean_alt_phone ~ '^(?:\+?88)?01[3-9][0-9]{8}$' THEN
            IF substring(v_clean_alt_phone from 1 for 2) = '88' THEN
                v_clean_alt_phone := '+' || v_clean_alt_phone;
            ELSIF substring(v_clean_alt_phone from 1 for 1) = '0' THEN
                v_clean_alt_phone := '+88' || v_clean_alt_phone;
            END IF;
        ELSE
            v_clean_alt_phone := NULL;
        END IF;
    END IF;

    v_clean_address := trim(p_address);
    IF length(v_clean_address) < 5 OR length(v_clean_address) > 300 THEN
        RAISE EXCEPTION 'INVALID_ADDRESS: Delivery address must be between 5 and 300 characters';
    END IF;

    IF p_payment_method NOT IN ('cod', 'bkash', 'nagad') THEN
        RAISE EXCEPTION 'INVALID_PAYMENT_METHOD: Supported methods are cod, bkash, nagad';
    END IF;

    IF p_payment_method IN ('bkash', 'nagad') THEN
        IF p_payment_trx_id IS NULL OR NOT trim(p_payment_trx_id) ~ '^[A-Za-z0-9]{8,16}$' THEN
            RAISE EXCEPTION 'INVALID_TRX_ID: Please provide a valid 8-16 alphanumeric Transaction ID';
        END IF;
    END IF;

    -- Verify delivery zone
    SELECT * INTO v_zone FROM public.delivery_zones WHERE id = p_zone_id AND is_active = TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVALID_ZONE: Selected delivery zone is not available';
    END IF;

    -- Verify line items count
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'EMPTY_CART: Order must contain at least one item';
    END IF;

    IF jsonb_array_length(p_items) > 20 THEN
        RAISE EXCEPTION 'ORDER_LIMIT_EXCEEDED: Cannot order more than 20 distinct items at once';
    END IF;

    -- Generate unique order number (VF-BD-XXXXXX with retry loop)
    LOOP
        v_order_number := 'VF-BD-' || upper(substring(encode(gen_random_bytes(4), 'hex') from 1 for 6));
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = v_order_number);
    END LOOP;

    -- Temporary table to hold validated line items before insertion
    CREATE TEMPORARY TABLE temp_order_items (
        variant_id TEXT,
        product_name TEXT,
        size TEXT,
        color TEXT,
        quantity INTEGER,
        unit_price_bdt NUMERIC(10, 2),
        total_price_bdt NUMERIC(10, 2)
    ) ON COMMIT DROP;

    -- Validate items, lock variants, and calculate subtotal
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(variant_id TEXT, quantity INTEGER)
    LOOP
        IF v_item.quantity <= 0 OR v_item.quantity > 10 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY: Line item quantity must be between 1 and 10';
        END IF;

        SELECT * INTO v_variant
        FROM public.product_variants
        WHERE id = v_item.variant_id AND is_available = TRUE
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'VARIANT_UNAVAILABLE: Item variant % is no longer available', v_item.variant_id;
        END IF;

        IF v_variant.stock < v_item.quantity THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK: Item % has only % units remaining in stock',
                v_item.variant_id, v_variant.stock;
        END IF;

        SELECT * INTO v_product FROM public.products WHERE id = v_variant.product_id;

        v_line_total := v_variant.price_bdt * v_item.quantity;
        v_subtotal := v_subtotal + v_line_total;
        v_item_count := v_item_count + v_item.quantity;

        UPDATE public.product_variants
        SET stock = stock - v_item.quantity,
            updated_at = NOW()
        WHERE id = v_variant.id;

        INSERT INTO temp_order_items (
            variant_id,
            product_name,
            size,
            color,
            quantity,
            unit_price_bdt,
            total_price_bdt
        ) VALUES (
            v_variant.id,
            COALESCE(v_product.name_en, 'Velvet Couture Item'),
            v_variant.size,
            v_variant.color,
            v_item.quantity,
            v_variant.price_bdt,
            v_line_total
        );
    END LOOP;

    -- Calculate delivery fee and total
    IF v_subtotal >= v_zone.free_above_bdt THEN
        v_delivery_fee := 0;
    ELSE
        v_delivery_fee := v_zone.fee_bdt;
    END IF;

    v_total := v_subtotal + v_delivery_fee;

    -- Create order record
    INSERT INTO public.orders (
        id,
        order_number,
        lookup_token,
        idempotency_key,
        customer_name,
        customer_phone,
        customer_alt_phone,
        customer_email,
        zone_id,
        address,
        time_slot,
        payment_method,
        payment_trx_id,
        subtotal_bdt,
        delivery_fee_bdt,
        discount_bdt,
        total_bdt,
        status,
        order_notes,
        client_ip,
        user_agent
    ) VALUES (
        v_order_id,
        v_order_number,
        v_lookup_token,
        nullif(trim(p_idempotency_key), ''),
        v_clean_name,
        v_clean_phone,
        v_clean_alt_phone,
        nullif(trim(p_customer_email), ''),
        v_zone.id,
        v_clean_address,
        COALESCE(nullif(trim(p_time_slot), ''), 'Evening (3:00 PM - 8:00 PM)'),
        p_payment_method,
        nullif(trim(p_payment_trx_id), ''),
        v_subtotal,
        v_delivery_fee,
        0,
        v_total,
        'new',
        nullif(trim(p_order_notes), ''),
        p_client_ip,
        p_user_agent
    );

    -- Insert order items
    INSERT INTO public.order_items (
        order_id,
        variant_id,
        product_name,
        size,
        color,
        quantity,
        unit_price_bdt,
        total_price_bdt
    )
    SELECT
        v_order_id,
        variant_id,
        product_name,
        size,
        color,
        quantity,
        unit_price_bdt,
        total_price_bdt
    FROM temp_order_items;

    -- Record audit log
    INSERT INTO public.audit_logs (
        action,
        entity_type,
        entity_id,
        new_values,
        client_ip
    ) VALUES (
        'CREATE_ORDER',
        'order',
        v_order_id::text,
        jsonb_build_object(
            'order_number', v_order_number,
            'total_bdt', v_total,
            'item_count', v_item_count,
            'payment_method', p_payment_method
        ),
        p_client_ip
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'lookup_token', v_lookup_token,
        'subtotal_bdt', v_subtotal,
        'delivery_fee_bdt', v_delivery_fee,
        'total_bdt', v_total,
        'status', 'new'
    );
END;
$$;

-- 2. Customer Order Status Tracking
CREATE OR REPLACE FUNCTION public.get_order_status_secure(
    p_lookup_token TEXT,
    p_phone_last4 TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_zone RECORD;
    v_masked_phone TEXT;
    v_masked_address TEXT;
    v_token_clean TEXT;
BEGIN
    v_token_clean := trim(COALESCE(p_lookup_token, ''));
    IF length(v_token_clean) < 6 THEN
        RAISE EXCEPTION 'INVALID_TOKEN: Valid order lookup token or order number is required';
    END IF;

    SELECT * INTO v_order
    FROM public.orders
    WHERE lookup_token = v_token_clean
       OR order_number = upper(v_token_clean);

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'found', FALSE,
            'error', 'Order not found or invalid lookup token'
        );
    END IF;

    IF p_phone_last4 IS NOT NULL AND length(trim(p_phone_last4)) = 4 THEN
        IF right(v_order.customer_phone, 4) <> trim(p_phone_last4) 
           AND (v_order.customer_alt_phone IS NULL OR right(v_order.customer_alt_phone, 4) <> trim(p_phone_last4)) THEN
            RETURN jsonb_build_object(
                'found', FALSE,
                'error', 'Phone number verification failed'
            );
        END IF;
    END IF;

    SELECT * INTO v_zone FROM public.delivery_zones WHERE id = v_order.zone_id;

    SELECT jsonb_agg(
        jsonb_build_object(
            'product_name', product_name,
            'size', size,
            'color', color,
            'quantity', quantity,
            'unit_price_bdt', unit_price_bdt,
            'total_price_bdt', total_price_bdt
        )
    ) INTO v_items
    FROM public.order_items
    WHERE order_id = v_order.id;

    -- Mask sensitive phone and address details for customer view
    v_masked_phone := overlay(v_order.customer_phone placing '******' from 6 for 6);
    v_masked_address := split_part(v_order.address, ' ', 1) || ' •••••• ' || COALESCE(v_zone.name_en, 'Bangladesh');

    RETURN jsonb_build_object(
        'found', TRUE,
        'order_number', v_order.order_number,
        'customer_name', v_order.customer_name,
        'masked_phone', v_masked_phone,
        'masked_address', v_masked_address,
        'zone_en', COALESCE(v_zone.name_en, 'Bangladesh Delivery Zone'),
        'zone_bn', COALESCE(v_zone.name_bn, 'বাংলাদেশ ডেলিভারি এলাকা'),
        'eta_en', COALESCE(v_zone.eta_en, 'Standard Courier'),
        'eta_bn', COALESCE(v_zone.eta_bn, 'কুরিয়ার ডেলিভারি'),
        'time_slot', v_order.time_slot,
        'status', v_order.status,
        'payment_method', v_order.payment_method,
        'payment_status', v_order.payment_status,
        'subtotal_bdt', v_order.subtotal_bdt,
        'delivery_fee_bdt', v_order.delivery_fee_bdt,
        'total_bdt', v_order.total_bdt,
        'created_at', v_order.created_at,
        'items', COALESCE(v_items, '[]'::jsonb)
    );
END;
$$;

-- 3. Staff Order Status Management
CREATE OR REPLACE FUNCTION public.update_order_status_admin(
    p_order_id UUID,
    p_new_status TEXT,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
BEGIN
    IF NOT public.is_staff() THEN
        RAISE EXCEPTION 'FORBIDDEN: Only authorized staff members can update order status';
    END IF;

    IF p_new_status NOT IN ('new', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'returned') THEN
        RAISE EXCEPTION 'INVALID_STATUS: Unknown order status %', p_new_status;
    END IF;

    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Order % does not exist', p_order_id;
    END IF;

    -- Ensure bKash/Nagad payments are verified before fulfillment
    IF p_new_status IN ('packed', 'out_for_delivery', 'delivered') 
       AND v_order.payment_method IN ('bkash', 'nagad') 
       AND v_order.payment_status <> 'verified' THEN
        RAISE EXCEPTION 'PAYMENT_UNVERIFIED: Cannot pack or dispatch % order % until bKash/Nagad payment is verified',
            upper(v_order.payment_method), v_order.order_number;
    END IF;

    UPDATE public.orders
    SET status = p_new_status,
        updated_at = NOW()
    WHERE id = p_order_id;

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        'UPDATE_ORDER_STATUS',
        'order',
        p_order_id::text,
        jsonb_build_object('status', v_order.status),
        jsonb_build_object('status', p_new_status, 'notes', p_notes)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', p_order_id,
        'old_status', v_order.status,
        'new_status', p_new_status
    );
END;
$$;

-- 4. Staff Payment Reconciliation
CREATE OR REPLACE FUNCTION public.verify_order_payment_admin(
    p_order_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
BEGIN
    IF NOT public.is_staff() THEN
        RAISE EXCEPTION 'FORBIDDEN: Only authorized staff members can verify payments';
    END IF;

    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Order % does not exist', p_order_id;
    END IF;

    UPDATE public.orders
    SET payment_status = 'verified',
        updated_at = NOW()
    WHERE id = p_order_id;

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        'VERIFY_ORDER_PAYMENT',
        'order',
        p_order_id::text,
        jsonb_build_object('payment_status', v_order.payment_status),
        jsonb_build_object('payment_status', 'verified', 'trx_id', v_order.payment_trx_id, 'notes', p_notes)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', p_order_id,
        'payment_status', 'verified',
        'order_number', v_order.order_number
    );
END;
$$;
CREATE OR REPLACE FUNCTION public.verify_order_payment_admin(
    p_order_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
BEGIN
    IF NOT public.is_staff() THEN
        RAISE EXCEPTION 'FORBIDDEN: Only authorized staff members can verify payments';
    END IF;

    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Order % does not exist', p_order_id;
    END IF;

    UPDATE public.orders
    SET payment_status = 'verified',
        updated_at = NOW()
    WHERE id = p_order_id;

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        'VERIFY_ORDER_PAYMENT',
        'order',
        p_order_id::text,
        jsonb_build_object('payment_status', v_order.payment_status),
        jsonb_build_object('payment_status', 'verified', 'trx_id', v_order.payment_trx_id, 'notes', p_notes)
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', p_order_id,
        'payment_status', 'verified',
        'order_number', v_order.order_number
    );
END;
$$;

