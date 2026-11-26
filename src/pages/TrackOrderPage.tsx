import React, { useState } from "react";
import { useRouter, Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { sanitizeInput } from "../utils/security";
import { formatBdt } from "../utils/formatters";
import { PackageSearch, ArrowRight, ChevronRight, AlertCircle, ShieldCheck } from "lucide-react";

export const TrackOrderPage: React.FC = () => {
  const { navigate } = useRouter();
  const { isBn, orders } = useStore();
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = sanitizeInput(reference, 64).trim();
    if (!cleaned || cleaned.length < 4) {
      setError(
        isBn
          ? "অনুগ্রহ করে সঠিক অর্ডার নম্বর (যেমন VF-BD-1082) বা ট্র্যাকিং টোকেন দিন।"
          : "Please enter a valid Order ID (e.g. VF-BD-1082) or lookup token."
      );
      return;
    }

    navigate(`/order/${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-fade-in">
      <nav className="flex items-center gap-2 text-[11px] text-stone-500 mb-6 uppercase tracking-wider">
        <Link to="/" className="hover:text-[#3E0713] transition">
          {isBn ? "হোম" : "Home"}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#3E0713] font-semibold">
          {isBn ? "অর্ডার ট্র্যাক করুন" : "Track Order"}
        </span>
      </nav>

      <div className="bg-white border border-[#ECE4D4] p-8 sm:p-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#3E0713] text-[#F4E2B5] flex items-center justify-center shrink-0">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#88652A] mb-1">
              {isBn ? "লাইভ অর্ডার স্ট্যাটাস" : "ORDER CONCIERGE"}
            </p>
            <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#24030B]">
              {isBn ? "আপনার অর্ডারের বর্তমান অবস্থা দেখুন" : "Track Your Dispatch"}
            </h1>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              {isBn
                ? "অর্ডার কনফার্মেশনের পর প্রাপ্ত অর্ডার নম্বর (VF-BD-XXXX) অথবা সিকিউর লুকআপ টোকেন লিখুন।"
                : "Enter your Velvet Fashion Order Number (e.g. VF-BD-1082) or cryptographic lookup token to view dispatch status."}
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={64}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={isBn ? "যেমন: VF-BD-1082 বা লুকআপ টোকেন" : "e.g. VF-BD-1082 or lookup token"}
              className="flex-1 px-4 py-3 text-sm bg-[#FAF8F5] border border-[#DDD1BC] focus:outline-none focus:border-[#3E0713]"
            />
            <button
              type="submit"
              className="px-7 py-3 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition"
            >
              <span>{isBn ? "খুঁজুন" : "Check Status"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="pt-4 border-t border-[#ECE4D4] flex items-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-[#88652A] shrink-0" />
          <span>
            {isBn
              ? "গ্রাহকের গোপনীয়তা রক্ষায় অনলাইন লুকআপে ফোন নম্বর ও ঠিকানা আংশিকভাবে গোপন রাখা হয়।"
              : "Customer phone numbers and street addresses are masked on public status views to protect your privacy."}
          </span>
        </div>

        {orders.length > 0 && (
          <div className="pt-4 border-t border-[#ECE4D4] space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              {isBn ? "সাম্প্রতিক / স্যাম্পল অর্ডার রেফারেন্স" : "Recent Session / Sample Order References"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {orders.slice(0, 3).map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => navigate(`/order/${ord.id}`)}
                  className="p-3 bg-[#FAF8F5] border border-[#ECE4D4] hover:border-[#C5A059] text-start transition"
                >
                  <span className="font-mono text-xs font-bold text-[#3E0713] block">
                    {ord.id}
                  </span>
                  <span className="text-[11px] text-stone-600 block mt-0.5 capitalize">
                    {ord.status.replace(/_/g, " ")} • {formatBdt(ord.totalBdt, isBn ? "bn" : "en")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
