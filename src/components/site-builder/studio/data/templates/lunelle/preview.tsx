import React from "react";
import { useNavigate } from "react-router-dom";
import LunellePages from "./pages";

function getBasePath() {
  const pathname = window.location.pathname || "";

  if (pathname.startsWith("/client")) return "/client";
  if (pathname.startsWith("/business")) return "/business";

  return "";
}

export default function LunellePreview() {
  const navigate = useNavigate();

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-id", "lunelle");
    navigate(`${getBasePath()}/dashboard/website?templateId=lunelle`);
  }

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#2a171c]">
      <div className="sticky top-0 z-50 border-b border-[#2a171c]/10 bg-white/90 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8a4f5f]">
              Template Preview
            </p>
            <h1 className="truncate text-2xl font-black tracking-[-0.05em]">
              Lunelle
            </h1>
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="rounded-full bg-[#2a171c] px-6 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(42,23,28,.18)]"
          >
            השתמשי בתבנית
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] bg-white">
        <LunellePages />
      </div>
    </main>
  );
}