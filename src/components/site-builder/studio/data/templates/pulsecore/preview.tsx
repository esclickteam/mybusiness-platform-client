import React from "react";
import {
  ArrowLeft,
  ExternalLink,
  Monitor,
  Smartphone,
  Wand2,
  Zap,
} from "lucide-react";

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

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  function handleOpenBrowserPreview() {
    if (typeof window === "undefined") return;

    window.open(window.location.href, "_blank", "noopener,noreferrer");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#061D31] text-white"
    >
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061D31]/95 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition hover:bg-white/14"
              aria-label="חזרה"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D7FF36] text-black shadow-[0_12px_34px_rgba(215,255,54,0.22)]">
                <Zap className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-black tracking-[0.18em] text-[#D7FF36]">
                  תצוגת תבנית
                </p>

                <h1 className="truncate text-xl font-black tracking-[-0.04em] text-white md:text-3xl">
                  PulseCore - Website Template
                </h1>

                <p className="mt-1 hidden text-sm font-semibold text-white/55 md:block">
                  Fitness / Studio / Trainers
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={handleOpenBrowserPreview}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-5 text-sm font-black text-white transition hover:bg-white/14"
            >
              Preview in browser
              <ExternalLink className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#D7FF36] px-6 text-sm font-black text-black transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(215,255,54,0.28)]"
            >
              השתמש בתבנית
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="mx-auto max-w-[1560px] px-5 pb-5 pt-8 lg:px-8 lg:pt-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-[#8EC5FF]">
              <span>Templates</span>
              <span className="text-white/35">›</span>
              <span>Health & Wellness</span>
              <span className="text-white/35">›</span>
              <span className="text-white/55">Fitness</span>
            </div>

            <h2 className="text-4xl font-black tracking-[-0.055em] text-white md:text-5xl">
              PulseCore - Website Template
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7FF36] text-black">
                <Zap className="h-5 w-5" />
              </span>

              <p className="text-lg font-semibold text-white/75">
                BizUply Studio
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOpenBrowserPreview}
              className="h-14 rounded-2xl border border-white/12 bg-white/8 px-7 text-base font-black text-white transition hover:bg-white/14"
            >
              Preview in browser
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="h-14 rounded-2xl bg-[#D7FF36] px-7 text-base font-black text-black transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(215,255,54,0.28)]"
            >
              השתמש בתבנית
            </button>
          </div>
        </div>

        {/* DEVICE SWITCH */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-full border border-white/12 bg-white p-1 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
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
      </section>

      {/* FULL SCREEN PREVIEW AREA */}
      <section className="mx-auto max-w-[1560px] px-5 pb-10 lg:px-8">
        <div className="flex justify-center">
          <div
            className={[
              "overflow-hidden bg-white shadow-[0_35px_120px_rgba(0,0,0,0.42)]",
              previewMode === "desktop"
                ? "h-[calc(100vh-285px)] min-h-[650px] w-full rounded-[22px] border border-white/20"
                : "h-[calc(100vh-285px)] min-h-[650px] w-[410px] rounded-[46px] border-[10px] border-black",
            ].join(" ")}
          >
            {/* BROWSER BAR */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>

              <div className="hidden items-center gap-2 text-xs font-black text-slate-400 md:flex">
                <Monitor className="h-4 w-4" />
                PulseCore Live Preview
              </div>
            </div>

            {/* WEBSITE PREVIEW */}
            <div className="h-[calc(100%-44px)] overflow-y-auto overflow-x-hidden bg-white">
              <PulsecorePages initialPage="home" isStudioStatic />
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE BOTTOM ACTION */}
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#061D31]/95 p-3 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={onEdit}
          className="h-12 w-full rounded-2xl bg-[#D7FF36] text-sm font-black text-black"
        >
          השתמש בתבנית
        </button>
      </div>
    </main>
  );
}