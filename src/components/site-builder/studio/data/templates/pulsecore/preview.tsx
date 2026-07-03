import React from "react";
import { ArrowLeft, ExternalLink, Monitor, Smartphone, Wand2, Zap } from "lucide-react";

import PulsecorePages from "./pages";

type PreviewMode = "desktop" | "mobile";

type PulsecorePreviewProps = {
  onEdit?: () => void;
  onBack?: () => void;
};

export default function PulsecorePreview({
  onEdit,
  onBack,
}: PulsecorePreviewProps) {
  const [previewMode, setPreviewMode] = React.useState<PreviewMode>("desktop");

  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#101828]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-5 px-6 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50"
              aria-label="חזרה"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D7FF36] text-black">
                <Zap className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-black text-[#2563eb]">
                  תצוגת תבנית
                </p>

                <h1 className="truncate text-xl font-black tracking-[-0.04em] text-slate-950 md:text-3xl">
                  PulseCore - Website Template
                </h1>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Fitness / Studio / Trainers
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-slate-50"
            >
              Preview in browser
              <ExternalLink className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-6 text-sm font-black text-white transition hover:bg-black"
            >
              ערוך תבנית
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PAGE INFO */}
      <section className="mx-auto max-w-[1800px] px-6 py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#2563eb]">
              <span>Templates</span>
              <span className="text-slate-400">›</span>
              <span>Health & Wellness</span>
              <span className="text-slate-400">›</span>
              <span className="text-slate-500">Fitness</span>
            </div>

            <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
              PulseCore - Website Template
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF36] text-black">
                <Zap className="h-5 w-5" />
              </span>

              <p className="text-lg font-semibold text-slate-700">
                BizUply Studio
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="h-14 rounded-xl border border-slate-200 bg-white px-7 text-base font-black text-slate-950 transition hover:bg-slate-50"
            >
              Preview in browser
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="h-14 rounded-xl bg-[#2563eb] px-7 text-base font-black text-white transition hover:bg-[#1d4ed8]"
            >
              השתמש בתבנית
            </button>
          </div>
        </div>

        {/* DEVICE SWITCH */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={[
                "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-black transition",
                previewMode === "desktop"
                  ? "bg-black text-white"
                  : "text-slate-500 hover:text-slate-950",
              ].join(" ")}
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={[
                "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-black transition",
                previewMode === "mobile"
                  ? "bg-black text-white"
                  : "text-slate-500 hover:text-slate-950",
              ].join(" ")}
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </button>
          </div>
        </div>

        {/* PREVIEW FRAME */}
        <div className="mt-8 flex justify-center">
          <div
            className={[
              "overflow-hidden border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.16)]",
              previewMode === "desktop"
                ? "h-[78vh] w-full max-w-[1640px] rounded-[18px]"
                : "h-[78vh] w-[390px] rounded-[42px] border-[10px] border-slate-950",
            ].join(" ")}
          >
            <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
              <PulsecorePages initialPage="home" isStudioStatic />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}