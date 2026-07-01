import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
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
    frameClass: "rounded-none",
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: Tablet,
    widthClass: "w-[820px]",
    frameClass: "rounded-[34px]",
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    widthClass: "w-[390px]",
    frameClass: "rounded-[42px]",
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
    localStorage.setItem("bizuply-selected-template-id", "velmora");
    navigate(`${basePath}/dashboard/website?templateId=velmora`);
  }

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  return (
    <main className="min-h-screen bg-[#ede6dc] text-[#2a2119]">
      <header className="sticky top-0 z-50 border-b border-[#d8cdbd] bg-[#fbf7f1]/95 px-4 py-4 shadow-[0_14px_40px_rgba(42,33,25,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d8cdbd] bg-white text-[#2a2119] transition hover:-translate-x-0.5 hover:bg-[#f1e8dc]"
              aria-label="Back to templates"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-black uppercase tracking-[0.28em] text-[#9b7245]">
                Template Preview
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-2xl font-black tracking-[-0.06em] text-[#2a2119]">
                  Velmora
                </h1>

                <span className="hidden rounded-full border border-[#d8cdbd] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#756858] md:inline-flex">
                  Fashion Store
                </span>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-[#d8cdbd] bg-white p-1.5 shadow-sm md:flex">
            {previewModes.map((item) => {
              const Icon = item.icon;
              const active = previewMode === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreviewMode(item.id)}
                  className={[
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-black transition duration-300",
                    active
                      ? "bg-[#2a2119] text-white shadow-[0_10px_30px_rgba(42,33,25,0.18)]"
                      : "text-[#756858] hover:bg-[#f1e8dc] hover:text-[#2a2119]",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-[#d8cdbd] bg-white px-4 py-3 text-xs font-black text-[#756858] lg:flex">
              <Check className="h-4 w-4 text-[#9b7245]" />
              Multi page template
            </div>

            <button
              type="button"
              onClick={handleUseTemplate}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2a2119] px-5 text-sm font-black text-white shadow-[0_14px_35px_rgba(42,33,25,0.18)] transition hover:-translate-y-0.5 hover:bg-[#453528]"
            >
              <Wand2 className="h-4 w-4" />
              Use Template
            </button>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-[1700px] items-center justify-center md:hidden">
          <div className="flex items-center gap-1 rounded-full border border-[#d8cdbd] bg-white p-1.5 shadow-sm">
            {previewModes.map((item) => {
              const Icon = item.icon;
              const active = previewMode === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreviewMode(item.id)}
                  className={[
                    "inline-flex h-10 w-10 items-center justify-center rounded-full transition duration-300",
                    active
                      ? "bg-[#2a2119] text-white"
                      : "text-[#756858] hover:bg-[#f1e8dc] hover:text-[#2a2119]",
                  ].join(" ")}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-7">
        <div className="pointer-events-none absolute left-[-220px] top-10 h-[520px] w-[520px] rounded-full bg-[#b7c4a5]/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-260px] right-[-120px] h-[560px] w-[560px] rounded-full bg-[#caa36d]/25 blur-3xl" />

        <div className="relative mx-auto max-w-[1740px]">
          <div className="mb-5 flex flex-col justify-between gap-3 rounded-[26px] border border-[#d8cdbd] bg-[#fbf7f1]/80 p-4 shadow-sm backdrop-blur-xl md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9b7245]">
                Live Preview
              </p>
              <p className="mt-1 text-sm font-bold text-[#756858]">
                לחצי על התפריט בתוך האתר כדי לעבור בין בית, חנות, מוצר,
                קולקציות, אודות, מגזין ויצירת קשר.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Hero Product Cards",
                "Shop Page",
                "Product Page",
                "RTL",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#d8cdbd] bg-white px-3 py-2 text-xs font-black text-[#2a2119]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className={[
                "relative overflow-hidden bg-white shadow-[0_40px_140px_rgba(42,33,25,0.20)] ring-1 ring-[#d8cdbd] transition-all duration-500 ease-out",
                activePreviewMode.widthClass,
                activePreviewMode.frameClass,
                previewMode === "mobile" ? "max-h-[calc(100vh-170px)]" : "",
                previewMode === "tablet" ? "max-h-[calc(100vh-170px)]" : "",
              ].join(" ")}
            >
              {previewMode !== "desktop" && (
                <div className="flex h-11 items-center justify-center border-b border-[#e8ddd0] bg-[#fbf7f1]">
                  <div className="h-1.5 w-20 rounded-full bg-[#c9bcaa]" />
                </div>
              )}

              <div
                className={[
                  "bg-white",
                  previewMode === "desktop"
                    ? "min-h-[calc(100vh-150px)]"
                    : "max-h-[calc(100vh-220px)] overflow-y-auto",
                ].join(" ")}
              >
                <VelmoraPages />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}