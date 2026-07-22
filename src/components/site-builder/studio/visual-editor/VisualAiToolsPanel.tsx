import React, { useState } from "react";
import {
  Sparkles,
  AlignLeft,
  Minimize2,
  Maximize2,
  Languages,
  Palette,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";
import API from "../../../../api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";

type Props = {
  selectedText?: string;
  selectedElementId?: string | null;
  selectedSectionLibraryId?: string | null;
  businessName?: string;
  niche?: string;
  tone?: string;
  palette?: Record<string, string>;
  onApplyText?: (next: string) => void;
  onApplySectionContent?: (payload: {
    libraryId: string;
    content: Record<string, string>;
  }) => void;
  onApplySitePatch?: (patch: Record<string, any>) => void;
};

export default function VisualAiToolsPanel({
  selectedText = "",
  selectedElementId,
  selectedSectionLibraryId,
  businessName,
  niche,
  tone,
  palette,
  onApplyText,
  onApplySectionContent,
  onApplySitePatch,
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function runTextAction(action: string, targetLanguage?: string) {
    if (!selectedText?.trim()) {
      setError("נא לבחור אלמנט טקסט בעורך");
      return;
    }

    try {
      setBusy(action);
      setError("");
      const { data } = await API.post("/site-builder/ai/rewrite-text", {
        text: selectedText,
        action,
        tone,
        targetLanguage,
      });
      if (data?.text) {
        onApplyText?.(String(data.text));
      }
    } catch (err: any) {
      setError(err?.message || "פעולת AI על הטקסט נכשלה");
    } finally {
      setBusy("");
    }
  }

  async function runSectionVariation() {
    if (!selectedSectionLibraryId) {
      setError("נא לבחור סקשן מהספרייה (או סקשן עם libraryId)");
      return;
    }

    try {
      setBusy("section");
      setError("");
      const { data } = await API.post("/site-builder/ai/section-plan", {
        libraryId: selectedSectionLibraryId,
        action: "variation",
        businessName,
        niche,
        tone,
        palette,
      });
      if (data?.content) {
        onApplySectionContent?.({
          libraryId: data.libraryId || selectedSectionLibraryId,
          content: data.content,
        });
      }
    } catch (err: any) {
      setError(err?.message || "וריאציית סקשן נכשלה");
    } finally {
      setBusy("");
    }
  }

  async function runSiteImprove(action: string) {
    try {
      setBusy(action);
      setError("");
      const { data } = await API.post("/site-builder/ai/site-improve", {
        action,
        siteName: businessName,
        niche,
        tone,
        palette,
      });
      if (data?.patch) {
        onApplySitePatch?.(data.patch);
      }
    } catch (err: any) {
      setError(err?.message || "שיפור האתר נכשל");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[60]" dir="rtl">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-600/30 hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-100"
        >
          <Sparkles className="h-4 w-4" />
          AI בעורך
        </button>
      ) : (
        <div className="pointer-events-auto w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-violet-600" />
              כלי AI
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 p-3">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-slate-500">
                טקסט נבחר {selectedElementId ? `(${selectedElementId})` : ""}
              </p>
              <div className="mb-2 max-h-16 overflow-auto rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
                {selectedText?.trim() || "לא נבחר טקסט"}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <ToolBtn
                  icon={RefreshCw}
                  label="כתיבה מחדש"
                  busy={busy === "rewrite"}
                  onClick={() => runTextAction("rewrite")}
                />
                <ToolBtn
                  icon={Minimize2}
                  label="קיצור"
                  busy={busy === "shorten"}
                  onClick={() => runTextAction("shorten")}
                />
                <ToolBtn
                  icon={Maximize2}
                  label="הרחבה"
                  busy={busy === "expand"}
                  onClick={() => runTextAction("expand")}
                />
                <ToolBtn
                  icon={Languages}
                  label="תרגום EN"
                  busy={busy === "translate"}
                  onClick={() => runTextAction("translate", "en")}
                />
                <ToolBtn
                  icon={AlignLeft}
                  label="שינוי סגנון"
                  busy={busy === "style"}
                  onClick={() => runTextAction("style")}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="mb-1.5 text-[11px] font-semibold text-slate-500">
                סקשן
              </p>
              <ToolBtn
                icon={RefreshCw}
                label="וריאציה לסקשן"
                busy={busy === "section"}
                onClick={runSectionVariation}
                full
              />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="mb-1.5 text-[11px] font-semibold text-slate-500">
                האתר כולו
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <ToolBtn
                  icon={AlignLeft}
                  label="שיפור SEO"
                  busy={busy === "seo"}
                  onClick={() => runSiteImprove("seo")}
                />
                <ToolBtn
                  icon={Palette}
                  label="מיתוג/צבעים"
                  busy={busy === "brand"}
                  onClick={() => runSiteImprove("brand")}
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-lg bg-rose-50 px-2 py-1.5 text-[11px] text-rose-700">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  busy,
  full,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  busy?: boolean;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={Boolean(busy)}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 ${
        full ? "w-full" : ""
      }`}
    >
      {busy ? (
        <BizuplyLoader size="xs" compact />
      ) : (
        <Icon className="h-3.5 w-3.5" />
      )}
      {label}
    </button>
  );
}