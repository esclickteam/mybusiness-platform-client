import React from "react";
import {
  ArrowLeft,
  Eye,
  LayoutTemplate,
  Save,
  Wand2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import VelmoraPages, {
  velmoraPages,
  velmoraSections,
} from "./data/templates/velmora/pages";

type VelmoraVisualEditorProps = {
  businessId: string;
  templateKey?: string;
  templateName?: string;
  onBackToTemplates?: () => void;
  onSave?: () => Promise<void> | void;
};

export default function VelmoraVisualEditor({
  businessId,
  templateKey = "velmora",
  templateName = "Velmora",
  onBackToTemplates,
  onSave,
}: VelmoraVisualEditorProps) {
  const navigate = useNavigate();
  const { businessId: routeBusinessId } = useParams<{ businessId: string }>();

  const activeBusinessId = businessId || routeBusinessId || "";
  const basePath = activeBusinessId
    ? `/business/${activeBusinessId}`
    : "/business";

  const [saving, setSaving] = React.useState(false);

  function handleBack() {
    if (onBackToTemplates) {
      onBackToTemplates();
      return;
    }

    navigate(`${basePath}/dashboard/website/templates`);
  }

  function handlePreview() {
    navigate(`${basePath}/dashboard/website/templates/${templateKey}/preview`);
  }

  async function handleSave() {
    try {
      setSaving(true);

      localStorage.setItem("bizuply-selected-template-key", templateKey);
      localStorage.setItem("bizuply-selected-template-id", templateKey);

      if (onSave) {
        await onSave();
      }

      alert("התבנית נשמרה כטיוטה");
    } catch (error) {
      console.error("VELMORA SAVE ERROR:", error);
      alert("אירעה שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#ede6dc] text-[#2a2119]">
      {/* Bizuply editor header only — לא נוגע בתבנית עצמה */}
      <header className="sticky top-0 z-[100] border-b border-[#d8cdbd] bg-[#fbf7f1]/95 px-4 py-4 shadow-[0_14px_40px_rgba(42,33,25,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d8cdbd] bg-white text-[#2a2119] transition hover:-translate-x-0.5 hover:bg-[#f1e8dc]"
              aria-label="Back to templates"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-black uppercase tracking-[0.28em] text-[#9b7245]">
                Template Editor
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-2xl font-black tracking-[-0.06em] text-[#2a2119]">
                  {templateName}
                </h1>

                <span className="hidden rounded-full border border-[#d8cdbd] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#756858] md:inline-flex">
                  Same as preview
                </span>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#d8cdbd] bg-white px-4 py-3 text-xs font-black text-[#756858] lg:flex">
            <LayoutTemplate className="h-4 w-4 text-[#9b7245]" />
            עריכה על אותה תבנית בדיוק
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d8cdbd] bg-white px-5 text-sm font-black text-[#2a2119] transition hover:-translate-y-0.5 hover:bg-[#f1e8dc]"
            >
              <Eye className="h-4 w-4" />
              צפייה
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2a2119] px-5 text-sm font-black text-white shadow-[0_14px_35px_rgba(42,33,25,0.18)] transition hover:-translate-y-0.5 hover:bg-[#453528] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "שומר..." : "שמור"}
            </button>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-81px)] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* צד עריכה — זה לא משנה את עיצוב התבנית */}
        <aside className="border-l border-[#d8cdbd] bg-[#fbf7f1] p-5">
          <div className="sticky top-[105px] space-y-5">
            <div className="rounded-[22px] border border-[#d8cdbd] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#9b7245]" />
                <h2 className="text-base font-black text-[#2a2119]">
                  עריכת Velmora
                </h2>
              </div>

              <p className="text-sm font-bold leading-7 text-[#756858]">
                כרגע העריכה משתמשת באותה תבנית בדיוק כמו הצפייה. לא נבנה HTML
                חדש ולא מחליפים את העיצוב.
              </p>
            </div>

            <div className="rounded-[22px] border border-[#d8cdbd] bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-black text-[#2a2119]">
                עמודים בתבנית
              </h3>

              <div className="grid gap-2">
                {velmoraPages.map((page) => (
                  <div
                    key={page.id}
                    className="rounded-xl border border-[#e8ddd0] bg-[#fbf7f1] px-3 py-2"
                  >
                    <p className="text-sm font-black text-[#2a2119]">
                      {page.name}
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-[#9b7245]">
                      {page.slug}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#d8cdbd] bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-black text-[#2a2119]">
                בלוקים בתבנית
              </h3>

              <div className="grid gap-2">
                {velmoraSections.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-xl border border-[#e8ddd0] bg-[#fbf7f1] px-3 py-2"
                  >
                    <p className="text-sm font-black text-[#2a2119]">
                      {section.title}
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-[#9b7245]">
                      {section.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* כאן מוצגת התבנית עצמה — אותו VelmoraPages בדיוק כמו Preview */}
        <div className="overflow-auto bg-[#ede6dc] p-5">
          <div className="mx-auto overflow-hidden rounded-[28px] bg-white shadow-[0_40px_140px_rgba(42,33,25,0.20)] ring-1 ring-[#d8cdbd]">
            <VelmoraPages />
          </div>
        </div>
      </section>
    </main>
  );
}