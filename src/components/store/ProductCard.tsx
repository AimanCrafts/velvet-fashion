import React, { useState } from "react";
import type { Product, ProductVariant } from "../../types";
import { useStore } from "../../context/StoreContext";
import { formatBdt } from "../../utils/formatters";
import { Link } from "../../router/Router";
import { Heart, Eye, Plus } from "lucide-react";

const formatShortSize = (size: string): string => {
  if (size.startsWith("Size ")) {
    const match = size.match(/Size\s+(\d+)/i);
    return match ? match[1] : size;
  }
  if (size.startsWith("Age ")) {
    return size.replace("Age ", "").replace(" Yrs", "Y");
  }
  if (size.startsWith("Free Size")) return "Free Size";
  if (size.startsWith("One Size")) return "One Size";
  return size;
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    isBn,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setSelectedProductForQuickView,
  } = useStore();

  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wish = isWishlisted(product.id);

  const prices = product.variants.map((v) => v.priceBdt ?? v.priceQar ?? 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasRange = minPrice !== maxPrice;
  const totalStock = product.variants.reduce((acc, v) => acc + v.stockQty, 0);
  const inStock = totalStock > 0;
  const secondaryImage = product.additionalImages?.[0];

  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.colorHex, { name: v.color, hex: v.colorHex }])
    ).values()
  );

  const handleQuickVariantAdd = (e: React.MouseEvent, variant: ProductVariant) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant.stockQty <= 0) return;
    addToCart(product, variant, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProductForQuickView(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F2ECE4] border border-[#ECE4D4] group-hover:border-[#C5A059]/70 transition-colors duration-300">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#24030B] text-[#F4E2B5] p-4 text-center">
            <img
              src="./brand/velvet_emblem.jpg"
              alt="Velvet Seal"
              className="w-16 h-16 rounded-full border border-[#C5A059] mb-2 opacity-80"
            />
            <span className="font-['Cinzel'] text-xs font-bold tracking-widest">
              VELVET FASHION
            </span>
            <span className="text-[10px] text-stone-300 mt-1">
              {isBn ? product.name_bn : product.name_en}
            </span>
          </div>
        ) : (
          <>
            <img
              src={product.imageUrl}
              alt={isBn ? product.name_bn : product.name_en}
              loading="lazy"
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                secondaryImage && hovered
                  ? "opacity-0 scale-105"
                  : "opacity-100 group-hover:scale-[1.04]"
              }`}
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${isBn ? product.name_bn : product.name_en} detail`}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  hovered ? "opacity-100 scale-[1.03]" : "opacity-0 scale-100"
                }`}
              />
            )}
          </>
        )}

        <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
          {product.newArrival && inStock && (
            <span className="bg-[#FAF8F5]/95 text-[#3E0713] text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 border border-[#ECE4D4]">
              {isBn ? "নতুন" : "New"}
            </span>
          )}
          {!inStock && (
            <span className="bg-stone-900/90 text-white text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1">
              {isBn ? "স্টক শেষ" : "Sold Out"}
            </span>
          )}
        </div>

        <div className="absolute top-3 end-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
            className="w-8 h-8 bg-white/90 hover:bg-white border border-[#ECE4D4] flex items-center justify-center transition shadow-xs"
          >
            <Heart
              className={`w-3.5 h-3.5 transition ${
                wish ? "fill-[#3E0713] text-[#3E0713]" : "text-stone-700 hover:text-[#3E0713]"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            aria-label={isBn ? "দ্রুত দেখুন" : "Quick view"}
            title={isBn ? "দ্রুত দেখুন" : "Quick View"}
            className={`w-8 h-8 bg-white/90 hover:bg-white border border-[#ECE4D4] flex items-center justify-center transition shadow-xs ${
              hovered ? "opacity-100" : "opacity-90 lg:opacity-0"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-stone-700 hover:text-[#3E0713]" />
          </button>
        </div>

        {inStock && (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`absolute inset-x-0 bottom-0 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#ECE4D4] p-2.5 transition-all duration-300 z-10 ${
              hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            {product.variants.length === 1 ? (
              <button
                type="button"
                onClick={(e) => handleQuickVariantAdd(e, product.variants[0])}
                className="w-full py-2 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3 h-3 text-[#C5A059]" />
                <span>
                  {isBn
                    ? `ব্যাগে যুক্ত করুন (${formatShortSize(product.variants[0].size)})`
                    : `Quick Add — ${formatShortSize(product.variants[0].size)}`}
                </span>
              </button>
            ) : (
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-stone-500 font-bold mb-1.5 text-center">
                  {isBn ? "দ্রুত ব্যাগে যোগ করতে সাইজ চাপুন" : "Quick Add Size"}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={v.stockQty <= 0}
                      onClick={(e) => handleQuickVariantAdd(e, v)}
                      className={`px-2 py-1 text-[10px] font-bold border transition ${
                        v.stockQty > 0
                          ? "bg-white border-[#DDD1BC] text-[#24030B] hover:bg-[#3E0713] hover:text-[#FAF8F5] hover:border-[#3E0713]"
                          : "bg-stone-100 border-stone-200 text-stone-300 line-through cursor-not-allowed"
                      }`}
                    >
                      {formatShortSize(v.size)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3.5 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.14em] text-[#88652A] font-semibold truncate">
            {isBn ? product.collection_bn : product.collection}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {uniqueColors.map((c) => (
              <span
                key={c.hex}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <h3 className="font-['Playfair_Display'] text-base font-normal leading-snug text-[#24030B] group-hover:text-[#3E0713] transition line-clamp-1">
          {isBn ? product.name_bn : product.name_en}
        </h3>

        <p className="text-xs text-stone-500 truncate">
          {isBn ? product.fabric_bn : product.fabric_en}
        </p>

        <div className="pt-0.5 flex items-baseline justify-between gap-2">
          <span className="text-base font-bold text-[#3E0713]">
            {hasRange
              ? `${formatBdt(minPrice, isBn ? "bn" : "en")} – ${formatBdt(maxPrice, isBn ? "bn" : "en")}`
              : formatBdt(minPrice, isBn ? "bn" : "en")}
          </span>
          {inStock && totalStock <= 10 && (
            <span className="text-[10px] text-[#88652A] font-medium">
              {isBn ? "সীমিত স্টক" : "Limited batch"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
