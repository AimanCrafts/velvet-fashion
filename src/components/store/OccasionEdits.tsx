import React from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter } from "../../router/Router";
import type { OccasionFilter } from "../../types";
import { ArrowRight } from "lucide-react";

interface OccasionCard {
  id: Exclude<OccasionFilter, "all">;
  tag_en: string;
  tag_bn: string;
  title_en: string;
  title_bn: string;
  desc_en: string;
  desc_bn: string;
  image: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    id: "wedding",
    tag_en: "Occasion 01",
    tag_bn: "পর্ব ০১",
    title_en: "Wedding & Reception",
    title_bn: "বিয়ে ও রিসেপশন সাজ",
    desc_en: "Velvet kaftans, embroidered sarees & sovereign sherwani cuts.",
    desc_bn: "ভেলভেট কাফতান, শাড়ি ও সভরেন শেরওয়ানি-পাঞ্জাবি।",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "festive",
    tag_en: "Occasion 02",
    tag_bn: "পর্ব ০২",
    title_en: "Festive & Family Eid",
    title_bn: "ঈদ ও পারিবারিক উৎসব",
    desc_en: "Breathable silk-cotton panjabis & matching kids festive kotis.",
    desc_bn: "আরামদায়ক সিল্ক-কটন পাঞ্জাবি ও ছোটদের কোটি সেট।",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "evening",
    tag_en: "Occasion 03",
    tag_bn: "পর্ব ০৩",
    title_en: "Winter Soirée",
    title_bn: "শীতকালীন সন্ধ্যার পার্টি",
    desc_en: "Deep jewel tones in heavy velvet & cashmere layering.",
    desc_bn: "গভীর মখমল রঙ ও কাশ্মীরি শালের আভিজাত্য।",
    image:
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "everyday",
    tag_en: "Occasion 04",
    tag_bn: "পর্ব ০৪",
    title_en: "Wardrobe Essentials",
    title_bn: "নিত্যদিনের মার্জিত পোশাক",
    desc_en: "Understated heritage weaves & reversible winter wraps.",
    desc_bn: "ঐতিহ্যবাহী তাঁতের কাজ ও রিভার্সিবল শাল।",
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80",
  },
];

export const OccasionEdits: React.FC = () => {
  const { navigate } = useRouter();
  const { isBn, resetFilters, setActiveOccasion } = useStore();

  const handleOpenOccasion = (id: OccasionFilter) => {
    resetFilters();
    setActiveOccasion(id);
    navigate("/shop");
  };

  return (
    <section className="bg-[#F4EFE6] border-y border-[#ECE4D4] py-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#88652A] mb-1.5">
              {isBn ? "উপলক্ষ অনুযায়ী বাছাই" : "SHOP BY OCCASION"}
            </p>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#24030B]">
              {isBn ? "অনুষ্ঠান অনুযায়ী স্টাইল এডিট" : "Dressed for the Moment"}
            </h2>
          </div>
          <p className="text-xs text-stone-600 max-w-md">
            {isBn
              ? "আপনার অনুষ্ঠানের আবহ অনুযায়ী সরাসরি কালেকশন ফিল্টার করুন — বিয়ে থেকে ঘরোয়া দাওয়াত।"
              : "Browse our collection by context — from grand Dhaka receptions to understated winter gatherings."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {OCCASIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpenOccasion(item.id)}
              className="group bg-white border border-[#ECE4D4] hover:border-[#C5A059] transition text-start flex flex-col overflow-hidden"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={isBn ? item.title_bn : item.title_en}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#88652A] block mb-1">
                    {isBn ? item.tag_bn : item.tag_en}
                  </span>
                  <h3 className="font-['Playfair_Display'] text-lg text-[#24030B] group-hover:text-[#3E0713] mb-1.5">
                    {isBn ? item.title_bn : item.title_en}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isBn ? item.desc_bn : item.desc_en}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F0EAE0] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#3E0713]">
                  <span>{isBn ? "এডিট দেখুন" : "Shop Edit"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
