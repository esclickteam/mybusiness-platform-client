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
  Loader2,
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

type PanelMode = "add" | "layers" | "code" | null;

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

type ActionButtonProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void | Promise<unknown>;
  disabled?: boolean;
};

function ActionButton({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => void onClick()}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-right transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-wait disabled:opacity-60"
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

function getActionError(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "הפעולה נכשלה";
}

export default function VisualAddLayersPanel({
  editor,
  mode,
  onClose,
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
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

    return () => window.clearInterval(timer);
  }, [mode, editor?.data, editor?.selectedElement?.id]);

  useEffect(() => {
    if (mode !== "code") return;

    setCodeDraft({
      enabled: editor?.customCode?.enabled !== false,
      css: String(editor?.customCode?.css || ""),
      headHtml: String(editor?.customCode?.headHtml || ""),
      bodyStartHtml: String(editor?.customCode?.bodyStartHtml || ""),
      bodyEndHtml: String(editor?.customCode?.bodyEndHtml || ""),
      javascript: String(editor?.customCode?.javascript || ""),
    });
  }, [mode, editor?.customCode]);

  const selectedLayer = useMemo(
    () =>
      layers.find((item) => item.id === selectedElementId) ||
      null,
    [layers, selectedElementId],
  );

  if (!mode) return null;

  const runAction = async (
    actionName: string,
    action: (() => unknown | Promise<unknown>) | undefined,
    options?: {
      requireElementId?: boolean;
      closePanel?: boolean;
    },
  ) => {
    if (busyAction) return "";

    if (typeof action !== "function") {
      setError("הפעולה הזאת לא מחוברת לעורך");
      return "";
    }

    setBusyAction(actionName);
    setError("");

    try {
      const result = await action();
      const elementId = String(result || "").trim();

      if (options?.requireElementId && !elementId) {
        throw new Error("האלמנט לא נוסף לעורך");
      }

      editor?.applyDataToDom?.();

      if (elementId) {
        window.requestAnimationFrame(() => {
          editor?.selectByElementId?.(elementId, {
            keepPreviousOnMissing: true,
          });
          editor?.refreshSelectedElement?.();
        });
      }

      window.setTimeout(refreshLayers, 80);

      if (options?.closePanel) {
        onClose();
      }

      return elementId;
    } catch (actionError) {
      console.error("[BizUply Add Layers] action failed", {
        actionName,
        error: actionError,
      });
      setError(getActionError(actionError));
      return "";
    } finally {
      setBusyAction("");
    }
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
      className="fixed bottom-4 right-4 top-[88px] z-[2147483200] flex w-[390px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
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
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {error ? (
        <div className="mx-4 mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      {mode === "add" ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-6 text-slate-500">
            כל אלמנט נוסף כשכבה עצמאית במרכז האזור הפעיל. ניתן
            לגרור ולשנות את הגודל מיד לאחר ההוספה.
          </div>

          <ActionButton
            icon={
              busyAction === "text" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Type className="h-5 w-5" />
              )
            }
            title="טקסט"
            description="כותרת או כיתוב חופשי"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction("text", editor?.addText, {
                requireElementId: true,
              })
            }
          />

          <ActionButton
            icon={
              busyAction === "button" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RectangleHorizontal className="h-5 w-5" />
              )
            }
            title="כפתור"
            description="כפתור עצמאי עם קישור"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction("button", editor?.addButton, {
                requireElementId: true,
              })
            }
          />

          <ActionButton
            icon={
              busyAction === "image" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )
            }
            title="תמונה"
            description="נפתחת בחירת קובץ והתמונה נוספת למרכז העורך"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction("image", editor?.addImage, {
                requireElementId: true,
              })
            }
          />

          <ActionButton
            icon={
              busyAction === "video" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Video className="h-5 w-5" />
              )
            }
            title="סרטון"
            description="נפתחת בחירת קובץ והסרטון נוסף למרכז העורך"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction("video", editor?.addVideo, {
                requireElementId: true,
              })
            }
          />

          <ActionButton
            icon={<Box className="h-5 w-5" />}
            title="קופסה / רקע"
            description="קופסה עצמאית לעיצוב אזור"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction("box", editor?.addBox, {
                requireElementId: true,
              })
            }
          />

          <ActionButton
            icon={<Minus className="h-5 w-5" />}
            title="קו מפריד"
            description="קו אופקי עצמאי"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction("divider", editor?.addDivider, {
                requireElementId: true,
              })
            }
          />

          <ActionButton
            icon={<Rows3 className="h-5 w-5" />}
            title="סקשן"
            description="אזור חדש אחרי הסקשן המסומן"
            disabled={Boolean(busyAction)}
            onClick={() =>
              runAction(
                "section",
                () => editor?.addSection?.("after"),
                { requireElementId: true },
              )
            }
          />
        </div>
      ) : null}

      {mode === "layers" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-black text-slate-900">
                שכבות בעמוד
              </p>
              <p className="text-xs font-bold text-slate-400">
                {layers.length} אלמנטים
              </p>
            </div>
            <button
              type="button"
              onClick={refreshLayers}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {!layers.length ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-center text-xs font-bold leading-6 text-slate-500">
                עדיין אין שכבות להצגה.
              </div>
            ) : null}

            {layers.map((item) => {
              const selected = item.id === selectedElementId;

              return (
                <article
                  key={item.id}
                  className={[
                    "rounded-2xl border p-3 transition",
                    selected
                      ? "border-violet-400 bg-violet-50"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() =>
                      editor?.selectByElementId?.(item.id, {
                        keepPreviousOnMissing: true,
                      })
                    }
                    className="flex w-full items-center gap-3 text-right"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <MousePointer2 className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-slate-900">
                        {item.label || item.type || item.id}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] font-bold text-slate-400">
                        {item.type} · z-index {item.zIndex}
                      </span>
                    </span>
                  </button>

                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      title={item.hidden ? "הצג" : "הסתר"}
                      onClick={() => {
                        editor?.toggleElementHidden?.(item.id);
                        window.setTimeout(refreshLayers, 40);
                      }}
                      className="flex h-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                    >
                      {item.hidden ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      title="הבא לקדמת הבמה"
                      onClick={() => {
                        editor?.bringToFront?.(item.id);
                        window.setTimeout(refreshLayers, 40);
                      }}
                      className="flex h-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                    >
                      <ArrowUpToLine className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="שלח לאחור"
                      onClick={() => {
                        editor?.sendToBack?.(item.id);
                        window.setTimeout(refreshLayers, 40);
                      }}
                      className="flex h-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title={item.locked ? "בטל נעילה" : "נעל"}
                      onClick={() => {
                        editor?.toggleElementLocked?.(item.id);
                        window.setTimeout(refreshLayers, 40);
                      }}
                      className={[
                        "flex h-9 items-center justify-center rounded-xl text-[10px] font-black",
                        item.locked
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      {item.locked ? "נעול" : "נעילה"}
                    </button>

                    <button
                      type="button"
                      title="מחיקה"
                      onClick={() => {
                        editor?.deleteElement?.(item.id);
                        window.setTimeout(refreshLayers, 40);
                      }}
                      className="flex h-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {selectedLayer ? (
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
              מסומן: {selectedLayer.label || selectedLayer.id}
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "code" ? (
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
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
              className="h-5 w-5 accent-violet-600"
            />
          </label>

          <CodeField
            label="CSS"
            value={codeDraft.css}
            onChange={(value) =>
              setCodeDraft((current) => ({ ...current, css: value }))
            }
            placeholder=".my-class { color: red; }"
          />

          <CodeField
            label="HTML בתוך head"
            value={codeDraft.headHtml}
            onChange={(value) =>
              setCodeDraft((current) => ({
                ...current,
                headHtml: value,
              }))
            }
            placeholder="<meta ... />"
            rows={5}
          />

          <CodeField
            label="HTML בתחילת body"
            value={codeDraft.bodyStartHtml}
            onChange={(value) =>
              setCodeDraft((current) => ({
                ...current,
                bodyStartHtml: value,
              }))
            }
            placeholder="<div>...</div>"
            rows={5}
          />

          <CodeField
            label="HTML בסוף body"
            value={codeDraft.bodyEndHtml}
            onChange={(value) =>
              setCodeDraft((current) => ({
                ...current,
                bodyEndHtml: value,
              }))
            }
            placeholder="<div>...</div>"
            rows={5}
          />

          <CodeField
            label="JavaScript"
            value={codeDraft.javascript}
            onChange={(value) =>
              setCodeDraft((current) => ({
                ...current,
                javascript: value,
              }))
            }
            placeholder="console.log('BizUply');"
          />

          <button
            type="button"
            disabled={Boolean(busyAction)}
            onClick={() =>
              void runAction(
                "save-code",
                async () => {
                  if (typeof editor?.updateCustomCode !== "function") {
                    throw new Error("שמירת קוד מותאם אינה מחוברת לעורך");
                  }

                  const result = await editor.updateCustomCode(codeDraft);
                  return result ?? true;
                },
              )
            }
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white disabled:opacity-60"
          >
            {busyAction === "save-code" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            שמירת קוד
          </button>
        </div>
      ) : null}
    </aside>
  );
}
