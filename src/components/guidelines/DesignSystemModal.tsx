import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Palette, Layers, ShieldCheck, Sparkles } from 'lucide-react';

export const DesignSystemModal: React.FC = () => {
  const { isDesignSystemOpen, setIsDesignSystemOpen, isBn, siteSettings } = useStore();

  if (!isDesignSystemOpen) return null;

  const colorTokens = [
    { name: 'Royal Velvet Maroon', hex: '#3E0713', role: 'Primary Brand Identity' },
    { name: 'Velvet Noir', hex: '#24030B', role: 'Headers & Deep Accent' },
    { name: 'Desert Satin Gold', hex: '#C5A059', role: 'Highlights & Borders' },
    { name: 'Deep Antique Ochre', hex: '#88652A', role: 'Eyebrows & Labels' },
    { name: 'Alabaster Silk', hex: '#FAF8F5', role: 'Storefront Canvas' },
    { name: 'Warm Cashmere Sand', hex: '#ECE4D4', role: 'Dividers & Surface Borders' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-4xl w-full border border-[#ECE4D4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#24030B] text-[#FAF8F5] p-5 flex items-center justify-between border-b border-[#C5A059]/40">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-[#C5A059]" />
            <div>
              <h2 className="font-['Cinzel'] text-base sm:text-lg font-bold text-white tracking-widest">
                VELVET FASHION • {isBn ? 'ব্র্যান্ড ও মানদণ্ড' : 'ATELIER STANDARDS'}
              </h2>
              <p className="text-xs text-[#ECE4D4]/80">
                {isBn
                  ? 'ব্র্যান্ড পরিচয়, রঙ ও টাইপোগ্রাফি এবং ডিজিটাল কমার্স নীতিমালা'
                  : 'Visual Identity, Textile Craftsmanship & Bangladesh Digital Commerce Standards'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDesignSystemOpen(false)}
            className="text-stone-300 hover:text-white p-1 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 text-xs text-stone-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                {isBn ? '১. অফিশিয়াল ব্র্যান্ড সিল ও পরিচয়' : '1. Brand Seal & Identity'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 border border-[#ECE4D4] text-center">
                <img
                  src="./brand/velvet_emblem.jpg"
                  alt="Velvet Fashion Round Monogram"
                  className="w-28 h-28 object-contain mx-auto rounded-full shadow-sm border border-[#C5A059]"
                />
                <h4 className="font-['Cinzel'] font-bold text-[#3E0713] mt-3">
                  {isBn ? 'রয়্যাল মনোগ্রাম সিল' : 'Royal Emblem Seal'}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  {isBn ? 'প্যাকেজিং, ইনভয়েস এবং অফিশিয়াল স্টোরফ্রন্ট সিল' : 'Used on garment tags, dispatch slips, and packaging'}
                </p>
              </div>

              <div className="bg-white p-4 border border-[#ECE4D4] text-center">
                <img
                  src="./brand/velvet_brand_sheet.jpg"
                  alt="Velvet Fashion Brand Sheet"
                  className="w-full h-28 object-cover object-center mx-auto border border-[#ECE4D4]"
                />
                <h4 className="font-['Cinzel'] font-bold text-[#3E0713] mt-3">
                  {isBn ? 'ব্র্যান্ড লকআপ ও টেক্সচার' : 'Brand Lockup & Textiles'}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  {isBn ? 'ডিপ বার্গান্ডি ভেলভেট ও শ্যাম্পেন গোল্ড প্যালেট' : 'Burgundy velvet, woven silk, and brushed gold foil'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                {isBn ? '২. রঙের প্যালেট' : '2. Palette Tokens'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colorTokens.map((token) => (
                <div key={token.name} className="bg-white p-3 border border-[#ECE4D4]">
                  <div className="h-9 border border-black/10 mb-2" style={{ backgroundColor: token.hex }} />
                  <h5 className="font-bold text-stone-900">{token.name}</h5>
                  <span className="font-mono text-stone-500 text-[11px] block">{token.hex}</span>
                  <span className="text-[11px] text-stone-600 mt-1 block">{token.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                {isBn ? '৩. দ্বিভাষিক টাইপোগ্রাফি (ইংরেজি ও বাংলা)' : '3. Dual-Script Typography (English & বাংলা)'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 border border-[#ECE4D4] space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#88652A] tracking-wider">English Typeface</span>
                <p className="font-['Playfair_Display'] text-lg font-bold text-[#3E0713]">
                  Playfair Display & Cinzel
                </p>
                <p className="text-stone-600 text-xs">
                  Paired with Plus Jakarta Sans for sizes, SKUs, and BDT pricing.
                </p>
              </div>
              <div className="bg-white p-4 border border-[#ECE4D4] space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#88652A] tracking-wider">বাংলা টাইপোগ্রাফি</span>
                <p className="font-['Noto_Serif_Bengali'] text-lg font-bold text-[#3E0713]">
                  নোটো সেরিফ বেঙ্গলি ও হিন্দ শিলিগুড়ি
                </p>
                <p className="text-stone-600 text-xs">
                  শিরোনাম ও বিবরণের স্পষ্ট পাঠযোগ্যতার জন্য নির্ধারিত বাংলা ফন্ট।
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                {isBn ? '৪. ডেলিভারি ও গ্রাহক সুরক্ষা' : '4. Customer Protection & Fulfillment'}
              </h3>
            </div>
            <div className="bg-white p-4 border border-[#ECE4D4] space-y-2 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong>{isBn ? 'ডেলিভারি প্রতিশ্রুতি:' : 'Delivery Promise:'}</strong>{' '}
                {isBn ? siteSettings.deliveryPromise_bn : siteSettings.deliveryPromise_en}
              </p>
              <p>
                <strong>{isBn ? 'এক্সচেঞ্জ ও রিটার্ন:' : 'Return & Exchange:'}</strong>{' '}
                {isBn ? siteSettings.returnPolicy_bn : siteSettings.returnPolicy_en}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 border-t border-[#ECE4D4] flex justify-end">
          <button
            type="button"
            onClick={() => setIsDesignSystemOpen(false)}
            className="px-6 py-2 bg-[#3E0713] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#520B1C] transition"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
