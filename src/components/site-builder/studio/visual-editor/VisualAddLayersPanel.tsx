import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Box,
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
  Trash2,
  Type,
  Video,
  X,
} from "lucide-react";

type VisualAddLayersPanelProps = {
  editor: any;
  mode: "add" | "layers" | null;
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

function AddAction({
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

export default function VisualAddLayersPanel({
  editor,
  mode,
  onClose,
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);

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

    const timer = window.setInterval(refreshLayers, 900);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    mode,
    editor?.data,
    editor?.selectedElement?.id,
  ]);

  const selectedLayer = useMemo(
    () =>
      layers.find(
        (item) => item.id === selectedElementId,
      ) || null,
    [layers, selectedElementId],
  );

  if (!mode) return null;

  const closeAfter = (action: () => void | Promise<any>) => {
    void Promise.resolve(action()).finally(() => {
      window.setTimeout(refreshLayers, 50);
    });
  };

  return (
    <aside
      data-editor-only="true"
      data-bizuply-editor-only="true"
      className="fixed bottom-4 right-4 top-[88px] z-[2147483200] flex w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
      dir="rtl"
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            {mode === "add" ? (
              <Plus className="h-5 w-5" />
            ) : (
              <Layers3 className="h-5 w-5" />
            )}
          </span>

          <div>
            <h2 className="text-base font-black text-slate-950">
              {mode === "add"
                ? "הוספת אלמנטים"
                : "שכבות"}
            </h2>
            <p className="text-xs font-bold text-slate-400">
              {mode === "add"
                ? "הוספה לסקשן המסומן"
                : "בחירה וסידור עומק"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {mode === "add" ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-6 text-slate-500">
            האלמנט נוסף לסקשן המסומן וניתן לגרור אותו
            חופשי, לשנות גודל ולהעביר קדימה או אחורה.
          </div>

          <AddAction
            icon={<Type className="h-5 w-5" />}
            title="טקסט"
            description="כותרת או כיתוב חופשי מעל תמונה וסרטון"
            onClick={() => closeAfter(() => editor?.addText?.())}
          />

          <AddAction
            icon={<RectangleHorizontal className="h-5 w-5" />}
            title="כפתור"
            description="כפתור עצמאי שניתן לגרירה ועריכת קישור"
            onClick={() => closeAfter(() => editor?.addButton?.())}
          />

          <AddAction
            icon={<ImagePlus className="h-5 w-5" />}
            title="תמונה"
            description="מוסיף תמונה חדשה ופותח מיד בחירת קובץ"
            onClick={() => closeAfter(() => editor?.addImage?.())}
          />

          <AddAction
            icon={<Video className="h-5 w-5" />}
            title="סרטון"
            description="מוסיף סרטון חדש עם הפעלה אוטומטית"
            onClick={() => closeAfter(() => editor?.addVideo?.())}
          />

          <AddAction
            icon={<Box className="h-5 w-5" />}
            title="קופסה / רקע"
            description="שכבת רקע שאפשר לשים מאחורי טקסט ומדיה"
            onClick={() => closeAfter(() => editor?.addBox?.())}
          />

          <AddAction
            icon={<Minus className="h-5 w-5" />}
            title="קו מפריד"
            description="קו עצמאי שאפשר להזיז, לסובב ולצבוע"
            onClick={() => closeAfter(() => editor?.addDivider?.())}
          />

          <div className="my-4 h-px bg-slate-200" />

          <AddAction
            icon={<Rows3 className="h-5 w-5" />}
            title="סקשן מעל"
            description="מוסיף אזור חדש לפני הסקשן המסומן"
            onClick={() =>
              closeAfter(() =>
                editor?.addSection?.("before"),
              )
            }
          />

          <AddAction
            icon={<Rows3 className="h-5 w-5" />}
            title="סקשן מתחת"
            description="מוסיף אזור חדש אחרי הסקשן המסומן"
            onClick={() =>
              closeAfter(() =>
                editor?.addSection?.("after"),
              )
            }
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="text-xs font-black text-slate-500">
              {layers.length} שכבות
            </div>

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
              const active = item.id === selectedElementId;

              return (
                <div
                  key={item.id}
                  className={[
                    "rounded-2xl border p-2 transition",
                    active
                      ? "border-violet-400 bg-violet-50"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => {
                      editor?.selectByElementId?.(item.id);
                      window.setTimeout(refreshLayers, 0);
                    }}
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
                        onClick={() => {
                          editor?.bringToFront?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        <ArrowUpToLine className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="לרקע"
                        onClick={() => {
                          editor?.sendToBack?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title={item.hidden ? "הצגה" : "הסתרה"}
                        onClick={() => {
                          editor?.toggleElementHidden?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
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
                        onClick={() => {
                          editor?.deleteElement?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {!layers.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-400">
                לא נמצאו שכבות בעמוד.
              </div>
            ) : null}
          </div>

          {selectedLayer ? (
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
              מסומן: {selectedLayer.label}
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
}
