import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, Tablet, Wand2 } from "lucide-react";

import VelmoraPages from "./pages";

type PreviewMode = "desktop" | "tablet" | "mobile";

export default function VelmoraPreview() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const [previewMode, setPreviewMode] = React.useState<PreviewMode>("desktop");

  const basePath = businessId ? `/business/${businessId}` : "/business";

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-id", "velmora");
    navigate(`${basePath}/dashboard/website?templateId=velmora`);
  }

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  const previewWidthClass =
    previewMode === "desktop"
      ? "w-full"
      : previewMode === "tablet"
      ? "w-[820px]"
      : "w-[390px]";

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label="Back to templates"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-[0.22em] text-slate-400">
                Template Preview
              </p>
              <h1 className="truncate text-xl font-black text-slate-950">
                Velmora
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 md:flex">
            {[
              { id: "desktop", label: "Desktop", icon: Monitor },
              { id: "tablet", label: "Tablet", icon: Tablet },
              { id: "mobile", label: "Mobile", icon: Smartphone },
            ].map((item) => {
              const Icon = item.icon;
              const active = previewMode === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreviewMode(item.id as PreviewMode)}
                  className={[
                    "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition",
                    active
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            <Wand2 className="h-4 w-4" />
            Use Template
          </button>
        </div>
      </header>

      <section className="px-4 py-6">
        <div className="mx-auto max-w-[1700px]">
          <div className="flex justify-center">
            <div
              className={[
                "min-h-[calc(100vh-120px)] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300",
                previewMode === "desktop" ? "rounded-none" : "rounded-[2rem]",
                previewWidthClass,
              ].join(" ")}
            >
              <VelmoraPages />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}