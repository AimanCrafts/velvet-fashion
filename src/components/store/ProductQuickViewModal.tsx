import React, { useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { formatBdt, buildWhatsAppUrl } from "../../utils/formatters";
import type { Product, ProductVariant } from "../../types";
import { X, ShoppingBag, MessageCircle, Sparkles, Ruler, Boxes, ShieldCheck } from "lucide-react";

export const ProductQuickViewModal: React.FC = () => {
  const { selectedProductForQuickView } = useStore();
  if (!selectedProductForQuickView) return null;

  return (
    <QuickViewContent
      key={selectedProductForQuickView.id}
      product={selectedProductForQuickView}
    />
  );
};

const QuickViewContent: React.FC<{ product: Product }> = ({ product }) => {
  const { setSelectedProductForQuickView, addToCart, isBn, siteSettings } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProductForQuickView(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [setSelectedProductForQuickView]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"fabric" | "sizing" | "provenance">("fabric");
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);

  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.colorHex, { name: v.color, hex: v.colorHex }])
    ).values()
  );

  const galleryImages = [
    product.imageUrl,
    ...(product.additionalImages || []),
  ];

  const handleSelectSize = (size: string) => {
    const match =
      product.variants.find(
        (v) => v.size === size && v.colorHex === selectedVariant.colorHex
      ) || product.variants.find((v) => v.size === size);
    if (match) setSelectedVariant(match);
  };

  const handleSelectColor = (hex: string) => {
    const match =
      product.variants.find(
        (v) => v.colorHex === hex && v.size === selectedVariant.size
      ) || product.variants.find((v) => v.colorHex === hex);
    if (match) setSelectedVariant(match);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, selectedQty);
    setSelectedProductForQuickView(null);
  };

  const currentPrice = selectedVariant.priceBdt ?? selectedVariant.priceQar ?? 0;
  const waText = `Inquiry regarding "${product.name_en}" (SKU: ${selectedVariant.sku}, Size: ${selectedVariant.size}, Color: ${selectedVariant.color}). Price: ৳${currentPrice}. Is it ready for Dhaka delivery?`;
  const waUrl = buildWhatsAppUrl(siteSettings.supportWhatsApp, waText);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] rounded-2xl max-w-4xl w-full border border-[#ECE4D4] shadow-2xl overflow-hidden my-4">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForQuickView(null)}
          className="absolute top-4 end-4 z-20 bg-white/80 hover:bg-white text-stone-800 p-1.5 rounded-full shadow-md transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column (5 cols): Photo & Gallery */}
          <div className="md:col-span-5 bg-[#F7F3EA] p-4 flex flex-col justify-between">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#ECE4D4] bg-white shadow-xs">
              <img
                src={activeImage}
                alt={isBn ? product.name_bn : product.name_en}
                onError={(e) => {
                  e.currentTarget.src = "/brand/velvet_emblem.jpg";
                }}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 start-3">
                <span className="bg-[#3E0713] text-[#F4E2B5] text-[10px] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-xs shadow-md border border-[#C5A059]/40">
                  {isBn ? product.collection_bn : product.collection}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails (if multiple images) */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                      activeImage === imgUrl
                        ? "border-[#C5A059] shadow-sm"
                        : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Information, Specs & Actions */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#A8813B] uppercase tracking-wider mb-1 font-semibold">
                <span>{isBn ? product.category_bn : product.category}</span>
                <span className="font-mono text-stone-400">{selectedVariant.sku}</span>
              </div>

              <h2 className="font-['Playfair_Display'] text-xl sm:text-2xl font-normal text-[#24030B] leading-tight">
                {isBn ? product.name_bn : product.name_en}
              </h2>

              {/* Price & Delivery Badge */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#3E0713] font-['Plus_Jakarta_Sans']">
                  {formatBdt(currentPrice, isBn ? "bn" : "en")}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {isBn ? "ক্যাশ অন ডেলিভারি ও বিকাশ প্রযোজ্য" : "Cash on Delivery & bKash Eligible"}
                </span>
              </div>

              {/* Specification Tabs */}
              <div className="mt-4 border-b border-[#ECE4D4] flex gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("fabric")}
                  className={`pb-2 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === "fabric"
                      ? "border-[#3E0713] text-[#3E0713]"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{isBn ? "ফ্যাব্রিক ও ডিজাইন" : "Fabric & Design"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("sizing")}
                  className={`pb-2 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === "sizing"
                      ? "border-[#3E0713] text-[#3E0713]"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{isBn ? "সাইজ গাইড" : "Size Guide"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("provenance")}
                  className={`pb-2 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === "provenance"
                      ? "border-[#3E0713] text-[#3E0713]"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{isBn ? "উৎপাদন ও মান" : "Artisan Provenance"}</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="py-3 text-xs text-stone-600 min-h-[90px]">
                {activeTab === "fabric" && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-stone-800">
                      {isBn ? "ফ্যাব্রিকের বিবরণ:" : "Textile Composition:"}{" "}
                      <span className="font-normal">{isBn ? product.fabric_bn : product.fabric_en}</span>
                    </p>
                    <p className="leading-relaxed">
                      {isBn ? product.description_bn : product.description_en}
                    </p>
                    <p className="text-[11px] text-stone-500 pt-1">
                      {isBn ? "যত্ন: কোমল ড্রাই ক্লিন করার পরামর্শ দেওয়া হচ্ছে।" : "Care: Gentle dry clean recommended to preserve velvet texture."}
                    </p>
                  </div>
                )}

                {activeTab === "sizing" && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-stone-800">
                      {isBn ? "স্ট্যান্ডার্ড সাইজ চার্ট:" : "Standard Measurements:"}
                    </p>
                    <div className="grid grid-cols-4 gap-1 text-center font-mono text-[11px] bg-white p-2 rounded border border-[#ECE4D4]">
                      <span className="bg-stone-100 p-1 font-bold">Size</span>
                      <span className="bg-stone-100 p-1">Chest</span>
                      <span className="bg-stone-100 p-1">Length</span>
                      <span className="bg-stone-100 p-1">Sleeve</span>
                      <span className="p-1 font-bold">38 (S)</span>
                      <span className="p-1">38"</span>
                      <span className="p-1">40"</span>
                      <span className="p-1">24.5"</span>
                      <span className="p-1 font-bold">40 (M)</span>
                      <span className="p-1">40"</span>
                      <span className="p-1">42"</span>
                      <span className="p-1">25"</span>
                      <span className="p-1 font-bold">42 (L)</span>
                      <span className="p-1">42"</span>
                      <span className="p-1">44"</span>
                      <span className="p-1">25.5"</span>
                    </div>
                  </div>
                )}

                {activeTab === "provenance" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span className="font-semibold text-stone-800">
                        {isBn ? "আসল কারিগরি ও মান নিয়ন্ত্রণ" : "Handcrafted Artisan Batch"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {isBn
                        ? "সীমিত সংস্করণের এই পোশাকগুলো বিশেষ দক্ষ কারিগরদের তত্ত্বাবধানে নিখুঁত ফিনিশিং ও কোয়ালিটি চেকের পর ঢাকাস্থ ওয়্যারহাউজ থেকে সরাসরি সরবরাহ করা হয়।"
                        : "Limited artisan batches tailored under meticulous supervision. Individually inspected for thread count, zari embroidery, and luxury finishing before dispatch from our Dhaka hub."}
                    </p>
                  </div>
                )}
              </div>

              {/* Color Swatches */}
              <div className="space-y-2 pt-2 border-t border-[#ECE4D4]">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                  <span>{isBn ? "রং:" : "Color:"} <strong className="text-[#3E0713]">{selectedVariant.color}</strong></span>
                </div>
                <div className="flex gap-2">
                  {uniqueColors.map((color) => {
                    const isSelected = selectedVariant.colorHex === color.hex;
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleSelectColor(color.hex)}
                        title={color.name}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          isSelected ? "ring-2 ring-[#C5A059] ring-offset-2 scale-110" : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.hex, borderColor: "#bbb" }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-stone-800 block">
                  {isBn ? "উপলব্ধ সাইজ:" : "Available Sizes:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueSizes.map((size) => {
                    const isSelected = selectedVariant.size === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSelectSize(size)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                          isSelected
                            ? "bg-[#3E0713] text-[#FAF8F5] border-[#3E0713] shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="pt-2 text-xs">
                {selectedVariant.stockQty <= 0 ? (
                  <span className="text-red-600 font-semibold">{isBn ? "স্টক শেষ হয়ে গেছে" : "Sold Out in Warehouse"}</span>
                ) : selectedVariant.stockQty <= 3 ? (
                  <span className="text-amber-700 font-semibold">{isBn ? `দ্রুত অর্ডার করুন! মাত্র ${selectedVariant.stockQty} টি পিস অবশিষ্ট রয়েছে` : `Only ${selectedVariant.stockQty} pieces left in stock`}</span>
                ) : (
                  <span className="text-emerald-700 font-semibold">{isBn ? "স্টকে রয়েছে • দ্রুত ডেলিভারির জন্য প্রস্তুত" : "In Stock • Ready for Fast Dispatch"}</span>
                )}
              </div>
            </div>

            {/* Actions: Add to Bag + WhatsApp Concierge */}
            <div className="pt-3 border-t border-[#ECE4D4] space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-stone-300 rounded-full bg-white px-2 py-1">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="px-2 text-stone-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold font-mono">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(Math.min(selectedVariant.stockQty, selectedQty + 1))}
                    className="px-2 text-stone-600 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  disabled={selectedVariant.stockQty <= 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] py-3 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md disabled:opacity-40 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>{isBn ? "ব্যাগ-এ যোগ করুন" : "Add to Shopping Bag"}</span>
                </button>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{isBn ? "হোয়াটসঅ্যাপে সাইজ বা অর্ডার পরামর্শ" : "Ask Concierge on WhatsApp"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
