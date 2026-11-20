import React from "react";
import { useStore } from "../../context/StoreContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 end-6 z-[60] max-w-sm w-[calc(100%-3rem)] sm:w-full animate-fade-in pointer-events-none print:hidden"
    >
      <div className="bg-[#24030B]/95 text-[#FAF8F5] p-3.5 rounded-lg border border-[#C5A059]/40 shadow-2xl backdrop-blur-md flex items-start gap-3 pointer-events-auto">
        {icons[toast.type || "success"]}
        <div className="flex-1">
          <p className="text-xs font-semibold text-white tracking-wide">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-[11px] text-[#ECE4D4]/80 mt-0.5 leading-snug">
              {toast.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
