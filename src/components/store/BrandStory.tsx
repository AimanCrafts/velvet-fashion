import React from "react";
import { useStore } from "../../context/StoreContext";
import { Link } from "../../router/Router";
import { MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";

export const BrandStory: React.FC = () => {
  const { isBn, siteSettings } = useStore();

  return (
    <section className="container mx-auto px-4 py-14">
      <div className="bg-white border border-[#ECE4D4] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Visual Story (5 cols) */}
        <div className="lg:col-span-5 relative min-h-[380px] bg-[#24030B]">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85"
            alt="Velvet Atelier Craftsmanship"
            loading="lazy"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0208] via-transparent to-transparent" />
          <div className="absolute bottom-6 inset-x-6 flex items-center gap-4 bg-[#24030B]/90 backdrop-blur-md border border-[#C5A059]/40 p-4 text-[#F4E2B5]">
            <img
              src="./brand/velvet_emblem.jpg"
              alt="Velvet Seal"
              className="w-12 h-12 rounded-full border border-[#C5A059] shrink-0"
            />
            <div>
              <span className="font-['Cinzel'] tracking-widest text-sm font-bold block">
                VELVET FASHION
              </span>
              <span className="text-[10px] text-stone-300 tracking-[0.2em] uppercase">
                DHAKA ATELIER • EST. 2026
              </span>
            </div>
          </div>
        </div>

        {/* Right Narrative (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#88652A] block">
              {isBn ? "আমাদের ঐতিহ্য ও কারিগরি" : "HERITAGE & TAILORING JOURNAL"}
            </span>

            <h2 className="font-['Playfair_Display'] text-2xl sm:text-4xl font-normal text-[#24030B] leading-tight">
              {isBn ? (
                <>
                  ঐতিহ্যবাহী তাঁত থেকে ঢাকা আতেলিয়ে:{" "}
                  <span className="italic text-[#88652A]">উৎসবের পরিমিত আভিজাত্য</span>
                </>
              ) : (
                <>
                  From Heritage Weavers to Dhaka:{" "}
                  <span className="italic text-[#88652A]">Tailored Ready-to-Wear</span>
                </>
              )}
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed">
              {isBn
                ? "ভেলভেট ফ্যাশন বাংলাদেশের রুচিশীল ক্রেতাদের জন্য তৈরি করেছে সীমিত সংস্করণের মখমল, সিল্ক এবং জারদৌসি কালেকশন। নারায়ণগঞ্জ ও পুরান ঢাকার দক্ষ কারিগরদের হাতে প্রতিটি পোশাক তৈরি ও মান যাচাই করা হয়।"
                : "Velvet Fashion unites heavy silk-blend velvet, breathable Dhaka-loom cotton-silks, and subtle hand-worked zardozi in small, traceable seasonal lots—built for weddings, Eid gatherings, and winter evenings."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FAF8F5] border border-[#ECE4D4] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#88652A] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {isBn ? "নিবন্ধিত ডিজিটাল কমার্স" : "Registered BD Boutique"}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                  {siteSettings.tradeLicenseNo}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#ECE4D4] flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {isBn ? "হোয়াটসঅ্যাপ স্টাইলিং সহায়তা" : "Personal Fit Concierge"}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                  {siteSettings.supportWhatsApp}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/lookbook"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-[0.18em] transition"
            >
              <span>{isBn ? "লুকবুক পড়ুন" : "Read the Lookbook"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${siteSettings.supportWhatsApp.replace(/\D/g, "")}?text=Hello%20Velvet%20Fashion,%20I%20would%20like%20a%20personal%20sizing%20consultation`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 border border-[#88652A] text-[#88652A] hover:bg-[#88652A] hover:text-white text-xs font-bold uppercase tracking-[0.18em] transition"
            >
              {isBn ? "হোয়াটসঅ্যাপ পরামর্শ" : "Sizing Consultation"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
