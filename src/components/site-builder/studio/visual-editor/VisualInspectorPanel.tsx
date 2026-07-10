import React from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  PaintBucket,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Underline,
} from "lucide-react";

import type { StylePatch } from "../types";
import type { VisualEditorController } from "./visualEditorTypes";

type VisualInspectorPanelProps = {
  editor: VisualEditorController;
};

const fontSizes = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "40px",
  "48px",
  "56px",
  "64px",
  "72px",
  "88px",
  "96px",
];

const animations = [
  { label: "ללא", value: "" },
  { label: "Fade up", value: "fade-up" },
  { label: "Zoom", value: "zoom-in" },
  { label: "Slide right", value: "slide-right" },
  { label: "Slide left", value: "slide-left" },
  { label: "Blur reveal", value: "blur-reveal" },
  { label: "Float", value: "float-soft" },
  { label: "Pulse", value: "pulse-soft" },
];

function getStyleValue(style: StylePatch | undefined, key: string) {
  return String((style as Record<string, any> | undefined)?.[key] || "");
}

function InspectorButton({
  title,
  active,
  danger,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black transition",
        active
          ? "border-violet-200 bg-violet-600 text-white"
          : danger
            ? "border-rose-100 bg-white text-rose-600 hover:bg-rose-50"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function InspectorField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export default function VisualInspectorPanel({
  editor,
}: VisualInspectorPanelProps) {
  const element = editor.selectedElement;

  if (!element) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-violet-600">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-black text-slate-950">בחרי אלמנט לעריכה</h2>
        <p className="mt-3 max-w-xs text-sm font-bold leading-7 text-slate-400">
          לחצי על טקסט, תמונה, כפתור או סקשן בתוך האתר כדי לפתוח אפשרויות עריכה
        </p>
      </div>
    );
  }

  const style = editor.styles[element.id] || {};
  const content = editor.content[element.id] || {};

  const applyStyle = (patch: StylePatch) => {
    editor.applyStyle(element.id, patch);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">
          Inspector
        </p>
        <h2 className="mt-1 truncate text-xl font-black text-slate-950">
          {element.label || "אלמנט"}
        </h2>
        <p className="mt-1 text-xs font-bold text-slate-400">
          {element.type} · {element.id}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {(element.type === "text" || element.type === "button") ? (
          <section className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-700">
              <Type className="h-4 w-4" />
              תוכן
            </div>

            <textarea
              value={String(content.text ?? element.text ?? "")}
              onChange={(event) =>
                editor.updateText(element.id, event.target.value)
              }
              className="min-h-[120px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-sm font-bold leading-7 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </section>
        ) : null}

        {element.type === "image" ? (
          <section className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-700">
              <ImageIcon className="h-4 w-4" />
              תמונה / וידאו
            </div>

            <div className="grid gap-3">
              <input
                value={String(content.src || element.src || "")}
                onChange={(event) =>
                  editor.updateImage(element.id, {
                    src: event.target.value,
                  })
                }
                placeholder="URL של תמונה או וידאו"
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />

              <input
                value={String(content.alt || element.alt || "")}
                onChange={(event) =>
                  editor.updateImage(element.id, {
                    alt: event.target.value,
                  })
                }
                placeholder="Alt / תיאור"
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />

              <button
                type="button"
                onClick={() => editor.openMediaPicker?.(element.id)}
                className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
              >
                העלאה / החלפה
              </button>
            </div>
          </section>
        ) : null}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-700">
            <PaintBucket className="h-4 w-4" />
            עיצוב
          </div>

          <div className="grid gap-4">
            <InspectorField label="גודל טקסט">
              <select
                value={getStyleValue(style, "fontSize")}
                onChange={(event) => applyStyle({ fontSize: event.target.value })}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none"
              >
                <option value="">ברירת מחדל</option>
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </InspectorField>

            <div className="grid grid-cols-2 gap-3">
              <InspectorField label="צבע טקסט">
                <input
                  type="color"
                  value={getStyleValue(style, "color") || "#0f172a"}
                  onChange={(event) => applyStyle({ color: event.target.value })}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white p-1"
                />
              </InspectorField>

              <InspectorField label="רקע">
                <input
                  type="color"
                  value={getStyleValue(style, "backgroundColor") || "#ffffff"}
                  onChange={(event) =>
                    applyStyle({ backgroundColor: event.target.value })
                  }
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white p-1"
                />
              </InspectorField>
            </div>

            <div className="flex flex-wrap gap-2">
              <InspectorButton
                title="Bold"
                active={getStyleValue(style, "fontWeight") === "700"}
                onClick={() =>
                  applyStyle({
                    fontWeight:
                      getStyleValue(style, "fontWeight") === "700" ? "" : "700",
                  })
                }
              >
                <Bold className="h-4 w-4" />
              </InspectorButton>

              <InspectorButton
                title="Italic"
                active={getStyleValue(style, "fontStyle") === "italic"}
                onClick={() =>
                  applyStyle({
                    fontStyle:
                      getStyleValue(style, "fontStyle") === "italic"
                        ? ""
                        : "italic",
                  })
                }
              >
                <Italic className="h-4 w-4" />
              </InspectorButton>

              <InspectorButton
                title="Underline"
                active={getStyleValue(style, "textDecoration") === "underline"}
                onClick={() =>
                  applyStyle({
                    textDecoration:
                      getStyleValue(style, "textDecoration") === "underline"
                        ? ""
                        : "underline",
                  })
                }
              >
                <Underline className="h-4 w-4" />
              </InspectorButton>

              <InspectorButton
                title="ימין"
                active={getStyleValue(style, "textAlign") === "right"}
                onClick={() => applyStyle({ textAlign: "right" })}
              >
                <AlignRight className="h-4 w-4" />
              </InspectorButton>

              <InspectorButton
                title="מרכז"
                active={getStyleValue(style, "textAlign") === "center"}
                onClick={() => applyStyle({ textAlign: "center" })}
              >
                <AlignCenter className="h-4 w-4" />
              </InspectorButton>

              <InspectorButton
                title="שמאל"
                active={getStyleValue(style, "textAlign") === "left"}
                onClick={() => applyStyle({ textAlign: "left" })}
              >
                <AlignLeft className="h-4 w-4" />
              </InspectorButton>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-700">
            <Link2 className="h-4 w-4" />
            קישור
          </div>

          <div className="grid gap-3">
            <input
              value={String(content.href || element.linkValue || "")}
              onChange={(event) =>
                editor.updateLink(element.id, {
                  href: event.target.value,
                })
              }
              placeholder="https:// / #section / tel:"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />

            <select
              value={String(content.target || element.linkTarget || "_self")}
              onChange={(event) =>
                editor.updateLink(element.id, {
                  target: event.target.value as "_self" | "_blank",
                })
              }
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none"
            >
              <option value="_self">באותו חלון</option>
              <option value="_blank">חלון חדש</option>
            </select>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-700">
            <Sparkles className="h-4 w-4" />
            אנימציה
          </div>

          <select
            value={String(editor.animations[element.id] || "")}
            onChange={(event) => {
              if (event.target.value) {
                editor.setAnimation(element.id, event.target.value);
              } else {
                editor.clearAnimation(element.id);
              }
            }}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none"
          >
            {animations.map((animation) => (
              <option key={animation.value} value={animation.value}>
                {animation.label}
              </option>
            ))}
          </select>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-5">
        <button
          type="button"
          onClick={() => editor.resetStyle(element.id)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          איפוס
        </button>

        <button
          type="button"
          onClick={editor.deleteSelected}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-black text-white hover:bg-rose-700"
        >
          <Trash2 className="h-4 w-4" />
          מחיקה
        </button>
      </div>
    </div>
  );
}
