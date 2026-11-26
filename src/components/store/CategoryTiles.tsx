import React from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter } from "../../router/Router";
import type { Audience } from "../../types";
import { ArrowUpRight } from "lucide-react";

interface CategoryTileItem {
  index: string;
  id: Audience;
  title_en: string;
  title_bn: string;
  subtitle_en: string;
  subtitle_bn: string;
  image: string;
}

export const CategoryTiles: React.FC = () => {
  const { navigate } = useRouter();
  const { isBn, resetFilters, setActiveAudience } = useStore();

  const categories: CategoryTileItem[] = [
    {
      index: "01",
      id: "women",
      title_en: "Women's Couture",
      title_bn: "নারী ও পার্টি শাড়ি-কাফতান",
      subtitle_en: "Velvet Kaftans & Organza Sarees",
      subtitle_bn: "ভেলভেট কাফতান ও এক্সক্লুসিভ শাড়ি",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",
    },
    {
      index: "02",
      id: "men",
      title_en: "Men's Tailoring",
      title_bn: "পুরুষের পাঞ্জাবি ও শেরওয়ানি",
      subtitle_en: "Silk Panjabis & Velvet Cuts",
      subtitle_bn: "সিল্ক পাঞ্জাবি ও ভেলভেট শেরওয়ানি",
      image:
        "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=80",
    },
    {
      index: "03",
      id: "kids",
      title_en: "Kids Festive",
      title_bn: "ছোটদের উৎসবের পোশাক",
      subtitle_en: "Combed Cotton & Velvet Kotis",
      subtitle_bn: "কটন পাঞ্জাবি ও ভেলভেট কোটি",
      image:
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=700&q=80",
    },
    {
      index: "04",
      id: "unisex",
      title_en: "Shawls & Cashmere",
      title_bn: "পশমিনা ও উইন্টার শাল",
      subtitle_en: "Reversible Mulberry & Cashmere",
      subtitle_bn: "রিভার্সিবল কাশ্মীরি শাল",
      image:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const handleSelect = (aud: Audience) => {
    resetFilters();
    setActiveAudience(aud);
    navigate("/shop");
  };

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#ECE4D4]">
        <div>
          <p className="text-[10px] font-bold text-[#88652A] uppercase tracking-[0.25em] mb-1.5">
            {isBn ? "বিভাগ অনুযায়ী দেখুন" : "DEPARTMENTS"}
          </p>
          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-[#24030B]">
            {isBn ? "প্রতিটি উপলক্ষের জন্য বাছাইকৃত" : "Curated Wardrobes"}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => handleSelect("all")}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#3E0713] hover:text-[#88652A] transition"
        >
          <span>{isBn ? "সব কালেকশন" : "View All Departments"}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Architectural Portrait Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className="group relative overflow-hidden aspect-[3/4] border border-[#ECE4D4] bg-[#F2ECE4] text-start transition hover:border-[#C5A059]"
          >
            <img
              src={cat.image}
              alt={isBn ? cat.title_bn : cat.title_en}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0208] via-[#1A0208]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            <span className="absolute top-4 start-4 font-mono text-[11px] tracking-widest text-[#F4E2B5]/90 border border-white/25 bg-black/25 backdrop-blur-xs px-2 py-0.5">
              {cat.index}
            </span>

            <span className="absolute top-4 end-4 w-8 h-8 flex items-center justify-center bg-white/90 text-[#24030B] opacity-0 group-hover:opacity-100 transition duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[10px] text-[#E6C87C] font-semibold uppercase tracking-[0.16em] mb-1">
                {isBn ? cat.subtitle_bn : cat.subtitle_en}
              </p>
              <h3 className="font-['Playfair_Display'] text-xl text-white group-hover:text-[#F4E2B5] transition-colors">
                {isBn ? cat.title_bn : cat.title_en}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
