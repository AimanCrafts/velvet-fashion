import React from "react";
import { Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { ArrowRight, Compass } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  const { isBn } = useStore();

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#ECE4D4] flex items-center justify-center mx-auto mb-4 text-[#88652A]">
        <Compass className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs font-bold tracking-widest text-[#88652A] uppercase block mb-1">
        404 • PAGE NOT FOUND
      </span>

      <h1 className="font-['Playfair_Display'] text-3xl font-normal text-[#24030B] mb-3">
        {isBn ? "পৃষ্ঠাটি খুঁজে পাওয়া যায়নি" : "Destination Not Found"}
      </h1>

      <p className="text-xs text-stone-600 leading-relaxed mb-8">
        {isBn
          ? "আপনি যে পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা বর্তমানে উপলব্ধ নেই। আমাদের কালেকশন দেখতে শপে প্রবেশ করুন।"
          : "The runway or garment you are looking for has been relocated or is currently unavailable."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition shadow-sm"
        >
          {isBn ? "হোমপেজে ফিরে যান" : "Back to Home"}
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-full border border-[#ECE4D4] hover:bg-[#FAF8F5] text-stone-800 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
        >
          <span>{isBn ? "কালেকশন ব্রাউজ করুন" : "Browse Collections"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
