import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Box,
  Code2,
  Eye,
  EyeOff,
  ImagePlus,
  Layers3,
  Minus,
  MousePointer2,
  Plus,
  RectangleHorizontal,
  RefreshCw,
  Rows3,
  Save,
  Trash2,
  Type,
  Video,
  X,
} from "lucide-react";

import ProfessionalMediaBrowser from "./library/ProfessionalMediaBrowser";

type PanelMode = "add" | "layers" | "code" | null;
type AddPanelTab = "elements" | "media";

type VisualAddLayersPanelProps = {
  editor: any;
  mode: PanelMode;
  onClose: () => void;
};

type LayerItem = {
  id: string;
  label: string;
  type: string;
  zIndex: number;
  hidden?: boolean;
  locked?: boolean;
  inserted?: boolean;
};

function ActionButton({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-right transition hover:border-violet-300 hover:bg-violet-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-950">
          {title}
        </span>

        <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}

function CodeField({
  label,
  value,
  onChange,
  placeholder,
  rows = 7,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>

      <textarea
        dir="ltr"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-6 text-emerald-300 outline-none focus:border-violet-400"
      />
    </label>
  );
}

export default function VisualAddLayersPanel({
  editor,
  mode,
  onClose,
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [addTab, setAddTab] = useState<AddPanelTab>("elements");
  const [mediaQuery, setMediaQuery] = useState("");

  const [codeDraft, setCodeDraft] = useState({
    enabled: true,
    css: "",
    headHtml: "",
    bodyStartHtml: "",
    bodyEndHtml: "",
    javascript: "",
  });

  const selectedElementId = String(
    editor?.selectedElement?.id || "",
  );

  const refreshLayers = () => {
    const next =
      typeof editor?.getLayerItems === "function"
        ? editor.getLayerItems()
        : [];

    setLayers(Array.isArray(next) ? next : []);
  };

  useEffect(() => {
    if (mode !== "layers") return;

    refreshLayers();

    const timer = window.setInterval(refreshLayers, 700);

    return () => {
      window.clearInterval(timer);
    };
  }, [mode, editor?.data, editor?.selectedElement?.id]);

  useEffect(() => {
    if (mode !== "code") return;

    setCodeDraft({
      enabled: editor?.customCode?.enabled !== false,
      css: String(editor?.customCode?.css || ""),
      headHtml: String(editor?.customCode?.headHtml || ""),
      bodyStartHtml: String(
        editor?.customCode?.bodyStartHtml || "",
      ),
      bodyEndHtml: String(
        editor?.customCode?.bodyEndHtml || "",
      ),
      javascript: String(
        editor?.customCode?.javascript || "",
      ),
    });
  }, [mode, editor?.customCode]);

  useEffect(() => {
    if (mode !== "add") return;

    setAddTab("elements");
    setMediaQuery("");
  }, [mode]);

  const selectedLayer = useMemo(
    () =>
      layers.find(
        (item) => item.id === selectedElementId,
      ) || null,
    [layers, selectedElementId],
  );

  if (!mode) return null;

  const closeAfter = (
    action: () => void | Promise<any>,
  ) => {
    void Promise.resolve(action()).finally(() => {
      window.setTimeout(refreshLayers, 50);
    });
  };

  const title =
    mode === "add"
      ? "הוספה"
      : mode === "layers"
        ? "שכבות"
        : "קוד מותאם";

  return (
    <aside
      data-editor-only="true"
      data-bizuply-editor-only="true"
      className="fixed bottom-4 right-4 top-[88px] z-[2147483200] flex w-[480px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
      dir="rtl"
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            {mode === "add" ? (
              <Plus className="h-5 w-5" />
            ) : mode === "layers" ? (
              <Layers3 className="h-5 w-5" />
            ) : (
              <Code2 className="h-5 w-5" />
            )}
          </span>

          <h2 className="text-base font-black text-slate-950">
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {mode === "add" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid shrink-0 grid-cols-2 gap-2 border-b border-slate-200 bg-white p-3">
            <button
              type="button"
              onClick={() => setAddTab("elements")}
              className={[
                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-black transition",
                addTab === "elements"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              <Plus className="h-4 w-4" />
              אלמנטים וסקשנים
            </button>

            <button
              type="button"
              onClick={() => setAddTab("media")}
              className={[
                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-black transition",
                addTab === "media"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              <ImagePlus className="h-4 w-4" />
              תמונות וסרטונים
            </button>
          </div>

          {addTab === "media" ? (
            <ProfessionalMediaBrowser
              editor={editor}
              query={mediaQuery}
              onQueryChange={setMediaQuery}
            />
          ) : (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-6 text-slate-500">
                כל אלמנט נוסף כשכבה עצמאית. ניתן לגרור,
                לשנות גודל, לצבוע ולהעביר קדימה או אחורה.
              </div>

              <ActionButton
                icon={<Type className="h-5 w-5" />}
                title="טקסט"
                description="כותרת או כיתוב חופשי"
                onClick={() =>
                  closeAfter(() => editor?.addText?.())
                }
              />

              <ActionButton
                icon={
                  <RectangleHorizontal className="h-5 w-5" />
                }
                title="כפתור"
                description="כפתור עצמאי עם קישור"
                onClick={() =>
                  closeAfter(() => editor?.addButton?.())
                }
              />

              <ActionButton
                icon={<ImagePlus className="h-5 w-5" />}
                title="העלאת תמונה מהמחשב"
                description="תמונה חדשה שניתנת להחלפה ללא הגבלה"
                onClick={() =>
                  closeAfter(() => editor?.addImage?.())
                }
              />

              <ActionButton
                icon={<Video className="h-5 w-5" />}
                title="העלאת סרטון מהמחשב"
                description="סרטון אוטומטי, מושתק ובלולאה"
                onClick={() =>
                  closeAfter(() => editor?.addVideo?.())
                }
              />

              <ActionButton
                icon={<Box className="h-5 w-5" />}
                title="קופסה / רקע"
                description="שכבה שניתן לשים מאחורי טקסט ומדיה"
                onClick={() =>
                  closeAfter(() => editor?.addBox?.())
                }
              />

              <ActionButton
                icon={<Minus className="h-5 w-5" />}
                title="קו מפריד"
                description="קו עצמאי לגרירה וצביעה"
                onClick={() =>
                  closeAfter(() => editor?.addDivider?.())
                }
              />

              <div className="my-4 h-px bg-slate-200" />

              <p className="text-sm font-black text-slate-800">
                סקשנים מוכנים
              </p>

              {[
                [
                  "hero",
                  "Hero",
                  "כותרת, טקסט, כפתור ותמונה",
                ],
                [
                  "text-image",
                  "טקסט ותמונה",
                  "מבנה דו־טורי מוכן",
                ],
                [
                  "cards",
                  "שלוש כרטיסיות",
                  "סקשן שירותים או יתרונות",
                ],
                [
                  "cta",
                  "קריאה לפעולה",
                  "כותרת וכפתור על רקע גרדיאנט",
                ],
                [
                  "video-text",
                  "וידאו עם כיתוב",
                  "וידאו מלא וכיתוב בשכבה מעליו",
                ],
                [
                  "blank",
                  "סקשן ריק",
                  "אזור נקי לבנייה חופשית",
                ],
              ].map(
                ([
                  preset,
                  presetTitle,
                  description,
                ]) => (
                  <ActionButton
                    key={preset}
                    icon={
                      <Rows3 className="h-5 w-5" />
                    }
                    title={presetTitle}
                    description={description}
                    onClick={() =>
                      closeAfter(() =>
                        editor?.addSection?.(
                          "after",
                          undefined,
                          preset,
                        ),
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      ) : mode === "layers" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-xs font-black text-slate-500">
              {layers.length} שכבות
            </span>

            <button
              type="button"
              onClick={refreshLayers}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              רענון
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {layers.map((item) => {
              const active =
                item.id === selectedElementId;

              return (
                <div
                  key={item.id}
                  className={[
                    "rounded-2xl border p-2",
                    active
                      ? "border-violet-400 bg-violet-50"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() =>
                      editor?.selectByElementId?.(
                        item.id,
                      )
                    }
                    className="flex w-full items-center gap-2 rounded-xl p-2 text-right"
                  >
                    <MousePointer2 className="h-4 w-4 shrink-0 text-violet-600" />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-slate-900">
                        {item.label || item.type}
                      </span>

                      <span className="block truncate text-[11px] font-bold text-slate-400">
                        {item.type} · שכבה {item.zIndex}
                      </span>
                    </span>
                  </button>

                  {active ? (
                    <div className="grid grid-cols-4 gap-1 border-t border-violet-100 pt-2">
                      <button
                        type="button"
                        title="לחזית"
                        onClick={() =>
                          editor?.bringToFront?.(
                            item.id,
                          )
                        }
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        <ArrowUpToLine className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="לרקע"
                        onClick={() =>
                          editor?.sendToBack?.(item.id)
                        }
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title={
                          item.hidden
                            ? "הצגה"
                            : "הסתרה"
                        }
                        onClick={() =>
                          editor?.toggleElementHidden?.(
                            item.id,
                          )
                        }
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        {item.hidden ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        title="מחיקה"
                        onClick={() =>
                          editor?.deleteElement?.(item.id)
                        }
                        className="flex h-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {selectedLayer ? (
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
              מסומן: {selectedLayer.label}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
            <span className="text-sm font-black text-slate-800">
              הפעלת קוד מותאם
            </span>

            <input
              type="checkbox"
              checked={codeDraft.enabled}
              onChange={(event) =>
                setCodeDraft((current) => ({
                  ...current,
                  enabled: event.target.checked,
                }))
              }
            />
          </label>

          <CodeField
            label="Custom CSS"
            value={codeDraft.css}
            onChange={(css) =>
              setCodeDraft((current) => ({
                ...current,
                css,
              }))
            }
            placeholder=".my-class { color: red; }"
          />

          <CodeField
            label="Head HTML"
            value={codeDraft.headHtml}
            onChange={(headHtml) =>
              setCodeDraft((current) => ({
                ...current,
                headHtml,
              }))
            }
            placeholder='<meta name="..." content="..." />'
            rows={5}
          />

          <CodeField
            label="HTML בתחילת ה־Body"
            value={codeDraft.bodyStartHtml}
            onChange={(bodyStartHtml) =>
              setCodeDraft((current) => ({
                ...current,
                bodyStartHtml,
              }))
            }
            placeholder="<!-- קוד שיופיע לפני האתר -->"
            rows={4}
          />

          <CodeField
            label="HTML בסוף ה־Body"
            value={codeDraft.bodyEndHtml}
            onChange={(bodyEndHtml) =>
              setCodeDraft((current) => ({
                ...current,
                bodyEndHtml,
              }))
            }
            placeholder="<!-- קוד שיופיע אחרי האתר -->"
            rows={4}
          />

          <CodeField
            label="Custom JavaScript"
            value={codeDraft.javascript}
            onChange={(javascript) =>
              setCodeDraft((current) => ({
                ...current,
                javascript,
              }))
            }
            placeholder="console.log('Bizuply custom code');"
          />

          <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-6 text-amber-800">
            CSS מתעדכן מיד בעורך. JavaScript מופעל
            בתצוגה ובאתר המפורסם, כדי שלא ישבור את
            כלי העריכה.
          </div>

          <button
            type="button"
            onClick={() => {
              editor?.updateCustomCode?.(codeDraft);
              onClose();
            }}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white"
          >
            <Save className="h-4 w-4" />
            שמירת קוד מותאם
          </button>
        </div>
      )}
    </aside>
  );
}
