import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayoutTemplate, Wand2 } from "lucide-react";

import { getStudioTemplateById } from "../components/site-builder/studio/data/templates";
import { getStudioTemplateRenderer } from "../components/site-builder/studio/data/templates/templateRendererRegistry";
import TemplateRuntimeHost from "../components/site-builder/studio/TemplateRuntimeHost";

function normalizeTemplateKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function normalizePreviewSeed(template: any, templateKey: string) {
  const seed = template?.seed || {};
  const seedAny = seed as any;

  return {
    ...seedAny,

    id: templateKey,
    key: templateKey,
    rendererKey: templateKey,

    renderMode: "registry",
    editorMode: "renderer",

    name: template?.name || seedAny.name || templateKey,
    category: template?.category || seedAny.category || "business",
    description: template?.description || seedAny.description || "",

    heroTitle:
      seedAny.heroTitle ||
      template?.heroTitle ||
      template?.name ||
      "אתר עסקי מוכן",

    heroSubtitle:
      seedAny.heroSubtitle ||
      template?.heroSubtitle ||
      template?.description ||
      seedAny.description ||
      "תבנית אתר מוכנה לעריכה מלאה.",

    palette: seedAny.palette || {},
    fonts: seedAny.fonts || {},
    layoutSettings: seedAny.layoutSettings || {},
    blocks: Array.isArray(seedAny.blocks) ? seedAny.blocks : [],
  };
}

export default function WebsiteTemplatePreviewPage() {
  const navigate = useNavigate();

  const { businessId, templateId } = useParams<{
    businessId: string;
    templateId: string;
  }>();

  const cleanTemplateId = normalizeTemplateKey(templateId);
  const basePath = businessId ? `/business/${businessId}` : "/business";

  const template = cleanTemplateId
    ? getStudioTemplateById(cleanTemplateId)
    : undefined;

  const renderer = cleanTemplateId
    ? getStudioTemplateRenderer(cleanTemplateId)
    : null;

  const templateData = useMemo(() => {
    if (!template || !cleanTemplateId) return {};

    return normalizePreviewSeed(template, cleanTemplateId);
  }, [template, cleanTemplateId]);

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  function handleUseTemplate() {
    if (!template?.id || !cleanTemplateId) return;

    localStorage.setItem("bizuply-selected-template-key", cleanTemplateId);
    localStorage.setItem("bizuply-selected-template-id", cleanTemplateId);
    localStorage.setItem(
      "bizuply-selected-template-data",
      JSON.stringify(templateData),
    );

    navigate(`${basePath}/dashboard/website/templates/${cleanTemplateId}/edit`);
  }

  if (!template) {
    return (
      <main className="min-h-screen bg-white px-6 py-10 text-[#111827]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#e5e7eb] bg-[#f9fafb] p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#6b7280] shadow-sm">
              <LayoutTemplate className="h-7 w-7" />
            </div>

            <h1 className="mt-6 text-2xl font-black tracking-[-0.03em]">
              Template not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b7280]">
              The selected website template does not exist or was not registered
              in the templates folder.
            </p>

            <button
              type="button"
              onClick={handleBackToTemplates}
              className="mt-7 rounded-xl bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              Back to templates
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!renderer?.Component) {
    return (
      <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">
        <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 px-5 py-4 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={handleBackToTemplates}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
                aria-label="Back to templates"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-[#9ca3af]">
                  Template Preview
                </p>

                <h1 className="truncate text-xl font-black tracking-[-0.03em] text-[#111827]">
                  {template.name}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseTemplate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-black text-white shadow-sm transition hover:bg-black"
            >
              <Wand2 className="h-4 w-4" />
              Use Template
            </button>
          </div>
        </header>

        <section className="px-4 py-6">
          <div className="mx-auto max-w-[1700px]">
            <div className="flex min-h-[650px] items-center justify-center rounded-3xl border border-[#e5e7eb] bg-white p-10 text-center shadow-sm">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f9fafb] text-[#6b7280]">
                  <LayoutTemplate className="h-7 w-7" />
                </div>

                <h2 className="mt-6 text-2xl font-black tracking-[-0.03em]">
                  Preview renderer is not available
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b7280]">
                  This template exists, but it does not have a registered React
                  renderer in templateRendererRegistry.
                </p>

                <div className="mt-7 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackToTemplates}
                    className="rounded-xl border border-[#d1d5db] bg-white px-5 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f9fafb]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleUseTemplate}
                    className="rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-[9999] border-b border-[#e5e7eb] bg-white/95 px-5 py-4 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
              aria-label="Back to templates"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-[#9ca3af]">
                Template Preview
              </p>

              <h1 className="truncate text-xl font-black tracking-[-0.03em] text-[#111827]">
                {template.name}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-black text-white shadow-sm transition hover:bg-black"
          >
            <Wand2 className="h-4 w-4" />
            Use Template
          </button>
        </div>
      </header>

      <section className="bg-white">
        <TemplateRuntimeHost
          renderer={renderer}
          mode="preview"
          activePageId="home"
          activePageSlug="/"
          data={templateData}
        />
      </section>
    </main>
  );
}