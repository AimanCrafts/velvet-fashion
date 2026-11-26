import React from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "./ProductCard";
import { FilterToolbar } from "./FilterToolbar";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import type { Audience } from "../../types";

interface ProductGridProps {
  title_en?: string;
  title_bn?: string;
  title_ar?: string;
  subtitle_en?: string;
  subtitle_bn?: string;
  subtitle_ar?: string;
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
    activeOccasion,
    wishlistOnly,
    wishlist,
    inStockOnly,
    searchQuery,
    sortBy,
    isBn,
    resetFilters,
  } = useStore();

  const effectiveAudience = fixedAudience ?? activeAudience;

  const audienceLabel: Record<string, [string, string]> = {
    women: ["Women's Atelier", "নারী ও শাড়ি"],
    men: ["Men's Tailoring", "পুরুষ ও পাঞ্জাবি"],
    kids: ["Kids Festive", "ছোটদের উৎসব"],
    unisex: ["Shawls & Cashmere", "শাল ও ক্যাশমিয়ার"],
  };
  const [audEn, audBn] = audienceLabel[effectiveAudience] ?? ["", ""];

  let filtered = products.filter((prod) => {
    if (featuredOnly && !prod.featured) return false;
    if (showFilterToolbar && wishlistOnly && !wishlist.includes(prod.id)) return false;
    if (
      showFilterToolbar &&
      inStockOnly &&
      !prod.variants.some((v) => v.stockQty > 0)
    ) {
      return false;
    }
    if (
      showFilterToolbar &&
      activeOccasion !== "all" &&
      !(prod.occasions || []).includes(activeOccasion)
    ) {
      return false;
    }

    const matchesAudience =
      effectiveAudience === "all" || prod.audience === effectiveAudience;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      prod.name_en.toLowerCase().includes(q) ||
      (prod.name_bn && prod.name_bn.includes(q)) ||
      prod.category.toLowerCase().includes(q) ||
      (prod.category_bn && prod.category_bn.includes(q)) ||
      prod.fabric_en.toLowerCase().includes(q) ||
      prod.collection.toLowerCase().includes(q);
    return matchesAudience && matchesSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    const priceA = a.variants[0]?.priceBdt ?? a.variants[0]?.priceQar ?? 0;
    const priceB = b.variants[0]?.priceBdt ?? b.variants[0]?.priceQar ?? 0;

    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "newest") return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  if (limit && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  const defaultTitleEn =
    wishlistOnly && showFilterToolbar
      ? "Saved Wishlist"
      : effectiveAudience === "all"
      ? "Seasonal Archive"
      : audEn;
  const defaultTitleBn =
    wishlistOnly && showFilterToolbar
      ? "আপনার পছন্দের তালিকা"
      : effectiveAudience === "all"
      ? "সিজনাল আর্কাইভ ও কালেকশন"
      : `কালেকশন: ${audBn}`;

  const defaultSubtitleEn =
    effectiveAudience === "all" ? "READY-TO-WEAR CURATION" : "DEPARTMENT EDIT";
  const defaultSubtitleBn =
    effectiveAudience === "all" ? "সকল এক্সক্লুসিভ ডিজাইন" : `বিভাগ: ${audBn}`;

  const resolvedTitleBn = title_bn ?? title_ar ?? defaultTitleBn;
  const resolvedSubtitleBn = subtitle_bn ?? subtitle_ar ?? defaultSubtitleBn;

  return (
    <section id="catalog-grid" className="container mx-auto px-4 py-8 flex-1">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#ECE4D4]">
        <div>
          <p className="text-[10px] font-bold text-[#88652A] uppercase tracking-[0.25em] mb-1.5">
            {isBn ? resolvedSubtitleBn : subtitle_en ?? defaultSubtitleEn}
          </p>
          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-[#24030B]">
            {isBn ? resolvedTitleBn : title_en ?? defaultTitleEn}
          </h2>
        </div>
      </div>

      {showFilterToolbar && <FilterToolbar resultCount={filtered.length} />}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#ECE4D4] p-10">
          <EmptyState
            title={
              isBn
                ? "কোনো পোশাক খুঁজে পাওয়া যায়নি"
                : "No pieces match your current filters"
            }
            description={
              isBn
                ? "অনুগ্রহ করে অন্য ফিল্টার নির্বাচন করুন অথবা সব ফিল্টার রিসেট করে সম্পূর্ণ কালেকশন দেখুন।"
                : "Try clearing your search or occasion filter to view the complete seasonal wardrobe."
            }
            actionLabel={isBn ? "সব ফিল্টার রিসেট করুন" : "Reset All Filters"}
            onAction={resetFilters}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
