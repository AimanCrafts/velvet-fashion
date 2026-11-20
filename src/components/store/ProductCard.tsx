import React, { useState } from "react";
import type { Product } from "../../types";
import { useStore } from "../../context/StoreContext";
import { formatBdt } from "../../utils/formatters";
import { Link } from "../../router/Router";
import { Heart, Plus } from "lucide-react";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { isBn, addToCart, isWishlisted, toggleWishlist } = useStore();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wish = isWishlisted(product.id);

  const prices = product.variants.map((v) => v.priceBdt ?? v.priceQar ?? 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasRange = minPrice !== maxPrice;
  const inStock = product.variants.some((v) => v.stockQty > 0);
  const defaultVariant = product.variants.find((v) => v.stockQty > 0) || product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product, defaultVariant);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image frame */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#F2ECE4] border border-[#ECE4D4] shadow-2xs group-hover:border-[#C5A059]/60 group-hover:shadow-lg transition-all duration-500">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#2A030C] text-[#F4E2B5] p-4 text-center">
            <img
              src="/brand/velvet_emblem.jpg"
              alt="Velvet Seal"
              className="w-16 h-16 rounded-full border border-[#C5A059] mb-2 opacity-80"
            />
            <span className="font-['Cinzel'] text-xs font-bold tracking-widest">VELVET FASHION</span>
            <span className="text-[10px] text-stone-300 mt-1">{isBn ? product.name_bn : product.name_en}</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={isBn ? product.name_bn : product.name_en}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        )}

        {/* Subtle gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition hover:bg-white shadow-md active:scale-90 z-10"
        >
          <Heart
            className={`w-4 h-4 transition ${
              wish ? "fill-[#3E0713] text-[#3E0713]" : "text-stone-600 hover:text-[#3E0713]"
            }`}
          />
        </button>

        {/* Quick add CTA — slides up smoothly on hover/active */}
        {inStock && (
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-3 inset-x-3 py-2.5 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-[11px] font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md active:scale-95 z-10 ${
              hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none md:pointer-events-auto"
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isBn ? "ব্যাগে যুক্ত করুন" : "Quick add"}</span>
          </button>
        )}

        {/* Status Badge */}
        {product.newArrival && (
          <span className="absolute top-3 start-3 bg-[#FAF8F5]/95 backdrop-blur-xs text-[#3E0713] text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded shadow-xs border border-[#ECE4D4]">
            {isBn ? "নতুন" : "New"}
          </span>
        )}
        {!inStock && (
          <span className="absolute top-3 start-3 bg-stone-900/90 text-white text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded shadow-xs">
            {isBn ? "স্টক শেষ" : "Sold out"}
          </span>
        )}
      </div>

      {/* Info details */}
      <div className="pt-3 px-1">
        <p className="text-[10px] uppercase tracking-[0.15em] text-[#A8813B] font-semibold mb-1 truncate">
          {isBn ? product.collection_bn : product.collection}
        </p>
        <h3 className="font-['Playfair_Display'] text-[15px] font-normal leading-snug text-stone-900 group-hover:text-[#3E0713] transition line-clamp-1">
          {isBn ? product.name_bn : product.name_en}
        </h3>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-[#3E0713] font-['Plus_Jakarta_Sans']">
            {hasRange
              ? `${formatBdt(minPrice, isBn ? "bn" : "en")} – ${formatBdt(maxPrice, isBn ? "bn" : "en")}`
              : formatBdt(minPrice, isBn ? "bn" : "en")}
          </span>
        </div>
      </div>
    </Link>
  );
};
