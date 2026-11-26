import React from "react";
import { HeroBanner } from "../components/store/HeroBanner";
import { CategoryTiles } from "../components/store/CategoryTiles";
import { ProductGrid } from "../components/store/ProductGrid";
import { OccasionEdits } from "../components/store/OccasionEdits";
import { EditorialStrip } from "../components/store/EditorialStrip";
import { BrandStory } from "../components/store/BrandStory";
import { Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { ArrowRight } from "lucide-react";

export const HomePage: React.FC = () => {
  const { isBn, resetFilters } = useStore();

  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <CategoryTiles />

      <div className="pb-12">
        <ProductGrid
          limit={9}
          showFilterToolbar={false}
          title_en="Seasonal Signature Pieces"
          title_bn="শীতকালীন বিশেষ উৎসব কালেকশন"
          subtitle_en="CURATED READY-TO-WEAR"
          subtitle_bn="সীমিত সংস্করণের এক্সক্লুসিভ পোশাক"
        />

        <div className="text-center pt-4">
          <Link
            to="/shop"
            onClick={() => resetFilters()}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-[0.2em] transition active:scale-95"
          >
            <span>{isBn ? "সম্পূর্ণ কালেকশন দেখুন" : "Browse Complete Collection"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <OccasionEdits />

      <EditorialStrip />

      <BrandStory />
    </div>
  );
};
