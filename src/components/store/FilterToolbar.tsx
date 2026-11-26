import React from "react";
import { useStore } from "../../context/StoreContext";
import { toBengaliNumerals } from "../../utils/formatters";
import type { Audience, OccasionFilter } from "../../types";
import { SlidersHorizontal, Heart, RotateCcw, Check } from "lucide-react";

export const FilterToolbar: React.FC<{ resultCount: number }> = ({ resultCount }) => {
  const {
    activeAudience,
    setActiveAudience,
    activeOccasion,
    setActiveOccasion,
    wishlistOnly,
    setWishlistOnly,
    wishlist,
    inStockOnly,
    setInStockOnly,
    searchQuery,
    resetFilters,
    sortBy,
    setSortBy,
    isBn,
  } = useStore();

  const audienceFilters: { id: Audience; en: string; bn: string }[] = [
    { id: "all", en: "All", bn: "সকল" },
    { id: "women", en: "Women", bn: "নারী" },
    { id: "men", en: "Men", bn: "পুরুষ" },
    { id: "kids", en: "Kids", bn: "শিশু" },
    { id: "unisex", en: "Shawls & Silk", bn: "শাল" },
  ];

  const occasionFilters: { id: OccasionFilter; en: string; bn: string }[] = [
    { id: "all", en: "All Occasions", bn: "সব উপলক্ষ" },
    { id: "wedding", en: "Wedding & Nikah", bn: "বিয়ে ও রিসেপশন" },
    { id: "festive", en: "Festive & Eid", bn: "ঈদ ও উৎসব" },
    { id: "evening", en: "Winter Evening", bn: "শীতের সন্ধ্যা" },
    { id: "everyday", en: "Essentials", bn: "নিত্যদিনের সাজ" },
  ];

  const hasActiveFilters =
    activeAudience !== "all" ||
    activeOccasion !== "all" ||
    wishlistOnly ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="bg-white border border-[#ECE4D4] p-4 mb-8 space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {audienceFilters.map((tab) => {
            const isActive = activeAudience === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveAudience(tab.id)}
                className={`whitespace-nowrap px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] border transition ${
                  isActive
                    ? "bg-[#3E0713] text-[#FAF8F5] border-[#3E0713]"
                    : "bg-[#FAF8F5] text-stone-700 border-[#ECE4D4] hover:border-[#88652A] hover:text-[#3E0713]"
                }`}
              >
                {isBn ? tab.bn : tab.en}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 text-xs">
          <span className="text-stone-500 font-medium">
            {isBn
              ? `${toBengaliNumerals(resultCount)} টি পোশাক`
              : `${resultCount} ${resultCount === 1 ? "Piece" : "Pieces"}`}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-stone-600 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#88652A]" />
              <span className="hidden sm:inline">{isBn ? "সাজান:" : "Sort:"}</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "newest")
              }
              className="text-xs bg-[#FAF8F5] border border-[#E0D7C6] px-3 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-[#C5A059]"
            >
              <option value="featured">{isBn ? "ফিচার্ড কালেকশন" : "Featured Edit"}</option>
              <option value="newest">{isBn ? "নতুন সংযোজন" : "Newest Arrivals"}</option>
              <option value="price-asc">{isBn ? "দাম: কম থেকে বেশি" : "Price: Low to High"}</option>
              <option value="price-desc">{isBn ? "দাম: বেশি থেকে কম" : "Price: High to Low"}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#F0EAE0] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#88652A] me-1 shrink-0">
            {isBn ? "উপলক্ষ:" : "Occasion:"}
          </span>
          {occasionFilters.map((occ) => {
            const isActive = activeOccasion === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => setActiveOccasion(occ.id)}
                className={`whitespace-nowrap px-3 py-1 text-[11px] font-medium border transition ${
                  isActive
                    ? "bg-[#24030B] text-[#F4E2B5] border-[#24030B]"
                    : "bg-white text-stone-600 border-[#ECE4D4] hover:border-[#88652A]"
                }`}
              >
                {isBn ? occ.bn : occ.en}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold border transition ${
              inStockOnly
                ? "bg-emerald-950 text-emerald-100 border-emerald-900"
                : "bg-white text-stone-700 border-[#ECE4D4] hover:border-[#88652A]"
            }`}
          >
            <Check className="w-3 h-3" />
            <span>{isBn ? "স্টকে আছে" : "In Stock"}</span>
          </button>

          <button
            type="button"
            onClick={() => setWishlistOnly(!wishlistOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold border transition ${
              wishlistOnly
                ? "bg-[#3E0713] text-[#F4E2B5] border-[#3E0713]"
                : "bg-white text-stone-700 border-[#ECE4D4] hover:border-[#88652A]"
            }`}
          >
            <Heart className={`w-3 h-3 ${wishlistOnly ? "fill-[#F4E2B5]" : ""}`} />
            <span>
              {isBn
                ? `পছন্দ (${toBengaliNumerals(wishlist.length)})`
                : `Saved (${wishlist.length})`}
            </span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#88652A] hover:text-[#3E0713] transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isBn ? "রিসেট" : "Clear"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
