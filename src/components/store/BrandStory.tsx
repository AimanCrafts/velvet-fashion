import React from "react";
import { useStore } from "../../context/StoreContext";
import { Link } from "../../router/Router";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

export const BrandStory: React.FC = () => {
  const { isBn, siteSettings } = useStore();

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-[#ECE4D4] p-8 md:p-12 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Brand Seal & Imagery */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl bg-[#24030B]">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85"
                alt="Velvet Atelier Craftsmanship"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24030B] via-transparent to-transparent opacity-90" />
              
              {/* Floating Emblem */}
              <div className="absolute bottom-6 inset-x-6 flex flex-col items-center text-center p-4 rounded-xl bg-[#24030B]/90 backdrop-blur-md border border-[#C5A059]/40 text-[#F4E2B5]">
                <img
                  src="/brand/velvet_emblem.jpg"
                  alt="Velvet Seal"
                  className="w-14 h-14 rounded-full border border-[#C5A059] mb-2 shadow-md"
                />
                <span className="font-['Cinzel'] tracking-widest text-sm font-bold">
                  VELVET FASHION
                </span>
                <span className="text-[10px] text-stone-300 tracking-[0.2em] uppercase mt-0.5">
                  DHAKA, BANGLADESH • EST. 2026
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Story & Heritage */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#88652A] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "আমাদের গল্প ও ঐতিহ্য" : "THE HERITAGE & VISION"}</span>
            </div>

            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-normal text-[#24030B] leading-tight">
              {isBn ? (
                <span>
                  ঐতিহ্যবাহী তাঁত ও কারিগরি থেকে ঢাকা: <br />
                  <span className="text-[#88652A] italic">উৎসব ও পারিবারিক অনুষ্ঠানের রাজকীয় সাজ</span>
                </span>
              ) : (
                <span>
                  From Heritage Weavers to Dhaka: <br />
                  <span className="text-[#88652A] italic font-serif">Curated Ready-to-Wear Luxury</span>
                </span>
              )}
            </h2>

            <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
              <p>
                {isBn
                  ? "ভেলভেট ফ্যাশন বাংলাদেশের রুচিশীল ফ্যাশনপ্রেমীদের জন্য এক অনন্য উদ্যোগ — যা রাজকীয় মখমল, খাঁটি সিল্ক এবং ঐতিহ্যবাহী জারদৌসি ও জরির কারুকাজকে এক সুতোয় গেঁথেছে আধুনিক আভিজাত্যে।"
                  : "Velvet Fashion was conceived in Dhaka to offer discerning individuals a refined sartorial journey — uniting the opulent texture of royal velvet with rich Bengali silks and contemporary artisanal zari craftsmanship."}
              </p>
              <p>
                {isBn
                  ? "আমরা সীমিত ব্যাচে দক্ষ কারিগরদের দ্বারা প্রতিটি পোশাক তৈরি ও পরীক্ষা করি, যেন আপনি পান সর্বোচ্চ গুণগত মান। পুরো বাংলাদেশে ঘরে বসে পণ্য দেখে মূল্য পরিশোধ করার নিশ্চয়তা দিচ্ছি আমরা।"
                  : "Operating through meticulous seasonal lot curation, we ensure peak fabric authenticity, limited-quantity exclusivity, and effortless local Cash on Delivery & bKash service across all 64 districts."}
              </p>
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#ECE4D4]">
                <ShieldCheck className="w-5 h-5 text-[#88652A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {isBn ? "সরকারি নিবন্ধন ও লাইসেন্সপ্রাপ্ত" : "DBID & Trade License Verified"}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                    {siteSettings.tradeLicenseNo} • {siteSettings.dbidNo}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#ECE4D4]">
                <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {isBn ? "স্টাইলিং পরামর্শক (হোয়াটসঅ্যাপ)" : "Personal Styling Concierge"}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                    {siteSettings.supportWhatsApp}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-6 py-3 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                {isBn ? "সম্পূর্ণ কালেকশন ব্রাউজ করুন" : "Browse Full Collection"}
              </Link>
              <a
                href={`https://wa.me/${siteSettings.supportWhatsApp.replace(/\D/g, "")}?text=Hello%20Velvet%20Fashion,%20I%20would%20like%20a%20personal%20sizing%20consultation`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-[#88652A] text-[#88652A] hover:bg-[#88652A] hover:text-white text-xs font-bold uppercase tracking-wider transition"
              >
                {isBn ? "সাইজ ও ফ্যাব্রিক পরামর্শ" : "Concierge Consultation"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
