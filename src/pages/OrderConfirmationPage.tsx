import React, { useState, useEffect } from "react";
import { useRouter, Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { formatBdt, buildWhatsAppUrl } from "../utils/formatters";
import { isSafeUrl } from "../utils/security";
import {
  isSupabaseConfigured,
  getOrderStatusRemote,
  type RemoteOrderStatus,
} from "../services/supabaseClient";
import {
  CheckCircle2,
  MessageCircle,
  MapPin,
  Phone,
  Clock,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";

export const OrderConfirmationPage: React.FC = () => {
  const { segments } = useRouter();
  const orderId = segments[1];

  const { orders, lastPlacedOrder, isBn, siteSettings } = useStore();

  const localOrder =
    orders.find((o) => o.id === orderId) ||
    (lastPlacedOrder && lastPlacedOrder.id === orderId
      ? lastPlacedOrder
      : null);

  const shouldFetchRemote = Boolean(
    !localOrder && orderId && isSupabaseConfigured(),
  );
  const [remoteOrder, setRemoteOrder] = useState<RemoteOrderStatus | null>(
    null,
  );
  const [isLoadingRemote, setIsLoadingRemote] =
    useState<boolean>(shouldFetchRemote);

  useEffect(() => {
    let isMounted = true;
    if (shouldFetchRemote) {
      getOrderStatusRemote(orderId)
        .then((res) => {
          if (isMounted && res.found) {
            setRemoteOrder(res);
          }
        })
        .catch(() => {
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingRemote(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [shouldFetchRemote, orderId]);

  if (isLoadingRemote) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md animate-fade-in">
        <div className="w-12 h-12 rounded-full border-2 border-[#3E0713] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-600 font-semibold">
          {isBn
            ? "অর্ডার তথ্য যাচাই করা হচ্ছে..."
            : "Verifying order reference securely..."}
        </p>
      </div>
    );
  }

  const order =
    localOrder ||
    (remoteOrder && remoteOrder.found
      ? {
          id: remoteOrder.order_number || orderId,
          customerName: remoteOrder.customer_name || "Valued Shopper",
          customerPhone: remoteOrder.masked_phone || "",
          customerEmail: "confidential@velvetfashion.bd",
          zone: remoteOrder.zone_en || "Bangladesh Dispatch Zone",
          zone_bn: remoteOrder.zone_bn || "বাংলাদেশ ডেলিভারি এলাকা",
          zone_ar: remoteOrder.zone_bn || "বাংলাদেশ ডেলিভারি এলাকা",
          address: remoteOrder.masked_address || "Dhaka Destination",
          timeSlot: remoteOrder.time_slot || "Evening (3:00 PM - 8:00 PM)",
          paymentMethod: (remoteOrder.payment_method || "cod") as
            | "cod"
            | "bkash"
            | "nagad",
          paymentTrxId: undefined,
          items: (remoteOrder.items || []).map((i, idx) => ({
            id: `rem-item-${idx}`,
            variantId: `var-${idx}`,
            productName: i.product_name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            unitPriceBdt: i.unit_price_bdt,
            unitPriceQar: i.unit_price_bdt,
          })),
          subtotalBdt: remoteOrder.subtotal_bdt || 0,
          subtotalQar: remoteOrder.subtotal_bdt || 0,
          deliveryFeeBdt: remoteOrder.delivery_fee_bdt || 0,
          deliveryFeeQar: remoteOrder.delivery_fee_bdt || 0,
          discountBdt: 0,
          discountQar: 0,
          totalBdt: remoteOrder.total_bdt || 0,
          totalQar: remoteOrder.total_bdt || 0,
          status: (remoteOrder.status || "new") as "new",
          createdAt: remoteOrder.created_at || new Date().toISOString(),
        }
      : null);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md animate-fade-in">
        <Package className="w-16 h-16 text-[#C5A059] mx-auto mb-4" />
        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-2">
          {isBn ? "অর্ডারটি পাওয়া যায়নি" : "Order Not Found"}
        </h2>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          {isBn
            ? "অনুগ্রহ করে আপনার অর্ডার আইডি ও লিঙ্ক পুনরায় যাচাই করুন। নিরাপত্তার স্বার্থে অপরিচিত অর্ডার প্রদর্শন করা হয় না।"
            : "Please check your order reference. For security, orders are only accessible with a valid matching reference."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E0713] text-[#FAF8F5] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#520B1C] transition"
        >
          {isBn ? "হোমপেজে ফিরে যান" : "Return to Homepage"}
        </Link>
      </div>
    );
  }

  const orderTotal = order.totalBdt ?? order.totalQar ?? 0;
  const waOrderText = `Hello Velvet Fashion! I placed order #${order.id} for ৳${orderTotal} (${order.paymentMethod.toUpperCase()}). Customer: ${order.customerName}. Please confirm dispatch timing.`;
  const rawWaUrl = buildWhatsAppUrl(siteSettings.supportWhatsApp, waOrderText);
  const waUrl = isSafeUrl(rawWaUrl) ? rawWaUrl : "#";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl animate-fade-in print:hidden">
        <div className="bg-white rounded-3xl border border-[#ECE4D4] p-8 md:p-10 shadow-sm text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#88652A] block mb-1">
            {isBn
              ? "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে"
              : "ORDER RECEIVED & CONFIRMED"}
          </span>

          <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-[#24030B] mb-2">
            {isBn
              ? `ধন্যবাদ, ${order.customerName}`
              : `Thank You, ${order.customerName}`}
          </h1>

          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed mb-6">
            {isBn
              ? `আপনার অর্ডার #${order.id} প্রস্তুত করা হচ্ছে। ডেলিভারি রাইডার রওনা হওয়ার পূর্বে যোগাযোগ করবেন।`
              : `Your luxury package #${order.id} is being tailored & packed. Our courier will contact you upon dispatch.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {isBn
                  ? "হোয়াটসঅ্যাপে অর্ডার স্ট্যাটাস জানুন"
                  : "WhatsApp Concierge"}
              </span>
            </a>

            <button
              onClick={handlePrint}
              type="button"
              className="px-5 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#ECE4D4] text-stone-800 text-xs font-bold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4 text-[#88652A]" />
              <span>
                {isBn ? "রিসিপ্ট প্রিন্ট / সেভ করুন" : "Print Packing Slip"}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-[#FAF8F5] rounded-2xl border border-[#ECE4D4] p-6 mb-8">
          <h3 className="font-['Playfair_Display'] text-sm font-bold text-[#24030B] mb-4">
            {isBn
              ? "ডেলিভারি ট্র্যাকিং ধাপসমূহ:"
              : "Delivery Milestone Tracker:"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block me-1.5" />
              <strong className="text-emerald-900 block">
                {isBn ? "১. অর্ডার গৃহীত" : "1. Confirmed"}
              </strong>
              <span className="text-[10px] text-stone-500">
                {isBn ? "ঢাকা হাব" : "At Dhaka Hub"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#ECE4D4]">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block me-1.5" />
              <strong className="text-stone-800 block">
                {isBn ? "২. কোয়ালিটি চেক ও প্যাকিং" : "2. QC & Packing"}
              </strong>
              <span className="text-[10px] text-stone-500">
                {isBn ? "লাক্সারি গিফট বক্স" : "Luxury Gift Box"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#ECE4D4]">
              <span className="w-2 h-2 rounded-full bg-stone-300 inline-block me-1.5" />
              <strong className="text-stone-700 block">
                {isBn ? "৩. কুরিয়ারে হস্তান্তর" : "3. Out with Courier"}
              </strong>
              <span className="text-[10px] text-stone-500">
                {isBn ? order.zone_bn : order.zone}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#ECE4D4]">
              <span className="w-2 h-2 rounded-full bg-stone-300 inline-block me-1.5" />
              <strong className="text-stone-700 block">
                {isBn ? "৪. ডেলিভারি ও পরিশোধ" : "4. Delivered & Paid"}
              </strong>
              <span className="text-[10px] text-stone-500">
                {formatBdt(orderTotal, isBn ? "bn" : "en")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ECE4D4]">
            <div>
              <span className="text-[10px] text-stone-400 font-mono">
                ORDER ID
              </span>
              <h3 className="font-mono text-base font-bold text-[#3E0713]">
                #{order.id}
              </h3>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-stone-400">PAYMENT METHOD</span>
              <span className="block font-bold text-xs text-[#88652A]">
                {order.paymentMethod.toUpperCase()}
                {order.paymentTrxId && ` (TrxID: ${order.paymentTrxId})`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#88652A]" />
                <span>{isBn ? "ডেলিভারি ঠিকানা:" : "Delivery Address:"}</span>
              </div>
              <p className="font-semibold text-stone-900">
                {isBn ? order.zone_bn : order.zone}
              </p>
              <p className="text-stone-600">{order.address}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#88652A]" />
                <span>{isBn ? "ডেলিভারির সময়সূচি:" : "Delivery Window:"}</span>
              </div>
              <p className="font-semibold text-stone-900">{order.timeSlot}</p>
              <div className="flex items-center gap-1.5 text-stone-600 mt-1">
                <Phone className="w-3 h-3 text-[#88652A]" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ECE4D4]">
            <h4 className="font-bold text-xs text-stone-900 mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#88652A]" />
              <span>{isBn ? "অর্ডারের পণ্যসমূহ:" : "Ordered Garments:"}</span>
            </h4>
            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-stone-900">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {item.size} • {item.color} • {isBn ? "পরিমাণ:" : "Qty:"}{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-[#3E0713] font-['Plus_Jakarta_Sans']">
                    {formatBdt(
                      (item.unitPriceBdt ?? item.unitPriceQar ?? 0) *
                        item.quantity,
                      isBn ? "bn" : "en",
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#ECE4D4] space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{isBn ? "সাবটোটাল:" : "Subtotal:"}</span>
              <span className="font-semibold">
                {formatBdt(
                  order.subtotalBdt ?? order.subtotalQar ?? 0,
                  isBn ? "bn" : "en",
                )}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{isBn ? "ডেলিভারি ফি:" : "Courier Fee:"}</span>
              <span className="font-semibold">
                {(order.deliveryFeeBdt ?? order.deliveryFeeQar ?? 0) === 0
                  ? isBn
                    ? "ফ্রি"
                    : "FREE"
                  : formatBdt(
                      order.deliveryFeeBdt ?? order.deliveryFeeQar ?? 0,
                      isBn ? "bn" : "en",
                    )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#3E0713] pt-2 border-t border-[#ECE4D4]">
              <span>{isBn ? "মোট প্রদেয় মূল্য:" : "Total Amount Due:"}</span>
              <span className="font-['Plus_Jakarta_Sans']">
                {formatBdt(orderTotal, isBn ? "bn" : "en")}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#ECE4D4] flex items-center gap-2.5 text-[11px] text-stone-600">
            <ShieldCheck className="w-4 h-4 text-[#88652A] shrink-0" />
            <span>
              {isBn
                ? "বাংলাদেশ ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯ অনুসারে ৭ দিনের সহজ সাইজ ও ত্রুটিমুক্ত পণ্য এক্সচেঞ্জ সুবিধা।"
                : "7-day exchange window under Bangladesh Consumer Rights Protection Act 2009."}
            </span>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md"
          >
            <span>{isBn ? "আরো কেনাকাটা করুন" : "Continue Shopping"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="hidden print:block print:w-full print:p-8 font-sans text-stone-900 bg-white">
        <div className="border-b-2 border-[#3E0713] pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-[#3E0713]">
              VELVET FASHION
            </h1>
            <p className="text-xs text-stone-600">
              Dhaka Fulfillment Center • Order Dispatch Note
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-stone-100 border text-xs font-mono font-bold uppercase">
              {order.paymentMethod}
            </span>
            {order.paymentTrxId && (
              <p className="text-xs font-mono text-stone-600 mt-1">
                TrxID: {order.paymentTrxId}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-xs mb-6">
          <div>
            <p>
              <strong>Order ID:</strong> #{order.id}
            </p>
            <p>
              <strong>Date:</strong> {order.createdAt}
            </p>
            <p>
              <strong>Delivery Window:</strong> {order.timeSlot}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Customer:</strong> {order.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {order.customerPhone}
            </p>
            <p>
              <strong>Zone:</strong> {order.zone}
            </p>
          </div>
        </div>

        <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs mb-6">
          <strong>Delivery Destination:</strong>
          <p className="mt-1">{order.address}</p>
          {order.orderNotes && (
            <p className="mt-1 text-stone-600">
              <strong>Notes:</strong> {order.orderNotes}
            </p>
          )}
        </div>

        <table className="w-full text-xs border-collapse mb-6">
          <thead>
            <tr className="border-b border-stone-300 bg-stone-100">
              <th className="py-2 text-left">Item Description</th>
              <th className="py-2 text-left">Size</th>
              <th className="py-2 text-left">Color</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-stone-200">
                <td className="py-2 font-medium">{item.productName}</td>
                <td className="py-2">{item.size}</td>
                <td className="py-2">{item.color}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">
                  ৳{" "}
                  {(
                    (item.unitPriceBdt ?? item.unitPriceQar ?? 0) *
                    item.quantity
                  ).toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-xs space-y-1 mb-8">
          <p>
            Subtotal: ৳{" "}
            {(order.subtotalBdt ?? order.subtotalQar ?? 0).toFixed(0)}
          </p>
          <p>
            Courier Delivery Fee: ৳{" "}
            {(order.deliveryFeeBdt ?? order.deliveryFeeQar ?? 0).toFixed(0)}
          </p>
          <p className="text-sm font-bold text-[#3E0713] pt-2 border-t">
            Total Amount Due ({order.paymentMethod.toUpperCase()}): ৳{" "}
            {orderTotal.toFixed(0)}
          </p>
        </div>

        <div className="text-[10px] text-stone-500 border-t pt-4">
          <p>
            Velvet Fashion Ltd. • Trade License: {siteSettings.tradeLicenseNo} •
            DBID: {siteSettings.dbidNo}
          </p>
          <p>
            Customer Support: {siteSettings.supportPhone} | WhatsApp:{" "}
            {siteSettings.supportWhatsApp}
          </p>
        </div>
      </div>
    </>
  );
};
