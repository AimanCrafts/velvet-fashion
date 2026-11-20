import type { Database } from '../types/database.types';
import type { Product, DeliveryZone, SiteSettings, LotRecord, OrderStatus, PaymentMethod } from '../types';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

interface RawProductRecord {
  id: string;
  name_en: string;
  name_bn: string;
  category: string;
  audience: 'women' | 'men' | 'kids' | 'unisex';
  description_en?: string;
  description_bn?: string;
  fabric: string;
  badge?: string;
  image_url: string;
  additional_images?: string[];
  is_published?: boolean;
  product_variants_public?: RawVariantRecord[];
  product_variants?: RawVariantRecord[];
}

interface RawVariantRecord {
  id: string;
  sku?: string;
  size: string;
  color: string;
  color_code?: string;
  price_bdt: number | string;
  stock?: number;
}

interface RawDeliveryZoneRecord {
  id: string;
  name_en: string;
  name_bn: string;
  fee_bdt: number | string;
  eta_en: string;
  eta_bn: string;
  free_above_bdt: number | string;
}

interface RawLotRecord {
  id: string;
  lot_number: string;
  supplier_name: string;
  received_date: string;
  quantity_received: number | string;
  unit_cost_bdt: number | string;
  notes?: string;
  variant_id: string;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project-id'));
};

const getHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  return headers;
};

export interface RemoteOrderResult {
  success: boolean;
  order_id: string;
  order_number: string;
  lookup_token: string;
  subtotal_bdt: number;
  delivery_fee_bdt: number;
  total_bdt: number;
  status: string;
  idempotent?: boolean;
}

export interface RemoteOrderStatus {
  found: boolean;
  order_number?: string;
  customer_name?: string;
  masked_phone?: string;
  masked_address?: string;
  zone_en?: string;
  zone_bn?: string;
  eta_en?: string;
  eta_bn?: string;
  time_slot?: string;
  status?: string;
  payment_method?: string;
  payment_status?: string;
  subtotal_bdt?: number;
  delivery_fee_bdt?: number;
  total_bdt?: number;
  created_at?: string;
  items?: Array<{
    product_name: string;
    size: string;
    color: string;
    quantity: number;
    unit_price_bdt: number;
    total_price_bdt: number;
  }>;
  error?: string;
}

export interface AdminOrderRecord {
  id: string;
  order_number: string;
  lookup_token: string;
  idempotency_key: string | null;
  customer_name: string;
  customer_phone: string;
  customer_alt_phone: string | null;
  customer_email: string | null;
  zone_id: string;
  address: string;
  time_slot: string;
  payment_method: 'cod' | 'bkash' | 'nagad';
  payment_trx_id: string | null;
  payment_status: 'pending' | 'verified' | 'failed' | 'refunded';
  subtotal_bdt: number;
  delivery_fee_bdt: number;
  discount_bdt: number;
  total_bdt: number;
  status: OrderStatus;
  order_notes: string | null;
  created_at: string;
  order_items?: Array<{
    id: string;
    variant_id: string;
    product_name: string;
    size: string;
    color: string;
    quantity: number;
    unit_price_bdt: number;
    total_price_bdt: number;
  }>;
}

/**
 * Submit order to Supabase PostgreSQL.
 */
export async function createOrderRemote(payload: {
  customer_name: string;
  customer_phone: string;
  customer_alt_phone?: string;
  customer_email?: string;
  zone_id: string;
  address: string;
  time_slot: string;
  payment_method: PaymentMethod;
  payment_trx_id?: string;
  order_notes?: string;
  idempotency_key?: string;
  items: Array<{ variant_id: string; quantity: number }>;
}): Promise<RemoteOrderResult> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/rpc/create_order_secure`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      p_customer_name: payload.customer_name,
      p_customer_phone: payload.customer_phone,
      p_customer_email: payload.customer_email || null,
      p_zone_id: payload.zone_id,
      p_address: payload.address,
      p_time_slot: payload.time_slot,
      p_payment_method: payload.payment_method,
      p_payment_trx_id: payload.payment_trx_id || null,
      p_order_notes: payload.order_notes || null,
      p_items: payload.items,
      p_customer_alt_phone: payload.customer_alt_phone || null,
      p_idempotency_key: payload.idempotency_key || null,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data as RemoteOrderResult;
}

/**
 * Fetch order status by lookup token or order number.
 */
export async function getOrderStatusRemote(
  lookupToken: string,
  phoneLast4?: string
): Promise<RemoteOrderStatus> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/rpc/get_order_status_secure`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      p_lookup_token: lookupToken,
      p_phone_last4: phoneLast4 || null,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data as RemoteOrderStatus;
}

/**
 * Fetch published products and active variants.
 */
export async function fetchProductsRemote(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];

  const endpoint = `${SUPABASE_URL}/rest/v1/products?select=*,product_variants_public(*)&is_published=eq.true&order=created_at.asc`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const fallbackEndpoint = `${SUPABASE_URL}/rest/v1/products?select=*,product_variants(*)&is_published=eq.true&order=created_at.asc`;
    const fallbackRes = await fetch(fallbackEndpoint, { method: 'GET', headers: getHeaders() });
    if (!fallbackRes.ok) return [];
    const rawFallback = (await fallbackRes.json()) as RawProductRecord[];
    return mapRawProducts(rawFallback);
  }

  const raw = (await response.json()) as RawProductRecord[];
  return mapRawProducts(raw);
}

function mapRawProducts(rawList: RawProductRecord[]): Product[] {
  return rawList.map((p) => {
    const variantsRaw = p.product_variants_public || p.product_variants || [];
    return {
      id: p.id,
      name_en: p.name_en,
      name_bn: p.name_bn,
      name_ar: p.name_bn,
      description_en: p.description_en || '',
      description_bn: p.description_bn || '',
      description_ar: p.description_bn || '',
      audience: p.audience,
      category: p.category,
      category_bn: p.category === 'Kaftans' ? 'পার্টি ও ব্রাইডাল কাফতান' : p.category === 'Panjabis' ? 'পাঞ্জাবি ও কাবলি সেট' : p.category === 'Sarees' ? 'এক্সক্লুসিভ শাড়ি' : p.category === 'Kids Wear' ? 'ছোটদের উৎসবের পোশাক' : 'শাল ও ক্যাশমিয়ার',
      category_ar: p.category,
      collection: 'Winter Royale 2026/27',
      collection_bn: 'রয়্যাল উইন্টার কালেকশন',
      collection_ar: 'রয়্যাল উইন্টার কালেকশন',
      imageUrl: p.image_url,
      additionalImages: p.additional_images || [],
      status: p.is_published ? 'live' : 'draft',
      featured: true,
      newArrival: p.badge === 'New Arrival',
      fabric_en: p.fabric,
      fabric_bn: p.fabric,
      fabric_ar: p.fabric,
      variants: variantsRaw.map((v) => ({
        id: v.id,
        sku: v.sku || `${p.id}-${v.size}`,
        size: v.size,
        color: v.color,
        colorHex: v.color_code || '#3E0713',
        priceBdt: Number(v.price_bdt),
        priceQar: Number(v.price_bdt),
        stockQty: Number(v.stock ?? 0),
      })),
    };
  });
}

/**
 * Fetch authoritative active delivery zones.
 */
export async function fetchDeliveryZonesRemote(): Promise<DeliveryZone[]> {
  if (!isSupabaseConfigured()) return [];

  const endpoint = `${SUPABASE_URL}/rest/v1/delivery_zones?is_active=eq.true&order=display_order.asc`;
  const response = await fetch(endpoint, { method: 'GET', headers: getHeaders() });
  if (!response.ok) return [];

  const raw = (await response.json()) as RawDeliveryZoneRecord[];
  return raw.map((z) => ({
    id: z.id,
    name_en: z.name_en,
    name_bn: z.name_bn,
    name_ar: z.name_bn,
    feeBdt: Number(z.fee_bdt),
    feeQar: Number(z.fee_bdt),
    eta_en: z.eta_en,
    eta_bn: z.eta_bn,
    eta_ar: z.eta_bn,
    freeAboveBdt: Number(z.free_above_bdt),
    freeAboveQar: Number(z.free_above_bdt),
  }));
}

/**
 * Fetch regulatory site settings.
 */
export async function fetchSiteSettingsRemote(): Promise<Partial<SiteSettings> | null> {
  if (!isSupabaseConfigured()) return null;

  const endpoint = `${SUPABASE_URL}/rest/v1/site_settings?key=eq.business_profile&select=*`;
  const response = await fetch(endpoint, { method: 'GET', headers: getHeaders() });
  if (!response.ok) return null;

  const raw = await response.json();
  if (!raw || raw.length === 0 || !raw[0].value) return null;

  const val = raw[0].value;
  return {
    shopName_en: val.shop_name_en,
    shopName_bn: val.shop_name_bn,
    tradeLicenseNo: val.trade_license_no,
    dbidNo: val.dbid_no,
    tinBinNo: val.tin_bin_no,
    supportPhone: val.support_phone,
    supportWhatsApp: val.support_whatsapp,
    supportEmail: val.support_email,
    bkashMerchantNumber: val.bkash_merchant_number,
    nagadMerchantNumber: val.nagad_merchant_number,
  };
}

/**
 * Staff Authentication via Supabase Auth REST API
 */
export async function signInStaff(email: string, password: string): Promise<{
  access_token: string;
  user: { id: string; email: string };
}> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error_description || errorBody.msg || 'Invalid staff credentials');
  }

  const data = await response.json();
  return {
    access_token: data.access_token,
    user: { id: data.user.id, email: data.user.email },
  };
}

/**
 * Fetch staff profile to verify role from public.profiles table
 */
export async function fetchStaffProfile(userId: string, accessToken: string): Promise<Database['public']['Tables']['profiles']['Row'] | null> {
  const endpoint = `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getHeaders(accessToken),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data[0] || null;
}

/**
 * Admin: Fetch authoritative orders with line items.
 */
export async function fetchAdminOrdersRemote(accessToken: string): Promise<AdminOrderRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const endpoint = `${SUPABASE_URL}/rest/v1/orders?select=*,order_items(*)&order=created_at.desc`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getHeaders(accessToken),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch admin orders');
  }

  return await response.json();
}

/**
 * Admin: Fetch inbound inventory lots.
 */
export async function fetchAdminLotsRemote(accessToken: string): Promise<LotRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const endpoint = `${SUPABASE_URL}/rest/v1/inventory_lots?select=*&order=received_date.desc`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: getHeaders(accessToken),
  });

  if (!response.ok) return [];

  const raw = (await response.json()) as RawLotRecord[];
  return raw.map((l) => ({
    id: l.id,
    lotNumber: l.lot_number,
    supplierName: l.supplier_name,
    receivedDate: l.received_date,
    totalCostBdt: Number(l.unit_cost_bdt) * Number(l.quantity_received),
    totalCostQar: Number(l.unit_cost_bdt) * Number(l.quantity_received),
    totalItemsReceived: Number(l.quantity_received),
    notes: l.notes || '',
    items: [
      {
        productName: `Variant ${l.variant_id}`,
        variantSku: l.variant_id,
        size: 'Batch',
        color: 'Batch',
        qtyReceived: Number(l.quantity_received),
        unitCostBdt: Number(l.unit_cost_bdt),
        retailPriceBdt: Number(l.unit_cost_bdt) * 1.8,
      },
    ],
  }));
}

/**
 * Admin: Update order status via audited RPC.
 */
export async function updateOrderStatusRemote(
  orderId: string,
  newStatus: OrderStatus,
  accessToken: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/rpc/update_order_status_admin`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(accessToken),
    body: JSON.stringify({
      p_order_id: orderId,
      p_new_status: newStatus,
      p_notes: notes || null,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Admin: Verify bKash / Nagad payment via audited RPC.
 */
export async function verifyOrderPaymentRemote(
  orderId: string,
  accessToken: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/rpc/verify_order_payment_admin`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getHeaders(accessToken),
    body: JSON.stringify({
      p_order_id: orderId,
      p_notes: notes || null,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Admin: Record inbound inventory lot in PostgreSQL.
 */
export async function createInventoryLotRemote(
  lot: {
    lotNumber: string;
    variantId: string;
    quantityReceived: number;
    unitCostBdt: number;
    supplierName: string;
    notes?: string;
  },
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/inventory_lots`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...getHeaders(accessToken),
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      lot_number: lot.lotNumber,
      variant_id: lot.variantId,
      quantity_received: lot.quantityReceived,
      quantity_remaining: lot.quantityReceived,
      unit_cost_bdt: lot.unitCostBdt,
      supplier_name: lot.supplierName,
      notes: lot.notes || null,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  return { success: true };
}

/**
 * Admin: Persist regulatory site settings to PostgreSQL.
 */
export async function updateSiteSettingsRemote(
  settings: Partial<SiteSettings>,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/site_settings?key=eq.business_profile`;
  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: getHeaders(accessToken),
    body: JSON.stringify({
      value: {
        shop_name_en: settings.shopName_en,
        shop_name_bn: settings.shopName_bn,
        trade_license_no: settings.tradeLicenseNo,
        dbid_no: settings.dbidNo,
        tin_bin_no: settings.tinBinNo,
        support_phone: settings.supportPhone,
        support_whatsapp: settings.supportWhatsApp,
        support_email: settings.supportEmail,
        bkash_merchant_number: settings.bkashMerchantNumber,
        nagad_merchant_number: settings.nagadMerchantNumber,
      },
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  return { success: true };
}

