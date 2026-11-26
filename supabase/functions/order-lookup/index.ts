import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { allowInstanceRequest, corsHeaders, getClientIp, readJsonLimited } from "../_shared/http.ts";
import { checkSharedRateLimit } from "../_shared/rateLimit.ts";

const lookupRateLimits = new Map<string, number[]>();

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

  const clientIp = getClientIp(req);
  if (!allowInstanceRequest(lookupRateLimits, clientIp, 20, 600000)) {
    return new Response(
      JSON.stringify({ error: "Too many lookup requests. Please wait before retrying." }),
      { status: 429, headers },
    );
  }

  try {
    if (Number(req.headers.get("content-length") || 0) > 4096) {
      return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });
    }
    const payload = (await readJsonLimited(req, 4096)) as Record<string, unknown>;
    const token = payload.lookup_token;
    const phoneLast4 = payload.phone_last4 || null;

    if (
      typeof token !== "string" ||
      token.length !== 32 ||
      !/^[a-f0-9]{32}$/i.test(token) ||
      (phoneLast4 !== null && (typeof phoneLast4 !== "string" || !/^\d{4}$/.test(phoneLast4)))
    ) {
      return new Response(
        JSON.stringify({ error: "Valid 32-character lookup token is required" }),
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

    const withinSharedLimit = await checkSharedRateLimit(supabase, req, "order-lookup", 20, 600);
    if (!withinSharedLimit) {
      return new Response(
        JSON.stringify({ error: "Too many lookup requests. Please wait before retrying." }),
        { status: 429, headers },
      );
    }

    const { data, error } = await supabase.rpc("get_order_status_secure", {
      p_lookup_token: token,
      p_phone_last4: phoneLast4,
    });

    if (error) {
      console.error("[Order Lookup RPC Error]", error.message);
      return new Response(JSON.stringify({ error: "Unable to retrieve order status" }), { status: 500, headers });
    }

    if (!data || !data.found) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers });
    }

    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err: unknown) {
    console.error("[Order Lookup] Invalid request or unexpected failure", err);
    const status = err instanceof SyntaxError ? 400 : err instanceof Error && err.message === "Request too large" ? 413 : 500;
    return new Response(
      JSON.stringify({ error: status === 500 ? "Internal server error" : "Invalid request" }),
      { status, headers },
    );
  }
});
