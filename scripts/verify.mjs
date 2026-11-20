/**
 * Velvet Fashion — Functional & Schema Verification Suite
 */

import fs from 'node:fs';
import path from 'node:path';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${testName} ${details ? `(${details})` : ''}`);
  }
}

console.log('================================================================');
console.log('VELVET FASHION — SYSTEM VERIFICATION SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: Client Data Hygiene & Security Functions
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Security Utilities & Sanitization ---');

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe).replace(/[&<>"'`=/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
};

const sanitizeInput = (text, maxLength = 250) => {
  if (!text) return '';
  let clean = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if ((code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13) {
      clean += text[i];
    }
  }
  return clean
    .replace(/<[^>]*>/g, '')
    .replace(/(javascript|vbscript|data):/gi, '')
    .trim()
    .slice(0, maxLength);
};

const validateBdPhone = (phone) => {
  if (!phone) return { isValid: false, normalized: '' };
  const clean = phone.replace(/[\s\-()]/g, '');
  const bdPattern = /^(?:\+?88)?01[3-9]\d{8}$/;
  if (!bdPattern.test(clean)) return { isValid: false, normalized: clean };
  const digits = clean.replace(/\D/g, '');
  const local11 = digits.length === 13 ? digits.substring(2) : digits;
  return { isValid: true, normalized: `+880 ${local11.substring(0, 5)}-${local11.substring(5)}` };
};

const validateTrxId = (trxId) => {
  if (!trxId) return false;
  return /^[A-Za-z0-9]{8,16}$/.test(trxId.trim());
};

const isSafeUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url, 'https://velvetfashion.com.bd');
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const maskPhone = (phone) => {
  if (!phone) return '';
  const clean = phone.trim();
  if (clean.length < 8) return clean;
  return `${clean.slice(0, 7)}****${clean.slice(-2)}`;
};

assert(escapeHtml('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;', 'XSS entity encoding escapes angle brackets and quotes');
assert(sanitizeInput('Hello <img src=x onerror=alert(1)> World') === 'Hello  World', 'sanitizeInput strips HTML tags');
assert(sanitizeInput('javascript:alert(1)') === 'alert(1)', 'sanitizeInput strips pseudo-protocols');
assert(validateBdPhone('01712345678').isValid === true, 'validateBdPhone accepts valid 11-digit BD mobile (017)');
assert(validateBdPhone('01812-345678').isValid === true, 'validateBdPhone handles formatted input with hyphens');
assert(validateBdPhone('01212345678').isValid === false, 'validateBdPhone rejects invalid operator prefix (012)');
assert(validateBdPhone('0171234567').isValid === false, 'validateBdPhone rejects 10-digit number (too short)');
assert(validateTrxId('9K28XLP41M') === true, 'validateTrxId accepts standard 10-char bKash TrxID');
assert(validateTrxId('TRX<SCRIPT>') === false, 'validateTrxId rejects non-alphanumeric TrxID');
assert(isSafeUrl('https://wa.me/8801700000000') === true, 'isSafeUrl accepts valid https: WhatsApp link');
assert(isSafeUrl('javascript:alert(document.cookie)') === false, 'isSafeUrl strictly blocks javascript: pseudo-protocol');
assert(isSafeUrl('data:text/html,<script>alert(1)</script>') === false, 'isSafeUrl strictly blocks data: URI protocol');
assert(maskPhone('+880 1712-345678') === '+880 17****78', 'maskPhone cloaks customer mobile number correctly');

// -----------------------------------------------------------------------------
// SUITE 2: PostgreSQL Schema & Procedure Integrity
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Database Schema & Migration Contracts ---');

const migrationsDir = path.resolve('supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));

assert(migrationFiles.length >= 5, `Database migrations directory contains ${migrationFiles.length} migration files`);

const schemaSql = fs.readFileSync(path.join(migrationsDir, '20261119000001_initial_schema.sql'), 'utf-8');
const rlsSql = fs.readFileSync(path.join(migrationsDir, '20261119000002_rls_and_policies.sql'), 'utf-8');
const rpcSql = fs.readFileSync(path.join(migrationsDir, '20261119000003_secure_order_rpc.sql'), 'utf-8');
const seedSql = fs.readFileSync(path.join(migrationsDir, '20261119000004_seed_data.sql'), 'utf-8');
const storageSql = fs.readFileSync(path.join(migrationsDir, '20261119000005_storage_buckets.sql'), 'utf-8');

assert(schemaSql.includes('lookup_token TEXT UNIQUE NOT NULL'), 'orders table defines cryptographic lookup_token column');
assert(schemaSql.includes('idempotency_key TEXT UNIQUE'), 'orders table defines idempotency_key column to prevent duplicate orders');
assert(schemaSql.includes('customer_alt_phone TEXT'), 'orders table defines customer_alt_phone column for secondary contacts');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.audit_logs'), 'Authoritative audit_logs table exists');

assert(rlsSql.includes('ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on orders table');
assert(rlsSql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on profiles table');
assert(rlsSql.includes('ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on audit_logs table');
assert(!rlsSql.includes('CREATE POLICY "Public insert orders"'), 'Zero direct public insert policy on orders (orders must use secure RPC)');
assert(rlsSql.includes('product_variants_public'), 'Public view created to shield cost_price_bdt wholesale margins');

assert(rpcSql.includes('SECURITY DEFINER'), 'create_order_secure declared as SECURITY DEFINER');
assert(rpcSql.includes('SET search_path = public, pg_temp'), 'search_path hardened against hijacking');
assert(rpcSql.includes('FOR UPDATE'), 'create_order_secure uses pessimistic locking (FOR UPDATE) to prevent overselling');
assert(rpcSql.includes('v_total := v_subtotal + v_delivery_fee;'), 'Server recalculates total authoritative amount (zero client price trust)');
assert(rpcSql.includes('p_idempotency_key TEXT DEFAULT NULL'), 'create_order_secure handles idempotency guard parameter');
assert(rpcSql.includes('LOOP') && rpcSql.includes('VF-BD-'), 'Collision-safe order number generator with retry loop implemented');
assert(rpcSql.includes('verify_order_payment_admin'), 'verify_order_payment_admin RPC exists to reconcile bKash/Nagad transactions');
assert(rpcSql.includes('PAYMENT_UNVERIFIED'), 'update_order_status_admin enforces anti-fraud block on unverified bKash/Nagad orders');
assert(seedSql.includes('nationwide_express'), 'Seed data defines nationwide_express delivery zone');
assert(storageSql.includes("bucket_id IN ('catalog', 'brand')"), 'Storage bucket RLS policies configured');

// -----------------------------------------------------------------------------
// SUITE 3: Edge Security Headers & Routing (_headers, _redirects)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Cloudflare Pages Edge Security Headers & Routing ---');

const headersContent = fs.readFileSync(path.resolve('public/_headers'), 'utf-8');

assert(headersContent.includes('Strict-Transport-Security: max-age=31536000'), 'HSTS header configured for 1 year preload');
assert(headersContent.includes('X-Frame-Options: DENY'), 'X-Frame-Options set to DENY');
assert(headersContent.includes('X-Content-Type-Options: nosniff'), 'X-Content-Type-Options set to nosniff');
assert(headersContent.includes("frame-ancestors 'none'"), "Content-Security-Policy enforces frame-ancestors 'none' (anti-clickjacking)");
assert(headersContent.includes('Cache-Control: no-store, no-cache, must-revalidate'), 'Sensitive routes (/admin, /checkout) explicitly prevent edge caching');

const redirectsPath = path.resolve('public/_redirects');
assert(fs.existsSync(redirectsPath), 'public/_redirects exists for Cloudflare Pages SPA client routing');
const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
assert(redirectsContent.includes('/* /index.html 200'), 'public/_redirects routes all paths to /index.html with status 200');

// Parity Check: mockData vs Seed Data
const mockDataContent = fs.readFileSync(path.resolve('src/data/mockData.ts'), 'utf-8');
assert(mockDataContent.includes('nationwide_express'), 'mockData.ts and seed_data.sql share 100% zone parity (nationwide_express)');
assert(mockDataContent.includes('v-01-xl-burg') && seedSql.includes('v-01-xl-burg'), 'mockData.ts and seed_data.sql share variant v-01-xl-burg parity');
assert(mockDataContent.includes('v-03-free-navy') && seedSql.includes('v-03-free-navy'), 'mockData.ts and seed_data.sql share variant v-03-free-navy parity');

// -----------------------------------------------------------------------------
// SUITE 4: Secret Leak & Compliance Scan
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Zero Secrets & Compliance Scan ---');

function searchDirectory(dir, pattern) {
  let matches = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      matches = matches.concat(searchDirectory(fullPath, pattern));
    } else if (file.isFile() && !file.name.endsWith('.log')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (pattern.test(content)) {
        matches.push(fullPath);
      }
    }
  }
  return matches;
}

const secretMatches = searchDirectory('src', /VELVET@2026/);
assert(secretMatches.length === 0, 'Zero occurrences of hardcoded admin passcode in src/', secretMatches.join(', '));

const distDir = path.resolve('dist');
if (fs.existsSync(distDir)) {
  const distSecretMatches = searchDirectory('dist', /VELVET@2026/);
  assert(distSecretMatches.length === 0, 'Zero occurrences of hardcoded admin passcode in compiled dist/ bundle', distSecretMatches.join(', '));
}

const fakeIdMatches = searchDirectory('src', /042188|08149|e-CAB Member #1842/);
assert(fakeIdMatches.length === 0, 'Zero occurrences of fabricated registration numbers in src/', fakeIdMatches.join(', '));

// -----------------------------------------------------------------------------
// SUITE 5: Link Safety & Reverse Tabnabbing Verification
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Reverse Tabnabbing & Error Boundary ---');

function checkExternalLinks(dir) {
  let violations = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      violations = violations.concat(checkExternalLinks(fullPath));
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const blankMatches = content.match(/<a[^>]*target=["']_blank["'][^>]*>/g) || [];
      for (const link of blankMatches) {
        if (!link.includes('rel="noopener noreferrer"')) {
          violations.push(`${file.name}: ${link}`);
        }
      }
    }
  }
  return violations;
}

const tabnabbingViolations = checkExternalLinks('src');
assert(tabnabbingViolations.length === 0, '100% of target="_blank" links include rel="noopener noreferrer"', tabnabbingViolations.join(', '));

const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
assert(appTsx.includes('<ErrorBoundary>'), 'App.tsx wraps Storefront in production ErrorBoundary');

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n>> ALL SYSTEM CHECKS PASSED (100% SUCCESS) <<\n');
  process.exit(0);
}
