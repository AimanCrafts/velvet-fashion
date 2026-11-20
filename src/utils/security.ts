const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export const escapeHtml = (unsafe: string | null | undefined): string => {
  if (!unsafe) return '';
  return String(unsafe).replace(/[&<>"'`=/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
};

export const sanitizeInput = (text: string | null | undefined, maxLength: number = 250): string => {
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

export const validateBdPhone = (phone: string): { isValid: boolean; normalized: string; error?: string } => {
  if (!phone) {
    return { isValid: false, normalized: '', error: 'Phone number is required' };
  }

  const clean = phone.replace(/[\s\-()]/g, '');
  const bdPattern = /^(?:\+?88)?01[3-9]\d{8}$/;

  if (!bdPattern.test(clean)) {
    return {
      isValid: false,
      normalized: clean,
      error: 'Please enter a valid 11-digit Bangladesh mobile number (e.g., 01712-345678)',
    };
  }

  const digits = clean.replace(/\D/g, '');
  const local11 = digits.length === 13 ? digits.substring(2) : digits;
  const formatted = `+880 ${local11.substring(0, 5)}-${local11.substring(5)}`;

  return { isValid: true, normalized: formatted };
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim()) && email.length <= 100;
};

export const validateTrxId = (trxId: string): boolean => {
  if (!trxId) return false;
  const clean = trxId.trim();
  const trxPattern = /^[A-Za-z0-9]{8,16}$/;
  return trxPattern.test(clean);
};

export const isSafeUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const clean = phone.trim();
  if (clean.length < 8) return clean;
  const start = clean.slice(0, 7);
  const end = clean.slice(-2);
  return `${start}****${end}`;
};

export const maskAddress = (address: string): string => {
  if (!address) return '';
  const words = address.trim().split(' ');
  if (words.length <= 2) return address;
  return `${words[0]} •••••• ${words[words.length - 1]}`;
};

export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

const clientAttemptTimestamps: Record<string, number[]> = {};

export const checkRateLimit = (
  actionKey: string,
  maxAttempts: number = 5,
  windowMs: number = 60000,
  lockoutDurationMs: number = 180000
): RateLimitResult => {
  const now = Date.now();
  const effectiveWindow = Math.max(windowMs, lockoutDurationMs);
  const timestamps = (clientAttemptTimestamps[actionKey] || []).filter(
    (t) => now - t < effectiveWindow
  );
  clientAttemptTimestamps[actionKey] = timestamps;

  if (timestamps.length >= maxAttempts) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + lockoutDurationMs - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  return { allowed: true, retryAfterSec: 0 };
};

export const recordRateLimitAttempt = (actionKey: string): void => {
  const now = Date.now();
  if (!clientAttemptTimestamps[actionKey]) {
    clientAttemptTimestamps[actionKey] = [];
  }
  clientAttemptTimestamps[actionKey].push(now);
};

export const logSecurityEvent = (
  event: string,
  details: string,
  severity: 'low' | 'medium' | 'high' = 'low'
): void => {
  if (import.meta.env.DEV) {
    console.warn(`[Security - ${severity.toUpperCase()}] ${event}: ${details}`);
  }
};
