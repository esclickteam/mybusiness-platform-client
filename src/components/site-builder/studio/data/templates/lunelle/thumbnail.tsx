import React from "react";
import LunellePages from "./pages";

export default function LunelleThumbnail() {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-[28px] border border-[#2a171c]/10 bg-[#fff7f1] shadow-[0_20px_60px_rgba(42,23,28,.1)]">
      <div className="origin-top scale-[0.28]">
        <div className="w-[1440px]">
          <LunellePages initialPage="home" isStudioStatic />
        </div>
      </div>
    </div>
  );
}