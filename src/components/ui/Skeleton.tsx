import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="aspect-[3/4] bg-[#ECE4D4] rounded-xl" />
    <div className="mt-3 h-2.5 w-1/3 bg-[#ECE4D4] rounded" />
    <div className="mt-2 h-3.5 w-3/4 bg-[#ECE4D4] rounded" />
    <div className="mt-2 h-3 w-1/4 bg-[#ECE4D4] rounded" />
  </div>
);

