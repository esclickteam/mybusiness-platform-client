import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Tablet,
  Wand2,
} from "lucide-react";

import {
  getStudioTemplateById,
  templateHasEditorPages,
} from "../components/site-builder/studio/data/templates";

export default function WebsiteTemplatePreviewPage() {
  const navigate = useNavigate();

  const { businessId, templateId } = useParams<{
    businessId: string;
    templateId: string;
  }>();

  const basePath = businessId ? `/business/${businessId}` : "/business";
  const template = templateId ? getStudioTemplateById(templateId) : undefined;

  const [activePageId, setActivePageId] = useState("home");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  const editorPages = template?.seed?.editor?.pages || [];
  const canEditTemplate = templateHasEditorPages(template);

  const activePage = useMemo(() => {
    return (
      editorPages.find((page) => page.id === activePageId) ||
      editorPages.find((page) => page.isHome) ||
      editorPages[0]
    );
  }, [activePageId, editorPages]);

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  function handleUseTemplate() {
    if (!template?.id) return;

    if (!canEditTemplate) {
      alert(
        `התבנית ${template.name} עדיין לא מחוברת ל-editor.pages ולכן אי אפשר לפתוח אותה לעריכה. צריך לעדכן את קובץ הדאטה שלה.`
      );
      return;
    }

    localStorage.setItem("bizuply-selected-template-id", template.id);
    navigate(`${basePath}/dashboard/website?templateId=${template.id}`);
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
              The selected website template does not exist or was not registered.
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

  const frameWidth =
    device === "desktop" ? "100%" : device === "tablet" ? "820px" : "390px";

  const hasRegistryPreview = canEditTemplate && activePage?.html;

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

          <div className="hidden items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-1 md:flex">
            {[
              { id: "desktop", icon: Monitor, label: "Desktop" },
              { id: "tablet", icon: Tablet, label: "Tablet" },
              { id: "mobile", icon: Smartphone, label: "Mobile" },
            ].map((item) => {
              const Icon = item.icon;
              const active = device === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDevice(item.id as typeof device)}
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-black transition",
                    active
                      ? "bg-white text-[#111827] shadow-sm"
                      : "text-[#6b7280] hover:bg-white",
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
            className={[
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black shadow-sm transition",
              canEditTemplate
                ? "bg-[#111827] text-white hover:bg-black"
                : "cursor-not-allowed bg-[#e5e7eb] text-[#6b7280]",
            ].join(" ")}
          >
            <Wand2 className="h-4 w-4" />
            {canEditTemplate ? "Use Template" : "Editor not ready"}
          </button>
        </div>

        {editorPages.length > 1 && (
          <div className="mx-auto mt-4 flex max-w-[1600px] gap-2 overflow-x-auto pb-1">
            {editorPages.map((page) => {
              const active = page.id === activePage?.id;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className={[
                    "shrink-0 rounded-full border px-4 py-2 text-xs font-black transition",
                    active
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]",
                  ].join(" ")}
                >
                  {page.title}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <section className="px-4 py-6">
        <div className="mx-auto max-w-[1700px]">
          <div className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-sm">
            <div
              className="mx-auto min-h-[720px] overflow-hidden bg-white transition-all duration-300"
              style={{ width: frameWidth, maxWidth: "100%" }}
            >
              {hasRegistryPreview ? (
                <>
                  <style>{template.seed.editor?.css || activePage.css || ""}</style>
                  <div dangerouslySetInnerHTML={{ __html: activePage.html }} />
                </>
              ) : template.preview ? (
                template.preview
              ) : (
                <div className="flex min-h-[720px] items-center justify-center p-10 text-center">
                  <div>
                    <LayoutTemplate className="mx-auto h-10 w-10 text-[#9ca3af]" />
                    <h2 className="mt-5 text-2xl font-black">
                      Preview exists, editor pages are missing
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b7280]">
                      התבנית קיימת אבל עדיין לא מחוברת ל־seed.editor.pages.
                      היא לא תיפתח לעריכה עד שמעדכנים את הדאטה שלה.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
