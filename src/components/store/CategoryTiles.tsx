import React from "react";
import { useStore } from "../../context/StoreContext";
import { Link } from "../../router/Router";
import type { Audience } from "../../types";
import { Sparkles, ArrowRight } from "lucide-react";

interface CategoryTileItem {
  id: Audience;
  title_en: string;
  title_bn: string;
  subtitle_en: string;
  subtitle_bn: string;
  itemCount: string;
  image: string;
}

export const CategoryTiles: React.FC = () => {
  const { isBn, setActiveAudience } = useStore();

  const categories: CategoryTileItem[] = [
    {
      id: "women",
      title_en: "Women's Couture & Sarees",
      title_bn: "নারী ও পার্টি শাড়ি-কাফতান",
      subtitle_en: "Royal Velvet Kaftans & Festive Sarees",
      subtitle_bn: "মখমল কাফতান ও এক্সক্লুসিভ শাড়ি",
      itemCount: "6 Designs",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "men",
      title_en: "Men's Panjabi & Prince Coat",
      title_bn: "পুরুষের পাঞ্জাবি ও প্রিন্স কোট",
      subtitle_en: "Handcrafted Silk Panjabis & Blazers",
      subtitle_bn: "সিল্ক পাঞ্জাবি ও টাক্সিডো ব্লেজার",
      itemCount: "3 Designs",
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "kids",
      title_en: "Little Prince & Princess",
      title_bn: "ছোটদের উৎসবের পোশাক",
      subtitle_en: "Festive Panjabi Sets & Velvet Kotis",
      subtitle_bn: "ভেলভেট কোটি ও পাঞ্জাবি সেট",
      itemCount: "2 Designs",
      image:
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "unisex",
      title_en: "Pashmina & Velvet Shawls",
      title_bn: "পশমিনা ও উইন্টার শাল",
      subtitle_en: "Dual-Tone Reversible Cashmere Wraps",
      subtitle_bn: "উভয় পাশে ব্যবহারযোগ্য বিলাসবহুল শাল",
      itemCount: "2 Designs",
      image:
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#88652A] uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? "এক্সক্লুসিভ কালেকশন" : "Bespoke Portfolios"}</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-[#24030B]">
            {isBn ? "ক্যাটাগরি অনুযায়ী ব্রাউজ করুন" : "Curated for Every Occasion"}
          </h2>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3E0713] hover:text-[#C5A059] transition"
        >
          <span>{isBn ? "সকল পণ্য দেখুন" : "View All Collections"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/shop"
            onClick={() => setActiveAudience(cat.id)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] border border-[#ECE4D4] bg-[#F2ECE4] shadow-xs hover:border-[#C5A059]/70 hover:shadow-xl transition-all duration-500"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={isBn ? cat.title_bn : cat.title_en}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#24030B] via-[#24030B]/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

            {/* Top Badge: Item Count */}
            <div className="absolute top-4 start-4">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#F4E2B5] border border-white/20">
                {cat.itemCount}
              </span>
            </div>

            {/* Content Details */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-start">
              <span className="text-[10px] text-[#E6C87C] font-semibold uppercase tracking-wider mb-1">
                {isBn ? cat.subtitle_bn : cat.subtitle_en}
              </span>
              <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-normal text-white group-hover:text-[#F4E2B5] transition-colors leading-snug">
                {isBn ? cat.title_bn : cat.title_en}
              </h3>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#FAF8F5]/80 group-hover:text-white font-medium transition-colors">
                <span>{isBn ? "কালেকশন দেখুন" : "Explore Edit"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
