import React, { useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { X, Ruler } from "lucide-react";

export const SizeGuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}> = ({ isOpen, onClose, category }) => {
  const { isBn, siteSettings } = useStore();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#ECE4D4] shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE4D4] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#88652A]" />
            <div>
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#24030B]">
                {isBn ? "সাইজ গাইড ও মাপের নির্দেশিকা" : "Bangladesh Sizing Guide & Measurements"}
              </h3>
              {category && (
                <span className="text-[10px] text-[#88652A] font-semibold uppercase tracking-wider block">
                  {category}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-stone-700">
          <p className="text-stone-600 leading-relaxed">
            {isBn
              ? "আমাদের পোশাকগুলো স্ট্যান্ডার্ড বডি মেজারমেন্ট এবং আরামদায়ক ফিটিং নিশ্চিত করে তৈরি করা হয়েছে।"
              : "All garments are tailored to ensure graceful drape and true-to-size comfort for festive and formal occasions."}
          </p>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#ECE4D4]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-stone-900 font-bold border-b border-[#ECE4D4]">
                  <th className="py-2.5 px-3 text-start">{isBn ? "সাইজ" : "Size"}</th>
                  <th className="py-2.5 px-3">{isBn ? "বুক / চেস্ট (ইঞ্চি)" : "Chest (in)"}</th>
                  <th className="py-2.5 px-3">{isBn ? "কোমর (ইঞ্চি)" : "Waist (in)"}</th>
                  <th className="py-2.5 px-3">{isBn ? "পাঞ্জাবি / কাফতান ঝুল" : "Length (in)"}</th>
                  <th className="py-2.5 px-3">{isBn ? "হাতা (ইঞ্চি)" : "Sleeve (in)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-start text-[#3E0713]">38 / S</td>
                  <td className="py-2.5 px-3">38" - 39"</td>
                  <td className="py-2.5 px-3">34" - 36"</td>
                  <td className="py-2.5 px-3">40" - 42"</td>
                  <td className="py-2.5 px-3">24.5"</td>
                </tr>
                <tr className="bg-[#FAF8F5]/50">
                  <td className="py-2.5 px-3 font-bold text-start text-[#3E0713]">40 / M</td>
                  <td className="py-2.5 px-3">40" - 41"</td>
                  <td className="py-2.5 px-3">37" - 39"</td>
                  <td className="py-2.5 px-3">42" - 44"</td>
                  <td className="py-2.5 px-3">25.0"</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-start text-[#3E0713]">42 / L</td>
                  <td className="py-2.5 px-3">42" - 43"</td>
                  <td className="py-2.5 px-3">40" - 42"</td>
                  <td className="py-2.5 px-3">44" - 46"</td>
                  <td className="py-2.5 px-3">25.5"</td>
                </tr>
                <tr className="bg-[#FAF8F5]/50">
                  <td className="py-2.5 px-3 font-bold text-start text-[#3E0713]">44 / XL</td>
                  <td className="py-2.5 px-3">44" - 46"</td>
                  <td className="py-2.5 px-3">43" - 45"</td>
                  <td className="py-2.5 px-3">45" - 47"</td>
                  <td className="py-2.5 px-3">26.0"</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-start text-[#3E0713]">Free Size (শাড়ি / শাল)</td>
                  <td className="py-2.5 px-3" colSpan={3}>
                    {isBn ? "সকলের জন্য প্রযোজ্য মানানসই ফ্রি সাইজ" : "Fluid Relaxed Universal Silhouette"}
                  </td>
                  <td className="py-2.5 px-3">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE4D4] flex items-center justify-between text-[11px]">
            <span className="text-stone-600">
              {isBn
                ? "সঠিক সাইজ নির্ধারণে সহায়তা প্রয়োজন? আমাদের হোয়াটসঅ্যাপে মেসেজ দিন:"
                : "Need guidance on finding the perfect fit? Chat with our Dhaka stylists:"}
            </span>
            <a
              href={`https://wa.me/${siteSettings.supportWhatsApp.replace(/\D/g, "")}?text=Hello%20Velvet%20Fashion,%20I%20need%20help%20with%20sizing`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#88652A] font-bold hover:underline shrink-0 ms-2"
            >
              {siteSettings.supportWhatsApp}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ECE4D4] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#3E0713] text-white rounded-full text-xs font-bold hover:bg-[#520B1C] transition"
          >
            {isBn ? "গাইড বন্ধ করুন" : "Close Guide"}
          </button>
        </div>
      </div>
    </div>
  );
};
