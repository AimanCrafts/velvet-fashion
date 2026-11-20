import React from "react";
import { HeroBanner } from "../components/store/HeroBanner";
import { CategoryTiles } from "../components/store/CategoryTiles";
import { ProductGrid } from "../components/store/ProductGrid";
import { EditorialStrip } from "../components/store/EditorialStrip";
import { BrandStory } from "../components/store/BrandStory";
import { Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { ArrowRight } from "lucide-react";

export const HomePage: React.FC = () => {
  const { isBn } = useStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Editorial Split Hero with Atmospheric Velvet Overlay */}
      <HeroBanner />

      {/* Bespoke Category Cards */}
      <CategoryTiles />

      {/* Curated Seasonal Showcase */}
      <div>
        <ProductGrid
          limit={6}
          showFilterToolbar={false}
          title_en="Curated Seasonal Highlights"
          title_bn="শীতকালীন বিশেষ উৎসব কালেকশন"
          subtitle_en="Limited Batch Ready-to-Wear"
          subtitle_bn="সীমিত সংস্করণের এক্সক্লুসিভ পোশাক"
        />

        {/* Explore all link */}
        <div className="text-center pt-2 pb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest shadow-md transition active:scale-95"
          >
            <span>{isBn ? "সম্পূর্ণ কালেকশন ব্রাউজ করুন" : "Explore All Collections"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Craftsmanship & Quality Standards */}
      <EditorialStrip />

      {/* Brand Story & Heritage */}
      <BrandStory />
    </div>
  );
};
