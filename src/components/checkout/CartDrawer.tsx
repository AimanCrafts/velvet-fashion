import React, { useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { useRouter } from "../../router/Router";
import { formatBdt } from "../../utils/formatters";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { navigate } = useRouter();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    isBn,
    cartSubtotal,
    updateCartQty,
    removeCartItem,
  } = useStore();

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100),
  );
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceed = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="animate-drawer w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between border-s border-[#ECE4D4]">
          {/* Header */}
          <div className="p-4 border-b border-[#ECE4D4] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#3E0713]" />
              <h2 className="font-['Cinzel'] text-lg font-bold text-[#3E0713]">
                {isBn ? "আপনার শপিং ব্যাগ" : "Your Shopping Bag"}
              </h2>
              <span className="text-xs bg-[#ECE4D4] text-[#3E0713] font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Indicator */}
          <div className="bg-[#F7F3EA] px-4 py-3 border-b border-[#ECE4D4] text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-stone-700 font-medium">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              {remainingForFree > 0 ? (
                <span>
                  {isBn
                    ? `আর মাত্র ${formatBdt(remainingForFree, "bn")} টাকার কেনাকাটায় ঢাকায় ফ্রি ডেলিভারি!`
                    : `Add ${formatBdt(remainingForFree, "en")} more for Free Delivery in Dhaka`}
                </span>
              ) : (
                <span className="text-emerald-800 font-bold">
                  {isBn
                    ? "অভিনন্দন! আপনি ফ্রি ডেলিভারি আনলক করেছেন"
                    : "Congratulations! You unlocked Free Delivery"}
                </span>
              )}
            </div>
            <div className="w-full bg-[#E0D7C6] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C5A059] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-stone-500">
                <ShoppingBag className="w-12 h-12 text-[#C5A059]/40 mb-3" />
                <p className="font-['Playfair_Display'] text-lg text-stone-700 font-medium">
                  {isBn ? "আপনার ব্যাগ বর্তমানে খালি" : "Your bag is empty"}
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  {isBn
                    ? "আমাদের এক্সক্লুসিভ কালেকশন থেকে আপনার পছন্দের পোশাক নির্বাচন করুন"
                    : "Explore our tailored collections and select your bespoke pieces"}
                </p>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = item.variant.priceBdt ?? item.variant.priceQar ?? 0;
                return (
                  <div
                    key={item.variant.id}
                    className="flex gap-3 bg-white p-3 rounded-lg border border-[#ECE4D4] shadow-2xs"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name_en}
                      className="w-18 h-24 object-cover rounded-md bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                            {isBn ? item.product.name_bn : item.product.name_en}
                          </h4>
                          <button
                            onClick={() => removeCartItem(item.variant.id)}
                            className="text-stone-400 hover:text-red-600 transition p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                          <span>
                            {isBn ? "সাইজ:" : "Size:"}{" "}
                            <strong className="text-stone-800">
                              {item.variant.size}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            {isBn ? "রং:" : "Color:"}{" "}
                            <strong className="text-stone-800">
                              {item.variant.color}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        {/* Qty Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-md bg-[#FAF8F5]">
                          <button
                            onClick={() => updateCartQty(item.variant.id, -1)}
                            className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs transition"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.variant.id, 1)}
                            disabled={item.quantity >= item.variant.stockQty}
                            className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs transition disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-end">
                          <span className="text-xs font-bold text-[#3E0713]">
                            {formatBdt(
                              itemPrice * item.quantity,
                              isBn ? "bn" : "en",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-[#ECE4D4] space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{isBn ? "সাবটোটাল:" : "Subtotal:"}</span>
                  <span className="font-bold text-stone-900">
                    {formatBdt(cartSubtotal, isBn ? "bn" : "en")}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>
                    {isBn
                      ? "আনুমানিক ডেলিভারি চার্জ:"
                      : "Estimated Delivery Fee:"}
                  </span>
                  <span>
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700 font-bold">
                        {isBn ? "ফ্রি" : "FREE"}
                      </span>
                    ) : (
                      <span>৳ 70</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#3E0713] pt-2 border-t border-stone-100">
                  <span>
                    {isBn ? "মোট আনুমানিক মূল্য:" : "Estimated Total:"}
                  </span>
                  <span>
                    {formatBdt(
                      cartSubtotal >= freeShippingThreshold
                        ? cartSubtotal
                        : cartSubtotal + 70,
                      isBn ? "bn" : "en",
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <span>
                  {isBn
                    ? "অর্ডার সম্পন্ন করতে এগিয়ে যান (COD / বিকাশ)"
                    : "Proceed to Checkout (COD / bKash)"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-stone-500 font-medium">
                {isBn
                  ? "অ্যাকাউন্ট তৈরির প্রয়োজন নেই • পণ্য দেখে ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ"
                  : "No account required • Cash on Delivery with full inspection"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
