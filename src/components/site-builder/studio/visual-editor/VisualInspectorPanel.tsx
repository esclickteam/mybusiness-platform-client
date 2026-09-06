import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Box,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Italic,
  Layers3,
  Link2,
  Lock,
  Move,
  PaintBucket,
  PanelTop,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  Underline,
  Unlock,
  Upload,
} from "lucide-react";

import type { StylePatch } from "../types";

type InspectorTab =
  | "content"
  | "design"
  | "layout"
  | "media"
  | "motion"
  | "advanced";

type VisualInspectorPanelProps = {
  editor: any;
};

const FONT_SIZES = [
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

const FONT_WEIGHTS = [
  { labelKey: "studio.inspectorPanel.weightRegular", value: "400" },
  { labelKey: "studio.inspectorPanel.weightMedium", value: "500" },
  { labelKey: "studio.inspectorPanel.weightSemibold", value: "600" },
  { labelKey: "studio.inspectorPanel.weightBold", value: "700" },
  { labelKey: "studio.inspectorPanel.weightBlack", value: "900" },
];

const DISPLAY_OPTIONS = [
  { labelKey: "studio.inspectorPanel.default", value: "" },
  { labelKey: "Block", value: "block" },
  { labelKey: "Inline", value: "inline" },
  { labelKey: "Inline block", value: "inline-block" },
  { labelKey: "Flex", value: "flex" },
  { labelKey: "Grid", value: "grid" },
  { labelKey: "None", value: "none" },
];

const POSITION_OPTIONS = [
  { labelKey: "studio.inspectorPanel.posStatic", value: "static" },
  { labelKey: "studio.inspectorPanel.posRelative", value: "relative" },
  { labelKey: "studio.inspectorPanel.posAbsolute", value: "absolute" },
  { labelKey: "studio.inspectorPanel.posFixed", value: "fixed" },
  { labelKey: "studio.inspectorPanel.posSticky", value: "sticky" },
];

const ANIMATIONS = [
{ labelKey: "studio.inspectorPanel.none", value: "" },
  { label: "Fade up", value: "fade-up" },
  { label: "Fade in", value: "fade-in" },
  { label: "Zoom", value: "zoom-in" },
  { label: "Slide right", value: "slide-right" },
  { label: "Slide left", value: "slide-left" },
  { label: "Blur reveal", value: "blur-reveal" },
  { label: "Float", value: "float-soft" },
  { label: "Pulse", value: "pulse-soft" },
];

const TABS: Array<{
  value: InspectorTab;
  labelKey: string;
}> = [
  { value: "content", labelKey: "studio.inspectorPanel.tabContent" },
  { value: "design", labelKey: "studio.inspectorPanel.tabDesign" },
  { value: "layout", labelKey: "studio.inspectorPanel.tabLayout" },
  { value: "media", labelKey: "studio.inspectorPanel.tabMedia" },
  { value: "motion", labelKey: "studio.inspectorPanel.tabMotion" },
  { value: "advanced", labelKey: "studio.inspectorPanel.tabAdvanced" },
];

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getNode(element: any): HTMLElement | null {
  const node =
    element?.node ||
    element?.domNode ||
    element?.element ||
    null;

  return node instanceof HTMLElement ? node : null;
}

function getElementId(element: any) {
  return String(
    element?.id ||
      element?.elementId ||
      element?.visualId ||
      "",
  ).trim();
}

function getElementType(element: any) {
  const node = getNode(element);
  const tagName = String(
    element?.tagName || node?.tagName || "",
  ).toLowerCase();

  if (
    ["img", "video", "source", "picture", "canvas"].includes(tagName) ||
    node?.getAttribute("data-bizuply-editor-media-preview") === "true" ||
    node?.getAttribute("data-visual-media-type") === "video" ||
    node?.getAttribute("data-visual-media-type") === "image"
  ) {
    return "image";
  }

  const direct = String(
    element?.type ||
      element?.elementType ||
      element?.kind ||
      "",
  )
    .trim()
    .toLowerCase();

  if (direct && direct !== "section") return direct;

  if (
    [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "strong",
      "small",
      "label",
      "em",
      "b",
      "i",
    ].includes(tagName)
  ) {
    return "text";
  }

  if (direct) return direct;

  if (["a", "button", "input", "textarea", "select"].includes(tagName)) {
    return "button";
  }

  if (
    [
      "section",
      "article",
      "header",
      "footer",
      "main",
      "nav",
      "aside",
      "form",
    ].includes(tagName)
  ) {
    return "section";
  }

  return "box";
}

function getElementTagName(element: any) {
  return String(
    element?.tagName ||
      getNode(element)?.tagName ||
      "",
  ).toLowerCase();
}

function readStyle(
  editor: any,
  element: any,
  elementId: string,
): Record<string, any> {
  return {
    ...(isPlainObject(element?.computedStyle)
      ? element.computedStyle
      : {}),
    ...(isPlainObject(editor?.styles?.[elementId])
      ? editor.styles[elementId]
      : {}),
  };
}

function readLayout(editor: any, elementId: string) {
  return isPlainObject(editor?.layout?.[elementId])
    ? editor.layout[elementId]
    : {};
}

function readContent(editor: any, elementId: string) {
  return isPlainObject(editor?.content?.[elementId])
    ? editor.content[elementId]
    : {};
}

function styleValue(style: Record<string, any>, ...keys: string[]) {
  for (const key of keys) {
    const value = style?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }

  return "";
}

function numericValue(value: unknown) {
  const clean = String(value || "").trim();

  if (!clean) return "";

  const parsed = Number.parseFloat(clean);

  return Number.isFinite(parsed) ? String(parsed) : "";
}

function normalizeColor(value: unknown, fallback: string) {
  const clean = String(value || "").trim();

  if (/^#[0-9a-f]{6}$/i.test(clean)) return clean;

  const match = clean.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
  );

  if (match) {
    return `#${match
      .slice(1, 4)
      .map((part) =>
        Math.max(0, Math.min(255, Number(part)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;
  }

  return fallback;
}

const COLOR_COMMIT_MS = 180;

function InspectorColorInput({
  value,
  fallback,
  disabled,
  onChange,
  onPreview,
}: {
  value: string;
  fallback: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onPreview?: (value: string) => void;
}) {
  const safeValue = normalizeColor(value, fallback);
  const [localValue, setLocalValue] = useState(safeValue);
  const pendingRef = useRef(safeValue);
  const commitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalValue(safeValue);
    pendingRef.current = safeValue;
  }, [safeValue]);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current != null) {
        window.clearTimeout(commitTimerRef.current);
      }
    };
  }, []);

  function flushCommit(nextValue: string) {
    if (commitTimerRef.current != null) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }

    pendingRef.current = nextValue;
    onChange(nextValue);
  }

  function handleLiveColor(nextValue: string) {
    const next = normalizeColor(nextValue, fallback);
    setLocalValue(next);
    pendingRef.current = next;
    onPreview?.(next);

    if (commitTimerRef.current != null) {
      window.clearTimeout(commitTimerRef.current);
    }

    commitTimerRef.current = window.setTimeout(() => {
      commitTimerRef.current = null;
      onChange(pendingRef.current);
    }, COLOR_COMMIT_MS);
  }

  return (
    <input
      type="color"
      value={localValue}
      disabled={disabled}
      onChange={(event) => handleLiveColor(event.currentTarget.value)}
      onBlur={() => flushCommit(pendingRef.current)}
      className="h-11 w-full rounded-2xl border border-slate-200 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

function pxOrEmpty(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "";

  if (/^-?\d+(\.\d+)?$/.test(clean)) {
    return `${clean}px`;
  }

  return clean;
}

function InspectorSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-800">
        <span className="text-violet-600">{icon}</span>
        {title}
      </div>

      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function InspectorField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-slate-600">{label}</span>

      {children}

      {hint ? (
        <span className="text-[11px] font-bold leading-5 text-slate-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function InspectorInput({
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  step,
  disabled,
  dir,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  dir?: "rtl" | "ltr";
}) {
  return (
    <input
      type={type}
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      dir={dir}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder={placeholder}
    />
  );
}

function InspectorSelect({
  value,
  onChange,
  children,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-sm font-black text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function ToggleButton({
  title,
  active,
  onClick,
  disabled,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-black transition",
        active
          ? "border-violet-600 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function VisualInspectorPanel({
  editor,
}: VisualInspectorPanelProps) {
  const { t } = useTranslation();
  const element = editor?.selectedElement || null;
  const [activeTab, setActiveTab] = useState<InspectorTab>("content");

  const elementId = getElementId(element);
  const elementType = getElementType(element);
  const tagName = getElementTagName(element);

  const style = useMemo(
    () => readStyle(editor, element, elementId),
    [editor?.styles, element, elementId],
  );

  const layout = useMemo(
    () => readLayout(editor, elementId),
    [editor?.layout, elementId],
  );

  const content = useMemo(
    () => readContent(editor, elementId),
    [editor?.content, elementId],
  );

  const locked = Boolean(editor?.locked?.[elementId]);
  const hidden = Boolean(editor?.hidden?.[elementId]);

  useEffect(() => {
    if (!element) return;

    if (elementType === "image") {
      setActiveTab("media");
      return;
    }

    if (elementType === "text" || elementType === "button") {
      setActiveTab("content");
      return;
    }

    setActiveTab("design");
  }, [elementId, elementType, element]);

  if (!element || !elementId) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-violet-600">
          <Sparkles className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-black text-slate-800">
          {t("studio.inspectorPanel.selectToEdit")}
        </h2>

        <p className="mt-3 max-w-xs text-sm font-bold leading-7 text-slate-400">
          {t("studio.inspectorPanel.selectToEditHint")}
        </p>
      </div>
    );
  }

  const applyStyle = (patch: StylePatch) => {
    if (locked) return;
    editor?.applyStyle?.(elementId, patch);
  };

  const previewStyle = (patch: StylePatch) => {
    if (locked) return;
    editor?.previewStyle?.(elementId, patch);
  };

  const applyLayout = (patch: Record<string, any>) => {
    if (locked) return;

    if (typeof editor?.applyLayout === "function") {
      editor.applyLayout(elementId, patch);
      return;
    }

    if (typeof editor?.updateLayout === "function") {
      editor.updateLayout(elementId, patch);
      return;
    }

    applyStyle(patch as StylePatch);
  };

  const updateAttributes = (patch: Record<string, any>) => {
    if (locked) return;

    if (typeof editor?.updateAttributes === "function") {
      editor.updateAttributes(elementId, patch);
      return;
    }

    if (typeof editor?.updateContent === "function") {
      editor.updateContent(elementId, patch);
    }
  };

  const detectedAnimation = element?.detectedAnimation || {};
  const currentAnimation = String(
    editor?.animations?.[elementId] ||
      detectedAnimation?.name ||
      "",
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">
              Inspector
            </p>

            <h2 className="mt-1 truncate text-xl font-black text-slate-800">
{element.label || t("studio.element")}
            </h2>

            <p className="mt-1 truncate text-xs font-bold text-slate-400">
              {elementType} · {tagName || "element"} · {elementId}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <ToggleButton
              title={locked ? t("studio.inspectorPanel.unlock") : t("studio.inspectorPanel.lock")}
              active={locked}
              onClick={() =>
                editor?.setElementLocked?.(elementId, !locked) ||
                editor?.toggleElementLocked?.(elementId)
              }
            >
              {locked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </ToggleButton>

            <ToggleButton
              title={hidden ? t("studio.inspectorPanel.show") : t("studio.inspectorPanel.hide")}
              active={hidden}
              onClick={() =>
                editor?.setElementHidden?.(elementId, !hidden) ||
                editor?.toggleElementHidden?.(elementId)
              }
            >
              {hidden ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </ToggleButton>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={[
                "h-9 shrink-0 rounded-xl px-3 text-xs font-black transition",
                activeTab === tab.value
                  ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="grid gap-4">
          {activeTab === "content" ? (
            <>
              {(elementType === "text" || elementType === "button") ? (
                <InspectorSection
                  title={t("studio.inspectorPanel.textContent")}
                  icon={<Type className="h-4 w-4" />}
                >
                  <textarea
                    value={String(content.text ?? element.text ?? "")}
                    disabled={locked}
                    onChange={(event) =>
                      editor?.updateText?.(elementId, event.target.value)
                    }
                    className="min-h-[150px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-sm font-bold leading-7 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </InspectorSection>
              ) : null}

              {(elementType === "button" || elementType === "text") ? (
                <InspectorSection
                  title={t("studio.inspectorPanel.link")}
                  icon={<Link2 className="h-4 w-4" />}
                >
                  <InspectorField label={t("studio.inspectorPanel.address")}>
                    <InspectorInput
                      value={String(content.href || element.href || element.linkValue || "")}
                      disabled={locked}
                      onChange={(href) =>
                        editor?.updateLink?.(elementId, {
                          href,
                          target: String(
                            content.target ||
                              element.target ||
                              element.linkTarget ||
                              "_self",
                          ),
                        })
                      }
                      placeholder="https:// / #section / tel:"
                      dir="ltr"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.open")}>
                    <InspectorSelect
                      value={String(
                        content.target ||
                          element.target ||
                          element.linkTarget ||
                          "_self",
                      )}
                      disabled={locked}
                      onChange={(target) =>
                        editor?.updateLink?.(elementId, {
                          href: String(
                            content.href ||
                              element.href ||
                              element.linkValue ||
                              "",
                          ),
                          target,
                        })
                      }
                    >
                      <option value="_self">{t("studio.inspectorPanel.sameWindow")}</option>
                      <option value="_blank">{t("studio.inspectorPanel.newWindow")}</option>
                    </InspectorSelect>
                  </InspectorField>
                </InspectorSection>
              ) : null}

              {elementType !== "text" &&
              elementType !== "button" &&
              elementType !== "image" ? (
                <InspectorSection
                  title={t("studio.inspectorPanel.elementInfo")}
                  icon={<Box className="h-4 w-4" />}
                >
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-500">
                    {t("studio.inspectorPanel.elementInfoText", { type: elementType })}
                  </div>
                </InspectorSection>
              ) : null}
            </>
          ) : null}

          {activeTab === "design" ? (
            <>
              <InspectorSection
                title={t("studio.inspectorPanel.typography")}
                icon={<Type className="h-4 w-4" />}
              >
                <InspectorField label={t("studio.inspectorPanel.fontSize")}>
                  <InspectorSelect
                    value={styleValue(style, "fontSize", "font-size")}
                    disabled={locked}
                    onChange={(fontSize) =>
                      applyStyle({
                        fontSize,
                        "font-size": fontSize,
                      } as StylePatch)
                    }
                  >
                    <option value="">{t("studio.inspectorPanel.default")}</option>

                    {FONT_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </InspectorSelect>
                </InspectorField>

                <InspectorField label={t("studio.inspectorPanel.weight")}>
                  <InspectorSelect
                    value={styleValue(style, "fontWeight", "font-weight")}
                    disabled={locked}
                    onChange={(fontWeight) =>
                      applyStyle({
                        fontWeight,
                        "font-weight": fontWeight,
                      } as StylePatch)
                    }
                  >
                    <option value="">{t("studio.inspectorPanel.default")}</option>

                    {FONT_WEIGHTS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {t(item.labelKey)}
                      </option>
                    ))}
                  </InspectorSelect>
                </InspectorField>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.lineHeight")}>
                    <InspectorInput
                      value={styleValue(style, "lineHeight", "line-height")}
                      disabled={locked}
                      onChange={(lineHeight) =>
                        applyStyle({
                          lineHeight,
                          "line-height": lineHeight,
                        } as StylePatch)
                      }
                      placeholder="1.4 / 40px"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.letterSpacing")}>
                    <InspectorInput
                      value={styleValue(
                        style,
                        "letterSpacing",
                        "letter-spacing",
                      )}
                      disabled={locked}
                      onChange={(letterSpacing) =>
                        applyStyle({
                          letterSpacing,
                          "letter-spacing": letterSpacing,
                        } as StylePatch)
                      }
                      placeholder="0px"
                    />
                  </InspectorField>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ToggleButton
                    title={t("studio.inspectorPanel.bold")}
                    disabled={locked}
                    active={[
                      "700",
                      "800",
                      "900",
                      "bold",
                    ].includes(
                      styleValue(style, "fontWeight", "font-weight"),
                    )}
                    onClick={() => {
                      const active = [
                        "700",
                        "800",
                        "900",
                        "bold",
                      ].includes(
                        styleValue(style, "fontWeight", "font-weight"),
                      );

                      applyStyle({
                        fontWeight: active ? "400" : "700",
                        "font-weight": active ? "400" : "700",
                      } as StylePatch);
                    }}
                  >
                    <Bold className="h-4 w-4" />
                  </ToggleButton>

                  <ToggleButton
                    title={t("studio.inspectorPanel.italic")}
                    disabled={locked}
                    active={
                      styleValue(style, "fontStyle", "font-style") ===
                      "italic"
                    }
                    onClick={() => {
                      const active =
                        styleValue(style, "fontStyle", "font-style") ===
                        "italic";

                      applyStyle({
                        fontStyle: active ? "normal" : "italic",
                        "font-style": active ? "normal" : "italic",
                      } as StylePatch);
                    }}
                  >
                    <Italic className="h-4 w-4" />
                  </ToggleButton>

                  <ToggleButton
                    title={t("studio.inspectorPanel.underline")}
                    disabled={locked}
                    active={styleValue(
                      style,
                      "textDecoration",
                      "text-decoration",
                    ).includes("underline")}
                    onClick={() => {
                      const active = styleValue(
                        style,
                        "textDecoration",
                        "text-decoration",
                      ).includes("underline");

                      applyStyle({
                        textDecoration: active ? "none" : "underline",
                        "text-decoration": active
                          ? "none"
                          : "underline",
                      } as StylePatch);
                    }}
                  >
                    <Underline className="h-4 w-4" />
                  </ToggleButton>

                  <ToggleButton
                    title={t("studio.inspectorPanel.right")}
                    disabled={locked}
                    active={
                      styleValue(style, "textAlign", "text-align") ===
                      "right"
                    }
                    onClick={() =>
                      applyStyle({
                        textAlign: "right",
                        "text-align": "right",
                      } as StylePatch)
                    }
                  >
                    <AlignRight className="h-4 w-4" />
                  </ToggleButton>

                  <ToggleButton
                    title={t("studio.inspectorPanel.center")}
                    disabled={locked}
                    active={
                      styleValue(style, "textAlign", "text-align") ===
                      "center"
                    }
                    onClick={() =>
                      applyStyle({
                        textAlign: "center",
                        "text-align": "center",
                      } as StylePatch)
                    }
                  >
                    <AlignCenter className="h-4 w-4" />
                  </ToggleButton>

                  <ToggleButton
                    title={t("studio.inspectorPanel.left")}
                    disabled={locked}
                    active={
                      styleValue(style, "textAlign", "text-align") ===
                      "left"
                    }
                    onClick={() =>
                      applyStyle({
                        textAlign: "left",
                        "text-align": "left",
                      } as StylePatch)
                    }
                  >
                    <AlignLeft className="h-4 w-4" />
                  </ToggleButton>
                </div>
              </InspectorSection>

              <InspectorSection
                title={t("studio.inspectorPanel.colorsBg")}
                icon={<PaintBucket className="h-4 w-4" />}
              >
                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.textColor")}>
                    <InspectorColorInput
                      value={normalizeColor(
                        styleValue(style, "color"),
                        "#0f172a",
                      )}
                      fallback="#0f172a"
                      disabled={locked}
                      onPreview={(color) =>
                        previewStyle({
                          color,
                          WebkitTextFillColor: color,
                          "-webkit-text-fill-color": color,
                        } as StylePatch)
                      }
                      onChange={(color) =>
                        applyStyle({
                          color,
                          WebkitTextFillColor: color,
                          "-webkit-text-fill-color": color,
                        } as StylePatch)
                      }
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.background")}>
                    <InspectorColorInput
                      value={normalizeColor(
                        styleValue(
                          style,
                          "backgroundColor",
                          "background-color",
                          "background",
                        ),
                        "#ffffff",
                      )}
                      fallback="#ffffff"
                      disabled={locked}
                      onPreview={(backgroundColor) =>
                        previewStyle({
                          backgroundColor,
                          "background-color": backgroundColor,
                        } as StylePatch)
                      }
                      onChange={(backgroundColor) =>
                        applyStyle({
                          backgroundColor,
                          "background-color": backgroundColor,
                        } as StylePatch)
                      }
                    />
                  </InspectorField>
                </div>

                <InspectorField label={t("studio.inspectorPanel.gradient")}>
                  <InspectorInput
                    value={styleValue(
                      style,
                      "backgroundImage",
                      "background-image",
                    )}
                    disabled={locked}
                    onChange={(backgroundImage) =>
                      applyStyle({
                        backgroundImage,
                        "background-image": backgroundImage,
                      } as StylePatch)
                    }
                    placeholder="linear-gradient(...)"
                    dir="ltr"
                  />
                </InspectorField>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.corners")}>
                    <InspectorInput
                      value={styleValue(
                        style,
                        "borderRadius",
                        "border-radius",
                      )}
                      disabled={locked}
                      onChange={(borderRadius) =>
                        applyStyle({
                          borderRadius,
                          "border-radius": borderRadius,
                        } as StylePatch)
                      }
                      placeholder="16px"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.opacity")}>
                    <InspectorInput
                      value={styleValue(style, "opacity")}
                      disabled={locked}
                      type="number"
                      min={0}
                      max={1}
                      step={0.05}
                      onChange={(opacity) =>
                        applyStyle({ opacity } as StylePatch)
                      }
                      placeholder="1"
                    />
                  </InspectorField>
                </div>

                <InspectorField label={t("studio.inspectorPanel.shadow")}>
                  <InspectorInput
                    value={styleValue(
                      style,
                      "boxShadow",
                      "box-shadow",
                    )}
                    disabled={locked}
                    onChange={(boxShadow) =>
                      applyStyle({
                        boxShadow,
                        "box-shadow": boxShadow,
                      } as StylePatch)
                    }
                    placeholder="0 20px 50px rgba(...)"
                    dir="ltr"
                  />
                </InspectorField>

                <InspectorField label={t("studio.inspectorPanel.border")}>
                  <InspectorInput
                    value={styleValue(style, "border")}
                    disabled={locked}
                    onChange={(border) =>
                      applyStyle({ border } as StylePatch)
                    }
                    placeholder="1px solid #e2e8f0"
                    dir="ltr"
                  />
                </InspectorField>
              </InspectorSection>
            </>
          ) : null}

          {activeTab === "layout" ? (
            <>
              <InspectorSection
                title={t("studio.inspectorPanel.size")}
                icon={<Box className="h-4 w-4" />}
              >
                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.width")}>
                    <InspectorInput
                      value={styleValue(
                        layout,
                        "width",
                      ) || styleValue(style, "width")}
                      disabled={locked}
                      onChange={(width) =>
                        applyLayout({ width: pxOrEmpty(width) })
                      }
                      placeholder="100% / 400px"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.height")}>
                    <InspectorInput
                      value={styleValue(
                        layout,
                        "height",
                      ) || styleValue(style, "height")}
                      disabled={locked}
                      onChange={(height) =>
                        applyLayout({ height: pxOrEmpty(height) })
                      }
                      placeholder="auto / 300px"
                    />
                  </InspectorField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.minWidth")}>
                    <InspectorInput
                      value={styleValue(layout, "minWidth")}
                      disabled={locked}
                      onChange={(minWidth) =>
                        applyLayout({ minWidth: pxOrEmpty(minWidth) })
                      }
                      placeholder="0px"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.minHeight")}>
                    <InspectorInput
                      value={styleValue(layout, "minHeight")}
                      disabled={locked}
                      onChange={(minHeight) =>
                        applyLayout({ minHeight: pxOrEmpty(minHeight) })
                      }
                      placeholder="0px"
                    />
                  </InspectorField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.maxWidth")}>
                    <InspectorInput
                      value={styleValue(layout, "maxWidth")}
                      disabled={locked}
                      onChange={(maxWidth) =>
                        applyLayout({ maxWidth: pxOrEmpty(maxWidth) })
                      }
                      placeholder="none"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.maxHeight")}>
                    <InspectorInput
                      value={styleValue(layout, "maxHeight")}
                      disabled={locked}
                      onChange={(maxHeight) =>
                        applyLayout({ maxHeight: pxOrEmpty(maxHeight) })
                      }
                      placeholder="none"
                    />
                  </InspectorField>
                </div>
              </InspectorSection>

              <InspectorSection
                title={t("studio.inspectorPanel.position")}
                icon={<Move className="h-4 w-4" />}
              >
                <InspectorField label="Position">
                  <InspectorSelect
                    value={
                      styleValue(layout, "position") ||
                      styleValue(style, "position") ||
                      "static"
                    }
                    disabled={locked}
                    onChange={(position) =>
                      applyLayout({ position })
                    }
                  >
                    {POSITION_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {t(item.labelKey)}
                      </option>
                    ))}
                  </InspectorSelect>
                </InspectorField>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label="X">
                    <InspectorInput
                      value={numericValue(
                        layout?.x ??
                          layout?.translateX ??
                          "",
                      )}
                      disabled={locked}
                      type="number"
                      onChange={(x) =>
                        applyLayout({ x: Number(x || 0) })
                      }
                      placeholder="0"
                    />
                  </InspectorField>

                  <InspectorField label="Y">
                    <InspectorInput
                      value={numericValue(
                        layout?.y ??
                          layout?.translateY ??
                          "",
                      )}
                      disabled={locked}
                      type="number"
                      onChange={(y) =>
                        applyLayout({ y: Number(y || 0) })
                      }
                      placeholder="0"
                    />
                  </InspectorField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label="Z-index">
                    <InspectorInput
                      value={String(
                        layout?.zIndex ??
                          styleValue(style, "zIndex", "z-index"),
                      )}
                      disabled={locked}
                      type="number"
                      onChange={(zIndex) =>
                        applyLayout({
                          zIndex: Number(zIndex || 0),
                        })
                      }
                      placeholder="0"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.rotate")}>
                    <InspectorInput
                      value={String(layout?.rotate ?? "")}
                      disabled={locked}
                      type="number"
                      onChange={(rotate) =>
                        applyLayout({
                          rotate: Number(rotate || 0),
                        })
                      }
                      placeholder="0"
                    />
                  </InspectorField>
                </div>
              </InspectorSection>

              <InspectorSection
                title={t("studio.inspectorPanel.structure")}
                icon={<Layers3 className="h-4 w-4" />}
              >
                <InspectorField label="Display">
                  <InspectorSelect
                    value={
                      styleValue(layout, "display") ||
                      styleValue(style, "display")
                    }
                    disabled={locked}
                    onChange={(display) =>
                      applyLayout({ display })
                    }
                  >
                    {DISPLAY_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {t(item.labelKey)}
                      </option>
                    ))}
                  </InspectorSelect>
                </InspectorField>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label="Gap">
                    <InspectorInput
                      value={
                        styleValue(layout, "gap") ||
                        styleValue(style, "gap")
                      }
                      disabled={locked}
                      onChange={(gap) =>
                        applyLayout({ gap: pxOrEmpty(gap) })
                      }
                      placeholder="16px"
                    />
                  </InspectorField>

                  <InspectorField label="Overflow">
                    <InspectorSelect
                      value={
                        styleValue(layout, "overflow") ||
                        styleValue(style, "overflow")
                      }
                      disabled={locked}
                      onChange={(overflow) =>
                        applyLayout({ overflow })
                      }
                    >
                      <option value="">{t("studio.inspectorPanel.default")}</option>
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                      <option value="auto">Auto</option>
                      <option value="scroll">Scroll</option>
                    </InspectorSelect>
                  </InspectorField>
                </div>

                <InspectorField label="Padding">
                  <InspectorInput
                    value={styleValue(style, "padding")}
                    disabled={locked}
                    onChange={(padding) =>
                      applyStyle({ padding } as StylePatch)
                    }
                    placeholder="24px / 16px 24px"
                  />
                </InspectorField>

                <InspectorField label="Margin">
                  <InspectorInput
                    value={styleValue(style, "margin")}
                    disabled={locked}
                    onChange={(margin) =>
                      applyStyle({ margin } as StylePatch)
                    }
                    placeholder="0 / 24px auto"
                  />
                </InspectorField>
              </InspectorSection>
            </>
          ) : null}

          {activeTab === "media" ? (
            <>
              {elementType === "image" ? (
                <InspectorSection
                  title={t("studio.inspectorPanel.imageVideo")}
                  icon={<ImageIcon className="h-4 w-4" />}
                >
                  <InspectorField label={t("studio.inspectorPanel.mediaUrl")}>
                    <InspectorInput
                      value={String(
                        content.secureUrl ||
                          content.secure_url ||
                          content.url ||
                          content.src ||
                          element.src ||
                          "",
                      )}
                      disabled={locked}
                      onChange={(src) =>
                        editor?.updateImage?.(elementId, {
                          src,
                          url: src,
                          secureUrl: src,
                        })
                      }
                      placeholder={t("studio.inspectorPanel.mediaUrlPh")}
                      dir="ltr"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.alt")}>
                    <InspectorInput
                      value={String(
                        content.alt || element.alt || "",
                      )}
                      disabled={locked}
                      onChange={(alt) =>
                        editor?.updateImage?.(elementId, { alt })
                      }
                      placeholder={t("studio.inspectorPanel.altPh")}
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.fit")}>
                    <InspectorSelect
                      value={styleValue(
                        style,
                        "objectFit",
                        "object-fit",
                      )}
                      disabled={locked}
                      onChange={(objectFit) =>
                        applyStyle({
                          objectFit,
                          "object-fit": objectFit,
                        } as StylePatch)
                      }
                    >
                      <option value="">{t("studio.inspectorPanel.default")}</option>
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                      <option value="none">None</option>
                    </InspectorSelect>
                  </InspectorField>

                  <button
                    type="button"
                    disabled={
                      locked || Boolean(editor?.isUploadingMedia)
                    }
                    onClick={() =>
                      editor?.openMediaPicker?.(elementId)
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-4 text-sm font-black text-black transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {editor?.isUploadingMedia
                      ? t("studio.inspectorPanel.uploading")
                      : t("studio.inspectorPanel.uploadReplace")}
                  </button>
                </InspectorSection>
              ) : (
                <InspectorSection
                  title={t("studio.inspectorPanel.mediaBg")}
                  icon={<PanelTop className="h-4 w-4" />}
                >
                  <InspectorField label={t("studio.inspectorPanel.bgImage")}>
                    <InspectorInput
                      value={styleValue(
                        style,
                        "backgroundImage",
                        "background-image",
                      )}
                      disabled={locked}
                      onChange={(backgroundImage) =>
                        applyStyle({
                          backgroundImage,
                          "background-image": backgroundImage,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        } as StylePatch)
                      }
                      placeholder='url("https://...")'
                      dir="ltr"
                    />
                  </InspectorField>

                  <button
                    type="button"
                    disabled={locked}
                    onClick={() =>
                      editor?.openBackgroundMediaPicker?.(elementId)
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {t("studio.inspectorPanel.uploadBg")}
                  </button>
                </InspectorSection>
              )}

              {String(
                content.mediaType ||
                  content.resourceType ||
                  element.mediaType ||
                  "",
              ) === "video" ? (
                <InspectorSection
                  title={t("studio.inspectorPanel.videoOptions")}
                  icon={<ImageIcon className="h-4 w-4" />}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["autoplay", t("studio.inspectorPanel.autoplay")],
                      ["muted", t("studio.inspectorPanel.muted")],
                      ["loop", t("studio.inspectorPanel.loop")],
                      ["controls", t("studio.inspectorPanel.controls")],
                    ].map(([key, label]) => {
                      const active = Boolean(content?.[key]);

                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={locked}
                          onClick={() =>
                            editor?.updateContent?.(elementId, {
                              [key]: !active,
                            })
                          }
                          className={[
                            "h-11 rounded-2xl border text-sm font-black transition",
                            active
                              ? "border-violet-600 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                            locked
                              ? "cursor-not-allowed opacity-50"
                              : "",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </InspectorSection>
              ) : null}
            </>
          ) : null}

          {activeTab === "motion" ? (
            <>
              <InspectorSection
                title={t("studio.inspectorPanel.animation")}
                icon={<Sparkles className="h-4 w-4" />}
              >
                <InspectorField
                  label={t("studio.inspectorPanel.currentAnimation")}
                  hint={
                    detectedAnimation?.name
                      ? t("studio.inspectorPanel.detectedFromTemplate", { name: detectedAnimation.name })
                      : undefined
                  }
                >
                  <InspectorSelect
                    value={currentAnimation}
                    disabled={locked}
                    onChange={(value) => {
                      if (value) {
                        editor?.setAnimation?.(elementId, value);
                      } else {
                        editor?.clearAnimation?.(elementId);
                      }
                    }}
                  >
                    {ANIMATIONS.map((animation) => (
                      <option
                        key={animation.value}
                        value={animation.value}
                      >
                        {"labelKey" in animation
                          ? t(animation.labelKey)
                          : animation.label}
                      </option>
                    ))}
                  </InspectorSelect>
                </InspectorField>

                <div className="grid grid-cols-2 gap-3">
                  <InspectorField label={t("studio.inspectorPanel.duration")}>
                    <InspectorInput
                      value={String(
                        content.animationDuration ||
                          detectedAnimation?.duration ||
                          "",
                      )}
                      disabled={locked}
                      onChange={(animationDuration) =>
                        editor?.updateContent?.(elementId, {
                          animationDuration,
                        })
                      }
                      placeholder="0.8s"
                    />
                  </InspectorField>

                  <InspectorField label={t("studio.inspectorPanel.delay")}>
                    <InspectorInput
                      value={String(
                        content.animationDelay ||
                          detectedAnimation?.delay ||
                          "",
                      )}
                      disabled={locked}
                      onChange={(animationDelay) =>
                        editor?.updateContent?.(elementId, {
                          animationDelay,
                        })
                      }
                      placeholder="0s"
                    />
                  </InspectorField>
                </div>

                <InspectorField label="Easing">
                  <InspectorInput
                    value={String(
                      content.animationTimingFunction ||
                        detectedAnimation?.timingFunction ||
                        "",
                    )}
                    disabled={locked}
                    onChange={(animationTimingFunction) =>
                      editor?.updateContent?.(elementId, {
                        animationTimingFunction,
                      })
                    }
                    placeholder="ease / cubic-bezier(...)"
                    dir="ltr"
                  />
                </InspectorField>

                <button
                  type="button"
                  disabled={locked}
                  onClick={() =>
                    editor?.previewAnimation?.(elementId)
                  }
                  className="h-11 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("studio.inspectorPanel.preview")}
                </button>
              </InspectorSection>

              <InspectorSection
                title="Transition"
                icon={<Sparkles className="h-4 w-4" />}
              >
                <InspectorField label="Property">
                  <InspectorInput
                    value={String(
                      detectedAnimation?.transitionProperty || "",
                    )}
                    disabled={locked}
                    onChange={(transitionProperty) =>
                      applyStyle({
                        transitionProperty,
                        "transition-property": transitionProperty,
                      } as StylePatch)
                    }
                    placeholder="all"
                  />
                </InspectorField>

                <InspectorField label="Duration">
                  <InspectorInput
                    value={String(
                      detectedAnimation?.transitionDuration || "",
                    )}
                    disabled={locked}
                    onChange={(transitionDuration) =>
                      applyStyle({
                        transitionDuration,
                        "transition-duration": transitionDuration,
                      } as StylePatch)
                    }
                    placeholder="0.3s"
                  />
                </InspectorField>
              </InspectorSection>
            </>
          ) : null}

          {activeTab === "advanced" ? (
            <>
              <InspectorSection
                title={t("studio.inspectorPanel.attributes")}
                icon={<Layers3 className="h-4 w-4" />}
              >
                <InspectorField label={t("studio.inspectorPanel.visualId")}>
                  <InspectorInput
                    value={elementId}
                    onChange={() => undefined}
                    disabled
                    dir="ltr"
                  />
                </InspectorField>

                <InspectorField label="HTML ID">
                  <InspectorInput
                    value={String(
                      getNode(element)?.getAttribute("id") || "",
                    )}
                    disabled={locked}
                    onChange={(id) =>
                      updateAttributes({ id })
                    }
                    dir="ltr"
                  />
                </InspectorField>

                <InspectorField label="Class">
                  <InspectorInput
                    value={String(
                      getNode(element)?.getAttribute("class") || "",
                    )}
                    disabled={locked}
                    onChange={(className) =>
                      updateAttributes({
                        class: className,
                        className,
                      })
                    }
                    dir="ltr"
                  />
                </InspectorField>

                <InspectorField label="Aria label">
                  <InspectorInput
                    value={String(
                      getNode(element)?.getAttribute("aria-label") || "",
                    )}
                    disabled={locked}
                    onChange={(ariaLabel) =>
                      updateAttributes({
                        "aria-label": ariaLabel,
                      })
                    }
                  />
                </InspectorField>
              </InspectorSection>

              <InspectorSection
                title={t("studio.inspectorPanel.actions")}
                icon={<Layers3 className="h-4 w-4" />}
              >
                <button
                  type="button"
                  onClick={() => editor?.selectParent?.()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <Layers3 className="h-4 w-4" />
                  {t("studio.inspectorPanel.selectParent")}
                </button>

                <button
                  type="button"
                  disabled={locked}
                  onClick={() =>
                    editor?.duplicateElement?.(elementId)
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy className="h-4 w-4" />
                  {t("studio.inspectorPanel.duplicate")}
                </button>
              </InspectorSection>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-white p-4">
        <button
          type="button"
          disabled={locked}
          onClick={() => editor?.resetStyle?.(elementId)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          {t("studio.inspectorPanel.reset")}
        </button>

        <button
          type="button"
          disabled={locked}
          onClick={() =>
            editor?.deleteElement?.(elementId) ||
            editor?.deleteSelected?.()
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-black text-black transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {t("studio.inspectorPanel.delete")}
        </button>
      </div>
    </div>
  );
}
