import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { allowInstanceRequest, corsHeaders, getClientIp, readJsonLimited } from "../_shared/http.ts";
import { checkSharedRateLimit } from "../_shared/rateLimit.ts";

const rateLimitMap = new Map<string, number[]>();

serve(async (req: Request) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.headers.get("origin") && !headers["Access-Control-Allow-Origin"]) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), { status: 415, headers });
  }

  try {
    const clientIp = getClientIp(req);
    const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 300);

    if (!allowInstanceRequest(rateLimitMap, `order_${clientIp}`, 5, 600000)) {
      return new Response(
        JSON.stringify({
          error: "Too many order requests from this IP. Please wait before retrying.",
          code: "RATE_LIMITED",
        }),
        { status: 429, headers },
      );
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 32768) {
      return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });
    }
    const payload = (await readJsonLimited(req, 32768)) as Record<string, unknown>;

    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      typeof payload.customer_name !== "string" ||
      payload.customer_name.length > 100 ||
      typeof payload.customer_phone !== "string" ||
      payload.customer_phone.length > 24 ||
      typeof payload.zone_id !== "string" ||
      payload.zone_id.length > 80 ||
      typeof payload.address !== "string" ||
      payload.address.length > 300 ||
      !Array.isArray(payload.items) ||
      payload.items.length < 1 ||
      payload.items.length > 20 ||
      (payload.customer_email != null && (typeof payload.customer_email !== "string" || payload.customer_email.length > 100)) ||
      (payload.order_notes != null && (typeof payload.order_notes !== "string" || payload.order_notes.length > 500)) ||
      (payload.customer_alt_phone != null && (typeof payload.customer_alt_phone !== "string" || payload.customer_alt_phone.length > 24)) ||
      (payload.time_slot != null && (typeof payload.time_slot !== "string" || payload.time_slot.length > 100)) ||
      !["cod", "bkash", "nagad"].includes(String(payload.payment_method)) ||
      (payload.payment_trx_id != null && (typeof payload.payment_trx_id !== "string" || payload.payment_trx_id.length > 16)) ||
      (payload.idempotency_key != null &&
        (typeof payload.idempotency_key !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.idempotency_key))) ||
      payload.items.some(
        (item: unknown) =>
          !item ||
          typeof item !== "object" ||
          Array.isArray(item) ||
          typeof (item as Record<string, unknown>).variant_id !== "string" ||
          ((item as Record<string, unknown>).variant_id as string).length > 80 ||
          !Number.isInteger((item as Record<string, unknown>).quantity) ||
          Number((item as Record<string, unknown>).quantity) < 1 ||
          Number((item as Record<string, unknown>).quantity) > 10,
      )
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required checkout fields" }),
        { status: 400, headers },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing" }), { status: 500, headers });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) },
    });

    const withinSharedLimit = await checkSharedRateLimit(supabase, req, "create-order", 5, 600);
    if (!withinSharedLimit) {
      return new Response(
        JSON.stringify({ error: "Too many order requests. Please wait before retrying.", code: "RATE_LIMITED" }),
        { status: 429, headers },
      );
    }

    const { data, error } = await supabase.rpc("create_order_secure", {
      p_customer_name: payload.customer_name,
      p_customer_phone: payload.customer_phone,
      p_customer_email: payload.customer_email || null,
      p_customer_alt_phone: payload.customer_alt_phone || null,
      p_zone_id: payload.zone_id,
      p_address: payload.address,
      p_time_slot: payload.time_slot || "Evening (3:00 PM - 8:00 PM)",
      p_payment_method: payload.payment_method,
      p_payment_trx_id: payload.payment_trx_id || null,
      p_order_notes: payload.order_notes || null,
      p_items: payload.items,
      p_client_ip: clientIp.slice(0, 100),
      p_user_agent: userAgent,
      p_idempotency_key: payload.idempotency_key || null,
    });

    if (error) {
      console.error("[Create Order RPC Error]", error.message);
      const isClientError = /^(INVALID_|INSUFFICIENT_STOCK|EMPTY_CART|ORDER_LIMIT_EXCEEDED|VARIANT_UNAVAILABLE)/.test(
        error.message,
      );
      return new Response(
        JSON.stringify({ error: isClientError ? error.message : "Unable to create order" }),
        { status: isClientError ? 400 : 500, headers },
      );
    }

    return new Response(JSON.stringify(data), { status: 201, headers });
  } catch (err: unknown) {
    console.error("[Create Order] Invalid request or unexpected failure", err);
    const status = err instanceof SyntaxError ? 400 : err instanceof Error && err.message === "Request too large" ? 413 : 500;
    return new Response(
      JSON.stringify({ error: status === 500 ? "Internal server error" : "Invalid request" }),
      { status, headers },
    );
  }
});
