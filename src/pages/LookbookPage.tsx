import React from "react";
import { Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/store/ProductCard";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface EditorialStory {
  number: string;
  tag_en: string;
  tag_bn: string;
  title_en: string;
  title_bn: string;
  body_en: string;
  body_bn: string;
  fabricNote_en: string;
  fabricNote_bn: string;
  image: string;
  productIds: string[];
}

const STORIES: EditorialStory[] = [
  {
    number: "01",
    tag_en: "Winter Royale • Evening Couture",
    tag_bn: "উইন্টার রয়্যাল • ইভনিং কৌতুর",
    title_en: "The Velvet & Zardozi Soirée",
    title_bn: "ভেলভেট ও জারদৌসি সন্ধ্যার সাজ",
    body_en:
      "Heavy mulberry velvet drapes with a quiet architectural weight. Paired with hand-guided metallic zardozi and tissue organza, each piece moves effortlessly from Dhaka nikah ceremonies to winter evening receptions.",
    body_bn:
      "ভারী মালবেরি ভেলভেটের স্বাভাবিক আভিজাত্য ও হাতের জারদৌসি কারুকাজ — ঢাকার বিবাহোত্তর সংবর্ধনা এবং শীতকালীন উৎসবের সন্ধ্যার জন্য নিখুঁত।",
    fabricNote_en: "85% Silk-Touch Royal Velvet • Micro-Velvet & Tissue Organza",
    fabricNote_bn: "৮৫% সিল্ক-টাচ রয়্যাল ভেলভেট • মাইক্রো-ভেলভেট ও টিস্যু অর্গানজা",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85",
    productIds: ["prod-01", "prod-03", "prod-07", "prod-11"],
  },
  {
    number: "02",
    tag_en: "Sartorial Tailoring • Heritage Cuts",
    tag_bn: "সার্টোরিয়াল টেইলরিং • ঐতিহ্যবাহী কাট",
    title_en: "Structured Silk & Sovereign Cuts",
    title_bn: "সিল্ক পাঞ্জাবি ও সভরেন শেরওয়ানি",
    body_en:
      "Inspired by classic subcontinental tailoring and clean Scandinavian proportion, our menswear balances breathable raw silk-cotton panjabis with richly textured emerald velvet coats finished in antiqued brass.",
    body_bn:
      "ঐতিহ্যবাহী পাঞ্জাবির আরাম এবং আধুনিক নিখুঁত কাটিংয়ের সমন্বয় — শ্বাস-প্রশ্বাসযোগ্য সিল্ক-কটন ও গভীর এমারেল্ড ভেলভেটে তৈরি।",
    fabricNote_en: "Raw Silk-Cotton Blend • Heavy Velvet & Antique Brass",
    fabricNote_bn: "র সিল্ক-কটন ব্লেন্ড • হেভি ভেলভেট ও অ্যান্টিক পিতল",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    productIds: ["prod-02", "prod-04", "prod-09", "prod-10"],
  },
  {
    number: "03",
    tag_en: "Behind the Seams • Warmth & Family",
    tag_bn: "কারিগরি গল্প • শাল ও পারিবারিক উৎসব",
    title_en: "Double-Faced Cashmere & Family Looms",
    title_bn: "রিভার্সিবল কাশ্মীরি ও উৎসবের সেট",
    body_en:
      "Created for crisp Dhaka mornings and festive family gatherings: double-sided cashmere shawls bordered in burgundy velvet alongside soft, breathable cotton-silk children's ensembles.",
    body_bn:
      "শীতের সকালের উষ্ণতার জন্য দুই পাশে ব্যবহারযোগ্য কাশ্মীরি শাল এবং ছোটদের জন্য আরামদায়ক কটন-সিল্ক ও ভেলভেট কোটি সেট।",
    fabricNote_en: "70% Grade-A Cashmere • 100% Breathable Cotton-Silk Lining",
    fabricNote_bn: "৭০% গ্রেড-এ কাশ্মীরি • ১০০% সুতি-সিল্ক আরামদায়ক লাইনিং",
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=85",
    productIds: ["prod-05", "prod-06", "prod-14", "prod-15"],
  },
];

export const LookbookPage: React.FC = () => {
  const { isBn, products, resetFilters } = useStore();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-[#24030B] text-[#FAF8F5] py-14 border-b border-[#C5A059]/30">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-[11px] text-[#E6C87C]/80 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-white transition">
              {isBn ? "হোম" : "Home"}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">
              {isBn ? "লুকবুক ও জার্নাল" : "Lookbook & Journal"}
            </span>
          </nav>

          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#C5A059] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "শীতকালীন আর্কাইভ ২০২৬/২৭" : "ATELIER LOOKBOOK 2026/27"}</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-normal leading-tight mb-4">
              {isBn ? "আভিজাত্যের গল্প ও কাপড়ের কারুকাজ" : "Behind the Seams & Seasonal Campaign"}
            </h1>
            <p className="text-sm text-[#ECE4D4]/85 leading-relaxed">
              {isBn
                ? "প্রতিটি পোশাকের নকশা, কাপড়ের উৎস এবং উৎসবের স্টাইলিং নিয়ে আমাদের মৌসুমি লুকবুক।"
                : "An intimate look at the fabrics, Dhaka tailoring rooms, and seasonal silhouettes shaping Velvet Fashion's winter release."}
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Chapters */}
      <div className="container mx-auto px-4 py-14 space-y-20">
        {STORIES.map((story, idx) => {
          const matchedProducts = story.productIds
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is (typeof products)[number] => Boolean(p));

          return (
            <article key={story.number} className="space-y-8 pb-16 border-b border-[#ECE4D4] last:border-b-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="aspect-[16/10] overflow-hidden border border-[#ECE4D4] bg-stone-100">
                    <img
                      src={story.image}
                      alt={isBn ? story.title_bn : story.title_en}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#88652A] uppercase tracking-[0.2em]">
                    <span>CHAPTER {story.number}</span>
                    <span>•</span>
                    <span>{isBn ? story.tag_bn : story.tag_en}</span>
                  </div>

                  <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#24030B]">
                    {isBn ? story.title_bn : story.title_en}
                  </h2>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {isBn ? story.body_bn : story.body_en}
                  </p>

                  <div className="p-3.5 bg-[#FAF8F5] border border-[#ECE4D4] text-xs text-stone-700">
                    <span className="font-bold text-[#3E0713] block mb-0.5 uppercase tracking-wider text-[10px]">
                      {isBn ? "ব্যবহৃত ফ্যাব্রিক" : "Textile Composition"}
                    </span>
                    <span>{isBn ? story.fabricNote_bn : story.fabricNote_en}</span>
                  </div>
                </div>
              </div>

              {matchedProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#88652A]">
                      {isBn ? "এই অধ্যায়ের পোশাকসমূহ" : "Shop This Chapter"}
                    </p>
                    <Link
                      to="/shop"
                      onClick={() => resetFilters()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E0713] hover:underline"
                    >
                      <span>{isBn ? "সব দেখুন" : "View Full Catalog"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
