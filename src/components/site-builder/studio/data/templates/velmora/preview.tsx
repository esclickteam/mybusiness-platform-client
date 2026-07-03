import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Wand2,
} from "lucide-react";

import VelmoraPages from "./pages";

type PreviewMode = "desktop" | "tablet" | "mobile";

const previewModes: Array<{
  id: PreviewMode;
  label: string;
  icon: React.ElementType;
  widthClass: string;
  frameClass: string;
}> = [
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    widthClass: "w-full",
    frameClass: "rounded-[22px]",
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: Tablet,
    widthClass: "w-[820px] max-w-full",
    frameClass: "rounded-[34px] border-[8px] border-[#2a2119]",
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    widthClass: "w-[390px] max-w-full",
    frameClass: "rounded-[44px] border-[10px] border-[#2a2119]",
  },
];

export default function VelmoraPreview() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const [previewMode, setPreviewMode] = React.useState<PreviewMode>("desktop");

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const activePreviewMode =
    previewModes.find((mode) => mode.id === previewMode) ?? previewModes[0];

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-key", "velmora");
    localStorage.setItem("bizuply-selected-template-id", "velmora");
    navigate(`${basePath}/dashboard/website?template=velmora`);
  }

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  function handleOpenBrowserPreview() {
    if (typeof window === "undefined") return;
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#2a2119] text-white"
    >
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#2a2119]/95 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition hover:bg-white/14"
              aria-label="Back to templates"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#caa36d] text-[#2a2119] shadow-[0_12px_34px_rgba(202,163,109,0.24)]">
                <Check className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#caa36d]">
                  Template Preview
                </p>

                <h1 className="truncate text-xl font-black tracking-[-0.04em] text-white md:text-3xl">
                  Velmora - Website Template
                </h1>

                <p className="mt-1 hidden text-sm font-semibold text-white/55 md:block">
                  Fashion Store / Boutique / Product Pages
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
              onClick={handleUseTemplate}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#caa36d] px-6 text-sm font-black text-[#2a2119] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(202,163,109,0.28)]"
            >
              Use Template
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="mx-auto max-w-[1560px] px-5 pb-5 pt-8 lg:px-8 lg:pt-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-[#d8cdbd]">
              <span>Templates</span>
              <span className="text-white/35">›</span>
              <span>Store</span>
              <span className="text-white/35">›</span>
              <span className="text-white/55">Fashion Boutique</span>
            </div>

            <h2 className="text-4xl font-black tracking-[-0.055em] text-white md:text-5xl">
              Velmora - Website Template
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#caa36d] text-[#2a2119]">
                <Check className="h-5 w-5" />
              </span>

              <p className="text-lg font-semibold text-white/75">
                BizUply Studio
              </p>

              <span className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/70 md:inline-flex">
                Multi page template
              </span>
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
              onClick={handleUseTemplate}
              className="h-14 rounded-2xl bg-[#caa36d] px-7 text-base font-black text-[#2a2119] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(202,163,109,0.28)]"
            >
              Use Template
            </button>
          </div>
        </div>

        {/* DEVICE SWITCH */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-full border border-white/12 bg-white p-1 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            {previewModes.map((item) => {
              const Icon = item.icon;
              const active = previewMode === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreviewMode(item.id)}
                  className={[
                    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-black transition",
                    active
                      ? "bg-black text-white"
                      : "text-slate-500 hover:text-slate-950",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
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
                : `h-[calc(100vh-285px)] min-h-[650px] ${activePreviewMode.widthClass} ${activePreviewMode.frameClass}`,
            ].join(" ")}
          >
            {/* BROWSER BAR */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#e8ddd0] bg-[#fbf7f1] px-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>

              <div className="hidden items-center gap-2 text-xs font-black text-[#756858] md:flex">
                <Monitor className="h-4 w-4" />
                Velmora Live Preview
              </div>
            </div>

            {/* WEBSITE PREVIEW */}
            <div className="h-[calc(100%-44px)] overflow-y-auto overflow-x-hidden bg-white">
              <VelmoraPages initialPage="home" isStudioStatic />
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE BOTTOM ACTION */}
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-[#2a2119]/95 p-3 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={handleUseTemplate}
          className="h-12 w-full rounded-2xl bg-[#caa36d] text-sm font-black text-[#2a2119]"
        >
          Use Template
        </button>
      </div>
    </main>
  );
}