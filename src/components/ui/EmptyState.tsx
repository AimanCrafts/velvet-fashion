import React from "react";
import { PackageOpen } from "lucide-react";

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => (
  <div className="text-center py-20 max-w-sm mx-auto">
    <PackageOpen className="w-12 h-12 text-[#C5A059]/60 mx-auto mb-3" />
    <h3 className="font-['Playfair_Display'] text-xl text-stone-800 font-medium">
      {title}
    </h3>
    {description && (
      <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
        {description}
      </p>
    )}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-5 px-6 py-2.5 bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
