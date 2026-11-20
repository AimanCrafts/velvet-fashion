import React from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "./ProductCard";
import { FilterToolbar } from "./FilterToolbar";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Sparkles } from "lucide-react";
import type { Audience } from "../../types";

interface ProductGridProps {
  title_en?: string;
  title_bn?: string;
  title_ar?: string; // legacy alias
  subtitle_en?: string;
  subtitle_bn?: string;
  subtitle_ar?: string; // legacy alias
  limit?: number;
  showFilterToolbar?: boolean;
  fixedAudience?: Audience;
  featuredOnly?: boolean;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title_en,
  title_bn,
  title_ar,
  subtitle_en,
  subtitle_bn,
  subtitle_ar,
  limit,
  showFilterToolbar = true,
  fixedAudience,
  featuredOnly = false,
  isLoading = false,
}) => {
  const {
    products,
    activeAudience,
    searchQuery,
    sortBy,
    isBn,
    setActiveAudience,
    setSearchQuery,
  } = useStore();

  const effectiveAudience = fixedAudience ?? activeAudience;

  const audienceLabel: Record<string, [string, string]> = {
    women: ["Women", "নারী ও শাড়ি"],
    men: ["Men", "পুরুষ ও পাঞ্জাবি"],
    kids: ["Kids", "ছোটদের উৎসব"],
    unisex: ["Shawls & Silk", "শাল ও ক্যাশমিয়ার"],
  };
  const [audEn, audBn] = audienceLabel[effectiveAudience] ?? ["", ""];

  // 1. Filter
  let filtered = products.filter((prod) => {
    if (featuredOnly && !prod.featured) return false;
    const matchesAudience =
      effectiveAudience === "all" || prod.audience === effectiveAudience;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      prod.name_en.toLowerCase().includes(q) ||
      (prod.name_bn && prod.name_bn.includes(q)) ||
      prod.category.toLowerCase().includes(q) ||
      (prod.category_bn && prod.category_bn.includes(q)) ||
      prod.fabric_en.toLowerCase().includes(q);
    return matchesAudience && matchesSearch;
  });

  // 2. Sort
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.variants[0]?.priceBdt ?? a.variants[0]?.priceQar ?? 0;
    const priceB = b.variants[0]?.priceBdt ?? b.variants[0]?.priceQar ?? 0;

    if (sortBy === "price-asc") {
      return priceA - priceB;
    }
    if (sortBy === "price-desc") {
      return priceB - priceA;
    }
    if (sortBy === "newest") {
      return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    }
    // featured default
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  if (limit && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  const defaultTitleEn =
    effectiveAudience === "all"
      ? "The Bangladesh Festive & Wedding Edit"
      : `${audEn} Collection`;
  const defaultTitleBn =
    effectiveAudience === "all"
      ? "বাংলাদেশ ফেস্টিভ ও ওয়েডিং কালেকশন"
      : `কালেকশন: ${audBn}`;

  const defaultSubtitleEn =
    effectiveAudience === "all"
      ? "Full Seasonal Curation"
      : `Curated for: ${audEn}`;
  const defaultSubtitleBn =
    effectiveAudience === "all"
      ? "সকল এক্সক্লুসিভ ডিজাইন"
      : `মডেল: ${audBn}`;

  const resolvedTitleBn = title_bn ?? title_ar ?? defaultTitleBn;
  const resolvedSubtitleBn = subtitle_bn ?? subtitle_ar ?? defaultSubtitleBn;

  return (
    <section id="catalog-grid" className="container mx-auto px-4 py-6 flex-1">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#ECE4D4]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#88652A] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isBn
                ? resolvedSubtitleBn
                : subtitle_en ?? defaultSubtitleEn}
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-[#24030B]">
            {isBn ? resolvedTitleBn : title_en ?? defaultTitleEn}
          </h2>
        </div>
      </div>

      {/* Filter and Sorting Toolbar if enabled */}
      {showFilterToolbar && <FilterToolbar resultCount={filtered.length} />}

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ECE4D4] p-8 shadow-xs">
          <EmptyState
            title={
              isBn
                ? "কোনো পণ্য খুঁজে পাওয়া যায়নি"
                : "No items match your selection"
            }
            description={
              isBn
                ? "অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করে সম্পূর্ণ কালেকশন দেখুন।"
                : 'Try clearing your search query or selecting "All Collections" to explore our full seasonal line.'
            }
            actionLabel={isBn ? "ফিল্টার রিসেট করুন" : "Reset All Filters"}
            onAction={() => {
              setActiveAudience("all");
              setSearchQuery("");
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
