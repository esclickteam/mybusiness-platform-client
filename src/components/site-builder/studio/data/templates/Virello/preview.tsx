import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MonitorSmartphone, Sparkles } from "lucide-react";

import AdionPages from "./pages";

type AdionPreviewProps = {
  onUseTemplate?: () => void;
};

export default function AdionPreview({ onUseTemplate }: AdionPreviewProps) {
  const navigate = useNavigate();

  const { businessId } = useParams<{
    businessId?: string;
  }>();

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-key", "adion");
    localStorage.setItem("bizuply-selected-template-id", "adion");

    if (typeof onUseTemplate === "function") {
      onUseTemplate();
      return;
    }

    if (businessId) {
      navigate(
        `/business/${businessId}/dashboard/website?template=adion&templateId=adion`,
      );
      return;
    }

    navigate(`/dashboard/website?template=adion&templateId=adion`);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#301b12] p-3 text-white sm:p-4">
      <div className="mx-auto w-full max-w-[1760px]">
        <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header"
          className="
            mb-4 flex items-center justify-between gap-4 rounded-[28px]
            border border-white/10 bg-white/10 px-4 py-4
            shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              <span className="absolute h-10 w-10 rotate-45 rounded-[10px] bg-[#fff8f0]" />
              <Sparkles className="relative z-10 h-5 w-5 text-[#301b12]" />
            </span>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-[-0.06em]">
                Virello
              </h1>

              <p className="truncate text-xs font-bold text-white/55">
                Digital agency premium website template
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="
              inline-flex h-12 shrink-0 items-center gap-3 rounded-full
              bg-[#ffe3a8] px-5 text-sm font-black text-[#301b12]
              transition hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(255,227,168,0.35)]
              sm:px-6
            "
          >
            השתמשי בתבנית
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <section
          className="
            overflow-hidden rounded-[34px] border border-white/10 bg-[#fff8f0]
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
              Virello Live Preview
            </div>
          </div>

          <div
            className="
              h-[calc(100vh-168px)] min-h-[720px]
              overflow-y-auto overflow-x-hidden bg-[#fff8f0]
            "
          >
            <AdionPages initialPage="home" mode="preview" />
          </div>
        </section>
      </div>
    </main>
  );
}