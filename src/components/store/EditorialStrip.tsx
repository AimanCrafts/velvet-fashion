import React from "react";
import { useStore } from "../../context/StoreContext";
import { Award, Compass, Feather, Sparkles } from "lucide-react";

export const EditorialStrip: React.FC = () => {
  const { isBn } = useStore();

  const highlights = [
    {
      icon: Feather,
      title_en: "Artisanal Velvet & Pure Silk",
      title_bn: "মখমল ও পিওর সিল্ক কারুকাজ",
      desc_en: "Selected premium lots woven for climate comfort, festive grandeur, and enduring drape.",
      desc_bn: "বাংলাদেশের আবহাওয়া ও উৎসবের উপযোগী প্রিমিয়াম সিল্ক-ভেলভেট ও আরামদায়ক টেক্সটাইল।",
    },
    {
      icon: Award,
      title_en: "Bespoke Cut & Zardozi Finishing",
      title_bn: "নিখুঁত কাটিং ও জারদৌসি ফিনিশিং",
      desc_en: "Clean silhouettes accented with delicate hand-embroidered Zari, dabka, and pearl buttons.",
      desc_bn: "দক্ষ কারিগরদের নিখুঁত সেলাই, সূক্ষ্ম হাতের কাজ ও ঐতিহ্যবাহী জারদৌসি নকশার সংমিশ্রণ।",
    },
    {
      icon: Compass,
      title_en: "Dhaka & 64 Districts Dispatch",
      title_bn: "ঢাকা ও ৬৪ জেলায় হোম ডেলিভারি",
      desc_en: "Express doorstep courier across Dhaka and nationwide with Cash on Delivery and bKash.",
      desc_en_sub: "পণ্য দেখে নিশ্চিত হয়ে মূল্য পরিশোধের বিশ্বস্ত ক্যাশ অন ডেলিভারি সুবিধা।",
      desc_bn: "ঢাকায় ২৪ ঘণ্টায় এবং সারাদেশে হোম ডেলিভারি ও পণ্য দেখে মূল্য পরিশোধের সুবিধা।",
    },
    {
      icon: Sparkles,
      title_en: "Official Compliance & Licensing",
      title_bn: "সরকারি লাইসেন্স ও নিরাপত্তা নিশ্চয়তা",
      desc_en: "Operated in compliance with Bangladesh Digital Commerce Guidelines 2021 with transparent 7-day exchange.",
      desc_bn: "ডিজিটাল কমার্স নির্দেশিকা ২০২১ অনুসারে পরিচালিত ও সহজ ৭ দিনের সাইজ এক্সচেঞ্জ সুবিধা।",
    },
  ];

  return (
    <section className="bg-[#24030B] text-[#FAF8F5] py-16 my-12 border-y border-[#C5A059]/30 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3E0713] via-transparent to-transparent opacity-60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C5A059] block mb-2">
            {isBn ? "ভেলভেট ফ্যাশন মানদণ্ড" : "THE VELVET ATELIER"}
          </span>
          <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-normal text-white">
            {isBn ? "আভিজাত্য ও ঐতিহ্যবাহী কারুকাজের সমন্বয়" : "Sartorial Excellence, Tailored for Bangladesh"}
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#3E0713]/60 border border-[#C5A059]/20 rounded-2xl p-6 text-center hover:border-[#C5A059]/50 transition duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5]/10 border border-[#C5A059]/40 flex items-center justify-center mx-auto mb-4 text-[#F4E2B5]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-['Playfair_Display'] text-base font-semibold text-[#F4E2B5] mb-2">
                  {isBn ? item.title_bn : item.title_en}
                </h3>
                <p className="text-xs text-[#ECE4D4]/80 leading-relaxed">
                  {isBn ? item.desc_bn : item.desc_en}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
