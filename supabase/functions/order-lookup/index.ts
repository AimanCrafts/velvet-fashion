
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const ALLOWED_ORIGINS = new Set([
  "https://velvetfashion.com.bd",
  "https://www.velvetfashion.com.bd",
  "http://localhost:5173",
]);
const lookupRateLimits = new Map<string, number[]>();

function allowLookup(ip: string): boolean {
  const now = Date.now();
  if (lookupRateLimits.size > 5000) {
    for (const [key, times] of lookupRateLimits) {
      if (!times.some((time) => now - time < 600000)) lookupRateLimits.delete(key);
    }
    if (lookupRateLimits.size > 5000) lookupRateLimits.delete(lookupRateLimits.keys().next().value!);
  }
  const recent = (lookupRateLimits.get(ip) || []).filter((time) => now - time < 600000);
  if (recent.length >= 20) return false;
  recent.push(now);
  lookupRateLimits.set(ip, recent);
  return true;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const configuredSite = Deno.env.get("SITE_URL")?.replace(/\/$/, "");
  const allowed = origin && (ALLOWED_ORIGINS.has(origin) || origin === configuredSite);
  return {
  ...(allowed ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  }
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
    if (size > maxBytes) { await reader.cancel(); throw new Error("Request too large"); }
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

  const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
  if (!allowLookup(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many lookup requests. Please wait before retrying." }), { status: 429, headers });
  }

  try {
    if (Number(req.headers.get("content-length") || 0) > 4096) return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });
    const payload = await readJsonLimited(req, 4096) as Record<string, unknown>;
    const token = payload.lookup_token;
    const phoneLast4 = payload.phone_last4 || null;

    if (typeof token !== "string" || token.length !== 32 || !/^[a-f0-9]{32}$/i.test(token) ||
        (phoneLast4 !== null && (typeof phoneLast4 !== "string" || !/^\d{4}$/.test(phoneLast4)))) {
      return new Response(
        JSON.stringify({ error: "Valid 32-character lookup token is required" }),
        { status: 400, headers }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing" }), { status: 500, headers });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.rpc("get_order_status_secure", {
      p_lookup_token: token,
      p_phone_last4: phoneLast4,
    });

    if (error) {
      console.error("[Order Lookup RPC Error]", error.message);
      return new Response(
        JSON.stringify({ error: "Unable to retrieve order status" }),
        { status: 500, headers }
      );
    }

    if (!data || !data.found) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    console.error("[Order Lookup] Invalid request or unexpected failure", err);
    const status = err instanceof SyntaxError ? 400 : err instanceof Error && err.message === "Request too large" ? 413 : 500;
    return new Response(
      JSON.stringify({ error: status === 500 ? "Internal server error" : "Invalid request" }),
      { status, headers }
    );
  }
});
