import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter } from "../../router/Router";
import { ShieldCheck, SlidersHorizontal, Wrench, X, Globe, Sparkles } from "lucide-react";

export const DemoDock: React.FC = () => {
  const { navigate } = useRouter();
  const {
    isBn,
    toggleLang,
    setIsDesignSystemOpen,
    placeOrder,
    products,
    deliveryZones,
  } = useStore();

  const [open, setOpen] = useState(false);

  // Quick simulate a live order to showcase real-time order tracking
  const handleSimulateOrder = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomVariant = randomProduct.variants[0];
    const randomZone = deliveryZones[0];
    const price = randomVariant.priceBdt ?? randomVariant.priceQar ?? 4800;

    const testOrder = {
      id: `VF-BD-${Math.floor(2000 + Math.random() * 7000)}`,
      customerName: isBn ? "ডেমো গ্রাহক" : "Demo Customer",
      customerPhone: "+880 1700 000000",
      customerEmail: "demo.customer@example.com",
      zone: randomZone.name_en,
      zone_bn: randomZone.name_bn,
      zone_ar: randomZone.name_bn,
      address: "House 00, Road 00, Dhaka Metro Demo Zone",
      timeSlot: "Evening (3:00 PM - 8:00 PM)",
      paymentMethod: "cod" as const,
      items: [
        {
          id: `item-${Date.now()}`,
          variantId: randomVariant.id,
          productName: randomProduct.name_en,
          size: randomVariant.size,
          color: randomVariant.color,
          quantity: 1,
          unitPriceBdt: price,
          unitPriceQar: price,
        },
      ],
      subtotalBdt: price,
      subtotalQar: price,
      deliveryFeeBdt: 0,
      deliveryFeeQar: 0,
      discountBdt: 0,
      discountQar: 0,
      totalBdt: price,
      totalQar: price,
      status: "new" as const,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      orderNotes: "Call before arrival, gate security has clearance.",
    };

    placeOrder(testOrder);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 start-5 z-40 print:hidden">
      {open && (
        <div className="mb-2 w-56 rounded-2xl border border-[#C5A059]/50 bg-[#24030B]/95 p-2 shadow-2xl backdrop-blur-md animate-fade-in space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E6C87C] border-b border-white/10">
            {isBn ? "ডেমো টুলস" : "Demo Controls"}
          </div>

          <button
            onClick={() => {
              navigate("/admin");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-xs font-semibold text-[#FAF8F5] transition hover:bg-white/10"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
              <span>{isBn ? "অ্যাডমিন ড্যাশবোর্ড" : "Staff Admin"}</span>
            </div>
            <span className="text-[9px] font-mono text-stone-400 bg-white/10 px-1.5 py-0.5 rounded">
              Auth
            </span>
          </button>

          <button
            onClick={() => {
              setIsDesignSystemOpen(true);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-xs font-semibold text-[#FAF8F5] transition hover:bg-white/10"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#C5A059]" />
            <span>{isBn ? "ব্র্যান্ড ও ডিজাইন গাইড" : "Brand Guidelines"}</span>
          </button>

          <button
            onClick={() => {
              toggleLang();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-xs font-semibold text-[#FAF8F5] transition hover:bg-white/10"
          >
            <Globe className="h-4 w-4 text-[#C5A059]" />
            <span>{isBn ? "Switch to English" : "বাংলা ভাষায় দেখুন"}</span>
          </button>

          <div className="pt-1 border-t border-white/10">
            <button
              onClick={handleSimulateOrder}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-xs font-bold text-amber-300 transition hover:bg-white/10"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>{isBn ? "নতুন অর্ডার ডেমো (COD)" : "Simulate Live COD Order"}</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-[#C5A059]/60 bg-[#3E0713] px-4 py-2.5 text-xs font-bold text-[#F4E2B5] shadow-xl transition hover:bg-[#520B1C] active:scale-95 group"
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <Wrench className="h-4 w-4 text-[#C5A059] group-hover:rotate-45 transition-transform" />
        )}
        <span>{isBn ? "ডেমো ডক" : "Demo Dock"}</span>
      </button>
    </div>
  );
};
