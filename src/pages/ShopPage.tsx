import React from "react";
import { ProductGrid } from "../components/store/ProductGrid";
import { Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { ChevronRight, Sparkles } from "lucide-react";

export const ShopPage: React.FC = () => {
  const { isBn, searchQuery } = useStore();

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link to="/" className="hover:text-[#3E0713] transition">
          {isBn ? "হোম" : "Home"}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="font-semibold text-stone-900">
          {isBn ? "সকল কালেকশন ও পোশাক" : "All Collections"}
        </span>
      </nav>

      {/* Header banner */}
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#ECE4D4] p-8 md:p-10 mb-8 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#88652A] uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isBn ? "ভেলভেট ফ্যাশন বাংলাদেশ ক্যাটালগ" : "THE VELVET READY-TO-WEAR ARCHIVE"}</span>
        </div>

        <h1 className="font-['Playfair_Display'] text-2xl sm:text-4xl font-normal text-[#24030B] mb-3">
          {isBn ? "অভিজাত মখমল, সিল্ক ও উৎসবের রাজকীয় পোশাক" : "Curated Haute Couture & Ready-to-Wear"}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
          {isBn
            ? "শীতকালীন উৎসব ও বিয়ের মৌসুমের জন্য তৈরিকৃত পোশাকের সম্ভার। নারী, পুরুষ ও শিশুদের জন্য মানসম্মত কারুকাজ, দ্রুত হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা।"
            : "Explore our complete seasonal roster for men, women, children, and luxury accessories. Sourced in curated batches and delivered nationwide with Cash on Delivery & bKash."}
        </p>

        {searchQuery.trim() && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E0713]/10 text-[#3E0713] text-xs font-semibold">
            <span>
              {isBn ? `অনুসন্ধানের ফলাফল: "${searchQuery}"` : `Searching for: "${searchQuery}"`}
            </span>
          </div>
        )}
      </div>

      {/* Full Catalog with Filter Toolbar */}
      <ProductGrid showFilterToolbar={true} />
    </div>
  );
};
