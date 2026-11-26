import React, { createContext, useState, useEffect } from 'react';
import type {
  Language,
  Audience,
  OccasionFilter,
  Product,
  CartItem,
  Order,
  ProductVariant,
  LotRecord,
  OrderStatus,
  SiteSettings,
  DeliveryZone,
  PaymentMethod,
} from '../types';
import {
  coreProducts,
  deliveryZones,
  initialLots,
  initialOrders,
  initialSiteSettings,
} from '../data/storeData';
import { additionalProducts } from '../data/catalog';
import {
  isSupabaseConfigured,
  createOrderRemote,
  fetchProductsRemote,
  fetchDeliveryZonesRemote,
  fetchSiteSettingsRemote,
} from '../services/supabaseClient';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
}

export interface StoreContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isBn: boolean;
  isAr: boolean;

  products: Product[];
  activeAudience: Audience;
  setActiveAudience: (aud: Audience) => void;
  activeOccasion: OccasionFilter;
  setActiveOccasion: (occ: OccasionFilter) => void;
  wishlistOnly: boolean;
  setWishlistOnly: (only: boolean) => void;
  inStockOnly: boolean;
  setInStockOnly: (only: boolean) => void;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'newest') => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (p: Product | null) => void;

  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  recentlyViewed: string[];
  pushRecentlyViewed: (id: string) => void;

  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateCartQty: (variantId: string, delta: number) => void;
  removeCartItem: (variantId: string) => void;
  clearCart: () => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  deliveryZones: DeliveryZone[];
  orders: Order[];
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  placeOrder: (order: Order) => void;
  submitOrderSecure: (orderInput: {
    customerName: string;
    customerPhone: string;
    customerAltPhone?: string;
    customerEmail?: string;
    zoneId: string;
    address: string;
    timeSlot: string;
    paymentMethod: PaymentMethod;
    paymentTrxId?: string;
    orderNotes?: string;
    idempotencyKey?: string;
  }) => Promise<{ success: boolean; orderId: string; lookupToken?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  lots: LotRecord[];
  addLot: (lot: LotRecord) => void;

  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;
  isDesignSystemOpen: boolean;
  setIsDesignSystemOpen: (open: boolean) => void;

  toast: ToastMessage | null;
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

let demoOrderCounter = 1000;
const generateDemoOrderId = (): string => {
  demoOrderCounter += 1;
  return `VF-BD-${demoOrderCounter}`;
};

const generateLineItemId = (index: number): string => {
  return `item-${Date.now()}-${index}`;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [activeAudience, setActiveAudience] = useState<Audience>('all');
  const [activeOccasion, setActiveOccasion] = useState<OccasionFilter>('all');
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);

  const resetFilters = () => {
    setActiveAudience('all');
    setActiveOccasion('all');
    setWishlistOnly(false);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const [products, setProducts] = useState<Product[]>([...coreProducts, ...additionalProducts]);
  const [activeDeliveryZones, setActiveDeliveryZones] = useState<DeliveryZone[]>(deliveryZones);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('vf_customer_orders');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) return [...(parsed as Order[]), ...initialOrders];
      }
    } catch {
      return initialOrders;
    }
    return initialOrders;
  });
  const [lots, setLots] = useState<LotRecord[]>(initialLots);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;
    Promise.allSettled([
      fetchProductsRemote(),
      fetchDeliveryZonesRemote(),
      fetchSiteSettingsRemote(),
    ]).then(([prodRes, zoneRes, setRes]) => {
      if (!isMounted) return;

      if (prodRes.status === 'fulfilled' && prodRes.value && prodRes.value.length > 0) {
        const enriched = prodRes.value.map((remoteProd) => {
          const fallback = [...coreProducts, ...additionalProducts].find((sp) => sp.id === remoteProd.id);
          return {
            ...remoteProd,
            additionalImages: remoteProd.additionalImages ?? fallback?.additionalImages,
            occasions: remoteProd.occasions ?? fallback?.occasions,
            editorialNote_en: remoteProd.editorialNote_en ?? fallback?.editorialNote_en,
            editorialNote_bn: remoteProd.editorialNote_bn ?? fallback?.editorialNote_bn,
          };
        });
        setProducts(enriched);
      }
      if (zoneRes.status === 'fulfilled' && zoneRes.value && zoneRes.value.length > 0) {
        setActiveDeliveryZones(zoneRes.value);
      }
      if (setRes.status === 'fulfilled' && setRes.value) {
        setSiteSettings((prev) => ({ ...prev, ...setRes.value }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const customerOrders = orders.filter((o) => !initialOrders.some((init) => init.id === o.id));
      localStorage.setItem('vf_customer_orders', JSON.stringify(customerOrders));
    } catch {
      return;
    }
  }, [orders]);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vf_wishlist');
      if (!stored) return [];
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('vf_wishlist', JSON.stringify(wishlist));
    } catch {
      return;
    }
  }, [wishlist]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  const [toast, setToast] = useState<ToastMessage | null>(null);

  const isBn = lang === 'bn';
  const isAr = isBn;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ id: String(Date.now()), title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((x) => x !== id) : [...prev, id];
      showToast(
        exists
          ? (isBn ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from Wishlist')
          : (isBn ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'Added to Wishlist'),
        undefined,
        'info'
      );
      return updated;
    });
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const pushRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (variant.stockQty <= 0) {
      showToast(
        isBn ? 'স্টক শেষ হয়ে গেছে' : 'Out of Stock',
        isBn ? 'দুঃখিত, এই সাইজ বা ভেরিয়েন্টটি বর্তমানে শেষ' : 'Sorry, this item is currently unavailable',
        'error'
      );
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, variant.stockQty);
        return prev.map((item) =>
          item.variant.id === variant.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, variant, quantity }];
    });

    showToast(
      isBn ? 'ব্যাগ-এ যুক্ত হয়েছে' : 'Added to Bag',
      `${isBn ? product.name_bn : product.name_en} (${variant.size} • ${variant.color})`,
      'success'
    );
    setIsCartOpen(true);
  };

  const updateCartQty = (variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.variant.id === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeCartItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const clearCart = () => setCartItems([]);

  const placeOrder = (order: Order) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({
        ...p,
        variants: p.variants.map((v) => {
          const matchedLine = order.items.find((item) => item.variantId === v.id);
          if (matchedLine) {
            return {
              ...v,
              stockQty: Math.max(0, v.stockQty - matchedLine.quantity),
            };
          }
          return v;
        }),
      }))
    );

    setOrders((prev) => [order, ...prev]);
    clearCart();
    setLastPlacedOrder(order);
    showToast(
      isBn ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে' : 'Order Placed Successfully',
      `#${order.id} • ${order.paymentMethod === 'cod' ? (isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery') : (isBn ? 'অনলাইন পেমেন্ট' : 'Online Payment')}`,
      'success'
    );
  };

  const submitOrderSecure = async (orderInput: {
    customerName: string;
    customerPhone: string;
    customerAltPhone?: string;
    customerEmail?: string;
    zoneId: string;
    address: string;
    timeSlot: string;
    paymentMethod: PaymentMethod;
    paymentTrxId?: string;
    orderNotes?: string;
    idempotencyKey?: string;
  }): Promise<{ success: boolean; orderId: string; lookupToken?: string; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const remoteResult = await createOrderRemote({
          customer_name: orderInput.customerName,
          customer_phone: orderInput.customerPhone,
          customer_alt_phone: orderInput.customerAltPhone,
          customer_email: orderInput.customerEmail,
          zone_id: orderInput.zoneId,
          address: orderInput.address,
          time_slot: orderInput.timeSlot,
          payment_method: orderInput.paymentMethod,
          payment_trx_id: orderInput.paymentTrxId,
          order_notes: orderInput.orderNotes,
          idempotency_key: orderInput.idempotencyKey,
          items: cartItems.map((i) => ({ variant_id: i.variant.id, quantity: i.quantity })),
        });

        const zone = activeDeliveryZones.find((z) => z.id === orderInput.zoneId) || activeDeliveryZones[0];
        const confirmedOrder: Order = {
          id: remoteResult.order_number,
          customerName: orderInput.customerName,
          customerPhone: orderInput.customerPhone,
          customerEmail: orderInput.customerEmail || 'customer@velvetfashion.bd',
          zone: zone.name_en,
          zone_bn: zone.name_bn,
          zone_ar: zone.name_bn,
          address: orderInput.customerAltPhone
            ? `${orderInput.address} (বিকল্প: ${orderInput.customerAltPhone})`
            : orderInput.address,
          timeSlot: orderInput.timeSlot,
          paymentMethod: orderInput.paymentMethod,
          paymentTrxId: orderInput.paymentTrxId,
          items: cartItems.map((i, idx) => ({
            id: generateLineItemId(idx),
            variantId: i.variant.id,
            productName: i.product.name_en,
            size: i.variant.size,
            color: i.variant.color,
            quantity: i.quantity,
            unitPriceBdt: i.variant.priceBdt ?? i.variant.priceQar ?? 0,
            unitPriceQar: i.variant.priceBdt ?? i.variant.priceQar ?? 0,
          })),
          subtotalBdt: remoteResult.subtotal_bdt,
          subtotalQar: remoteResult.subtotal_bdt,
          deliveryFeeBdt: remoteResult.delivery_fee_bdt,
          deliveryFeeQar: remoteResult.delivery_fee_bdt,
          discountBdt: 0,
          discountQar: 0,
          totalBdt: remoteResult.total_bdt,
          totalQar: remoteResult.total_bdt,
          status: 'new',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          orderNotes: orderInput.orderNotes,
        };

        setProducts((prevProducts) =>
          prevProducts.map((p) => ({
            ...p,
            variants: p.variants.map((v) => {
              const matchedItem = cartItems.find((item) => item.variant.id === v.id);
              if (matchedItem) {
                return {
                  ...v,
                  stockQty: Math.max(0, v.stockQty - matchedItem.quantity),
                };
              }
              return v;
            }),
          }))
        );

        setOrders((prev) => [confirmedOrder, ...prev]);
        setLastPlacedOrder(confirmedOrder);
        clearCart();

        showToast(
          isBn ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে' : 'Order Placed Successfully',
          `#${remoteResult.order_number} • ৳${remoteResult.total_bdt}`,
          'success'
        );

        return {
          success: true,
          orderId: remoteResult.order_number,
          lookupToken: remoteResult.lookup_token,
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to place order';
        return { success: false, orderId: '', error: errorMsg };
      }
    }

    const orderId = generateDemoOrderId();
    const zone = activeDeliveryZones.find((z) => z.id === orderInput.zoneId) || activeDeliveryZones[0];
    const freeThreshold = zone.freeAboveBdt ?? zone.freeAboveQar ?? 3000;
    const fee = cartSubtotal >= freeThreshold ? 0 : (zone.feeBdt ?? zone.feeQar ?? 70);
    const total = cartSubtotal + fee;

    const demoOrder: Order = {
      id: orderId,
      customerName: orderInput.customerName,
      customerPhone: orderInput.customerPhone,
      customerEmail: orderInput.customerEmail || 'customer@velvetfashion.bd',
      zone: zone.name_en,
      zone_bn: zone.name_bn,
      zone_ar: zone.name_bn,
      address: orderInput.customerAltPhone
        ? `${orderInput.address} (বিকল্প: ${orderInput.customerAltPhone})`
        : orderInput.address,
      timeSlot: orderInput.timeSlot,
      paymentMethod: orderInput.paymentMethod,
      paymentTrxId: orderInput.paymentTrxId,
      items: cartItems.map((i, idx) => ({
        id: generateLineItemId(idx),
        variantId: i.variant.id,
        productName: i.product.name_en,
        size: i.variant.size,
        color: i.variant.color,
        quantity: i.quantity,
        unitPriceBdt: i.variant.priceBdt ?? i.variant.priceQar ?? 0,
        unitPriceQar: i.variant.priceBdt ?? i.variant.priceQar ?? 0,
      })),
      subtotalBdt: cartSubtotal,
      subtotalQar: cartSubtotal,
      deliveryFeeBdt: fee,
      deliveryFeeQar: fee,
      discountBdt: 0,
      discountQar: 0,
      totalBdt: total,
      totalQar: total,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      orderNotes: orderInput.orderNotes,
    };

    placeOrder(demoOrder);
    return { success: true, orderId };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(
      'Order Status Updated',
      `#${orderId} is now ${status.replace('_', ' ').toUpperCase()}`,
      'info'
    );
  };

  const addLot = (lot: LotRecord) => {
    setLots((prev) => [lot, ...prev]);
    showToast(
      'Lot Intake Completed',
      `${lot.lotNumber} (${lot.totalItemsReceived} units) added to inventory`,
      'success'
    );
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    showToast('Settings Saved', 'Trade license, DBID & store details updated', 'success');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.variant.priceBdt ?? item.variant.priceQar ?? 0) * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        isBn,
        isAr,
        products,
        activeAudience,
        setActiveAudience,
        activeOccasion,
        setActiveOccasion,
        wishlistOnly,
        setWishlistOnly,
        inStockOnly,
        setInStockOnly,
        resetFilters,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedProductForQuickView,
        setSelectedProductForQuickView,
        wishlist,
        toggleWishlist,
        isWishlisted,
        recentlyViewed,
        pushRecentlyViewed,
        cartItems,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        addToCart,
        updateCartQty,
        removeCartItem,
        clearCart,
        deliveryZones: activeDeliveryZones,
        orders,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,
        submitOrderSecure,
        updateOrderStatus,
        lots,
        addLot,
        siteSettings,
        updateSiteSettings,
        isDesignSystemOpen,
        setIsDesignSystemOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { useStore } from './useStore';
