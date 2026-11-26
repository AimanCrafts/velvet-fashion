import React from "react";
import { ProductGrid } from "../components/store/ProductGrid";
import { Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { ChevronRight } from "lucide-react";

export const ShopPage: React.FC = () => {
  const { isBn, searchQuery, activeAudience, activeOccasion, wishlistOnly } = useStore();

  const headerContext = wishlistOnly
    ? isBn
      ? "সংরক্ষিত পছন্দের তালিকা"
      : "Your Saved Wishlist"
    : activeOccasion !== "all"
    ? isBn
      ? "উপলক্ষ অনুযায়ী বাছাই"
      : `${activeOccasion.charAt(0).toUpperCase() + activeOccasion.slice(1)} Wardrobe Edit`
    : activeAudience !== "all"
    ? isBn
      ? "বিভাগীয় কালেকশন"
      : `${activeAudience.charAt(0).toUpperCase() + activeAudience.slice(1)}'s Edit`
    : isBn
    ? "ভেলভেট ফ্যাশন ক্যাটালগ"
    : "The Complete Archive";

  return (
    <div className="animate-fade-in">
      <div className="bg-[#F4EFE6] border-b border-[#ECE4D4] py-10">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-[11px] text-stone-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-[#3E0713] transition">
              {isBn ? "হোম" : "Home"}
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="font-semibold text-[#3E0713]">
              {isBn ? "সকল কালেকশন" : "Collections"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-[#88652A] uppercase tracking-[0.25em] mb-1.5">
                {headerContext}
              </p>
              <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-normal text-[#24030B]">
                {isBn
                  ? "অভিজাত মখমল, সিল্ক ও উৎসবের পোশাক"
                  : "Curated Couture & Ready-to-Wear"}
              </h1>
            </div>

            <p className="text-xs text-stone-600 max-w-md leading-relaxed">
              {isBn
                ? "সীমিত ব্যাচে তৈরি প্রতিটি পোশাক। ঢাকা ও ৬৪ জেলায় হোম ডেলিভারি, ক্যাশ অন ডেলিভারি ও বিকাশ সুবিধা।"
                : "Tailored in limited Dhaka batches for men, women, and children — delivered across all 64 districts with Cash on Delivery & bKash."}
            </p>
          </div>

          {searchQuery.trim() && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#3E0713] text-[#F4E2B5] text-xs font-medium">
              <span>
                {isBn ? `অনুসন্ধান: "${searchQuery}"` : `Search query: "${searchQuery}"`}
              </span>
            </div>
          )}
        </div>
      </div>

      <ProductGrid showFilterToolbar={true} />
    </div>
  );
};
