import React from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter, Link } from "../../router/Router";
import { ShieldCheck, MessageCircle, MapPin, Phone } from "lucide-react";
import type { Audience } from "../../types";

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { isBn, siteSettings, resetFilters, setActiveAudience, setIsDesignSystemOpen } = useStore();

  const goDepartment = (aud: Audience) => {
    resetFilters();
    setActiveAudience(aud);
    navigate("/shop");
  };

  return (
    <footer className="print:hidden bg-[#1B0208] text-[#FAF8F5] pt-16 pb-8 border-t border-[#C5A059]/35 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="./brand/velvet_emblem.jpg"
                alt="Velvet Fashion Logo"
                className="w-11 h-11 rounded-full border border-[#C5A059]"
              />
              <div>
                <span className="font-['Cinzel'] tracking-[0.22em] text-lg font-bold text-white block">
                  VELVET FASHION
                </span>
                <span className="text-[10px] tracking-[0.28em] text-[#E6C87C] uppercase block">
                  {isBn ? "আভিজাত্য ও ঐতিহ্য • ঢাকা" : "ATELIER & FESTIVE WEAR • DHAKA"}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#ECE4D4]/80 leading-relaxed max-w-sm">
              {isBn
                ? "বাংলাদেশের একটি প্রিমিয়াম অনলাইন ফ্যাশন হাউজ। রাজকীয় ভেলভেট, পিওর সিল্ক ও কারুকাজ করা উৎসবের পোশাক — ৬৪ জেলায় ক্যাশ অন ডেলিভারি ও বিকাশ সুবিধাসহ।"
                : "A Bangladeshi online fashion house offering tailored silk-velvet kaftans, handcrafted panjabis, sarees, and winter shawls with nationwide Cash on Delivery & bKash."}
            </p>

            <div className="space-y-1.5 text-xs text-[#E6C87C]">
              <a
                href={`https://wa.me/${siteSettings.supportWhatsApp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: {siteSettings.supportWhatsApp}</span>
              </a>
              <div className="flex items-center gap-2 text-stone-300">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>Hotline: {siteSettings.supportPhone}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#E6C87C]">
              {isBn ? "কেনাকাটা" : "Atelier"}
            </h4>
            <ul className="text-xs space-y-2.5 text-[#ECE4D4]/80">
              <li>
                <button type="button" onClick={() => goDepartment("women")} className="hover:text-white transition">
                  {isBn ? "নারীদের কালেকশন" : "Women's Couture"}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goDepartment("men")} className="hover:text-white transition">
                  {isBn ? "পুরুষদের পাঞ্জাবি" : "Men's Tailoring"}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goDepartment("kids")} className="hover:text-white transition">
                  {isBn ? "ছোটদের উৎসব" : "Kids Festive"}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => goDepartment("unisex")} className="hover:text-white transition">
                  {isBn ? "শাল ও পশমিনা" : "Shawls & Cashmere"}
                </button>
              </li>
              <li>
                <Link to="/lookbook" className="hover:text-white transition">
                  {isBn ? "লুকবুক ও জার্নাল" : "Lookbook & Journal"}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition">
                  {isBn ? "অর্ডার ট্র্যাক করুন" : "Track Order"}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsDesignSystemOpen(true)}
                  className="hover:text-white transition"
                >
                  {isBn ? "আতেলিয়ে মানদণ্ড" : "Atelier Standards"}
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#E6C87C]">
              {isBn ? "ডেলিভারি ও নীতিমালা" : "Dispatch & Policy"}
            </h4>
            <ul className="text-xs space-y-2 text-[#ECE4D4]/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{isBn ? "ঢাকা মেট্রো: ২৪ ঘণ্টায় ডেলিভারি (৳৭০)" : "Dhaka Metro: 24h Express (৳70)"}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{isBn ? "সারাদেশে ৬৪ জেলা: ৪৮-৭২ ঘণ্টায়" : "64 Districts: 48–72h Nationwide"}</span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-[#ECE4D4]/75 leading-relaxed">
              <strong className="text-white block mb-0.5">
                {isBn ? "৭ দিনের সাইজ এক্সচেঞ্জ:" : "7-Day Size Exchange:"}
              </strong>
              <span>{isBn ? siteSettings.returnPolicy_bn : siteSettings.returnPolicy_en}</span>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#E6C87C] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>{isBn ? "সরকারি নিবন্ধন ও লাইসেন্স" : "Regulatory Compliance"}</span>
            </h4>

            <div className="bg-[#3E0713]/70 p-4 border border-[#C5A059]/35 text-xs space-y-2">
              <div>
                <span className="text-[10px] text-stone-300 block">
                  {isBn ? "ট্রেড লাইসেন্স (DNCC):" : "Trade License (DNCC):"}
                </span>
                <span className="font-mono text-white font-semibold tracking-wider">
                  {siteSettings.tradeLicenseNo}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-300 block">
                  {isBn ? "ডিজিটাল বিজনেস আইডি (DBID):" : "Digital Business ID (DBID):"}
                </span>
                <span className="font-mono text-[#E6C87C] font-semibold tracking-wider">
                  {siteSettings.dbidNo}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-300 block">
                  {isBn ? "ট্যাক্স / ভ্যাট নিবন্ধন:" : "TIN / VAT Registration:"}
                </span>
                <span className="font-mono text-stone-300 text-[11px] tracking-wider">
                  {siteSettings.tinBinNo}
                </span>
              </div>

              <p className="text-[10px] text-stone-300 leading-snug pt-2 border-t border-white/10">
                {isBn
                  ? "বাণিজ্য মন্ত্রণালয়ের ডিজিটাল কমার্স নির্দেশিকা ২০২১ অনুসারে পরিচালিত।"
                  : "Compliant with Bangladesh Ministry of Commerce Digital Commerce Guidelines 2021."}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ECE4D4]/70">
          <div>
            © {new Date().getFullYear()} Velvet Fashion Ltd. (Dhaka, Bangladesh). All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-stone-400">
              {isBn ? "পেমেন্ট মাধ্যম:" : "Accepted:"}
            </span>
            <span className="px-2.5 py-0.5 bg-white/10 text-white font-mono text-[10px] font-semibold border border-white/20">
              Cash on Delivery
            </span>
            <span className="px-2.5 py-0.5 bg-[#E2136E]/85 text-white font-bold text-[10px]">
              bKash
            </span>
            <span className="px-2.5 py-0.5 bg-[#F7941D]/85 text-white font-bold text-[10px]">
              Nagad
            </span>
            <span className="px-2.5 py-0.5 bg-white/10 text-white font-mono text-[10px] font-semibold border border-white/20">
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
