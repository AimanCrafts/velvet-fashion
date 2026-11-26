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
  priceQar?: number;
  stockQty: number;
}

export interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  name_ar?: string;
  description_en: string;
  description_bn: string;
  description_ar?: string;
  audience: Audience;
  category: string;
  category_bn: string;
  category_ar?: string;
  collection: string;
  collection_bn: string;
  collection_ar?: string;
  imageUrl: string;
  additionalImages?: string[];
  status: 'live' | 'draft' | 'archived';
  variants: ProductVariant[];
  featured?: boolean;
  newArrival?: boolean;
  fabric_en: string;
  fabric_bn: string;
  fabric_ar?: string;
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
  name_ar?: string;
  feeBdt: number;
  feeQar?: number;
  eta_en: string;
  eta_bn: string;
  eta_ar?: string;
  freeAboveBdt: number;
  freeAboveQar?: number;
}

export interface OrderItem {
  id: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceBdt: number;
  unitPriceQar?: number;
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
  zone_ar?: string;
  address: string;
  timeSlot: string;
  paymentMethod: PaymentMethod;
  paymentTrxId?: string;
  items: OrderItem[];
  subtotalBdt: number;
  subtotalQar?: number;
  deliveryFeeBdt: number;
  deliveryFeeQar?: number;
  discountBdt: number;
  discountQar?: number;
  totalBdt: number;
  totalQar?: number;
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
  totalCostQar?: number;
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
    unitCostQar?: number;
    retailPriceQar?: number;
  }[];
}

export interface SiteSettings {
  shopName_en: string;
  shopName_bn: string;
  shopName_ar?: string;
  tradeLicenseNo: string;
  dbidNo: string;
  ecabMemberNo: string;
  tinBinNo: string;
  commercialRegistrationNo?: string;
  ecommerceLicenseNo?: string;
  supportPhone: string;
  supportWhatsApp: string;
  supportEmail: string;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  deliveryPromise_en: string;
  deliveryPromise_bn: string;
  deliveryPromise_ar?: string;
  returnPolicy_en: string;
  returnPolicy_bn: string;
  returnPolicy_ar?: string;
}
