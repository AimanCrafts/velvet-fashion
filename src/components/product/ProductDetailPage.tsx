import React, { useState, useEffect } from "react";
import { useRouter, Link } from "../../router/Router";
import { useStore } from "../../context/StoreContext";
import { formatBdt } from "../../utils/formatters";
import { ProductCard } from "../store/ProductCard";
import { SizeGuideModal } from "./SizeGuideModal";
import type { Product, ProductVariant } from "../../types";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Ruler,
  MessageCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const { navigate } = useRouter();
  const {
    products,
    isBn,
    addToCart,
    isWishlisted,
    toggleWishlist,
    pushRecentlyViewed,
    recentlyViewed,
    siteSettings,
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return product.variants.find((v) => v.stockQty > 0) || product.variants[0];
  });
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);
  const [imgError, setImgError] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"fabric" | "delivery" | "returns">("fabric");

  useEffect(() => {
    pushRecentlyViewed(product.id);
  }, [product.id, pushRecentlyViewed]);

  const wish = isWishlisted(product.id);
  const currentVariant = selectedVariant || product.variants[0];
  const inStock = currentVariant.stockQty > 0;
  const currentPrice = currentVariant.priceBdt ?? currentVariant.priceQar ?? 0;

  // Additional image list
  const allImages = [
    product.imageUrl,
    ...(product.additionalImages || []),
  ].filter(Boolean);

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && p.audience === product.audience)
    .slice(0, 3);

  // Recently viewed products
  const recentProducts = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p))
    .slice(0, 4);

  const handleAddBag = () => {
    if (!currentVariant || !inStock) return;
    addToCart(product, currentVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!currentVariant || !inStock) return;
    addToCart(product, currentVariant, quantity);
    navigate("/checkout");
  };

  const waInquiryText = `Hello Velvet Fashion! I am inquiring about "${product.name_en}" (SKU: ${currentVariant.sku}, Size: ${currentVariant.size}). Is it ready for Dhaka / nationwide delivery?`;
  const waUrl = `https://wa.me/${siteSettings.supportWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(waInquiryText)}`;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#3E0713] transition">
          {isBn ? "হোম" : "Home"}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/shop" className="hover:text-[#3E0713] transition">
          {isBn ? "কালেকশন" : "Collections"}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-[#88652A] font-semibold truncate max-w-[200px]">
          {isBn ? product.name_bn : product.name_en}
        </span>
      </nav>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[3/4] bg-[#F2ECE4] rounded-2xl overflow-hidden border border-[#ECE4D4] shadow-sm">
            {imgError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#2A030C] text-[#F4E2B5] p-6 text-center">
                <img
                  src="/brand/velvet_emblem.jpg"
                  alt="Velvet Seal"
                  className="w-20 h-20 rounded-full border border-[#C5A059] mb-3 opacity-90 shadow-lg"
                />
                <span className="font-['Cinzel'] text-sm font-bold tracking-widest">
                  VELVET FASHION
                </span>
                <span className="text-xs text-stone-300 mt-1 max-w-xs">{isBn ? product.name_bn : product.name_en}</span>
              </div>
            ) : (
              <img
                src={activeImage || product.imageUrl}
                alt={isBn ? product.name_bn : product.name_en}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition duration-700 ease-out"
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 start-4 flex flex-col gap-2">
              {product.newArrival && (
                <span className="px-3 py-1 rounded-full bg-[#FAF8F5]/95 text-[#3E0713] text-[10px] font-bold tracking-widest uppercase shadow-sm border border-[#ECE4D4]">
                  {isBn ? "নতুন সংযোজন" : "New Arrival"}
                </span>
              )}
              {product.featured && (
                <span className="px-3 py-1 rounded-full bg-[#3E0713]/90 text-[#F4E2B5] text-[10px] font-bold tracking-widest uppercase shadow-sm border border-[#C5A059]/40">
                  {isBn ? "এক্সক্লুসিভ কালেকশন" : "Featured Edit"}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center hover:bg-white shadow-md active:scale-90 transition"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  wish ? "fill-[#3E0713] text-[#3E0713]" : "text-stone-600 hover:text-[#3E0713]"
                }`}
              />
            </button>
          </div>

          {/* Thumbnails if multiple images exist */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(img);
                    setImgError(false);
                  }}
                  className={`relative w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition ${
                    activeImage === img ? "border-[#3E0713] shadow-md" : "border-[#ECE4D4] opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Garment Specs, Sizing & Actions (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Collection & Category */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#88652A] mb-1">
                {isBn ? product.collection_bn : product.collection} • {isBn ? product.category_bn : product.category}
              </p>
              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-normal text-[#24030B] leading-tight">
                {isBn ? product.name_bn : product.name_en}
              </h1>
            </div>

            {/* Price & Scarcity */}
            <div className="flex items-baseline justify-between py-3 border-y border-[#ECE4D4]">
              <div className="flex items-baseline gap-2">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#3E0713]">
                  {formatBdt(currentPrice, isBn ? "bn" : "en")}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {isBn ? "ক্যাশ অন ডেলিভারি ও বিকাশ প্রযোজ্য" : "Cash on Delivery Available"}
                </span>
              </div>

              {/* Stock Scarcity Status */}
              <div>
                {currentVariant.stockQty > 0 ? (
                  currentVariant.stockQty <= 3 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isBn ? `স্টকে মাত্র ${currentVariant.stockQty} টি পিস অবশিষ্ট` : `Only ${currentVariant.stockQty} left in stock`}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isBn ? "স্টকে রয়েছে • দ্রুত ডেলিভারি" : "In Stock — Ready to Dispatch"}</span>
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                    {isBn ? "স্টক শেষ হয়ে গেছে" : "Sold Out — Restocking Soon"}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isBn ? product.description_bn : product.description_en}
            </p>

            {/* Color Swatch Options */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                {isBn ? "নির্বাচিত রঙ:" : "Selected Hue:"} <span className="text-[#88652A] font-semibold">{currentVariant.color}</span>
              </label>
              <div className="flex items-center gap-2">
                {Array.from(new Set(product.variants.map((v) => v.color))).map((cName) => {
                  const match = product.variants.find((v) => v.color === cName);
                  if (!match) return null;
                  const isSelected = currentVariant.color === cName;
                  return (
                    <button
                      key={cName}
                      type="button"
                      onClick={() => setSelectedVariant(match)}
                      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition p-0.5 ${
                        isSelected ? "ring-2 ring-[#3E0713] ring-offset-2 scale-105" : "hover:opacity-90"
                      }`}
                      title={cName}
                    >
                      <span
                        className="w-full h-full rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: match.colorHex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector + Size Guide Link */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  {isBn ? "সাইজ নির্বাচন করুন:" : "Select Size:"} <span className="text-[#88652A]">{currentVariant.size}</span>
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs text-[#88652A] hover:underline font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{isBn ? "সাইজ গাইড" : "Size Guide"}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants
                  .filter((v) => v.color === currentVariant.color)
                  .map((v) => {
                    const isSelected = currentVariant.id === v.id;
                    const isOutOfStock = v.stockQty <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`min-w-14 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                          isSelected
                            ? "bg-[#3E0713] text-[#FAF8F5] shadow-xs"
                            : isOutOfStock
                            ? "bg-stone-100 text-stone-300 line-through cursor-not-allowed border border-stone-200"
                            : "bg-[#FAF8F5] text-stone-800 border border-[#ECE4D4] hover:border-[#88652A]"
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                {isBn ? "পরিমাণ:" : "Quantity:"}
              </label>
              <div className="flex items-center border border-[#E0D7C6] rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-[#FAF8F5] disabled:opacity-30 transition font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-stone-800 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= currentVariant.stockQty}
                  onClick={() => setQuantity((q) => Math.min(currentVariant.stockQty, q + 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-[#FAF8F5] disabled:opacity-30 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Bag */}
                <button
                  onClick={handleAddBag}
                  disabled={!inStock}
                  className="w-full py-3.5 px-6 rounded-full bg-[#3E0713] hover:bg-[#520B1C] disabled:bg-stone-300 text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  <span>{isBn ? "ব্যাগে যুক্ত করুন" : "Add to Shopping Bag"}</span>
                </button>

                {/* Direct Buy Now with COD */}
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="w-full py-3.5 px-6 rounded-full bg-[#C5A059] hover:bg-[#D4AF37] disabled:bg-stone-300 text-[#24030B] text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{isBn ? "ক্যাশ অন ডেলিভারিতে অর্ডার করুন" : "Buy Now with COD"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* WhatsApp Concierge direct question */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full border border-[#ECE4D4] hover:border-[#25D366] bg-white text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition hover:shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>
                  {isBn
                    ? "কোনো প্রশ্ন আছে? হোয়াটসঅ্যাপে পরামর্শকের সাথে কথা বলুন"
                    : "Inquire on WhatsApp with our Dhaka Stylist Concierge"}
                </span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#ECE4D4] text-[11px] text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#88652A] shrink-0" />
                <span>{isBn ? "ঢাকায় ২৪ ঘণ্টায় ডেলিভারি" : "Express 24h Dhaka Delivery"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#88652A] shrink-0" />
                <span>{isBn ? "ক্যাশ অন ডেলিভারি ও বিকাশ" : "Cash on Delivery & bKash"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#88652A] shrink-0" />
                <span>{isBn ? "সহজ ৭ দিনের এক্সচেঞ্জ" : "7-Day Exchange Guarantee"}</span>
              </div>
            </div>
          </div>

          {/* Accordion / Info Tabs */}
          <div className="mt-8 border-t border-[#ECE4D4] pt-4">
            <div className="flex items-center gap-4 border-b border-[#ECE4D4] text-xs font-bold">
              <button
                onClick={() => setActiveTab("fabric")}
                className={`pb-2.5 uppercase tracking-wider transition ${
                  activeTab === "fabric"
                    ? "border-b-2 border-[#3E0713] text-[#3E0713]"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {isBn ? "ফ্যাব্রিক ও কারুকাজ" : "Fabric & Craftsmanship"}
              </button>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`pb-2.5 uppercase tracking-wider transition ${
                  activeTab === "delivery"
                    ? "border-b-2 border-[#3E0713] text-[#3E0713]"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {isBn ? "ডেলিভারি তথ্য" : "Bangladesh Delivery"}
              </button>
              <button
                onClick={() => setActiveTab("returns")}
                className={`pb-2.5 uppercase tracking-wider transition ${
                  activeTab === "returns"
                    ? "border-b-2 border-[#3E0713] text-[#3E0713]"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {isBn ? "এক্সচেঞ্জ ও ওয়ারেন্টি" : "Exchange Policy"}
              </button>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed">
              {activeTab === "fabric" && (
                <div className="space-y-2">
                  <p>
                    <strong className="text-stone-900">{isBn ? "মূল উপাদান:" : "Primary Fabric:"}</strong>{" "}
                    {isBn ? product.fabric_bn : product.fabric_en}
                  </p>
                  <p>
                    <strong className="text-stone-900">{isBn ? "যত্ন নির্দেশিকা:" : "Care Instructions:"}</strong>{" "}
                    {isBn
                      ? "মখমলের উজ্জ্বলতা ও জরির কাজ দীর্ঘস্থায়ী রাখতে ড্রাই ক্লিন করার পরামর্শ দেওয়া হচ্ছে। স্টিম আয়রন ব্যবহার করুন।"
                      : "Dry clean only recommended to preserve velvet lustre and zari metallic threads. Steam lightly on reverse."}
                  </p>
                </div>
              )}
              {activeTab === "delivery" && (
                <div className="space-y-1.5">
                  <p>{isBn ? siteSettings.deliveryPromise_bn : siteSettings.deliveryPromise_en}</p>
                  <p className="text-[11px] text-stone-500">
                    {isBn
                      ? "৳ ৩,০০০ টাকার বেশি অর্ডারে সমগ্র ঢাকায় ফ্রি ডেলিভারি। সারাদেশের যেকোনো প্রান্তে কুরিয়ারে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা।"
                      : "Complimentary courier dispatch on all orders exceeding ৳3,000 across Greater Dhaka."}
                  </p>
                </div>
              )}
              {activeTab === "returns" && (
                <div className="space-y-1.5">
                  <p>{isBn ? siteSettings.returnPolicy_bn : siteSettings.returnPolicy_en}</p>
                  <p className="text-[11px] text-stone-500">
                    {isBn
                      ? "বাংলাদেশ ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯ এবং ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ অনুসারে গ্রাহকের অধিকার নিশ্চিত করা হয়।"
                      : "Under Bangladesh Consumer Rights Protection Act 2009 & Digital Commerce Guidelines 2021."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-[#ECE4D4] my-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-normal text-[#24030B]">
              {isBn ? "আপনার পছন্দের সাথে মানানসই অন্যান্য পোশাক" : "Complete the Look • Curated Pairs"}
            </h3>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#88652A] hover:underline uppercase tracking-wider"
            >
              {isBn ? "সবগুলো দেখুন" : "View All"}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Section */}
      {recentProducts.length > 0 && (
        <section className="pt-12 border-t border-[#ECE4D4]">
          <h3 className="font-['Playfair_Display'] text-lg font-normal text-[#24030B] mb-6">
            {isBn ? "সম্প্রতি দেখেছেন" : "Recently Viewed"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { segments } = useRouter();
  const productId = segments[1]; // /product/:id

  const { products, isBn } = useStore();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md animate-fade-in">
        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-2">
          {isBn ? "পণ্যটি পাওয়া যায়নি" : "Product Not Found"}
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          {isBn
            ? "দুঃখিত, আপনি যে পোশাকটি খুঁজছেন তা স্টকে নেই অথবা স্থানান্তরিত করা হয়েছে।"
            : "The bespoke piece you are seeking might have sold out or been repositioned."}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E0713] text-[#FAF8F5] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#520B1C] transition"
        >
          {isBn ? "কালেকশনে ফিরে যান" : "Return to Collections"}
        </Link>
      </div>
    );
  }

  return <ProductDetailView key={product.id} product={product} />;
};
