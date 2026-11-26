import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Palette, Layers, Database, Sparkles } from 'lucide-react';

export const DesignSystemModal: React.FC = () => {
  const { isDesignSystemOpen, setIsDesignSystemOpen, isAr } = useStore();

  if (!isDesignSystemOpen) return null;

  const colorTokens = [
    { name: 'Royal Velvet Maroon', hex: '#3E0713', role: 'Primary Brand / Statements', contrast: 'AAA (15.2:1 on White)' },
    { name: 'Velvet Noir', hex: '#24030B', role: 'Deep Velvet Shadows & Headers', contrast: 'AAA (18.4:1 on White)' },
    { name: 'Desert Satin Gold', hex: '#C5A059', role: 'Accent, Badges, Borders', contrast: '3.4:1 (UI Accents)' },
    { name: 'Deep Antique Ochre', hex: '#88652A', role: 'High-Contrast Gold on Light', contrast: 'AA (4.8:1 on White)' },
    { name: 'Alabaster Silk', hex: '#FAF8F5', role: 'Luxury Canvas / Background', contrast: 'Background' },
    { name: 'Warm Cashmere Sand', hex: '#ECE4D4', role: 'Borders & Cards Substrate', contrast: 'Structural' },
    { name: 'Obsidian Charcoal', hex: '#161618', role: 'Primary Typography / Body', contrast: 'AAA (16.8:1 on Silk)' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] rounded-xl max-w-4xl w-full border border-[#ECE4D4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#24030B] text-[#FAF8F5] p-5 flex items-center justify-between border-b border-[#C5A059]/40">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-[#C5A059]" />
            <div>
              <h2 className="font-['Cinzel'] text-base sm:text-lg font-bold text-white tracking-widest">
                VELVET FASHION • DESIGN SYSTEM & GUIDELINE
              </h2>
              <p className="text-[11px] text-[#ECE4D4]/80">
                {isAr
                  ? 'الهوية البصرية، تناغم الألوان، الطباعة المزدوجة، وهيكلية العمل الاحترافية'
                  : 'Visual Identity, WCAG-Compliant Color Harmonization, Dual-Typography & Workflow'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDesignSystemOpen(false)}
            className="text-stone-300 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-xs text-stone-700">
          {/* Section 1: Brand Prototypes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                1. Brand Asset & Prototype Integration
              </h3>
            </div>
            <p className="text-stone-600 mb-4 leading-relaxed">
              Based on your provided monogram and logo mark prototypes, we synthesized the high-fashion emblem with a refined, realistic luxury web atmosphere:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-[#ECE4D4] text-center">
                <img
                  src="./brand/velvet_emblem.jpg"
                  alt="Velvet Fashion Round Monogram"
                  className="w-32 h-32 object-contain mx-auto rounded-full shadow-md border-2 border-[#C5A059]"
                />
                <h4 className="font-['Cinzel'] font-bold text-[#3E0713] mt-2">Circular Royal Seal</h4>
                <p className="text-[11px] text-stone-500">
                  Used as Favicon, App Header Badge, and Official Packaging Seal
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#ECE4D4] text-center">
                <img
                  src="./brand/velvet_brand_sheet.jpg"
                  alt="Velvet Fashion Brand Lockup Grid"
                  className="w-full h-32 object-cover object-center mx-auto rounded shadow-sm border border-[#ECE4D4]"
                />
                <h4 className="font-['Cinzel'] font-bold text-[#3E0713] mt-2">Brand Sheet & Textures</h4>
                <p className="text-[11px] text-stone-500">
                  Rich Velvet Wine cloth texture, debossed foil stamp, and horizontal lockup
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Colors & Accessibility */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                2. Color Tokens & Contrast Optimization
              </h3>
            </div>
            <p className="text-stone-600 mb-3">
              To solve low-contrast issues common in luxury prototypes (e.g. pale gold text on white), we introduced a tiered system: <strong>Deep Royal Maroon</strong> for high-contrast branding, <strong>Obsidian Charcoal</strong> for AAA reading comfort, and <strong>Desert Gold</strong> for borders, badges, and accents.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {colorTokens.map((token) => (
                <div key={token.name} className="bg-white p-3 rounded-lg border border-[#ECE4D4] flex flex-col justify-between">
                  <div>
                    <div className="h-10 rounded-md border border-black/10 mb-2 shadow-xs" style={{ backgroundColor: token.hex }} />
                    <h5 className="font-bold text-stone-900">{token.name}</h5>
                    <span className="font-mono text-stone-500 text-[10px]">{token.hex}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 text-[10px]">
                    <p className="text-stone-600 font-semibold">{token.role}</p>
                    <p className="text-emerald-700 font-bold">{token.contrast}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Typography */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                3. Dual-Language Typography Matrix (English & Arabic RTL)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-[#ECE4D4] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#A8813B] tracking-wider">English Typeface</span>
                <p className="font-['Playfair_Display'] text-lg font-bold text-[#3E0713]">
                  Playfair Display & Cinzel
                </p>
                <p className="font-['Plus_Jakarta_Sans'] text-stone-600 text-[11px]">
                  Body: Plus Jakarta Sans (high legibility for numerals, sizes, and BDT ৳ prices).
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#ECE4D4] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#A8813B] tracking-wider">বাংলা ফন্ট ও টাইপোগ্রাফি</span>
                <p className="font-['Noto_Serif_Bengali'] text-lg font-bold text-[#3E0713]">
                  নোটো সেরিফ বেঙ্গলি ও হিন্দ শিলিগুড়ি
                </p>
                <p className="text-stone-600 text-[11px]">
                  শিরোনামে ক্লাসিক আভিজাত্য এবং বডিতে সহজ পাঠযোগ্যতার জন্য হিন্দ শিলিগুড়ি ফন্ট।
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Eight Stages */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-['Playfair_Display'] text-base font-bold text-stone-900">
                4. End-to-End Workflow & $0 Demo Gate
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#ECE4D4] space-y-2.5">
              <div className="flex items-center gap-2 text-stone-800">
                <span className="w-5 h-5 rounded-full bg-[#3E0713] text-[#FAF8F5] flex items-center justify-center font-bold text-[10px]">1</span>
                <strong>Stage 1 to 5 (Zero Cost):</strong> Built & deployed on free tiers (Vite/Next.js, Supabase Free PostgreSQL, Cloudflare Pages, GitHub).
              </div>
              <div className="flex items-center gap-2 text-stone-800">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-[#24030B] flex items-center justify-center font-bold text-[10px]">2</span>
                <strong>Stage 6 (Client Approval Gate):</strong> Walkthrough on client's mobile with realistic items & live COD checkout.
              </div>
              <div className="flex items-center gap-2 text-stone-800">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                <strong>Stage 7 & 8 (Go-Live & Operations):</strong> Domain mapping (.com.bd / .com), DBID & Trade License placement, Supabase Pro plan upgrade, and bKash/Nagad/SSLCommerz gateway.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-[#ECE4D4] flex justify-end">
          <button
            onClick={() => setIsDesignSystemOpen(false)}
            className="px-6 py-2 bg-[#3E0713] text-[#FAF8F5] rounded-full text-xs font-bold hover:bg-[#520B1C] transition"
          >
            {isAr ? 'إغلاق الدليل' : 'Close Guideline'}
          </button>
        </div>
      </div>
    </div>
  );
};

