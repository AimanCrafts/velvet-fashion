const ALLOWED_ORIGINS = new Set([
  "https://velvetfashion.com.bd",
  "https://www.velvetfashion.com.bd",
  "https://aimancrafts.github.io",
]);

export function corsHeaders(origin: string | null): Record<string, string> {
  const configuredSite = Deno.env.get("SITE_URL")?.replace(/\/$/, "");
  const localDevAllowed = Deno.env.get("ALLOW_LOCAL_ORIGIN") === "true" && origin === "http://localhost:5173";
  const allowed = origin && (ALLOWED_ORIGINS.has(origin) || origin === configuredSite || localDevAllowed);
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function allowInstanceRequest(
  bucket: Map<string, number[]>,
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  if (bucket.size > 5000) {
    for (const [storedKey, times] of bucket) {
      if (!times.some((ts) => now - ts < windowMs)) bucket.delete(storedKey);
    }
    if (bucket.size > 5000) bucket.delete(bucket.keys().next().value!);
  }
  const valid = (bucket.get(key) || []).filter((ts) => now - ts < windowMs);
  if (valid.length >= limit) return false;
  valid.push(now);
  bucket.set(key, valid);
  return true;
}

export async function readJsonLimited(req: Request, maxBytes: number): Promise<unknown> {
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
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
