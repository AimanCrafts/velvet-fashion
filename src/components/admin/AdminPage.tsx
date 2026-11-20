import React, { useState, useEffect } from "react";
import { Link } from "../../router/Router";
import { useStore } from "../../context/StoreContext";
import { formatBdt } from "../../utils/formatters";
import type { OrderStatus, LotRecord, Order } from "../../types";
import { maskPhone, maskAddress } from "../../utils/security";
import {
  isSupabaseConfigured,
  signInStaff,
  fetchStaffProfile,
  fetchAdminOrdersRemote,
  fetchAdminLotsRemote,
  updateOrderStatusRemote,
  verifyOrderPaymentRemote,
  createInventoryLotRemote,
  updateSiteSettingsRemote,
  type AdminOrderRecord,
} from "../../services/supabaseClient";
import {
  Truck,
  Boxes,
  ShieldCheck,
  Plus,
  Printer,
  ArrowRight,
  TrendingUp,
  Package,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export const AdminPage: React.FC = () => {
  const {
    isBn,
    orders,
    updateOrderStatus,
    lots,
    addLot,
    products,
    siteSettings,
    updateSiteSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"orders" | "lots" | "compliance">("orders");
  const [orderFilter, setOrderFilter] = useState<string>("all");

  // Staff Supabase Authentication State
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [staffSession, setStaffSession] = useState<{ email: string; role: string; token: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem("vf_staff_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);

    try {
      const authResult = await signInStaff(authEmail, authPassword);
      const profile = await fetchStaffProfile(authResult.user.id, authResult.access_token);
      
      const sessionData = {
        email: authResult.user.email,
        role: profile?.role || "staff",
        token: authResult.access_token,
      };

      setStaffSession(sessionData);
      sessionStorage.setItem("vf_staff_session", JSON.stringify(sessionData));
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleStaffLogout = () => {
    setStaffSession(null);
    sessionStorage.removeItem("vf_staff_session");
  };

  // Live PostgreSQL Remote Data State
  const [remoteOrders, setRemoteOrders] = useState<AdminOrderRecord[] | null>(null);
  const [remoteLots, setRemoteLots] = useState<LotRecord[] | null>(null);
  const [isLoadingRemoteData, setIsLoadingRemoteData] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadRemoteData = async () => {
    if (!staffSession?.token) return;
    setIsLoadingRemoteData(true);
    setActionMessage(null);
    try {
      const [fetchedOrders, fetchedLots] = await Promise.all([
        fetchAdminOrdersRemote(staffSession.token),
        fetchAdminLotsRemote(staffSession.token),
      ]);
      setRemoteOrders(fetchedOrders);
      if (fetchedLots && fetchedLots.length > 0) {
        setRemoteLots(fetchedLots);
      }
    } catch (err: unknown) {
      setActionMessage({
        text: err instanceof Error ? err.message : "Failed to load live data from Supabase",
        type: "error",
      });
    } finally {
      setIsLoadingRemoteData(false);
    }
  };

  useEffect(() => {
    if (!staffSession?.token) return;

    let isMounted = true;
    const token = staffSession.token;

    Promise.all([
      fetchAdminOrdersRemote(token),
      fetchAdminLotsRemote(token),
    ])
      .then(([fetchedOrders, fetchedLots]) => {
        if (!isMounted) return;
        setRemoteOrders(fetchedOrders);
        if (fetchedLots && fetchedLots.length > 0) {
          setRemoteLots(fetchedLots);
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setActionMessage({
          text: err instanceof Error ? err.message : "Failed to load live data from Supabase",
          type: "error",
        });
      });

    return () => {
      isMounted = false;
    };
  }, [staffSession?.token]);

  // Map remote PostgreSQL orders or fall back to local store orders
  const displayedOrders: Array<Order & { internalId?: string; paymentStatus?: string; customerAltPhone?: string }> = (staffSession && remoteOrders)
    ? remoteOrders.map((ro) => ({
        id: ro.order_number,
        internalId: ro.id,
        customerName: ro.customer_name,
        customerPhone: ro.customer_phone,
        customerAltPhone: ro.customer_alt_phone || undefined,
        customerEmail: ro.customer_email || "customer@velvetfashion.bd",
        zone: ro.zone_id,
        zone_bn: ro.zone_id,
        zone_ar: ro.zone_id,
        address: ro.customer_alt_phone
          ? `${ro.address} (বিকল্প: ${ro.customer_alt_phone})`
          : ro.address,
        timeSlot: ro.time_slot,
        paymentMethod: ro.payment_method,
        paymentTrxId: ro.payment_trx_id || undefined,
        paymentStatus: ro.payment_status,
        items: (ro.order_items || []).map((oi) => ({
          id: oi.id,
          variantId: oi.variant_id,
          productName: oi.product_name,
          size: oi.size,
          color: oi.color,
          quantity: oi.quantity,
          unitPriceBdt: oi.unit_price_bdt,
          unitPriceQar: oi.unit_price_bdt,
        })),
        subtotalBdt: ro.subtotal_bdt,
        subtotalQar: ro.subtotal_bdt,
        deliveryFeeBdt: ro.delivery_fee_bdt,
        deliveryFeeQar: ro.delivery_fee_bdt,
        discountBdt: ro.discount_bdt,
        discountQar: ro.discount_bdt,
        totalBdt: ro.total_bdt,
        totalQar: ro.total_bdt,
        status: ro.status,
        createdAt: ro.created_at.replace("T", " ").substring(0, 16),
        orderNotes: ro.order_notes || undefined,
      }))
    : orders.map((o) => ({ ...o, paymentStatus: o.paymentTrxId ? "pending" : "verified" }));

  const displayedLots = (staffSession && remoteLots) ? remoteLots : lots;

  const [revealedOrders, setRevealedOrders] = useState<Record<string, boolean>>({});
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  const [showLotModal, setShowLotModal] = useState(false);
  const [lotNum, setLotNum] = useState("LOT-BD-2026-802");
  const [supplier, setSupplier] = useState("");
  const [itemsQty, setItemsQty] = useState("50");
  const [totalCost, setTotalCost] = useState("150000");
  const [notes, setNotes] = useState("Seasonal silk-velvet batch arrived at Dhaka fulfillment center");

  const [settingsForm, setSettingsForm] = useState(siteSettings);

  const togglePii = (orderId: string) => {
    setRevealedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const totalRevenue = displayedOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totalBdt ?? o.totalQar ?? 0), 0);

  const totalStockUnits = products.reduce(
    (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.stockQty, 0),
    0
  );

  const pendingDeliveryCount = displayedOrders.filter((o) =>
    ["new", "confirmed", "packed", "out_for_delivery"].includes(o.status)
  ).length;

  const handleStatusChange = async (targetOrder: Order & { internalId?: string; paymentStatus?: string }, newStatus: OrderStatus) => {
    setActionMessage(null);

    if (["packed", "out_for_delivery", "delivered"].includes(newStatus) &&
        ["bkash", "nagad"].includes(targetOrder.paymentMethod) &&
        targetOrder.paymentStatus !== "verified") {
      setActionMessage({
        text: `Cannot set order #${targetOrder.id} to "${newStatus.toUpperCase()}" until ${targetOrder.paymentMethod.toUpperCase()} payment is verified.`,
        type: "error",
      });
      return;
    }

    if (staffSession?.token && targetOrder.internalId) {
      try {
        await updateOrderStatusRemote(targetOrder.internalId, newStatus, staffSession.token);
        setActionMessage({
          text: `Order #${targetOrder.id} updated to ${newStatus.toUpperCase()} in Supabase PostgreSQL`,
          type: "success",
        });
        await loadRemoteData();
      } catch (err: unknown) {
        setActionMessage({
          text: err instanceof Error ? err.message : "Failed to update order status",
          type: "error",
        });
        return;
      }
    }
    updateOrderStatus(targetOrder.id, newStatus);
  };

  const handleVerifyPayment = async (targetOrder: Order & { internalId?: string }) => {
    setActionMessage(null);
    if (!staffSession?.token || !targetOrder.internalId) {
      setActionMessage({
        text: `Order #${targetOrder.id} payment verified in local state`,
        type: "success",
      });
      return;
    }

    try {
      await verifyOrderPaymentRemote(targetOrder.internalId, staffSession.token);
      setActionMessage({
        text: `Payment for Order #${targetOrder.id} verified and audited successfully`,
        type: "success",
      });
      await loadRemoteData();
    } catch (err: unknown) {
      setActionMessage({
        text: err instanceof Error ? err.message : "Failed to verify payment",
        type: "error",
      });
    }
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim()) return;

    const costNum = parseFloat(totalCost) || 0;
    const qtyNum = parseInt(itemsQty, 10) || 1;

    if (staffSession?.token) {
      try {
        await createInventoryLotRemote({
          lotNumber: lotNum,
          variantId: "v-01-m-burg",
          quantityReceived: qtyNum,
          unitCostBdt: costNum / qtyNum,
          supplierName: supplier,
          notes,
        }, staffSession.token);
        setActionMessage({ text: `Lot ${lotNum} recorded in PostgreSQL inventory_lots table`, type: "success" });
        await loadRemoteData();
      } catch (err: unknown) {
        setActionMessage({ text: err instanceof Error ? err.message : "Failed to create lot in Supabase", type: "error" });
      }
    }

    const newRecord: LotRecord = {
      id: `lot-${Date.now()}`,
      lotNumber: lotNum,
      supplierName: supplier,
      receivedDate: new Date().toISOString().substring(0, 10),
      totalCostBdt: costNum,
      totalCostQar: costNum,
      totalItemsReceived: qtyNum,
      notes,
      items: [
        {
          productName: "Festive Sourced Batch Item",
          variantSku: `${lotNum}-SKU`,
          size: "M / L / 40",
          color: "Royal Burgundy",
          qtyReceived: qtyNum,
          unitCostBdt: costNum / qtyNum,
          retailPriceBdt: (costNum / qtyNum) * 2.2,
        },
      ],
    };

    addLot(newRecord);
    setShowLotModal(false);
    setSupplier("");
    setLotNum(`LOT-BD-2026-${Date.now().toString().slice(-3)}`);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (staffSession?.token) {
      try {
        await updateSiteSettingsRemote(settingsForm, staffSession.token);
        setActionMessage({ text: "Official business profile & regulatory credentials saved to Supabase", type: "success" });
      } catch (err: unknown) {
        setActionMessage({ text: err instanceof Error ? err.message : "Failed to persist site settings to PostgreSQL", type: "error" });
      }
    }
    updateSiteSettings(settingsForm);
  };

  const handlePrintSlip = (order: Order) => {
    setOrderToPrint(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredOrders = displayedOrders.filter((o) =>
    orderFilter === "all" ? true : o.status === orderFilter
  );

  if (isSupabaseConfigured() && !staffSession) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md animate-fade-in">
        <div className="bg-white rounded-3xl border border-[#ECE4D4] p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#3E0713]/10 border border-[#3E0713]/30 flex items-center justify-center mx-auto text-[#3E0713]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="font-['Cinzel'] tracking-widest text-lg font-bold text-[#3E0713] block">
              VELVET FASHION
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#88652A] uppercase font-bold block mt-0.5">
              STAFF & OPERATIONS PORTAL
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            {isBn
              ? "অভ্যন্তরীণ কর্মকর্তা পোর্টাল। অনুমোদিত কর্মকর্তা একাউন্ট দিয়ে লগইন করুন।"
              : "Restricted administrative zone. Access is strictly audited and authenticated via Supabase Auth & PostgreSQL RLS."}
          </p>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-start">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleStaffLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? "কর্মকর্তা ইমেইল" : "Staff Email"}
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@velvetfashion.com.bd"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-[#3E0713] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#520B1C] transition shadow-md disabled:opacity-50"
            >
              {isAuthLoading ? (isBn ? "যাচাই করা হচ্ছে..." : "Authenticating...") : (isBn ? "লগইন করুন" : "Sign In to Operations Hub")}
            </button>
          </form>

          <div className="pt-2">
            <Link to="/" className="text-xs text-stone-500 hover:text-stone-800 transition">
              ← {isBn ? "মূল ওয়েবসাইটে ফিরে যান" : "Return to Storefront"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in print:hidden">
        {!isSupabaseConfigured() && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Running in local preview mode. Configure Supabase environment variables to enable live database synchronization.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded shrink-0">
              PREVIEW MODE
            </span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ECE4D4]">
          <div className="flex items-center gap-3">
            <img
              src="/brand/velvet_emblem.jpg"
              alt="Velvet Seal"
              className="w-12 h-12 rounded-full border border-[#C5A059] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] tracking-widest text-lg font-bold text-[#3E0713]">
                  VELVET FASHION ADMIN
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3E0713] text-[#F4E2B5]">
                  DHAKA HUB
                </span>
                {isSupabaseConfigured() && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Fulfillment Logistics, Artisan Lot Inward & Regulatory Recordkeeping
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSupabaseConfigured() && staffSession && (
              <button
                type="button"
                onClick={handleStaffLogout}
                className="px-3.5 py-2 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition"
              >
                {isBn ? "লগআউট" : "Sign Out"}
              </button>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ECE4D4] hover:bg-[#FAF8F5] text-stone-700 text-xs font-semibold transition"
            >
              <span>{isBn ? "ওয়েবসাইটে যান" : "Storefront"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setShowLotModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isBn ? "নতুন লট ইনটেক" : "Receive Lot"}</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-[#ECE4D4] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Total Revenue
              </span>
              <TrendingUp className="w-4 h-4 text-[#88652A]" />
            </div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#3E0713]">
              {formatBdt(totalRevenue, isBn ? "bn" : "en")}
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Active COD & bKash orders included</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ECE4D4] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Pending Deliveries
              </span>
              <Truck className="w-4 h-4 text-[#88652A]" />
            </div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-stone-900">
              {pendingDeliveryCount} <span className="text-xs font-normal text-stone-500">Orders</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Scheduled for courier dispatch</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ECE4D4] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Stock Units
              </span>
              <Boxes className="w-4 h-4 text-[#88652A]" />
            </div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-stone-900">
              {totalStockUnits} <span className="text-xs font-normal text-stone-500">Pieces</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Across {products.length} catalog designs</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ECE4D4] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Statutory Status
              </span>
              <ShieldCheck className="w-4 h-4 text-[#88652A]" />
            </div>
            <div className="font-['Plus_Jakarta_Sans'] text-base font-bold text-stone-800">
              Credentials Pending
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">Awaiting official DBID verification</span>
          </div>
        </div>

        {/* Action Notification Banner */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
              actionMessage.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className="font-medium">{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-[11px] font-bold underline shrink-0 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs & Live Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE4D4] mb-6">
          <div className="flex items-center gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 px-1 uppercase tracking-wider transition border-b-2 ${
                activeTab === "orders"
                  ? "border-[#3E0713] text-[#3E0713]"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              Customer Orders ({displayedOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("lots")}
              className={`pb-3 px-1 uppercase tracking-wider transition border-b-2 ${
                activeTab === "lots"
                  ? "border-[#3E0713] text-[#3E0713]"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              Inventory & Sourced Lots ({displayedLots.length})
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`pb-3 px-1 uppercase tracking-wider transition border-b-2 ${
                activeTab === "compliance"
                  ? "border-[#3E0713] text-[#3E0713]"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              Store & Compliance Settings
            </button>
          </div>

          {staffSession && (
            <button
              onClick={loadRemoteData}
              disabled={isLoadingRemoteData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ECE4D4] hover:bg-[#FAF8F5] text-stone-700 text-xs font-semibold transition self-start sm:self-auto mb-2 sm:mb-0 disabled:opacity-50"
              title="Refresh live orders from Supabase PostgreSQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#88652A] ${isLoadingRemoteData ? "animate-spin" : ""}`} />
              <span>{isLoadingRemoteData ? "Refreshing..." : "Refresh Live Data"}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {[
                { id: "all", label: "All Orders" },
                { id: "new", label: "New" },
                { id: "confirmed", label: "Confirmed" },
                { id: "packed", label: "Packed" },
                { id: "out_for_delivery", label: "Out for Delivery" },
                { id: "delivered", label: "Delivered (Unverified)" },
                { id: "cancelled", label: "Cancelled" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    orderFilter === f.id
                      ? "bg-[#3E0713] text-white"
                      : "bg-white border border-[#ECE4D4] text-stone-700 hover:bg-[#FAF8F5]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#ECE4D4] text-xs text-stone-500">
                  No orders match the selected filter.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const totalDue = order.totalBdt ?? order.totalQar ?? 0;
                  const isRevealed = !!revealedOrders[order.id];
                  const isBkashOrNagad = ["bkash", "nagad"].includes(order.paymentMethod);
                  const isVerified = order.paymentStatus === "verified";

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#ECE4D4] p-5 shadow-2xs hover:border-[#88652A]/50 transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#3E0713]">
                            #{order.id}
                          </span>
                          <span className="text-xs text-stone-500">{order.createdAt}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#ECE4D4] text-stone-800 font-semibold">
                            {order.zone}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-stone-100 font-mono uppercase font-bold text-stone-700">
                            {order.paymentMethod}
                          </span>
                          {isBkashOrNagad && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isVerified
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}
                            >
                              {isVerified ? "Verified" : "Pending Verification"}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order, e.target.value as OrderStatus)
                            }
                            className="text-xs bg-[#FAF8F5] border border-[#E0D7C6] rounded-md px-2.5 py-1.5 font-bold text-stone-800 focus:outline-none"
                          >
                            <option value="new">NEW</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="packed">PACKED</option>
                            <option value="out_for_delivery">OUT FOR DELIVERY</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>

                          {isBkashOrNagad && !isVerified && (
                            <button
                              onClick={() => handleVerifyPayment(order)}
                              className="px-2.5 py-1.5 rounded-md bg-[#88652A] hover:bg-[#6e501f] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                              title="Reconcile and mark bKash/Nagad TrxID as verified"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify TrxID</span>
                            </button>
                          )}

                          <button
                            onClick={() => handlePrintSlip(order)}
                            className="p-1.5 rounded-md border border-[#ECE4D4] hover:bg-[#FAF8F5] text-stone-700 transition"
                            title="Print Packing Slip"
                          >
                            <Printer className="w-4 h-4 text-[#88652A]" />
                          </button>

                          <button
                            onClick={() => togglePii(order.id)}
                            className={`p-1.5 rounded-md border transition flex items-center gap-1 text-[11px] font-semibold ${
                              isRevealed
                                ? "border-amber-300 bg-amber-50 text-amber-900"
                                : "border-[#ECE4D4] hover:bg-[#FAF8F5] text-stone-600"
                            }`}
                            title={isRevealed ? "Hide details" : "Show full details"}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{isRevealed ? "Hide PII" : "View PII"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-stone-400 block mb-0.5 font-medium">Customer</span>
                          <p className="font-bold text-stone-900">{order.customerName}</p>
                          <p className="text-stone-600 font-mono">
                            {isRevealed ? order.customerPhone : maskPhone(order.customerPhone)}
                          </p>
                          {order.customerAltPhone && (
                            <p className="text-stone-500 font-mono text-[11px]">
                              Alt: {isRevealed ? order.customerAltPhone : maskPhone(order.customerAltPhone)}
                            </p>
                          )}
                          <p className="text-stone-500 text-[11px] truncate">{order.customerEmail}</p>
                        </div>

                        <div>
                          <span className="text-stone-400 block mb-0.5 font-medium">Destination</span>
                          <p className="text-stone-800 font-medium">
                            {isRevealed ? order.address : maskAddress(order.address)}
                          </p>
                          <p className="text-[11px] text-[#88652A] mt-0.5">{order.timeSlot}</p>
                        </div>

                        <div>
                          <span className="text-stone-400 block mb-0.5 font-medium">Items & Total</span>
                          <p className="text-stone-700">
                            {order.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join(", ")}
                          </p>
                          <p className="font-bold text-sm text-[#3E0713] mt-1 font-['Plus_Jakarta_Sans']">
                            Payable: {formatBdt(totalDue, isBn ? "bn" : "en")}
                            {order.paymentTrxId && (
                              <span className="text-[11px] text-amber-800 block font-normal">
                                {isVerified ? "Verified TrxID: " : "Unverified TrxID: "}
                                <strong className="font-mono">{order.paymentTrxId}</strong>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Inventory & Sourced Lots */}
        {activeTab === "lots" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#24030B]">
                Received Artisan Lots & Sourced Batches
              </h3>
              <button
                onClick={() => setShowLotModal(true)}
                className="px-4 py-2 rounded-full bg-[#3E0713] text-[#FAF8F5] text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Record Inward Lot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedLots.map((lot) => {
                const lotCost = lot.totalCostBdt ?? lot.totalCostQar ?? 0;
                return (
                  <div
                    key={lot.id}
                    className="bg-white rounded-2xl border border-[#ECE4D4] p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#88652A]" />
                        <span className="font-mono text-sm font-bold text-stone-900">
                          {lot.lotNumber}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">{lot.receivedDate}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-stone-400 block">Supplier</span>
                        <strong className="text-stone-800">{lot.supplierName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Total Items</span>
                        <strong className="text-stone-800">{lot.totalItemsReceived} units</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Total Lot Cost</span>
                        <strong className="text-[#3E0713]">৳ {lotCost.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Batch Notes</span>
                        <span className="text-stone-600 truncate block">{lot.notes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Store & Compliance Settings */}
        {activeTab === "compliance" && (
          <div className="bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-2xs space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#24030B]">
                Store Settings & Statutory Identifiers
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Configure contact endpoints and official business credentials. Fictitious credentials must not be published.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  DNCC Trade License Number (Placeholder)
                </label>
                <input
                  type="text"
                  value={settingsForm.tradeLicenseNo}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, tradeLicenseNo: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  DBID Registration Number (Placeholder)
                </label>
                <input
                  type="text"
                  value={settingsForm.dbidNo}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, dbidNo: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  bKash Merchant Account Number
                </label>
                <input
                  type="text"
                  value={settingsForm.bkashMerchantNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, bkashMerchantNumber: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nagad Merchant Account Number
                </label>
                <input
                  type="text"
                  value={settingsForm.nagadMerchantNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, nagadMerchantNumber: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Concierge WhatsApp Number
                </label>
                <input
                  type="text"
                  value={settingsForm.supportWhatsApp}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, supportWhatsApp: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Support Hotline
                </label>
                <input
                  type="text"
                  value={settingsForm.supportPhone}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, supportPhone: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Save Store Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Lot Creation Modal */}
        {showLotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-2xl">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#24030B] mb-4">
                Receive Sourced Lot at Dhaka Hub
              </h3>
              <form onSubmit={handleCreateLot} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Lot Tracking Reference</label>
                  <input
                    type="text"
                    required
                    value={lotNum}
                    onChange={(e) => setLotNum(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Supplier / Artisan Partner</label>
                  <input
                    type="text"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Supplier name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Total Garment Units</label>
                    <input
                      type="number"
                      required
                      value={itemsQty}
                      onChange={(e) => setItemsQty(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Total Landed Cost (BDT)</label>
                    <input
                      type="number"
                      required
                      value={totalCost}
                      onChange={(e) => setTotalCost(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Intake Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLotModal(false)}
                    className="px-4 py-2 border rounded-md text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3E0713] text-white rounded-md font-bold"
                  >
                    Confirm Intake
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Print slip template */}
      {orderToPrint && (
        <div className="hidden print:block print:w-full print:p-8 font-sans text-stone-900 bg-white">
          <div className="border-b-2 border-[#3E0713] pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-[#3E0713]">VELVET FASHION</h1>
              <p className="text-xs text-stone-600">Dhaka Central Fulfillment Hub • Official Dispatch Slip</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-stone-100 border text-xs font-mono font-bold uppercase">
                {orderToPrint.paymentMethod}
              </span>
              {orderToPrint.paymentTrxId && (
                <p className="text-xs font-mono text-stone-600 mt-1">TrxID: {orderToPrint.paymentTrxId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs mb-6">
            <div>
              <p><strong>Order ID:</strong> #{orderToPrint.id}</p>
              <p><strong>Created Date:</strong> {orderToPrint.createdAt}</p>
              <p><strong>Delivery Window:</strong> {orderToPrint.timeSlot}</p>
            </div>
            <div className="text-right">
              <p><strong>Customer:</strong> {orderToPrint.customerName}</p>
              <p><strong>Phone:</strong> {orderToPrint.customerPhone}</p>
              <p><strong>Zone:</strong> {orderToPrint.zone}</p>
            </div>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs mb-6">
            <strong>Delivery Destination:</strong>
            <p className="mt-1">{orderToPrint.address}</p>
            {orderToPrint.orderNotes && (
              <p className="mt-1 text-stone-600"><strong>Instructions:</strong> {orderToPrint.orderNotes}</p>
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
              {orderToPrint.items.map((item) => (
                <tr key={item.id} className="border-b border-stone-200">
                  <td className="py-2 font-medium">{item.productName}</td>
                  <td className="py-2">{item.size}</td>
                  <td className="py-2">{item.color}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">
                    ৳ {((item.unitPriceBdt ?? item.unitPriceQar ?? 0) * item.quantity).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right text-xs space-y-1 mb-8">
            <p>Subtotal: ৳ {(orderToPrint.subtotalBdt ?? orderToPrint.subtotalQar ?? 0).toFixed(0)}</p>
            <p>Delivery Fee: ৳ {(orderToPrint.deliveryFeeBdt ?? orderToPrint.deliveryFeeQar ?? 0).toFixed(0)}</p>
            <p className="text-sm font-bold text-[#3E0713] pt-2 border-t">
              Total Payable ({orderToPrint.paymentMethod.toUpperCase()}): ৳ {(orderToPrint.totalBdt ?? orderToPrint.totalQar ?? 0).toFixed(0)}
            </p>
          </div>

          <div className="text-[10px] text-stone-500 border-t pt-4">
            <p>Velvet Fashion • Trade License: {siteSettings.tradeLicenseNo} • DBID: {siteSettings.dbidNo}</p>
            <p>Handover to designated courier partner. Exchange policy: 7 days under Bangladesh Consumer Rights Protection Act 2009.</p>
          </div>
        </div>
      )}
    </>
  );
};
