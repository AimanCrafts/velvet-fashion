import React from 'react';
import { useStore } from '../../context/StoreContext';
import { toBengaliNumerals } from '../../utils/formatters';
import type { Audience } from '../../types';
import { SlidersHorizontal } from 'lucide-react';

export const FilterToolbar: React.FC<{ resultCount: number }> = ({ resultCount }) => {
  const { activeAudience, setActiveAudience, sortBy, setSortBy, isBn } = useStore();

  const audienceFilters: { id: Audience; en: string; bn: string }[] = [
    { id: 'all', en: 'All Collections', bn: 'সকল কালেকশন' },
    { id: 'women', en: "Women's Couture", bn: 'নারী ও শাড়ি' },
    { id: 'men', en: "Men's Panjabi", bn: 'পুরুষ ও পাঞ্জাবি' },
    { id: 'kids', en: 'Kids Festive', bn: 'ছোটদের উৎসব' },
    { id: 'unisex', en: 'Shawls & Silk', bn: 'শাল ও ক্যাশমিয়ার' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#ECE4D4] p-3 sm:p-4 mb-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {audienceFilters.map((tab) => {
          const isActive = activeAudience === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAudience(tab.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? 'bg-[#3E0713] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-700 hover:text-[#3E0713] hover:bg-[#F2ECE4]'
              }`}
            >
              {isBn ? tab.bn : tab.en}
            </button>
          );
        })}
      </div>

      {/* Sort & Count Controls */}
      <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
        <span className="text-stone-500 font-medium">
          {isBn ? `${toBengaliNumerals(resultCount)} টি পণ্য পাওয়া গেছে` : `${resultCount} Items Available`}
        </span>

        <div className="flex items-center gap-2">
          <label className="text-stone-600 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#A8813B]" />
            <span className="hidden sm:inline">{isBn ? 'সাজান:' : 'Sort By:'}</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'newest'
              )
            }
            className="text-xs bg-[#FAF8F5] border border-[#E0D7C6] rounded-md px-2.5 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-[#C5A059]"
          >
            <option value="featured">{isBn ? 'সেরা কালেকশন (ফিচার্ড)' : 'Featured & Bespoke'}</option>
            <option value="newest">{isBn ? 'নতুন সংযোজন' : 'Newest Arrivals'}</option>
            <option value="price-asc">{isBn ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
            <option value="price-desc">{isBn ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>
    </div>
  );
};
