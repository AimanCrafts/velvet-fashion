CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
    scope TEXT NOT NULL CHECK (scope IN ('create-order', 'order-lookup')),
    key_hash TEXT NOT NULL CHECK (key_hash ~ '^[a-f0-9]{64}$'),
    window_started_at TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL CHECK (request_count > 0),
    last_seen_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (scope, key_hash)
);

CREATE INDEX IF NOT EXISTS idx_edge_rate_limits_last_seen
    ON public.edge_rate_limits (last_seen_at);

ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.edge_rate_limits FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_edge_rate_limit(
    p_scope TEXT,
    p_key_hash TEXT,
    p_limit INTEGER,
    p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_now TIMESTAMPTZ := clock_timestamp();
    v_request_count INTEGER;
BEGIN
    IF p_scope NOT IN ('create-order', 'order-lookup')
       OR p_key_hash !~ '^[a-f0-9]{64}$'
       OR p_limit < 1 OR p_limit > 100
       OR p_window_seconds < 60 OR p_window_seconds > 3600 THEN
        RAISE EXCEPTION 'Invalid rate limit parameters';
    END IF;

    INSERT INTO public.edge_rate_limits (scope, key_hash, window_started_at, request_count, last_seen_at)
    VALUES (p_scope, p_key_hash, v_now, 1, v_now)
    ON CONFLICT (scope, key_hash) DO UPDATE SET
        window_started_at = CASE
            WHEN public.edge_rate_limits.window_started_at <= v_now - make_interval(secs => p_window_seconds)
            THEN v_now ELSE public.edge_rate_limits.window_started_at END,
        request_count = CASE
            WHEN public.edge_rate_limits.window_started_at <= v_now - make_interval(secs => p_window_seconds)
            THEN 1 ELSE public.edge_rate_limits.request_count + 1 END,
        last_seen_at = v_now
    RETURNING request_count INTO v_request_count;

    IF random() < 0.01 THEN
        DELETE FROM public.edge_rate_limits WHERE last_seen_at < v_now - INTERVAL '1 day';
    END IF;

    RETURN v_request_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.check_edge_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_edge_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;

REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.update_order_status_admin(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_order_status_admin(UUID, TEXT, TEXT) TO authenticated;
REVOKE ALL ON FUNCTION public.verify_order_payment_admin(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_order_payment_admin(UUID, TEXT) TO authenticated;
