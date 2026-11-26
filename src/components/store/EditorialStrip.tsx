import React from "react";
import { useStore } from "../../context/StoreContext";
import { Award, Compass, Feather, ShieldCheck } from "lucide-react";

export const EditorialStrip: React.FC = () => {
  const { isBn } = useStore();

  const highlights = [
    {
      index: "01",
      icon: Feather,
      title_en: "Artisanal Velvet & Silk",
      title_bn: "মখমল ও পিওর সিল্ক কারুকাজ",
      desc_en: "Selected textile lots woven for breathable drape and winter comfort.",
      desc_bn: "বাংলাদেশের আবহাওয়া ও উৎসবের উপযোগী প্রিমিয়াম সিল্ক ও ভেলভেট।",
    },
    {
      index: "02",
      icon: Award,
      title_en: "Handcrafted Zardozi",
      title_bn: "নিখুঁত কাটিং ও জারদৌসি",
      desc_en: "Clean tailored silhouettes accented with zari, dabka, and antiqued brass.",
      desc_bn: "দক্ষ কারিগরদের হাতের জরি, দাবকা ও অ্যান্টিক মেটাল ফিনিশিং।",
    },
    {
      index: "03",
      icon: Compass,
      title_en: "64 Districts Dispatch",
      title_bn: "ঢাকা ও ৬৪ জেলায় ডেলিভারি",
      desc_en: "24h Dhaka courier and nationwide Cash on Delivery or bKash.",
      desc_bn: "ঢাকায় ২৪ ঘণ্টায় এবং সারাদেশে পণ্য দেখে মূল্য পরিশোধের সুবিধা।",
    },
    {
      index: "04",
      icon: ShieldCheck,
      title_en: "Transparent Standards",
      title_bn: "সরকারি লাইসেন্স ও নিশ্চয়তা",
      desc_en: "Guided by BD Digital Commerce rules with a clear 7-day fit exchange.",
      desc_bn: "ডিজিটাল কমার্স নির্দেশিকা মেনে পরিচালিত ও সহজ ৭ দিনের এক্সচেঞ্জ।",
    },
  ];

  return (
    <section className="bg-[#24030B] text-[#FAF8F5] py-16 border-y border-[#C5A059]/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C5A059] block mb-2">
              {isBn ? "ভেলভেট আতেলিয়ে মানদণ্ড" : "BEHIND THE SEAMS"}
            </span>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-white">
              {isBn ? "আভিজাত্য ও ঐতিহ্যবাহী কারুকাজের সমন্বয়" : "Craftsmanship Standard"}
            </h2>
          </div>
          <p className="text-xs text-[#ECE4D4]/75 max-w-md">
            {isBn
              ? "প্রতিটি ব্যাচ ঢাকা ও নারায়ণগঞ্জের দক্ষ কারিগরদের তত্ত্বাবধানে পরীক্ষা করে ডিসপ্যাচ করা হয়।"
              : "Every garment lot is individually inspected in Dhaka for weave integrity, finishing, and fit before release."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="bg-[#3E0713]/45 border border-[#C5A059]/25 p-6 hover:border-[#C5A059]/60 transition"
              >
                <div className="flex items-center justify-between mb-5">
                  <Icon className="w-5 h-5 text-[#E6C87C]" />
                  <span className="font-mono text-[11px] text-[#C5A059]/80">{item.index}</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-lg text-[#F4E2B5] mb-2">
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
