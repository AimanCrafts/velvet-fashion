import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter, Link } from "../../router/Router";
import { formatBdt } from "../../utils/formatters";
import {
  ShoppingBag,
  Globe,
  Sparkles,
  Search,
  Menu,
  X,
  ArrowUpRight,
  Shield,
  Heart,
} from "lucide-react";
import type { Audience } from "../../types";

export const Navbar: React.FC<{ minimal?: boolean }> = ({ minimal = false }) => {
  const { navigate } = useRouter();
  const {
    toggleLang,
    isBn,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setActiveAudience,
    products,
    wishlist,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matched products for instant live search dropdown
  const searchResults =
    searchQuery.trim().length > 1
      ? products
          .filter((p) => {
            const q = searchQuery.toLowerCase().trim();
            return (
              p.name_en.toLowerCase().includes(q) ||
              p.name_bn.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.fabric_en.toLowerCase().includes(q)
            );
          })
          .slice(0, 5)
      : [];

  const handleSelectSearchResult = (product: (typeof products)[0]) => {
    setSearchFocused(false);
    setSearchQuery("");
    navigate(`/product/${product.id}`);
  };

  const handleAudienceNav = (aud: Audience) => {
    setActiveAudience(aud);
    setMobileMenuOpen(false);
    navigate("/shop");
  };

  if (minimal) {
    return (
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#ECE4D4] py-3.5 px-4 shadow-2xs">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/brand/velvet_emblem.jpg"
              alt="Velvet Fashion Logo"
              className="w-9 h-9 object-contain rounded-full border border-[#C5A059]/50"
            />
            <div className="flex flex-col">
              <span className="font-['Cinzel'] tracking-[0.25em] text-lg font-bold text-[#3E0713]">
                VELVET
              </span>
              <span className="text-[9px] tracking-[0.35em] font-semibold text-[#A8813B] -mt-1 uppercase">
                {isBn ? "ভেলভেট ফ্যাশন ঢাকা" : "F A S H I O N • D H A K A"}
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
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#ECE4D4] bg-white text-stone-800 hover:border-[#88652A] transition"
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
    <header className="sticky top-0 z-40 print:hidden bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#ECE4D4] shadow-2xs">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#3E0713] text-[#F4E2B5] px-4 py-1.5 text-xs tracking-wider">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="truncate">
              {isBn
                ? "৳ ৩,০০০ এর বেশি অর্ডারে ঢাকায় ফ্রি ডেলিভারি • সারাদেশে ক্যাশ অন ডেলিভারি ও বিকাশ সুবিধা"
                : "Complimentary Delivery in Dhaka on orders above ৳3,000 • Cash on Delivery & bKash Nationwide"}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] shrink-0 ms-2">
            <Link
              to="/admin"
              className="hidden md:inline-block font-semibold hover:text-white transition px-2 py-0.5 rounded-sm bg-white/10"
            >
              {isBn ? "অ্যাডমিন প্যানেল" : "Hub Admin"}
            </Link>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-semibold hover:text-white transition px-2 py-0.5 rounded-sm bg-white/10"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3 h-3 text-[#C5A059]" />
              <span>{isBn ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Search bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#3E0713] hover:bg-[#F2ECE4] rounded-md transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Search container with live autocomplete dropdown */}
          <div
            ref={searchContainerRef}
            className="relative hidden md:block w-64 lg:w-80"
          >
            <Search
              className="absolute top-2.5 left-3 w-4 h-4 text-stone-400"
            />
            <input
              type="text"
              maxLength={50}
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value.slice(0, 50));
                setSearchFocused(true);
              }}
              placeholder={
                isBn
                  ? "ভেলভেট কাফতান, পাঞ্জাবি, শাড়ি, ব্লেজার..."
                  : "Search velvet kaftans, panjabis, sarees, blazers..."
              }
              className="w-full py-1.5 text-xs bg-white border border-[#E0D7C6] rounded-full focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition pl-9 pr-3 text-left"
            />

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-[#ECE4D4] shadow-xl overflow-hidden z-50 animate-fade-in">
                <div className="p-2 bg-[#FAF8F5] border-b border-[#ECE4D4] text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {isBn ? "প্রস্তাবিত পণ্যসমূহ" : "Suggested Garments"}
                </div>
                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(product)}
                      className="w-full p-2.5 flex items-center gap-3 hover:bg-[#FAF8F5] transition text-start group"
                    >
                      <img
                        src={product.imageUrl}
                        alt={isBn ? product.name_bn : product.name_en}
                        className="w-10 h-13 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-900 group-hover:text-[#3E0713] truncate">
                          {isBn ? product.name_bn : product.name_en}
                        </p>
                        <p className="text-[10px] text-[#88652A] truncate">
                          {isBn ? product.category_bn : product.category}
                        </p>
                        <p className="text-xs font-bold text-[#3E0713] mt-0.5 font-['Plus_Jakarta_Sans']">
                          {formatBdt(
                            product.variants[0].priceBdt,
                            isBn ? "bn" : "en"
                          )}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#3E0713] transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Brand Monogram & Seal */}
        <Link
          to="/"
          className="flex flex-col items-center select-none group"
          onClick={() => {
            setActiveAudience("all");
            setSearchQuery("");
          }}
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/brand/velvet_emblem.jpg"
              alt="Velvet Fashion Logo Mark"
              className="w-10 h-10 object-contain rounded-full shadow-xs border border-[#C5A059]/50 group-hover:scale-105 transition"
            />
            <div className="flex flex-col items-center">
              <span className="font-['Cinzel'] tracking-[0.28em] text-xl font-bold text-[#3E0713]">
                VELVET
              </span>
              <span className="text-[9px] tracking-[0.35em] font-semibold text-[#A8813B] -mt-1 uppercase">
                {isBn ? "ভেলভেট ফ্যাশন ঢাকা" : "F A S H I O N • D H A K A"}
              </span>
            </div>
          </div>
        </Link>

        {/* Right: Country / Currency & Wishlist / Bag */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end text-[11px] leading-tight text-stone-600">
            <span className="font-bold text-[#3E0713]">BANGLADESH</span>
            <span className="text-[#A8813B] font-semibold">
              BDT (৳)
            </span>
          </div>

          {/* Wishlist indicator */}
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 p-2 rounded-full hover:bg-[#F2ECE4] text-stone-700 transition relative"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 text-[#88652A]" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 end-0.5 bg-[#3E0713] text-[#F4E2B5] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] px-4 py-2 rounded-full transition shadow-sm active:scale-95"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden sm:inline text-xs font-semibold tracking-wide">
              {isBn ? "ব্যাগ" : "Bag"}
            </span>
            {cartCount > 0 && (
              <span className="bg-[#C5A059] text-[#24030B] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Secondary Navigation Bar */}
      <nav className="hidden md:flex border-t border-[#ECE4D4] py-2 bg-[#FAF8F5]/50">
        <div className="container mx-auto px-4 flex items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <Link
            to="/"
            className="hover:text-[#3E0713] transition py-1 hover:border-b-2 hover:border-[#3E0713]"
          >
            {isBn ? "হোম" : "Home"}
          </Link>
          <Link
            to="/shop"
            onClick={() => setActiveAudience("all")}
            className="hover:text-[#3E0713] transition py-1 hover:border-b-2 hover:border-[#3E0713]"
          >
            {isBn ? "সকল কালেকশন" : "All Collections"}
          </Link>
          <button
            onClick={() => handleAudienceNav("women")}
            className="hover:text-[#3E0713] transition py-1 hover:border-b-2 hover:border-[#3E0713]"
          >
            {isBn ? "নারী ও শাড়ি-কাফতান" : "Women's Couture"}
          </button>
          <button
            onClick={() => handleAudienceNav("men")}
            className="hover:text-[#3E0713] transition py-1 hover:border-b-2 hover:border-[#3E0713]"
          >
            {isBn ? "পুরুষ ও পাঞ্জাবি-কোট" : "Men's Panjabi & Edit"}
          </button>
          <button
            onClick={() => handleAudienceNav("kids")}
            className="hover:text-[#3E0713] transition py-1 hover:border-b-2 hover:border-[#3E0713]"
          >
            {isBn ? "ছোটদের উৎসব" : "Kids Festive"}
          </button>
          <button
            onClick={() => handleAudienceNav("unisex")}
            className="hover:text-[#3E0713] transition py-1 hover:border-b-2 hover:border-[#3E0713]"
          >
            {isBn ? "শাল ও ক্যাশমিয়ার" : "Shawls & Silk"}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ECE4D4] bg-white px-4 py-4 space-y-3 animate-fade-in">
          <div className="relative w-full">
            <Search
              className="absolute top-2.5 left-3 w-4 h-4 text-stone-400"
            />
            <input
              type="text"
              maxLength={50}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 50))}
              placeholder={isBn ? "পণ্য খুঁজুন..." : "Search collections..."}
              className="w-full py-2 text-xs bg-[#F7F3EA] border border-[#E0D7C6] rounded-md pl-9 pr-3 text-left"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
            <Link
              to="/shop"
              onClick={() => {
                setActiveAudience("all");
                setMobileMenuOpen(false);
              }}
              className="py-2.5 text-center border border-[#ECE4D4] rounded-md bg-[#FAF8F5] text-stone-800"
            >
              {isBn ? "সকল কালেকশন" : "All Collections"}
            </Link>
            <button
              onClick={() => handleAudienceNav("women")}
              className="py-2.5 text-center border border-[#ECE4D4] rounded-md bg-[#FAF8F5] text-stone-800"
            >
              {isBn ? "নারী ও ব্রাইডাল" : "Women's Collection"}
            </button>
            <button
              onClick={() => handleAudienceNav("men")}
              className="py-2.5 text-center border border-[#ECE4D4] rounded-md bg-[#FAF8F5] text-stone-800"
            >
              {isBn ? "পুরুষ ও পাঞ্জাবি" : "Men's Collection"}
            </button>
            <button
              onClick={() => handleAudienceNav("kids")}
              className="py-2.5 text-center border border-[#ECE4D4] rounded-md bg-[#FAF8F5] text-stone-800"
            >
              {isBn ? "ছোটদের উৎসব" : "Kids Festive"}
            </button>
            <button
              onClick={() => handleAudienceNav("unisex")}
              className="py-2.5 text-center border border-[#ECE4D4] rounded-md bg-[#FAF8F5] text-stone-800"
            >
              {isBn ? "শাল ও র্যাপ" : "Shawls & Silk"}
            </button>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center border border-[#ECE4D4] rounded-md bg-[#3E0713] text-[#F4E2B5]"
            >
              {isBn ? "অ্যাডমিন হাব" : "Store Admin"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
