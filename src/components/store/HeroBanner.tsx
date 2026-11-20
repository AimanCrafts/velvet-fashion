import React from "react";
import { useStore } from "../../context/StoreContext";
import { Link } from "../../router/Router";
import {
  Truck,
  Banknote,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const HeroBanner: React.FC = () => {
  const { isBn, siteSettings } = useStore();

  return (
    <section className="relative overflow-hidden mb-8">
      {/* Visual Hero Container with Velvet Atmosphere */}
      <div className="relative bg-[#2A030C] text-[#FAF8F5] min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background Image with Rich Velvet Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85"
            alt="Velvet Haute Couture Fabric"
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24030B] via-[#3E0713]/95 to-[#24030B]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A059]/15 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Brand Manifesto & CTAs */}
            <div className="lg:col-span-7">
              {/* Seasonal Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/60 bg-[#3E0713]/80 backdrop-blur-xs mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
                <span className="text-[#F4E2B5] text-xs uppercase tracking-[0.25em] font-bold">
                  {isBn
                    ? "শীতকালীন উৎসব কালেকশন ২০২৬/২৭ • বাংলাদেশ"
                    : "Winter Royale 2026/27 • Bangladesh Festive Edit"}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-normal leading-[1.15] mb-4 text-[#FDFBF7]">
                {isBn ? (
                  <span>
                    প্রতিটি সুতোয় রাজকীয় আভিজাত্য, <br />
                    <span className="italic text-[#E6C87C]">
                      বাংলাদেশের উৎসব ও বিয়ের মৌসুমে
                    </span>
                  </span>
                ) : (
                  <span>
                    Elegance in Every Thread, <br />
                    <span className="italic font-serif text-[#E6C87C]">
                      Tailored for Bangladesh’s Festive Season.
                    </span>
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-[#ECE4D4]/90 mb-8 max-w-xl font-light leading-relaxed">
                {isBn
                  ? "অভিজাত মখমলের কাফতান, হ্যান্ডক্রাফটেড সিল্ক পাঞ্জাবি, ব্লেজার এবং জমকালো পার্টি শাড়ির এক্সক্লুসিভ কালেকশন। ৬৪ জেলায় হোম ডেলিভারি, পণ্য দেখে ক্যাশ অন ডেলিভারি ও বিকাশ পেমেন্ট সুবিধা।"
                  : "Discover bespoke ready-to-wear velvet kaftans, tailored silk panjabis, festive sarees, and cashmere shawls. Delivered nationwide across all 64 districts with Cash on Delivery & bKash."}
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#24030B] font-bold text-xs md:text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition duration-200 active:scale-95 flex items-center gap-2"
                >
                  <span>
                    {isBn ? "কালেকশন দেখুন" : "Shop Collection"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${siteSettings.supportWhatsApp.replace(/\D/g, "")}?text=Hello%20Velvet%20Fashion,%20I%20would%20like%20to%20inquire%20about%20your%20collection`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#C5A059]/60 hover:bg-white/10 text-[#FAF8F5] text-xs md:text-sm uppercase tracking-wider px-6 py-3.5 rounded-full backdrop-blur-xs transition"
                >
                  {isBn ? "হোয়াটসঅ্যাপে যোগাযোগ" : "WhatsApp Concierge"}
                </a>
              </div>
            </div>

            {/* Right 5 cols: Editorial Arched Images Showcase */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center gap-4">
              <div className="w-48 h-72 rounded-t-[5rem] overflow-hidden border-2 border-[#C5A059]/50 shadow-2xl relative transform -translate-y-4">
                <img
                  src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
                  alt="Velvet Kaftan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24030B]/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] text-[#F4E2B5] font-semibold">
                    {isBn ? "রয়্যাল ভেলভেট কাফতান" : "Imperial Velvet Kaftan"}
                  </span>
                </div>
              </div>

              <div className="w-48 h-72 rounded-t-[5rem] overflow-hidden border-2 border-[#C5A059]/50 shadow-2xl relative transform translate-y-4">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
                  alt="Silk Panjabi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24030B]/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] text-[#F4E2B5] font-semibold">
                    {isBn ? "সিল্ক ও ভেলভেট পাঞ্জাবি" : "Handcrafted Silk Panjabi"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Convenience Bar */}
      <div className="bg-[#FAF8F5] border-y border-[#ECE4D4] py-4">
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3E0713]/10 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-[#3E0713]" />
            </div>
            <div>
              <p className="font-bold text-stone-900">
                {isBn ? "দ্রুত হোম ডেলিভারি" : "Express Bangladesh Delivery"}
              </p>
              <p className="text-[11px] text-stone-500">
                {isBn
                  ? "ঢাকায় ২৪ ঘণ্টা, সারাদেশে ৪৮-৭২ ঘণ্টা"
                  : "24h in Dhaka, 48-72h Nationwide"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3E0713]/10 flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4 text-[#3E0713]" />
            </div>
            <div>
              <p className="font-bold text-stone-900">
                {isBn ? "ক্যাশ অন ডেলিভারি ও বিকাশ" : "Cash on Delivery & bKash"}
              </p>
              <p className="text-[11px] text-stone-500">
                {isBn ? "পণ্য দেখে নিশ্চিত হয়ে মূল্য পরিশোধ" : "Inspect parcel before paying"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3E0713]/10 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-[#3E0713]" />
            </div>
            <div>
              <p className="font-bold text-stone-900">
                {isBn ? "সহজ ৭ দিনের সাইজ এক্সচেঞ্জ" : "Easy 7-Day Size Exchange"}
              </p>
              <p className="text-[11px] text-stone-500">
                {isBn
                  ? "কোনো অতিরিক্ত ঝামেলা ছাড়াই এক্সচেঞ্জ"
                  : "Hassle-free replacement policy"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3E0713]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#3E0713]" />
            </div>
            <div>
              <p className="font-bold text-stone-900">
                {isBn ? "সরকারি লাইসেন্সপ্রাপ্ত" : "DBID & Trade License Verified"}
              </p>
              <p className="text-[11px] text-stone-500">
                {isBn ? "ট্রেড লাইসেন্স: ০৪২১৮৮ (DNCC)" : "Compliant with BD MoC Guidelines"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
