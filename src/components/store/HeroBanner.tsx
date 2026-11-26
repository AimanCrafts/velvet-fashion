import React, { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter, Link } from "../../router/Router";
import { formatBdt } from "../../utils/formatters";
import {
  Truck,
  Banknote,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Audience, OccasionFilter } from "../../types";

interface HeroSlide {
  id: string;
  eyebrow_en: string;
  eyebrow_bn: string;
  headline_en: string;
  headline_accent_en: string;
  headline_bn: string;
  headline_accent_bn: string;
  copy_en: string;
  copy_bn: string;
  ctaLabel_en: string;
  ctaLabel_bn: string;
  targetAudience: Audience;
  targetOccasion: OccasionFilter;
  bgImage: string;
  featureProductId: string;
  featureTag_en: string;
  featureTag_bn: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "winter-royale",
    eyebrow_en: "Winter Royale 2026/27 • Dhaka Atelier",
    eyebrow_bn: "উইন্টার রয়্যাল ২০২৬/২৭ • ঢাকা আতেলিয়ে",
    headline_en: "Tailored Velvet & Zardozi,",
    headline_accent_en: "Made for Grand Evenings.",
    headline_bn: "মখমল ও জারদৌসির রাজকীয় সাজ,",
    headline_accent_bn: "উৎসব ও বিয়ের প্রতিটি সন্ধ্যায়।",
    copy_en:
      "Heavy mulberry velvet kaftans, embroidered sarees, and hand-finished festive attire crafted in limited Dhaka batches.",
    copy_bn:
      "মালবেরি সিল্ক-ভেলভেট কাফতান, জারদৌসি শাড়ি ও উৎসবমুখর পাঞ্জাবির সীমিত সংস্করণ — ৬৪ জেলায় হোম ডেলিভারি।",
    ctaLabel_en: "Shop Women's Edit",
    ctaLabel_bn: "নারীদের কালেকশন দেখুন",
    targetAudience: "women",
    targetOccasion: "wedding",
    bgImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85",
    featureProductId: "prod-01",
    featureTag_en: "01 / Signature Kaftan",
    featureTag_bn: "০১ / সিগনেচার কাফতান",
  },
  {
    id: "sartorial-men",
    eyebrow_en: "The Sartorial Edit • Men's Tailoring",
    eyebrow_bn: "সার্টোরিয়াল এডিট • পুরুষদের কালেকশন",
    headline_en: "Heritage Silk Panjabis,",
    headline_accent_en: "Cut with Modern Precision.",
    headline_bn: "ঐতিহ্যবাহী সিল্ক পাঞ্জাবি ও কোট,",
    headline_accent_bn: "আধুনিক নিখুঁত কাটিংয়ে তৈরি।",
    copy_en:
      "Raw silk-cotton weaves and emerald velvet sherwani cuts finished with hand-cast antiqued brass hardware.",
    copy_bn:
      "খাঁটি সিল্ক-কটন ও গভীর এমারেল্ড ভেলভেটে তৈরি পাঞ্জাবি এবং শেরওয়ানি-কাট — ঢাকার কারিগরি ঐতিহ্যে গড়া।",
    ctaLabel_en: "Explore Men's Tailoring",
    ctaLabel_bn: "পুরুষদের কালেকশন দেখুন",
    targetAudience: "men",
    targetOccasion: "festive",
    bgImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85",
    featureProductId: "prod-04",
    featureTag_en: "02 / Sovereign Cut",
    featureTag_bn: "০২ / সভরেন শেরওয়ানি",
  },
  {
    id: "behind-the-seams",
    eyebrow_en: "Behind the Seams • Cashmere & Family",
    eyebrow_bn: "কারিগরি গল্প • শাল ও পারিবারিক উৎসব",
    headline_en: "Reversible Cashmere",
    headline_accent_en: "& Family Celebrations.",
    headline_bn: "দুই পাশে ব্যবহারযোগ্য পশমিনা,",
    headline_accent_bn: "সাথে ছোটদের উৎসবের পোশাক।",
    copy_en:
      "Grade-A dual-tone cashmere shawls and breathable combed-cotton festive sets designed for all-day warmth and poise.",
    copy_bn:
      "শীতের সন্ধ্যার জন্য প্রিমিয়াম কাশ্মীরি শাল এবং ছোট সোনামণিদের আরামদায়ক ভেলভেট কোটি-পাঞ্জাবি সেট।",
    ctaLabel_en: "View Shawls & Kids",
    ctaLabel_bn: "শাল ও ছোটদের পোশাক দেখুন",
    targetAudience: "unisex",
    targetOccasion: "everyday",
    bgImage:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1600&q=85",
    featureProductId: "prod-06",
    featureTag_en: "03 / Reversible Wrap",
    featureTag_bn: "০৩ / রিভার্সিবল শাল",
  },
];

export const HeroBanner: React.FC = () => {
  const { navigate } = useRouter();
  const {
    isBn,
    products,
    resetFilters,
    setActiveAudience,
    setActiveOccasion,
  } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[activeIndex];
  const featuredProduct =
    products.find((p) => p.id === currentSlide.featureProductId) || products[0];

  const handleSlideCta = () => {
    resetFilters();
    setActiveAudience(currentSlide.targetAudience);
    setActiveOccasion(currentSlide.targetOccasion);
    navigate("/shop");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Full-Bleed Architectural Campaign Hero */}
      <div className="relative bg-[#1B0208] text-[#FAF8F5] min-h-[540px] lg:min-h-[620px] flex items-center">
        {/* Background Media */}
        <div className="absolute inset-0 z-0">
          <img
            key={currentSlide.id}
            src={currentSlide.bgImage}
            alt={isBn ? currentSlide.headline_bn : currentSlide.headline_en}
            className="w-full h-full object-cover object-center opacity-35 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0208] via-[#24030B]/90 to-[#1A0208]/60" />
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-4 py-14 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Editorial Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-[#E6C87C] font-semibold">
                <span className="w-8 h-[1px] bg-[#C5A059]" />
                <span>{isBn ? currentSlide.eyebrow_bn : currentSlide.eyebrow_en}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-['Playfair_Display'] font-normal leading-[1.12] text-[#FDFBF7]">
                {isBn ? (
                  <>
                    {currentSlide.headline_bn}
                    <br />
                    <span className="italic text-[#E6C87C]">{currentSlide.headline_accent_bn}</span>
                  </>
                ) : (
                  <>
                    {currentSlide.headline_en}
                    <br />
                    <span className="italic text-[#E6C87C]">{currentSlide.headline_accent_en}</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#ECE4D4]/90 max-w-xl leading-relaxed font-light">
                {isBn ? currentSlide.copy_bn : currentSlide.copy_en}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleSlideCta}
                  className="bg-[#C5A059] hover:bg-[#D6B16A] text-[#24030B] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 transition active:scale-95 flex items-center gap-2.5 shadow-lg"
                >
                  <span>{isBn ? currentSlide.ctaLabel_bn : currentSlide.ctaLabel_en}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/lookbook"
                  className="border border-[#C5A059]/60 hover:bg-white/10 text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.18em] px-7 py-4 transition"
                >
                  {isBn ? "লুকবুক দেখুন" : "Explore Lookbook"}
                </Link>
              </div>

              {/* Slide Controls */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-1 transition-all duration-300 ${
                        idx === activeIndex ? "w-10 bg-[#C5A059]" : "w-4 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#E6C87C]">
                  0{activeIndex + 1} / 0{SLIDES.length}
                </span>
                <div className="flex items-center gap-1 ms-auto sm:ms-4">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                    className="p-2 border border-white/20 hover:border-[#C5A059] text-white/80 hover:text-white transition"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % SLIDES.length)}
                    className="p-2 border border-white/20 hover:border-[#C5A059] text-white/80 hover:text-white transition"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Spotlight Garment Editorial Card (5 cols) */}
            {featuredProduct && (
              <div className="lg:col-span-5 hidden lg:flex justify-end">
                <Link
                  to={`/product/${featuredProduct.id}`}
                  className="group w-80 bg-[#FAF8F5] text-stone-900 p-3 border border-[#C5A059]/40 shadow-2xl transition hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                    <img
                      src={featuredProduct.imageUrl}
                      alt={isBn ? featuredProduct.name_bn : featuredProduct.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <span className="absolute top-3 start-3 bg-[#24030B]/90 text-[#F4E2B5] text-[10px] font-mono uppercase tracking-widest px-2.5 py-1">
                      {isBn ? currentSlide.featureTag_bn : currentSlide.featureTag_en}
                    </span>
                  </div>
                  <div className="pt-3.5 pb-1 px-1 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-[#88652A] font-semibold truncate">
                        {isBn ? featuredProduct.category_bn : featuredProduct.category}
                      </p>
                      <h3 className="font-['Playfair_Display'] text-base text-[#24030B] truncate">
                        {isBn ? featuredProduct.name_bn : featuredProduct.name_en}
                      </h3>
                    </div>
                    <span className="text-sm font-bold text-[#3E0713] shrink-0">
                      {formatBdt(featuredProduct.variants[0].priceBdt, isBn ? "bn" : "en")}
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crisp 4-Pillar Service Bar */}
      <div className="bg-white border-b border-[#ECE4D4] py-4">
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-[#88652A] shrink-0" />
            <div>
              <p className="font-semibold text-[#24030B]">
                {isBn ? "ঢাকায় ২৪ ঘণ্টায় ডেলিভারি" : "24h Dhaka Dispatch"}
              </p>
              <p className="text-xs text-stone-500">
                {isBn ? "সারাদেশে ৪৮-৭২ ঘণ্টায়" : "48–72h across 64 districts"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Banknote className="w-4 h-4 text-[#88652A] shrink-0" />
            <div>
              <p className="font-semibold text-[#24030B]">
                {isBn ? "ক্যাশ অন ডেলিভারি ও বিকাশ" : "COD, bKash & Nagad"}
              </p>
              <p className="text-xs text-stone-500">
                {isBn ? "পণ্য দেখে মূল্য পরিশোধ" : "Inspect parcel at doorstep"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-[#88652A] shrink-0" />
            <div>
              <p className="font-semibold text-[#24030B]">
                {isBn ? "৭ দিনের সাইজ এক্সচেঞ্জ" : "7-Day Size Exchange"}
              </p>
              <p className="text-xs text-stone-500">
                {isBn ? "সহজ ও দ্রুত পরিবর্তন সুবিধা" : "Hassle-free fit guarantee"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#88652A] shrink-0" />
            <div>
              <p className="font-semibold text-[#24030B]">
                {isBn ? "সরকারি নীতিমালা অনুমোদিত" : "MoC 2021 Compliant"}
              </p>
              <p className="text-xs text-stone-500">
                {isBn ? "নিবন্ধিত ও বিশ্বস্ত ব্র্যান্ড" : "Verified BD e-Commerce"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
