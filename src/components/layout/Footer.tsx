import React from "react";
import { useStore } from "../../context/StoreContext";
import { ShieldCheck, MessageCircle, MapPin, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  const { isBn, siteSettings } = useStore();

  return (
    <footer className="print:hidden bg-[#24030B] text-[#FAF8F5] pt-14 pb-8 border-t border-[#C5A059]/40 mt-16">
      <div className="container mx-auto px-4">
        {/* Brand & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand/velvet_emblem.jpg"
                alt="Velvet Fashion Logo"
                className="w-12 h-12 rounded-full border border-[#C5A059]"
              />
              <div>
                <span className="font-['Cinzel'] tracking-widest text-lg font-bold text-white block">
                  VELVET FASHION
                </span>
                <span className="text-[10px] tracking-[0.3em] text-[#E6C87C] uppercase block">
                  {isBn
                    ? "আভিজাত্য ও রাজকীয় ঐতিহ্য • ঢাকা"
                    : "HAUTE COUTURE & FESTIVE WEAR • DHAKA"}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#ECE4D4]/80 leading-relaxed">
              {isBn
                ? "বাংলাদেশের একটি প্রিমিয়াম অনলাইন ফ্যাশন হাউজ। রাজকীয় ভেলভেট, পিওর সিল্ক ও জামদানি ফিউশনে নারী, পুরুষ ও শিশুদের জন্য উৎসবের পোশাক, ঘরে বসেই ক্যাশ অন ডেলিভারি ও বিকাশ সুবিধাসহ।"
                : "A bespoke Bangladeshi online luxury boutique presenting premium seasonal velvet, silk, and festive collections for men, women, and children with nationwide Cash on Delivery & bKash."}
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

          {/* Col 2: Bangladesh Delivery Zones */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#E6C87C]">
              {isBn ? "ডেলিভারি কাভারেজ এলাকা" : "Bangladesh Delivery Zones"}
            </h4>
            <ul className="text-xs space-y-2 text-[#ECE4D4]/80">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Dhaka Metro (Gulshan, Banani, Dhanmondi, Uttara)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Dhaka Suburbs (Savar, Gazipur, Narayanganj)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Chittagong & Sylhet Divisional Metro</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Rajshahi, Khulna, Barisal & Rangpur</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Nationwide Express via Steadfast & Pathao</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & Return Policy */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#E6C87C]">
              {isBn ? "কাস্টমার কেয়ার ও পলিসি" : "Customer Concierge & Policy"}
            </h4>
            <div className="text-xs text-[#ECE4D4]/80 space-y-2 leading-relaxed">
              <p>
                <strong className="text-white block mb-0.5">
                  {isBn ? "সহজ ৭ দিনের এক্সচেঞ্জ পলিসি:" : "7-Day Exchange Policy:"}
                </strong>
                {isBn
                  ? siteSettings.returnPolicy_bn
                  : siteSettings.returnPolicy_en}
              </p>
              <p>
                <strong className="text-white block mb-0.5">
                  {isBn ? "অভিযোগ ও সহায়তা:" : "Complaints & Resolution:"}
                </strong>
                {isBn
                  ? "যেকোনো মতামত বা অনুসন্ধানে আমাদের হোয়াটসঅ্যাপ বা ইমেইলে যোগাযোগ করুন। ২৪ ঘণ্টার মধ্যে সমাধান নিশ্চিত করা হয়।"
                  : "Submit feedback or size-exchange requests via WhatsApp or email for guaranteed resolution within 24 hours."}
              </p>
            </div>
          </div>

          {/* Col 4: Bangladesh Regulatory License */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-xs font-bold uppercase tracking-wider text-[#E6C87C] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>
                {isBn ? "সরকারি নিবন্ধন ও লাইসেন্স" : "Govt & e-Commerce Licensing"}
              </span>
            </h4>

            <div className="bg-[#3E0713]/80 p-3.5 rounded-lg border border-[#C5A059]/40 text-xs space-y-2">
              <div>
                <span className="text-[10px] text-stone-300 block">
                  {isBn ? "ট্রেড লাইসেন্স নং (DNCC):" : "Trade License No. (DNCC):"}
                </span>
                <span className="font-mono text-white font-bold text-xs tracking-wider">
                  {siteSettings.tradeLicenseNo}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-300 block">
                  {isBn ? "ডিজিটাল বিজনেস আইডি (DBID):" : "Digital Business ID (DBID):"}
                </span>
                <span className="font-mono text-[#E6C87C] font-semibold text-xs tracking-wider">
                  {siteSettings.dbidNo}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-300 block">
                  {isBn ? "ট্যাক্স আইডেন্টিফিকেশন (TIN / BIN):" : "Tax & VAT Registration:"}
                </span>
                <span className="font-mono text-stone-300 text-[11px] tracking-wider">
                  {siteSettings.tinBinNo}
                </span>
              </div>

              <p className="text-[10px] text-stone-300 leading-snug pt-1 border-t border-white/10">
                {isBn
                  ? "বাণিজ্য মন্ত্রণালয়ের 'ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১' অনুসারে পরিচালিত ও নিবন্ধিত।"
                  : "Operated in strict compliance with the Ministry of Commerce Digital Commerce Guidelines 2021."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ECE4D4]/70">
          <div>
            © {new Date().getFullYear()} Velvet Fashion Ltd. (Dhaka, Bangladesh).
            All rights reserved.
          </div>

          {/* Payment Badges in Bangladesh */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-stone-400">
              {isBn ? "পেমেন্ট মাধ্যম:" : "Payment Accepted:"}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] font-semibold border border-white/20">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#E2136E]/80 text-white font-bold text-[10px] border border-[#E2136E]">
              bKash (বিকাশ)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#F7941D]/80 text-white font-bold text-[10px] border border-[#F7941D]">
              Nagad (নগদ)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] font-semibold border border-white/20">
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
