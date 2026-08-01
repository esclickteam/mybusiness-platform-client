import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayoutTemplate, Wand2 } from "lucide-react";

import { getTemplateCatalogEntry } from "../components/site-builder/studio/data/templates/templateCatalog";
import {
  loadStudioTemplateRenderer,
  prefetchStudioTemplateRenderer,
  type StudioTemplateRenderer,
} from "../components/site-builder/studio/data/templates/templateRendererRegistry";

export default function WebsiteTemplatePreviewPage() {
  const navigate = useNavigate();

  const { businessId, templateId } = useParams<{
    businessId?: string;
    templateId?: string;
  }>();

  const basePath = businessId ? `/business/${businessId}` : "/business";

  const cleanTemplateId = String(templateId || "").trim().toLowerCase();
  const template = cleanTemplateId
    ? getTemplateCatalogEntry(cleanTemplateId)
    : null;

  const [renderer, setRenderer] = useState<StudioTemplateRenderer | null>(null);
  const [loading, setLoading] = useState(Boolean(cleanTemplateId));

  useEffect(() => {
    let cancelled = false;
    if (!cleanTemplateId) {
      setRenderer(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    prefetchStudioTemplateRenderer(cleanTemplateId);
    loadStudioTemplateRenderer(cleanTemplateId).then((next) => {
      if (cancelled) return;
      setRenderer(next);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cleanTemplateId]);

  const homePage = renderer?.pages?.[0];
  const homePageId = homePage?.id || "home";
  const [previewPageId, setPreviewPageId] = useState(homePageId);

  useEffect(() => {
    setPreviewPageId(homePageId);
  }, [cleanTemplateId, homePageId]);

  const previewPage = useMemo(() => {
    const pages = renderer?.pages || [];
    return (
      pages.find((page) => String(page.id) === String(previewPageId)) ||
      pages[0] ||
      null
    );
  }, [renderer?.pages, previewPageId]);

  function handleBackToTemplates() {
    navigate(`${basePath}/dashboard/website/templates`);
  }

  function handleUseTemplate() {
    if (!template?.id && !renderer?.key) return;

    const id = String(template?.id || renderer?.key || "").trim();
    localStorage.setItem("bizuply-selected-template-id", id);
    localStorage.setItem("bizuply-selected-template-key", id);
    prefetchStudioTemplateRenderer(id);

    navigate(`${basePath}/dashboard/website?template=${id}`);
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

  if (loading) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
      </main>
    );
  }

  if (!template && !renderer?.Component) {
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
              className="mt-7 rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-6 py-3 text-sm font-bold text-black transition hover:bg-black"
            >
              חזרה לתבניות
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (renderer?.Component) {
    const Component = renderer.Component as React.ComponentType<
      Record<string, unknown>
    >;
    const data = (renderer.defaultData || {}) as Record<string, unknown>;
    const pageId = String(previewPageId || homePageId);
    const pageSlug = String(previewPage?.slug || homePage?.slug || "/");
    const key = String(renderer.key || cleanTemplateId).toLowerCase();
    const background =
      (data as any)?.backgroundColor ||
      "#0b1020";

    return (
      <main
        className="fixed inset-0 z-[9999] overflow-x-hidden overflow-y-auto"
        style={{ background }}
      >
        <PreviewActions />
        {renderer.editorCss ? (
          <style
            dangerouslySetInnerHTML={{ __html: String(renderer.editorCss) }}
          />
        ) : null}
        <div
          className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-visible"
          data-template-id={key}
          dir="rtl"
        >
          <Component
            initialPage={pageId}
            initialPageId={pageId}
            activePageId={pageId}
            currentPageId={pageId}
            pageId={pageId}
            initialSlug={pageSlug}
            activePageSlug={pageSlug}
            currentPageSlug={pageSlug}
            pageSlug={pageSlug}
            mode="preview"
            data={data}
            templateData={data}
            isStudioStatic
            onPageChange={(nextPageId: string) => {
              const next = String(nextPageId || "").trim();
              if (!next) return;
              setPreviewPageId(next);
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-white px-6 py-10 text-[#111827]">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-[#e5e7eb] bg-[#f9fafb] p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black tracking-[-0.03em]">
            אין תצוגה מקדימה לתבנית
          </h1>
          <button
            type="button"
            onClick={handleBackToTemplates}
            className="mt-7 rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-6 py-3 text-sm font-bold text-black transition hover:bg-black"
          >
            חזרה לתבניות
          </button>
        </div>
      </div>
    </main>
  );
}
