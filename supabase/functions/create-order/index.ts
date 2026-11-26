
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const ALLOWED_ORIGINS = new Set([
  "https://velvetfashion.com.bd",
  "https://www.velvetfashion.com.bd",
  "http://localhost:5173",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const configuredSite = Deno.env.get("SITE_URL")?.replace(/\/$/, "");
  const allowed = origin && (ALLOWED_ORIGINS.has(origin) || origin === configuredSite);
  return {
  ...(allowed ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  };
}

const rateLimitMap = new Map<string, number[]>();

function checkEdgeRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 5000) {
    for (const [storedKey, times] of rateLimitMap) {
      if (!times.some((ts) => now - ts < windowMs)) rateLimitMap.delete(storedKey);
    }
    if (rateLimitMap.size > 5000) rateLimitMap.delete(rateLimitMap.keys().next().value!);
  }
  const history = rateLimitMap.get(key) || [];
  const valid = history.filter((ts) => now - ts < windowMs);
  
  if (valid.length >= limit) {
    return false;
  }

  valid.push(now);
  rateLimitMap.set(key, valid);
  return true;
}

async function readJsonLimited(req: Request, maxBytes: number): Promise<unknown> {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Invalid request body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

serve(async (req: Request) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.headers.get("origin") && !headers["Access-Control-Allow-Origin"]) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const isAllowed = checkEdgeRateLimit(`order_${clientIp}`, 5, 600000);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({
          error: "Too many order requests from this IP. Please wait before retrying.",
          code: "RATE_LIMITED",
        }),
        {
          status: 429,
          headers,
        }
      );
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 32768) return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });
    const payload = await readJsonLimited(req, 32768) as Record<string, unknown>;

    if (!payload || typeof payload !== "object" || Array.isArray(payload) ||
        typeof payload.customer_name !== "string" || payload.customer_name.length > 100 ||
        typeof payload.customer_phone !== "string" || payload.customer_phone.length > 24 ||
        typeof payload.zone_id !== "string" || payload.zone_id.length > 80 ||
        typeof payload.address !== "string" || payload.address.length > 300 ||
        !Array.isArray(payload.items) || payload.items.length < 1 || payload.items.length > 20 ||
        (payload.customer_email != null && (typeof payload.customer_email !== "string" || payload.customer_email.length > 100)) ||
        (payload.order_notes != null && (typeof payload.order_notes !== "string" || payload.order_notes.length > 500))) {
      return new Response(
        JSON.stringify({ error: "Missing required checkout fields" }),
        { status: 400, headers }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration missing" }),
        { status: 500, headers }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      p_client_ip: clientIp,
      p_user_agent: userAgent,
      p_idempotency_key: payload.idempotency_key || null,
    });

    if (error) {
      console.error("[Create Order RPC Error]", error.message);
      const isClientError = /^(INVALID_|INSUFFICIENT_STOCK|EMPTY_CART|ORDER_LIMIT_EXCEEDED|VARIANT_UNAVAILABLE)/.test(error.message);
      return new Response(
        JSON.stringify({ error: isClientError ? error.message : "Unable to create order" }),
        {
          status: isClientError ? 400 : 500,
          headers,
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers,
    });
  } catch (err: unknown) {
    console.error("[Create Order] Invalid request or unexpected failure", err);
    const status = err instanceof SyntaxError ? 400 : err instanceof Error && err.message === "Request too large" ? 413 : 500;
    return new Response(
      JSON.stringify({ error: status === 500 ? "Internal server error" : "Invalid request" }),
      { status, headers }
    );
  }
});
