// Velvet Fashion — Secure Order Creation Edge Function
// Runtime: Supabase Edge Functions (Deno)

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Rate limiting cache (IP and phone) in edge memory
const rateLimitMap = new Map<string, number[]>();

function checkEdgeRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const history = rateLimitMap.get(key) || [];
  const valid = history.filter((ts) => now - ts < windowMs);
  
  if (valid.length >= limit) {
    return false; // throttled
  }

  valid.push(now);
  rateLimitMap.set(key, valid);
  return true;
}

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 2. Server-Side Edge Rate Limiting (5 order requests per 10 minutes per IP)
    const isAllowed = checkEdgeRateLimit(`order_${clientIp}`, 5, 600000);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({
          error: "Too many order requests from this IP. Please wait before retrying.",
          code: "RATE_LIMITED",
        }),
        {
          status: 429,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const payload = await req.json();

    // 3. Basic Input Hygiene
    if (!payload.customer_name || !payload.customer_phone || !payload.zone_id || !payload.address || !payload.items) {
      return new Response(
        JSON.stringify({ error: "Missing required checkout fields" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // 4. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration missing" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Execute Atomic Server-Side Order Stored Procedure
    const { data, error } = await supabase.rpc("create_order_secure", {
      p_customer_name: payload.customer_name,
      p_customer_phone: payload.customer_phone,
      p_customer_email: payload.customer_email || null,
      p_zone_id: payload.zone_id,
      p_address: payload.address,
      p_time_slot: payload.time_slot || "Evening (3:00 PM - 8:00 PM)",
      p_payment_method: payload.payment_method,
      p_payment_trx_id: payload.payment_trx_id || null,
      p_order_notes: payload.order_notes || null,
      p_items: payload.items,
      p_client_ip: clientIp,
      p_user_agent: userAgent,
    });

    if (error) {
      console.error("[Create Order RPC Error]", error.message);
      const isClientError = error.message.includes("INVALID_") || error.message.includes("INSUFFICIENT_STOCK");
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: isClientError ? 400 : 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});

