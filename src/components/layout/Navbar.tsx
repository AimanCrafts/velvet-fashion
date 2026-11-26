import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter, Link } from "../../router/Router";
import { formatBdt } from "../../utils/formatters";
import {
  ShoppingBag,
  Globe,
  Search,
  Menu,
  X,
  ArrowUpRight,
  Shield,
  Heart,
  ChevronDown,
  PackageSearch,
} from "lucide-react";
import type { Audience, OccasionFilter } from "../../types";

interface MegaMenuData {
  audience: Audience;
  title_en: string;
  title_bn: string;
  tagline_en: string;
  tagline_bn: string;
  categories: { label_en: string; label_bn: string; query?: string }[];
  occasions: { id: OccasionFilter; label_en: string; label_bn: string }[];
  feature: {
    productId: string;
    title_en: string;
    title_bn: string;
    subtitle_en: string;
    subtitle_bn: string;
    imageUrl: string;
  };
}

const MEGA_MENUS: Record<"women" | "men", MegaMenuData> = {
  women: {
    audience: "women",
    title_en: "Women's Atelier",
    title_bn: "নারীদের কালেকশন",
    tagline_en: "Mulberry velvet kaftans & dabka sarees tailored in Dhaka.",
    tagline_bn: "মালবেরি ভেলভেট কাফতান ও জারদৌসি শাড়ির এক্সক্লুসিভ সম্ভার।",
    categories: [
      { label_en: "All Women's Wear", label_bn: "সব পোশাক" },
      { label_en: "Velvet Kaftans", label_bn: "ভেলভেট কাফতান", query: "Kaftan" },
      { label_en: "Embroidered Sarees", label_bn: "এমব্রয়ডার্ড শাড়ি", query: "Saree" },
    ],
    occasions: [
      { id: "wedding", label_en: "Bridal & Reception", label_bn: "বিয়ে ও রিসেপশন" },
      { id: "evening", label_en: "Winter Soirée", label_bn: "শীতের পার্টি সন্ধ্যা" },
      { id: "festive", label_en: "Festive & Eid", label_bn: "ঈদ ও উৎসব" },
    ],
    feature: {
      productId: "prod-01",
      title_en: "Imperial Burgundy Kaftan",
      title_bn: "ইম্পেরিয়াল বার্গান্ডি কাফতান",
      subtitle_en: "Hand-worked metallic zardozi",
      subtitle_bn: "হাতের নিখুঁত জারদৌসি কাজ",
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    },
  },
  men: {
    audience: "men",
    title_en: "Men's Tailoring",
    title_bn: "পুরুষদের পাঞ্জাবি ও শেরওয়ানি",
    tagline_en: "Structured silk-cotton panjabis & emerald velvet cuts.",
    tagline_bn: "সিল্ক-কটন পাঞ্জাবি ও এমারেল্ড ভেলভেট শেরওয়ানি কাটিং।",
    categories: [
      { label_en: "All Men's Wear", label_bn: "সব পোশাক" },
      { label_en: "Silk-Cotton Panjabis", label_bn: "সিল্ক-কটন পাঞ্জাবি", query: "Panjabi" },
      { label_en: "Velvet Sherwanis", label_bn: "ভেলভেট শেরওয়ানি", query: "Sherwani" },
    ],
    occasions: [
      { id: "wedding", label_en: "Nikah & Groom Edit", label_bn: "নিকাহ ও বরের সাজ" },
      { id: "festive", label_en: "Festive Signatures", label_bn: "উৎসবের পাঞ্জাবি" },
      { id: "everyday", label_en: "Smart Tailored", label_bn: "স্মার্ট টেইলর্ড" },
    ],
    feature: {
      productId: "prod-04",
      title_en: "Emerald Sovereign Sherwani",
      title_bn: "এমারেল্ড সভরেন শেরওয়ানি",
      subtitle_en: "Heavy velvet with antiqued brass",
      subtitle_bn: "অ্যান্টিক পিতলের বোতামে সজ্জিত",
      imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
    },
  },
};

export const Navbar: React.FC<{ minimal?: boolean }> = ({ minimal = false }) => {
  const { navigate, path } = useRouter();
  const {
    toggleLang,
    isBn,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setActiveAudience,
    setActiveOccasion,
    setWishlistOnly,
    wishlistOnly,
    resetFilters,
    products,
    wishlist,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMega, setOpenMega] = useState<"women" | "men" | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 40);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setOpenMega(null);
        setMobileMenuOpen(false);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults =
    trimmedQuery.length > 0
      ? products
          .filter((p) => {
            return (
              p.name_en.toLowerCase().includes(trimmedQuery) ||
              p.name_bn.toLowerCase().includes(trimmedQuery) ||
              p.category.toLowerCase().includes(trimmedQuery) ||
              p.fabric_en.toLowerCase().includes(trimmedQuery) ||
              p.collection.toLowerCase().includes(trimmedQuery)
            );
          })
          .slice(0, 6)
      : products.filter((p) => p.featured).slice(0, 4);

  const handleSelectSearchResult = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const handleShopFilterNav = (opts: {
    audience?: Audience;
    occasion?: OccasionFilter;
    query?: string;
    wishlist?: boolean;
  }) => {
    resetFilters();
    if (opts.audience) setActiveAudience(opts.audience);
    if (opts.occasion) setActiveOccasion(opts.occasion);
    if (opts.query) setSearchQuery(opts.query);
    if (opts.wishlist) setWishlistOnly(true);
    setOpenMega(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    navigate("/shop");
  };

  if (minimal) {
    return (
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#ECE4D4] py-3.5 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="./brand/velvet_emblem.jpg"
              alt="Velvet Fashion Logo"
              className="w-9 h-9 object-contain rounded-full border border-[#C5A059]/50"
            />
            <div className="flex flex-col">
              <span className="font-['Cinzel'] tracking-[0.25em] text-lg font-bold text-[#3E0713]">
                VELVET
              </span>
              <span className="text-[9px] tracking-[0.35em] font-semibold text-[#A8813B] -mt-1 uppercase">
                {isBn ? "ভেলভেট ফ্যাশন ঢাকা" : "FASHION • DHAKA"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-stone-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#88652A]" />
              <span>{isBn ? "ক্যাশ অন ডেলিভারি ও বিকাশ" : "Cash on Delivery & bKash"}</span>
            </div>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 border border-[#ECE4D4] bg-white text-stone-800 hover:border-[#88652A] transition"
            >
              <Globe className="w-3 h-3 text-[#88652A]" />
              <span>{isBn ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-40 print:hidden bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#ECE4D4]"
      onMouseLeave={() => setOpenMega(null)}
    >
      {/* Top Editorial Utility Bar */}
      <div className="bg-[#24030B] text-[#F4E2B5] px-4 py-1.5 text-[11px] tracking-wider">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <span className="truncate font-medium">
            {isBn
              ? "৳৩,০০০+ অর্ডারে ঢাকায় ফ্রি ডেলিভারি • ৬৪ জেলায় ক্যাশ অন ডেলিভারি ও বিকাশ"
              : "Complimentary Dhaka Delivery over ৳3,000 • Nationwide Cash on Delivery & bKash"}
          </span>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/track"
              className="hidden sm:inline-flex items-center gap-1 hover:text-white transition"
            >
              <PackageSearch className="w-3 h-3 text-[#C5A059]" />
              <span>{isBn ? "অর্ডার ট্র্যাক" : "Track Order"}</span>
            </Link>
            <Link
              to="/admin"
              className="hidden md:inline-block hover:text-white transition text-stone-300"
            >
              {isBn ? "অ্যাডমিন" : "Admin"}
            </Link>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-semibold hover:text-white transition px-2 py-0.5 bg-white/10"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3 h-3 text-[#C5A059]" />
              <span>{isBn ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Architectural Header */}
      <div className="container mx-auto px-4 h-16 lg:h-[72px] flex items-center justify-between gap-4">
        {/* Left: Mobile Trigger + Primary Collection Links */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 -ms-2 text-[#3E0713] hover:bg-[#F2ECE4] transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-800">
            <button
              type="button"
              onMouseEnter={() => setOpenMega("women")}
              onClick={() => handleShopFilterNav({ audience: "women" })}
              className={`flex items-center gap-1 py-2 border-b-2 transition ${
                openMega === "women" ? "border-[#3E0713] text-[#3E0713]" : "border-transparent hover:text-[#3E0713]"
              }`}
            >
              <span>{isBn ? "নারী" : "Women"}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <button
              type="button"
              onMouseEnter={() => setOpenMega("men")}
              onClick={() => handleShopFilterNav({ audience: "men" })}
              className={`flex items-center gap-1 py-2 border-b-2 transition ${
                openMega === "men" ? "border-[#3E0713] text-[#3E0713]" : "border-transparent hover:text-[#3E0713]"
              }`}
            >
              <span>{isBn ? "পুরুষ" : "Men"}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <button
              type="button"
              onMouseEnter={() => setOpenMega(null)}
              onClick={() => handleShopFilterNav({ audience: "kids" })}
              className="py-2 border-b-2 border-transparent hover:text-[#3E0713] transition"
            >
              {isBn ? "শিশু" : "Kids"}
            </button>

            <button
              type="button"
              onMouseEnter={() => setOpenMega(null)}
              onClick={() => handleShopFilterNav({ audience: "unisex" })}
              className="py-2 border-b-2 border-transparent hover:text-[#3E0713] transition"
            >
              {isBn ? "শাল" : "Shawls"}
            </button>

            <Link
              to="/lookbook"
              onMouseEnter={() => setOpenMega(null)}
              className={`py-2 border-b-2 transition ${
                path === "/lookbook" ? "border-[#3E0713] text-[#3E0713]" : "border-transparent hover:text-[#3E0713]"
              }`}
            >
              {isBn ? "লুকবুক" : "Lookbook"}
            </Link>
          </nav>
        </div>

        {/* Center: Brand Wordmark & Crest */}
        <Link
          to="/"
          className="flex items-center gap-2.5 select-none group shrink-0"
          onClick={() => {
            resetFilters();
            setOpenMega(null);
          }}
        >
          <img
            src="./brand/velvet_emblem.jpg"
            alt="Velvet Fashion Logo"
            className="w-9 h-9 object-contain rounded-full border border-[#C5A059]/60 group-hover:scale-105 transition"
          />
          <div className="flex flex-col items-center">
            <span className="font-['Cinzel'] tracking-[0.28em] text-lg sm:text-xl font-bold text-[#3E0713]">
              VELVET
            </span>
            <span className="text-[8px] tracking-[0.38em] font-semibold text-[#A8813B] -mt-0.5 uppercase">
              {isBn ? "ঢাকা • বাংলাদেশ" : "DHAKA • EST. 2026"}
            </span>
          </div>
        </Link>

        {/* Right: Predictive Search, Wishlist & Bag */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 min-w-0">
          <Link
            to="/shop"
            onClick={() => resetFilters()}
            className="hidden xl:inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-700 hover:text-[#3E0713] transition me-2"
          >
            {isBn ? "সব কালেকশন" : "Shop All"}
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 text-stone-800 hover:text-[#3E0713] hover:bg-[#F2ECE4] transition"
            aria-label={isBn ? "পণ্য খুঁজুন" : "Search catalog"}
            title={isBn ? "খুঁজুন (/)" : "Search (/)"}
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <button
            type="button"
            onClick={() => handleShopFilterNav({ wishlist: true })}
            className={`relative p-2 transition ${
              wishlistOnly && path === "/shop"
                ? "text-[#3E0713] bg-[#F2ECE4]"
                : "text-stone-800 hover:text-[#3E0713] hover:bg-[#F2ECE4]"
            }`}
            aria-label={isBn ? "পছন্দের তালিকা" : "Saved wishlist"}
            title={isBn ? "পছন্দের তালিকা" : "Saved Wishlist"}
          >
            <Heart className={`w-[18px] h-[18px] ${wishlist.length > 0 ? "text-[#3E0713]" : ""}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 end-0.5 bg-[#3E0713] text-[#F4E2B5] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] px-3.5 sm:px-4 py-2 transition active:scale-95"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-[0.14em]">
              {isBn ? "ব্যাগ" : "Bag"}
            </span>
            <span className="text-[11px] font-mono font-bold text-[#F4E2B5]">
              ({cartCount})
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Mega-Menu Panel (Ströms-inspired structured navigation) */}
      {openMega && (
        <div className="hidden lg:block absolute inset-x-0 top-full bg-[#FAF8F5] border-b border-[#ECE4D4] shadow-xl z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-8">
            <div className="col-span-3 space-y-3 border-e border-[#ECE4D4] pe-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#88652A]">
                {isBn ? "বিভাগ" : "Department"}
              </p>
              <h3 className="font-['Playfair_Display'] text-2xl text-[#24030B]">
                {isBn ? MEGA_MENUS[openMega].title_bn : MEGA_MENUS[openMega].title_en}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isBn ? MEGA_MENUS[openMega].tagline_bn : MEGA_MENUS[openMega].tagline_en}
              </p>
              <button
                type="button"
                onClick={() => handleShopFilterNav({ audience: MEGA_MENUS[openMega].audience })}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#3E0713] hover:text-[#88652A] pt-2"
              >
                <span>{isBn ? "সব দেখুন" : "View Complete Edit"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="col-span-3 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#88652A]">
                {isBn ? "পোশাকের ধরন" : "Categories"}
              </p>
              <ul className="space-y-2.5 text-xs">
                {MEGA_MENUS[openMega].categories.map((cat) => (
                  <li key={cat.label_en}>
                    <button
                      type="button"
                      onClick={() =>
                        handleShopFilterNav({
                          audience: MEGA_MENUS[openMega].audience,
                          query: cat.query,
                        })
                      }
                      className="text-stone-700 hover:text-[#3E0713] hover:translate-x-1 transition font-medium"
                    >
                      {isBn ? cat.label_bn : cat.label_en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#88652A]">
                {isBn ? "উপলক্ষ অনুযায়ী" : "Shop by Occasion"}
              </p>
              <ul className="space-y-2.5 text-xs">
                {MEGA_MENUS[openMega].occasions.map((occ) => (
                  <li key={occ.id}>
                    <button
                      type="button"
                      onClick={() =>
                        handleShopFilterNav({
                          audience: MEGA_MENUS[openMega].audience,
                          occasion: occ.id,
                        })
                      }
                      className="text-stone-700 hover:text-[#3E0713] hover:translate-x-1 transition font-medium"
                    >
                      {isBn ? occ.label_bn : occ.label_en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3">
              <button
                type="button"
                onClick={() => {
                  const id = MEGA_MENUS[openMega].feature.productId;
                  setOpenMega(null);
                  navigate(`/product/${id}`);
                }}
                className="group flex gap-3.5 items-center bg-white p-3 border border-[#ECE4D4] hover:border-[#C5A059] transition text-start w-full"
              >
                <img
                  src={MEGA_MENUS[openMega].feature.imageUrl}
                  alt={MEGA_MENUS[openMega].feature.title_en}
                  className="w-20 h-24 object-cover shrink-0 bg-stone-100"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#88652A] block mb-1">
                    {isBn ? "হাইলাইট পিস" : "Atelier Highlight"}
                  </span>
                  <p className="font-['Playfair_Display'] text-sm text-[#24030B] group-hover:text-[#3E0713] leading-snug">
                    {isBn ? MEGA_MENUS[openMega].feature.title_bn : MEGA_MENUS[openMega].feature.title_en}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {isBn ? MEGA_MENUS[openMega].feature.subtitle_bn : MEGA_MENUS[openMega].feature.subtitle_en}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Predictive Search Panel (Atticus Finch inspired) */}
      {searchOpen && (
        <div
          ref={searchPanelRef}
          className="absolute inset-x-0 top-full bg-white border-b border-[#ECE4D4] shadow-2xl z-50 animate-fade-in"
        >
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="relative flex items-center border-b-2 border-[#3E0713] pb-2">
              <Search className="w-5 h-5 text-[#88652A] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                maxLength={50}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.slice(0, 50))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    setSearchOpen(false);
                    navigate("/shop");
                  }
                }}
                placeholder={
                  isBn
                    ? "কাফতান, পাঞ্জাবি, শাড়ি, ভেলভেট বা শাল খুঁজুন..."
                    : "Search velvet kaftans, silk panjabis, sarees, or cashmere shawls..."
                }
                className="w-full px-3 py-1.5 text-sm sm:text-base bg-transparent focus:outline-none text-[#24030B] placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-stone-500 hover:text-stone-900 px-2"
                >
                  {isBn ? "মুছুন" : "Clear"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">
                <span>
                  {trimmedQuery
                    ? isBn
                      ? `অনুসন্ধানের ফলাফল (${searchResults.length})`
                      : `Matching Pieces (${searchResults.length})`
                    : isBn
                    ? "জনপ্রিয় বাছাইকৃত পোশাক"
                    : "Featured Pieces"}
                </span>
                {trimmedQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      navigate("/shop");
                    }}
                    className="text-[#3E0713] hover:underline"
                  >
                    {isBn ? "সব ফলাফল দেখুন →" : "View all results →"}
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">
                  {isBn
                    ? "কোনো পোশাক পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।"
                    : "No matching garments found. Try searching 'Velvet', 'Panjabi', 'Saree', or 'Shawl'."}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(product.id)}
                      className="flex items-center gap-3 p-2.5 border border-[#ECE4D4] hover:border-[#C5A059] bg-[#FAF8F5]/60 hover:bg-white transition text-start group"
                    >
                      <img
                        src={product.imageUrl}
                        alt={isBn ? product.name_bn : product.name_en}
                        className="w-12 h-16 object-cover shrink-0 bg-stone-100"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#88652A] font-semibold truncate">
                          {isBn ? product.category_bn : product.category}
                        </p>
                        <p className="font-['Playfair_Display'] text-xs sm:text-sm text-[#24030B] group-hover:text-[#3E0713] truncate">
                          {isBn ? product.name_bn : product.name_en}
                        </p>
                        <p className="text-xs font-bold text-[#3E0713] mt-0.5">
                          {formatBdt(product.variants[0].priceBdt, isBn ? "bn" : "en")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#ECE4D4] bg-white px-4 py-5 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleShopFilterNav({ audience: "all" })}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "সব কালেকশন" : "Shop All"}
            </button>
            <button
              onClick={() => handleShopFilterNav({ audience: "women" })}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "নারী ও ব্রাইডাল" : "Women's Atelier"}
            </button>
            <button
              onClick={() => handleShopFilterNav({ audience: "men" })}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "পুরুষ ও পাঞ্জাবি" : "Men's Tailoring"}
            </button>
            <button
              onClick={() => handleShopFilterNav({ audience: "kids" })}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "ছোটদের উৎসব" : "Kids Festive"}
            </button>
            <button
              onClick={() => handleShopFilterNav({ audience: "unisex" })}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "শাল ও ক্যাশমিয়ার" : "Shawls & Silk"}
            </button>
            <Link
              to="/lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "লুকবুক" : "Lookbook"}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center border border-[#ECE4D4] bg-[#FAF8F5] text-stone-900"
            >
              {isBn ? "অর্ডার ট্র্যাক" : "Track Order"}
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center border border-[#3E0713] bg-[#3E0713] text-[#F4E2B5]"
            >
              {isBn ? "অ্যাডমিন প্যানেল" : "Store Admin"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
