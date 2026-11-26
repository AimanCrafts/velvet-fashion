export type Language = 'en' | 'bn';

export type Audience = 'all' | 'men' | 'women' | 'kids' | 'unisex';

export type OccasionFilter = 'all' | 'wedding' | 'festive' | 'evening' | 'everyday';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  priceBdt: number;
  priceQar?: number; // legacy alias
  stockQty: number;
}

export interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  name_ar?: string; // legacy alias
  description_en: string;
  description_bn: string;
  description_ar?: string; // legacy alias
  audience: Audience;
  category: string;
  category_bn: string;
  category_ar?: string; // legacy alias
  collection: string;
  collection_bn: string;
  collection_ar?: string; // legacy alias
  imageUrl: string;
  additionalImages?: string[];
  status: 'live' | 'draft' | 'archived';
  variants: ProductVariant[];
  featured?: boolean;
  newArrival?: boolean;
  fabric_en: string;
  fabric_bn: string;
  fabric_ar?: string; // legacy alias
  occasions?: Exclude<OccasionFilter, 'all'>[];
  editorialNote_en?: string;
  editorialNote_bn?: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  name_en: string;
  name_bn: string;
  name_ar?: string; // legacy alias
  feeBdt: number;
  feeQar?: number; // legacy alias
  eta_en: string;
  eta_bn: string;
  eta_ar?: string; // legacy alias
  freeAboveBdt: number;
  freeAboveQar?: number; // legacy alias
}

export interface OrderItem {
  id: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceBdt: number;
  unitPriceQar?: number; // legacy alias
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card_online';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  zone: string;
  zone_bn: string;
  zone_ar?: string; // legacy alias
  address: string;
  timeSlot: string;
  paymentMethod: PaymentMethod;
  paymentTrxId?: string;
  items: OrderItem[];
  subtotalBdt: number;
  subtotalQar?: number; // legacy alias
  deliveryFeeBdt: number;
  deliveryFeeQar?: number; // legacy alias
  discountBdt: number;
  discountQar?: number; // legacy alias
  totalBdt: number;
  totalQar?: number; // legacy alias
  status: OrderStatus;
  createdAt: string;
  orderNotes?: string;
}

export interface LotRecord {
  id: string;
  lotNumber: string;
  supplierName: string;
  receivedDate: string;
  totalCostBdt: number;
  totalCostQar?: number; // legacy alias
  totalItemsReceived: number;
  notes: string;
  items: {
    productName: string;
    variantSku: string;
    size: string;
    color: string;
    qtyReceived: number;
    unitCostBdt: number;
    retailPriceBdt: number;
    unitCostQar?: number; // legacy alias
    retailPriceQar?: number; // legacy alias
  }[];
}

export interface SiteSettings {
  shopName_en: string;
  shopName_bn: string;
  shopName_ar?: string; // legacy alias
  tradeLicenseNo: string;
  dbidNo: string;
  ecabMemberNo: string;
  tinBinNo: string;
  commercialRegistrationNo?: string; // legacy alias
  ecommerceLicenseNo?: string; // legacy alias
  supportPhone: string;
  supportWhatsApp: string;
  supportEmail: string;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  deliveryPromise_en: string;
  deliveryPromise_bn: string;
  deliveryPromise_ar?: string; // legacy alias
  returnPolicy_en: string;
  returnPolicy_bn: string;
  returnPolicy_ar?: string; // legacy alias
}
