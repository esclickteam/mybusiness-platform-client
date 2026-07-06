import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayoutTemplate, Wand2 } from "lucide-react";

import { getStudioTemplateById } from "../components/site-builder/studio/data/templates";

export default function WebsiteTemplatePreviewPage() {
  const navigate = useNavigate();

  const { businessId, templateId } = useParams<{
    businessId?: string;
    templateId?: string;
  }>();

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const cleanTemplateId = String(templateId || "").trim().toLowerCase();
  const template = cleanTemplateId
    ? getStudioTemplateById(cleanTemplateId)
    : undefined;

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  function handleUseTemplate() {
    if (!template?.id) return;

    localStorage.setItem("bizuply-selected-template-id", template.id);
    localStorage.setItem("bizuply-selected-template-key", template.id);

    navigate(`${basePath}/dashboard/website?template=${template.id}`);
  }

  function PreviewActions() {
    return (
      <div className="fixed left-4 top-4 z-[99999] flex items-center gap-3">
        <button
          type="button"
          onClick={handleBackToTemplates}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 text-sm font-black text-white shadow-2xl backdrop-blur-xl transition hover:bg-black"
        >
          <ArrowLeft className="h-4 w-4" />
          חזרה
        </button>

        <button
          type="button"
          onClick={handleUseTemplate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#111827] shadow-2xl transition hover:bg-[#f3f4f6]"
        >
          <Wand2 className="h-4 w-4" />
          שימוש בתבנית
        </button>
      </div>
    );
  }

  if (!template) {
    return (
      <main className="fixed inset-0 z-[9999] overflow-y-auto bg-white px-6 py-10 text-[#111827]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-[#e5e7eb] bg-[#f9fafb] p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#6b7280] shadow-sm">
              <LayoutTemplate className="h-7 w-7" />
            </div>

            <h1 className="mt-6 text-2xl font-black tracking-[-0.03em]">
              התבנית לא נמצאה
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b7280]">
              התבנית שנבחרה לא קיימת או לא רשומה בתיקיית התבניות.
            </p>

            <button
              type="button"
              onClick={handleBackToTemplates}
              className="mt-7 rounded-xl bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              חזרה לתבניות
            </button>
          </div>
        </div>
      </main>
    );
  }

  const previewValue =
    (template as any).Preview ||
    (template as any).PreviewComponent ||
    (template as any).preview ||
    (template as any).component ||
    (template as any).Component;

  if (React.isValidElement(previewValue)) {
    return (
      <main className="fixed inset-0 z-[9999] overflow-x-hidden overflow-y-auto bg-[#07100e]">
        <PreviewActions />
        <div className="min-h-[100dvh] w-full overflow-x-hidden overflow-y-visible">
          {previewValue}
        </div>
      </main>
    );
  }

  if (typeof previewValue === "function") {
    const PreviewComponent = previewValue as React.ComponentType<{
      onUseTemplate?: () => void;
    }>;

    return (
      <main className="fixed inset-0 z-[9999] overflow-x-hidden overflow-y-auto bg-[#07100e]">
        <PreviewActions />
        <div className="min-h-[100dvh] w-full overflow-x-hidden overflow-y-visible">
          <PreviewComponent onUseTemplate={handleUseTemplate} />
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-[#f3f4f6] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 px-5 py-4 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
              aria-label="חזרה לתבניות"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-[#9ca3af]">
                תצוגה מקדימה
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
            שימוש בתבנית
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
                אין תצוגה מקדימה
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6b7280]">
                התבנית קיימת, אבל אין לה קומפוננטת Preview מחוברת. צריך להוסיף
                preview.tsx ולחבר אותו ב־meta.ts.
              </p>

              <div className="mt-7 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToTemplates}
                  className="rounded-xl border border-[#d1d5db] bg-white px-5 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#f9fafb]"
                >
                  חזרה
                </button>

                <button
                  type="button"
                  onClick={handleUseTemplate}
                  className="rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                >
                  שימוש בתבנית
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}