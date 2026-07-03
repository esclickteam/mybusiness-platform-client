import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MonitorSmartphone, Sparkles } from "lucide-react";

import LunellePages from "./pages";

type LunellePreviewProps = {
  onEdit?: () => void;
  onBack?: () => void;
};

function getBasePathFromLocation() {
  if (typeof window === "undefined") return "";

  const pathname = window.location.pathname || "";

  if (pathname.startsWith("/client")) return "/client";
  if (pathname.startsWith("/business")) return "/business";

  return "";
}

export default function LunellePreview({
  onEdit,
  onBack,
}: LunellePreviewProps = {}) {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const basePath = businessId
    ? `/business/${businessId}`
    : getBasePathFromLocation() || "/business";

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-key", "lunelle");
    localStorage.setItem("bizuply-selected-template-id", "lunelle");

    if (onEdit) {
      onEdit();
      return;
    }

    navigate(`${basePath}/dashboard/website?template=lunelle`);
  }

  function handleBackToTemplates() {
    if (onBack) {
      onBack();
      return;
    }

    navigate(`${basePath}/dashboard/website/templates`);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#2a171c] p-4 text-white"
    >
      <div className="mx-auto max-w-[1600px]">
        <header
          className="
            mb-4 flex items-center justify-between gap-4 rounded-[28px]
            border border-white/10 bg-white/10 px-5 py-4
            shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="
                inline-flex h-11 w-11 shrink-0 items-center justify-center
                rounded-full border border-white/10 bg-white/10 text-white
                transition hover:bg-white/15
              "
              aria-label="חזרה לתבניות"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              <span className="absolute h-10 w-10 rounded-full bg-[#e8b8c1]" />
              <Sparkles className="relative z-10 h-5 w-5 text-[#2a171c]" />
            </span>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-[-0.06em]">
                Lunelle
              </h1>

              <p className="truncate text-xs font-bold text-white/55">
                Nail studio premium website template
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="
              inline-flex h-12 shrink-0 items-center gap-3 rounded-full
              bg-[#e8b8c1] px-6 text-sm font-black text-[#2a171c]
              transition hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(232,184,193,0.35)]
            "
          >
            השתמשי בתבנית
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <section
          className="
            overflow-hidden rounded-[34px] border border-white/10 bg-white
            shadow-[0_30px_110px_rgba(0,0,0,0.32)]
          "
        >
          <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-black/40">
              <MonitorSmartphone className="h-4 w-4" />
              Lunelle Live Preview
            </div>
          </div>

          <div className="h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden bg-white">
            <LunellePages initialPage="home" isStudioStatic />
          </div>
        </section>
      </div>
    </main>
  );
}